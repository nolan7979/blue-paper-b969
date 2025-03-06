import { useLeagueStore } from '@/stores/league-store';

import { LeagueStandingsSection } from '@/modules/football/competition/components/LeagueStandingsSection';
import { SelectStandingSection } from '@/modules/football/competition/components/SelectStandingSection';
import { useState } from 'react';

type IProps = {
  tournamentId: string;
  seasonId: string;
}

export const BxhMainColContentSection = () => {
  const { selectedSeason, selectedLeague } = useLeagueStore();

  const [dataFetchStandings, setDataFetchStandings] = useState<IProps>({tournamentId: selectedLeague, seasonId: selectedSeason});

  return (
    <>
      <SelectStandingSection dataInfo={setDataFetchStandings} />
      <div className='space-y-4'>
        <LeagueStandingsSection
          tournamentId={dataFetchStandings.tournamentId}
          seasonId={dataFetchStandings.seasonId}
          type='total'
          wide={true}
          uniqueTournament={true}
        />
      </div>
    </>
  );
};
