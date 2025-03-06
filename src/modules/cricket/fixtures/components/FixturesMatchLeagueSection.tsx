// import { FixturesMatchesByRoundSection } from '@/components/football/fixtures/FixturesMainColComponents';

import { RoundFilterSection } from '@/modules/football/competition/components';
import { FixturesMatchesByRoundSection } from '@/modules/football/fixtures/components/FixturesMatchesByRoundSection';

export const FixturesMatchLeagueSection = ({
  uniqueTournament,
  selectedSeason,
  i18n,
}: {
  uniqueTournament: any;
  selectedSeason: any;
  i18n: any;
}) => {
  return (
    <>
      <RoundFilterSection
        uniqueTournamentId={uniqueTournament?.id}
        selectedSeasonId={selectedSeason?.id}
      ></RoundFilterSection>

      <FixturesMatchesByRoundSection
        uniqueTournament={uniqueTournament}
        selectedSeason={selectedSeason}
      ></FixturesMatchesByRoundSection>
    </>
  );
};
