/* eslint-disable @next/next/no-img-element */

import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';

import { getSlug } from '@/utils';
import React from 'react';

export interface LeagueRowProps {
  alt: string;
  id: string;
}

export const LeagueRow = ({ alt, id }: LeagueRowProps) => {
  const slug = getSlug(alt);
  return (
    // <div className='item-hover flex cursor-pointer items-center pr-3  lg:py-1 lg:pl-3'>
    //   <Avatar
    //     id={id}
    //     type='competition'
    //     width={24}
    //     height={24}
    //     isBackground={false}
    //     rounded={false}
    //     isSmall
    //   />
    //   <span
    //     className='mx-3 min-w-0 truncate text-left text-sm font-normal leading-5'
    //     style={{ listStyle: 'outside' }}
    //   >
    //     {alt}
    //   </span>
    // </div>
    <CustomLink
      href={`/tennis/competition/${slug}/${id}`}
      className='cursor-pointer bg-transparent '
      disabledOnClick
    >
      <div className='item-hover flex cursor-pointer items-center pr-3  lg:py-1 lg:pl-3'>
        <Avatar
          id={id}
          type='competition'
          width={24}
          height={24}
          isBackground={false}
          rounded={false}
          isSmall
        />
        <span
           test-id='league-tennis-row'
          className='mx-3 min-w-0 truncate text-left text-sm font-normal leading-5'
          style={{ listStyle: 'outside' }}
        >
          {alt}
        </span>
      </div>
    </CustomLink>
  );
};
