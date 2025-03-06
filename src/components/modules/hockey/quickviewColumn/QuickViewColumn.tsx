/* eslint-disable @next/next/no-img-element */
import RenderIf from '@/components/common/RenderIf';
import QuickViewColumnSkeleton from '@/components/common/skeleton/quickview/QuickViewColumnSkeleton';
import { QuickViewChatTab } from '@/components/modules/common/quickviewChat';
import QuickViewSummary from '@/components/modules/hockey/quickviewColumn/QuickViewSummary';
import QuickViewDetailTab from '@/components/modules/hockey/quickviewColumn/quickviewDetailTab';
import { SOCKET_CHAT_TOPIC, SPORT } from '@/constant/common';
import { SportEventDto, SportEventDtoWithStat } from '@/constant/interface';
import { useSelectedMatchData } from '@/hooks/useCommon/useEventData';
import { QuickViewFilter } from '@/modules/hockey/liveScore/components/QuickViewFilter';
import { useMatchStore } from '@/stores';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import tw from 'twin.macro';

const QuickViewMatchesTab = dynamic(
  () =>
    import(
      '@/components/modules/hockey/quickviewColumn/quickViewMatchesTab'
    ),
  { ssr: false }
);

const QuickViewStatsTab = dynamic(
  () =>
    import('@/components/modules/hockey/quickviewColumn/QuickViewStatsTab'),
  { ssr: false }
);

export const QuickViewColumn = ({
  top = true,
  sticky = true,
  matchId,
  isDetail, matchData
}: {
  top: boolean;
  isBreadCumb?: boolean;
  sticky: boolean;
  matchId?: string;
  isDetail?: boolean;
  matchData?: SportEventDtoWithStat;
  featureMatchData?: SportEventDtoWithStat;
}) => {
  const [activeTab, setActiveTab] = useState<string>('details');
  const [firstMatch, setFirstMatch] = useState<any>({});
  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  const {
    showSelectedMatch,
    selectedMatch,
    setShowSelectedMatch,
    matchDetails,
    setMatchDetails,
  } = useMatchStore();

  const { data } = useSelectedMatchData(
    matchId || selectedMatch || '', SPORT.ICE_HOCKEY
  );

  const matchShowData = useMemo(() => {
    setMatchDetails(data as any);
    if (isDetail) {
      return data; // show detail match
    }
    // show selected match or feature match
    return !selectedMatch ? data || firstMatch : data;
  }, [selectedMatch, data, firstMatch]);

  useEffect(() => {
    setActiveTab('details');
  }, [selectedMatch, matchId]);

  useEffect(() => {
    if (isDetail && !showSelectedMatch) {
      setShowSelectedMatch(true);
    }
    if (matchShowData) setFirstLoad(false);
  }, [matchShowData]);

  useEffect(() => {
    if (!selectedMatch) {
      setFirstMatch(matchData);
    }
  }, [matchData, data]);

  const { status, lineup, has_standing, has_player_stats } =
    matchShowData || {};

  return (
    <div
      className={clsx({ 'w-full lg:h-[91vh]': sticky, 'mt-2': !isDetail })}
      css={[top && tw`top-[5.375rem]`, sticky && tw`sticky z-[9]`]}
    >
      <div className='h-full no-scrollbar lg:overflow-y-scroll'>
        {/* Ty so */}
        <div className={clsx({ 'block lg:hidden': isDetail })}>
          <QuickViewSummary
            match={(matchShowData as SportEventDtoWithStat) || matchDetails}
            isFeatureMatch={false}
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

          {activeTab === 'details' && (matchShowData || matchDetails) && (
            <QuickViewDetailTab
              isDetail={isDetail}
              matchData={
                (matchShowData as SportEventDtoWithStat) || matchDetails
              }
              setActiveTab={setActiveTab}
              sport={SPORT.ICE_HOCKEY}
              setTabActive={setActiveTab}
            />
          )}
          {/* {activeTab === 'squad' && (matchShowData || matchDetails) && (
            <QuickViewSquadTab
              matchData={(matchShowData as SportEventDto) || matchDetails}
            />
          )} */}


          {activeTab === 'stats' && (matchShowData || matchDetails) && (
            <>
            <QuickViewStatsTab
              matchData={(matchShowData as SportEventDto) || matchDetails}
            />
            </>
          )} 

          {activeTab === 'matches' && (matchShowData || matchDetails) && (
            <QuickViewMatchesTab
              matchData={
                (matchShowData as SportEventDtoWithStat) || matchDetails
              }
            />
          )}
          {activeTab === 'chat' && (
            <QuickViewChatTab sport={SOCKET_CHAT_TOPIC.hockey} />
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
                  matchData={(matchShowData as SportEventDto) || matchDetails}
                />
              </>
            )} */}
          {/* {activeTab === 'odds' &&
            matchShowData &&
            Object.keys(matchShowData).length > 0 && (
              <QuickViewOddsTab
                matchData={(matchShowData as SportEventDto) || matchDetails}
              />
            )} */}

          {/* {activeTab === 'top-score' &&
            data &&
            Object.keys(matchShowData).length > 0 && (
              <QuickViewTopScore
                matchData={(matchShowData as SportEventDto) || matchDetails}
              />
            )} */}

          {/* {matchShowData && Object.keys(matchShowData).length > 0 && (
            <HeadSection
              matchData={(matchShowData as SportEventDto) || matchDetails}
            ></HeadSection>
          )} */}
        </div>
      </div>
    </div>
  );
};

export const HeadSection = ({ matchData }: { matchData: SportEventDto }) => {
  const { tournament, season } = matchData;
  // useSelectedMatchLineupsData(matchData?.id);

  // useTimelineData(
  //   matchData?.id,
  //   matchData?.status?.code,
  //   (value: boolean) => setIsDisabled && setIsDisabled(value)
  // );

  // tournament?.id &&
  //   season &&
  //   season?.id &&
  //   useLeagueTopPlayersData(tournament?.id, season?.id);

  return <></>;
};

export const Divider = ({ className }: { className?: string }) => {
  return <div className={clsx(twMerge(className, 'divide-single'))}></div>;
};

export const TwQuickviewTeamName = tw.div`text-center text-sm font-bold text-dark-dark-blue dark:text-white`;
