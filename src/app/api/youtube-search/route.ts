import { getTimeFormatBySeconds, transformToNiceFormat } from '@/helpers/data';
import { getYtInfo } from '@/helpers/ytdl';
import { INiceFormat } from '@/types/conversion';
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
    const formatsGrouped = formatsYt
      ?.filter((format) => format.qualityLabel || format.audioQuality)
      .reduce((acc, format) => {
        const conditions = [
          {
            label: 'mp3',
            condition: format.hasAudio && !format.hasVideo,
          },
          {
            label: 'mp4',
            condition: format.hasAudio && format.hasVideo,
          },
          {
            label: 'mp4WithoutAudio',
            condition: !format.hasAudio && format.hasVideo,
          },
        ];

        const formatApplied = conditions.find(({ condition }) => !!condition);
        if (!formatApplied) throw new Error('Any format matched');

        const { label } = formatApplied;
        const formatTransformed = transformToNiceFormat(format);

        const preset = acc[label] ?? [];
        return {
          ...acc,
          [label]: [...preset, formatTransformed],
        };
      }, {} as Record<string, Array<INiceFormat>>);

    const response = {
      src,
      alt: videoTitle,
      videoTitle,
      videoDuration,
      url: ybVideoUrl,
      formatsGrouped,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.log('search endpoint error:', (error as Error).message);
    return NextResponse.json(
      {
        error,
      },
      { status: 500, statusText: 'Error saearching video' }
    );
  }
}
