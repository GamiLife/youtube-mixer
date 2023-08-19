import { getFFMPEGContentStream, getStream } from '@/helpers/ytdl';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs, { Stats } from 'fs';
import { streamFile } from '@/helpers/streams';
import { TGetStream } from '@/types/conversion';
import { extensionEquivalents } from '@/helpers/data';

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ytUrl = searchParams.get('ytUrl');
    const extension = searchParams.get('extension');
    const itag = searchParams.get('itag');

    if (!ytUrl) throw new Error('Youtube Video Url was not passed.');
    if (!extension) throw new Error('extension was not passed.');
    if (!['mp3', 'mp4', 'mp4WithoutAudio'].includes(extension))
      throw new Error('Invalid Extension.');
    if (!itag) {
      throw new Error('Invalid itag.');
    }

    const validExtension =
      extensionEquivalents[extension as TGetStream['extension']];

    const fileName = 'downloadedFile.' + validExtension;
    const filepath = path.join(fileName);

    const options = {
      ytUrl,
      extension: extension as TGetStream['extension'],
      itag: +itag,
    };

    await getStream(options);
    await getFFMPEGContentStream(options.extension);

    const stats: Stats = await fs.promises.stat(filepath);
    const data: ReadableStream<Uint8Array> = streamFile(filepath);

    const res = new NextResponse(data, {
      status: 200,
      headers: new Headers({
        'content-disposition': `attachment; filename=${path.basename(
          filepath
        )}`,
        'content-type': 'application/octet-stream',
        'content-length': stats.size + '',
      }),
    });

    return res;
  } catch (error) {
    console.log('download endpoint error:', (error as Error).message);
    return new NextResponse(null, {
      status: 500,
    });
  }
}
