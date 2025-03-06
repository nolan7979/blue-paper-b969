import { FC, useMemo, useState } from 'react';
import useTrans from '@/hooks/useTrans';
import Filter from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Filter';
import {
  CompetitorDto,
  CornersAgainstStats,
  CornersEarnedStats,
} from '@/constant/interface';
import { TeamsAverageTable } from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Table';
import { getCornersAgainstData, getCornersEarnedData } from '@/utils/footyUtils';

export type TeamCornersData = {
  cornersEarned: CornersEarnedStats;
  cornersAgainst: CornersAgainstStats;
};

type TeamCornersProps = {
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  data: TeamCornersData;
};

const TeamCorners: FC<TeamCornersProps> = ({ homeTeam, awayTeam, data }) => {
  const i18n = useTrans();
  // const [filter, setFilter] = useState<string>('full-time');

  // const filterItems = [
  //   {
  //     label: i18n.footy_stats.full_time,
  //     value: 'full-time',
  //   },
  //   { label: i18n.footy_stats.first_second_half, value: '1st-2ndHalf' },
  // ];

  const headerTitles = (firstTitle: string) => [
    {
      title: firstTitle,
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

  const { cornersEarned, cornersAgainst } = useMemo(() => {
    // if (filter === '1st-2ndHalf') {
    //   return [];
    // }
    return {
      cornersEarned: getCornersEarnedData(data.cornersEarned, i18n),
      cornersAgainst: getCornersAgainstData(data.cornersAgainst, i18n),
    }; 
  }, [data, i18n]);

  return (
    <div className='flex flex-col gap-3'>
      <h4 className='text-center text-xs font-bold uppercase dark:text-white'>
        {i18n.footy_stats.team_corners}
      </h4>
      {/* <Filter filter={filter} setFilter={setFilter} items={filterItems} /> */}
      <TeamsAverageTable
        headerTitles={headerTitles(i18n.footy_stats.corners_earned)}
        stats={cornersEarned}
      />
      <TeamsAverageTable
        headerTitles={headerTitles(i18n.statsLabel.cornersAgainst)}
        stats={cornersAgainst}
      />
    </div>
  );
};

export default TeamCorners;

export const formatTeamCornersData = (
  data: any,
  isHomeCup: boolean,
  isAwayCup: boolean
): TeamCornersData => ({
  cornersEarned: {
    //* Home
    cornersAVG_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.cornersAVG_overall
      : data?.home_team_info?.stats?.stats?.cornersAVG_home || 0,
    over25CornersForPercentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.over25CornersForPercentage_overall
      : data?.home_team_info?.stats?.stats?.over25CornersForPercentage_home ||
        0,
    over35CornersForPercentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.over35CornersForPercentage_overall
      : data?.home_team_info?.stats?.stats?.over35CornersForPercentage_home ||
        0,
    over45CornersForPercentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.over45CornersForPercentage_overall
      : data?.home_team_info?.stats?.stats?.over45CornersForPercentage_home ||
        0,
    over55CornersForPercentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.over55CornersForPercentage_overall
      : data?.home_team_info?.stats?.stats?.over55CornersForPercentage_home ||
        0,

    //* Away
    cornersAVG_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.cornersAVG_overall
      : data?.away_team_info?.stats?.stats?.cornersAVG_away || 0,
    over25CornersForPercentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.over25CornersForPercentage_overall
      : data?.away_team_info?.stats?.stats?.over25CornersForPercentage_away ||
        0,
    over35CornersForPercentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.over35CornersForPercentage_overall
      : data?.away_team_info?.stats?.stats?.over35CornersForPercentage_away ||
        0,
    over45CornersForPercentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.over45CornersForPercentage_overall
      : data?.away_team_info?.stats?.stats?.over45CornersForPercentage_away ||
        0,
    over55CornersForPercentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.over55CornersForPercentage_overall
      : data?.away_team_info?.stats?.stats?.over55CornersForPercentage_away ||
        0,

    //* Average
    cornersAVG_overall: parseFloat(
      (
        (((isHomeCup
          ? data?.home_team_info?.stats?.stats?.cornersAVG_overall
          : data?.home_team_info?.stats?.stats?.cornersAVG_home) +
          (isAwayCup
            ? data?.away_team_info?.stats?.stats?.cornersAVG_overall
            : data?.away_team_info?.stats?.stats?.cornersAVG_away)) /
          2 || 0) + 0.00001
      ).toFixed(2)
    ),
    over25CornersForPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over25CornersForPercentage_overall
        : data?.home_team_info?.stats?.stats?.over25CornersForPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats
              ?.over25CornersForPercentage_overall
          : data?.away_team_info?.stats?.stats
              ?.over25CornersForPercentage_away)) /
        2 || 0
    ),
    over35CornersForPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over35CornersForPercentage_overall
        : data?.home_team_info?.stats?.stats?.over35CornersForPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats
              ?.over35CornersForPercentage_overall
          : data?.away_team_info?.stats?.stats
              ?.over35CornersForPercentage_away)) /
        2 || 0
    ),
    over45CornersForPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over45CornersForPercentage_overall
        : data?.home_team_info?.stats?.stats?.over45CornersForPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats
              ?.over45CornersForPercentage_overall
          : data?.away_team_info?.stats?.stats
              ?.over45CornersForPercentage_away)) /
        2 || 0
    ),
    over55CornersForPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over55CornersForPercentage_overall
        : data?.home_team_info?.stats?.stats?.over55CornersForPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats
              ?.over55CornersForPercentage_overall
          : data?.away_team_info?.stats?.stats
              ?.over55CornersForPercentage_away)) /
        2 || 0
    ),
  },
  cornersAgainst: {
    //* Home
    cornersAgainstAVG_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.cornersAgainstAVG_overall
      : data?.home_team_info?.stats?.stats?.cornersAgainstAVG_home || 0,
    over25CornersAgainstPercentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats
          ?.over25CornersAgainstPercentage_overall
      : data?.home_team_info?.stats?.stats
          ?.over25CornersAgainstPercentage_home || 0,
    over35CornersAgainstPercentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats
          ?.over35CornersAgainstPercentage_overall
      : data?.home_team_info?.stats?.stats
          ?.over35CornersAgainstPercentage_home || 0,
    over45CornersAgainstPercentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats
          ?.over45CornersAgainstPercentage_overall
      : data?.home_team_info?.stats?.stats
          ?.over45CornersAgainstPercentage_home || 0,
    over55CornersAgainstPercentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats
          ?.over55CornersAgainstPercentage_overall
      : data?.home_team_info?.stats?.stats
          ?.over55CornersAgainstPercentage_home || 0,

    //* Away
    cornersAgainstAVG_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.cornersAgainstAVG_overall
      : data?.away_team_info?.stats?.stats?.cornersAgainstAVG_away || 0,
    over25CornersAgainstPercentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats
          ?.over25CornersAgainstPercentage_overall
      : data?.away_team_info?.stats?.stats
          ?.over25CornersAgainstPercentage_away || 0,
    over35CornersAgainstPercentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats
          ?.over35CornersAgainstPercentage_overall
      : data?.away_team_info?.stats?.stats
          ?.over35CornersAgainstPercentage_away || 0,
    over45CornersAgainstPercentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats
          ?.over45CornersAgainstPercentage_overall
      : data?.away_team_info?.stats?.stats
          ?.over45CornersAgainstPercentage_away || 0,
    over55CornersAgainstPercentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats
          ?.over55CornersAgainstPercentage_overall
      : data?.away_team_info?.stats?.stats
          ?.over55CornersAgainstPercentage_away || 0,

    //* Average
    cornersAgainstAVG_overall: parseFloat(
      (
        (((isHomeCup
          ? data?.home_team_info?.stats?.stats?.cornersAgainstAVG_overall
          : data?.home_team_info?.stats?.stats?.cornersAgainstAVG_home) +
          (isAwayCup
            ? data?.away_team_info?.stats?.stats?.cornersAgainstAVG_overall
            : data?.away_team_info?.stats?.stats?.cornersAgainstAVG_away)) /
          2 || 0) + 0.00001
      ).toFixed(2)
    ),
    over25CornersAgainstPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats
            ?.over25CornersAgainstPercentage_overall
        : data?.home_team_info?.stats?.stats
            ?.over25CornersAgainstPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats
              ?.over25CornersAgainstPercentage_overall
          : data?.away_team_info?.stats?.stats
              ?.over25CornersAgainstPercentage_away)) /
        2 || 0
    ),
    over35CornersAgainstPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats
            ?.over35CornersAgainstPercentage_overall
        : data?.home_team_info?.stats?.stats
            ?.over35CornersAgainstPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats
              ?.over35CornersAgainstPercentage_overall
          : data?.away_team_info?.stats?.stats
              ?.over35CornersAgainstPercentage_away)) /
        2 || 0
    ),
    over45CornersAgainstPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats
            ?.over45CornersAgainstPercentage_overall
        : data?.home_team_info?.stats?.stats
            ?.over45CornersAgainstPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats
              ?.over45CornersAgainstPercentage_overall
          : data?.away_team_info?.stats?.stats
              ?.over45CornersAgainstPercentage_away)) /
        2 || 0
    ),
    over55CornersAgainstPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats
            ?.over55CornersAgainstPercentage_overall
        : data?.home_team_info?.stats?.stats
            ?.over55CornersAgainstPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats
              ?.over55CornersAgainstPercentage_overall
          : data?.away_team_info?.stats?.stats
              ?.over55CornersAgainstPercentage_away)) /
        2 || 0
    ),
  },
});
