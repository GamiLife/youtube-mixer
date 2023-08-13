import { Button } from '@/componets/ui/Button';
import { Select } from '@/componets/ui/Select';
import { useState } from 'react';
import { DownloadTable } from './DownloadTable';

export const Download = () => {
  const [type, setType] = useState('MP4');

  return (
    <div className="flex flex-col gap-7">
      <div>
        <label htmlFor="countries" className="block mb-2 text-sm font-medium">
          Extension:
        </label>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <Select.Option value="MP4">MP4</Select.Option>
          <Select.Option value="MP3">MP3</Select.Option>
        </Select>
      </div>

      <DownloadTable />
    </div>
  );
};
