
"use client";
import React, { useState, useEffect } from 'react';
import ArticleModal from '../components/ArticleModal';
import Sidebar from '../components/Sidebar';
import NewFolderForm from '../components/NewFolderForm';
import DOMPurify from 'dompurify';
import Image from 'next/image';
import { useRouter } from 'next/router'; 

export default function Sources() {
  const apiPath = process.env.NEXT_PUBLIC_API_PATH;
  const router = useRouter();
  const [userSources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const [feeds, setFeeds] = useState(null);
  const [browserUrl, setBrowserUrl] = useState(null);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedFolderSources, setSelectedFolderSources] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const createMarkup = (htmlContent) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

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
        console.log('sources from folder',data.info);
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

  const handleFeedClick = (feed) => {
    setSelectedFeed(feed)
    setBrowserUrl(feed.link);
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

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col md:flex-row">
      <Sidebar
        onSearch={handleSearch}
        currentPage="/sources"
        onAddNew={() => setShowForm(true)}
        onPageChange={handlePageChange}
      />
      

      <div className="flex-grow p-4 md:ml-64">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6">My Sources</h1>
        
        <h2 className="text-xl font-semibold mb-6">Folder - {selectedFolderSources.title}</h2>
        
        <div class="grid grid-cols-9 gap-4">
          <div class="col-span-2" id="col-view-1">
            <h3>Sources from Folder - <b>{selectedFolderSources.title}</b></h3>
              <ul className="divide-y divide-gray-400">
                {selectedFolderSources.source && selectedFolderSources.source.map((userSource)=> (
                  <li
                  key={userSource}
                  className={`flex justify-between gap-x-6 py-5 divide-gray-400 ${selectedSource && userSource.id === selectedSource.id ? 'bg-blue-100' : ''}`}
                  onClick={() => handleSourceClick(userSource)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{userSource.title}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{userSource.description}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{userSource.url}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{userSource.id}</p>
                  </div>
                </li>
                ))}
              </ul>
            </div>
            
            <div class="col-span-3">
              <h3 className='divide-black-400 m3'>Feeds from source <b>{selectedSource && selectedSource.title}</b></h3>

                <ul class="divide-y divide-gray-100">
                {feeds !== null && feeds.map((feed) => (
                    <li 
                    className={`gap-x-6 py-5 divide-red-600 ${selectedFeed && feed.id === selectedFeed.id ? 'bg-blue-100' : ''}`}
                    key={feed.id}
                    class="py-5 cursor-pointer"
                    
                    onClick={() => handleFeedClick(feed)}
                    >
                    <p class="text-sm font-semibold leading-6 text-gray-900">{feed.title}</p>
                    <p class="mt-1 truncate text-xs leading-5 text-gray-500">{feed.description}</p>
                    <p class="mt-1 truncate text-xs leading-5 text-gray-500">Published on: {feed.pubdate}</p>
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
      </div>
    </div>
  );
}