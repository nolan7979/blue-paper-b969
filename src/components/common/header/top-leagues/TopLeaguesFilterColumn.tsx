/* eslint-disable @next/next/no-img-element */
import { memo, useState } from 'react';
import tw from 'twin.macro';

import {
  useFootballCategoryData,
  useFootballCategoryLeaguesData,
} from '@/hooks/useFootball';

import { TwSearchInput } from '@/components/common/TwSearchInput';
import { TwFilterTitle } from '@/components/modules/football/tw-components';

import { TopLeauges } from '@/components/modules/football/filters/FilterColumn';
import useTrans from '@/hooks/useTrans';
import { useHomeStore } from '@/stores';
import { getImage, Images } from '@/utils';
import { useCategoriesStore } from '@/stores/categories-store';

export const TopLeaguesFilterColumn = memo(
  function TopLeaguesFilterColumn({ sport }: { sport: string }) {
    const i18n = useTrans();
    const { topLeagues } = useHomeStore();
    const [isSearching, setIsSearching] = useState<boolean>(false);

    return (
      <div className='space-y-4 bg-light-match p-2.5 dark:bg-dark-match'>
        {!isSearching && (
          <TwCardSearch className='py-2 '>
            <TwFilterTitle>{i18n.home.top_league}</TwFilterTitle>
            <TopLeauges leagues={topLeagues} sport={sport} />
          </TwCardSearch>
        )}

        <TwCardSearch className='py-2'>
          <TwFilterTitle>{i18n.home.all_leagues}</TwFilterTitle>
          <AllLeauges setIsSearching={setIsSearching} />
        </TwCardSearch>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.sport === nextProps.sport;
  }
);

export const AllLeauges = ({
  hrefPrefix = '/football/competition',
  setIsSearching,
}: {
  hrefPrefix?: string;
  setIsSearching?: any;
}) => {
  const i18n = useTrans();
  const [category, setCountry] = useState<string>('');
  const { categories } = useCategoriesStore();

  if (!categories) {
    return <></>;
  }

  return (
    <div className=''>
      <div>
        <form className='m-3 mt-1 flex rounded-xl border bg-opacity-[0.4] leading-4 text-light-default dark:border-light-default'>
          <SearchIcon></SearchIcon>
          <TwSearchInput
            onChange={(e) => {
              setCountry(e.target.value);
              if (e.target.value) {
                setIsSearching(true);
              } else {
                setIsSearching(false);
              }
            }}
            placeholder={`${i18n.home.nation}...`}
            className='m-auto block w-full'
            defaultValue=''
            style={{ outline: 'none' }}
          />
        </form>
      </div>
      <div className='divide-list'>
        {categories.map((cate: any) => {
          if (cate.name.toLowerCase().includes(category.toLowerCase())) {
            return (
              <CategoryLeagues
                key={cate?.id}
                cate={cate}
                hrefPrefix={hrefPrefix}
              ></CategoryLeagues>
            );
          }
        })}
      </div>
    </div>
  );
};

export const CategoryLeagues = ({
  cate,
  hrefPrefix,
}: {
  cate: any;
  hrefPrefix: string;
}) => {
  const [err, setErr] = useState(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const { alpha2 = '', name, slug, id, flag } = cate || {};

  return (
    <>
      <div
        className='item-hover flex cursor-pointer items-center  px-4 py-2 text-base leading-4'
        css={[showDetail ? tw`text-logo-blue` : '']}
        style={{ listStyle: 'outside' }}
        onClick={() => setShowDetail((x) => !x)}
      >
        {/* <Avatar id={id} type='country' /> */}
        <img
          src={`${
            err
              ? '/images/football/countries/europe.webp'
              : `${getImage(Images.country, id)}`
          }`}
          alt='...'
          className='border-none object-cover '
          style={{ borderRadius: '50%', listStyle: 'outside' }}
          width={24}
          height={24}
          onError={() => setErr(true)}
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
        {showDetail ? (
          <ArrowUpIcon></ArrowUpIcon>
        ) : (
          <ArrowDownIcon></ArrowDownIcon>
        )}
      </div>
      <div css={[showDetail ? tw`!block` : '!hidden']} className='hidden'>
        {showDetail && (
          <CountryLeagueRows
            cate={cate}
            hrefPrefix={hrefPrefix}
          ></CountryLeagueRows>
        )}
      </div>
    </>
  );
};

const TwContryLeageRow = tw.li`text-sm py-2 px-6 flex items-center hover:bg-light-main dark:hover:bg-dark-hl-1 dark:hover:brightness-150 cursor-pointer`;

const CountryLeagueRows = ({
  cate = {},
  hrefPrefix,
}: {
  cate: any;
  hrefPrefix: string;
}) => {
  const {
    data = {},
    isFetching,
    isLoading,
  } = useFootballCategoryLeaguesData(cate?.id);

  if (isLoading || isFetching || !data || data.length === 0) {
    return <></>;
  }
  const leagues = data[0]?.uniqueTournaments || [];

  return (
    <>
      <ul className=''>
        {leagues.map((league: any) => (
          <TwContryLeageRow key={league?.id} className=''>
            <a
              href={`${hrefPrefix}/${cate?.slug}/${league?.slug}/${league?.id}`}
            >
              <div className='my-auto w-72 truncate'>{league.name}</div>
            </a>
          </TwContryLeageRow>
        ))}
      </ul>
    </>
  );
};

const ArrowUpIcon = () => (
  <svg
    width={24}
    height={24}
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

const ArrowDownIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='currentColor'
    className='cursor-pointer dark:text-light-default'
  >
    <path
      fill='currentColor'
      d='M16.6 8.6L12 13.2 7.4 8.6 6 10 12 16 18 10z'
      className=''
    ></path>
  </svg>
);

const SearchIcon = () => {
  return (
    <svg
      width={24}
      height={24}
      viewBox='0 0 24 24'
      fill='currentColor'
      className='mx-4 my-2 flex-shrink-0 align-top '
      style={{ flexShrink: 0 }}
    >
      <path
        fill='currentColor'
        d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'
        style={{ flexShrink: 0 }}
        className='flex-shrink-0'
      />
    </svg>
  );
};

export const TwCardSearch = tw.div`
  rounded-md
  md:rounded-xl
  border
  // dark:border-2
  // shadow-dark-shadow-card
  // dark:shadow-md
  dark:shadow-dark-stroke
  dark:border-dark-stroke
  // dark:bg-dark-main
  // dark:bg-dark-hl-1
  dark:bg-dark-sub-bg-main
  bg-light
  border-light-line-stroke-cd
  // drop-shadow-sm
  text-light-default
  dark:text-dark-default
  font-normal
`;
