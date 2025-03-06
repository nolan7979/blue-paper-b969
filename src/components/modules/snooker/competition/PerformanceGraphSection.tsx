import { SelectTeam } from '@/components/common/selects/SelectTeam';
import PerformanceGraph from '@/components/modules/football/standings/PerformanceGraph';
import { TwCard, TwTitle } from '@/components/modules/football/tw-components';
import { useStatsInfoData } from '@/hooks/useFootball';
import { useLeagueStore } from '@/stores/league-store';
import { isValEmpty } from '@/utils';
import { useEffect, useState } from 'react';

const PerformanceGraphSection = ({
  tournamentId,
  seasonId,
  i18n,
}: {
  tournamentId: string;
  seasonId: string;
  i18n?: any;
}) => {
  const [team1, setTeam1] = useState<any>({});
  const [team2, setTeam2] = useState<any>({});
  const { showPerformanceGraph, setShowPerformanceGraph } = useLeagueStore();

  const { data, isLoading } = useStatsInfoData(tournamentId, seasonId);

  useEffect(() => {
    if (data?.teams?.length > 0) {
      setTeam1(data?.teams[0]);
      setShowPerformanceGraph(true);
    }
  }, [data, setShowPerformanceGraph]);

  if (isLoading || !data) return <></>;

  const { teams = [] } = data;
  if (isValEmpty(teams)) return <></>;

  return (
    <TwCard className=''>
      <TwTitle className='p-2.5'>{i18n.competition.performance}</TwTitle>
      <div className='p-2.5 '>
        <div className='flex justify-between pb-4'>
          <div className='w-5/12 md:w-52'>
            <SelectTeam
              options={teams}
              valueGetter={setTeam1}
              // shownValue={team1?.shortName || team1?.name} // TODO: dedicated component
              size='full'
              label='shortName'
            ></SelectTeam>
          </div>
          <div className='w-5/12 md:w-52'>
            <SelectTeam
              options={[
                { id: '', name: i18n.competition.selectTeam },
                ...teams,
              ]}
              valueGetter={setTeam2}
              // shownValue={team2?.shortName || team2?.name} // TODO: dedicated component
              size='full'
              label='shortName'
            ></SelectTeam>
          </div>
        </div>
        <PerformanceGraph
          tournamentId={tournamentId}
          seasonId={seasonId}
          team1={team1}
          team2={team2}
          showPerformanceGraph={showPerformanceGraph}
          numTeams={data?.teams?.length || 0}
          i18n={i18n}
        ></PerformanceGraph>
      </div>
    </TwCard>
  );
};

export default PerformanceGraphSection;
