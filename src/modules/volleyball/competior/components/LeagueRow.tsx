import React from 'react';
import Avatar from '@/components/common/Avatar';
// import CustomLink from '@/components/common/CustomizeLink';
import { getSlug } from '@/utils';
import RightArrowSVG from '/public/svg/right-arrow.svg';
import Link from 'next/link';

export const LeagueRow: React.FC<any> = ({ league }) => {
  return (
    <Link
      href={`/volleyball/competition/${getSlug(league?.name)}/${league?.id}`}
      className='cursor-pointer bg-transparent '
    >
      <div className='item-hover flex cursor-pointer items-center justify-between pr-2  lg:py-2 lg:pl-2'>
        <div className='flex items-center'>
          <Avatar
            id={league?.id}
            type='competition'
            width={36}
            height={36}
            isBackground={false}
            rounded={false}
            isSmall
            sport='volleyball'
          />
          <div className='flex flex-col gap-1'>
            <span
              className='mx-3 min-w-0 max-w-28 truncate text-left text-[13px] font-normal leading-5 text-black dark:text-white'
              style={{ listStyle: 'outside' }}
            >
              {league?.short_name || league?.name}
            </span>
          </div>
        </div>
        <RightArrowSVG />
      </div>
    </Link>
  );
};
