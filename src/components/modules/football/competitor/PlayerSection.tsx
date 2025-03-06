import {
  ShowTeamSeasonTopPlayers,
  TeamSeasonTopPlayersFilter,
} from '@/modules/football/competitor/components';

import { FilterButton } from '@/components/modules/football/competitor/FilterButton';
import { Player, StatsSeason, UniqueTournament } from '@/models/interface';
import { useEffect, useState } from 'react';
import useTrans from '@/hooks/useTrans';
import { useWindowSize } from '@/hooks';
import dynamic from 'next/dynamic';
import { useTeamStore } from '@/stores/team-store';
import { useTeamPlayerStatsSeasonsData } from '@/hooks/useFootball';
import { SPORT } from '@/constant/common';

const TeamPlayersSection = dynamic(
  () =>
    import('@/modules/football/competitor/components').then(
      (mod) => mod.TeamPlayersSection
    ),
  {
    ssr: false,
  }
);

type PlayerSectionProps = {
  teamId: string;
  players: {
    players: Player[];
    foreignPlayers: number;
    nationalPlayers: number;
  };
  isDesktop: boolean;
};

export const PlayerSection: React.FC<PlayerSectionProps> = ({
  teamId,
  players,
  isDesktop,
}) => {
  const i18n = useTrans();
  const { width } = useWindowSize();
  const [filterPlayer, setFilterPlayer] = useState('squad');

  const {
    playerStatsSeason,
    playerStatsTournament,
    setPlayerStatsTournament,
    setPlayerStatsSeason,
  } = useTeamStore();

  const filters = [
    {
      label: i18n.tab.squad,
      value: 'squad',
    },
    {
      label: i18n.titles.top_players,
      value: 'top-player',
    },
  ];

  const { data, isLoading } = useTeamPlayerStatsSeasonsData(teamId, SPORT.FOOTBALL);
  const [seasonOptions, setSeasonOptions] = useState<StatsSeason[]>([]);

  useEffect(() => {
    const { uniqueTournamentSeasons = [], typeMaps = {} } = data || [];
    const sameTournaments = uniqueTournamentSeasons.filter((item: any) => {
      return item.uniqueTournament?.id === playerStatsTournament?.id;
    });
    let sameTournament = [];
    if (sameTournaments.length) {
      sameTournament = sameTournaments[0] || {};
    }

    const seasonOptions = sameTournament?.seasons || [];
    setSeasonOptions(seasonOptions);
    if (seasonOptions.length) {
      setPlayerStatsSeason(seasonOptions[0]);
    }
  }, [data, playerStatsTournament, setSeasonOptions, setPlayerStatsSeason]);

  const { uniqueTournamentSeasons = [], typeMaps = {} } = data || {};
  const tournaments: UniqueTournament[] = uniqueTournamentSeasons.map(
    (item: any) => {
      return item.uniqueTournament || {};
    }
  );

  useEffect(() => {
    if(!isDesktop) setFilterPlayer('top-player');
  }, [])

  return (
    <div className='flex flex-col gap-4'>
      {isDesktop && <div className='flex gap-1'>
        {filters.map((item) => (
          <FilterButton
            key={item.value}
            isActive={filterPlayer === item.value}
            label={item.label}
            onClick={() => setFilterPlayer(item.value)}
          />
        ))}
      </div>}
      {filterPlayer === 'squad' && (
        <TeamPlayersSection
          players={players}
          i18n={i18n}
          isMobile={!isDesktop}
        />
      )}
      {filterPlayer === 'top-player' && (
        <>
          <TeamSeasonTopPlayersFilter
            isLoading={isLoading || !data}
            seasonOptions={seasonOptions}
            tournaments={tournaments}
            setPlayerStatsTournament={setPlayerStatsTournament}
          />
          <ShowTeamSeasonTopPlayers
            teamId={teamId}
            playerStatsSeason={playerStatsSeason}
            playerStatsTournament={playerStatsTournament}
          />
        </>
      )}
    </div>
  );
};
