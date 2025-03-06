/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaSort } from 'react-icons/fa';
import tw from 'twin.macro';

import { useWindowSize } from '@/hooks';
import {
  useLiveMatchDataTLK,
  useLiveMatchOddsDataTLK,
} from '@/hooks/useSportData';
import useTrans from '@/hooks/useTrans';

import { TwMatchListContainer } from '@/components/modules/football/columns/MainColumnComponents';
import { TwFilterButton } from '@/components/modules/football/tw-components';
import { FilterByLeagueBtn } from '@/components/modules/football/odds/ty-le-keo/FilterByLeagueBtn';
import { TLKSettingsPopOver } from '@/components/modules/football/odds/ty-le-keo/TLKSettingsPopOver';
import Skeleton from '@/components/Skeleton';

import {
  useFilterStore,
  useMatchStore,
  useOddsStore,
  useTLKMatchStore,
} from '@/stores';
import { useSortStore } from '@/stores/sort-store';

import { convertOdds, formatTimestamp, isValEmpty } from '@/utils';

export const TLKMainColHeader = () => {
  return (
    <div className=''>
      <TwMatchListContainer className='flex justify-between'>
        {/* Match filters */}
        <div className='hidden lg:inline-block'>
          <TLKMatchFilter></TLKMatchFilter>
        </div>

        <div className='flex items-center gap-2 lg:pr-2'>
          <TLKSortOptions></TLKSortOptions>
          {/* <TLKSettingsMenu></TLKSettingsMenu> */}
          <TLKSettingsPopOver></TLKSettingsPopOver>
        </div>

        {/* Odds filter */}
        {/* <OddsToggler /> */}
      </TwMatchListContainer>
    </div>
  );
};

export const TLKSortOptions = () => {
  const i18n = useTrans();
  const { tlkSortBy, setTlkSortBy } = useSortStore();

  return (
    <div className=' no-scrollbar flex gap-2 overflow-scroll px-1 xl:gap-3 xl:px-2'>
      <TwFilterButton
        icon={<FaSort className='' />}
        className=''
        // isActive={sortBy === 'time'}
        onClick={() => {
          setTlkSortBy('time');
          tlkSortBy === 'time' ? setTlkSortBy('league') : setTlkSortBy('time');
        }}
      >
        {tlkSortBy === 'time' ? i18n.sort.league : i18n.sort.time}
      </TwFilterButton>
    </div>
  );
};

export const BookmakerFiltersTLK = () => {
  // TODO icon for bookmakers
  return (
    <div className='flex place-content-center gap-2 px-4 pb-2.5 '>
      <BookmakerFilter id='31' name='Sbobet'></BookmakerFilter>
      <BookmakerFilter id='8' name='Bet365'></BookmakerFilter>
      <BookmakerFilter id='23' name='188bet'></BookmakerFilter>
      <BookmakerFilter id='17' name='M88'></BookmakerFilter>
      <BookmakerFilter id='24' name='12bet'></BookmakerFilter>
      <BookmakerFilter id='3' name='Crown'></BookmakerFilter>
      <BookmakerFilter id='22' name='10BET'></BookmakerFilter>
    </div>
  );
};

export const BookmakerFilter = ({ id, name }: { id: string; name: string }) => {
  const { selectedBookMaker, setSelectedBookMaker } = useOddsStore();

  return (
    <TwBookMakerFilter
      className=''
      onClick={() => {
        setSelectedBookMaker({
          id: `${id}`,
        });
      }}
      css={[
        `${selectedBookMaker?.id}` === `${id}` && tw`bg-logo-blue text-white`,
      ]}
    >
      {name}
    </TwBookMakerFilter>
  );
};
export const TwBookMakerFilter = tw.div`py-2.5 text-csm cursor-pointer px-2 border border-dark-text/30 rounded-md `;

export const TLKMatchListHeader = () => {
  // const { showOdds } = useOddsStore();
  const i18n = useTrans();

  return (
    <TwMatchListContainer className='h-auto bg-light-match text-csm dark:bg-dark-match'>
      <div className=' flex items-center rounded-md px-4 '>
        <div className='flex w-1/2 '>
          <TwMatchListHeaderCell className=' w-1/2'>Ngày</TwMatchListHeaderCell>
          <TwMatchListHeaderCell className=' flex-1'>
            Đội bóng
          </TwMatchListHeaderCell>
        </div>

        <TwMatchListHeaderCell className=' w-16'>Tỷ số</TwMatchListHeaderCell>

        <div className='flex flex-1 place-content-center'>
          <TwMatchListHeaderCell className=' w-20'>HDP</TwMatchListHeaderCell>
          <TwMatchListHeaderCell className=' w-20'>
            Tài xỉu
          </TwMatchListHeaderCell>
          <TwMatchListHeaderCell className=' w-20'>1x2</TwMatchListHeaderCell>
          <TwMatchListHeaderCell className=' w-20'>
            HT HDP
          </TwMatchListHeaderCell>
          <TwMatchListHeaderCell className=' w-20'>
            HT Tài xỉu
          </TwMatchListHeaderCell>
          <TwMatchListHeaderCell className=' w-20'>
            HT 1x2
          </TwMatchListHeaderCell>
        </div>
      </div>
    </TwMatchListContainer>
  );
};

