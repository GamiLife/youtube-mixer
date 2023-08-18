import ytdl from 'ytdl-core';
import internal from 'node:stream';
import fs from 'fs';
import { streamToMp3, streamToMp4 } from './streams';

export type TExtension = 'mp4' | 'mp3';

export const getYtInfo = async (ytUrl: string) => {
  const response = await ytdl.getInfo(ytUrl);
  return response;
};

const getStream = ({
  ytUrl,
  qualityLabel,
  extension,
}: IDownloadYt): Promise<internal.Readable> => {
  const buffer: Array<any> = [];
  //Ref: https://nodejs.org/api/stream.html#class-streamreadable
  return new Promise((resolve, reject) => {
    const ytVideoInternalReadable = ytdl(ytUrl, {
      quality: 'highest',
      filter: (format: ytdl.videoFormat) => {
        const match = format.qualityLabel === qualityLabel;

        return match;
      },
    });

    ytVideoInternalReadable.on(
      'progress',
      (chunkLength, downloaded, total) => {}
    );

    ytVideoInternalReadable.pipe(
      fs
        .createWriteStream('sample.' + extension)
        .on('open', () => {
          console.log('Downloading Video');
        })
        .on('finish', async () => {
          console.log('YTDL Downloaded completed');
          resolve(ytVideoInternalReadable);
        })
        .on('error', async (error) => {
          reject('Error getting stream first part: ' + error.message);
        })
    );
  });
};

const getFFMPEGContentStream = async (extension: TExtension) => {
  if (extension === 'mp3') return await streamToMp3();
  return await streamToMp4();
};

export interface IDownloadYt {
  ytUrl: string;
  qualityLabel: ytdl.videoFormat['qualityLabel'];
  extension: TExtension;
}
export const downloadYt = async (options: IDownloadYt) => {
  await getStream(options);
  const finalStream = await getFFMPEGContentStream(options.extension);

  return finalStream;
};
