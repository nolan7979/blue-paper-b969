import {
  TwDataSection,
  TwFilterCol,
  TwFilterTitle,
  TwMainCol,
  TwQuickViewCol,
} from '@/components/modules/football/tw-components';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useState } from 'react';

import { useLeagueStore } from '@/stores/league-store';

import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/common';
import { EmptyEvent } from '@/components/common/empty';
import {
  CupTree as CupTreeBkb,
  FeaturedMatch,
  LeagueSummary as LeagueSummaryBkb,
  Matches as MatchesBkb,
  TopPlayer as TopPlayerBkb,
  TopTeam as TopTeamBkb,
} from '@/components/modules/basketball/competition';
import { TopLeauges } from '@/components/modules/common/filters/FilterColumn';
import { SPORT } from '@/constant/common';
import {
  SeasonDto,
  SportEventDtoWithStat,
  TournamentDto,
} from '@/constant/interface';
import { useFeaturedMatch, useTeamOfLeagueData } from '@/hooks/useBasketball';
import useTrans from '@/hooks/useTrans';
import { useDetectDeviceClient } from '@/hooks/useWindowSize';
import { LeagueDetailMobileView } from '@/modules/basketball/competition/components/LeagueDetailMobileView';
import { useHomeStore } from '@/stores';

const StandingStableBkb = dynamic(
  () =>
    import('@/components/modules/basketball/competition').then(
      (mod) => mod.StandingStable
    ),
  { ssr: false }
);

interface LeagueDetailedSubPageProps {
  uniqueTournament: TournamentDto;
  seasons: SeasonDto[];
}

const LeagueDetailedSubPage: React.FC<LeagueDetailedSubPageProps> = ({
  uniqueTournament,
  seasons,
}) => {
  const i18n = useTrans();
  const { isMobile } = useDetectDeviceClient();

  const [selectedSeason, setSelectedSeason] = useState<SeasonDto>(
    seasons ? seasons[0] : ({} as SeasonDto)
  );
  const { topLeagues } = useHomeStore();

  const { setSelectedOrder, setSelectedView } = useLeagueStore();

  const { data: teamsData = [], isLoading: isTeamLoading } =
    useTeamOfLeagueData(uniqueTournament?.id);

  const { data: featuredMatchData } = useFeaturedMatch(uniqueTournament?.id);

  useEffect(() => {
    setSelectedView(0);
    setSelectedOrder(1);
  }, [selectedSeason, setSelectedOrder, setSelectedView]);

  useEffect(() => {
    if (seasons) {
      setSelectedSeason(seasons[0]);
    }
  }, [seasons]);

  const showFeaturedMatch = useMemo(() => {
    return (
      featuredMatchData &&
      Object.keys(featuredMatchData).length > 0 &&
      seasons[0]?.id === selectedSeason?.id
    );
  }, [featuredMatchData, seasons, selectedSeason]);

  if (!uniqueTournament || !seasons) return <></>;

  return (
    <>
      <div className='layout hidden lg:block'>
        <BreadCrumb className='overflow-x-scroll py-5 no-scrollbar'>
          <BreadCumbLink
            href={`/${i18n.language}/basketball`}
            name={i18n.header.basketball}
          />
          <BreadCrumbSep />
          <BreadCumbLink
            href={`${i18n.language}/basketball/competition/${uniqueTournament.slug}/${uniqueTournament.id}`}
            name={uniqueTournament?.short_name}
            isEnd
          />
        </BreadCrumb>
      </div>
      <TwDataSection className='layout flex transition-all duration-150 lg:flex-row'>
        <TwFilterCol className='flex-shrink-1 sticky top-20 w-full max-w-[209px] no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
          <TwFilterTitle className='font-oswald'>
            {i18n.clubs.youMayBe}
          </TwFilterTitle>
          <TopLeauges leagues={topLeagues} sport={SPORT.BASKETBALL} />
        </TwFilterCol>
        <div className='block w-full lg:grid lg:w-[calc(100%-209px)] lg:grid-cols-3 lg:gap-x-6'>
          <TwMainCol className='!col-span-2'>
            <div className='h-full'>
              <div
                className={clsx('flex w-full flex-col ', {
                  'gap-6': !isMobile,
                })}
              >
                <LeagueSummaryBkb
                  uniqueTournament={uniqueTournament}
                  seasons={seasons}
                  setSelectedSeason={(season) => setSelectedSeason(season)}
                  selectedSeason={selectedSeason}
                  isMobile={isMobile}
                />
                {isMobile ? (
                  <LeagueDetailMobileView
                    uniqueTournament={uniqueTournament}
                    i18n={i18n}
                    selectedSeason={selectedSeason}
                    featuredMatchData={featuredMatchData}
                    teams={teamsData}
                    showFeaturedMatch={showFeaturedMatch}
                  />
                ) : (
                  <>
                    <StandingStableBkb
                      uniqueTournament={uniqueTournament}
                      selectedSeason={selectedSeason}
                    />
                    <MatchesBkb
                      teams={teamsData}
                      selectedSeason={selectedSeason}
                    />
                    <CupTreeBkb selectedSeason={selectedSeason} />
                  </>
                )}
              </div>
            </div>
          </TwMainCol>

          <TwQuickViewCol className='sticky top-20 z-[9] col-span-1 w-full overflow-hidden no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
            <div className='flex w-full flex-col gap-6'>
              {showFeaturedMatch ? (
                <FeaturedMatch
                  match={featuredMatchData || ({} as SportEventDtoWithStat)}
                />
              ) : (
                <div className='rounded-md bg-white p-4 dark:bg-dark-card'>
                  <h3 className='mb-4 font-primary font-bold uppercase text-black dark:text-white'>
                    {i18n.titles.featured_match}
                  </h3>
                  <EmptyEvent title={i18n.common.nodata} content={''} />
                </div>
              )}
              <TopPlayerBkb selectedSeason={selectedSeason} />
              <TopTeamBkb selectedSeason={selectedSeason} />
            </div>
          </TwQuickViewCol>
        </div>
      </TwDataSection>
    </>
  );
};

export default LeagueDetailedSubPage;
