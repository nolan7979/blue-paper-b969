import { FC, useMemo, useState } from 'react';
import useTrans from '@/hooks/useTrans';
import Filter from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Filter';
import {
  CompetitorDto,
  GoalsConcededBy10Minutes,
  GoalsConcededBy15Minutes,
  GoalsScoredBy10Minutes,
  GoalsScoredBy15Minutes,
  TotalGoalsBy10Minutes,
  TotalGoalsBy15Minutes,
} from '@/constant/interface';
import { GoalsScoredTable } from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Table';
import {
  getGoalConcededBy10Minutes,
  getGoalConcededBy15Minutes,
  getGoalScoredBy10Minutes,
  getGoalScoredBy15Minutes,
  getTotalGoalsBy10Minutes,
  getTotalGoalsBy15Minutes,
} from '@/utils/footyUtils';

export type GoalsByMinutesData = {
  totalGoalsBy10: TotalGoalsBy10Minutes;
  totalGoalsBy15: TotalGoalsBy15Minutes;
  scoredBy10: GoalsScoredBy10Minutes;
  scoredBy15: GoalsScoredBy15Minutes;
  concededBy10: GoalsConcededBy10Minutes;
  concededBy15: GoalsConcededBy15Minutes;
};

type GoalsByMinutesProps = {
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  data: GoalsByMinutesData;
};

const GoalsByMinutes: FC<GoalsByMinutesProps> = ({
  homeTeam,
  awayTeam,
  data,
}) => {
  const i18n = useTrans();
  const [filter, setFilter] = useState<string>('total_goals');

  const filterItems = [
    {
      label: i18n.footy_stats.total_goals,
      value: 'total_goals',
    },
    { label: i18n.footy_stats.scored, value: 'scored' },
    { label: i18n.footy_stats.conceded, value: 'conceded' },
  ];

  const headerTitles = (firstTitle: string) => [
    {
      title: firstTitle,
      className: 'w-1/3 !justify-start !text-left',
    },
    {
      title: homeTeam?.shortName || homeTeam?.name || '',
      className: 'w-1/3',
    },
    {
      title: awayTeam?.shortName || awayTeam?.name || '',
      className: 'w-1/3',
    },
  ];

  const { by10Min, by15Min } = useMemo(() => {
    if (filter === 'scored') {
      return {
        by10Min: getGoalScoredBy10Minutes(data.scoredBy10, i18n),
        by15Min: getGoalScoredBy15Minutes(data.scoredBy15, i18n),
      };
    }
    if (filter === 'conceded') {
      return {
        by10Min: getGoalConcededBy10Minutes(data.concededBy10, i18n),
        by15Min: getGoalConcededBy15Minutes(data.concededBy15, i18n),
      };
    }
    return {
      by10Min: getTotalGoalsBy10Minutes(data.totalGoalsBy10, i18n),
      by15Min: getTotalGoalsBy15Minutes(data.totalGoalsBy15, i18n),
    };
  }, [data, i18n, filter]);

  return (
    <div className='flex flex-col gap-3'>
      <h4 className='text-center text-xs font-bold uppercase dark:text-white'>
        {i18n.footy_stats.goal_by_minutes}
      </h4>
      <Filter filter={filter} setFilter={setFilter} items={filterItems} />
      <GoalsScoredTable
        headerTitles={headerTitles(i18n.footy_stats.by_10_min)}
        stats={by10Min}
      />
      <GoalsScoredTable
        headerTitles={headerTitles(i18n.footy_stats.by_15_min)}
        stats={by15Min}
      />
    </div>
  );
};

export default GoalsByMinutes;

