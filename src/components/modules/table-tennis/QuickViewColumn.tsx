/* eslint-disable @next/next/no-img-element */
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import tw from 'twin.macro';

import { useMatchStore } from '@/stores';

import RenderIf from '@/components/common/RenderIf';
import QuickViewColumnSkeleton from '@/components/common/skeleton/quickview/QuickViewColumnSkeleton';
import QuickViewSummary from '@/components/modules/table-tennis/quickviewColumn/QuickViewSummary';
import QuickViewDetailTab from '@/components/modules/table-tennis/quickviewColumn/detailTab/QuickViewDetailTab';
import { SOCKET_CHAT_TOPIC, SPORT } from '@/constant/common';
import { SportEventDto, SportEventDtoWithStat } from '@/constant/interface';
import { useSelectedMatchData } from '@/hooks/useCommon';
import { QuickViewFilter } from '@/modules/table-tennis/liveScore/components/QuickViewFilter';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { QuickviewColumnWrapper } from '@/components/modules/common/QuickviewWrapper';

const QuickViewMatchesTab = dynamic(
  () =>
    import(
      '@/components/modules/table-tennis/quickviewColumn/quickviewMatchsTab'
    ).then((mod) => mod.QuickViewMatchesTab),
  { ssr: false }
);
const QuickViewStatsTab = dynamic(
  () =>
    import(
      '@/components/modules/table-tennis/quickviewColumn/QuickViewStatsTab'
    ),
  { ssr: false }
);

const QuickViewCupTreeTab = dynamic(
  () =>
    import(
      '@/components/modules/table-tennis/quickviewColumn/quickviewCupTreeTab'
    ),
  { ssr: false }
);
const QuickViewChatTab = dynamic(
  () =>
    import('@/components/modules/common/quickviewChat').then(
      (mod) => mod.QuickViewChatTab
    ),
  { ssr: false }
);

export const QuickViewColumn = ({
  top = true,
  sticky = true,
  matchId,
  isDetail,
  matchData,
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
  const [featureMatchId, setFeatureMatchId] = useState<string | null>();
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
    matchId || selectedMatch || featureMatchId || '',
    SPORT.TABLE_TENNIS
  );

  const matchShowData = useMemo(() => {
    setMatchDetails(data as any);
    if (isDetail) {
      return data; // show detail match
    }
    // show selected match or feature match
    return !selectedMatch ? data || firstMatch : data;
  }, [selectedMatch, data, featureMatchId]);

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
      if (matchData && !featureMatchId) setFeatureMatchId(matchData?.id);
    } else {
      setFeatureMatchId(null);
    }
  }, [matchData, data]);

  const { status, lineup, has_standing, has_player_stats } =
    matchShowData || {};

  return (
    <QuickviewColumnWrapper top={top} sticky={sticky} isDetail={isDetail}>

      <div className='h-full no-scrollbar lg:overflow-y-scroll'>
        {/* Ty so */}
        <div className={clsx({ 'lg:hidden': isDetail })}>
          <QuickViewSummary
            match={(matchShowData as SportEventDtoWithStat) || matchDetails}
            isSelectMatch={showSelectedMatch}
            isDetail={isDetail}
          />
        </div>
        <div className='space-y-4'>
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

     
          {activeTab === 'details' && (matchShowData || matchDetails) && (
            <QuickViewDetailTab
              isDetail={isDetail}
              matchData={
                (matchShowData as SportEventDtoWithStat) || matchDetails
              }
              setActiveTab={setActiveTab}
              sport={SPORT.TENNIS}
              setTabActive={setActiveTab}
            />
          )}
          {activeTab === 'matches' && (matchShowData || matchDetails) && (
            <QuickViewMatchesTab
              matchData={
                (matchShowData as SportEventDtoWithStat) || matchDetails
              }
              isDetail={isDetail}
            />
          )}
          {activeTab === 'stats' && (matchShowData || matchDetails) && (
            <QuickViewStatsTab
              matchData={(matchShowData as SportEventDto) || matchDetails}
            />
          )}

          {activeTab === 'cupTree' && (
            <>
              <QuickViewCupTreeTab
                matchData={(matchShowData as SportEventDto) || matchDetails}
              />
            </>
          )}

          {activeTab === 'chat' && (
            <QuickViewChatTab sport={SOCKET_CHAT_TOPIC.tableTennis} />
          )}

          {/* {activeTab === 'squad' && (matchShowData || matchDetails) && (
            <QuickViewSquadTab
              matchData={(matchShowData as SportEventDto) || matchDetails}
            />
          )}
          
          {activeTab === 'matches' && (matchShowData || matchDetails) && (
            <QuickViewMatchesTab
              matchData={
                (matchShowData as SportEventDtoWithStat) || matchDetails
              }
            />
          )} */}
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
            )}
          {activeTab === 'odds' &&
            matchShowData &&
            Object.keys(matchShowData).length > 0 && (
              <QuickViewOddsTab
                matchData={(matchShowData as SportEventDto) || matchDetails}
              />
            )}

          {activeTab === 'top-score' &&
            data &&
            Object.keys(matchShowData).length > 0 && (
              <QuickViewTopScore
                matchData={(matchShowData as SportEventDto) || matchDetails}
              />
            )} */}
        </div>
      </div>
    </QuickviewColumnWrapper>
  );
};

export const Divider = ({ className }: { className?: string }) => {
  return <div className={clsx(twMerge(className, 'divide-single'))}></div>;
};

export const TwQuickviewTeamName = tw.div`text-center text-sm font-bold text-dark-dark-blue dark:text-white`;
