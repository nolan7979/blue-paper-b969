import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { twMerge } from 'tailwind-merge';
import tw from 'twin.macro';

import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/common';
import QuickViewDetailTab from '@/components/modules/cricket/quickviewColumn/quickviewDetailTab';

import { useMatchStore, useMatchStore2nd } from '@/stores';

import QuickViewSummary from '@/components/modules/cricket/quickviewColumn/QuickViewSummary';
import { SportEventDto, SportEventDtoWithStat } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { QuickViewFilter } from '@/modules/cricket/liveScore/components/QuickViewFilter';
import { compareFields, isValEmpty } from '@/utils';
import { useSelectedMatchData } from '@/hooks/useCricket';
import { SOCKET_CHAT_TOPIC, SPORT } from '@/constant/common';
import { QuickViewChatTab } from '@/components/modules/common/quickviewChat';
import { isEqual } from 'lodash';

const QuickViewMatchesTab = dynamic(
  () =>
    import('@/components/modules/cricket/quickviewColumn/quickViewMatchesTab'),
  { ssr: false }
);

const QuickViewSquadTab = dynamic(
  () =>
    import('@/components/modules/cricket/quickviewColumn/QuickViewSquadTab'),
  { ssr: false }
);
const QuickViewStandingsTab = dynamic(
  () =>
    import(
      '@/components/modules/cricket/quickviewColumn/QuickViewStandingsTab'
    ),
  { ssr: false }
);
const QuickViewStatsTab = dynamic(
  () =>
    import('@/components/modules/football/quickviewColumn/QuickViewStatsTab'),
  { ssr: false }
);

type QuickViewColumnProps = {
  top?: boolean;
  sticky?: boolean;
  matchId?: string;
  isDetail?: boolean;
  isBreadCumb?: boolean;
  matchData?: SportEventDtoWithStat;
  featureMatchData?: SportEventDtoWithStat;
};

