import React from 'react';
import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { getSlug } from '@/utils';
import RightArrowSVG from '/public/svg/right-arrow.svg';

export const TeamRow: React.FC<any> = ({ team }) => {
  const slug = getSlug(team?.name);
  return (
    <CustomLink
      href={`/table-tennis/player/${team?.slug || slug}/${team.id}`}
      className='cursor-pointer bg-transparent '
    >
      <div className='item-hover flex cursor-pointer items-center justify-between pr-2  lg:py-2 lg:pl-2'>
        <div className='flex items-center'>
          <Avatar
            id={team?.id}
            type='team'
            width={36}
            height={36}
            isBackground={false}
            rounded={false}
            isSmall
          />
          <span
            className='mx-3 min-w-0 truncate text-left text-sm font-normal leading-5 text-black dark:text-white'
            style={{ listStyle: 'outside' }}
          >
            {team.short_name || team.name}
          </span>
        </div>
        <RightArrowSVG />
      </div>
    </CustomLink>
  );
};
