import { Select } from '@/componets/ui/Select';
import { useState } from 'react';
import { DownloadTable } from './DownloadTable';
import { TExtension } from '@/helpers/ytdl';

export const Download = () => {
  const [extension, setExtension] = useState<TExtension>('mp4');

  return (
    <div className="flex flex-col gap-7">
      <div>
        <label htmlFor="countries" className="block mb-2 text-sm font-medium">
          Extension:
        </label>
        <Select
          value={extension}
          onChange={(e) => setExtension(e.target.value as TExtension)}
        >
          <Select.Option value="mp4">MP4</Select.Option>
          <Select.Option value="mp3">MP3</Select.Option>
        </Select>
      </div>

      <DownloadTable extension={extension} />
    </div>
  );
};
