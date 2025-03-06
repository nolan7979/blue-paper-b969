import { FC, useMemo, useState } from 'react';
import useTrans from '@/hooks/useTrans';
import Filter from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Filter';
import { CompetitorDto } from '@/constant/interface';
import { TeamsAverageTable } from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Table';

export type BothTeamsScoreData = {};

type BothTeamsScoreProps = {
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  data: BothTeamsScoreData;
};

const BothTeamsScore: FC<BothTeamsScoreProps> = ({
  homeTeam,
  awayTeam,
  data,
}) => {
  const i18n = useTrans();
  const [filter, setFilter] = useState<string>('full-time');

  const filterItems = [
    {
      label: i18n.footy_stats.full_time,
      value: 'full-time',
    },
    { label: i18n.footy_stats.first_second_half, value: '1st-2ndHalf' },
  ];

  const headerTitles = [
    {
      title: i18n.footy_stats.btts,
      className: 'w-1/4 !justify-start !text-left',
    },
    {
      title: homeTeam?.shortName || homeTeam?.name || '',
      className: 'w-1/4',
    },
    {
      title: awayTeam?.shortName || awayTeam?.name || '',
      className: 'w-1/4',
    },
    {
      title: i18n.footy_stats.avg || '',
      className: 'w-1/4',
    },
  ];

  const BothTeamsScoreData = useMemo(() => {
    if (filter === '1st-2ndHalf') {
      return []; // todo: getHalfGoalsScoredData(data.halfTable, i18n);
    }
    return []; // todo: getFullTimeGoalsScoredData(data.fullTimeTable, i18n)},
  }, [data, i18n, filter]);

  return (
    <div className='flex flex-col gap-3'>
      <h4 className='text-center text-xs font-bold uppercase dark:text-white'>
        BOTH TEAMS TO SCORE
      </h4>
      <Filter filter={filter} setFilter={setFilter} items={filterItems} />
      <TeamsAverageTable
        headerTitles={headerTitles}
        stats={BothTeamsScoreData}
      />
    </div>
  );
};

export default BothTeamsScore;
