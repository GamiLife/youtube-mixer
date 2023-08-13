import { isUrl } from '@/validators';
import { useState } from 'react';

export const useYoutubeSearch = () => {
  const [youtubeCover, setYoutubeCover] = useState({
    src: 'https://blog.rincondelvago.com/wp-content/themes/publisher/images/default-thumb/publisher-lg.png',
    alt: 'Youtube Cover',
    videoTitle: 'Here will be your video title',
    videoDuration: 'Here will be your video duration',
  });

  const handleSearch = async (url: string) => {
    const isValidUrl = isUrl(url);

    if (!isValidUrl) {
      return;
    }

    try {
      const response = await fetch(
        `/api/youtube-search?${new URLSearchParams({
          url,
        })}`
      );
      const data = await response.json();
      setYoutubeCover(data);
    } catch (error) {
      console.error('Search API error: ', error);
    }
  };

  return { youtubeCover, handleSearch };
};
