import { useState, useCallback, useEffect, useContext } from "react";
import { API } from "aws-amplify";
import Context from "../../../../../Context/Context";

export const useVideoFetch = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastKey, setLastKey] = useState(null);
  const { userData } = useContext(Context);

  const fetchVideos = useCallback(
    async (reset = false) => {
      if (!hasMore && !reset) return;

      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          pageSize: "20",
          ...(lastKey && !reset && { lastKey }),
        });

        const response = await API.get(
          "main",
          `/user/fetch-videos/${userData.institution}?${queryParams.toString()}`
        );

        if (response.videos && Array.isArray(response.videos)) {
          setVideos((prev) =>
            reset ? response.videos : [...prev, ...response.videos]
          );
          setLastKey(response.lastKey);
          setHasMore(!!response.lastKey);
        } else {
          console.error("Unexpected response format:", response);
          setError("Unexpected response format");
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to fetch videos");
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line
    [lastKey, hasMore]
  );

  useEffect(() => {
    fetchVideos(true);
    // eslint-disable-next-line
  }, []);

  return {
    videos,
    setVideos,
    error,
    loading,
    hasMore,
    lastKey,
    fetchVideos,
  };
};
