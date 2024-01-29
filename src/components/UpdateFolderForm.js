import React, { useState, useEffect } from 'react';

const UpdateFolderForm = ({ onClose, folderId }) => {
    const apiPath = process.env.NEXT_PUBLIC_API_PATH;
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [allArticles, setAllArticles] = useState([]);
    const [selectedSources, setSelectedSources] = useState([]);
    const [folderDetails, setFolderDetails] = useState({
      title: '',
      description: '',
      references: '',
      source_ids: [],
    });
      // Fetch the folder details and its sources
  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchFolderSources = async () => {
      const response = await fetch(`${apiPath}/api/info/folder/get/${folderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.code === '000') {
        setFolderDetails({
          title: data.info.title,
          description: data.info.description,
          references: data.info.references,
          source_ids: data.info.source.map(src => src.id),
        });
        setSelectedSources(data.info.source);
      } else {
        console.error('Failed to fetch folder sources:', data.message);
      }
    };

    fetchFolderSources();
  }, [folderId, apiPath]);
    const handleSourceSelect = (article) => {
        if (!folderDetails.source_ids.includes(article.id)) {
          setFolderDetails((prevState) => ({
            ...prevState,
            source_ids: [...prevState.source_ids, article.id]
          }));
          setSelectedSources((prevSelected) => [...prevSelected, article]);
        }
        setSearchTerm(''); // Clear the search input
        setSearchResults([]); // Clear the search results
      };
    
      const handleSourceRemove = (sourceId) => {
        setFolderDetails((prevState) => ({
          ...prevState,
          source_ids: prevState.source_ids.filter(id => id !== sourceId)
        }));
        setSelectedSources((prevSelected) => prevSelected.filter(source => source.id !== sourceId));
      };

  useEffect(() => {
    // Fetch all articles when the component mounts
    const fetchArticles = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage or context
      try {
        const response = await fetch(`${apiPath}/api/sources`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.code === '000') {
          // console.log('shura',data.sources);
          setAllArticles(data.sources);
          // setAllArticles(data.sources.flatMap(source => source.source)); // Flatten the nested sources array
        } else {
          console.error('Failed to fetch articles: ' + data.message);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);
  useEffect(() => {
    // Filter articles based on the search term
    if (searchTerm.trim()) {
      const filteredResults = allArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, allArticles]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${apiPath}/api/info/folder/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newFolder),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.code === '000') {
        alert('Folder added successfully');
        onClose();
      } else {
        alert('Failed to add folder: ' + data.message);
      }
    } catch (error) {
      console.error('Error adding folder:', error);
      alert('Error adding folder.');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFolderDetails({ ...newFolder, [name]: value });
  };

  const handleSourceIdChange = (sourceId, add) => {
    setFolderDetails((prevState) => {
      const sourceIds = new Set(prevState.source_ids);
      if (add) {
        sourceIds.add(sourceId);
      } else {
        sourceIds.delete(sourceId);
      }
      return { ...prevState, source_ids: Array.from(sourceIds) };
    });
  };
  // Function to handle updates to the folder
  const handleUpdateFolder = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const updatedFolder = {
      ...folderDetails,
      source_ids: selectedSources.map(src => src.id),
    };

    const response = await fetch(`${apiPath}/api/info/folder/update/${folderId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedFolder),
    });

    const data = await response.json();
    if (data.code === '000') {
      alert('Folder updated successfully');
      onClose(); // You might want to refresh the data or navigate away
    } else {
      alert(`Failed to update folder: ${data.message}`);
    }
  };
  
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 border rounded shadow-lg w-full max-w-md">
      <h2 className="text-xl mb-4 font-semibold text-gray-800">Update Folder</h2>
      <form onSubmit={handleUpdateFolder} className="space-y-6">
        <div>
          <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={folderDetails.title}
            onChange={handleChange}
            className="w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Description</label>
          <textarea
            id="description"
            name="description"
            value={folderDetails.description}
            onChange={handleChange}
            className="w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="references" className="block mb-2 text-sm font-medium text-gray-900">References</label>
          <input
            id="references"
            name="references"
            type="text"
            value={folderDetails.references}
            onChange={handleChange}
            className="w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="addFeeds" className="block mb-2 text-sm font-medium text-gray-900">Add feeds</label>
          <input
            id="addFeeds"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md shadow-sm"
            placeholder="Start typing to search"
          />
          <ul className="mt-2 max-h-60 overflow-auto">
            {searchResults.map((article) => (
              <li
                key={article.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSourceSelect(article)}
              >
                {article.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
        {selectedSources.map(source => (
          <div key={source.id} className="bg-blue-100 rounded p-2 flex items-center gap-2">
            {source.title}
            <button
              type="button"
              onClick={() => handleSourceRemove(source.id)}
              className="text-sm bg-red-200 rounded-full px-2"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 bg-transparent hover:bg-gray-200 py-2 px-4 rounded inline-flex items-center"
          >
            Cancel
          </button>
          <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded inline-flex items-center"
          >
              Save Folder
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateFolderForm;
