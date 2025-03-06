import ArrowSVG from 'public/svg/arrow-down-line.svg';
import { useState } from 'react';
import tw from 'twin.macro';

import { CountryLeagueRows } from '@/components/modules/common/filters/CountryLeagueRows';
import { getImage, Images } from '@/utils';
import Avatar from '@/components/common/Avatar';

export const CategoryLeagues = ({
  cate,
  hrefPrefix,
  sport,
}: {
  cate: any;
  hrefPrefix: string;
  sport: string;
}) => {
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const { name, id } = cate || {};

  return (
    <>
      <div
        className='item-hover flex cursor-pointer items-center pr-4  text-base leading-4 lg:py-1 lg:pl-4'
        css={[showDetail ? tw`text-logo-blue` : '']}
        style={{ listStyle: 'outside' }}
        onClick={() => setShowDetail((x) => !x)}
      >
        <Avatar
          id={id}
          type='country'
          width={24}
          height={24}
          isBackground={false}
          isSmall
          isObjectCover
        />
        <div
          className='flex-shrink-0 flex-grow basis-0 px-3 '
          style={{ listStyle: 'outside' }}
        >
          <span
            className='text-left  text-sm leading-5'
            style={{ listStyle: 'outside' }}
          >
            {name}
          </span>
        </div>
        {/* <div className='text-xs opacity-80'>
          {totalEvents && totalEvents !== 0 ? totalEvents : ''}
        </div> */}
        {showDetail ? <ArrowUpIcon /> : <ArrowSVG />}
      </div>
      <div className={`${showDetail ? 'block' : 'hidden'}`}>
        {showDetail && (
          <CountryLeagueRows
            cate={cate}
            hrefPrefix={hrefPrefix}
            sport={sport}
          />
        )}
      </div>
    </>
  );
};

const ArrowUpIcon = () => (
  <svg
    width={20}
    height={20}
    viewBox='0 0 24 24'
    fill='currentColor'
    className='align-top'
    style={{ listStyle: 'outside' }}
  >
    <path
      fill='currentColor'
      d='M12 8L6 14 7.4 15.4 12 10.8 16.6 15.4 18 14z'
      className='cursor-pointer'
      style={{ listStyle: 'outside' }}
    />
  </svg>
);
