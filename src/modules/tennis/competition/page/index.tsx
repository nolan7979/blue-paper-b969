import {
  TwDataSection,
  TwFilterCol,
  TwFilterTitle,
  TwMainCol,
  TwQuickViewCol,
} from '@/components/modules/football/tw-components';
import React, { useEffect, useMemo, useState } from 'react';

import { useLeagueStore } from '@/stores/league-store';

import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/common';
import { TopLeauges } from '@/components/modules/common/filters/FilterColumn';
import { QuickViewTabDetailMobile } from '@/components/modules/tennis/QuickViewTabDetails';
import {
  CupTree as CupTreeTennis,
  FeaturedMatch,
  LeagueSummary as LeagueSummaryTennis,
  Matches as MatchesTennis,
} from '@/components/modules/tennis/competition';
import LeagusInfo from '@/components/modules/tennis/competition/GetTournamentDetails';
import { SPORT } from '@/constant/common';
import {
  SeasonDto,
  SportEventDtoWithStat,
  TournamentDto,
} from '@/constant/interface';
import { useTopLeagues } from '@/hooks/useCommon';
import {
  useFeaturedMatch,
  useLeagueInfo,
  useListMatchByStageTeamData,
} from '@/hooks/useTennis';
import useTrans from '@/hooks/useTrans';
import { useWindowSize } from '@/hooks/useWindowSize';


interface LeagueDetailedSubPageProps {
  uniqueTournament: TournamentDto;
  teams: SportEventDtoWithStat[];
  seasons: SeasonDto[];
  team: any;
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

  const { setSelectedOrder, setSelectedView } = useLeagueStore();

  const { data: teamsData = [], isLoading: isTeamLoading } =
    useListMatchByStageTeamData(uniqueTournament?.id);

  const { data: featuredMatchData, isLoading: isFeaturedMatchData } =
    useFeaturedMatch(uniqueTournament?.id);
  const { data: topLeagues } = useTopLeagues(SPORT.TENNIS);
  const { data: leagueInfoData, isLoading: isLeagueInfoLoading } =
  useLeagueInfo(uniqueTournament?.id);
  const { width } = useWindowSize();
  const isMobile = useMemo(() => width < 768, [width]);
  useEffect(() => {
    setSelectedView(0);
    setSelectedOrder(1);
  }, [selectedSeason, setSelectedOrder, setSelectedView]);

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
          <BreadCumbLink href='/tennis' name={i18n.header.tennis} />
          <BreadCrumbSep />
          {/* <BreadCumbLink
            href={`/tennis/cim/${'teamName'}/${'teamId'}`}
            name='League'
            isEnd
          />
          <BreadCrumbSep /> */}
          <BreadCumbLink
            href={`/tennis/competition/${uniqueTournament.slug}/${uniqueTournament.id}`}
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
          <TopLeauges leagues={topLeagues} sport={SPORT.TENNIS} />
        </TwFilterCol>
        <div className='block w-full lg:grid lg:w-[calc(100%-209px)] lg:grid-cols-3 lg:gap-x-6'>
          <TwMainCol className='!col-span-2'>
            <div className='h-full overflow-hidden'>
              <div className='w-full flex-col gap-6 lg:flex'>
                <LeagueSummaryTennis
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
                    isLoading={isFeaturedMatchData}
                    leagues={topLeagues}
                    uniqueTournament={uniqueTournament}
                    teams={teamsData}
                    match={featuredMatchData || ({} as SportEventDtoWithStat)}
                    surface={leagueInfoData?.surface || ''}
                    sets={leagueInfoData?.sets || 0}
                    hostCity={leagueInfoData?.host_city || ''}
                    selectedSeason={selectedSeason}
                  />
                ) : (
                  <>
                    <MatchesTennis
                      leagues={topLeagues}
                      uniqueTournament={uniqueTournament}
                      teams={teamsData}
                      selectedSeason={selectedSeason}
                    />
                    <CupTreeTennis selectedSeason={selectedSeason} />
                  </>
                )}
              </div>
            </div>
          </TwMainCol>

          <TwQuickViewCol className='sticky top-20 z-[9] col-span-1 w-full overflow-hidden no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
            <div className='flex w-full flex-col gap-6'>
              <FeaturedMatch
                isLoading={isFeaturedMatchData}
                isMobile={isMobile}
                match={featuredMatchData || ({} as SportEventDtoWithStat)}
              />
              <LeagusInfo
                surface={leagueInfoData?.surface || ''}
                sets={leagueInfoData?.sets || 0}
                hostCity={leagueInfoData?.host_city || ''}
                // hostCountry={leagueInfoData?.name || ''}
              />
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
