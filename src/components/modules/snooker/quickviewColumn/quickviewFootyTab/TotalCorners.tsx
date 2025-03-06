import { FC, useMemo, useState } from 'react';
import useTrans from '@/hooks/useTrans';
import Filter from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Filter';
import {
  CompetitorDto,
  CornersHalfTimeStats,
  CornersPercentageStats,
} from '@/constant/interface';
import { TeamsAverageTable } from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Table';
import { getHalfTimeCornerData, getTotalCornerData } from '@/utils/footyUtils';

export type TotalCornersScoreData = {
  fullTime: CornersPercentageStats;
  halfTime: CornersHalfTimeStats;
};

type TotalCornersScoreProps = {
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  data: TotalCornersScoreData;
};

const TotalCornersScore: FC<TotalCornersScoreProps> = ({
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
      title: i18n.footy_stats.match_corners,
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

  const TotalCornersScoreData = useMemo(() => {
    if (filter === '1st-2ndHalf') {
      return getHalfTimeCornerData(data.halfTime, i18n);
    }
    return getTotalCornerData(data.fullTime, i18n);
  }, [data, i18n, filter]);

  return (
    <div className='flex flex-col gap-3'>
      <h4 className='text-center text-xs font-bold uppercase dark:text-white'>
        {i18n.footy_stats.total_corners}
      </h4>
      <Filter filter={filter} setFilter={setFilter} items={filterItems} />
      <TeamsAverageTable
        headerTitles={headerTitles}
        stats={TotalCornersScoreData}
      />
    </div>
  );
};

export default TotalCornersScore;

export const formatTotalCornerData = (
  data: any,
  isHomeCup: boolean,
  isAwayCup: boolean
): TotalCornersScoreData => ({
  fullTime: {
    //* Home
    over65CornersPercentage_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.over65CornersPercentage_overall
        : data?.home_team_info?.stats?.stats?.over65CornersPercentage_home) ||
      0,
    over75CornersPercentage_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.over75CornersPercentage_overall
        : data?.home_team_info?.stats?.stats?.over75CornersPercentage_home) ||
      0,
    over85CornersPercentage_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.over85CornersPercentage_overall
        : data?.home_team_info?.stats?.stats?.over85CornersPercentage_home) ||
      0,
    over95CornersPercentage_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.over95CornersPercentage_overall
        : data?.home_team_info?.stats?.stats?.over95CornersPercentage_home) ||
      0,
    over105CornersPercentage_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.over105CornersPercentage_overall
        : data?.home_team_info?.stats?.stats?.over105CornersPercentage_home) ||
      0,
    over115CornersPercentage_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.over115CornersPercentage_overall
        : data?.home_team_info?.stats?.stats?.over115CornersPercentage_home) ||
      0,
    over125CornersPercentage_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.over125CornersPercentage_overall
        : data?.home_team_info?.stats?.stats?.over125CornersPercentage_home) ||
      0,
    over135CornersPercentage_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.over135CornersPercentage_overall
        : data?.home_team_info?.stats?.stats?.over135CornersPercentage_home) ||
      0,
    over145CornersPercentage_home:
      (isHomeCup
        ? data?.home_team_info?.stats?.stats?.over145CornersPercentage_overall
        : data?.home_team_info?.stats?.stats?.over145CornersPercentage_home) ||
      0,

    //* Away
    over65CornersPercentage_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.over65CornersPercentage_overall
        : data?.away_team_info?.stats?.stats?.over65CornersPercentage_away) ||
      0,
    over75CornersPercentage_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.over75CornersPercentage_overall
        : data?.away_team_info?.stats?.stats?.over75CornersPercentage_away) ||
      0,
    over85CornersPercentage_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.over85CornersPercentage_overall
        : data?.away_team_info?.stats?.stats?.over85CornersPercentage_away) ||
      0,
    over95CornersPercentage_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.over95CornersPercentage_overall
        : data?.away_team_info?.stats?.stats?.over95CornersPercentage_away) ||
      0,
    over105CornersPercentage_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.over105CornersPercentage_overall
        : data?.away_team_info?.stats?.stats?.over105CornersPercentage_away) ||
      0,
    over115CornersPercentage_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.over115CornersPercentage_overall
        : data?.away_team_info?.stats?.stats?.over115CornersPercentage_away) ||
      0,
    over125CornersPercentage_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.over125CornersPercentage_overall
        : data?.away_team_info?.stats?.stats?.over125CornersPercentage_away) ||
      0,
    over135CornersPercentage_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.over135CornersPercentage_overall
        : data?.away_team_info?.stats?.stats?.over135CornersPercentage_away) ||
      0,
    over145CornersPercentage_away:
      (isAwayCup
        ? data?.away_team_info?.stats?.stats?.over145CornersPercentage_overall
        : data?.away_team_info?.stats?.stats?.over145CornersPercentage_away) ||
      0,

    //* Average
    over65CornersPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over65CornersPercentage_overall
        : data?.home_team_info?.stats?.stats?.over65CornersPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.over65CornersPercentage_overall
          : data?.away_team_info?.stats?.stats?.over65CornersPercentage_away)) /
        2 || 0
    ),
    over75CornersPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over75CornersPercentage_overall
        : data?.home_team_info?.stats?.stats?.over75CornersPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.over75CornersPercentage_overall
          : data?.away_team_info?.stats?.stats?.over75CornersPercentage_away)) /
        2 || 0
    ),
    over85CornersPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over85CornersPercentage_overall
        : data?.home_team_info?.stats?.stats?.over85CornersPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.over85CornersPercentage_overall
          : data?.away_team_info?.stats?.stats?.over85CornersPercentage_away)) /
        2 || 0
    ),
    over95CornersPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over95CornersPercentage_overall
        : data?.home_team_info?.stats?.stats?.over95CornersPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.over95CornersPercentage_overall
          : data?.away_team_info?.stats?.stats?.over95CornersPercentage_away)) /
        2 || 0
    ),
    over105CornersPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over105CornersPercentage_overall
        : data?.home_team_info?.stats?.stats?.over105CornersPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.over105CornersPercentage_overall
          : data?.away_team_info?.stats?.stats
              ?.over105CornersPercentage_away)) /
        2 || 0
    ),
    over115CornersPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over115CornersPercentage_overall
        : data?.home_team_info?.stats?.stats?.over115CornersPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.over115CornersPercentage_overall
          : data?.away_team_info?.stats?.stats
              ?.over115CornersPercentage_away)) /
        2 || 0
    ),
    over125CornersPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over125CornersPercentage_overall
        : data?.home_team_info?.stats?.stats?.over125CornersPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.over125CornersPercentage_overall
          : data?.away_team_info?.stats?.stats
              ?.over125CornersPercentage_away)) /
        2 || 0
    ),
    over135CornersPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over135CornersPercentage_overall
        : data?.home_team_info?.stats?.stats?.over135CornersPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.over135CornersPercentage_overall
          : data?.away_team_info?.stats?.stats
              ?.over135CornersPercentage_away)) /
        2 || 0
    ),
    over145CornersPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over145CornersPercentage_overall
        : data?.home_team_info?.stats?.stats?.over145CornersPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.over145CornersPercentage_overall
          : data?.away_team_info?.stats?.stats
              ?.over145CornersPercentage_away)) /
        2 || 0
    ),
  },
  halfTime: {
    //* Home
    corners_fh_avg_home:
      data?.home_team_info?.stats?.stats?.corners_fh_avg_home || 0,
    corners_fh_over4_percentage_home:
      data?.home_team_info?.stats?.stats?.corners_fh_over4_percentage_home || 0,
    corners_fh_over5_percentage_home:
      data?.home_team_info?.stats?.stats?.corners_fh_over5_percentage_home || 0,
    corners_fh_over6_percentage_home:
      data?.home_team_info?.stats?.stats?.corners_fh_over6_percentage_home || 0,
    corners_2h_avg_home:
      data?.home_team_info?.stats?.stats?.corners_2h_avg_home || 0,
    corners_2h_over4_home:
      data?.home_team_info?.stats?.stats?.corners_2h_over4_percentage_home || 0,
    corners_2h_over5_percentage_home:
      data?.home_team_info?.stats?.stats?.corners_2h_over5_percentage_home || 0,
    corners_2h_over6_percentage_home:
      data?.home_team_info?.stats?.stats?.corners_2h_over6_percentage_home || 0,

    //* Away
    corners_fh_avg_away:
      data?.away_team_info?.stats?.stats?.corners_fh_avg_away || 0,
    corners_fh_over4_percentage_away:
      data?.away_team_info?.stats?.stats?.corners_fh_over4_percentage_away || 0,
    corners_fh_over5_percentage_away:
      data?.away_team_info?.stats?.stats?.corners_fh_over5_percentage_away || 0,
    corners_fh_over6_percentage_away:
      data?.away_team_info?.stats?.stats?.corners_fh_over6_percentage_away || 0,
    corners_2h_avg_away:
      data?.away_team_info?.stats?.stats?.corners_2h_avg_away || 0,
    corners_2h_over4_away:
      data?.away_team_info?.stats?.stats?.corners_2h_over4_percentage_away || 0,
    corners_2h_over5_percentage_away:
      data?.away_team_info?.stats?.stats?.corners_2h_over5_percentage_away || 0,
    corners_2h_over6_percentage_away:
      data?.away_team_info?.stats?.stats?.corners_2h_over6_percentage_away || 0,

    //* Average
    corners_fh_avg: Math.round(
      (data?.home_team_info?.stats?.stats?.corners_fh_avg_home +
        data?.away_team_info?.stats?.stats?.corners_fh_avg_away) /
        2 || 0
    ),
    corners_fh_over4_percentage: Math.round(
      (data?.home_team_info?.stats?.stats?.corners_fh_over4_percentage_home +
        data?.away_team_info?.stats?.stats?.corners_fh_over4_percentage_away) /
        2 || 0
    ),
    corners_fh_over5_percentage: Math.round(
      (data?.home_team_info?.stats?.stats?.corners_fh_over5_percentage_home +
        data?.away_team_info?.stats?.stats?.corners_fh_over5_percentage_away) /
        2 || 0
    ),
    corners_fh_over6_percentage: Math.round(
      (data?.home_team_info?.stats?.stats?.corners_fh_over6_percentage_home +
        data?.away_team_info?.stats?.stats?.corners_fh_over6_percentage_away) /
        2 || 0
    ),
    corners_2h_avg: Math.round(
      (data?.home_team_info?.stats?.stats?.corners_2h_avg_home +
        data?.away_team_info?.stats?.stats?.corners_2h_avg_away) /
        2 || 0
    ),
    corners_2h_over4_percentage: Math.round(
      (data?.home_team_info?.stats?.stats?.corners_2h_over4_percentage_home +
        data?.away_team_info?.stats?.stats?.corners_2h_over4_percentage_away) /
        2 || 0
    ),
    corners_2h_over5_percentage: Math.round(
      (data?.home_team_info?.stats?.stats?.corners_2h_over5_percentage_home +
        data?.away_team_info?.stats?.stats?.corners_2h_over5_percentage_away) /
        2 || 0
    ),
    corners_2h_over6_percentage: Math.round(
      (data?.home_team_info?.stats?.stats?.corners_2h_over6_percentage_home +
        data?.away_team_info?.stats?.stats?.corners_2h_over6_percentage_away) /
        2 || 0
    ),
  },
});
