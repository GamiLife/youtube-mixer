import { Button } from '@/componets/ui/Button';
import { TExtension } from '@/helpers/ytdl';
import { useYoutubeDownload } from '@/hooks';
import { useYtVideoStore } from '@/store';
import { FC } from 'react';

export interface IDownloadTable {
  extension: TExtension;
}
export const DownloadTable: FC<IDownloadTable> = ({ extension }) => {
  const ytUrl = useYtVideoStore((state) => state.metaInfo?.url);
  const formats = useYtVideoStore((state) => state.metaInfo?.formats);

  const { handleDownload } = useYoutubeDownload();

  return (
    <div className="flex flex-col gap-5">
      <table className="max-w-lg table-auto border-separate border-spacing-x-10 border-spacing-y-2">
        <thead>
          <tr className="table w-full table-fixed">
            <th className="font-bold text-lg text-center text-blue-500">
              Quality
            </th>
            <th className="font-bold text-lg text-center text-blue-500">
              Size
            </th>
            <th className="font-bold text-lg text-center text-blue-500">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="block max-h-[220px] overflow-y-scroll">
          {formats.map(({ quality, size, qualityType }, index) => (
            <tr key={index} className="table w-full table-fixed">
              <td>{quality}</td>
              <td>{size} MB</td>
              <td>
                <Button
                  onClick={() =>
                    handleDownload({
                      ytUrl,
                      qualityLabel: quality,
                      extension,
                    })
                  }
                >
                  Download
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
