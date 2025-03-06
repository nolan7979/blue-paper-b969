import { VerticalHomeTeamLineUp } from '@/components/modules/football/quickviewColumn/QuickViewSquadTab';
import { useLeagueStore } from '@/stores/league-store';

export const ShowTopPlayers: React.FC<{ data: any }> = ({ data }) => {
  const { selectedXIRound } = useLeagueStore();
  const lineups = data.rounds?.find((x: any) => x?.id === selectedXIRound?.id);
  if (!lineups) return <></>;

  return (
    <VerticalHomeTeamLineUp
      lineups={lineups?.detail}
      showStats={false}
    ></VerticalHomeTeamLineUp>
  );
};
