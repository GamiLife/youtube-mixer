import { getYtInfo } from '@/helpers/ytdl';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const ybVideoUrl = request.nextUrl.searchParams.get('url');
    if (!ybVideoUrl) throw new Error('Youtube Video Url was not passed.');

    const ytVideoInfo = await getYtInfo(ybVideoUrl);

    const { videoDetails } = ytVideoInfo;
    const {
      title: videoTitle,
      lengthSeconds: videoDuration,
      thumbnails,
    } = videoDetails;
    const thumbnailsSortedBySize = thumbnails
      .slice()
      .sort((a, b) => b.width - a.width);

    const src = !thumbnails?.length ? '' : thumbnailsSortedBySize?.at(0)?.url;

    const response = {
      src,
      alt: videoTitle,
      videoTitle,
      videoDuration,
    };
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.error();
  }
}