export const QuickViewColumn = ({
  top = true,
  sticky = true,
  matchId,
  isDetail,
  matchData,
}: QuickViewColumnProps) => {
  const matchDataRef = useRef<SportEventDtoWithStat | null>(null);
  const [activeTab, setActiveTab] = useState<string>('details');
  const [dataNull, setDataNull] = useState<boolean>(false);
  const {
    showSelectedMatch,
    selectedMatch,
    setShowSelectedMatch,
    matchDetails,
  } = useMatchStore();

  const { data } = useSelectedMatchData(
    matchId || selectedMatch || matchData?.id || ''
  );

  const matchShowData: any = useMemo(() => {
    if (isDetail) {
      return data; // show detail match
    }

    const fieldsToCompare = ['scores', 'status', 'serve', 'extraScores'];

    const fieldsChanged = compareFields(data, matchDetails, fieldsToCompare);

    if (
      (!isEqual(matchDataRef.current, matchDetails) ||
        fieldsChanged.length > 0) &&
      matchDetails &&
      data
    ) {
      matchDataRef.current = matchDetails;
      fieldsChanged.forEach((field) => {
        data[field] = matchDetails[field];
      });
      return data;
    }
    return data;
  }, [data, matchDetails]);

  const memoizedShowSelectedMatch = useMemo(
    () => showSelectedMatch,
    [showSelectedMatch]
  );
  const memoizedSelectedMatch = useMemo(() => selectedMatch, [selectedMatch]);

  useEffect(() => {
    setActiveTab('details');
  }, [memoizedSelectedMatch, matchId]);

  useEffect(() => {
    if (isDetail && !memoizedShowSelectedMatch) {
      setShowSelectedMatch(true);
    }
    // if (matchShowData) setFirstLoad(false);
  }, [isDetail, memoizedShowSelectedMatch, setShowSelectedMatch]);


  useEffect(() => {
    if (matchShowData && Object.keys(matchShowData).length === 0 && !dataNull) {
      const timeout = setTimeout(() => {
        setDataNull(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [matchData]);
  const {
    status,
    lineup,
    has_standing,
    has_player_stats,
    has_highlight: hasHighlight = false,
    has_lineup,
  } = useMemo(() => matchShowData || {}, [matchShowData]);
  
  if (matchShowData && Object.keys(matchShowData).length === 0 && dataNull) {
    return null;
  }

  return (
    <div
      className={clsx({ 'w-full lg:h-[91vh]': sticky, 'mt-2': !isDetail })}
      css={[top && tw`top-[5.375rem]`, sticky && tw`sticky z-[9]`]}
    >
      <div className='h-full no-scrollbar lg:overflow-y-scroll'>
        {/* Ty so */}
        <div className={clsx({ 'lg:hidden': isDetail })}>
          <QuickViewSummary
            match={matchShowData as SportEventDtoWithStat}
            isSelectMatch={memoizedShowSelectedMatch}
            isDetail={isDetail}
          />
        </div>
        <div className='space-y-4 '>
          <div className='sticky top-[3.313rem] z-[11] lg:relative lg:top-0'>
            {/* Filter */}
            <QuickViewFilter
              isHaveData={!!matchShowData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              status={status}
              has_standing={has_standing}
              has_player_stats={has_player_stats}
              hasHighlight={hasHighlight}
              has_lineup={has_lineup}
            />
          </div>
          <Divider className='!mt-0'></Divider>

          {/* <RenderIf isTrue={!matchShowData && firstLoad}>
              <QuickViewColumnSkeleton />
            </RenderIf> */}

          {activeTab === 'details' && matchShowData && (
            <QuickViewDetailTab
              isDetail={isDetail}
              matchData={matchShowData as SportEventDtoWithStat}
              setActiveTab={setActiveTab}
              sport={SPORT.CRICKET}
            />
          )}
          {activeTab === 'squad' && matchShowData && (
            <QuickViewSquadTab matchData={matchShowData as SportEventDto} />
          )}
          {/* {activeTab === 'stats' && (matchShowData || memoizedMatchDetails) && (
            <QuickViewStatsTab
              matchData={
                (matchShowData as SportEventDto) || memoizedMatchDetails
              }
            />
          )} */}
          {activeTab === 'matches' && matchShowData && (
            <QuickViewMatchesTab
              matchData={matchShowData as SportEventDtoWithStat}
            />
          )}
          {activeTab === 'standings' && matchShowData && (
            <QuickViewStandingsTab
              isPlayerStats={has_player_stats}
              isStandings={has_standing}
              wide={false}
              matchData={matchShowData as SportEventDto}
            />
          )}
          {/* {activeTab === 'odds' &&
            matchShowData &&
            Object.keys(matchShowData).length > 0 && (
              <QuickViewOddsTab
                matchData={
                  (matchShowData as SportEventDto) || memoizedMatchDetails
                }
              />
            )} */}

          {/* {activeTab === 'top-score' &&
            data &&
            Object.keys(matchShowData).length > 0 && (
              <QuickViewTopScore
                matchData={
                  (matchShowData as SportEventDto) || memoizedMatchDetails
                }
              />
            )} */}

          {activeTab === 'chat' && (
            <QuickViewChatTab sport={SOCKET_CHAT_TOPIC.cricket} />
          )}

          {/* {activeTab === 'highlight' && highlights && (
            <QuickViewHighlight highlights={highlightShow} />
          )} */}

          {/* {matchShowData && Object.keys(matchShowData).length > 0 && (
            <HeadSection
              matchData={(matchShowData as SportEventDto) || memoizedMatchDetails}
            ></HeadSection>
          )} */}
        </div>
      </div>
    </div>
  );
};
// (prevProps: QuickViewColumnProps, nextProps: QuickViewColumnProps) => {
//   return (
//     prevProps?.matchId === nextProps.matchId &&
//     prevProps?.isDetail === nextProps.isDetail &&
//     prevProps?.top === nextProps.top &&
//     prevProps?.sticky === nextProps.sticky
//   );
// }

export const QuickViewColumn2nd = ({
  top = true,
  sticky = true,
  type2nd = false,
}: {
  top?: boolean;
  sticky?: boolean;
  type2nd?: boolean;
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const i18n = useTrans();
  const { showSelectedMatch, selectedMatch, setShowSelectedMatch } =
    useMatchStore2nd();

  if (isValEmpty(selectedMatch) || !showSelectedMatch) {
    setShowSelectedMatch(false);
  }

  const { data, isLoading } = useSelectedMatchData(
    selectedMatch || '',
    15000,
    10000
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || Object.keys(data).length === 0) {
    return <></>;
  }

  const { tournament, roundInfo, lineup, status, season } =
    data as SportEventDto;
  const { category } = tournament;
  let round = '';
  if (!isValEmpty(roundInfo.round) && roundInfo.name) {
    round = `, ${roundInfo.name}`;
  } else if (!isValEmpty(roundInfo.round)) {
    round = `, ${i18n.football.round} ${roundInfo.round}`;
  }

  return (
    <div
      className='h-[91vh]'
      css={[top && tw`top-16`, sticky && tw`sticky z-10`]}
    >
      <div className='h-full space-y-4 overflow-y-scroll no-scrollbar'>
        <div className='flex justify-between '>
          <div className=' flex items-center gap-2 overflow-hidden text-xs font-extralight'>
            <BreadCumbLink
              href={`/country/football/${category ? category.slug : ''}`}
              name={category ? category.name : ''}
            />
            <BreadCrumbSep></BreadCrumbSep>
            <BreadCumbLink
              href={`/football/competition/${tournament.slug}/${
                tournament?.id || tournament?.id
              }`}
              name={`${tournament.name}${round}`}
              classes=' '
            />
          </div>
          <button
            className='item-hover rounded-lg p-1 dark:text-dark-text'
            onClick={() => setShowSelectedMatch(false)}
          >
            <HiOutlineX className='h-5 w-6'></HiOutlineX>
          </button>
        </div>
        {/* Ty so */}
        {data && Object.keys(data).length > 0 && (
          <QuickViewSummary
            match={data as SportEventDtoWithStat}
            isSelectMatch={showSelectedMatch}
          />
        )}

        {/* Filter */}
        <QuickViewFilter
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lineup={lineup}
          status={status}
        />
        <Divider></Divider>

        {activeTab === 'details' && data && Object.keys(data).length !== 0 && (
          <QuickViewDetailTab matchData={data as SportEventDtoWithStat} />
        )}
        {activeTab === 'squad' && data && Object.keys(data).length !== 0 && (
          <QuickViewSquadTab matchData={data as SportEventDto} />
        )}
        {activeTab === 'stats' && data && Object.keys(data).length !== 0 && (
          <QuickViewStatsTab matchData={data as SportEventDto} />
        )}
        {activeTab === 'matches' && data && Object.keys(data).length !== 0 && (
          <QuickViewMatchesTab
            matchData={data as SportEventDtoWithStat}
            type2nd={true}
          />
        )}
        {activeTab === 'standings' &&
          data &&
          Object.keys(data).length !== 0 && (
            <>
              <QuickViewStandingsTab
                wide={false}
                matchData={data as SportEventDto}
              />
            </>
          )}
      </div>
    </div>
  );
};

export const Divider = ({ className }: { className?: string }) => {
  return <div className={clsx(twMerge(className, 'divide-single'))}></div>;
};

export const TwQuickviewTeamName = tw.div`lg:text-center text-[11px] font-bold text-white lg:text-dark-dark-blue lg:dark:text-white line-clamp-3 overflow-hidden text-ellipsis`;
