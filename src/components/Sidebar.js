import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Import useRouter

const Sidebar = ({ onSearch, currentPage }) => {
  const [inputValue, setInputValue] = useState('');
  const router = useRouter(); // Initialize useRouter hook for redirection

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  
    // Make sure to encode the inputValue to handle special characters
    const searchTerm = encodeURIComponent(inputValue);
  
    // Append the searchTerm to the API endpoint if the API requires it as a query parameter
    // If the API requires a different method of passing the search term, adjust accordingly
    fetch(`http://api2.staging.bzpke.com/api/read/rss?search=${searchTerm}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers required by the API, such as Authorization if needed
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Assuming the API returns an array of search results, pass this array to the onSearch callback
      // If the data structure is different, adjust the following line to pass the correct data
      onSearch(data);
    })
    .catch(error => {
      console.error('Error fetching search results:', error);
      // Handle any errors, such as updating the UI to show an error message
    });
  
    // Clear the input field
    setInputValue('');
  };
  

  const handleLogout = () => {
    const token = localStorage.getItem('token'); // Retrieve the token

    // Send a request to the logout endpoint
    fetch('https://api2.staging.bzpke.com/api/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // Use the token
        'Content-Type': 'application/json'
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      return response.json();
    })
    .then(() => {
      localStorage.removeItem('token'); // Clear the token from local storage
      router.push('/signin'); // Redirect to the signin page
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-blue-800 text-white flex flex-col z-10">
      <div className="px-4 py-6">
        <h2 className="text-3xl font-semibold">News Aggregate</h2>
      </div>

      <div className="px-4 mb-4">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for feeds..."
            className="text-black w-full p-2 rounded"
          />
          <button type="submit" className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
            Search
          </button>
        </form>
      </div>

      <nav className="flex flex-col flex-grow px-4">
        <Link href="/">
          <a className={`block py-2 hover:bg-blue-700 transition-colors duration-200 ${currentPage === 'dashboard' ? 'bg-blue-700' : ''}`}>
            Dashboard
          </a>
        </Link>
        <Link href="/collections">
          <a className={`block py-2 hover:bg-blue-700 transition-colors duration-200 ${currentPage === 'collections' ? 'bg-blue-700' : ''}`}>
            User&apos;s Collection
          </a>
        </Link>
        <button
          onClick={handleLogout}
          className="mt-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
