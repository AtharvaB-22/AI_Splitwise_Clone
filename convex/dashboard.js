import { internal } from "./_generated/api";
import { query } from "./_generated/server";

// Get user balances
export const getUserBalances = query({
    handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    /* --- 1-to-1 expenses (no groupId) --- */
    // Filter expenses to only include one-on-one expenses (not group expenses)
    // where the current user is either the payer or in the splits
    const expenses = (await ctx.db.query("expenses").collect()).filter(
    (e) =>
    !e.groupId && // 1-to-1 only
    (e.paidByUserId === user._id ||
    e.splits.some((s) => s.userId === user._id))
    );

    let youOwe=0;
    let youAreOwed=0;
    const balanceByUsers={};

    for(const e of expenses) {
    const isPayer = e.paidByUserId === user__id;
    const mySplit = e.splits.find((s) => s.userId === user__id);

    if (isPayer) {
        for (const s of e.splits) {
        // Skip user's own split or already paid splits
        if (s.userId === user__id || s.paid) continue;

        // Add to amount owed to the user
        youAreOwed += s.amount;

        (balanceByUser[s.userId] ??= { owed: 0, owing: 0 }).owed += s.amount;
        }
    }
    else if (mySplit && !mySplit.paid) {
        // Add to amount owed to the user
        youOwe += mySplit.amount;

        (balanceByUser[e.paidByUserId] ??= { owed: 0, owing: 0 }).owing += mySplit.amount;
    }
    }

    const settlements = ( await ctx.db.query("settlements").collect()).filter(
    (s) =>
        !s.groupId && // 1-to-1 only
        (s.payerUserId === user._id || s.receivedByUserId === user._id)
    );

    for (const s of settlements) {
        if (s.paidByUserId === user._id) {
            // User paid someone else -> reduces what user owes
            youOwe -= s.amount;
            (balanceByUser[s.receivedByUserId] ??= { owed: 0, owing: 0 }).owing -= s.amount;
        } else {
            // Someone paid the user -> reduces what they owe the user
            youAreOwed -= s.amount;
            (balanceByUser[s.paidByUserId] ??= { owed: 0, owing: 0 }).owed -= s.amount;
        }
    }

    const youOweList=[];
    const youAreOwedByList=[];
    for (const [uid, {owed,owing}] of Object.entries(balanceByUser)) {
        const net=owed- owing;
        if(net ===0) continue; // Skip if no net balance

        const counterpart = await ctx.db.get(uid);
        const base = {
        userId: uid,
        name: counterpart?.name ?? "Unknown",
        imageUrl: counterpart?.imageUrl,
        amount: Math.abs(net),
        };
    

        net > 0 ? youAreOwedByList.push(base) : youOweList.push(base);
    }
        // Sort the lists by amount in descending order

        youOweList.sort((a, b) => b.amount - a.amount);
        youAreOwedByList.sort((a, b) => b.amount - a.amount);

        return{
            youOwe,
            youAreOwed,
            totalbalance: youAreOwed-youOwe,
            ownDetails:{
                youOwe: youOweList,
                youAreOwedBy: youAreOwedByList,
            },
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
    .withIndex("by_date", (q) => q.get("date", startOfYear));
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
        month: new Date(parseInt(month)),
        total,
    }));

    result.sort((a, b) => a.month - b.month); // Sort by month
    return result;
},
});