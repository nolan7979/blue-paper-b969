/* eslint-disable @next/next/no-img-element */

import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';

import { getSlug } from '@/utils';

//  create LeaguesRowProps props
export interface LeaguesRowProps {
  alt: string;
  id: string;
  sport: string;
}

export const LeaguesRow = ({ alt, id, sport }: LeaguesRowProps) => {
  const slug = getSlug(alt);
  return (
    <CustomLink
      href={`/${sport}/competition/${slug}/${id}`}
      className='cursor-pointer bg-transparent '
    >
      <div className='item-hover flex cursor-pointer items-center pr-3  lg:py-1 lg:pl-3' test-id='league-football'>
        <div className='w-6 h-6'>
          <Avatar
            id={id}
            type='competition'
            width={24}
            height={24}
            isBackground={false}
            rounded={false}
            isSmall
          />
        </div>
        <span
          test-id='league-row'
          className='mx-3 min-w-0 truncate text-left text-sm font-normal leading-5'
          style={{ listStyle: 'outside' }}
        >
          {alt}
        </span>
      </div>
    </CustomLink>
  );
};
