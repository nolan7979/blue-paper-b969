import React, { useEffect, useState } from 'react';
import {
  TwDataSection,
  TwFilterCol,
  TwFilterTitle,
  TwMainCol,
  TwQuickViewCol,
} from '@/components/modules/football/tw-components';

import { useLeagueStore } from '@/stores/league-store';

import { SeasonDto, TournamentDto } from '@/constant/interface';
import { LeagueSummary as LeagueSummaryFootball } from '@/components/modules/football/competition';

import useTrans from '@/hooks/useTrans';
import LeagueBreadcrumb from '@/modules/football/competition/components/LeagueBreadcrumb';
import { StandingStable } from '@/components/modules/football/competition';
import { TopPlayerPerGameSection, TopTeamsSection } from '@/modules/football/competition/components';
import TopPlayerSection from '@/components/modules/football/competition/TopPlayerSection';
import { useTournamentFeaturedEvents } from '@/hooks/useFootball';
import QuickViewSummary from '@/components/modules/football/quickviewColumn/QuickViewSummary';
import TeamOfTheWeekSection from '@/components/modules/football/competition/TeamOfTheWeekSection';
import { useHomeStore } from '@/stores';
import { TopLeauges } from '@/components/modules/football/filters/FilterColumn';
import { SPORT } from '@/constant/common';

interface LeagueDetailedSubPageProps {
  uniqueTournament: TournamentDto;
  seasons: SeasonDto[];
}

const LeagueDetailedSubPage: React.FC<LeagueDetailedSubPageProps> = ({
  uniqueTournament,
  seasons,
}) => {
  const i18n = useTrans();
  const { topLeagues } = useHomeStore();

  const [selectedSeason, setSelectedSeason] = useState<SeasonDto>(
    seasons ? seasons[0] : ({} as SeasonDto)
  );

  const { setSelectedOrder, setSelectedView } = useLeagueStore();

  // const { data: teamsData = [], isLoading: isTeamLoading } =
  //   useTeamOfLeagueData(uniqueTournament?.id);

  const { data: featuredMatchData } = useTournamentFeaturedEvents(
    uniqueTournament?.id
  );

  useEffect(() => {
    setSelectedView(0);
    setSelectedOrder(1);
  }, [selectedSeason, setSelectedOrder, setSelectedView]);

  useEffect(() => {
    if (seasons) {
      setSelectedSeason(seasons[0]);
    }
  }, [seasons]);

  if (!uniqueTournament || !seasons) return <></>;

  return (
    <>
      <div className='layout hidden lg:block'>
        <LeagueBreadcrumb tournament={uniqueTournament}></LeagueBreadcrumb>
      </div>
      <TwDataSection className='layout flex transition-all duration-150 lg:flex-row'>
        <TwFilterCol className='flex-shrink-1 no-scrollbar sticky top-20 w-full max-w-[209px] lg:h-[91vh] lg:overflow-y-scroll'>
          <TwFilterTitle className='font-oswald'>
            {i18n.clubs.youMayBe}
          </TwFilterTitle>
          <TopLeauges leagues={topLeagues} sport={SPORT.FOOTBALL} />

          {/* <AllTeamBkb isLoading={isTeamLoading} teams={teamsData} /> */}
        </TwFilterCol>
        <div className='block w-full lg:grid lg:w-[calc(100%-209px)] lg:grid-cols-3 lg:gap-x-6'>
          <TwMainCol className='!col-span-2'>
            <div className='h-full overflow-hidden'>
              <div className='flex w-full flex-col gap-6'>
                <LeagueSummaryFootball
                  uniqueTournament={uniqueTournament}
                  seasons={seasons}
                  setSelectedSeason={(season) => setSelectedSeason(season)}
                  selectedSeason={selectedSeason}
                />
                <StandingStable
                  uniqueTournament={uniqueTournament}
                  selectedSeason={selectedSeason}
                />
                <TeamOfTheWeekSection
                  uniqueTournament={uniqueTournament}
                  selectedSeason={selectedSeason}
                  i18n={i18n}
                />
                {/* <MatchesBkb teams={teamsData} selectedSeason={selectedSeason} />
                <CupTreeBkb selectedSeason={selectedSeason} /> */}
              </div>
            </div>
          </TwMainCol>

          <TwQuickViewCol className='col-span-1 sticky top-20 no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
            <div className='flex w-full flex-col gap-6'>
              <QuickViewSummary match={featuredMatchData} isFeatureMatch />
              {/* <TopPlayerBkb selectedSeason={selectedSeason} />
              <TopTeamBkb selectedSeason={selectedSeason} /> */}
              <TopPlayerSection
                uniqueTournament={uniqueTournament}
                selectedSeason={selectedSeason}
                i18n={i18n}
              />
              <TopPlayerPerGameSection
                uniqueTournament={uniqueTournament}
                selectedSeason={selectedSeason}
                i18n={i18n}
              />
              <TopTeamsSection
                uniqueTournament={uniqueTournament}
                selectedSeason={selectedSeason}
                i18n={i18n}
              />
            </div>
          </TwQuickViewCol>
        </div>
      </TwDataSection>
    </>
  );
};

export default LeagueDetailedSubPage;
