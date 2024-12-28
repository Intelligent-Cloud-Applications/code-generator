import React, {useContext } from 'react';
import { Loader } from 'lucide-react';
import Context from '../../../../../Context/Context';

const Playlist = ({ onSelectPlaylist, selectedPlaylist }) => {
  const {
    playlists,
    errorPlaylist,
    loadingPlaylist,
  } = useContext(Context)
  return (
    <div className="w-full max-h-screen mb-[3.5rem] p-3 max600:h-screen max600:p-0">
      <div className="max-w-8xl">
        {loadingPlaylist ? (
          <div className="flex justify-center items-center h-[80vh]">
            <Loader className="animate-spin" />
          </div>
        ) : errorPlaylist ? (
          <p className="text-red-500">{errorPlaylist}</p>
        ) : (
          <div className="w-full flex flex-col gap-2">
            {playlists.map((playlist, index) => (
              <div
                key={index}
                className={`flex w-full h-[4.5rem] items-start p-1 ${selectedPlaylist?.playlistName === playlist.playlistName
                    ? 'bg-[#d8d8d8]'
                    : 'bg-[#ebebeb]'
                  } space-x-2 mb-2 cursor-pointer hover:bg-[#d4d4d4] transition-colors max600:bg-[#1b1b1b] max600:rounded-md`}
                onClick={() => onSelectPlaylist(playlist)}
              >
                <img
                  src={playlist.videos[0]?.thumbnailUrl}
                  alt={playlist.playlistName}
                  className="w-20 h-[90%] my-auto object-cover rounded max600:w-24 max600:h-[4rem]"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-600 text-[13px] line-clamp max600:text-[#a8a8a8]">
                    {playlist.playlistName}
                  </h3>
                  <p className="text-gray-600 -mt-1 text-[13px] multi-line-truncate  max600:text-[#a8a8a8]">
                    Total videos {playlist.videos.length}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlist;