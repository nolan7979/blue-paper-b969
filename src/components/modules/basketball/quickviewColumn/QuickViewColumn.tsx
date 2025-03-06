/* eslint-disable @next/next/no-img-element */
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import tw from 'twin.macro';
import QuickViewDetailTab from '@/components/modules/basketball/quickviewColumn/quickviewDetailTab';
import { useMatchStore } from '@/stores';
import RenderIf from '@/components/common/RenderIf';
import QuickViewColumnSkeleton from '@/components/common/skeleton/quickview/QuickViewColumnSkeleton';
import QuickViewSummary from '@/components/modules/basketball/quickviewColumn/QuickViewSummary';
import { SOCKET_CHAT_TOPIC, SPORT } from '@/constant/common';
import { SportEventDto, SportEventDtoWithStat } from '@/constant/interface';
import { useSelectedMatchData } from '@/hooks/useBasketball';
import { QuickViewFilter } from '@/modules/basketball/liveScore/components/QuickViewFilter';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import QuickViewStandingsTab from '@/components/modules/basketball/quickviewColumn/QuickViewStandingsTab';
import { QuickViewChatTab } from '@/components/modules/common/quickviewChat';
import { QuickviewColumnWrapper } from '@/components/modules/common/QuickviewWrapper';

const QuickViewMatchesTab = dynamic(
  () =>
    import(
      '@/components/modules/basketball/quickviewColumn/quickViewMatchesTab'
    ),
  { ssr: false }
);

const QuickViewBoxScoreTab = dynamic(
  () =>
    import(
      '@/components/modules/basketball/quickviewColumn/quickViewBoxScoreTab'
    ),
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
    matchId || selectedMatch || matchData?.id || firstMatch?.id || ''
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

  const { status, lineup, hasStanding, has_player_stats, hasBoxScore } =
    matchShowData || {};

  return (
    <QuickviewColumnWrapper top={top} sticky={sticky} isDetail={isDetail}>
      <div className='h-full no-scrollbar lg:overflow-y-scroll'>
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
              has_standing={hasStanding}
              has_player_stats={has_player_stats}
              lineup={lineup}
              hasBoxScore={hasBoxScore}
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
              sport={SPORT.BASKETBALL}
              setTabActive={setActiveTab}
            />
          )}

          {activeTab === 'matches' && (matchShowData || matchDetails) && (
            <QuickViewMatchesTab
              isDetail={isDetail}
              matchData={
                (matchShowData as SportEventDtoWithStat) || matchDetails
              }
            />
          )}

          {activeTab === 'box-score' && (matchShowData || matchDetails) && (
            <QuickViewBoxScoreTab matchData={
              (matchShowData as SportEventDtoWithStat) || matchDetails
            } />
          )}

          {activeTab === 'chat' && (
            <QuickViewChatTab sport={SOCKET_CHAT_TOPIC.basketball} />
          )}

          {activeTab === 'standings' && matchShowData && (
            <>
              <QuickViewStandingsTab
                isStandings={hasStanding}
                matchData={(matchShowData as SportEventDto) || matchDetails}
              />
            </>
          )}
        </div>
      </div>
    </QuickviewColumnWrapper>
  );
};


export const Divider = ({ className }: { className?: string }) => {
  return <div className={clsx(twMerge(className, 'divide-single'))}></div>;
};

export const TwQuickviewTeamName = tw.div`text-center text-sm font-bold text-dark-dark-blue dark:text-white`;
