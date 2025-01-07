import React, { useState, useRef, useEffect, useContext } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { API } from 'aws-amplify';
import Modal from './DeleteModal';
import { useVideoFetch } from '../hooks/useVideoFetch';
import Context from '../../../../../Context/Context';

const VideoCard = ({ video, onClick }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const videoRef = useRef(null);
  const { setVideos } = useVideoFetch();
  const {userData, fetchPlaylists,fetchVideos } = useContext(Context);

  // Preload video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [video.videoUrl]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      // Only attempt to play if video is loaded
      if (videoLoaded) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Video playback failed:', error);
          });
        }
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      const response = await API.del('main', `/admin/delete-class-videos/${userData.institution}`, {
        body: {
          videoType_partNo: video.videoType_partNo,
          videoUrl: video.videoUrl,
          thumbnailUrl: video.thumbnailUrl
        }
      });

      if (response) {
        setVideos((prevVideos) => prevVideos.filter((v) => v.videoUrl !== video.videoUrl));
        fetchPlaylists();
        fetchVideos();
      }
    } catch (error) {
      console.error('Failed to delete video:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const uploadDate = new Date(video.uploadDate);
  const uploadTimeAgo = !isNaN(uploadDate.getTime())
    ? formatDistanceToNow(uploadDate, { addSuffix: true })
    : "Unknown";

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div 
        className="bg-[#ffffffd4] w-[18rem] pb-3 rounded-lg h-[18rem] overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 max600:w-[85vw]"
        onClick={() => onClick(video)}
      >
        <div className="w-full h-[60%] relative">
          {!thumbnailError && (
            <div
              className={`w-full h-full bg-cover bg-center absolute top-0 left-0 transition-opacity duration-300 ${
                isHovering ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ backgroundImage: `url(${encodeURI(video.thumbnailUrl)})` }}
            />
          )}
          
          <video
            ref={videoRef}
            className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-300 ${
              isHovering ? 'opacity-100' : 'opacity-0'
            }`}
            src={video.videoUrl}
            muted
            playsInline
            preload="metadata"
            onLoadedData={handleVideoLoaded}
            onError={() => setThumbnailError(true)}
          />
        </div>

        <div className="relative p-3 w-full h-[40%] flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base title-two-line">{video.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-1">
              Song Name: {video.songName}
            </p>
          </div>
          <span className="absolute bottom-0 right-2 text-gray-500 text-xs">
            {uploadTimeAgo}
          </span>
        </div>
      </div>

      {userData.userType === 'admin' && (
        <div 
          className={`absolute top-2 right-2 transition-all duration-200 ${
            isHovering ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            disabled={isDeleting}
            className={`
              flex items-center justify-center 
              bg-white/90 hover:bg-red-50 
              rounded-full p-2
              transform transition-all duration-200
              ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 hover:text-red-500'}
              shadow-lg
            `}
          >
            <Trash2
              size={16}
              strokeWidth={1.5}
              className={`${isDeleting ? 'animate-pulse' : ''}`}
            />
          </button>
        </div>
      )}

      {showDeleteModal && (
        <Modal
          title="Confirm Delete"
          message="Are you sure you want to delete this video?"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default VideoCard;