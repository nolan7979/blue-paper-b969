/* eslint-disable @next/next/no-img-element */
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import tw from 'twin.macro';


import QuickViewStatsTab from '@/components/modules/badminton/quickViewColumn/QuickViewStatsTab';

import { useHomeStore, useMatchStore } from '@/stores';

import RenderIf from '@/components/common/RenderIf';
import QuickViewColumnSkeleton from '@/components/common/skeleton/quickview/QuickViewColumnSkeleton';
import QuickViewDetailTab from '@/components/modules/badminton/quickViewColumn/detailTab/QuickViewDetailTab';
import { SportEventDto, SportEventDtoWithStat } from '@/constant/interface';
import { useSelectedMatchData } from '@/hooks/useBadminton';
import { QuickViewFilter } from '@/modules/badminton/liveScore/components/QuickViewFilter';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import QuickViewSummary from '@/components/modules/badminton/quickViewColumn/QuickViewSummary';
import { QuickViewChatTab } from '@/components/modules/common/quickviewChat';
import { SOCKET_CHAT_TOPIC } from '@/constant/common';

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
  isDetail,matchData
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
  const [dataNull, setDataNull] = useState<boolean>(false);


  const {
    showSelectedMatch,
    selectedMatch,
    setShowSelectedMatch,
    matchDetails,
  } = useMatchStore();

  const { data } = useSelectedMatchData(
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
    <div
      className={clsx({ 'w-full lg:h-[91vh]': sticky, 'mt-2': !isDetail })}
      css={[top && tw`top-[5.375rem]`, sticky && tw`sticky z-[9]`]}
    >
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
    </div>
  );
};

export const Divider = ({ className }: { className?: string }) => {
  return <div className={clsx(twMerge(className, 'divide-single'))}></div>;
};

export const TwQuickviewTeamName = tw.div`text-center text-sm font-bold text-dark-dark-blue dark:text-white`;
