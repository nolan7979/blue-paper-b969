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
  LeagueSummary as LeagueSummaryVlb,
  Matches as MatchesVlb,
  CupTree as CupTreeVlb,
  FeaturedMatch,
} from '@/components/modules/volleyball/competition';
import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/common';
import useTrans from '@/hooks/useTrans';
import { useFeaturedMatch } from '@/hooks/useVolleyball';
import { getSlug } from '@/utils';
import { useTopLeagues } from '@/hooks/useCommon';

import { AllLeague as AllLeagueVlb } from '@/modules/volleyball/competior/components';

const StandingStableVlb = dynamic(
  () =>
    import('@/components/modules/volleyball/competition').then(
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
  // const { topLeagues } = useHomeStore();

  const { data: topLeagues } = useTopLeagues('volleyball');

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
          <BreadCumbLink href='/volleyball' name={i18n.header.volleyball} />
          <BreadCrumbSep />
          <BreadCumbLink
            href={`/volleyball/competition/${getSlug(uniqueTournament?.short_name || uniqueTournament?.name)}/${uniqueTournament.id}`}
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
          <AllLeagueVlb leagueData={topLeagues} />
        </TwFilterCol>
        <div className='block w-full lg:grid lg:w-[calc(100%-209px)] lg:grid-cols-3 lg:gap-x-6'>
          <TwMainCol className='!col-span-2'>
            <div className='h-full overflow-hidden'>
              <div className='flex w-full flex-col gap-6'>
                <LeagueSummaryVlb
                  uniqueTournament={uniqueTournament}
                  seasons={seasons}
                  setSelectedSeason={(season) => setSelectedSeason(season)}
                  selectedSeason={selectedSeason}
                />
                
                <StandingStableVlb
                  uniqueTournament={uniqueTournament}
                  selectedSeason={selectedSeason}
                />
                <MatchesVlb selectedSeason={selectedSeason} />
                <CupTreeVlb selectedSeason={selectedSeason} />
              </div>
            </div>
          </TwMainCol>

          <TwQuickViewCol className='col-span-1 sticky top-20 no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
            <div className='flex w-full flex-col gap-6'>
              <FeaturedMatch
                match={featuredMatchData || ({} as SportEventDtoWithStat)}
              />
            </div>
          </TwQuickViewCol>
        </div>
      </TwDataSection>
    </>
  );
};

export default LeagueDetailedSubPage;
