import React, { useState } from "react";

const ExpenseForm = ({ onSubmit, initialValues = {} }) => {
  const [description, setDescription] = useState(initialValues.description || "");
  const [amount, setAmount] = useState(initialValues.amount || "");
  const [date, setDate] = useState(initialValues.date || "");
  const [category, setCategory] = useState(initialValues.category || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !date) return;
    onSubmit({
      description,
      amount: parseFloat(amount),
      date,
      category,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Amount</label>
        <input
          type="number"
          className="input input-bordered w-full"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Date</label>
        <input
          type="date"
          className="input input-bordered w-full"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Category</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary w-full">
        Save Expense
      </button>
    </form>
  );
};

export default ExpenseForm;