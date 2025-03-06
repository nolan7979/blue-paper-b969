import {
  TwDataSection,
  TwFilterCol,
  TwFilterTitle,
  TwMainCol,
  TwQuickViewCol,
} from '@/components/modules/football/tw-components';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useState } from 'react';

import { useLeagueStore } from '@/stores/league-store';

import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/common';
import { EmptyEvent } from '@/components/common/empty';
import { TopLeauges } from '@/components/modules/common/filters/FilterColumn';
import { QuickViewTabDetailMobile } from '@/components/modules/table-tennis/QuickViewTabDetails';
import {
  CupTree,
  FeaturedMatch,
  LeagueSummary as LeagueSummaryTableTennis,
} from '@/components/modules/table-tennis/competition';
import QuickViewSummary from '@/components/modules/table-tennis/quickviewColumn/QuickViewSummary';
import { SPORT } from '@/constant/common';
import {
  SeasonDto,
  SportEventDtoWithStat,
  TournamentDto,
} from '@/constant/interface';
import { useLeagueInfo, useTopLeagues } from '@/hooks/useCommon';
import {
  useCupTree,
  useFeaturedMatch,
  useMatchLeague,
} from '@/hooks/useTableTennis';
import { useListMatchByStageTeamData } from '@/hooks/useTableTennis';
import useTrans from '@/hooks/useTrans';
import { useWindowSize } from '@/hooks/useWindowSize';
import { MatchCard } from '@/modules/table-tennis/competitor/components';
import { isValEmpty } from '@/utils';

const StandingStableTennis = dynamic(
  () =>
    import('@/components/modules/table-tennis/competition').then(
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
  const [isClient, setIsClient] = useState(false);
  const i18n = useTrans();
  const [selectedSeason, setSelectedSeason] = useState<SeasonDto>(
    seasons ? seasons[0] : ({} as SeasonDto)
  );

  const { data: teamsData = [], isLoading: isTeamLoading } =
    useListMatchByStageTeamData(uniqueTournament?.id);

  const { data: featuredMatchData, isLoading: isFeaturedMatchData } =
    useFeaturedMatch(uniqueTournament?.id);
  const { data: topLeagues } = useTopLeagues(SPORT.TABLE_TENNIS);
  const { data: leagueInfoData, isLoading: isLeagueInfoLoading } =
    useLeagueInfo(uniqueTournament?.id, SPORT.TABLE_TENNIS);
  const { data: matchNextData, isLoading: isMatchNextLoading } = useMatchLeague(
    selectedSeason?.id,
    'next/1'
  );
  const { data: matchLastData, isLoading: isMatchLastLoading } = useMatchLeague(
    selectedSeason?.id,
    'last/0'
  );

  const { data: cupTreeData, isLoading: isCupTreeLoading } = useCupTree(
    selectedSeason?.id
  );

  const matchData: any = useMemo(() => {
    if (!matchNextData && !matchLastData) return [];

    if (!matchNextData) return matchLastData;

    if (!matchLastData) return matchNextData;

    return [...matchNextData, ...matchLastData];
  }, [matchNextData, matchLastData]);

  const { width } = useWindowSize();
  const isMobile = useMemo(() => width < 768, [width]);

  useEffect(() => {
    if (seasons) {
      setSelectedSeason(seasons[0]);
    }
  }, [seasons]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);

  if (!isClient) return <></>;

  if (!uniqueTournament || !seasons) return <></>;

  return (
    <>
      <div className='layout hidden lg:block'>
        <BreadCrumb className='overflow-x-scroll py-5 no-scrollbar'>
          <BreadCumbLink href='/table-tennis' name={i18n.header.table_tennis} />
          <BreadCrumbSep />
          {/* <BreadCumbLink
            href={`/tennis/cim/${'teamName'}/${'teamId'}`}
            name='League'
            isEnd
          />
          <BreadCrumbSep /> */}
          <BreadCumbLink
            href={`/table-tennis/competition/${uniqueTournament.slug}/${uniqueTournament.id}`}
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
          <TopLeauges leagues={topLeagues} sport={SPORT.TABLE_TENNIS} />
        </TwFilterCol>
        <div className='block w-full lg:grid lg:w-[calc(100%-209px)] lg:grid-cols-3 lg:gap-x-6'>
          <TwMainCol className='!col-span-2'>
            <div className='h-full overflow-hidden'>
              <div className='w-full flex-col gap-6 lg:flex'>
                <LeagueSummaryTableTennis
                  isMobile={isMobile}
                  uniqueTournament={uniqueTournament}
                  seasons={seasons}
                  setSelectedSeason={(season) => setSelectedSeason(season)}
                  selectedSeason={selectedSeason}
                />
                {isMobile ? (
                  <QuickViewTabDetailMobile
                    isMobile={isMobile}
                    top={true}
                    sticky={true}
                    leagues={topLeagues}
                    uniqueTournament={uniqueTournament}
                    teams={teamsData}
                    match={featuredMatchData || ({} as SportEventDtoWithStat)}
                    surface={leagueInfoData?.surface || ''}
                    sets={leagueInfoData?.sets || 0}
                    hostCity={leagueInfoData?.host_city || ''}
                    selectedSeason={selectedSeason}
                    matchData={matchData}
                  />
                ) : (
                  <>
                    {/* <MatchesTableTennis
                      leagues={topLeagues}
                      uniqueTournament={uniqueTournament}
                      teams={teamsData}
                      selectedSeason={selectedSeason}
                    />
                    <CupTreeTableTennis selectedSeason={selectedSeason} /> */}
                    <StandingStableTennis
                      selectedSeason={selectedSeason}
                      uniqueTournament={uniqueTournament}
                    />
                    <MatchCard matchData={matchData} />
                    <CupTree selectedSeason={selectedSeason} />
                  </>
                )}
              </div>
            </div>
          </TwMainCol>

          <TwQuickViewCol className='sticky top-20 z-[9] col-span-1 w-full overflow-hidden no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
            <div className='flex w-full flex-col gap-6'>
              <div>
                {!isFeaturedMatchData && !isValEmpty(featuredMatchData) && (
                  <FeaturedMatch
                    match={featuredMatchData as SportEventDtoWithStat}
                  />
                )}
                {!isFeaturedMatchData && isValEmpty(featuredMatchData) && (
                  <EmptyEvent title={i18n.common.nodata} content={''} />
                )}
              </div>
              {/* <LeagusInfo
                surface={leagueInfoData?.surface || ''}
                sets={leagueInfoData?.sets || 0}
                hostCity={leagueInfoData?.host_city || ''}
                // hostCountry={leagueInfoData?.name || ''}
              /> */}
              {/* <TopPlayerTennis selectedSeason={selectedSeason} />
              <TopTeamTennis selectedSeason={selectedSeason} /> */}
            </div>
          </TwQuickViewCol>
        </div>
      </TwDataSection>
    </>
  );
};

export default LeagueDetailedSubPage;
