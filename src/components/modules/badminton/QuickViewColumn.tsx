/* eslint-disable @next/next/no-img-element */
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import tw from 'twin.macro';


import QuickViewStatsTab from '@/components/modules/badminton/quickViewColumn/QuickViewStatsTab';

import { useHomeStore, useMatchStore } from '@/stores';

import RenderIf from '@/components/common/RenderIf';
import QuickViewColumnSkeleton from '@/components/common/skeleton/quickview/QuickViewColumnSkeleton';
import QuickViewDetailTab from '@/components/modules/badminton/quickViewColumn/detailTab/QuickViewDetailTab';
import QuickViewSummary from '@/components/modules/badminton/quickViewColumn/QuickViewSummary';
import { SportEventDto, SportEventDtoWithStat } from '@/constant/interface';
import { useSelectedMatchData } from '@/hooks/useBadminton';
import { QuickViewFilter } from '@/modules/badminton/liveScore/components/QuickViewFilter';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SOCKET_CHAT_TOPIC } from '@/constant/common';
import { QuickViewChatTab } from '@/components/modules/common/quickviewChat';
import { QuickviewColumnWrapper } from '@/components/modules/common/QuickviewWrapper';

export enum SPORT {
  FOOTBALL = 'football',
  BASKETBALL = 'basketball',
  TENNIS = 'tennis',
  BADMINTON = 'badminton',
}

const QuickViewMatchesTab = dynamic(
  () =>
    import(
      '@/components/modules/badminton/quickViewColumn/quickViewMatchesTab'
    ).then((mod) => mod.QuickViewMatchesTab),
  { ssr: false }
);

export const QuickViewColumn = ({
  top = true,
  sticky = true,
  matchId,
  isDetail,
}: {
  top: boolean;
  isBreadCumb?: boolean;
  sticky: boolean;
  matchId?: string;
  isDetail?: boolean;
}) => {
  const [activeTab, setActiveTab] = useState<string>('details');
  const [featureMatchId, setFeatureMatchId] = useState<string | null>();
  const [firstMatch, setFirstMatch] = useState<any>({});
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [dataNull, setDataNull] = useState<boolean>(false);

  const {
    showSelectedMatch,
    selectedMatch,
    setShowSelectedMatch,
    matchDetails,
    setMatchDetails,
  } = useMatchStore();

  const { data } = useSelectedMatchData(
    matchId || selectedMatch || featureMatchId || ''
  );

  const { matches: matchesHome } = useHomeStore();

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
      const getMatch = matchesHome && Object.values(matchesHome)[0];
      setFirstMatch(getMatch);
      if (getMatch && !featureMatchId) setFeatureMatchId(getMatch?.id);
    } else {
      setFeatureMatchId(null);
    }
  }, [matchesHome, data]);

  useEffect(() => {
    if (matchShowData && Object.keys(matchShowData).length === 0 && !dataNull) {
      const timeout = setTimeout(() => {
        setDataNull(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [data]);

  const { status, lineup, has_standing, has_player_stats } =
    matchShowData || {};

    if (matchShowData && Object.keys(matchShowData).length === 0 && dataNull) {
      return null;
    }

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
              setTabActive={setActiveTab}
            />
          )}
          {activeTab === 'matches' && (matchShowData || matchDetails) && (
            <QuickViewMatchesTab
              matchData={
                (matchShowData as SportEventDtoWithStat) || matchDetails
              }
            />
          )}

          {activeTab === 'chat' && (
            <QuickViewChatTab sport={SOCKET_CHAT_TOPIC.badminton} />
          )}

          {activeTab === 'stats' && (matchShowData || matchDetails) && (
            <QuickViewStatsTab
              matchData={(matchShowData as SportEventDto) || matchDetails}
            />
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
