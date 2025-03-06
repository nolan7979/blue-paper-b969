import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  TwDataSection,
  TwFilterCol,
  TwFilterTitle,
  TwMainCol,
  TwQuickViewCol,
} from '@/components/modules/football/tw-components';

import { useLeagueStore } from '@/stores/league-store';

import {
  SeasonDto,
  SportEventDtoWithStat,
  TournamentDto,
} from '@/constant/interface';
import {
  LeagueSummary as LeagueSummaryHockey,
  Matches as MatchesHockey,
  CupTree as CupTreeHockey,
  FeaturedMatch,
} from '@/components/modules/hockey/competition';

import { AllLeague } from '@/modules/hockey/competior/components';
import { useFeaturedMatch } from '@/hooks/useHockey';
import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/common';
import useTrans from '@/hooks/useTrans';
import { useHomeStore } from '@/stores';
import { EmptyEvent } from '@/components/common/empty';
import FeatureMatchSkeleton from '@/components/common/skeleton/match/FeatureMatchSkeleton';
import { useDetectDeviceClient } from '@/hooks';

const StandingStableHockey = dynamic(
  () =>
    import('@/components/modules/hockey/competition').then(
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

  const { data: featuredMatchData, isLoading } = useFeaturedMatch(uniqueTournament?.id);

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
        <BreadCrumb className='no-scrollbar overflow-x-scroll py-5'>
          <BreadCumbLink href={`/hockey`} name={'Ice Hockey'} />
          <BreadCrumbSep />
          <BreadCumbLink
            href={`/hockey/competition/${uniqueTournament.slug}/${uniqueTournament.id}`}
            name={uniqueTournament?.short_name || uniqueTournament?.name}
            isEnd
          />
        </BreadCrumb>
      </div>
      <TwDataSection className='layout flex transition-all duration-150 lg:flex-row'>
        <TwFilterCol className='flex-shrink-1 no-scrollbar sticky top-20 w-full max-w-[209px] lg:h-[91vh] lg:overflow-y-scroll'>
          <TwFilterTitle className='font-oswald'>
            {i18n.clubs.youMayBe}
          </TwFilterTitle>
          <AllLeague leagueData={topLeagues} idLeague={uniqueTournament?.id} type="competition" />
        </TwFilterCol>
        <div className='block w-full lg:grid lg:w-[calc(100%-209px)] lg:grid-cols-3 lg:gap-x-6'>
          <TwMainCol className='!col-span-2'>
            <div className='h-full overflow-hidden'>

              <div className='flex w-full flex-col gap-6'>
                <LeagueSummaryHockey
                  uniqueTournament={uniqueTournament}
                  seasons={seasons}
                  setSelectedSeason={(season) => setSelectedSeason(season)}
                  selectedSeason={selectedSeason}
                />
                {isMobile && <div className='flex w-full flex-col gap-6'>
                  {featuredMatchData && Object.keys(featuredMatchData).length > 0 ? <FeaturedMatch
                    match={featuredMatchData || ({} as SportEventDtoWithStat)}
                  /> : (
                    <>{isLoading ? <FeatureMatchSkeleton /> : <div className='bg-white dark:bg-dark-card rounded-md py-8'><EmptyEvent title={i18n.common.nodata} content={''} /></div>}</>
                  )}
                </div>}
                <StandingStableHockey
                  uniqueTournament={uniqueTournament}
                  selectedSeason={selectedSeason}
                />
                <MatchesHockey seasonId={selectedSeason?.id} />
                <CupTreeHockey selectedSeason={selectedSeason} />
              </div>
            </div>
          </TwMainCol>

          <TwQuickViewCol className='lg:sticky top-20 z-[9] col-span-1 w-full overflow-hidden no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
            <div className='flex w-full flex-col gap-6'>
              {featuredMatchData && Object.keys(featuredMatchData).length > 0 ? <FeaturedMatch
                match={featuredMatchData || ({} as SportEventDtoWithStat)}
              /> : (
                <>{isLoading ? <FeatureMatchSkeleton /> : <div className='bg-white dark:bg-dark-card rounded-md py-8'><EmptyEvent title={i18n.common.nodata} content={''} /></div>}</>
              )}
            </div>
          </TwQuickViewCol>
        </div>
      </TwDataSection>
    </>
  );
};

export default LeagueDetailedSubPage;
