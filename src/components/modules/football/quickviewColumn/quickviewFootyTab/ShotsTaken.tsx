import { FC, useMemo, useState } from 'react';
import useTrans from '@/hooks/useTrans';
import Filter from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Filter';
import { CompetitorDto, ShotsTakenStats } from '@/constant/interface';
import { TeamsAverageTable } from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Table';
import { getShotsTakenData } from '@/utils/footyUtils';

type ShotsTakenProps = {
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  data: ShotsTakenStats;
};

const ShotsTaken: FC<ShotsTakenProps> = ({ homeTeam, awayTeam, data }) => {
  const i18n = useTrans();
  // const [filter, setFilter] = useState<string>('full-time');

  // const filterItems = [
  //   {
  //     label: i18n.footy_stats.full_time,
  //     value: 'full-time',
  //   },
  //   { label: i18n.footy_stats.first_second_half, value: '1st-2ndHalf' },
  // ];

  const headerTitles = [
    {
      title: i18n.footy_stats.team_shots,
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

  const ShotsTakenData = useMemo(() => {
    // if (filter === '1st-2ndHalf') {
    //   return [];
    // }
    return getShotsTakenData(data, i18n);
  }, [data, i18n]);

  return (
    <div className='flex flex-col gap-3'>
      <h4 className='text-center text-xs font-bold uppercase dark:text-white'>
        {i18n.footy_stats.shots_taken}
      </h4>
      {/* <Filter filter={filter} setFilter={setFilter} items={filterItems} /> */}
      <TeamsAverageTable headerTitles={headerTitles} stats={ShotsTakenData} />
    </div>
  );
};

export default ShotsTaken;

export const formatShotsTakenData = (
  data: any,
  isHomeCup: boolean,
  isAwayCup: boolean
): ShotsTakenStats => {
  return {
    shotsAVG_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.shotsAVG_overall
        : data?.home_team_info?.stats?.stats?.shotsAVG_home) || 0,
    shotsAVG_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.shotsAVG_overall
        : data?.away_team_info?.stats?.stats?.shotsAVG_away) || 0,
    shotsAVG_overall: parseFloat(
      (
        (((isHomeCup
          ? data?.home_team_info?.stats?.stats?.shotsAVG_overall
          : data?.home_team_info?.stats?.stats?.shotsAVG_home) || 0) +
          ((isAwayCup
            ? data?.away_team_info?.stats?.stats?.shotsAVG_overall
            : data?.away_team_info?.stats?.stats?.shotsAVG_away) || 0)) /
          2 +
          0.00001 || 0
      ).toFixed(2)
    ),
    shot_conversion_rate_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.shot_conversion_rate_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.shot_conversion_rate_home) || 0,
    shot_conversion_rate_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.additional_info
            ?.shot_conversion_rate_overall
        : data?.away_team_info?.stats?.stats?.additional_info
            ?.shot_conversion_rate_away) || 0,
    shot_conversion_rate_overall: Math.round(
      (((isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.shot_conversion_rate_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.shot_conversion_rate_home) || 0) +
        ((isAwayCup
          ? data?.away_team_info?.stats?.stats?.additional_info
              ?.shot_conversion_rate_overall
          : data?.away_team_info?.stats?.stats?.additional_info
              ?.shot_conversion_rate_away) || 0)) /
        2 || 0
    ),
    shotsOnTargetAVG_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.shotsOnTargetAVG_overall
        : data?.home_team_info?.stats?.stats?.shotsOnTargetAVG_home) || 0,
    shotsOnTargetAVG_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.shotsOnTargetAVG_overall
        : data?.away_team_info?.stats?.stats?.shotsOnTargetAVG_away) || 0,
    shotsOnTargetAVG_overall: parseFloat(
      (
        (((isHomeCup
          ? data?.home_team_info?.stats?.stats?.shotsOnTargetAVG_overall
          : data?.home_team_info?.stats?.stats?.shotsOnTargetAVG_home) || 0) +
          ((isAwayCup
            ? data?.away_team_info?.stats?.stats?.shotsOnTargetAVG_overall
            : data?.away_team_info?.stats?.stats?.shotsOnTargetAVG_away) ||
            0)) /
          2 +
          0.00001 || 0
      ).toFixed(2)
    ),
    shotsOffTargetAVG_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.shotsOffTargetAVG_overall
        : data?.home_team_info?.stats?.stats?.shotsOffTargetAVG_home) || 0,
    shotsOffTargetAVG_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.shotsOffTargetAVG_overall
        : data?.away_team_info?.stats?.stats?.shotsOffTargetAVG_away) || 0,
    shotsOffTargetAVG_overall: parseFloat(
      (
        (((isHomeCup
          ? data?.home_team_info?.stats?.stats?.shotsOffTargetAVG_overall
          : data?.home_team_info?.stats?.stats?.shotsOffTargetAVG_home) || 0) +
          ((isAwayCup
            ? data?.away_team_info?.stats?.stats?.shotsOffTargetAVG_overall
            : data?.away_team_info?.stats?.stats?.shotsOffTargetAVG_away) ||
            0)) /
          2 +
          0.00001 || 0
      ).toFixed(2)
    ),
    shots_per_goals_scored_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.shots_per_goals_scored_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.shots_per_goals_scored_home) || 0,
    shots_per_goals_scored_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.additional_info
            ?.shots_per_goals_scored_overall
        : data?.away_team_info?.stats?.stats?.additional_info
            ?.shots_per_goals_scored_away) || 0,
    shots_per_goals_scored_overall: parseFloat(
      (
        (((isHomeCup
          ? data?.home_team_info?.stats?.stats?.additional_info
              ?.shots_per_goals_scored_overall
          : data?.home_team_info?.stats?.stats?.additional_info
              ?.shots_per_goals_scored_home) || 0) +
          ((isAwayCup
            ? data?.away_team_info?.stats?.stats?.additional_info
                ?.shots_per_goals_scored_overall
            : data?.away_team_info?.stats?.stats?.additional_info
                ?.shots_per_goals_scored_away) || 0)) /
          2 +
          0.00001 || 0
      ).toFixed(2)
    ),
    team_shots_over105_percentage_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over105_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over105_percentage_home) || 0,
    team_shots_over105_percentage_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.additional_info
            ?.team_shots_over105_percentage_overall
        : data?.away_team_info?.stats?.stats?.additional_info
            ?.team_shots_over105_percentage_away) || 0,
    team_shots_over105_percentage_overall: Math.round(
      (((isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over105_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over105_percentage_home) || 0) +
        ((isAwayCup
          ? data?.away_team_info?.stats?.stats?.additional_info
              ?.team_shots_over105_percentage_overall
          : data?.away_team_info?.stats?.stats?.additional_info
              ?.team_shots_over105_percentage_away) || 0)) /
        2 || 0
    ),
    team_shots_over115_percentage_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over115_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over115_percentage_home) || 0,
    team_shots_over115_percentage_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.additional_info
            ?.team_shots_over115_percentage_overall
        : data?.away_team_info?.stats?.stats?.additional_info
            ?.team_shots_over115_percentage_away) || 0,
    team_shots_over115_percentage_overall: Math.round(
      (((isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over115_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over115_percentage_home) || 0) +
        ((isAwayCup
          ? data?.away_team_info?.stats?.stats?.additional_info
              ?.team_shots_over115_percentage_overall
          : data?.away_team_info?.stats?.stats?.additional_info
              ?.team_shots_over115_percentage_away) || 0)) /
        2 || 0
    ),
    team_shots_over125_percentage_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over125_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over125_percentage_home) || 0,
    team_shots_over125_percentage_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.additional_info
            ?.team_shots_over125_percentage_overall
        : data?.away_team_info?.stats?.stats?.additional_info
            ?.team_shots_over125_percentage_away) || 0,
    team_shots_over125_percentage_overall: Math.round(
      (((isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over125_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over125_percentage_home) || 0) +
        ((isAwayCup
          ? data?.away_team_info?.stats?.stats?.additional_info
              ?.team_shots_over125_percentage_overall
          : data?.away_team_info?.stats?.stats?.additional_info
              ?.team_shots_over125_percentage_away) || 0)) /
        2 || 0
    ),
    team_shots_over135_percentage_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over135_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over135_percentage_home) || 0,
    team_shots_over135_percentage_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.additional_info
            ?.team_shots_over135_percentage_overall
        : data?.away_team_info?.stats?.stats?.additional_info
            ?.team_shots_over135_percentage_away) || 0,
    team_shots_over135_percentage_overall: Math.round(
      (((isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over135_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over135_percentage_home) || 0) +
        ((isAwayCup
          ? data?.away_team_info?.stats?.stats?.additional_info
              ?.team_shots_over135_percentage_overall
          : data?.away_team_info?.stats?.stats?.additional_info
              ?.team_shots_over135_percentage_away) || 0)) /
        2 || 0
    ),
    team_shots_over145_percentage_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over145_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over145_percentage_home) || 0,
    team_shots_over145_percentage_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.additional_info
            ?.team_shots_over145_percentage_overall
        : data?.away_team_info?.stats?.stats?.additional_info
            ?.team_shots_over145_percentage_away) || 0,
    team_shots_over145_percentage_overall: Math.round(
      (((isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over145_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over145_percentage_home) || 0) +
        ((isAwayCup
          ? data?.away_team_info?.stats?.stats?.additional_info
              ?.team_shots_over145_percentage_overall
          : data?.away_team_info?.stats?.stats?.additional_info
              ?.team_shots_over145_percentage_away) || 0)) /
        2 || 0
    ),
    team_shots_over155_percentage_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over155_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over155_percentage_home) || 0,
    team_shots_over155_percentage_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.additional_info
            ?.team_shots_over155_percentage_overall
        : data?.away_team_info?.stats?.stats?.additional_info
            ?.team_shots_over155_percentage_away) || 0,
    team_shots_over155_percentage_overall: Math.round(
      (((isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over155_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_over155_percentage_home) || 0) +
        ((isAwayCup
          ? data?.away_team_info?.stats?.stats?.additional_info
              ?.team_shots_over155_percentage_overall
          : data?.away_team_info?.stats?.stats?.additional_info
              ?.team_shots_over155_percentage_away) || 0)) /
        2 || 0
    ),
    team_shots_on_target_over35_percentage_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over35_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over35_percentage_home) || 0,
    team_shots_on_target_over35_percentage_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over35_percentage_overall
        : data?.away_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over35_percentage_away) || 0,
    team_shots_on_target_over35_percentage_overall: Math.round(
      (((isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over35_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over35_percentage_home) || 0) +
        ((isAwayCup
          ? data?.away_team_info?.stats?.stats?.additional_info
              ?.team_shots_on_target_over35_percentage_overall
          : data?.away_team_info?.stats?.stats?.additional_info
              ?.team_shots_on_target_over35_percentage_away) || 0)) /
        2 || 0
    ),
    team_shots_on_target_over45_percentage_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over45_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over45_percentage_home) || 0,
    team_shots_on_target_over45_percentage_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over45_percentage_overall
        : data?.away_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over45_percentage_away) || 0,
    team_shots_on_target_over45_percentage_overall: Math.round(
      (((isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over45_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over45_percentage_home) || 0) +
        ((isAwayCup
          ? data?.away_team_info?.stats?.stats?.additional_info
              ?.team_shots_on_target_over45_percentage_overall
          : data?.away_team_info?.stats?.stats?.additional_info
              ?.team_shots_on_target_over45_percentage_away) || 0)) /
        2 || 0
    ),
    team_shots_on_target_over55_percentage_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over55_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over55_percentage_home) || 0,
    team_shots_on_target_over55_percentage_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over55_percentage_overall
        : data?.away_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over55_percentage_away) || 0,
    team_shots_on_target_over55_percentage_overall: Math.round(
      (((isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over55_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over55_percentage_home) || 0) +
        ((isAwayCup
          ? data?.away_team_info?.stats?.stats?.additional_info
              ?.team_shots_on_target_over55_percentage_overall
          : data?.away_team_info?.stats?.stats?.additional_info
              ?.team_shots_on_target_over55_percentage_away) || 0)) /
        2 || 0
    ),
    team_shots_on_target_over65_percentage_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over65_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over65_percentage_home) || 0,
    team_shots_on_target_over65_percentage_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over65_percentage_overall
        : data?.away_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over65_percentage_away) || 0,
    team_shots_on_target_over65_percentage_overall: Math.round(
      (((isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over65_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.team_shots_on_target_over65_percentage_home) || 0) +
        ((isAwayCup
          ? data?.away_team_info?.stats?.stats?.additional_info
              ?.team_shots_on_target_over65_percentage_overall
          : data?.away_team_info?.stats?.stats?.additional_info
              ?.team_shots_on_target_over65_percentage_away) || 0)) /
        2 || 0
    ),
  };
};
