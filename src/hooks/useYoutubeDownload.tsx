import { IDownloadYt } from '@/helpers/ytdl';
import { downloadFile } from '@/utils';

export const useYoutubeDownload = () => {
  const handleDownload = async (options: IDownloadYt) => {
    try {
      const response = await fetch(
        `/api/youtube-download?${new URLSearchParams({
          ...options,
        })}`,
        {
          method: 'POST',
        }
      );
      const blob = await response.blob();
      const newBlob = new Blob([blob]);

      downloadFile(newBlob, options.extension);
    } catch (error) {
      console.error('Donwload API error: ', error);
    }
  };

  return { handleDownload };
};
