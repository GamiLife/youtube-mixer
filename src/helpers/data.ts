import { INiceFormat, TExtension, TFormatsGrouped } from '@/types/conversion';
import ytdl from 'ytdl-core';

/**
 * Template to format time element
 * @param value
 * @returns
 */
const template = (value: number) =>
  Math.floor(Number(value)).toString().padStart(2, '0');

/**
 * Transform seconds to this format: hh:mm:ss
 * @param seconds
 * @returns
 */
export const getTimeFormatBySeconds = (seconds: number) => {
  let rest = seconds;

  const hh = template(rest / 3600);
  rest = rest % 3600;

  const mm = template(rest / 60);
  rest = rest % 60;

  const ss = template(rest);

  return `${hh}:${mm}:${ss}`;
};

export const audioEquivalents = {
  AUDIO_QUALITY_LOW: 'Quality Low',
  AUDIO_QUALITY_MEDIUM: 'Quality Medium',
};

export const filterByExtension = (format: ytdl.videoFormat, itag: number) => ({
  mp3: format.hasAudio && !format.hasVideo && format.itag === itag,
  mp4: format.hasAudio && format.hasVideo && format.itag === itag,
  mp4WithoutAudio: !format.hasAudio && format.hasVideo && format.itag === itag,
});

export const transformToNiceFormat = (
  format: ytdl.videoFormat
): INiceFormat => ({
  audioQuality: format.audioQuality,
  videoQuality: format.qualityLabel,
  itag: format.itag,
  size: format.contentLength
    ? (+format.contentLength / 1024 / 1024).toFixed(2)
    : undefined,
  url: format.url,
});

export const extensionEquivalents: Record<TFormatsGrouped,TExtension> = {
  mp3: "mp3",
  mp4: "mp4",
  mp4WithoutAudio: "mp4"
}