export const formatGoalByMinutesData = (data: any): GoalsByMinutesData => ({
  totalGoalsBy10: {
    //* Home
    goals_all_min_0_to_10_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_all_min_0_to_10 /
        data?.home_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_11_to_20_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_all_min_11_to_20 /
        data?.home_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_21_to_30_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_all_min_21_to_30 /
        data?.home_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_31_to_40_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_all_min_31_to_40 /
        data?.home_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_41_to_50_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_all_min_41_to_50 /
        data?.home_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_51_to_60_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_all_min_51_to_60 /
        data?.home_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_61_to_70_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_all_min_61_to_70 /
        data?.home_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_71_to_80_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_all_min_71_to_80 /
        data?.home_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_81_to_90_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_all_min_81_to_90 /
        data?.home_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),

    //* Away
    goals_all_min_0_to_10_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_all_min_0_to_10 /
        data?.away_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_11_to_20_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_all_min_11_to_20 /
        data?.away_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_21_to_30_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_all_min_21_to_30 /
        data?.away_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_31_to_40_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_all_min_31_to_40 /
        data?.away_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_41_to_50_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_all_min_41_to_50 /
        data?.away_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_51_to_60_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_all_min_51_to_60 /
        data?.away_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_61_to_70_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_all_min_61_to_70 /
        data?.away_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_71_to_80_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_all_min_71_to_80 /
        data?.away_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_81_to_90_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_all_min_81_to_90 /
        data?.away_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
  },
  totalGoalsBy15: {
    //* Home
    goals_all_min_0_to_15_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_all_min_0_to_15 /
        data?.home_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_16_to_30_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_all_min_16_to_30 /
        data?.home_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_31_to_45_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_all_min_31_to_45 /
        data?.home_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_46_to_60_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_all_min_46_to_60 /
        data?.home_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_61_to_75_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_all_min_61_to_75 /
        data?.home_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_76_to_90_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_all_min_76_to_90 /
        data?.home_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),

    //* Away
    goals_all_min_0_to_15_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_all_min_0_to_15 /
        data?.away_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_16_to_30_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_all_min_16_to_30 /
        data?.away_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_31_to_45_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_all_min_31_to_45 /
        data?.away_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_46_to_60_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_all_min_46_to_60 /
        data?.away_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_61_to_75_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_all_min_61_to_75 /
        data?.away_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
    goals_all_min_76_to_90_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_all_min_76_to_90 /
        data?.away_team_info?.stats?.stats?.seasonGoalsTotal_overall) *
        100 || 0
    ),
  },
  scoredBy10: {
    //* Home
    goals_scored_min_0_to_10_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_scored_min_0_to_10 /
        data?.home_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_11_to_20_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_scored_min_11_to_20 /
        data?.home_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_21_to_30_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_scored_min_21_to_30 /
        data?.home_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_31_to_40_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_scored_min_31_to_40 /
        data?.home_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_41_to_50_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_scored_min_41_to_50 /
        data?.home_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_51_to_60_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_scored_min_51_to_60 /
        data?.home_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_61_to_70_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_scored_min_61_to_70 /
        data?.home_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_71_to_80_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_scored_min_71_to_80 /
        data?.home_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_81_to_90_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_scored_min_81_to_90 /
        data?.home_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),

    //* Away
    goals_scored_min_0_to_10_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_scored_min_0_to_10 /
        data?.away_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_11_to_20_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_scored_min_11_to_20 /
        data?.away_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_21_to_30_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_scored_min_21_to_30 /
        data?.away_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_31_to_40_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_scored_min_31_to_40 /
        data?.away_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_41_to_50_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_scored_min_41_to_50 /
        data?.away_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_51_to_60_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_scored_min_51_to_60 /
        data?.away_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_61_to_70_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_scored_min_61_to_70 /
        data?.away_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_71_to_80_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_scored_min_71_to_80 /
        data?.away_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_81_to_90_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_scored_min_81_to_90 /
        data?.away_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
  },
  scoredBy15: {
    //* Home
    goals_scored_min_0_to_15_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_scored_min_0_to_15 /
        data?.home_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_16_to_30_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_scored_min_16_to_30 /
        data?.home_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_31_to_45_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_scored_min_31_to_45 /
        data?.home_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_46_to_60_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_scored_min_46_to_60 /
        data?.home_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_61_to_75_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_scored_min_61_to_75 /
        data?.home_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_76_to_90_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_scored_min_76_to_90 /
        data?.home_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),

    //* Away
    goals_scored_min_0_to_15_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_scored_min_0_to_15 /
        data?.away_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_16_to_30_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_scored_min_16_to_30 /
        data?.away_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_31_to_45_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_scored_min_31_to_45 /
        data?.away_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_46_to_60_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_scored_min_46_to_60 /
        data?.away_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_61_to_75_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_scored_min_61_to_75 /
        data?.away_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
    goals_scored_min_76_to_90_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_scored_min_76_to_90 /
        data?.away_team_info?.stats?.stats?.seasonScoredNum_overall) *
        100 || 0
    ),
  },
  concededBy10: {
    //* Home
    goals_conceded_min_0_to_10_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_conceded_min_0_to_10 /
        data?.home_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_11_to_20_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_conceded_min_11_to_20 /
        data?.home_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_21_to_30_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_conceded_min_21_to_30 /
        data?.home_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_31_to_40_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_conceded_min_31_to_40 /
        data?.home_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_41_to_50_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_conceded_min_41_to_50 /
        data?.home_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_51_to_60_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_conceded_min_51_to_60 /
        data?.home_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_61_to_70_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_conceded_min_61_to_70 /
        data?.home_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_71_to_80_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_conceded_min_71_to_80 /
        data?.home_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_81_to_90_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_conceded_min_81_to_90 /
        data?.home_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),

    //* Away
    goals_conceded_min_0_to_10_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_conceded_min_0_to_10 /
        data?.away_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_11_to_20_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_conceded_min_11_to_20 /
        data?.away_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_21_to_30_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_conceded_min_21_to_30 /
        data?.away_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_31_to_40_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_conceded_min_31_to_40 /
        data?.away_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_41_to_50_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_conceded_min_41_to_50 /
        data?.away_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_51_to_60_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_conceded_min_51_to_60 /
        data?.away_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_61_to_70_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_conceded_min_61_to_70 /
        data?.away_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_71_to_80_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_conceded_min_71_to_80 /
        data?.away_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_81_to_90_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_conceded_min_81_to_90 /
        data?.away_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
  },
  concededBy15: {
    //* Home
    goals_conceded_min_0_to_15_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_conceded_min_0_to_15 /
        data?.home_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_16_to_30_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_conceded_min_16_to_30 /
        data?.home_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_31_to_45_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_conceded_min_31_to_45 /
        data?.home_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_46_to_60_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_conceded_min_46_to_60 /
        data?.home_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_61_to_75_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_conceded_min_61_to_75 /
        data?.home_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_76_to_90_home: Math.round(
      (data?.home_team_info?.stats?.stats?.goals_conceded_min_76_to_90 /
        data?.home_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),

    //* Away
    goals_conceded_min_0_to_15_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_conceded_min_0_to_15 /
        data?.away_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_16_to_30_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_conceded_min_16_to_30 /
        data?.away_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_31_to_45_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_conceded_min_31_to_45 /
        data?.away_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_46_to_60_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_conceded_min_46_to_60 /
        data?.away_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_61_to_75_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_conceded_min_61_to_75 /
        data?.away_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
    goals_conceded_min_76_to_90_away: Math.round(
      (data?.away_team_info?.stats?.stats?.goals_conceded_min_76_to_90 /
        data?.away_team_info?.stats?.stats?.seasonConcededNum_overall) *
        100 || 0
    ),
  },
});
