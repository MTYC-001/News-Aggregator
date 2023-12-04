import React, { useState } from 'react';
import AddFollowButton from './AddFollowButton';

const UrlInput = ({ onUrlSubmit }) => {
  const [url, setUrl] = useState('');

  const handleAddClick = () => {
    // Validate the URL
    // Submit the URL
    onUrlSubmit(url);
  };

  return (
    <div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste a valid URL"
        className="border p-2 rounded"
      />
      <AddFollowButton onAdd={handleAddClick} />
    </div>
  );
};

export default UrlInput;
