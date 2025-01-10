import React, { useState, useContext, useEffect, useCallback, useMemo, useRef } from 'react';
import _ from 'lodash';
import { MainHeader } from './MainHeader';
import { VideoContent } from './VideoContent';
import { PlaylistSection } from './PlaylistSection';
import UploadModal from '../UploadModal';
import Context from '../../../../../../Context/Context';
import { useVideoFetch } from '../../hooks/useVideoFetch';

export default function Main() {
  const { userData } = useContext(Context);
  const {
    setVideos,
    videos,
    error,
    loading,
    fetchVideos
  } = useVideoFetch();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [view, setView] = useState('grid');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isMobilePlaylistOpen, setIsMobilePlaylistOpen] = useState(false);
  const [initialVideos, setInitialVideos] = useState([]);
  const [inProgressStatus, setInProgress] = useState(false);


  const scrollableDivRef = useRef(null);
  // eslint-disable-next-line
  const handleScroll = useCallback(
    _.throttle(() => {
      if (scrollableDivRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableDivRef.current;
        if (scrollHeight - scrollTop <= clientHeight + 300) {
          fetchVideos();
        }
      }
    }, 500),
    [fetchVideos]
  );
  useEffect(() => {
    // When videos are first fetched, store them as initial videos
    if (videos.length > 0 && initialVideos.length === 0) {
      setInitialVideos(videos);
    }
    // eslint-disable-next-line
  }, [videos]);

  const resetToInitialVideos = () => {
    setVideos(initialVideos);
  };

  useEffect(() => {
    const scrollableDiv = scrollableDivRef.current;
    if (scrollableDiv) {
      scrollableDiv.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (scrollableDiv) {
        scrollableDiv.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  const filteredVideos = useMemo(() => {
    let filtered = videos;

    if (searchTerm) {
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.choreographer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.songName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [videos, searchTerm]);

  // Event Handlers
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setView('player');
    setIsMobilePlaylistOpen(false);
  };

  const handleClosePlayer = () => {
    setSelectedVideo(null);
    setView('grid');
  };

  const handlePlaylistSelect = (playlist) => {
    setSelectedPlaylist(playlist);
    setIsMobilePlaylistOpen(false);
  };

  const toggleMobilePlaylist = () => {
    setIsMobilePlaylistOpen(!isMobilePlaylistOpen);
  };

  const clearPlaylist = () => {
    setSelectedPlaylist(null);
  };

  return (
    <div className="w-full bg-gray-100 max-h-screen scrollbar-hide mb-[6rem] p-4 max600:h-screen max600:mb-6 max600:-mt-8">
      <div className="max-w-8xl">
        <MainHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedPlaylist={selectedPlaylist}
          clearPlaylist={clearPlaylist}
          toggleMobilePlaylist={toggleMobilePlaylist}
          userData={userData}
          setIsModalOpen={setIsModalOpen}
          filteredVideos={filteredVideos}
          setVideos={setVideos}
          resetToInitialVideos={resetToInitialVideos}
          inProgressStatus={inProgressStatus}
        />

        <div className="flex gap-8 h-[80vh] relative">
          <VideoContent
            error={error}
            loading={loading}
            view={view}
            filteredVideos={filteredVideos}
            selectedVideo={selectedVideo}
            handleVideoClick={handleVideoClick}
            handleClosePlayer={handleClosePlayer}
            scrollableDivRef={scrollableDivRef}
            selectedPlaylist={selectedPlaylist}
          />

          <PlaylistSection
            selectedPlaylist={selectedPlaylist}
            handlePlaylistSelect={handlePlaylistSelect}
            isMobilePlaylistOpen={isMobilePlaylistOpen}
            setIsMobilePlaylistOpen={setIsMobilePlaylistOpen}
          />
        </div>
      </div>
      <UploadModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} setVideos={setVideos} setInProgress={setInProgress} />
    </div>
  );
}