import { getTimeFormatBySeconds } from '@/helpers/data';
import { getYtInfo } from '@/helpers/ytdl';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const ybVideoUrl = request.nextUrl.searchParams.get('url');
    if (!ybVideoUrl) throw new Error('Youtube Video Url was not passed.');

    const ytVideoInfo = await getYtInfo(ybVideoUrl);

    const { videoDetails, formats: formatsYt } = ytVideoInfo;
    const { title: videoTitle, lengthSeconds, thumbnails } = videoDetails;
    const thumbnailsSortedBySize = thumbnails
      .slice()
      .sort((a, b) => b.width - a.width);

    const src = !thumbnails?.length ? '' : thumbnailsSortedBySize?.at(0)?.url;
    const videoDuration = getTimeFormatBySeconds(Number(lengthSeconds));
    const formats = formatsYt
      ?.filter((format) => format.qualityLabel)
      .map((format) => ({
        quality: format.qualityLabel,
        size: (+format.contentLength / 1024 / 1024).toFixed(2),
        url: format.url,
      }));

    const response = {
      src,
      alt: videoTitle,
      videoTitle,
      videoDuration,
      url: ybVideoUrl,
      formats,
    };
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.error();
  }
}
