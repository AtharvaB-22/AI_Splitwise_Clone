import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { getCategoryById, getCategoryIcon } from "@/lib/expense-categories";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

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

    const handleDeleteExpense = async (expense) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteExpense.mutate({ expenseId: expense._id });
      toast.success("Expense deleted successfully");
    } catch (error) {
      toast.error("Failed to delete expense: " + error.message);
    }
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

        return (
        <Card key={expense._id}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CategoryIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{expense.description}</h3>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      {format(new Date(expense.date), "MMM dd, yyyy")}
                    </span>
                    {
                      showOtherPerson && (
                        <>
                          <span></span>
                          <span>
                            {isCurrentUserPayer ? "You" : payer.name} paid 
                          </span>
                        </>
                      )
                    }
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="font-medium">
                    Rs {expense.amount.toFixed(2)}
                  </div>

                  {isGroupExpense ? (
                  <Badge variant="outline" className="mt-1">
                    Group expense
                  </Badge>
                ) : isCurrentUserPayer ? (
                  <div className="text-sm text-muted-foreground">
                    <span className="text-green-600">You paid</span>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    <span className="text-red-600">{payer.name} paid</span>
                  </div>
                )}
                </div>
                {showDeleteOption && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-red-500 hover:text-red-700 hover:bg-red-100"
                    onClick={() => handleDeleteExpense(expense._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete expense</span> 
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {expense.splits.map((split, idx) => {
                const splitUser = getUserDetails(split.userId, expense);
                const isCurrentUser = split.userId === currentUser?._id;

                return (
                  <Badge
                    key={idx}
                    variant={split.paid ? "outline" : "secondary"}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/60 shadow-sm"
                  >
                    <Avatar className="h-5 w-5 bg-muted">
                      <AvatarFallback className="text-xs font-semibold">
                        {splitUser.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">
                      {isCurrentUser ? "You" : splitUser.name}: Rs {split.amount.toFixed(2)}
                    </span>
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      );
      })}
    </div>
  );
};

export default ExpenseList;