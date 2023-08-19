import ytdl from 'ytdl-core';
import internal from 'node:stream';
import fs from 'fs';
import { streamToMp3, streamToMp4 } from './streams';
import { extensionEquivalents, filterByExtension } from './data';
import { TFormatsGrouped, TGetStream } from '@/types/conversion';

export const getYtInfo = async (ytUrl: string) => {
  const response = await ytdl.getInfo(ytUrl);
  return response;
};

const filterYTDLVideo =
  (moreOptions: Omit<TGetStream, 'ytUrl'>) => (format: ytdl.videoFormat) => {
    const match = filterByExtension(format, moreOptions.itag)[
      moreOptions.extension
    ];

    return match;
  };

export const getStream = ({
  ytUrl,
  ...moreOptions
}: TGetStream): Promise<internal.Readable> => {
  //Ref: https://nodejs.org/api/stream.html#class-streamreadable
  return new Promise((resolve, reject) => {
    const ytVideoInternalReadable = ytdl(ytUrl, {
      filter: filterYTDLVideo(moreOptions),
    });

    ytVideoInternalReadable.on('error', (error) => {
      reject(Error('Error getting yt video: ' + error.message));
    });

    ytVideoInternalReadable.on(
      'progress',
      (chunkLength, downloaded, total) => {}
    );

    const validExtension = extensionEquivalents[moreOptions.extension];
    ytVideoInternalReadable.pipe(
      fs
        .createWriteStream('sample.' + validExtension)
        .on('open', () => {
          console.log('Downloading Video');
        })
        .on('finish', async () => {
          console.log('YTDL Downloaded completed');
          resolve(ytVideoInternalReadable);
        })
        .on('error', async (error) => {
          reject(Error('Error getting stream first part: ' + error.message));
        })
    );
  });
};

export const getFFMPEGContentStream = async (extension: TFormatsGrouped) => {
  if (extension === 'mp3') return await streamToMp3();
  return await streamToMp4();
};

export const downloadYt = async (options: TGetStream) => {
  await getStream(options);
  const finalStream = await getFFMPEGContentStream(options.extension);

  return finalStream;
};
