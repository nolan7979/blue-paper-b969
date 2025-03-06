/* eslint-disable @next/next/no-img-element */
import { format } from 'date-fns';
import ArrowSVG from 'public/svg/arrow-down-line.svg';
import { memo, useState } from 'react';
import tw from 'twin.macro';

import {
  useFootballCategoryData,
  useFootballCategoryLeaguesData,
} from '@/hooks/useFootball';

import CustomLink from '@/components/common/CustomizeLink';
import { TwSearchInput } from '@/components/common/TwSearchInput';
import { CalendarFilter } from '@/components/filters';
import {
  TwCard,
  TwFilterTitle,
} from '@/components/modules/football/tw-components';

import { useHomeStore } from '@/stores';

import { TopLeaguesSkeleton } from '@/components/common/skeleton/homePage';
import { MainLeftMenu } from '@/components/menus';
import { LeaguesRow } from '@/components/modules/common/row/LeagueRow';
import { SPORT } from '@/constant/common';
import useTrans from '@/hooks/useTrans';
import { ILeaguesItems } from '@/models';
import { getImage, Images } from '@/utils';

export const FilterColumn = memo(
  function FilterColumn({ sport = SPORT.FOOTBALL }: { sport?: string }) {
    const i18n = useTrans();
    const { topLeagues } = useHomeStore();
    return (
      <div className='space-y-10'>
        <div className='space-y-3'>
          <div test-id='football-menu'>
            <MainLeftMenu sport={sport} />
          </div>
          <TwCard className=''>
            <CalendarFilter />
          </TwCard>
        </div>
        {topLeagues && topLeagues.length > 0 && (
          <div className='py-2'>
            <TwFilterTitle className='font-oswald'>
              {i18n.home.top_league}
            </TwFilterTitle>
            <TopLeauges leagues={topLeagues} sport={sport} />
          </div>
        )}
        {!topLeagues?.length && <TopLeaguesSkeleton className='py-2' />}

        {/* <TwCard className='py-2'>
        <TwFilterTitle>{i18n.home.ranking}</TwFilterTitle>
        <Rankings />
      </TwCard> */}
        <div className='py-2'>
          <TwFilterTitle className='font-oswald'>
            {i18n.home.all_leagues}
          </TwFilterTitle>
          <FooballAllLeauges />
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps?.sport === nextProps.sport;
  }
);

export const TopLeauges = ({
  leagues,
  sport,
}: {
  leagues: ILeaguesItems[];
  sport: string;
}) => (
  <div className='mt-4 flex flex-col gap-3 px-3 lg:mt-0 lg:gap-0 lg:space-y-0 lg:px-0' test-id='top-league-football'>
    {leagues?.length > 0 &&
      leagues?.map((league: ILeaguesItems) => (
        <LeaguesRow
          key={league.id}
          id={league.id}
          alt={league.name}
          sport={sport}
        />
      ))}
  </div>
);

export const FooballAllLeauges = ({
  hrefPrefix = '/football/competition',
}: {
  hrefPrefix?: string;
}) => {
  const currentDate = new Date();
  const dateToday = format(currentDate, 'yyyy-MM-dd');

  const [category, setCategory] = useState<string>('');

  const { data: allCates, isFetching, isLoading } = useFootballCategoryData();

  if (isLoading || isFetching || !allCates) {
    return <></>;
  }

  return (
    <AllLeaguesRep
      category={category}
      setCategory={setCategory}
      allCates={allCates}
      hrefPrefix={hrefPrefix}
    />
  );
};

export const AllLeaguesRep = ({
  category,
  setCategory,
  allCates = [],
  hrefPrefix = '/competition',
}: // i18n,
{
  category: any;
  setCategory: any;
  allCates?: any;
  hrefPrefix?: string;
  // i18n?: any;
}) => {
  const i18n = useTrans();
  return (
    <div className=''>
      <div>
        <form className='m-3 mt-1 flex gap-2.5 rounded-md border bg-primary-alpha-01 p-2.5 leading-4 text-[#8D8E92] dark:border-transparent dark:bg-[#151820]'>
          <SearchIcon />
          <TwSearchInput
            onChange={(e) => setCategory(e.target.value)}
            placeholder={`${i18n.home.search}...`}
            className='m-auto block w-full'
            defaultValue=''
            style={{ outline: 'none' }}
          />
        </form>
      </div>
      <div className='space-y-0.5'>
        {allCates.map((cate: any) => {
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
  sport?: string;
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
              : `${getImage(Images.country, id, true, SPORT.FOOTBALL)}`
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
        {showDetail ? <ArrowUpIcon></ArrowUpIcon> : <ArrowSVG />}
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

const TwContryLeageRow = tw.li`text-sm py-0.5 hover:bg-light-main dark:hover:bg-dark-hl-1 dark:hover:brightness-150 pr-4 cursor-pointer xl:py-1 pl-12`;
const CountryLeagueRows = ({
  cate = {},
  hrefPrefix,
}: {
  cate: any;
  hrefPrefix: string;
}) => {
  // const currentDate = new Date();
  // const dateToday = format(currentDate, 'yyyy-MM-dd');

  // const {
  //   data = {},
  //   isFetching,
  //   isLoading,
  // } = useFootballCategoryLeaguesDataWithDate(cate?.id, dateToday);

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
      <ul className='py-1'>
        {leagues.map((league: any) => (
          <TwContryLeageRow
            key={league?.id}
            className=' flex items-center gap-2'
          >
            <CustomLink
              href={`${hrefPrefix}/${cate?.slug}/${league?.slug}/${league?.id}`}
              target='_parent'
              className=''
            >
              <span className='inline-block w-40 truncate'>{league.name}</span>
            </CustomLink>
            <span className='text-xs'>
              {league.totalEvents && league.totalEvents !== 0
                ? league.totalEvents
                : ''}
            </span>
          </TwContryLeageRow>
        ))}
      </ul>
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
      width='16'
      height='17'
      viewBox='0 0 16 17'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M14.3538 14.6288L11.2244 11.5001C12.1314 10.4111 12.5837 9.01443 12.4872 7.60052C12.3906 6.18661 11.7527 4.86435 10.7061 3.9088C9.65951 2.95324 8.2848 2.43797 6.86796 2.47017C5.45113 2.50237 4.10125 3.07956 3.09913 4.08168C2.09702 5.08379 1.51983 6.43367 1.48763 7.85051C1.45543 9.26734 1.9707 10.642 2.92625 11.6887C3.88181 12.7353 5.20407 13.3732 6.61798 13.4697C8.03189 13.5662 9.42859 13.114 10.5175 12.2069L13.6463 15.3363C13.6927 15.3828 13.7479 15.4196 13.8086 15.4448C13.8693 15.4699 13.9343 15.4828 14 15.4828C14.0657 15.4828 14.1308 15.4699 14.1915 15.4448C14.2522 15.4196 14.3073 15.3828 14.3538 15.3363C14.4002 15.2899 14.4371 15.2347 14.4622 15.174C14.4874 15.1133 14.5003 15.0483 14.5003 14.9826C14.5003 14.9169 14.4874 14.8518 14.4622 14.7911C14.4371 14.7304 14.4002 14.6753 14.3538 14.6288ZM2.50002 7.98256C2.50002 7.09255 2.76394 6.22252 3.25841 5.4825C3.75287 4.74248 4.45568 4.1657 5.27795 3.82511C6.10021 3.48451 7.00501 3.3954 7.87793 3.56903C8.75084 3.74266 9.55266 4.17125 10.182 4.80058C10.8113 5.42992 11.2399 6.23174 11.4136 7.10466C11.5872 7.97757 11.4981 8.88237 11.1575 9.70464C10.8169 10.5269 10.2401 11.2297 9.50009 11.7242C8.76007 12.2186 7.89004 12.4826 7.00002 12.4826C5.80695 12.4812 4.66313 12.0067 3.8195 11.1631C2.97587 10.3195 2.50134 9.17563 2.50002 7.98256Z'
        fill='currentColor'
      />
    </svg>
  );
};
