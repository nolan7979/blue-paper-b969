import React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { getImage, Images } from '@/utils';
import Avatar from '@/components/common/Avatar';

function Headertable({
  columns,
  home,
  away,
  selectTeam,
  onChange,
  sorted,
  onChangeSorted,
}: {
  columns: any;
  home: any;
  away: any;
  selectTeam: string;
  onChange: (value: string) => void;
  sorted: string;
  onChangeSorted: (value: string) => void;
}) {
  const { resolvedTheme } = useTheme();

  return (
    <thead>
      <tr
        className={`border-l border-t ${
          resolvedTheme === 'dark'
            ? 'border-[#696f75] border-opacity-30 bg-[#121214]'
            : ' bg-surface-1 '
        }`}
      >
        <th className={` text-xs  leading-4`}>
          <div className='w-10'></div>
        </th>
        <th
          className={`flex w-full min-w-[160px] max-w-[200px] items-center justify-center gap-3 border border-b-0 border-r-0 border-t-0 border-solid px-2 py-3 text-xs leading-4 ${
            resolvedTheme === 'dark' ? 'border-[#696f75] border-opacity-30' : ''
          }`}
        >
          <button
            className={`flex items-center gap-1 p-1 px-3 ${
              selectTeam === 'total' ? 'rounded-full bg-rega-blue' : ''
            } `}
            onClick={() => onChange('total')}
          >
            <Avatar
              id={home.id}
              type='team'
              isBackground={false}
              rounded={false}
              width={24}
              height={24}
            />

            <span> + </span>

            <Avatar
              id={away.id}
              type='team'
              isBackground={false}
              rounded={false}
              width={24}
              height={24}
            />
          </button>
          <button
            className={`p-1 ${
              selectTeam === 'home' ? 'rounded-full bg-rega-blue' : ''
            }`}
            onClick={() => onChange('home')}
          >
            <Avatar
              id={home.id}
              type='team'
              isBackground={false}
              rounded={false}
              width={24}
              height={24}
            />
          </button>
          <button
            className={`p-1 ${
              selectTeam === 'away' ? 'rounded-full bg-rega-blue' : ''
            }`}
            onClick={() => onChange('away')}
          >
            <Avatar
              id={away.id}
              type='team'
              isBackground={false}
              rounded={false}
              width={24}
              height={24}
            />
          </button>
        </th>
        {columns.map((column: any, index: number) => (
          <th
            key={index}
            className={`relative border  border-solid  px-1 text-xs font-semibold not-italic leading-4 ${
              column.header === 'Notes' ? '' : 'hover:cursor-pointer'
            } ${
              resolvedTheme === 'dark'
                ? 'border-[#696f75] border-opacity-30 text-[#7C7E83]'
                : 'text-surface-2'
            }`}
            onClick={
              column.header !== 'Notes'
                ? () => onChangeSorted(column.accessorKey)
                : undefined
            }
          >
            <p>{column.header}</p>
            {column.header === 'Notes' ? (
              <></>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='8'
                height='5'
                viewBox='0 0 8 5'
                fill='none'
                className={`absolute bottom-1 left-1/2 translate-x-[-50%] ${
                  `-${column.accessorKey}` === `${sorted}` ? 'rotate-180' : ''
                }`}
              >
                <path
                  d='M7.525 0L8 0.546875L4 5L0 0.546875L0.475 0L4 3.90625L7.525 0Z'
                  fill={`${
                    column.accessorKey === sorted ||
                    `-${column.accessorKey}` === `${sorted}`
                      ? '#2187E5'
                      : '#555'
                  }`}
                />
              </svg>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default Headertable;
