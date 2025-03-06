import { useEffect } from 'react';

import {
  useCompetitionInfoData,
  useCompetitionSeasonData,
} from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';

import { useLeagueMatchFilterStore } from '@/stores';

import { FixturesLeagueHeader } from '@/modules/football/fixtures/components/FixturesLeagueHeader';
import { FixturesMatchLeagueSection } from '@/modules/football/fixtures/components/FixturesMatchLeagueSection';
import React from 'react';

interface FixturesSelectedLeagueSectionProps {
  tournamentId: string;
}

const FixturesSelectedLeagueSection: React.FC<
  FixturesSelectedLeagueSectionProps
> = ({ tournamentId }) => {
  const i18n = useTrans();

  const { data: tournament = {}, isLoading } =
    useCompetitionInfoData(tournamentId);

  const { data: seasons, isLoading: isLoadingSeasons } =
    useCompetitionSeasonData(tournamentId);

  const { setFilterMatchBy } = useLeagueMatchFilterStore();

  useEffect(() => {
    setFilterMatchBy('by_round');
  }, [seasons, setFilterMatchBy]);

  if (
    isLoading ||
    isLoadingSeasons ||
    !tournament ||
    !seasons ||
    seasons.length === 0
  ) {
    return <></>;
  }

  return (
    <div className=' divide-list'>
      {/* TODO can show league header here + season filter aaa */}
      <FixturesLeagueHeader uniqueTournament={tournament.uniqueTournament} />

      <div className=''>
        <FixturesMatchLeagueSection
          uniqueTournament={tournament.uniqueTournament}
          selectedSeason={seasons[0]}
          i18n={i18n}
        />
      </div>
    </div>
  );
};
export default FixturesSelectedLeagueSection;
