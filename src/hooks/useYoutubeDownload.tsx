import { extensionEquivalents } from '@/helpers/data';
import { IDownloadYt } from '@/types/conversion';
import { downloadFile } from '@/utils';

// Ref: https://fetch-progress.anthum.com/
async function* streamAsyncIterable(stream: any) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

// Ref: https://github.com/anthumchris/fetch-progress-indicators/blob/master/fetch-basic/supported-browser.js
export const loopChunks = async (response: any) => {
  let responseSize = 0;
  for await (const chunk of streamAsyncIterable(response.body)) {
    responseSize += chunk.length;
  }
};

export const useYoutubeDownload = () => {
  const handleDownload = async (options: IDownloadYt) => {
    try {
      const url = `/api/youtube-download?${new URLSearchParams(
        JSON.parse(JSON.stringify(options))
      )}`;
      const response: any = await fetch(url, {
        method: 'POST',
      });
      const blob = await response.blob();

      const newBlob = new Blob([blob]);
      const validExtension = extensionEquivalents[options.extension];
      downloadFile(newBlob, validExtension);
    } catch (error) {
      console.error('Donwload API error: ', error);
    }
  };

  return { handleDownload };
};
