import { getTimeFormatBySeconds } from '@/helpers/data';
import { getYtInfo } from '@/helpers/ytdl';
import { NextRequest, NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

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
      ?.filter((format) => format.qualityLabel)
      .reduce((acc, item) => {
        if (!item?.qualityLabel) return acc;

        const preset = acc?.[item.qualityLabel] ?? [];
        return {
          ...acc,
          [item.qualityLabel]: [...preset, item],
        };
      }, {} as Record<string, Array<ytdl.videoFormat>>);

    const formats = Object.values(formatsGrouped)
      .map((formatValue) => {
        const format = formatValue
          .sort((a, b) => +a.contentLength - +b.contentLength)
          ?.at(0);

        if (!format) return null;

        return {
          quality: format.qualityLabel,
          size: (+format.contentLength / 1024 / 1024).toFixed(2),
          qualityType: format.quality,
          url: format.url,
        };
      })
      .filter((format) => format !== null);

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
    console.log('search endpoint error:', error);
    return NextResponse.error();
  }
}
