/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import tw from 'twin.macro';

import useTrans from '@/hooks/useTrans';

import { TwMatchListContainer } from '@/components/modules/football/columns/MainColumnComponents';
// import {
//   MatchFilter,
//   SortOptions,
//   TwMatchListContainer,
// } from '@/components/football/MainColumnComponents';
import {
  TwFilterButton,
  TwMatchHeader,
} from '@/components/modules/football/tw-components';

import { useFilterStore, useOddsStore } from '@/stores';

import BetProviderSVG from '~/svg/bet-provider.svg';

export const TLCAMainColHeader = () => {
  return (
    <>
      <TwMatchListContainer className='flex'>
        <div className='divide-list-x flex w-full'>
          <TLCADateCell></TLCADateCell>
          <TLCADateCell></TLCADateCell>
          <TLCADateCell></TLCADateCell>
          <TLCADateCell></TLCADateCell>
          <TLCADateCell></TLCADateCell>
          <TLCADateCell></TLCADateCell>
          <TLCADateCell></TLCADateCell>
          <TLCADateCell></TLCADateCell>
          <TLCADateCell></TLCADateCell>
          <TLCADateCell></TLCADateCell>
          <TLCADateCell></TLCADateCell>
        </div>
      </TwMatchListContainer>
    </>
  );
};

export const TLCADateCell = () => {
  return (
    <div className='item-hover flex w-1/12 cursor-pointer flex-col place-content-center items-center gap-1.5 py-1'>
      <div className=' text-center text-ccsm font-extrabold leading-3 tracking-normal'>
        T2
      </div>
      <div className=' text-center text-xs leading-3 tracking-normal'>
        31/01
      </div>
    </div>
  );
};

export const TwTLCASmallCol = tw.div`
  shrink
  hidden
  gap-y-3
  w-1/6
  lg:(flex flex-col)
`;

export const TLCAMatchListHeader = () => {
  const { showOdds } = useOddsStore();
  const i18n = useTrans();

  return (
    <TwMatchListContainer className='h-auto bg-light-match text-csm dark:bg-dark-match'>
      <TwMatchHeader className='px-2'>
        <TwMatchListHeaderCell className=' flex-1'></TwMatchListHeaderCell>
        <TwMatchListHeaderCell className=' flex-1'>Team</TwMatchListHeaderCell>
        <TwMatchListHeaderCell className=' w-1/12'>1x2</TwMatchListHeaderCell>
        <TwMatchListHeaderCell className=' w-1/12'>1x2</TwMatchListHeaderCell>
        <TwMatchListHeaderCell className=' w-1/12'>Tỷ số</TwMatchListHeaderCell>
        <TwMatchListHeaderCell className=' w-1/12'>1x2</TwMatchListHeaderCell>
        <TwMatchListHeaderCell className=' w-1/12'>1x2</TwMatchListHeaderCell>
        <TwMatchListHeaderCell className=' w-1/12'>1x2</TwMatchListHeaderCell>
        <TwMatchListHeaderCell className=' w-1/12'>1x2</TwMatchListHeaderCell>
        <TwMatchListHeaderCell className=' w-1/12'>1x2</TwMatchListHeaderCell>
      </TwMatchHeader>
    </TwMatchListContainer>
  );
};

export const TLCAMatchList = ({ matches }: { matches: any[] }) => {
  return (
    <TwMatchListContainer className='h-auto  space-y-0.5 rounded-md'>
      {matches.map((match: any) => {
        return <TLCAMatchRow key={match?.id} match={match}></TLCAMatchRow>;
      })}
    </TwMatchListContainer>
  );
};

export const TLCAMatchRow = ({ match }: { match: any }) => {
  const {
    tournament,
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    startTimestamp,
  } = match || {};

  return (
    <div className='divide-list-x flex  rounded-md bg-light-match px-2 py-2 text-ccsm dark:bg-dark-match'>
      <div className='dev8 flex flex-1'>
        <div className=' flex flex-1 flex-col gap-1'>
          <div>League</div>
          <div>Time</div>
        </div>

        <div className=' w-1/2 space-y-1.5'>
          {/* Team 1 */}
          <div className='flex items-center gap-2'>
            <div className=''>
              <img
                src={`${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/team/${homeTeam?.id}/image`}
                width={18}
                height={18}
                alt=''
                className='rounded-full'
              ></img>
            </div>
            <div className='truncate'>{homeTeam?.name}</div>
          </div>

          {/* Team 2 */}
          <div className='flex items-center gap-2'>
            <div className=''>
              <img
                src={`${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/team/${awayTeam?.id}/image`}
                width={18}
                height={18}
                alt=''
                className='rounded-full'
              ></img>
            </div>
            <div>{awayTeam?.name}</div>
          </div>
        </div>
      </div>

      <TwTLCAColumn className=' w-1/12'>
        <div>1.43</div>
        <div>11.50</div>
      </TwTLCAColumn>
      <TwTLCAColumn className=' w-1/12'>
        <div>1.43</div>
        <div>11.50</div>
      </TwTLCAColumn>
      <TwTLCAColumn className=' w-1/12'>
        <div>81.43%</div>
        <div>91.50%</div>
      </TwTLCAColumn>
      <TwTLCAColumn className=' w-1/12'>
        <div>81.43%</div>
        <div>91.50%</div>
      </TwTLCAColumn>
      <TwTLCAColumn className=' w-1/12'>
        <div>81.43%</div>
        <div>91.50%</div>
      </TwTLCAColumn>
      <TwTLCAColumn className=' w-1/12'>
        <div>81.43%</div>
        <div>91.50%</div>
      </TwTLCAColumn>
      <TwTLCAColumn className=' w-1/12'>
        <div>81.43%</div>
        <div>91.50%</div>
      </TwTLCAColumn>
      <TwTLCAColumn className=' w-1/12 place-content-center'>
        <div>Xem</div>
      </TwTLCAColumn>
    </div>
  );
};