export const TLKMatchList = () => {
  // const { matchTypeFilter } = useFilterStore();
  const { selectedBookMaker } = useOddsStore();
  const { matches, addMatches, setMatchesOdds } = useTLKMatchStore();

  const { data: liveMatches, isFetching: isFetchingLiveMatches } =
    useLiveMatchDataTLK('football');

  const { data: liveMatchesOdds, isFetching: isFetchingLiveMatchesOdds } =
    useLiveMatchOddsDataTLK('football', selectedBookMaker?.id.toString());

  useEffect(() => {
    if (liveMatches) {
      addMatches(liveMatches);
    }
  }, [liveMatches, addMatches]);

  useEffect(() => {
    if (liveMatchesOdds) {
      setMatchesOdds(liveMatchesOdds);
    }
  }, [liveMatchesOdds, setMatchesOdds]);

  if (
    isFetchingLiveMatches ||
    isValEmpty(matches) ||
    isFetchingLiveMatchesOdds
  ) {
    return (
      <div>
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton className='h-30 w-full' key={idx} />
        ))}
      </div>
    );
  }

  // let filteredMatches = liveMatches;
  // if (matchTypeFilter === 'hot') {
  //   filteredMatches = liveMatches;
  // }

  return (
    // <TwMatchListContainer className='h-auto  space-y-0.5 rounded-md'>
    //   {Object.keys(matches).map((matchId: any, idx: number) => {
    //     return <TLKMatchRow key={idx} matchId={matchId}></TLKMatchRow>;
    //   })}
    // </TwMatchListContainer>
    <></>
  );
};

