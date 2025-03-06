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
  LeagueSummary,
  Matches as MatchesCricket,
  CupTree as CupTreeCricket,
  FeaturedMatch,
} from '@/components/modules/cricket/competition';
import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/common';
import useTrans from '@/hooks/useTrans';
import { useFeaturedMatch } from '@/hooks/useCricket';
import { getSlug } from '@/utils';
import { useTopLeagues } from '@/hooks/useCommon';

import { AllLeague } from '@/modules/cricket/competior/components';
import { EmptyEvent } from '@/components/common/empty';

const StandingStableCricket = dynamic(
  () =>
    import('@/components/modules/cricket/competition').then(
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
  const [selectedSeason, setSelectedSeason] = useState<SeasonDto>(
    seasons ? seasons[0] : ({} as SeasonDto)
  );

  const { data: topLeagues } = useTopLeagues('cricket');

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
        <BreadCrumb className='no-scrollbar overflow-x-scroll py-5'>
          <BreadCumbLink href='/cricket' name={i18n.header.cricket} />
          <BreadCrumbSep />
          <BreadCumbLink
            href={`/cricket/competition/${getSlug(uniqueTournament?.short_name || uniqueTournament?.name)}/${uniqueTournament?.id}`}
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
                <LeagueSummary
                  uniqueTournament={uniqueTournament}
                  seasons={seasons}
                  setSelectedSeason={(season) => setSelectedSeason(season)}
                  selectedSeason={selectedSeason}
                />
                <StandingStableCricket
                  uniqueTournament={uniqueTournament}
                  selectedSeason={selectedSeason}
                />
                <MatchesCricket seasonId={selectedSeason?.id} />
                <CupTreeCricket selectedSeason={selectedSeason} />
              </div>
            </div>
          </TwMainCol>

          <TwQuickViewCol className='col-span-1 sticky top-20 no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
            <div className='flex w-full flex-col gap-6'>
              {featuredMatchData && Object.keys(featuredMatchData).length > 0 ? <FeaturedMatch
                match={featuredMatchData || ({} as SportEventDtoWithStat)}
              /> : <div className='bg-white dark:bg-dark-card rounded-md py-8'><EmptyEvent title={i18n.common.nodata} content={''} /></div>}
            </div>
          </TwQuickViewCol>
        </div>
      </TwDataSection>
    </>
  );
};

export default LeagueDetailedSubPage;
