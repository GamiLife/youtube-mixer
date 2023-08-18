import { IDownloadYt } from '@/helpers/ytdl';
import { create } from 'zustand';

export interface IYtVideoStore {
  metaInfo: {
    src: string;
    alt: string;
    videoTitle: string;
    videoDuration: string;
    url: string;
    formats: {
      quality: IDownloadYt['qualityLabel'];
      qualityType: string;
      size: number;
      url: string;
    }[];
  };
  setMetaInfo: (value: IYtVideoStore['metaInfo']) => void;
}

export const useYtVideoStore = create<IYtVideoStore>((set) => ({
  metaInfo: {
    src: 'https://blog.rincondelvago.com/wp-content/themes/publisher/images/default-thumb/publisher-lg.png',
    alt: 'Youtube Cover',
    videoTitle: 'Here will be your video title',
    videoDuration: 'Here will be your video duration',
    url: '',
    formats: [],
  },
  setMetaInfo: (value: IYtVideoStore['metaInfo']) =>
    set((state: IYtVideoStore) => ({
      ...state,
      metaInfo: value,
    })),
}));
