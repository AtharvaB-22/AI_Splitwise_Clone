import React from "react";

const SettlementsList = ({ settlements = [] }) => {
  if (!settlements.length) {
    return <p className="text-muted-foreground">No settlements found.</p>;
  }

  return (
    <ul className="space-y-2">
      {settlements.map((settlement) => (
        <li key={settlement._id} className="p-4 bg-white shadow rounded">
          <div className="font-medium">
            Rs {settlement.amount?.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">
            {settlement.note || "Settlement"}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SettlementsList;