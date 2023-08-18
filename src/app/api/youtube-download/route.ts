import { downloadYt, IDownloadYt } from '@/helpers/ytdl';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs, { Stats } from 'fs';
import { streamFile } from '@/helpers/streams';

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ytUrl = searchParams.get('ytUrl');
    const qualityLabel = searchParams.get('qualityLabel');
    const extension = searchParams.get('extension');
    if (!ytUrl) throw new Error('Youtube Video Url was not passed.');
    if (!qualityLabel) throw new Error('QualityLabel was not passed.');
    if (!extension) throw new Error('QualityLabel was not passed.');
    if (!['mp3', 'mp4'].includes(extension))
      throw new Error('Invalid Extension.');

    await downloadYt({
      ytUrl,
      qualityLabel: qualityLabel as IDownloadYt['qualityLabel'],
      extension: extension as IDownloadYt['extension'],
    });

    const fileName = 'downloadedFile.' + extension;
    const filepath = path.join(fileName);

    const stats: Stats = await fs.promises.stat(filepath);
    const data: ReadableStream<Uint8Array> = streamFile(filepath);
    const res = new NextResponse(data, {
      status: 200,
      headers: new Headers({
        'content-disposition': `attachment; filename=${path.basename(
          filepath
        )}`,
        'content-type': 'application/iso',
        'content-length': stats.size + '',
      }),
    });

    return res;
  } catch (error) {
    console.log('download endpoint error:', error);
    return NextResponse.json({
      error,
    });
  }
}
