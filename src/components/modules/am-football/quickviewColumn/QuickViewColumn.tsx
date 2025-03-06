/* eslint-disable @next/next/no-img-element */
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import tw from 'twin.macro';

import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/common';
import QuickViewDetailTab from '@/components/modules/am-football/quickviewColumn/quickviewDetailTab';

import { useMatchStore, useMatchStore2nd } from '@/stores';

import RenderIf from '@/components/common/RenderIf';
import QuickViewColumnSkeleton from '@/components/common/skeleton/quickview/QuickViewColumnSkeleton';
import QuickViewStatsTab from '@/components/modules/am-football/quickviewColumn/QuickViewStatsTab';
import QuickViewSummary from '@/components/modules/am-football/quickviewColumn/QuickViewSummary';
import { QuickviewColumnWrapper } from '@/components/modules/common/QuickviewWrapper';
import { QuickViewChatTab } from '@/components/modules/common/quickviewChat';
import { SOCKET_CHAT_TOPIC, SPORT } from '@/constant/common';
import { SportEventDto, SportEventDtoWithStat } from '@/constant/interface';
import { useSelectedMatchData } from '@/hooks/useAmericanFootball';
import useTrans from '@/hooks/useTrans';
import { QuickViewColumnProps } from '@/models';
import { QuickViewFilter } from '@/modules/am-football/liveScore/components/QuickViewFilter';
import { useConnectionStore } from '@/stores/connection-store';
import { isValEmpty } from '@/utils';
import { isMatchInprogressAMFootball } from '@/utils/americanFootballUtils';
import { cn } from '@/utils/tailwindUtils';
import clsx from 'clsx';

const QuickViewMatchesTab = dynamic(
  () =>
    import(
      '@/components/modules/am-football/quickviewColumn/quickViewMatchesTab'
    ),
  { ssr: false }
);

