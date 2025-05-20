import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { getCategoryById, getCategoryIcon } from "@/lib/expense-categories";

const ExpenseList = ({
  expenses,
  showOtherPerson = true,
  isGroupExpense = false,
  otherPersonId = null,
  userLookupMap = {},
}) => {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const deleteExpense = useConvexMutation(api.expenses.deleteExpense);

  if (!expenses || !expenses.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No expenses found
        </CardContent>
      </Card>
    );
  }

  const getUserDetails = (userId) => {
    return {
        name:
        userId === currentUser?._id
            ? "You"
            : userLookupMap[userId]?.name || "Other User",
        _id: userId,
    };
    };

    const canDeleteExpense = (expense) => {
    if (!currentUser) return false;
      return (
        expense.createdBy === currentUser._id ||
        expense.paidByUserId === currentUser._id
      );
    };

    return (
    <div className="flex flex-col gap-4">
        {expenses.map((expense) => {
        const payer = getUserDetails(expense.paidByUserId);
        const isCurrentUserPayer = expense.paidByUserId === currentUser?._id;
        const category = getCategoryById(expense.category);
        const CategoryIcon = getCategoryIcon(category.id);
        const showDeleteOption = canDeleteExpense(expense);
        // Expense item rendering will go here
      })}
    </div>
  );
};

export default ExpenseList;