import {
  TwDataSection,
  TwFilterCol,
  TwFilterTitle,
  TwMainCol,
  TwQuickViewCol,
} from '@/components/modules/football/tw-components';
import React, { useEffect, useMemo, useState } from 'react';

import { useLeagueStore } from '@/stores/league-store';

import { LeagueSummary as LeagueSummaryFootball } from '@/components/modules/football/competition';
import { SeasonDto, TournamentDto } from '@/constant/interface';

import { TopLeauges } from '@/components/modules/common/filters/FilterColumn';
import { StandingStable } from '@/components/modules/football/competition';
import CompetitionInfoSection from '@/components/modules/football/competition/CompetitionInfoSection';
import TeamOfTheWeekSection from '@/components/modules/football/competition/TeamOfTheWeekSection';
import TopPlayerSection from '@/components/modules/football/competition/TopPlayerSection';
import QuickViewSummary from '@/components/modules/football/quickviewColumn/QuickViewSummary';
import { SPORT } from '@/constant/common';
import { competitionsByCountry } from '@/constant/competitions';
import {
  hotLeaguesFootball,
  ILanguageKey,
} from '@/constant/leagues/hotLeaguesFootball';
import { useTopLeagues } from '@/hooks/useCommon';
import { useTournamentFeaturedEvents } from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';
import { useDetectDeviceClient } from '@/hooks/useWindowSize';
import { ILeaguesItems } from '@/models';
import {
  TopPlayerPerGameSection,
  TopTeamsSection,
} from '@/modules/football/competition/components';
import { LeagueDetailMobileView } from '@/modules/football/competition/components/LeagueDetailMobileView';
import { FixturesMatchesByRoundSection } from '@/modules/football/fixtures/components';
import { useHomeStore } from '@/stores';
import { isEqual } from 'lodash';

interface LeagueDetailedSubPageProps {
  uniqueTournament: TournamentDto;
  seasons: SeasonDto[];
}

const LeagueDetailedSubPage: React.FC<LeagueDetailedSubPageProps> = ({
  uniqueTournament,
  seasons,
}) => {
  const i18n = useTrans();
  const { setTopLeagues, topLeagues: topLeaguesHome } = useHomeStore();
  const { data: topLeagues, isError } = useTopLeagues(SPORT.FOOTBALL);
  const countryLocal: ILanguageKey = (i18n.language as ILanguageKey) ?? 'en';
  const competitionCountry = competitionsByCountry[countryLocal] ?? [];
  const { isDesktop } = useDetectDeviceClient();
  const sortedTopLeagues = useMemo(() => {
    if (!topLeagues || topLeagues?.live === 0 || isError) return [];
    const prioritizedLeagues: ILeaguesItems[] =
      hotLeaguesFootball[countryLocal];

    if (!prioritizedLeagues) return topLeagues;

    const remainingLeagues = topLeagues.filter(
      (league: ILeaguesItems) =>
        !prioritizedLeagues.some(
          (prioritized: ILeaguesItems) => prioritized.id === league.id
        )
    );

    // Sắp xếp remainingLeagues dựa trên competitionCountry
    const sortedRemainingLeagues = remainingLeagues.sort(
      (a: ILeaguesItems, b: ILeaguesItems) => {
        const indexA = competitionCountry.indexOf(a.id);
        const indexB = competitionCountry.indexOf(b.id);
        return (
          (indexA === -1 ? Infinity : indexA) -
          (indexB === -1 ? Infinity : indexB)
        );
      }
    );

    return [...prioritizedLeagues, ...sortedRemainingLeagues];
  }, [topLeagues, competitionCountry, countryLocal]);

  useEffect(() => {
    if (isEqual(topLeaguesHome, sortedTopLeagues)) return;
    setTopLeagues(sortedTopLeagues);
  }, [sortedTopLeagues, setTopLeagues, topLeaguesHome]);

  const [selectedSeason, setSelectedSeason] = useState<SeasonDto>(
    seasons ? seasons[0] : ({} as SeasonDto)
  );

  const { setSelectedOrder, setSelectedView } = useLeagueStore();

  // const { data: teamsData = [], isLoading: isTeamLoading } =
  // useListMatchByStageTeamData(uniqueTournament?.id);

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
        {/* <LeagueBreadcrumb tournament={uniqueTournament}></LeagueBreadcrumb> */}
      </div>
      <TwDataSection className='layout flex transition-all duration-150 lg:flex-row'>
        <TwFilterCol className='flex-shrink-1 sticky top-20 w-full max-w-[209px] no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
          <TwFilterTitle className='font-oswald'>
            {i18n.clubs.youMayBe}
          </TwFilterTitle>
          <TopLeauges leagues={topLeaguesHome} sport={SPORT.FOOTBALL} />
        </TwFilterCol>
        <div className='block w-full lg:grid lg:w-[calc(100%-209px)] lg:grid-cols-3 lg:gap-x-6'>
          <TwMainCol className='!col-span-2'>
            <div className='h-full'>
              <div className='flex w-full flex-col lg:gap-6'>
                <LeagueSummaryFootball
                  uniqueTournament={uniqueTournament}
                  seasons={seasons}
                  setSelectedSeason={(season) => setSelectedSeason(season)}
                  selectedSeason={selectedSeason}
                  isMobile={!isDesktop}
                />
                {!isDesktop ? (
                  <LeagueDetailMobileView
                    uniqueTournament={uniqueTournament}
                    i18n={i18n}
                    selectedSeason={selectedSeason}
                    featuredMatchData={featuredMatchData}
                  />
                ) : (
                  <>
                    <CompetitionInfoSection
                      uniqueTournament={uniqueTournament}
                      i18n={i18n}
                    />
                    <FixturesMatchesByRoundSection
                      uniqueTournament={uniqueTournament}
                      selectedSeason={selectedSeason}
                    />
                    <StandingStable
                      uniqueTournament={uniqueTournament}
                      selectedSeason={selectedSeason}
                    />
                    {/*
                      hide in MB
                     <TeamOfTheWeekSection
                      uniqueTournament={uniqueTournament}
                      selectedSeason={selectedSeason}
                      i18n={i18n}
                    /> */}
                  </>
                )}
              </div>
            </div>
          </TwMainCol>

          <TwQuickViewCol className='sticky top-20 z-[9] col-span-1 w-full overflow-hidden no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
            <div className='flex w-full flex-col gap-6'>
              <QuickViewSummary match={featuredMatchData} isFeatureMatch isSubPage={true} />
              <TeamOfTheWeekSection
                uniqueTournament={uniqueTournament}
                selectedSeason={selectedSeason}
                i18n={i18n}
              />
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
