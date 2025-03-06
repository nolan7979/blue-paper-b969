import ArrowSVG from 'public/svg/arrow-down-line.svg';
import { useState } from 'react';
import tw from 'twin.macro';

import { BkbCountryLeagueRows } from '@/components/modules/basketball/fliters/BkbCountryLeagueRows';

import { SPORT } from '@/constant/common';
import { getImage, Images } from '@/utils';

export const BkbCategoryLeagues = ({
  cate,
  hrefPrefix,
}: {
  cate: any;
  hrefPrefix: string;
}) => {
  const [err, setErr] = useState(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const { alpha2 = '', name, slug, logo, flag, id, totalEvents } = cate || {};

  return (
    <>
      <div
        className='item-hover flex cursor-pointer items-center pr-4  text-base leading-4 lg:py-1 lg:pl-4'
        css={[showDetail ? tw`text-logo-blue` : '']}
        style={{ listStyle: 'outside' }}
        onClick={() => setShowDetail((x) => !x)}
      >
        <img
          loading='lazy'
          src={`${
            err
              ? `${process.env.NEXT_PUBLIC_API_DOMAIN_IMAGE_URL_2}/${(
                  alpha2 ||
                  flag ||
                  slug ||
                  ''
                ).toLowerCase()}.png`
              : `${getImage(Images.country, id, true, SPORT.BASKETBALL)}`
          }`}
          alt='...'
          className='border-none object-cover '
          style={{ borderRadius: '50%', listStyle: 'outside' }}
          width={24}
          height={24}
          // onError={() => setErr(true)}
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
      <div css={[showDetail ? tw`!block` : '!hidden']} className='hidden'>
        {showDetail && (
          <BkbCountryLeagueRows
            cate={cate}
            hrefPrefix={hrefPrefix}
          ></BkbCountryLeagueRows>
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
