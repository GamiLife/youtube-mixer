import { Button } from '@/componets/ui/Button';
import { useYtVideoStore } from '@/store';

export const DownloadTable = () => {
  const formats = useYtVideoStore((state) => state.metaInfo?.formats);

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
          {formats.map(({ quality, size, url }, index) => (
            <tr key={index} className="table w-full table-fixed">
              <td>{quality}</td>
              <td>{size}r</td>
              <td>
                <Button>Download</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