export const TwTLCAColumn = tw.div`flex flex-col gap-1 items-center`;

export const TwMatchListHeaderCell = tw.div`flex items-center place-content-center`;

export const TLCAMatchFilter = () => {
  const i18n = useTrans();
  const { matchTypeFilter, setMatchFilter } = useFilterStore();
  // const { setLoadMoreMatches } = useMatchStore();

  return (
    <div className='no-scrollbar flex gap-2 overflow-scroll px-1 py-1 xl:gap-3 xl:px-2'>
      <TwFilterButton
        isActive={matchTypeFilter === 'all'}
        onClick={() => setMatchFilter('all')}
        className='bg-all-blue'
      >
        {i18n.filter.all}
      </TwFilterButton>

      {/* <TwFilterButton
        className=''
        isActive={matchTypeFilter === 'by-time'}
        onClick={() => {
          setMatchFilter('by-time')
        }}
      >
        {matchTypeFilter === 'by-time'? 'Giải đấu': 'Thời gian'}
      </TwFilterButton> */}

      <TwFilterButton
        className=''
        isActive={matchTypeFilter === 'league'}
        onClick={() => setMatchFilter('league')}
      >
        {/* {i18n.filter.hot} */}
        Giải đấu
      </TwFilterButton>

      <TwFilterButton
        className=''
        isActive={matchTypeFilter === 'hot'}
        onClick={() => setMatchFilter('hot')}
      >
        {/* {i18n.filter.hot} */}
        Trận hot
      </TwFilterButton>

      <TwFilterButton
        className=''
        isActive={matchTypeFilter === 'following'}
        onClick={() => setMatchFilter('following')}
      >
        {/* {i18n.filter.hot} */}
        Theo dõi
      </TwFilterButton>

      <TwFilterButton
        className=''
        isActive={matchTypeFilter === 'country'}
        onClick={() => setMatchFilter('country')}
      >
        {/* {i18n.filter.finished} */}
        {i18n.home.nation}
      </TwFilterButton>

      <TwFilterButton
        className=''
        isActive={matchTypeFilter === 'setting'}
        onClick={() => setMatchFilter('setting')}
      >
        {/* {i18n.filter.hot} */}
        Cài đặt
      </TwFilterButton>
    </div>
  );
};

export const TwTLCAMatchRow = tw.div`flex md:rounded-md bg-light-match md:px-2 hover:bg-all-blue/20 dark:hover:brightness-150 dark:bg-dark-match`;

export const AllBetProviders = () => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const [category, setCountry] = useState<string>('');
  // const { data: allCates, isFetching, isLoading } = useFootballCategoryData();

  // if (isLoading || isFetching || !allCates) {
  //   return <></>;
  // }

  return (
    <div className='space-y-4 '>
      {/* Search */}
      <div className='px-2.5'>
        <form className='flex items-center rounded-xl border bg-opacity-[0.4] leading-4 text-light-default dark:border-light-default'>
          <div className='p-2'>
            <HiSearch className=' h-5 w-5'></HiSearch>
          </div>
          <input
            onChange={(e) => setCountry(e.target.value)}
            placeholder='...'
            className='m-auto block w-full cursor-text overflow-hidden overflow-ellipsis bg-transparent p-2 text-sm font-normal leading-tight'
            defaultValue=''
          />
        </form>
      </div>

      {/* List */}
      {/* <div className='divide-list text-csm'> */}
      <div className='text-csm'>
        <ProviderRow></ProviderRow>
        <ProviderRow></ProviderRow>
        <ProviderRow></ProviderRow>
        <ProviderRow></ProviderRow>
        <ProviderRow></ProviderRow>
        <ProviderRow></ProviderRow>
        <ProviderRow></ProviderRow>
        <ProviderRow></ProviderRow>
        <ProviderRow></ProviderRow>
        <ProviderRow></ProviderRow>
        <ProviderRow></ProviderRow>
        <ProviderRow></ProviderRow>
        <ProviderRow></ProviderRow>
        <ProviderRow></ProviderRow>
        <ProviderRow></ProviderRow>
        {showAll && (
          <>
            <ProviderRow></ProviderRow>
            <ProviderRow></ProviderRow>
            <ProviderRow></ProviderRow>
            <ProviderRow></ProviderRow>
            <ProviderRow></ProviderRow>
          </>
        )}
      </div>

      <div
        className='cursor-pointer text-center text-sm font-bold text-logo-blue'
        onClick={() => setShowAll(!showAll)}
      >
        {showAll ? 'Thu gọn' : 'Xem tất cả'}
      </div>
    </div>
  );
};

const ProviderRow = () => {
  return (
    <div className='item-hover flex cursor-pointer px-4 py-1.5'>
      <div className=' flex w-1/5 place-content-center'>
        <BetProviderSVG className='h-5 w-5'></BetProviderSVG>
      </div>
      <div className=' flex-1'>10Bet</div>
    </div>
  );
};
