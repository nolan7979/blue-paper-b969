import { MainColHeader } from '@/components/modules/football';
import { FootballLiveMatchesLoaderSection } from '@/components/modules/football/loaderData/FootballLiveMatchesLoaderSection';
import { FootballMatchLoaderSection } from '@/components/modules/football/loaderData/FootballMatchLoaderSection';
import ResultsMainColHeader from '@/components/modules/volleyball/ResultsMainColHeader';
import { SportMatchListSectionReprIsolated } from '@/components/modules/football/SportMatchListSectionReprIsolated';
import { TwDesktopView } from '@/components/modules/football/tw-components';
import { TwFBWrapMatch } from '@/components/modules/football/tw-components/TwFBHome';

import { PAGE, SPORT } from '@/constant/common';
import { MatchListHeader } from '@/modules/basketball/liveScore/components/MatchListHeader';
import React from 'react';

export const SportFixturesAllMatchesSection = ({
  sport = SPORT.VOLLEYBALL,
  page = PAGE.results,
}: {
  sport: SPORT;
  page:PAGE;
}) => {
  return (
    <>
      <TwDesktopView>
        {page === PAGE.results && <ResultsMainColHeader page={page} />}
        {page === PAGE.fixtures && <MainColHeader sport={sport} page={page} />}
      </TwDesktopView>
      <TwFBWrapMatch>
        <MatchListHeader />
        <FootballMatchLoaderSection page={page} sport={sport} />

        <FootballLiveMatchesLoaderSection sport={sport} />
        {/* <FootballOddsLoaderSection /> */}

        <SportMatchListSectionReprIsolated page={page} sport={sport} />
      </TwFBWrapMatch>
    </>
  );
};
