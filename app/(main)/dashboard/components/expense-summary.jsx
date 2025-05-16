import React from "react";

const ExpenseSummary = ({ expenses }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Expense Summary</h2>
      <ul>
        {expenses && expenses.length > 0 ? (
          expenses.map((expense) => (
            <li key={expense._id}>
              {expense.description}: Rs {expense.amount}
            </li>
          ))
        ) : (
          <li>No expenses found.</li>
        )}
      </ul>
    </div>
  );
};

export default ExpenseSummary;