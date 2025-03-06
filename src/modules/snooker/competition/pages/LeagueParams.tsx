import {
  TwDataSection,
  TwFilterCol,
  TwFilterTitle,
  TwMainCol,
  TwQuickViewCol,
} from '@/components/modules/football/tw-components';
import React, { useEffect, useState } from 'react';

import { useLeagueStore } from '@/stores/league-store';

import { LeagueSummary as LeagueSummarySnooker } from '@/components/modules/snooker/competition';
import { SeasonDto, SportEventDtoWithStat, TournamentDto } from '@/constant/interface';

import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/common';

import { EmptyEvent } from '@/components/common/empty';
import { TopLeauges } from '@/components/modules/common/filters/FilterColumn';
import { SPORT } from '@/constant/common';
import { useTopLeagues } from '@/hooks/useCommon';
import useTrans from '@/hooks/useTrans';

import { useHomeStore } from '@/stores';
import { useDetectDeviceClient } from '@/hooks/useWindowSize';
import { LeagueDetailMobileView } from '@/modules/snooker/competition/components/LeagueDetailMobileView';
import { useSnookerFeaturedEvents } from '@/hooks/useSnooker';
import Matches from '@/modules/snooker/competition/components/Matches';
import { FeaturedMatch } from '@/modules/snooker/competitor/components/FeaturedMatch';

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
  const { data: topLeagues, isError } = useTopLeagues(SPORT.SNOOKER);
  const { isDesktop } = useDetectDeviceClient();

  useEffect(() => {
    // if (isEqual(topLeaguesHome, sortedTopLeagues)) return;
    setTopLeagues(topLeagues);
  }, [ setTopLeagues, topLeagues]);

  const [selectedSeason, setSelectedSeason] = useState<SeasonDto>(
    seasons ? seasons[0] : ({} as SeasonDto)
  );

  const { setSelectedOrder, setSelectedView } = useLeagueStore();

  const { data: featuredMatchData } = useSnookerFeaturedEvents(
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
        <BreadCrumb className='no-scrollbar overflow-x-scroll py-5'>
          <BreadCumbLink href='/snooker' name={i18n.header.snooker} />
          <BreadCrumbSep />
          <BreadCumbLink
            href={`/snooker/competition/${uniqueTournament?.name}/${uniqueTournament?.id}}`}
            name={uniqueTournament?.name}
            isEnd
          />
        </BreadCrumb>
      </div>
      <TwDataSection className='layout flex transition-all duration-150 lg:flex-row'>
        <TwFilterCol className='flex-shrink-1 sticky top-20 w-full max-w-[209px] no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
          <TwFilterTitle className='font-oswald'>
            {i18n.clubs.youMayBe}
          </TwFilterTitle>
          <TopLeauges leagues={topLeaguesHome} sport={SPORT.SNOOKER} />
        </TwFilterCol>
        <div className='block w-full lg:grid lg:w-[calc(100%-209px)] lg:grid-cols-3 lg:gap-x-6'>
          <TwMainCol className='!col-span-2'>
            <div className='h-full overflow-hidden'>
              <div className='flex w-full flex-col lg:gap-6'>
                <LeagueSummarySnooker
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
                    <Matches seasonId={selectedSeason?.id} />
                  </>
                )}
              </div>
            </div>
          </TwMainCol>

          <TwQuickViewCol className='sticky top-20 z-[9] col-span-1 w-full overflow-hidden no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
            <div className='flex w-full flex-col gap-6'>
              {featuredMatchData && Object.keys(featuredMatchData).length > 0 ? <FeaturedMatch match={featuredMatchData || ({} as SportEventDtoWithStat)} /> : <div className='bg-white dark:bg-dark-card rounded-md py-8'><EmptyEvent title={i18n.common.nodata} content={''} /></div>}
            </div>
          </TwQuickViewCol>
        </div>
      </TwDataSection>
    </>
  );
};

export default LeagueDetailedSubPage;
