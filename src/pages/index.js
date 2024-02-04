
"use client";
import React, { useState, useEffect } from 'react';
import ArticleModal from '../components/ArticleModal';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import NewFolderForm from '../components/NewFolderForm';
import UpdateFolderForm from '../components/UpdateFolderForm';
import DOMPurify from 'dompurify';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Sources() {
  const apiPath = process.env.NEXT_PUBLIC_API_PATH;
  const router = useRouter();
  const [userSources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const [feeds, setFeeds] = useState(null);
  const [selectedFeedIds, setSelectedFeedIds] = useState([]);
  const [browserUrl, setBrowserUrl] = useState(null);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updatingFolderId, setUpdatingFolderId] = useState(null);
  const [selectedFolderSources, setSelectedFolderSources] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedSourceFromSidebar, setSelectedSourceFromSidebar] = useState(null);
  // Function to close the UpdateFolderForm
  const closeUpdateForm = () => {
    setShowUpdateForm(false);
  };
  const createMarkup = (htmlContent) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };
// Function to handle the selected source from the sidebar
const handleSourceSelectFromSidebar = (source) => {
  setSelectedSourceFromSidebar(source); // Update the state with the selected source
  fetchFeeds(source.id); // Fetch the feeds for the selected source
  setSelectedFeed(null); // Reset the selected feed
};
// In the useEffect hook that fetches feeds, check if selectedSourceFromSidebar is set
useEffect(() => {
  if (selectedSourceFromSidebar) {
    fetchFeeds(selectedSourceFromSidebar.id);
  }
}, [selectedSourceFromSidebar]);
  const handleSelectFolder = (folderSources) => {
    setSelectedFolderSources(folderSources);
  };

  const handlePageChange = (folderId) => {
    setSelectedFolderId(folderId);
    const token = localStorage.getItem('token');

    fetch(`${apiPath}/api/info/folder/get/${folderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('sources from folder', data.info);
        const selectedFolderSources = data.info
        setSelectedFolderSources(selectedFolderSources);
      })
      .catch(error => {
        console.error('Error fetching feeds:', error);
      });

  };

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    // const [isLoading, setLoading] = useState(true)

    if (!token) {
      // If no token, redirect to SignIn page
      router.push('/signin');
      return; // Early return to avoid running the code below
    }

    fetch(`${apiPath}/api/sources`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Use the actual token value here
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(data.sources); // This will log the entire data structure

        // Process the data to include both 'source' and 'feeds'
        const userSources = data.sources
        setSources(userSources);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const feedsList = document.getElementById('feeds-list'); // Replace with the actual ID of your feeds list container

      if (feedsList && !feedsList.contains(event.target)) {
        // Click occurred outside the feeds list, clear selectedFeedIds
        setSelectedFeedIds([]);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      // Cleanup event listener on component unmount
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedFeedIds]);

  const handleSearch = (searchTerm) => {
    // Convert the search term to lower case for case-insensitive comparison
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // Find the first article whose title contains the search term
    const foundArticle = articles.find(article =>
      article.title.toLowerCase().includes(lowerCaseSearchTerm)
    );
  };

  const handleSourceClick = (userSource) => {
    // Set the selected source_id and fetch feeds
    // setSelectedSourceId(sourceId);
    // fetchFeeds(sourceId);
    setSelectedSource(userSource);
    fetchFeeds(userSource.id);
  };

  // const handleFeedClick = (feed) => {
  //   setSelectedFeed(feed)
  //   setBrowserUrl(feed.link);
  // };

  const handleFeedClick = (feed) => {
    // Check if the Ctrl key is pressed (or Cmd key on Mac)
    const isCtrlPressed = event.ctrlKey || event.metaKey;
    // console.log('april shower',feed.id);
    if (isCtrlPressed) {
      // If Ctrl key is pressed, toggle the selected status of the feed
      const updatedSelectedFeedIds = [...selectedFeedIds];
      const index = updatedSelectedFeedIds.indexOf(feed.id);

      if (index === -1) {
        // Feed not in the list, add it
        updatedSelectedFeedIds.push(feed.id);
      } else {
        // Feed already in the list, remove it
        updatedSelectedFeedIds.splice(index, 1);
      }
      console.log('multiple', updatedSelectedFeedIds);
      setSelectedFeedIds(updatedSelectedFeedIds);
    } else {
      // If Ctrl key is not pressed, handle regular click behavior
      // Your existing code for handling regular click
      console.log('if everyone is not special', feed.id);
      // setSelectedFeedIds(feed.id)
      setSelectedFeed(feed);
      // ... rest of the code
    }
  };


  const fetchFeeds = (sourceId) => {
    // Fetch feeds based on the selected source_id
    const token = localStorage.getItem('token');

    fetch(`${apiPath}/api/feeds?source_id=${sourceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(data.feeds)
        setFeeds(data.feeds);
      })
      .catch(error => {
        console.error('Error fetching feeds:', error);
      });
  };

  const handleExportApiCall = async () => {
    // Use selectedFeedIds in your API call
    const token = localStorage.getItem('token');
    const feed_ids = {
      feed_ids: selectedFeedIds,
    };
    console.log('seikaiiiii', JSON.stringify(feed_ids));
    try {
      const response = await fetch(`${apiPath}/api/export/feeds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(feed_ids),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json()
      // console.log('bokurawa',data)
      if (response.ok) {
        //Trigger the file download
        const url = data.url;  // Replace with your direct URL
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename;  // Set the desired filename
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        console.error('Failed to fetch data:', response.statusText);
        // Handle error
      }
    } catch (error) {
      console.error('Error making API call:', error);
    }
  };
  // Function to handle folder update request
  const handleFolderUpdate = (folderId) => {
    setUpdatingFolderId(folderId);
    setShowUpdateForm(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col md:flex-row">
      <Sidebar
        onSearch={handleSearch}
        currentPage="/sources"
        onAddNew={() => setShowForm(true)}
        onUpdate={handleFolderUpdate}
        onPageChange={handlePageChange}
        onSourceSelect={handleSourceSelectFromSidebar}
      />


      <div className="flex-grow p-4 md:ml-64">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6">My Sources</h1>

        <h2 className="text-xl font-semibold mb-6">Folder - {selectedFolderSources.title}</h2>

        <div class="grid grid-cols-9 gap-4">
          <div class="col-span-2" id="col-view-1">
            <h3>Sources from Folder - <b>{selectedFolderSources.title}</b></h3>
            {/* <button onClick={handleAddNewSourceToFolder} className="rounded-xl bg-blue-900 h-9 m-3">
                      + Add Sources
            </button> */}
            <ul className="divide-y divide-gray-400">
              {selectedFolderSources.source && selectedFolderSources.source.map((userSource) => (
                <li
                  key={userSource}
                  className={`flex justify-between gap-x-6 py-5 divide-gray-400 
                    ${(selectedSource && userSource.id === selectedSource.id) ? 'bg-blue-100' : ''}`}
                  onClick={() => handleSourceClick(userSource)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{userSource.title}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{userSource.description}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{userSource.url}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div class="col-span-3" id="feeds-list">
            <h3 className='divide-black-400 m3'>Feeds from source <b>{selectedSource && selectedSource.title}</b></h3>
            {(selectedFeedIds.length > 0 || selectedFeed) && (
              <button
                onClick={handleExportApiCall}
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded inline-flex items-center"
              >
                Export Selected Feeds ({selectedFeedIds.length})
              </button>
            )}

            <ul className="divide-y divide-blue-900">
              {feeds !== null && feeds.map((feed) => (
                <li
                  key={feed.id}
                  className={`py-5 cursor-pointer ${
                    (selectedFeedIds && selectedFeedIds.includes(feed.id)) || (selectedFeed && feed.id === selectedFeed.id) ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => handleFeedClick(feed)}
                >
                  <p className="text-sm font-semibold leading-6 text-gray-900">{feed.title}</p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">{feed.description}</p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">Published on: {feed.pubdate}</p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">Updated on: {feed.created_at}</p>
                </li>
              ))}
            </ul>

          </div>

          {selectedFeed &&
            <div class="col-span-4">
              <h3 className='divide-black-400 m-3'>Content from article <b>{selectedFeed && selectedFeed.title}</b></h3>
              {/* In-app browser */}
              {/* {browserUrl && (
                <iframe
                    src={browserUrl}
                    title="In-App Browser"
                    className="w-full h-full border"
                />
                )} */}
              <h4 className='text-l md:text-xl font-semibold mb-4 md:mb-6'>{selectedFeed.title}</h4>
              <p className='m-2' >Go to source :
                <a className='m-2' href={selectedFeed.source.url}>
                  <b>{selectedFeed.source.title}</b>
                </a>
              </p>
              <p className='m-2' > View original article:
                <a href={selectedFeed.link} className="text-sm font-semibold m-2" target="_blank" rel="noopener noreferrer">{selectedFeed.link}
                </a>
              </p>
              <div dangerouslySetInnerHTML={selectedFeed && createMarkup(selectedFeed.content)} />

            </div>
          }


        </div>
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md m-auto">
            <NewFolderForm onClose={() => setShowForm(false)} />
          </div>
        )}
        {showUpdateForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md m-auto">
            <UpdateFolderForm 
            folderId={updatingFolderId}
            onClose={closeUpdateForm}
            />
          </div>
        )}
      </div>
    </div>
  );
}