export const QuickViewColumn = ({
  top = true,
  sticky = true,
  matchId,
  isDetail,
  sport,
  matchData,
}: QuickViewColumnProps) => {
  const [activeTab, setActiveTab] = useState<string>('details');
  const { isConnected } = useConnectionStore();
  const [featureMatchId, setFeatureMatchId] = useState<string | null>();
  const [firstMatch, setFirstMatch] = useState<any>({});
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [dataNull, setDataNull] = useState<boolean>(false);

  const {
    showSelectedMatch,
    selectedMatch,
    setShowSelectedMatch,
  } = useMatchStore();

  const { data, refetch } = useSelectedMatchData(
    matchId || selectedMatch || featureMatchId || ''
  );

  const matchShowData = useMemo(() => {
    if (isDetail) {
      return data; // show detail match
    }
    // show selected match or feature match
    return !selectedMatch ? data || firstMatch : data;
  }, [selectedMatch, data, featureMatchId]);


  useEffect(() => {
    if (isDetail && !showSelectedMatch) {
      setShowSelectedMatch(true);
    }
    if (matchShowData) setFirstLoad(false);
  }, [matchShowData]);

  useEffect(() => {
    if (!selectedMatch) {
      setFirstMatch(matchData);
      if (matchData && !featureMatchId) setFeatureMatchId(matchData?.id);
    }
  }, [matchData, data]);

  useEffect(() => {
    if (
      !isConnected &&
      isMatchInprogressAMFootball(matchShowData?.status?.code)
    ) {
      const interval = setInterval(() => {
        refetch();
      }, 2000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isConnected, matchShowData?.status?.code]);

  useEffect(() => {
    if (matchShowData && Object.keys(matchShowData).length === 0 && !dataNull) {
      const timeout = setTimeout(() => {
        setDataNull(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [matchData]);

  const { status, lineup, has_standing, has_player_stats } =
    matchShowData || {};

  if (matchShowData && Object.keys(matchShowData).length === 0 && dataNull) {
    return null;
  }

  return (
    <QuickviewColumnWrapper top={top} sticky={sticky} isDetail={isDetail}>
      <div className='h-full no-scrollbar lg:overflow-y-scroll'>
        <div className={clsx({ 'block lg:hidden': isDetail })}>
          <QuickViewSummary
            match={matchShowData as SportEventDtoWithStat}
            isSelectMatch={showSelectedMatch}
            isDetail={isDetail}
          />
        </div>
        <div className='space-y-4 '>
          <div className='sticky top-[3.313rem] z-10 lg:relative lg:top-0'>
            {/* Filter */}
            <QuickViewFilter
              isHaveData={!!matchShowData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              status={status}
              has_standing={has_standing}
              has_player_stats={has_player_stats}
              lineup={lineup}
            />
          </div>
          <Divider className='!mt-0'></Divider>

          <RenderIf isTrue={!matchShowData && firstLoad}>
            <QuickViewColumnSkeleton />
          </RenderIf>

          {activeTab === 'details' && matchShowData && (
            <QuickViewDetailTab
              isDetail={isDetail}
              matchData={matchShowData as SportEventDtoWithStat}
              setActiveTab={setActiveTab}
              sport={SPORT.AMERICAN_FOOTBALL}
              setTabActive={setActiveTab}
            />
          )}

          {activeTab === 'stats' && matchShowData && (
            <QuickViewStatsTab matchData={matchShowData as SportEventDto} />
          )}
          {/* {activeTab === 'squad' && (matchShowData ) && (
            <QuickViewSquadTab
              matchData={(matchShowData as SportEventDto) }
            />
          )}
          {activeTab === 'stats' && (matchShowData ) && (
            <QuickViewStatsTab
              matchData={(matchShowData as SportEventDto) }
            />
          )} */}
          {activeTab === 'matches' && matchShowData && (
            <QuickViewMatchesTab
              matchData={matchShowData as SportEventDtoWithStat}
            />
          )}

          {activeTab === 'chat' && (
            <QuickViewChatTab sport={SOCKET_CHAT_TOPIC.americanFootball} />
          )}

          {/* {activeTab === 'standings' &&
            matchShowData &&
            (!!has_standing || !!has_player_stats) && (
              <>
                <QuickViewStandingsTab
                  isPlayerStats={has_player_stats}
                  isStandings={has_standing}
                  wide={false}
                  isDetails={isDetail}
                  matchData={(matchShowData as SportEventDto) }
                />
              </>
            )} */}
          {/* {activeTab === 'odds' &&
            matchShowData &&
            Object.keys(matchShowData).length > 0 && (
              <QuickViewOddsTab
                matchData={(matchShowData as SportEventDto) }
              />
            )} */}

          {/* {activeTab === 'top-score' &&
            data &&
            Object.keys(matchShowData).length > 0 && (
              <QuickViewTopScore
                matchData={(matchShowData as SportEventDto) }
              />
            )} */}

          {/* {matchShowData && Object.keys(matchShowData).length > 0 && (
            <HeadSection
              matchData={(matchShowData as SportEventDto) }
            ></HeadSection>
          )} */}
        </div>
      </div>
    </QuickviewColumnWrapper>
  );
};

export const HeadSection = ({ matchData }: { matchData: SportEventDto }) => {
  // const { tournament, season } = matchData;
  // useSelectedMatchLineupsData(matchData?.id);

  // // useTimelineData(
  // //   matchData?.id,
  // //   matchData?.status?.code,
  // //   (value: boolean) => setIsDisabled && setIsDisabled(value)
  // // );

  // tournament?.id &&
  //   season &&
  //   season?.id &&
  //   useLeagueTopPlayersData(tournament?.id, season?.id);

  return <></>;
};

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
              href={`/country/am-football/${category ? category.slug : ''}`}
              name={category ? category.name : ''}
            />
            <BreadCrumbSep></BreadCrumbSep>
            <BreadCumbLink
              href={`/am-football/competition/${tournament.slug}/${
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
          <QuickViewDetailTab
            matchData={data as SportEventDtoWithStat}
            sport={SPORT.AMERICAN_FOOTBALL}
          />
        )}
        {/* {activeTab === 'squad' && data && Object.keys(data).length !== 0 && (
          <QuickViewSquadTab matchData={data as SportEventDto} />
        )}
        {activeTab === 'stats' && data && Object.keys(data).length !== 0 && (
          <QuickViewStatsTab matchData={data as SportEventDto} />
        )} */}
        {activeTab === 'matches' && data && Object.keys(data).length !== 0 && (
          <QuickViewMatchesTab
            matchData={data as SportEventDtoWithStat}
            type2nd={true}
          />
        )}
        {/* {activeTab === 'standings' &&
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
        )} */}
      </div>
    </div>
  );
};

export const Divider = ({ className }: { className?: string }) => {
  return <div className={cn(className, 'divide-single')}></div>;
};

export const TwQuickviewTeamName = tw.div`text-center text-sm font-bold text-dark-dark-blue dark:text-white`;
