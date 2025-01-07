import React, { useContext } from 'react';
import { SearchBar } from './SearchBar';
import InstitutionContext from '../../../../../../Context/InstitutionContext';

export const MainHeader = ({
  setSearchTerm,
  inProgressStatus,
  selectedPlaylist,
  clearPlaylist,
  toggleMobilePlaylist,
  userData,
  setIsModalOpen,
  setVideos,
  resetToInitialVideos
}) => {
  const { PrimaryColor } = useContext(InstitutionContext).institutionData;
  const handleUpload = () => {
    if (!inProgressStatus) {
      setIsModalOpen(true);
    } else {
      alert('Please wait for the upload to finish.');
    }
  }
  return (
    <div className="relative mb-8 w-full flex justify-between items-center max600:flex-col-reverse max600:gap-3">
      <SearchBar
        toggleMobilePlaylist={toggleMobilePlaylist}
        onSearchResults={(videoDetails) => {
          if (videoDetails === null) {
            // Clear search, reset to initial videos
            resetToInitialVideos();
          } else if (videoDetails && videoDetails.length > 0) {
            // Set videos to the fetched details
            setVideos(videoDetails);
          }
        }}
      />
      {selectedPlaylist && (
        <div className="flex items-center -mb-6 mr-8 max600:mb-0 max600:mr-0">
          <button
            onClick={clearPlaylist}
            className="text-sm inter text-gray-200 poppins hover:text-gray-800 px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-200 mr-4"
          >
            Clear Playlist
          </button>
          <span className="text-gray-600 poppins text-[0.9rem]">
            Showing: {selectedPlaylist.playlistName} ({selectedPlaylist.videoCount} videos)
          </span>
        </div>
      )}

      {userData.userType === 'admin' && (
        <div className="max600:w-full">
          <button
            onClick={handleUpload}
            className="text-white font-bold tracking-[0.5px] p-2 rounded-md max600:w-full"
            style={{backgroundColor:PrimaryColor}}
          >
            Upload Videos
          </button>
        </div>
      )}
    </div>
  );
};