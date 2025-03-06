import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { twMerge } from 'tailwind-merge';
import tw from 'twin.macro';

import {
  useFeaturedMatchdaily,
  // useSelectedMatchData,
} from '@/hooks/useFootball';
import { useSelectedMatchData } from '@/hooks/useCommon';

import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/common';
import QuickViewDetailTab from '@/components/modules/snooker/quickviewColumn/quickviewDetailTab';

import { useMatchStore, useMatchStore2nd } from '@/stores';

import { QuickviewColumnWrapper } from '@/components/modules/common/QuickviewWrapper';
import { QuickViewChatTab } from '@/components/modules/common/quickviewChat';
import { MatchStateIdToMatchState } from '@/components/modules/snooker/match';
import QuickViewSummary from '@/components/modules/snooker/quickviewColumn/QuickViewSummary';
import QuickviewCommentary from '@/components/modules/snooker/quickviewColumn/QuickviewCommentary';
import { SOCKET_CHAT_TOPIC, SPORT } from '@/constant/common';
import {
  SportEventDto,
  SportEventDtoWithStat,
  matchStateIdToMatchState,
} from '@/constant/interface';
import useMqttClient from '@/hooks/useMqtt';
import useTrans from '@/hooks/useTrans';
import { QuickViewFilter } from '@/modules/snooker/liveScore/components/QuickViewFilter';
import { isValEmpty } from '@/utils';
import { convertStatusCode } from '@/utils/convertInterface';

const QuickViewMatchesTab = dynamic(
  () =>
    import('@/components/modules/snooker/quickviewColumn/quickViewMatchesTab'),
  { ssr: false }
);
const QuickViewOddsTab = dynamic(
  () =>
    import('@/components/modules/snooker/quickviewColumn/QuickViewOddsTab'),
  { ssr: false }
);
const QuickViewSquadTab = dynamic(
  () =>
    import('@/components/modules/snooker/quickviewColumn/QuickViewSquadTab'),
  { ssr: false }
);
const QuickViewStandingsTab = dynamic(
  () =>
    import(
      '@/components/modules/snooker/quickviewColumn/QuickViewStandingsTab'
    ),
  { ssr: false }
);
const QuickViewStatsTab = dynamic(
  () =>
    import('@/components/modules/snooker/quickviewColumn/QuickViewStatsTab'),
  { ssr: false }
);
const QuickViewTopScore = dynamic(
  () =>
    import('@/components/modules/snooker/quickviewColumn/QuickViewTopScore'),
  { ssr: false }
);
const QuickViewFootyTab = dynamic(
  () =>
    import('@/components/modules/snooker/quickviewColumn/quickviewFootyTab'),
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
  isMobile?: boolean;
};