export const TLKMatchRow = ({ matchId }: { matchId: any }) => {
  const router = useRouter();
  const { width } = useWindowSize();
  const { oddsType } = useOddsStore();
  const [err, setErr] = useState(false);
  const [err1, setErr1] = useState(false);
  const [err2, setErr2] = useState(false);

  const {
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    toggleShowSelectedMatch,
  } = useMatchStore();

  const matchData = useTLKMatchStore((state) => {
    return state.matches[`${matchId}`];
  });

  const matchOddsData = useTLKMatchStore((state) => {
    return state.matchesOdds[`${matchId}`];
  });

  // useEffect(() => {
  // }, [matchData, matchId]);

  // useEffect(() => {
  //   return () => {
  //   };
  // }, [matchId]);

  if (!matchData) {
    return <Skeleton className='h-20 w-full rounded-md' />;
  }

  const {
    id,
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    tournament = {},
    startTimestamp,
  } = matchData || {};
  const { uniqueTournament = {} } = tournament || {};

  const { std, hdp, tx, hdpHalf, txHalf, stdHalf } = matchOddsData || {};

  return (
    <div
      onClick={() => {
        if (width < 1024) {
          setSelectedMatch(`${id}`);
          router.push(`/football/match/${matchData?.slug}/${matchData?.id}`);
        } else {
          if (`${id}` === `${selectedMatch}`) {
            toggleShowSelectedMatch();
          } else {
            setShowSelectedMatch(true);
            setSelectedMatch(`${id}`);
          }
        }
      }}
      className='flex cursor-pointer rounded-md bg-light-match px-4 py-1.5 text-csm dark:bg-dark-match'
    >
      <div className=' flex w-1/2'>
        <div className='flex w-1/2 flex-col gap-1'>
          <div className=' flex h-8 items-center gap-2'>
            <div>
              <img
                src={`${
                  err
                    ? '/images/football/teams/unknown-team.png'
                    : `${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/unique-tournament/${uniqueTournament?.id}/image`
                }`}
                alt='...'
                width={24}
                height={24}
                onError={() => setErr(true)}
              ></img>
            </div>
            <div className='font-extrabold'>{uniqueTournament?.name}</div>
          </div>
          <div className='flex h-8 items-center gap-2'>
            {/* <StarBlank className='h-4 w-4'></StarBlank> */}
            {formatTimestamp(startTimestamp)}
          </div>
          <div></div>
        </div>

        {/* TEAMs */}
        <div className='flex-1 space-y-1'>
          {/* Team 1 */}
          <div className='flex h-8 items-center gap-2'>
            <div className=''>
              <img
                src={`${
                  err1
                    ? '/images/football/teams/unknown-team.png'
                    : `${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/team/${homeTeam?.id}/image`
                }`}
                width={24}
                height={24}
                alt=''
                className='rounded-full'
                onError={() => setErr1(true)}
              ></img>
            </div>
            <div className='font-extrabold'>{homeTeam.name}</div>
          </div>

          {/* Team 2 */}
          <div className='flex  h-8 items-center gap-2'>
            <div className=''>
              <img
                src={`${
                  err2
                    ? '/images/football/teams/unknown-team.png'
                    : `${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/team/${awayTeam?.id}/image`
                }`}
                width={24}
                height={24}
                alt=''
                className='rounded-full'
                onError={() => setErr2(true)}
              ></img>
            </div>
            <div className='font-extrabold'>{awayTeam?.name}</div>
          </div>

          {/* Row 3 */}
          {/* <div className='h-8 text-center'>Draw</div> */}
        </div>
      </div>

      <TwTLKColumn className=' w-16'>
        <TwScoreCell className='border-dark-text/20 text-base font-bold text-logo-blue'>
          {homeScore.display}
        </TwScoreCell>
        <TwScoreCell className='border-dark-text/20 text-base font-bold text-logo-yellow'>
          {awayScore.display}
        </TwScoreCell>
      </TwTLKColumn>

      <div className='flex flex-1 place-content-center'>
        <TwTLKColumn className=' w-20'>
          <OddsCellTLK marketData={hdp} oddsType={oddsType}></OddsCellTLK>
        </TwTLKColumn>

        <TwTLKColumn className=' w-20'>
          <OddsCellTLK marketData={tx} oddsType={oddsType}></OddsCellTLK>
        </TwTLKColumn>

        <TwTLKColumn className=' w-20'>
          <OddsCellTLK marketData={std} oddsType={oddsType}></OddsCellTLK>
        </TwTLKColumn>

        <TwTLKColumn className=' w-20'>
          <OddsCellTLK marketData={hdpHalf} oddsType={oddsType}></OddsCellTLK>
        </TwTLKColumn>

        <TwTLKColumn className=' w-20'>
          <OddsCellTLK marketData={txHalf} oddsType={oddsType}></OddsCellTLK>
        </TwTLKColumn>

        <TwTLKColumn className=' w-20'>
          <OddsCellTLK marketData={stdHalf} oddsType={oddsType}></OddsCellTLK>
        </TwTLKColumn>
      </div>

      {/* <TwTLKColumn className=' w-16'></TwTLKColumn>
      <TwTLKColumn className=' w-16'></TwTLKColumn> */}
    </div>
  );
};

export const OddsCellTLK = ({
  marketData,
  oddsType,
}: {
  marketData: any;
  oddsType: string;
}) => {
  const {
    // structureType,
    marketId,
    // marketName,
    // isLive,
    // suspended,
    // id,
    choices = [],
    // choiceGroup,
  } = marketData || {};
  const [homeOdds = {}, drawOdds = {}, awayOdds = {}] = choices || [];

  return (
    <>
      <TwOddsCell className='  flex-col border-dark-text/20'>
        {convertOdds(homeOdds.v || homeOdds.iv, marketId, oddsType, 1)}
      </TwOddsCell>
      <TwOddsCell className='  flex-col  border-dark-text/20'>
        {convertOdds(drawOdds.v || drawOdds.iv, marketId, oddsType, 2)}
      </TwOddsCell>
      <TwOddsCell className='  flex-col border-dark-text/20'>
        {/* {marketId === 'std1x2' && (
          <div className='text-xxs text-dark-text'>Hoà</div>
        )}
        {(marketId === 'hdp' || marketId === 'tx') && (
          <div className='text-xxs text-dark-text'>HDP</div>
        )} */}

        <div>
          {convertOdds(awayOdds.v || awayOdds.iv, marketId, oddsType, 3)}
        </div>
      </TwOddsCell>
    </>
  );
};

export const TwScoreCell = tw.div`flex h-8 w-10 place-content-center items-center rounded-sm border`;
export const TwOddsCell = tw.div`flex h-8 w-16 place-content-center items-center rounded-sm border`;
export const TwTLKColumn = tw.div`flex flex-col gap-1 items-center`;
export const TwMatchListHeaderCell = tw.div`flex items-center place-content-center`;

export const TLKMatchFilter = () => {
  const i18n = useTrans();
  const { matchTypeFilter, setMatchFilter } = useFilterStore();

  return (
    <div className='no-scrollbar flex gap-2 overflow-scroll px-1 py-1 xl:gap-3 xl:px-2'>
      <TwFilterButton
        isActive={matchTypeFilter === 'all'}
        onClick={() => setMatchFilter('all')}
        className='bg-all-blue'
      >
        {i18n.filter.all}
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

      <FilterByLeagueBtn></FilterByLeagueBtn>
    </div>
  );
};

export const TwTLKMatchRow = tw.div`flex md:rounded-md bg-light-match md:px-2 hover:bg-all-blue/20 dark:hover:brightness-150 dark:bg-dark-match`;
