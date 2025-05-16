import React from "react";

const GroupList = ({ groups }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Groups</h2>
      <ul>
        {groups && groups.length > 0 ? (
          groups.map((group) => (
            <li key={group._id}>{group.name}</li>
          ))
        ) : (
          <li>No groups found.</li>
        )}
      </ul>
    </div>
  );
};

export default GroupList;