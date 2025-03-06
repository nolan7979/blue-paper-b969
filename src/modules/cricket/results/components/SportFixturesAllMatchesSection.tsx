import { MatchListHeader } from '@/components/modules/football';
import { FootballLiveMatchesLoaderSection } from '@/components/modules/football/loaderData/FootballLiveMatchesLoaderSection';
import { FootballMatchLoaderSection } from '@/components/modules/football/loaderData/FootballMatchLoaderSection';
import { FootballOddsLoaderSection } from '@/components/modules/football/loaderData/FootballOddsLoaderSection';
import ResultsMainColHeader from '@/components/modules/football/ResultsMainColHeader';
import { SportMatchListSectionReprIsolated } from '@/components/modules/football/SportMatchListSectionReprIsolated';
import { TwDesktopView } from '@/components/modules/football/tw-components';
import { TwFBWrapMatch } from '@/components/modules/football/tw-components/TwFBHome';

import { PAGE, SPORT } from '@/constant/common';
import { FixturesMainColHeader } from '@/modules/football/fixtures/components/FixturesMainColComponents';

export const SportFixturesAllMatchesSection = ({
  sport,
  page = PAGE.results,
}: {
  sport: SPORT;
  page: PAGE
}) => {
  return (
    <>
      <TwDesktopView>
        {page === PAGE.results && <ResultsMainColHeader page={page} />}
        {page === PAGE.fixtures && <FixturesMainColHeader />}
      </TwDesktopView>
      <TwFBWrapMatch>
        <MatchListHeader />
        <FootballMatchLoaderSection page={page} sport={sport} />

        <FootballLiveMatchesLoaderSection />
        <FootballOddsLoaderSection />

        <SportMatchListSectionReprIsolated page={page} sport={sport} />
      </TwFBWrapMatch>
    </>
  );
};
