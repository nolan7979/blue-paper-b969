import { MainColHeader } from '@/components/modules/am-football/columns';
import ResultsMainColHeader from '@/components/modules/football/ResultsMainColHeader';
import { TwDesktopView } from '@/components/modules/football/tw-components';
import { TwFBWrapMatch } from '@/components/modules/football/tw-components/TwFBHome';

import { SportMatchListSectionReprIsolated as SportMatchListSectionReprIsolatedAMFootball } from '@/components/modules/am-football';
import {
  LiveMatchesLoaderSection as LiveMatchesLoaderSectionAMFootball,
  MatchLoaderSection as MatchLoaderSectionAMFootball,
} from '@/components/modules/am-football/loaderData';
import { PAGE, SPORT } from '@/constant/common';
import { MatchListHeader } from '@/modules/am-football/liveScore/components/MatchListHeader';

export const SportFixturesAllMatchesSection = ({
  sport = SPORT.AMERICAN_FOOTBALL,
  page = PAGE.results,
}: {
  sport: SPORT;
  page: PAGE;
}) => {
  return (
    <>
      <TwDesktopView>
        {page === PAGE.results && <ResultsMainColHeader page={page} />}
        {page === PAGE.fixtures && <MainColHeader />}
      </TwDesktopView>
      <TwFBWrapMatch>
        <MatchListHeader />

        <LiveMatchesLoaderSectionAMFootball sport={sport} />
        <MatchLoaderSectionAMFootball page={page} sport={sport} />
        <SportMatchListSectionReprIsolatedAMFootball
          page={page}
          sport={sport}
        />
      </TwFBWrapMatch>
    </>
  );
};
