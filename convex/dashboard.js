import { internal } from "./_generated/api";
import { query } from "./_generated/server";

// Get user balances
export const getUserBalances = query({
  handler: async (ctx) => {
    // Use the existing getCurrentUser function instead of repeating auth logic
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    /* ───────────── 1‑to‑1 expenses (no groupId) ───────────── */
    const expenses = (await ctx.db.query("expenses").collect()).filter(
      (e) =>
        !e.groupId && // 1‑to‑1 only
        (e.paidByUserId === user._id ||
          e.splits.some((s) => s.userId === user._id))
    );

    /* tallies */
    let youOwe = 0;
    let youAreOwed = 0;
    const balanceByUser = {};

    for (const e of expenses) {
      const isPayer = e.paidByUserId === user._id;
      const mySplit = e.splits.find((s) => s.userId === user._id);

      if (isPayer) {
        for (const s of e.splits) {
          if (s.userId === user._id || s.paid) continue;
          youAreOwed += s.amount;
          (balanceByUser[s.userId] ??= { owed: 0, owing: 0 }).owed += s.amount;
        }
      } else if (mySplit && !mySplit.paid) {
        youOwe += mySplit.amount;
        (balanceByUser[e.paidByUserId] ??= { owed: 0, owing: 0 }).owing +=
          mySplit.amount;
      }
    }

    /* ───────────── 1‑to‑1 settlements (no groupId) ───────────── */
    const settlements = (await ctx.db.query("settlements").collect()).filter(
      (s) =>
        !s.groupId &&
        (s.paidByUserId === user._id || s.receivedByUserId === user._id)
    );

    for (const s of settlements) {
      if (s.paidByUserId === user._id) {
        youOwe -= s.amount;
        (balanceByUser[s.receivedByUserId] ??= { owed: 0, owing: 0 }).owing -=
          s.amount;
      } else {
        youAreOwed -= s.amount;
        (balanceByUser[s.paidByUserId] ??= { owed: 0, owing: 0 }).owed -=
          s.amount;
      }
    }

    /* build lists for UI */
    const youOweList = [];
    const youAreOwedByList = [];
    for (const [uid, { owed, owing }] of Object.entries(balanceByUser)) {
      const net = owed - owing;
      if (net === 0) continue;
      const counterpart = await ctx.db.get(uid);
      const base = {
        userId: uid,
        name: counterpart?.name ?? "Unknown",
        imageUrl: counterpart?.imageUrl,
        amount: Math.abs(net),
      };
      net > 0 ? youAreOwedByList.push(base) : youOweList.push(base);
    }

    youOweList.sort((a, b) => b.amount - a.amount);
    youAreOwedByList.sort((a, b) => b.amount - a.amount);

    return {
      youOwe,
      youAreOwed,
      totalBalance: youAreOwed - youOwe,
      oweDetails: { youOwe: youOweList, youAreOwedBy: youAreOwedByList },
    };
  },
});

export const getTotalSpent = query({
    handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1).getTime();
    const expenses = await ctx.db
    .query("expenses")
    .withIndex("by_date")
    .filter(expense => expense.date >= startOfYear)
    .collect();
    // Filter expenses to only include those where the user is involved
    const userExpenses = expenses.filter(
    (expense) =>
    expense.paidByUserId === user._id ||
    expense.splits.some((split) => split.userId === user._id)
    );

    let totalSpent = 0;

    userExpenses.forEach((expense) => {
    const userSplit = expense.splits.find(
        (split) => split.userId === user._id  // Changed user_id to user._id
    );
    if (userSplit) {
        totalSpent += userSplit.amount;
    }
    });

    return totalSpent;
    },
});

export const getMonthlySpending = query({
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    // Get current year and its start timestamp
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1).getTime();

    // Get all expenses for current year
    const allExpenses = await ctx.db
      .query("expenses")
      .withIndex("by_date", (q) => q.gte("date", startOfYear))
      .collect();

    const userExpenses = allExpenses.filter(
    (expense) =>
        expense.paidByUserId === user._id ||
        expense.splits.some((split) => split.userId === user._id)
    );

    const monthlyTotals = {};

    for (let i = 0; i < 12; i++) {
    const monthDate = new Date(currentYear, i, 1);
    monthlyTotals[monthDate.getTime()] = 0;
    }

    userExpenses.forEach((expense) => {
    // Rest of your forEach logic here...
    const date= new Date(expense.date);

    const monthStart = new Date(
        date.getFullYear(), date.getMonth(), 1).getTime();
        const userSplit = expense.splits.find(
            (split) => split.userId === user._id // Changed user_id to user._id
        );
        if (userSplit) {
            monthlyTotals[monthStart] = (monthlyTotals[monthStart] || 0) + userSplit.amount;
        }
    });

     const result = Object.entries(monthlyTotals).map(([month, total]) => ({
      month: Number(month), // timestamp in ms
      total,
  }));
    // Convert timestamps to month numbers (0-11)
    result.forEach((item) => {
      item.month = new Date(item.month).getMonth();
    });

    result.sort((a, b) => a.month - b.month); // Sort by month
    return result;
},
});

export const getUserGroups = query({
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1).getTime();

    // Get all groups from the database
    const allGroups = await ctx.db.query("groups").collect();

    // Filter to only include groups where the user is a member
    const groups = allGroups.filter((group) =>
      group.members.some((member) => member.userId === user._id)
    );

    const enhancedGroups = await Promise.all(
      groups.map(async (group) => {
        
        // const expenses = await ctx.db
        //   .query("expenses")
        //   .withIndex("by_group",(q) => q.eq(q.field("groupId"), group._id))
        //   .collect();

        const expenses = await ctx.db
        .query("expenses")
        .withIndex("by_date")
        .filter(expense => expense.date >= startOfYear)
        .collect();

          let balance = 0;
          expenses.forEach((expense) => {
            if(expense.paidByUserId === user._id) {
              expense.splits.forEach((split) => {
                if(split.userId !== user._id && !split.paid) {
                  balance += split.amount;
                }
              });
            } else{
                const userSplit = expense.splits.find(
                    (split) => split.userId === user._id
                );
                if (userSplit && !userSplit.paid) {
                    balance -= userSplit.amount;
                }
            }
          });

          // const settlements = await ctx.db
          //   .query("settlements")
          //   .filter((q) =>
          //       q.and(
          //       q.eq(q.field("groupId"), group._id),
          //       q.or(
          //           q.eq(q.field("paidByUserId"), user._id),
          //           q.eq(q.field("receivedByUserId"), user._id)
          //       )
          //       )
          //   )
          //   .collect();

          const settlements = await ctx.db
          .query("settlements")
          .filter(
            (settlement) =>
              settlement.groupId === group._id &&
              (settlement.paidByUserId === user._id ||
                settlement.receivedByUserId === user._id)
          )
          .collect();

            settlements.forEach((settlement) => {
              // Process each settlement
              if (settlement.paidByUserId === user._id) {
                // User paid someone else -> reduces what user owes
                balance += settlement.amount;
              } else {
                // Someone paid the user -> reduces what they owe the user
                balance -= settlement.amount;
              }
            });
            return {
              ...group,
              id: group._id,
              balance,
            };
    })
    );

     return enhancedGroups
  },
});