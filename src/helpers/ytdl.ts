import ytdl from 'ytdl-core';

export const getYtInfo = async (ytUrl: string) => {
  const response = await ytdl.getInfo(ytUrl);
  return response;
};
