import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import { ReadableOptions } from 'stream';

export const streamFile = (
  path: string,
  options?: ReadableOptions
): ReadableStream<Uint8Array> => {
  const downloadStream = fs.createReadStream(path, options);

  return new ReadableStream({
    start(controller) {
      downloadStream.on('data', (chunk: Buffer) =>
        controller.enqueue(new Uint8Array(chunk))
      );
      downloadStream.on('end', () => controller.close());
      downloadStream.on('error', (error: NodeJS.ErrnoException) =>
        controller.error(error)
      );
    },
    cancel() {
      downloadStream.destroy();
    },
  });
};

export const streamToMp3 = async (): Promise<fs.WriteStream> => {
  return new Promise((resolve, reject) => {
    const outputStream = fs.createWriteStream('downloadedFile.mp3');

    ffmpeg('sample.mp3')
      .output('downloadedFile.mp3')
      .on('progress', (progress) => {
        console.log('FFMPEG Progress: ', progress);
      })
      .on('end', () => {
        console.log('FFMPEG Conversion completed');
        return resolve(outputStream);
      })
      .on('err', (err) => {
        return reject(err);
      })
      .run();
  });
};

export const streamToMp4 = async (): Promise<fs.WriteStream> => {
  return new Promise((resolve, reject) => {
    const outputStream = fs.createWriteStream('downloadedFile.mp4');

    ffmpeg('sample.mp4')
      .output('downloadedFile.mp4')
      .on('progress', (progress) => {
        console.log('FFMPEG Progress: ', progress);
      })
      .on('end', () => {
        console.log('FFMPEG Conversion completed');
        return resolve(outputStream);
      })
      .on('err', (err) => {
        return reject(err);
      })
      .run();
  });
};
