import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  TwFilterCol,
  TwFilterTitle,
  TwMainCol,
  TwQuickViewCol,
} from '@/components/modules/football/tw-components';
import { TwDataSection } from '@/components/modules/common';

import { useLeagueStore } from '@/stores/league-store';

import {
  SeasonDto,
  SportEventDtoWithStat,
  TournamentDto,
} from '@/constant/interface';
import {
  LeagueSummary,
  Matches as MatchesAMF,
  CupTree as CupTreeAMF,
  FeaturedMatch,
} from '@/components/modules/am-football/competition';
import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/common';
import useTrans from '@/hooks/useTrans';
import { useFeaturedMatch } from '@/hooks/useAmericanFootball';
import { getSlug } from '@/utils';
import { useTopLeagues } from '@/hooks/useCommon';

import { AllLeague } from '@/modules/am-football/competior/components';
import { EmptyEvent } from '@/components/common/empty';
import { useDetectDeviceClient } from '@/hooks/useWindowSize';
import { LeagueDetailMobileView } from '@/modules/am-football/competition/components/LeagueDetailMobileView';
import clsx from 'clsx';

const StandingStableAMF = dynamic(
  () =>
    import('@/components/modules/am-football/competition').then(
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
  // const { topLeagues } = useHomeStore();

  const { data: topLeagues } = useTopLeagues('am-football');

  const { setSelectedOrder, setSelectedView } = useLeagueStore();

  // const { data: teamsData = [], isLoading: isTeamLoading } =
  //   useTeamOfLeagueData(uniqueTournament?.id);

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

  if (!uniqueTournament || !seasons) return <></>;

  return (
    <>
      <div className='layout hidden lg:block'>
        <BreadCrumb className='overflow-x-scroll py-5 no-scrollbar'>
          <BreadCumbLink href='/am-football' name={i18n.header.am_football} />
          <BreadCrumbSep />
          <BreadCumbLink
            href={`/am-football/competition/${getSlug(
              uniqueTournament?.short_name || uniqueTournament?.name
            )}/${uniqueTournament?.id}`}
            name={uniqueTournament?.short_name || uniqueTournament?.name}
            isEnd
          />
        </BreadCrumb>
      </div>
      <TwDataSection className='layout flex transition-all duration-150 lg:flex-row'>
        <TwFilterCol className='flex-shrink-1 sticky top-20 w-full max-w-[209px] no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
          <TwFilterTitle className='font-oswald'>
            {i18n.clubs.youMayBe}
          </TwFilterTitle>
          <AllLeague
            leagueData={topLeagues}
            idLeague={uniqueTournament?.id}
            type='competition'
          />
        </TwFilterCol>
        <div className='block w-full lg:grid lg:w-[calc(100%-209px)] lg:grid-cols-3 lg:gap-x-6'>
          <TwMainCol className='!col-span-2'>
            <div className='h-full'>
              <div
                className={clsx('flex w-full flex-col', {
                  'gap-6': !isMobile,
                })}
              >
                <LeagueSummary
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
                  />
                ) : (
                  <>
                    <StandingStableAMF
                      uniqueTournament={uniqueTournament}
                      selectedSeason={selectedSeason}
                    />
                    <MatchesAMF seasonId={selectedSeason?.id} />
                    <CupTreeAMF selectedSeason={selectedSeason} />
                  </>
                )}
              </div>
            </div>
          </TwMainCol>

          <TwQuickViewCol className='sticky top-20 z-[9] col-span-1 w-full overflow-hidden no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
            <div className='flex w-full flex-col gap-6'>
              {featuredMatchData &&
              Object.keys(featuredMatchData).length > 0 ? (
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
            </div>
          </TwQuickViewCol>
        </div>
      </TwDataSection>
    </>
  );
};

export default LeagueDetailedSubPage;
