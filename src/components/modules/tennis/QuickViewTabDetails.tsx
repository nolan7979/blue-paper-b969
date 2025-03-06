/* eslint-disable @next/next/no-img-element */
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import tw from 'twin.macro';

import { useFeaturedMatchdaily } from '@/hooks/useFootball';

import QuickViewStatsTab from '@/components/modules/tennis/quickviewColumn/QuickViewStatsTab';

import { useHomeStore, useMatchStore } from '@/stores';

import RenderIf from '@/components/common/RenderIf';
import QuickViewColumnSkeleton from '@/components/common/skeleton/quickview/QuickViewColumnSkeleton';
import {
  SeasonDto,
  SportEventDto,
  SportEventDtoWithStat,
} from '@/constant/interface';
import { useSelectedMatchData } from '@/hooks/useTennis';
import { QuickViewFilter } from '@/modules/tennis/liveScore/components/QuickViewFilterMobile';
import { isValEmpty } from '@/utils';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import QuickViewDetailTab from '@/components/modules/tennis/quickviewColumn/detailTab/QuickViewDetailTab';
import {
  LeagueSummary as LeagueSummaryTennis,
  Matches as MatchesTennis,
  TopPlayer as TopPlayerTennis,
  TopTeam as TopTeamTennis,
  CupTree as CupTreeTennis,
  FeaturedMatchMobile,
  ProgressBar,
} from '@/components/modules/tennis/competition';
import LeagusInfo from '@/components/modules/tennis/competition/GetTournamentDetails';

export enum SPORT {
  FOOTBALL = 'football',
  BASKETBALL = 'basketball',
  TENNIS = 'tennis',
}

const QuickViewMatchesTab = dynamic(
  () =>
    import(
      '@/components/modules/tennis/quickviewColumn/quickviewMatchsTab'
    ).then((mod) => mod.QuickViewMatchesTab),
  { ssr: false }
);

const QuickViewSummary = dynamic(
  () => import('@/components/modules/tennis/quickviewColumn/QuickViewSummary'),
  { ssr: false }
);
export const QuickViewTabDetailMobile = ({
  top = true,
  sticky = true,
  matchId,
  isDetail,
  leagues,
  uniqueTournament,
  teams,
  selectedSeason,
  match,
  surface,
  sets,
  hostCity,
  isMobile,
  isLoading,
}: {
  top: boolean;
  isBreadCumb?: boolean;
  sticky: boolean;
  matchId?: string;
  isDetail?: boolean;
  leagues?: any;
  uniqueTournament?: any;
  teams?: SportEventDto[];
  selectedSeason?: SeasonDto;
  match?: SportEventDtoWithStat;
  surface?: string;
  sets?: number;
  hostCity?: string;
  isMobile?: boolean;
  isLoading?: boolean;
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
  } = useMatchStore();

  const { data } = useSelectedMatchData(
    matchId || selectedMatch || featureMatchId || ''
  );

  const { matches: matchesHome } = useHomeStore();

  const matchShowData = useMemo(() => {
    if (isDetail) {
      return data; // show detail match
    }
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
  }, [activeTab, matchShowData, matchDetails, selectedSeason, match]);

  useEffect(() => {
    if (!selectedMatch) {
      const getMatch = matchesHome && Object.values(matchesHome)[0];
      setFirstMatch(getMatch);
      if (getMatch && !featureMatchId) setFeatureMatchId(getMatch?.id);
    } else {
      setFeatureMatchId(null);
    }
  }, [matchesHome, data]);

  const { status, lineup, has_standing, has_player_stats } =
    matchShowData || {};

  return (
    <div
      className={clsx({ 'w-full lg:h-[91vh]': sticky, 'mt-2': !isDetail })}
      css={[top && tw`top-0`, sticky && tw`sticky `]}
    >
      <div className='h-full no-scrollbar lg:overflow-y-scroll'>
        <div className='space-y-4 '>
          <div className='sticky top-[3.313rem] z-10 lg:relative lg:top-0'>
            {/* Filter */}
            <QuickViewFilter
              isHaveData={!!matchShowData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              status={status}
              has_standing={false}
              has_player_stats={has_player_stats}
              lineup={lineup}
            />
          </div>
          <Divider className='!mt-0'></Divider>

          <RenderIf isTrue={!matchShowData && firstLoad}>
            <QuickViewColumnSkeleton />
          </RenderIf>

          {activeTab === 'details' && match && !!selectedSeason && (
            <>
              <div className='pl-2.5 pr-2.5 space-y-4'>
                {isMobile && (
                  <ProgressBar
                    isMobile={isMobile}
                    uniqueTournament={uniqueTournament}
                    selectedSeason={selectedSeason}
                  />
                )}
                {!isLoading && match && Object.keys(match).length > 0 && (
                  <FeaturedMatchMobile
                    match={match || ({} as SportEventDtoWithStat)}
                  />
                )}
                <LeagusInfo
                  surface={surface || ''}
                  sets={sets || 0}
                  hostCity={hostCity || ''}
                />
              </div>
            </>
          )}
          {activeTab === 'matchtop' &&
            (teams || leagues) &&
            !!selectedSeason && (
              <>
                <MatchesTennis
                  leagues={leagues}
                  uniqueTournament={uniqueTournament}
                  teams={teams || []}
                  selectedSeason={selectedSeason}
                />
              </>
            )}
          {activeTab === 'matches' &&
            (teams || leagues) &&
            !!selectedSeason && (
              <CupTreeTennis
                isMobile={isMobile}
                selectedSeason={selectedSeason}
              />
            )}
          {/* {activeTab === 'stats' && (teams || leagues) && !!selectedSeason && (
            <CupTreeTennis selectedSeason={selectedSeason} />
          )} */}
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
