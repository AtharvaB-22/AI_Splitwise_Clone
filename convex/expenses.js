import { v } from "convex/values";
import { query } from "./_generated/server";


export const getExpensesBetweenUsers = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const me = await ctx.runQuery(internal.users.getCurrentUser);
    if (me._id === userId) throw new Error("Cannot query yourself");

    /* ____ 1. One-on-one expenses where either user is the payer ____ */
    const myPaid = await ctx.db
      .query("expenses")
      .withIndex("by_user_and_group", (q) =>
        q.eq("paidByUserId", me._id).eq("groupId", undefined)
      )
      .collect();

      const theirPaid = await ctx.db
      .query("expenses")
      .withIndex("by_user_and_group", (q) =>
        q.eq("paidByUserId", userId).eq("groupId", undefined)
      )
      .collect();

      const candidateExpenses = [...myPaid, ...theirPaid];

      /* ____ 2. Keep only rows where BOTH are involved (payer or split) ____ */
        const expenses = candidateExpenses.filter((e) => {
        // me is always involved (I'm the payer OR in splits - verified below)
        const meInSplits = e.splits.some((s) => s.userId === me._id);
        const themInSplits = e.splits.some((s) => s.userId === userId);

        const meInvolved = e.paidByUserId === me._id || meInSplits;
        const themInvolved = e.paidByUserId === userId || themInSplits;

        return meInvolved && themInvolved;
        });

        expenses.sort((a, b) => b.date - a.date);

        // 3. Settlements between the two of us (GroupId = undefined)
        const settlements = await ctx.db
        .query("settlements")
        .filter((q) =>
            q.and(
            q.eq(q.field("groupId"), undefined),
            q.or(
                q.and(
                q.eq(q.field("paidByUserId"), me._id),
                q.eq(q.field("receivedByUserId"), userId)
                ),
                q.and(
                q.eq(q.field("paidByUserId"), userId),
                q.eq(q.field("receivedByUserId"), me._id)
                )
            )
          )
        )
        .collect();

        settlements.sort((a, b) => b.date - a.date); 

        // Step 4. Compute Running Balance 
        let balance = 0;

        for await (const e of expenses) {
        if (e.paidByUserId === me._id) {
            const split = e.splits.find((s) => s.userId === userId && !s.paid);
            if (split) balance += split.amount; // they owe me
        } else {
            const split = e.splits.find((s) => s.userId === me._id && !s.paid);
            if (split) balance -= split.amount; // I owe them
        }
        }

        for (const s of settlements) {
        if (s.paidByUserId === me._id) {
            balance += s.amount; // they paid me back
        } else {
            balance -= s.amount; // I paid them back
        }
        }

        /* ____ 5. Return payload ____ */
        const other = await ctx.db.get(userId);
        if (!other) throw new Error("User not found");

        return {
        expenses,
        settlements,
        otherUser: {
            _id: other._id,
            name: other.name,
            email: other.email,
            imageUrl: other.imageUrl,
        },
        balance,
        };
  },
});