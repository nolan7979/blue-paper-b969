import { FC, useMemo, useState } from 'react';

import {
  CompetitorDto,
  FullTimeConcededStats,
  HalfTimeConcededStats,
} from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import Filter from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Filter';
import { GoalsScoredTable } from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Table';
import {
  getFullTimeGoalsConcededData,
  getHalfGoalsConcededData,
} from '@/utils/footyUtils';
import GoalsConcededBox from '@/components/modules/football/quickviewColumn/quickviewFootyTab/GoalsConcededBox';

export type GoalsConcededData = {
  seasonConcededAVGHome: number;
  seasonConcededAVGAway: number;
  fullTimeTable: FullTimeConcededStats;
  halfTable: HalfTimeConcededStats;
};

export type GoalsConcededProps = {
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  data: GoalsConcededData;
};

const GoalsConceded: FC<GoalsConcededProps> = ({
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
      title: i18n.footy_stats.conceded,
      className: 'w-1/3 !justify-start !text-left',
    },
    { title: homeTeam?.shortName || homeTeam?.name || '', className: 'w-1/3' },
    { title: awayTeam?.shortName || awayTeam?.name || '', className: 'w-1/3' },
  ];

  const statsData = useMemo(() => {
    if (filter === '1st-2ndHalf') {
      return getHalfGoalsConcededData(data.halfTable, i18n);
    }
    return getFullTimeGoalsConcededData(data.fullTimeTable, i18n);
  }, [data, i18n, filter]);

  return (
    <div className='flex flex-col'>
      <h4 className='text-center text-xs font-bold uppercase dark:text-white'>
        {i18n.statsLabel.goalsConceded}
      </h4>
      <GoalsConcededBox homeTeam={homeTeam} awayTeam={awayTeam} data={data} />
      <div className='gap mt-4 flex flex-col gap-4'>
        <Filter filter={filter} setFilter={setFilter} items={filterItems} />
        <GoalsScoredTable headerTitles={headerTitles} stats={statsData} />
      </div>
    </div>
  );
};

export default GoalsConceded;

export const formatGoalsConcededData = (
  data: any,
  isHomeCup: boolean,
  isAwayCup: boolean
): GoalsConcededData => ({
  seasonConcededAVGHome: isHomeCup
    ? data?.home_team_info?.stats?.stats?.seasonConcededAVG_overall
    : data?.home_team_info?.stats?.stats?.seasonConcededAVG_home || 0,
  seasonConcededAVGAway: isAwayCup
    ? data?.away_team_info?.stats?.stats?.seasonConcededAVG_overall
    : data?.away_team_info?.stats?.stats?.seasonConcededAVG_away || 0,
  fullTimeTable: {
    //* Full - Time
    seasonConcededOver05PercentageHome: isHomeCup
      ? data?.home_team_info?.stats?.stats?.additional_info
          ?.seasonConcededOver05Percentage_overall
      : data?.home_team_info?.stats?.stats?.additional_info
          ?.seasonConcededOver05Percentage_home || 0,
    seasonConcededOver05PercentageAway: isAwayCup
      ? data?.away_team_info?.stats?.stats?.additional_info
          ?.seasonConcededOver05Percentage_overall
      : data?.away_team_info?.stats?.stats?.additional_info
          ?.seasonConcededOver05Percentage_away || 0,

    seasonConcededOver15PercentageHome: isHomeCup
      ? data?.home_team_info?.stats?.stats?.additional_info
          ?.seasonConcededOver15Percentage_overall
      : data?.home_team_info?.stats?.stats?.additional_info
          ?.seasonConcededOver15Percentage_home || 0,
    seasonConcededOver15PercentageAway: isAwayCup
      ? data?.away_team_info?.stats?.stats?.additional_info
          ?.seasonConcededOver15Percentage_overall
      : data?.away_team_info?.stats?.stats?.additional_info
          ?.seasonConcededOver15Percentage_away || 0,

    seasonConcededOver25PercentageHome: isHomeCup
      ? data?.home_team_info?.stats?.stats?.additional_info
          ?.seasonConcededOver25Percentage_overall
      : data?.home_team_info?.stats?.stats?.additional_info
          ?.seasonConcededOver25Percentage_home || 0,
    seasonConcededOver25PercentageAway: isAwayCup
      ? data?.away_team_info?.stats?.stats?.additional_info
          ?.seasonConcededOver25Percentage_overall
      : data?.away_team_info?.stats?.stats?.additional_info
          ?.seasonConcededOver25Percentage_away || 0,

    seasonConcededOver35PercentageHome: isHomeCup
      ? data?.home_team_info?.stats?.stats?.additional_info
          ?.seasonConcededOver35Percentage_overall
      : data?.home_team_info?.stats?.stats?.additional_info
          ?.seasonConcededOver35Percentage_home || 0,
    seasonConcededOver35PercentageAway: isAwayCup
      ? data?.away_team_info?.stats?.stats?.additional_info
          ?.seasonConcededOver35Percentage_overall
      : data?.away_team_info?.stats?.stats?.additional_info
          ?.seasonConcededOver35Percentage_away || 0,

    seasonCSPercentageHome: isHomeCup
      ? data?.home_team_info?.stats?.stats?.seasonCSPercentage_overall
      : data?.home_team_info?.stats?.stats?.seasonCSPercentage_home || 0,
    seasonCSPercentageAway: isAwayCup
      ? data?.away_team_info?.stats?.stats?.seasonCSPercentage_overall
      : data?.away_team_info?.stats?.stats?.seasonCSPercentage_away || 0,
  },
  halfTable: {
    //* 1st / 2nd Half
    concededAVGHTHome:
      data?.home_team_info?.stats?.stats?.concededAVGHT_home || 0,
    concededAVGHTAway:
      data?.away_team_info?.stats?.stats?.concededAVGHT_away || 0,
    conceded2hgAvgHome:
      data?.home_team_info?.stats?.stats?.conceded_2hg_avg_home || 0,
    conceded2hgAvgAway:
      data?.away_team_info?.stats?.stats?.conceded_2hg_avg_away || 0,
    seasonCSPercentageHTHome:
      data?.home_team_info?.stats?.stats?.seasonCSPercentageHT_home || 0,
    seasonCSPercentageHTAway:
      data?.away_team_info?.stats?.stats?.seasonCSPercentageHT_away || 0,
    cs2hgPercentageHome:
      data?.home_team_info?.stats?.stats?.cs_2hg_percentage_home || 0,
    cs2hgPercentageAway:
      data?.away_team_info?.stats?.stats?.cs_2hg_percentage_away || 0,
  },
});
