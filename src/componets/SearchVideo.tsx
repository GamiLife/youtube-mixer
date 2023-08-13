'use client';

import { YoutubeCover } from './YoutubeCover';
import { Button } from './ui/Button';
import { FormField } from './ui/FormField';
import { Input } from './ui/Input';
import { useInput, useYoutubeSearch } from '@/hooks';

export const SearchVideo = () => {
  const { value, handleType } = useInput();
  const { youtubeCover, handleSearch } = useYoutubeSearch();

  return (
    <div className="max-w-md mx-auto p-5 flex flex-col gap-5">
      <FormField
        htmlFor="search_input"
        labelText={<span className="text-lg">Youtube Mixer</span>}
      >
        <div className="flex gap-5">
          <Input
            value={value}
            onChange={handleType}
            id="search_input"
            placeholder="Search your video..."
          />
          <Button onClick={(e) => handleSearch(value)}>Search</Button>
        </div>
      </FormField>

      <div>
        <YoutubeCover {...youtubeCover} />
      </div>
    </div>
  );
};
