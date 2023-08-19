import { IMetaVideoInfo } from '@/types/conversion';
import { create } from 'zustand';

export interface IYtVideoStore {
  metaInfo: IMetaVideoInfo;
  setMetaInfo: (value: IMetaVideoInfo) => void;
}

export const useYtVideoStore = create<IYtVideoStore>((set) => ({
  metaInfo: {
    src: 'https://blog.rincondelvago.com/wp-content/themes/publisher/images/default-thumb/publisher-lg.png',
    alt: 'Youtube Cover',
    videoTitle: 'Here will be your video title',
    videoDuration: 'Here will be your video duration',
    url: '',
  },
  setMetaInfo: (value: IMetaVideoInfo) =>
    set((state: IYtVideoStore) => ({
      ...state,
      metaInfo: value,
    })),
}));
