
import { v } from "convex/values";
import { query } from "./_generated/server";

export const getGroupExpenses = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, { groupId }) => {
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);
    const group = await ctx.db.get(groupId);
    
    if (!group) throw new Error("Group not found");
    
    if (!group.members.some((m) => m.userId === currentUser._id)) {
      throw new Error("You are not a member of this group");
    }

    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_group", (q) => q.eq("groupId", groupId))
      .collect();

    const settlements = await ctx.db
        .query("settlements")
        .filter((q) => q.eq(q.field("groupId"), groupId))
        .collect();

    /* ...... member map ...... */
    const memberDetails = await Promise.all(
    group.members.map(async (m) => {
        const u = await ctx.db.get(m.userId);
        return {
        _id: u._id,
        name: u.name,
        imageUrl: u.imageUrl,
        role: m.role,
        };
    })
    );

    const ids = memberDetails.map((m) => m._id);

    // Balance Calculation Setup
    // ---
    // Initialize totals object to track overall balance for each user
    // Format: { userId1: balance1, userId2: balance2, ... }
    const totals = Object.fromEntries(ids.map((id) => [id, 0]));

    // Create a two-dimensional ledger to track who owes whom
    // ledger[A][B] = how much A owes B
    // Example for  3 users (user1,user2`, user3):
    // ledger={
    //     user1: { user2: 0, user3: 0 },
    //     user2: { user1: 0, user3: 0 },
    //     user3: { user1: 0, user2: 0 },
    // }
    const ledger = {};
    ids.forEach((a) => {
    ledger[a] = {};
    ids.forEach((b) => {
        if (a !== b) ledger[a][b] = 0;
    });
    });
    /** 
     * Apply Expenses to Balances
     * ---
     * Example:
     * - [Expense 1: user1 paid $60, split equally among all 3 users ($20 each)]
     * - After applying this expense:
     *   - totals = { "user1": +40, "user2": -20, "user3": -20 }
     *   - ledger = {
     *       "user1": { "user2": 0, "user3": 0 },
     *       "user2": { "user1": 20, "user3": 0 },
     *       "user3": { "user1": 20, "user2": 0 }
     *     }
     * - This means:
     *   - user2 owes user1 $20
     *   - user3 owes user1 $20
     *   - Net balances:
     *     - user1 is +$40 overall
     *     - user2 is -$20 overall  
     *     - user3 is -$20 overall
     */
    for (const exp of expenses) {
    const payer = exp.paidByUserId;

    for (const split of exp.splits) {
        // Skip if this is the payer's own split or if already paid
        if (split.userId === payer || split.paid) continue;

        const debtor = split.userId;
        const amt = split.amount;

        // Update totals: increase payer's balance, decrease debtor's balance
        totals[payer] += amt; // Payer gains credit
        totals[debtor] -= amt; // Debtor goes into debt

        // Update ledger: debtor owes payer more money
        ledger[debtor][payer] += amt;
    }
    }
    /**
     * Apply Settlements to Balances
     * ---
     * Example:
     * - [Settlement: user2 paid $10 to user1]
     * - After applying this settlement:
     *   - totals = { "user1": +30, "user2": -10, "user3": -20 }
     *   - ledger = {
     *       "user1": { "user2": 0, "user3": 0 },
     *       "user2": { "user1": 10, "user3": 0 }, 
     *       "user3": { "user1": 20, "user2": 0 }
     *     }
     * - Interpretation:
     *   - user2's debt to user1 reduced from $20 to $10
     *   - user3's debt to user1 remains $20
     *   - Net balances:
     *     - user1: +$30 ($40 original - $10 payment)
     *     - user2: -$10 ($20 original + $10 payment)
     *     - user3: -$20 (unchanged)
     */
    for (const s of settlements) {
    // Update totals: increase payer's balance, decrease receiver's balance
    totals[s.paidByUserId] += s.amount;
    totals[s.receivedByUserId] -= s.amount;

    // Update ledger: reduce what the payer owes to the receiver
    ledger[s.paidByUserId][s.receivedByUserId] -= s.amount;
    }

    // Format Response Data
    // ---
    // Create a comprehensive balance object for each member
    const balances = memberDetails.map((m) => ({
        ...m,
        totalBalance: totals[m._id],
        owes: Object.entries(ledger[m._id])
        .filter(([,v]) => v > 0)
        .map(([to, amount]) => ({ to, amount })),
        owedBy:ids
        .filter((other) => ledger[other][m._id] > 0)
        .map((other) => ({ from: other, amount: ledger[other][m._id] })),
    }));

    const userLookupMap ={};
    memberDetails.forEach((member) => {
        userLookupMap[member._id] = member;
    });

    return{
        group: {
            id: group._id,
            name: group.name,
            description: group.description,
        },
        members: memberDetails, // All group members with details
        expenses, // All expenses in the group
        settlements, // All settlements in the group
        balances, // All member balances
        userLookupMap // Quick Lookup for user details 
    }
  },
});