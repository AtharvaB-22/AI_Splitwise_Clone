import React from "react";

const BalanceSummary = ({ balances }) => {
  return (
    <div>
      {/* Render balance summary here */}
      <h2 className="text-xl font-bold mb-2">Balance Summary</h2>
      <div>Total Balance: {balances?.totalBalance ?? 0}</div>
      <div>You are owed: {balances?.youAreOwed ?? 0}</div>
      <div>You owe: {balances?.youOwe ?? 0}</div>
    </div>
  );
};

export default BalanceSummary;