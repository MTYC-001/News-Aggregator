import React from 'react';

const AddFollowButton = ({ onAdd }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={onAdd}
    >
      Add/Follow
    </button>
  );
};

export default AddFollowButton;
