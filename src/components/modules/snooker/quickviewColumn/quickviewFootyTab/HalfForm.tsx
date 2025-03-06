import { FC, useMemo, useState } from 'react';

import { CompetitorDto, HalfFormStats } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { GoalsScoredTable } from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Table';
import HalfFormBox from '@/components/modules/football/quickviewColumn/quickviewFootyTab/HalfFormBox';
import { getHalfFormData } from '@/utils/footyUtils';

export type HalfFormData = {
  HTPPG_home: number;
  HTPPG_away: number;
  halfFormTable: HalfFormStats;
};

export type HalfFormProps = {
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  data: HalfFormData;
};

const HalfForm: FC<HalfFormProps> = ({ homeTeam, awayTeam, data }) => {
  const i18n = useTrans();

  const headerTitles = [
    {
      title: i18n.footy_stats.form_1h_2h,
      className: 'w-1/3 !justify-start !text-left',
    },
    { title: homeTeam?.shortName || homeTeam?.name || '', className: 'w-1/3' },
    { title: awayTeam?.shortName || awayTeam?.name || '', className: 'w-1/3' },
  ];

  const statsData = useMemo(() => {
    return getHalfFormData(data.halfFormTable, i18n);
  }, [data, i18n]);

  return (
    <div className='flex flex-col'>
      <h4 className='text-center text-xs font-bold uppercase dark:text-white'>
        {i18n.footy_stats.form_1st_2nd_half}
      </h4>
      <HalfFormBox homeTeam={homeTeam} awayTeam={awayTeam} data={data} />
      <div className='gap mt-4 flex flex-col gap-4'>
        <GoalsScoredTable headerTitles={headerTitles} stats={statsData} />
      </div>
    </div>
  );
};

export default HalfForm;

export const formatHalfFormData = (data: any): HalfFormData => ({
  HTPPG_home: data?.home_team_info?.stats?.stats?.HTPPG_home || 0,
  HTPPG_away: data?.away_team_info?.stats?.stats?.HTPPG_away || 0,
  halfFormTable: {
    //* Home
    leadingAtHTPercentage_home:
      data?.home_team_info?.stats?.stats?.leadingAtHTPercentage_home || 0,
    wins_2hg_percentage_home:
      data?.home_team_info?.stats?.stats?.wins_2hg_percentage_home || 0,
    drawingAtHTPercentage_home:
      data?.home_team_info?.stats?.stats?.drawingAtHTPercentage_home || 0,
    draws_2hg_percentage_home:
      data?.home_team_info?.stats?.stats?.draws_2hg_percentage_home || 0,
    trailingAtHTPercentage_home:
      data?.home_team_info?.stats?.stats?.trailingAtHTPercentage_home || 0,
    losses_2hg_percentage_home:
      data?.home_team_info?.stats?.stats?.losses_2hg_percentage_home || 0,

    //* Away
    leadingAtHTPercentage_away:
      data?.away_team_info?.stats?.stats?.leadingAtHTPercentage_away || 0,
    wins_2hg_percentage_away:
      data?.away_team_info?.stats?.stats?.wins_2hg_percentage_away || 0,
    drawingAtHTPercentage_away:
      data?.away_team_info?.stats?.stats?.drawingAtHTPercentage_away || 0,
    draws_2hg_percentage_away:
      data?.away_team_info?.stats?.stats?.draws_2hg_percentage_away || 0,
    trailingAtHTPercentage_away:
      data?.away_team_info?.stats?.stats?.trailingAtHTPercentage_away || 0,
    losses_2hg_percentage_away:
      data?.away_team_info?.stats?.stats?.losses_2hg_percentage_away || 0,
  },
});
