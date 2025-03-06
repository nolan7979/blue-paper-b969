import { FC, useMemo, useState } from 'react';

import {
  CompetitorDto,
  FullTimeScoredStats,
  HalfTimeScoredStats,
} from '@/constant/interface';
import GoalsScoredBox from '@/components/modules/football/quickviewColumn/quickviewFootyTab/GoalsScoredBox';
import useTrans from '@/hooks/useTrans';
import Filter from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Filter';
import { GoalsScoredTable } from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Table';
import {
  getFullTimeGoalsScoredData,
  getHalfGoalsScoredData,
} from '@/utils/footyUtils';

export type GoalsScoredData = {
  seasonScoredAVGHome: number;
  seasonScoredAVGAway: number;
  fullTimeTable: FullTimeScoredStats;
  halfTable: HalfTimeScoredStats;
};

export type GoalsScoredProps = {
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  data: GoalsScoredData;
};

const GoalsScored: FC<GoalsScoredProps> = ({ homeTeam, awayTeam, data }) => {
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
      title: i18n.footy_stats.scored,
      className: 'w-1/3 !justify-start !text-left',
    },
    { title: homeTeam?.shortName || homeTeam?.name || '', className: 'w-1/3' },
    { title: awayTeam?.shortName || awayTeam?.name || '', className: 'w-1/3' },
  ];

  const fullTimeData = useMemo(() => {
    if (filter === '1st-2ndHalf') {
      return getHalfGoalsScoredData(data.halfTable, i18n);
    }
    return getFullTimeGoalsScoredData(data.fullTimeTable, i18n);
  }, [data, i18n, filter]);

  return (
    <div className='flex flex-col'>
      <h4 className='text-center text-xs font-bold uppercase dark:text-white'>
        {i18n.statsLabel.goalsScored}
      </h4>
      <GoalsScoredBox homeTeam={homeTeam} awayTeam={awayTeam} data={data} />
      <div className='gap mt-4 flex flex-col gap-4'>
        <Filter filter={filter} setFilter={setFilter} items={filterItems} />
        <GoalsScoredTable headerTitles={headerTitles} stats={fullTimeData} />
      </div>
    </div>
  );
};

export default GoalsScored;

export const formatGoalsScoredData = (
  data: any,
  isHomeCup: boolean,
  isAwayCup: boolean
) => ({
  seasonScoredAVGHome: isHomeCup
    ? data?.home_team_info?.stats?.stats?.seasonScoredAVG_overall
    : data?.home_team_info?.stats?.stats?.seasonScoredAVG_home || 0,
  seasonScoredAVGAway: isAwayCup
    ? data?.away_team_info?.stats?.stats?.seasonScoredAVG_overall
    : data?.away_team_info?.stats?.stats?.seasonScoredAVG_away || 0,
  fullTimeTable: {
    //* Full - Time
    seasonScoredOver05PercentageHome: isHomeCup
      ? data?.home_team_info?.stats?.stats?.additional_info
          ?.seasonScoredOver05Percentage_overall
      : data?.home_team_info?.stats?.stats?.additional_info
          ?.seasonScoredOver05Percentage_home || 0,
    seasonScoredOver05PercentageAway: isAwayCup
      ? data?.away_team_info?.stats?.stats?.additional_info
          ?.seasonScoredOver05Percentage_overall
      : data?.away_team_info?.stats?.stats?.additional_info
          ?.seasonScoredOver05Percentage_away || 0,
    seasonScoredOver15PercentageHome: isHomeCup
      ? data?.home_team_info?.stats?.stats?.additional_info
          ?.seasonScoredOver15Percentage_overall
      : data?.home_team_info?.stats?.stats?.additional_info
          ?.seasonScoredOver15Percentage_home || 0,
    seasonScoredOver15PercentageAway: isAwayCup
      ? data?.away_team_info?.stats?.stats?.additional_info
          ?.seasonScoredOver15Percentage_overall
      : data?.away_team_info?.stats?.stats?.additional_info
          ?.seasonScoredOver15Percentage_away || 0,

    seasonScoredOver25PercentageHome: isHomeCup
      ? data?.home_team_info?.stats?.stats?.additional_info
          ?.seasonScoredOver25Percentage_overall
      : data?.home_team_info?.stats?.stats?.additional_info
          ?.seasonScoredOver25Percentage_home || 0,
    seasonScoredOver25PercentageAway: isAwayCup
      ? data?.away_team_info?.stats?.stats?.additional_info
          ?.seasonScoredOver25Percentage_overall
      : data?.away_team_info?.stats?.stats?.additional_info
          ?.seasonScoredOver25Percentage_away || 0,

    seasonScoredOver35PercentageHome: isHomeCup
      ? data?.home_team_info?.stats?.stats?.additional_info
          ?.seasonScoredOver35Percentage_overall
      : data?.home_team_info?.stats?.stats?.additional_info
          ?.seasonScoredOver35Percentage_home || 0,
    seasonScoredOver35PercentageAway: isAwayCup
      ? data?.away_team_info?.stats?.stats?.additional_info
          ?.seasonScoredOver35Percentage_overall
      : data?.away_team_info?.stats?.stats?.additional_info
          ?.seasonScoredOver35Percentage_away || 0,

    seasonFTSPercentageHome: isHomeCup
      ? data?.home_team_info?.stats?.stats?.seasonFTSPercentage_overall
      : data?.home_team_info?.stats?.stats?.seasonFTSPercentage_home || 0,
    seasonFTSPercentageAway: isAwayCup
      ? data?.away_team_info?.stats?.stats?.seasonFTSPercentage_overall
      : data?.away_team_info?.stats?.stats?.seasonFTSPercentage_away || 0,
  },
  halfTable: {
    //* 1st / 2nd Half
    scoredBothHalvesPercentageHome:
      data?.home_team_info?.stats?.stats?.scoredBothHalvesPercentage_home || 0,
    scoredBothHalvesPercentageAway:
      data?.away_team_info?.stats?.stats?.scoredBothHalvesPercentage_away || 0,

    scoredAVGHTHome: data?.home_team_info?.stats?.stats?.scoredAVGHT_home || 0,
    scoredAVGHTAway: data?.away_team_info?.stats?.stats?.scoredAVGHT_away || 0,

    scored2hgAvgHome:
      data?.home_team_info?.stats?.stats?.scored_2hg_avg_home || 0,
    scored2hgAvgAway:
      data?.away_team_info?.stats?.stats?.scored_2hg_avg_away || 0,
  },
});
