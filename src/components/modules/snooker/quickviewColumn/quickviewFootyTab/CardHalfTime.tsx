import { FC, useMemo, useState } from 'react';
import useTrans from '@/hooks/useTrans';
import Filter from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Filter';
import {
  CompetitorDto,
  firstSecondHalfCardsStats,
  Over_05_3CardsStats,
} from '@/constant/interface';
import { TeamsAverageTable } from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Table';
import {
  getFirstSecondCardsData,
  getOver05_3CardsData,
} from '@/utils/footyUtils';

export type CardHalfTimeData = {
  firstSecondHalf: firstSecondHalfCardsStats;
  over_05_3: Over_05_3CardsStats;
};

type CardHalfTimeProps = {
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  data: CardHalfTimeData;
};

const CardHalfTime: FC<CardHalfTimeProps> = ({ homeTeam, awayTeam, data }) => {
  const i18n = useTrans();
  const [filter, setFilter] = useState<string>('1h_2h_average');

  const filterItems = [
    {
      label: i18n.footy_stats['1h_2h_average'],
      value: '1h_2h_average',
    },
    { label: i18n.footy_stats.over_05_3, value: 'over_05_3' },
  ];

  const createHeaderTitles = (firstTitle: string) => [
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

  const CardHalfTimeData = useMemo(() => {
    if (filter === 'over_05_3') {
      return getOver05_3CardsData(data.over_05_3, i18n);
    }
    return getFirstSecondCardsData(data.firstSecondHalf, i18n);
  }, [data, i18n, filter]);

  const headerTitles = useMemo(() => {
    if (filter === 'over_05_3') {
      return createHeaderTitles(i18n.footy_stats['1h_2h_over']);
    }
    return createHeaderTitles(i18n.footy_stats['1h_2h_cards']);
  }, [filter]);

  return (
    <div className='flex flex-col gap-3'>
      <h4 className='text-center text-xs font-bold uppercase dark:text-white'>
        {i18n.footy_stats.cards_1st_2nd_half}
      </h4>
      <Filter filter={filter} setFilter={setFilter} items={filterItems} />
      <TeamsAverageTable headerTitles={headerTitles} stats={CardHalfTimeData} />
    </div>
  );
};

export default CardHalfTime;

export const formatCardHalfTimeData = (
  data: any,
  isHomeCup: boolean,
  isAwayCup: boolean
): CardHalfTimeData => ({
  firstSecondHalf: {
    //* Home
    fh_cards_total_avg_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.additional_info
          ?.fh_cards_total_avg_overall
      : data?.home_team_info?.stats?.stats?.additional_info
          ?.fh_cards_total_avg_home || 0,
    h2_cards_total_avg_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.additional_info?.[
          '2h_cards_total_avg_overall'
        ]
      : data?.home_team_info?.stats?.stats?.additional_info?.[
          '2h_cards_total_avg_home'
        ] || 0,
    fh_cards_for_avg_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.additional_info
          ?.fh_cards_for_avg_overall
      : data?.home_team_info?.stats?.stats?.additional_info
          ?.fh_cards_for_avg_home || 0,
    h2_cards_for_avg_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.additional_info?.[
          '2h_cards_for_avg_overall'
        ]
      : data?.home_team_info?.stats?.stats?.additional_info?.[
          '2h_cards_for_avg_home'
        ] || 0,

    //* Away
    fh_cards_total_avg_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.additional_info
          ?.fh_cards_total_avg_overall
      : data?.away_team_info?.stats?.stats?.additional_info
          ?.fh_cards_total_avg_away || 0,
    h2_cards_total_avg_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.additional_info?.[
          '2h_cards_total_avg_overall'
        ]
      : data?.away_team_info?.stats?.stats?.additional_info?.[
          '2h_cards_total_avg_away'
        ] || 0,
    fh_cards_for_avg_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.additional_info
          ?.fh_cards_for_avg_overall
      : data?.away_team_info?.stats?.stats?.additional_info
          ?.fh_cards_for_avg_away || 0,
    h2_cards_for_avg_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.additional_info?.[
          '2h_cards_for_avg_overall'
        ]
      : data?.away_team_info?.stats?.stats?.additional_info?.[
          '2h_cards_for_avg_away'
        ] || 0,

    //* Average
    fh_cards_total_avg: parseFloat(
      (
        (((isHomeCup
          ? data?.home_team_info?.stats?.stats?.additional_info
              ?.fh_cards_total_avg_overall
          : data?.home_team_info?.stats?.stats?.additional_info
              ?.fh_cards_total_avg_home) +
          (isAwayCup
            ? data?.away_team_info?.stats?.stats?.additional_info
                ?.fh_cards_total_avg_overall
            : data?.away_team_info?.stats?.stats?.additional_info
                ?.fh_cards_total_avg_away)) /
          2 || 0) + 0.00001
      ).toFixed(2)
    ),
    h2_cards_total_avg: parseFloat(
      (
        (((isHomeCup
          ? data?.home_team_info?.stats?.stats?.additional_info?.[
              '2h_cards_total_avg_overall'
            ]
          : data?.home_team_info?.stats?.stats?.additional_info?.[
              '2h_cards_total_avg_home'
            ]) +
          (isAwayCup
            ? data?.away_team_info?.stats?.stats?.additional_info?.[
                '2h_cards_total_avg_overall'
              ]
            : data?.away_team_info?.stats?.stats?.additional_info?.[
                '2h_cards_total_avg_away'
              ])) /
          2 || 0) + 0.00001
      ).toFixed(2)
    ),
    fh_cards_for_avg: parseFloat(
      (
        (((isHomeCup
          ? data?.home_team_info?.stats?.stats?.additional_info
              ?.fh_cards_for_avg_overall
          : data?.home_team_info?.stats?.stats?.additional_info
              ?.fh_cards_for_avg_home) +
          (isAwayCup
            ? data?.away_team_info?.stats?.stats?.additional_info
                ?.fh_cards_for_avg_overall
            : data?.away_team_info?.stats?.stats?.additional_info
                ?.fh_cards_for_avg_away)) /
          2 || 0) + 0.00001
      ).toFixed(2)
    ),
    h2_cards_for_avg: parseFloat(
      (
        (((isHomeCup
          ? data?.home_team_info?.stats?.stats?.additional_info?.[
              '2h_cards_for_avg_overall'
            ]
          : data?.home_team_info?.stats?.stats?.additional_info?.[
              '2h_cards_for_avg_home'
            ]) +
          (isAwayCup
            ? data?.away_team_info?.stats?.stats?.additional_info?.[
                '2h_cards_for_avg_overall'
              ]
            : data?.away_team_info?.stats?.stats?.additional_info?.[
                '2h_cards_for_avg_away'
              ])) /
          2 || 0) + 0.00001
      ).toFixed(2)
    ),
  },
  over_05_3: {
    //* Home
    fh_total_cards_under2_percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.additional_info
          ?.fh_total_cards_under2_percentage_overall
      : data?.home_team_info?.stats?.stats?.additional_info
          ?.fh_total_cards_under2_percentage_home || 0,
    h2_total_cards_under2_percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.additional_info?.[
          '2h_total_cards_under2_percentage_overall'
        ]
      : data?.home_team_info?.stats?.stats?.additional_info?.[
          '2h_total_cards_under2_percentage_home'
        ] || 0,
    fh_total_cards_2to3_percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.additional_info
          ?.fh_total_cards_2to3_percentage_overall
      : data?.home_team_info?.stats?.stats?.additional_info
          ?.fh_total_cards_2to3_percentage_home || 0,
    h2_total_cards_2to3_percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.additional_info?.[
          '2h_total_cards_2to3_percentage_overall'
        ]
      : data?.home_team_info?.stats?.stats?.additional_info?.[
          '2h_total_cards_2to3_percentage_home'
        ] || 0,
    fh_total_cards_over3_percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.additional_info
          ?.fh_total_cards_over3_percentage_overall
      : data?.home_team_info?.stats?.stats?.additional_info
          ?.fh_total_cards_over3_percentage_home || 0,
    h2_total_cards_over3_percentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.additional_info?.[
          '2h_total_cards_over3_percentage_overall'
        ]
      : data?.home_team_info?.stats?.stats?.additional_info?.[
          '2h_total_cards_over3_percentage_home'
        ] || 0,

    //* Away
    fh_total_cards_under2_percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.additional_info
          ?.fh_total_cards_under2_percentage_overall
      : data?.away_team_info?.stats?.stats?.additional_info
          ?.fh_total_cards_under2_percentage_away || 0,
    h2_total_cards_under2_percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.additional_info?.[
          '2h_total_cards_under2_percentage_overall'
        ]
      : data?.away_team_info?.stats?.stats?.additional_info?.[
          '2h_total_cards_under2_percentage_away'
        ] || 0,
    fh_total_cards_2to3_percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.additional_info
          ?.fh_total_cards_2to3_percentage_overall
      : data?.away_team_info?.stats?.stats?.additional_info
          ?.fh_total_cards_2to3_percentage_away || 0,
    h2_total_cards_2to3_percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.additional_info?.[
          '2h_total_cards_2to3_percentage_overall'
        ]
      : data?.away_team_info?.stats?.stats?.additional_info?.[
          '2h_total_cards_2to3_percentage_away'
        ] || 0,
    fh_total_cards_over3_percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.additional_info
          ?.fh_total_cards_over3_percentage_overall
      : data?.away_team_info?.stats?.stats?.additional_info
          ?.fh_total_cards_over3_percentage_away || 0,
    h2_total_cards_over3_percentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.additional_info?.[
          '2h_total_cards_over3_percentage_overall'
        ]
      : data?.away_team_info?.stats?.stats?.additional_info?.[
          '2h_total_cards_over3_percentage_away'
        ] || 0,
    //* Average
    fh_total_cards_under2_percentage: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.fh_total_cards_under2_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.fh_total_cards_under2_percentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.additional_info
              ?.fh_total_cards_under2_percentage_overall
          : data?.away_team_info?.stats?.stats?.additional_info
              ?.fh_total_cards_under2_percentage_away)) /
        2 || 0
    ),
    h2_total_cards_under2_percentage: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info?.[
            '2h_total_cards_under2_percentage_overall'
          ]
        : data?.home_team_info?.stats?.stats?.additional_info?.[
            '2h_total_cards_under2_percentage_home'
          ]) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.additional_info?.[
              '2h_total_cards_under2_percentage_overall'
            ]
          : data?.away_team_info?.stats?.stats?.additional_info?.[
              '2h_total_cards_under2_percentage_away'
            ])) /
        2 || 0
    ),
    fh_total_cards_2to3_percentage: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.fh_total_cards_2to3_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.fh_total_cards_2to3_percentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.additional_info
              ?.fh_total_cards_2to3_percentage_overall
          : data?.away_team_info?.stats?.stats?.additional_info
              ?.fh_total_cards_2to3_percentage_away)) /
        2 || 0
    ),
    h2_total_cards_2to3_percentage: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info?.[
            '2h_total_cards_2to3_percentage_overall'
          ]
        : data?.home_team_info?.stats?.stats?.additional_info?.[
            '2h_total_cards_2to3_percentage_home'
          ]) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.additional_info?.[
              '2h_total_cards_2to3_percentage_overall'
            ]
          : data?.away_team_info?.stats?.stats?.additional_info?.[
              '2h_total_cards_2to3_percentage_away'
            ])) /
        2 || 0
    ),
    fh_total_cards_over3_percentage: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info
            ?.fh_total_cards_over3_percentage_overall
        : data?.home_team_info?.stats?.stats?.additional_info
            ?.fh_total_cards_over3_percentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.additional_info
              ?.fh_total_cards_over3_percentage_overall
          : data?.away_team_info?.stats?.stats?.additional_info
              ?.fh_total_cards_over3_percentage_away)) /
        2 || 0
    ),
    h2_total_cards_over3_percentage: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.additional_info?.[
            '2h_total_cards_over3_percentage_overall'
          ]
        : data?.home_team_info?.stats?.stats?.additional_info?.[
            '2h_total_cards_over3_percentage_home'
          ]) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.additional_info?.[
              '2h_total_cards_over3_percentage_overall'
            ]
          : data?.away_team_info?.stats?.stats?.additional_info?.[
              '2h_total_cards_over3_percentage_away'
            ])) /
        2 || 0
    ),
  },
});