export const QuickViewColumn = ({
  top = true,
  sticky = true,
  matchId,
  isDetail,
  matchData,
  isMobile,
}: QuickViewColumnProps) => {
  const i18n = useTrans();
  const [activeTab, setActiveTab] = useState<string>('details');
  const { matchLiveSocket } = useMqttClient(SPORT.SNOOKER, !!isMobile);
  const [featureMatchId, setFeatureMatchId] = useState<string | null>();
  const [dataNull, setDataNull] = useState<boolean>(false);

  const {
    showSelectedMatch,
    selectedMatch,
    setShowSelectedMatch,
    matchDetails,
  } = useMatchStore();
  const { data: featureMatchdaily } = useFeaturedMatchdaily({
    locale: i18n.language,
  });

  const { data } = useSelectedMatchData(
    !isDetail ? matchId || selectedMatch || matchData?.id || '' : '', SPORT.SNOOKER,
    // matchDetails?.status.type === 'inprogress' ? 1000 : 300000,
    // matchDetails?.status.type === 'inprogress' ? 800 : 300000
  );

  const extraHasData = (data: SportEventDtoWithStat) => {
    if(!data) return null
    return {
      lineup: data?.lineup,
      has_standing: data?.has_standing,
      has_player_stats: data?.has_player_stats,
      has_commentary: data?.has_commentary,
      has_advanced_stats: data?.has_advanced_stats,
      stage_id: data?.stage_id,
      season: data?.season,
    };
  };

  const matchShowData = useMemo(() => {
    const matchDataMapping = {
      ...data,
      ...matchDetails,
      ...extraHasData(data as SportEventDtoWithStat),
    };

    // use data outside this component when in detail page
    if (isDetail) {
      return { ...matchData, ...matchDetails };
    }

    if (!selectedMatch) {
      return {
        ...(isDetail ? matchData : data),
        ...extraHasData(data as SportEventDtoWithStat),
      };
    }

    return matchDataMapping;
  }, [selectedMatch, data, matchDetails, matchLiveSocket,matchData]);
  
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
    if (!memoizedSelectedMatch) {
      if (isValEmpty(featureMatchdaily)) {
        if (matchData && !featureMatchId) setFeatureMatchId(matchData?.id);
      }
    } else {
      setFeatureMatchId(null);
    }
  }, [featureMatchdaily, matchData, data]);

  useEffect(() => {
    if (matchShowData && Object.keys(matchShowData).length === 0 && !dataNull) {
      const timeout = setTimeout(() => {
        setDataNull(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [matchShowData]);

  const {
    status,
    lineup,
    has_standing,
    has_player_stats,
    has_highlight: hasHighlight = false,
    has_commentary: hasCommentary = false,
    has_advanced_stats: hasAdvancedStats = false,
  } = matchShowData || {};

  if (matchShowData && Object.keys(matchShowData).length === 0 && dataNull) {
    return null;
  }

  return (
    <QuickviewColumnWrapper top={top} sticky={sticky} isDetail={isDetail}>
      <div className='h-full no-scrollbar lg:overflow-y-scroll'>
        {/* Ty so */}
        <div
          className={clsx(
            'bg-dark-main dark:bg-transparent lg:bg-transparent',
            { 'lg:hidden': isDetail }
          )}
        >
          <QuickViewSummary
            match={matchShowData as SportEventDtoWithStat}
            isSelectMatch={memoizedShowSelectedMatch}
            isDetail={isDetail}
            isMobile={isMobile}
          />
        </div>
        <div className='space-y-4'>
          <div className='sticky top-[3.313rem] z-[11] lg:relative lg:top-0'>
            {/* Filter */}
            <QuickViewFilter
              isHaveData={!!matchShowData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              status={status}
              // has_standing={has_standing}
              // has_player_stats={has_player_stats}
              // lineup={lineup}
              // hasHighlight={hasHighlight}
              // hasCommentary={hasCommentary}
              // hasAdvancedStats={hasAdvancedStats}
              locale={i18n.language}
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
              sport='snooker'
              isMobile={isMobile}
            />
          )}
          {/* {activeTab === 'squad' && matchShowData && (
            <QuickViewSquadTab matchData={matchShowData as SportEventDto} />
          )}
          {activeTab === 'stats' && matchShowData && (
            <QuickViewStatsTab matchData={matchShowData as SportEventDto} />
          )} */}
          {activeTab === 'matches' && matchShowData && (
            <QuickViewMatchesTab
              matchData={matchShowData as SportEventDtoWithStat}
              isDetail={isDetail}
            />
          )}
          {/* {activeTab === 'standings' &&
            matchShowData &&
            (!!has_standing || !!has_player_stats) && (
              <>
                <QuickViewStandingsTab
                  isPlayerStats={has_player_stats}
                  isStandings={has_standing}
                  wide={false}
                  matchData={matchShowData as SportEventDto}
                />
              </>
            )} */}
          {/* {activeTab === 'odds' &&
            matchShowData &&
            Object.keys(matchShowData).length > 0 && (
              <QuickViewOddsTab matchData={matchShowData as SportEventDto} />
            )} */}

          {/* {activeTab === 'top-score' &&
            data &&
            Object.keys(matchShowData).length > 0 && (
              <QuickViewTopScore matchData={matchShowData as SportEventDto} />
            )} */}

          {activeTab === 'chat' && (
            <QuickViewChatTab sport={SOCKET_CHAT_TOPIC.snooker} />
          )}

          {/* {activeTab === 'commentary' && (
            <QuickviewCommentary
              matchData={matchShowData as SportEventDtoWithStat}
            />
          )} */}

          {/* {activeTab === 'footy' && (
            <QuickViewFootyTab
              matchData={matchShowData as SportEventDtoWithStat}
            />
          )} */}
          {/* {activeTab === 'footy1' && (
            <QuickVewFootyV2
              matchData={matchShowData as SportEventDtoWithStat}
            />
          )} */}

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
    </QuickviewColumnWrapper>
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
    // 15000,
    // 10000
    SPORT.SNOOKER
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
        {activeTab === 'odds' && data && Object.keys(data).length !== 0 && (
          <QuickViewOddsTab matchData={data as SportEventDto} />
        )}
      </div>
    </div>
  );
};

export const Divider = ({ className }: { className?: string }) => {
  return <div className={clsx(twMerge(className, 'divide-single'))}></div>;
};

export const TwQuickviewTeamName = tw.div`text-center text-[11px] font-bold text-white lg:text-dark-dark-blue lg:dark:text-white line-clamp-3 overflow-hidden text-ellipsis`;
