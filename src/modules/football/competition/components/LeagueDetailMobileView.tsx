/* eslint-disable @next/next/no-img-element */
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import tw from 'twin.macro';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TabViewFilterMobile } from '@/modules/football/competition/components/TabViewFilterMobile';
import CompetitionInfoSection from '@/components/modules/football/competition/CompetitionInfoSection';
import TopPlayerSection from '@/components/modules/football/competition/TopPlayerSection';
import {
  TopPlayerPerGameSection,
  TopTeamsSection,
} from '@/modules/football/competition/components';
import { StandingStable } from '@/components/modules/football/competition';
import TeamOfTheWeekSection from '@/components/modules/football/competition/TeamOfTheWeekSection';
import QuickViewSummary from '@/components/modules/football/quickviewColumn/QuickViewSummary';
import { TwTitle } from '@/components/modules/football/tw-components';
import { FixturesMatchesByRoundSection } from '@/modules/football/fixtures/components';
import { useLeagueTopPlayersData, useLeagueTopPlayersPerGameData, useLeagueTopTeamsData } from '@/hooks/useFootball';
import { isValEmpty } from '@/utils';
import useDeviceOrientation from '@/hooks/useDeviceOrientation';
import { cn } from '@/utils/tailwindUtils';

export const LeagueDetailMobileView = ({
  uniqueTournament,
  i18n,
  selectedSeason,
  featuredMatchData,
}: any) => {
  const [activeTab, setActiveTab] = useState<string>('details');

  const isLandscape = useDeviceOrientation();
  const { data: topTeamData = {} } = useLeagueTopTeamsData(
    uniqueTournament?.id,
    selectedSeason?.id
  );

  const { data: topStatsData = {} } = useLeagueTopPlayersPerGameData(
    uniqueTournament?.id,
    selectedSeason?.id
  );

  const { data: topPlayerData = {} } = useLeagueTopPlayersData(
    uniqueTournament?.id,
    selectedSeason?.id
  );

  const checkHasData = (data: any) => {
    return !isValEmpty(data) || !!(data['goals'] || []).length ? true : false;


  }

  const { topPlayers = {} } = topPlayerData;
  const { topPlayers: topStats = {} } = topStatsData || {};
  const { topTeams = {} } = topTeamData || {};
  const hasTopPlayers = checkHasData(topPlayers);
  const hasTopStats = checkHasData(topStats);
  const hasTopTeams = checkHasData(topTeams);


  return (
    <div className={cn('top-0 z-[5] w-full', {
      'sticky': !isLandscape,
    })}>
      <div className='h-full no-scrollbar lg:overflow-y-scroll'>
        <div className='space-y-2'>
          <div className={cn('top-[3.313rem] z-10 lg:relative lg:top-0', {
            'sticky': !isLandscape,
          })}>
            {/* Filter */}
            <TabViewFilterMobile
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              hasTopPlayers={hasTopPlayers}
              hasTopStats={hasTopStats}
              hasTopTeams={hasTopTeams}
            />
          </div>
          <Divider className='!mt-0'></Divider>

          {activeTab === 'details' && (
            <>
              <div className='px-3'>
                <TwTitle className='text-center'>
                  {i18n.qv.featured_match}
                </TwTitle>
                <div className='rounded-md bg-white dark:bg-dark-card'>
                  <QuickViewSummary
                    match={featuredMatchData}
                    isFeatureMatch
                    showNavigation={false}
                    isSubPage={true}
                  />
                </div>
              </div>
              <CompetitionInfoSection
                uniqueTournament={uniqueTournament}
                i18n={i18n}
              />
              <TeamOfTheWeekSection
                uniqueTournament={uniqueTournament}
                selectedSeason={selectedSeason}
                i18n={i18n}
              />
            </>
          )}

          {activeTab === 'standings' && (
            <>
              <StandingStable
                uniqueTournament={uniqueTournament}
                selectedSeason={selectedSeason}
              />
            </>
          )}
          {activeTab === 'matches' && (
            <FixturesMatchesByRoundSection
              uniqueTournament={uniqueTournament}
              selectedSeason={selectedSeason}
            />
          )}
          {activeTab === 'top-title' && (
            <>
              <TopPlayerSection
                uniqueTournament={uniqueTournament}
                selectedSeason={selectedSeason}
                i18n={i18n}
              />
            </>
          )}
          {activeTab === 'stats' && (
            <>
              <TopPlayerPerGameSection
                uniqueTournament={uniqueTournament}
                selectedSeason={selectedSeason}
                i18n={i18n}
              />
            </>
          )}
          {activeTab === 'player' && (
            <>
              <TopTeamsSection
                uniqueTournament={uniqueTournament}
                selectedSeason={selectedSeason}
                i18n={i18n}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const Divider = ({ className }: { className?: string }) => {
  return <div className={clsx(twMerge(className, 'divide-single'))}></div>;
};

export const TwQuickviewTeamName = tw.div`text-center text-sm font-bold text-dark-dark-blue dark:text-white`;
