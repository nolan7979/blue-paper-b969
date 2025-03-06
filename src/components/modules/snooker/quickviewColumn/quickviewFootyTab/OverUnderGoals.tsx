import { FC, useMemo, useState } from 'react';

import {
  CompetitorDto,
  OverHTPercentageStats,
  OverPercentageStats,
  UnderHTPercentageStats,
  UnderPercentageStats,
} from '@/constant/interface';
import Filter from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Filter';
import { OverUnderGoalsTable } from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Table';
import useTrans from '@/hooks/useTrans';
import {
  getOverHalfData,
  getOverTotalsData,
  getUnderHalfData,
  getUnderTotalsData,
} from '@/utils/footyUtils';

export type OverUnderGoalsData = {
  totalOverTable: OverPercentageStats;
  halfOverTable: OverHTPercentageStats;
  totalUnderTable: UnderPercentageStats;
  halfUnderTable: UnderHTPercentageStats;
};

type OverUnderGoalsProps = {
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  data: OverUnderGoalsData;
};

const OverUnderGoals: FC<OverUnderGoalsProps> = ({
  homeTeam,
  awayTeam,
  data,
}) => {
  const i18n = useTrans();
  const [filter, setFilter] = useState<string>('over');
  const filterItems = [
    {
      label: i18n.footy_stats.over,
      value: 'over',
    },
    { label: i18n.footy_stats.under, value: 'under' },
  ];

  const headerTotalTitles = [
    {
      title: i18n.footy_stats.total_goals,
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

  const headerHalfTitles = [
    {
      title: i18n.footy_stats.half,
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

  const { totalOverTable, halfOverTable } = useMemo(() => {
    if (filter === 'under') {
      return {
        totalOverTable: getUnderTotalsData(data.totalUnderTable, i18n),
        halfOverTable: getUnderHalfData(data.halfOverTable, i18n),
      };
    }
    return {
      totalOverTable: getOverTotalsData(data.totalOverTable, i18n),
      halfOverTable: getOverHalfData(data.halfOverTable, i18n),
    };
  }, [data, filter, i18n]);

  return (
    <div className='flex flex-col'>
      <h4 className='text-center text-xs font-bold uppercase dark:text-white'>
        {i18n.footy_stats.over_under_goals}
      </h4>
      <div className='gap mt-4 flex flex-col gap-4'>
        <Filter filter={filter} setFilter={setFilter} items={filterItems} />
        <OverUnderGoalsTable
          headerTitles={headerTotalTitles}
          stats={totalOverTable}
        />
        <OverUnderGoalsTable
          headerTitles={headerHalfTitles}
          stats={halfOverTable}
        />
      </div>
    </div>
  );
};

export default OverUnderGoals;

export const formatOverUnderGoalsData = (
  data: any,
  isHomeCup: boolean,
  isAwayCup: boolean
): OverUnderGoalsData => ({
  totalOverTable: {
    //* Home
    seasonOver05Percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.seasonOver05Percentage_overall
      : data?.home_team_info?.stats?.stats?.seasonOver05Percentage_home || 0,
    seasonOver15Percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.seasonOver15Percentage_overall
      : data?.home_team_info?.stats?.stats?.seasonOver15Percentage_home || 0,
    seasonOver25Percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.seasonOver25Percentage_overall
      : data?.home_team_info?.stats?.stats?.seasonOver25Percentage_home || 0,
    seasonOver35Percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.seasonOver35Percentage_overall
      : data?.home_team_info?.stats?.stats?.seasonOver35Percentage_home || 0,
    seasonOver45Percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.seasonOver45Percentage_overall
      : data?.home_team_info?.stats?.stats?.seasonOver45Percentage_home || 0,

    //* Away
    seasonOver05Percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.seasonOver05Percentage_overall
      : data?.away_team_info?.stats?.stats?.seasonOver05Percentage_away || 0,
    seasonOver15Percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.seasonOver15Percentage_overall
      : data?.away_team_info?.stats?.stats?.seasonOver15Percentage_away || 0,
    seasonOver25Percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.seasonOver25Percentage_overall
      : data?.away_team_info?.stats?.stats?.seasonOver25Percentage_away || 0,
    seasonOver35Percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.seasonOver35Percentage_overall
      : data?.away_team_info?.stats?.stats?.seasonOver35Percentage_away || 0,
    seasonOver45Percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.seasonOver45Percentage_overall
      : data?.away_team_info?.stats?.stats?.seasonOver45Percentage_away || 0,
    // * Average
    o05Potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.seasonOver05Percentage_overall
        : data?.home_team_info?.stats?.stats?.seasonOver05Percentage_home ||
          0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.seasonOver05Percentage_overall
          : data?.away_team_info?.stats?.stats?.seasonOver05Percentage_away ||
            0)) /
        2
    ),
    o15Potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.seasonOver15Percentage_overall
        : data?.home_team_info?.stats?.stats?.seasonOver15Percentage_home ||
          0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.seasonOver15Percentage_overall
          : data?.away_team_info?.stats?.stats?.seasonOver15Percentage_away ||
            0)) /
        2
    ),
    o25Potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.seasonOver25Percentage_overall
        : data?.home_team_info?.stats?.stats?.seasonOver25Percentage_home ||
          0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.seasonOver25Percentage_overall
          : data?.away_team_info?.stats?.stats?.seasonOver25Percentage_away ||
            0)) /
        2
    ),
    o35Potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.seasonOver35Percentage_overall
        : data?.home_team_info?.stats?.stats?.seasonOver35Percentage_home ||
          0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.seasonOver35Percentage_overall
          : data?.away_team_info?.stats?.stats?.seasonOver35Percentage_away ||
            0)) /
        2
    ),
    o45Potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.seasonOver45Percentage_overall
        : data?.home_team_info?.stats?.stats?.seasonOver45Percentage_home ||
          0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.seasonOver45Percentage_overall
          : data?.away_team_info?.stats?.stats?.seasonOver45Percentage_away ||
            0)) /
        2
    ),
  },
  halfOverTable: {
    //* Home
    seasonOver05PercentageHT_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.seasonOver05PercentageHT_overall
      : data?.home_team_info?.stats?.stats?.seasonOver05PercentageHT_home || 0,
    over05_2hg_percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.over05_2hg_percentage_overall
      : data?.home_team_info?.stats?.stats?.over05_2hg_percentage_home || 0,
    seasonOver15PercentageHT_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.seasonOver15PercentageHT_overall
      : data?.home_team_info?.stats?.stats?.seasonOver15PercentageHT_home || 0,
    over15_2hg_percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.over15_2hg_percentage_overall
      : data?.home_team_info?.stats?.stats?.over15_2hg_percentage_home || 0,
    seasonOver25PercentageHT_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.seasonOver25PercentageHT_overall
      : data?.home_team_info?.stats?.stats?.seasonOver25PercentageHT_home || 0,
    over25_2hg_percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.over25_2hg_percentage_overall
      : data?.home_team_info?.stats?.stats?.over25_2hg_percentage_home || 0,

    //* Away
    seasonOver05PercentageHT_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.seasonOver05PercentageHT_overall
      : data?.away_team_info?.stats?.stats?.seasonOver05PercentageHT_away || 0,
    over05_2hg_percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.over05_2hg_percentage_overall
      : data?.away_team_info?.stats?.stats?.over05_2hg_percentage_away || 0,
    seasonOver15PercentageHT_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.seasonOver15PercentageHT_overall
      : data?.away_team_info?.stats?.stats?.seasonOver15PercentageHT_away || 0,
    over15_2hg_percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.over15_2hg_percentage_overall
      : data?.away_team_info?.stats?.stats?.over15_2hg_percentage_away || 0,
    seasonOver25PercentageHT_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.seasonOver25PercentageHT_overall
      : data?.away_team_info?.stats?.stats?.seasonOver25PercentageHT_away || 0,
    over25_2hg_percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.over25_2hg_percentage_overall
      : data?.away_team_info?.stats?.stats?.over25_2hg_percentage_away || 0,

    // * Average
    o05HT_potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.seasonOver05PercentageHT_overall
        : data?.home_team_info?.stats?.stats?.seasonOver05PercentageHT_home ||
          0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.seasonOver05PercentageHT_overall
          : data?.away_team_info?.stats?.stats?.seasonOver05PercentageHT_away ||
            0)) /
        2
    ),
    o05_2H_potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over05_2hg_percentage_overall
        : data?.home_team_info?.stats?.stats?.over05_2hg_percentage_home || 0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.over05_2hg_percentage_overall
          : data?.away_team_info?.stats?.stats?.over05_2hg_percentage_away ||
            0)) /
        2
    ),
    o15HT_potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.seasonOver15PercentageHT_overall
        : data?.home_team_info?.stats?.stats?.seasonOver15PercentageHT_home ||
          0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.seasonOver15PercentageHT_overall
          : data?.away_team_info?.stats?.stats?.seasonOver15PercentageHT_away ||
            0)) /
        2
    ),
    o15_2H_potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over15_2hg_percentage_overall
        : data?.home_team_info?.stats?.stats?.over15_2hg_percentage_home || 0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.over15_2hg_percentage_overall
          : data?.away_team_info?.stats?.stats?.over15_2hg_percentage_away ||
            0)) /
        2
    ),
    o25HT_potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.seasonOver25PercentageHT_overall
        : data?.home_team_info?.stats?.stats?.seasonOver25PercentageHT_home ||
          0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.seasonOver25PercentageHT_overall
          : data?.away_team_info?.stats?.stats?.seasonOver25PercentageHT_away ||
            0)) /
        2
    ),
    o25_2H_potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over25_2hg_percentage_overall
        : data?.home_team_info?.stats?.stats?.over25_2hg_percentage_home || 0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.over25_2hg_percentage_overall
          : data?.away_team_info?.stats?.stats?.over25_2hg_percentage_away ||
            0)) /
        2
    ),
  },
  totalUnderTable: {
    //* Home
    seasonUnder05Percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.seasonUnder05Percentage_overall
      : data?.home_team_info?.stats?.stats?.seasonUnder05Percentage_home || 0,
    seasonUnder15Percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.seasonUnder15Percentage_overall
      : data?.home_team_info?.stats?.stats?.seasonUnder15Percentage_home || 0,
    seasonUnder25Percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.seasonUnder25Percentage_overall
      : data?.home_team_info?.stats?.stats?.seasonUnder25Percentage_home || 0,
    seasonUnder35Percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.seasonUnder35Percentage_overall
      : data?.home_team_info?.stats?.stats?.seasonUnder35Percentage_home || 0,
    seasonUnder45Percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.seasonUnder45Percentage_overall
      : data?.home_team_info?.stats?.stats?.seasonUnder45Percentage_home || 0,

    //* Away
    seasonUnder05Percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.seasonUnder05Percentage_overall
      : data?.away_team_info?.stats?.stats?.seasonUnder05Percentage_away || 0,
    seasonUnder15Percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.seasonUnder15Percentage_overall
      : data?.away_team_info?.stats?.stats?.seasonUnder15Percentage_away || 0,
    seasonUnder25Percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.seasonUnder25Percentage_overall
      : data?.away_team_info?.stats?.stats?.seasonUnder25Percentage_away || 0,
    seasonUnder35Percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.seasonUnder35Percentage_overall
      : data?.away_team_info?.stats?.stats?.seasonUnder35Percentage_away || 0,
    seasonUnder45Percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.seasonUnder45Percentage_overall
      : data?.away_team_info?.stats?.stats?.seasonUnder45Percentage_away || 0,
    // * Average
    u05Potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.seasonUnder05Percentage_overall
        : data?.home_team_info?.stats?.stats?.seasonUnder05Percentage_home ||
          0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.seasonUnder05Percentage_overall
          : data?.away_team_info?.stats?.stats?.seasonUnder05Percentage_away ||
            0)) /
        2
    ),
    u15Potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.seasonUnder15Percentage_overall
        : data?.home_team_info?.stats?.stats?.seasonUnder15Percentage_home ||
          0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.seasonUnder15Percentage_overall
          : data?.away_team_info?.stats?.stats?.seasonUnder15Percentage_away ||
            0)) /
        2
    ),
    u25Potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.seasonUnder25Percentage_overall
        : data?.home_team_info?.stats?.stats?.seasonUnder25Percentage_home ||
          0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.seasonUnder25Percentage_overall
          : data?.away_team_info?.stats?.stats?.seasonUnder25Percentage_away ||
            0)) /
        2
    ),
    u35Potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.seasonUnder35Percentage_overall
        : data?.home_team_info?.stats?.stats?.seasonUnder35Percentage_home ||
          0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.seasonUnder35Percentage_overall
          : data?.away_team_info?.stats?.stats?.seasonUnder35Percentage_away ||
            0)) /
        2
    ),
    u45Potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.seasonUnder45Percentage_overall
        : data?.home_team_info?.stats?.stats?.seasonUnder45Percentage_home ||
          0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.seasonUnder45Percentage_overall
          : data?.away_team_info?.stats?.stats?.seasonUnder45Percentage_away ||
            0)) /
        2
    ),
  },
  halfUnderTable: {
    //* Home
    seasonUnder05PercentageHT_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.seasonUnder05PercentageHT_overall
      : data?.home_team_info?.stats?.stats?.seasonUnder05PercentageHT_home || 0,
    under05_2hg_percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.under05_2hg_percentage_overall
      : data?.home_team_info?.stats?.stats?.under05_2hg_percentage_home || 0,
    seasonUnder15PercentageHT_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.seasonUnder15PercentageHT_overall
      : data?.home_team_info?.stats?.stats?.seasonUnder15PercentageHT_home || 0,
    under15_2hg_percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.under15_2hg_percentage_overall
      : data?.home_team_info?.stats?.stats?.under15_2hg_percentage_home || 0,
    seasonUnder25PercentageHT_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.seasonUnder25PercentageHT_overall
      : data?.home_team_info?.stats?.stats?.seasonUnder25PercentageHT_home || 0,
    under25_2hg_percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.under25_2hg_percentage_overall
      : data?.home_team_info?.stats?.stats?.under25_2hg_percentage_home || 0,

    //* Away
    seasonUnder05PercentageHT_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.seasonUnder05PercentageHT_overall
      : data?.away_team_info?.stats?.stats?.seasonUnder05PercentageHT_away || 0,
    under05_2hg_percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.under05_2hg_percentage_overall
      : data?.away_team_info?.stats?.stats?.under05_2hg_percentage_away || 0,
    seasonUnder15PercentageHT_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.seasonUnder15PercentageHT_overall
      : data?.away_team_info?.stats?.stats?.seasonUnder15PercentageHT_away || 0,
    under15_2hg_percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.under15_2hg_percentage_overall
      : data?.away_team_info?.stats?.stats?.under15_2hg_percentage_away || 0,
    seasonUnder25PercentageHT_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.seasonUnder25PercentageHT_overall
      : data?.away_team_info?.stats?.stats?.seasonUnder25PercentageHT_away || 0,
    under25_2hg_percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.under25_2hg_percentage_overall
      : data?.away_team_info?.stats?.stats?.under25_2hg_percentage_away || 0,

    // * Average
    u05HT_potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.seasonUnder05PercentageHT_overall
        : data?.home_team_info?.stats?.stats?.seasonUnder05PercentageHT_home ||
          0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats
              ?.seasonUnder05PercentageHT_overall
          : data?.away_team_info?.stats?.stats
              ?.seasonUnder05PercentageHT_away || 0)) /
        2
    ),
    u05_2H_potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.under05_2hg_percentage_overall
        : data?.home_team_info?.stats?.stats?.under05_2hg_percentage_home ||
          0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.under05_2hg_percentage_overall
          : data?.away_team_info?.stats?.stats?.under05_2hg_percentage_away ||
            0)) /
        2
    ),
    u15HT_potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.seasonUnder15PercentageHT_overall
        : data?.home_team_info?.stats?.stats?.seasonUnder15PercentageHT_home ||
          0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats
              ?.seasonUnder15PercentageHT_overall
          : data?.away_team_info?.stats?.stats
              ?.seasonUnder15PercentageHT_away || 0)) /
        2
    ),
    u15_2H_potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.under15_2hg_percentage_overall
        : data?.home_team_info?.stats?.stats?.under15_2hg_percentage_home ||
          0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.under15_2hg_percentage_overall
          : data?.away_team_info?.stats?.stats?.under15_2hg_percentage_away ||
            0)) /
        2
    ),
    u25HT_potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.seasonUnder25Percentage_overall
        : data?.home_team_info?.stats?.stats?.seasonUnder25Percentage_home ||
          0) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats
              ?.seasonUnder25PercentageHT_overall
          : data?.away_team_info?.stats?.stats
              ?.seasonUnder25PercentageHT_away || 0)) /
        2
    ),
    u25_2H_potential: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.seasonUnder25PercentageHT_overall
        : data?.home_team_info?.stats?.stats?.seasonUnder25PercentageHT_home ||
          0) +
        (data?.away_team_info?.stats?.season_format === 'cup'
          ? data?.away_team_info?.stats?.stats?.under25_2hg_percentage_overall
          : data?.away_team_info?.stats?.stats?.under25_2hg_percentage_away ||
            0)) /
        2
    ),
  },
});
