import React from 'react';
import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { getSlug } from '@/utils';
import RightArrowSVG from '/public/svg/right-arrow.svg';

export const TeamRow: React.FC<any> = ({ team }) => {
  // const slug = getSlug(alt);
  return (
    <CustomLink
      href={`/`}
      className='cursor-pointer bg-transparent '
      target='_parent'
      disabled
    >
      <div className='item-hover flex cursor-pointer items-center justify-between pr-2  lg:py-2 lg:pl-2'>
        <div className='flex items-center'>
          <Avatar
            id={team?.id}
            type='competitor'
            width={36}
            height={36}
            isBackground={false}
            rounded={false}
            isSmall
          />
          <div className='flex flex-col gap-1'>
            <span
              className='mx-3 min-w-0 truncate text-left text-sm font-normal leading-5 text-white'
              style={{ listStyle: 'outside' }}
            >
              {team.short_name || team.name}
            </span>
            <span
              className='text- mx-3 min-w-0 truncate text-left text-msm font-normal leading-5'
              style={{ listStyle: 'outside' }}
            >
              {team.competition.short_name || team.name}
            </span>
          </div>
        </div>
        <RightArrowSVG />
      </div>
    </CustomLink>
  );
};
