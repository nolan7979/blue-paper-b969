import { FC, useMemo, useState } from 'react';
import useTrans from '@/hooks/useTrans';
import Filter from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Filter';
import {
  CardedStats,
  CompetitorDto,
  OpponentCardsStats,
  TotalCardsStats,
} from '@/constant/interface';
import { TeamsAverageTable } from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Table';
import {
  getCardedData,
  getMatchCardData,
  getOpponentCardsData,
} from '@/utils/footyUtils';

export type CardFullTimeData = {
  totalCards: TotalCardsStats;
  carded: CardedStats;
  opponentCards: OpponentCardsStats;
};

type CardFullTimeProps = {
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  data: CardFullTimeData;
};

const CardFullTime: FC<CardFullTimeProps> = ({ homeTeam, awayTeam, data }) => {
  const i18n = useTrans();
  const [filter, setFilter] = useState<string>('total_cards');

  const filterItems = [
    {
      label: i18n.footy_stats.total_cards,
      value: 'total_cards',
    },
    { label: i18n.footy_stats.team_cards, value: 'team_cards' },
  ];

  const createHeaderTitles = (
    title: string,
    homeTeam: CompetitorDto,
    awayTeam: CompetitorDto,
    i18n: any
  ) => [
    {
      title,
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

  const headerTotalCardTitles = createHeaderTitles(
    'Match Cards',
    homeTeam,
    awayTeam,
    i18n
  );
  const headerCardedTitles = createHeaderTitles(
    i18n.footy_stats.carded,
    homeTeam,
    awayTeam,
    i18n
  );
  const headerOpponentCardsTitles = createHeaderTitles(
    i18n.footy_stats.opponent_cards,
    homeTeam,
    awayTeam,
    i18n
  );

  const { firstTableData, secondTableData } = useMemo(() => {
    if (filter === 'team_cards') {
      return {
        firstTableData: getCardedData(data.carded, i18n),
        secondTableData: getOpponentCardsData(data.opponentCards, i18n),
      };
    }
    return {
      firstTableData: getMatchCardData(data.totalCards, i18n),
      secondTableData: [],
    };
  }, [data, i18n, filter]);

  const firstHeaderTable = useMemo(() => {
    return filter === 'team_cards' ? headerCardedTitles : headerTotalCardTitles;
  }, [filter, headerCardedTitles, headerTotalCardTitles]);

  return (
    <div className='flex flex-col gap-3'>
      <h4 className='text-center text-xs font-bold uppercase dark:text-white'>
        {i18n.footy_stats.cards_full_time}
      </h4>
      <Filter filter={filter} setFilter={setFilter} items={filterItems} />
      <TeamsAverageTable
        headerTitles={firstHeaderTable}
        stats={firstTableData}
      />
      {!!secondTableData?.length && (
        <TeamsAverageTable
          headerTitles={headerOpponentCardsTitles}
          stats={secondTableData}
        />
      )}
    </div>
  );
};

export default CardFullTime;

export const formatCardFullTimeData = (
  data: any,
  isHomeCup: boolean,
  isAwayCup: boolean
): CardFullTimeData => ({
  totalCards: {
    //* Home
    cards_total_avg_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.cards_total_avg_overall
      : data?.home_team_info?.stats?.stats?.cards_total_avg_home || 0,
    over05CardsPercentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.over05CardsPercentage_overall
      : data?.home_team_info?.stats?.stats?.over05CardsPercentage_home || 0,
    over15CardsPercentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.over15CardsPercentage_overall
      : data?.home_team_info?.stats?.stats?.over15CardsPercentage_home || 0,
    over25CardsPercentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.over25CardsPercentage_overall
      : data?.home_team_info?.stats?.stats?.over25CardsPercentage_home || 0,
    over35CardsPercentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.over35CardsPercentage_overall
      : data?.home_team_info?.stats?.stats?.over35CardsPercentage_home || 0,
    over45CardsPercentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.over45CardsPercentage_overall
      : data?.home_team_info?.stats?.stats?.over45CardsPercentage_home || 0,
    over55CardsPercentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.over55CardsPercentage_overall
      : data?.home_team_info?.stats?.stats?.over55CardsPercentage_home || 0,
    over65CardsPercentage_home: isHomeCup
      ? data?.home_team_info?.stats?.stats?.over65CardsPercentage_overall
      : data?.home_team_info?.stats?.stats?.over65CardsPercentage_home || 0,

    //* Away
    cards_total_avg_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.cards_total_avg_overall
      : data?.away_team_info?.stats?.stats?.cards_total_avg_away || 0,
    over05CardsPercentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.over05CardsPercentage_overall
      : data?.away_team_info?.stats?.stats?.over05CardsPercentage_away || 0,
    over15CardsPercentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.over15CardsPercentage_overall
      : data?.away_team_info?.stats?.stats?.over15CardsPercentage_away || 0,
    over25CardsPercentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.over25CardsPercentage_overall
      : data?.away_team_info?.stats?.stats?.over25CardsPercentage_away || 0,
    over35CardsPercentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.over35CardsPercentage_overall
      : data?.away_team_info?.stats?.stats?.over35CardsPercentage_away || 0,
    over45CardsPercentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.over45CardsPercentage_overall
      : data?.away_team_info?.stats?.stats?.over45CardsPercentage_away || 0,
    over55CardsPercentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.over55CardsPercentage_overall
      : data?.away_team_info?.stats?.stats?.over55CardsPercentage_away || 0,
    over65CardsPercentage_away: isAwayCup
      ? data?.away_team_info?.stats?.stats?.over65CardsPercentage_overall
      : data?.away_team_info?.stats?.stats?.over65CardsPercentage_away || 0,

    //* Average
    cards_total_avg_overall: parseFloat(
      (
        (((isHomeCup
          ? data?.home_team_info?.stats?.stats?.cards_total_avg_overall
          : data?.home_team_info?.stats?.stats?.cards_total_avg_home) +
          (isAwayCup
            ? data?.away_team_info?.stats?.stats?.cards_total_avg_overall
            : data?.away_team_info?.stats?.stats?.cards_total_avg_away)) /
          2 || 0) + 0.00001
      ).toFixed(2)
    ),
    over05CardsPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over05CardsPercentage_overall
        : data?.home_team_info?.stats?.stats?.over05CardsPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.over05CardsPercentage_overall
          : data?.away_team_info?.stats?.stats?.over05CardsPercentage_away)) /
        2 || 0
    ),
    over15CardsPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over15CardsPercentage_overall
        : data?.home_team_info?.stats?.stats?.over15CardsPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.over15CardsPercentage_overall
          : data?.away_team_info?.stats?.stats?.over15CardsPercentage_away)) /
        2 || 0
    ),
    over25CardsPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over25CardsPercentage_overall
        : data?.home_team_info?.stats?.stats?.over25CardsPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.over25CardsPercentage_overall
          : data?.away_team_info?.stats?.stats?.over25CardsPercentage_away)) /
        2 || 0
    ),
    over35CardsPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over35CardsPercentage_overall
        : data?.home_team_info?.stats?.stats?.over35CardsPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.over35CardsPercentage_overall
          : data?.away_team_info?.stats?.stats?.over35CardsPercentage_away)) /
        2 || 0
    ),
    over45CardsPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over45CardsPercentage_overall
        : data?.home_team_info?.stats?.stats?.over45CardsPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.over45CardsPercentage_overall
          : data?.away_team_info?.stats?.stats?.over45CardsPercentage_away)) /
        2 || 0
    ),
    over55CardsPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over55CardsPercentage_overall
        : data?.home_team_info?.stats?.stats?.over55CardsPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.over55CardsPercentage_overall
          : data?.away_team_info?.stats?.stats?.over55CardsPercentage_away)) /
        2 || 0
    ),
    over65CardsPercentage_overall: Math.round(
      ((isHomeCup
        ? data?.home_team_info?.stats?.stats?.over65CardsPercentage_overall
        : data?.home_team_info?.stats?.stats?.over65CardsPercentage_home) +
        (isAwayCup
          ? data?.away_team_info?.stats?.stats?.over65CardsPercentage_overall
          : data?.away_team_info?.stats?.stats?.over65CardsPercentage_away)) /
        2 || 0
    ),
  },
  carded: {
    //* Home
    cards_for_avg_home:
      data?.home_team_info?.stats?.stats?.additional_info?.cards_for_avg_home ||
      0,
    over05CardsForPercentage_home:
      data?.home_team_info?.stats?.stats?.over05CardsForPercentage_home || 0,
    over15CardsForPercentage_home:
      data?.home_team_info?.stats?.stats?.over15CardsForPercentage_home || 0,
    over25CardsForPercentage_home:
      data?.home_team_info?.stats?.stats?.over25CardsForPercentage_home || 0,
    over35CardsForPercentage_home:
      data?.home_team_info?.stats?.stats?.over35CardsForPercentage_home || 0,

    //* Away
    cards_for_avg_away:
      data?.away_team_info?.stats?.stats?.additional_info?.cards_for_avg_away ||
      0,
    over05CardsForPercentage_away:
      data?.away_team_info?.stats?.stats?.over05CardsForPercentage_away || 0,
    over15CardsForPercentage_away:
      data?.away_team_info?.stats?.stats?.over15CardsForPercentage_away || 0,
    over25CardsForPercentage_away:
      data?.away_team_info?.stats?.stats?.over25CardsForPercentage_away || 0,
    over35CardsForPercentage_away:
      data?.away_team_info?.stats?.stats?.over35CardsForPercentage_away || 0,

    //* Average
    cards_for_avg: parseFloat(
      (
        ((data?.home_team_info?.stats?.stats?.additional_info
          ?.cards_for_avg_home +
          data?.away_team_info?.stats?.stats?.additional_info
            ?.cards_for_avg_away) /
          2 || 0) + 0.00001
      ).toFixed(2)
    ),
    over05CardsForPercentage: Math.round(
      (data?.home_team_info?.stats?.stats?.over05CardsForPercentage_home +
        data?.away_team_info?.stats?.stats?.over05CardsForPercentage_away) /
        2 || 0
    ),
    over15CardsForPercentage: Math.round(
      (data?.home_team_info?.stats?.stats?.over15CardsForPercentage_home +
        data?.away_team_info?.stats?.stats?.over15CardsForPercentage_away) /
        2 || 0
    ),
    over25CardsForPercentage: Math.round(
      (data?.home_team_info?.stats?.stats?.over25CardsForPercentage_home +
        data?.away_team_info?.stats?.stats?.over25CardsForPercentage_away) /
        2 || 0
    ),
    over35CardsForPercentage: Math.round(
      (data?.home_team_info?.stats?.stats?.over35CardsForPercentage_home +
        data?.away_team_info?.stats?.stats?.over35CardsForPercentage_away) /
        2 || 0
    ),
  },
  opponentCards: {
    //* Home
    cards_against_avg_home:
      data?.home_team_info?.stats?.stats?.additional_info
        ?.cards_against_avg_home || 0,
    over05CardsAgainstPercentage_home:
      data?.home_team_info?.stats?.stats?.over05CardsAgainstPercentage_home ||
      0,
    over15CardsAgainstPercentage_home:
      data?.home_team_info?.stats?.stats?.over15CardsAgainstPercentage_home ||
      0,
    over25CardsAgainstPercentage_home:
      data?.home_team_info?.stats?.stats?.over25CardsAgainstPercentage_home ||
      0,
    over35CardsAgainstPercentage_home:
      data?.home_team_info?.stats?.stats?.over35CardsAgainstPercentage_home ||
      0,

    //* Away
    cards_against_avg_away:
      data?.away_team_info?.stats?.stats?.additional_info
        ?.cards_against_avg_away || 0,
    over05CardsAgainstPercentage_away:
      data?.away_team_info?.stats?.stats?.over05CardsAgainstPercentage_away ||
      0,
    over15CardsAgainstPercentage_away:
      data?.away_team_info?.stats?.stats?.over15CardsAgainstPercentage_away ||
      0,
    over25CardsAgainstPercentage_away:
      data?.away_team_info?.stats?.stats?.over25CardsAgainstPercentage_away ||
      0,
    over35CardsAgainstPercentage_away:
      data?.away_team_info?.stats?.stats?.over35CardsAgainstPercentage_away ||
      0,

    //* Average
    cards_against_avg: parseFloat(
      (
        ((data?.home_team_info?.stats?.stats?.additional_info
          ?.cards_against_avg_home +
          data?.away_team_info?.stats?.stats?.additional_info
            ?.cards_against_avg_away) /
          2 || 0) + 0.00001
      ).toFixed(2)
    ),
    over05CardsAgainstPercentage: Math.round(
      (data?.home_team_info?.stats?.stats?.over05CardsAgainstPercentage_home +
        data?.away_team_info?.stats?.stats?.over05CardsAgainstPercentage_away) /
        2 || 0
    ),
    over15CardsAgainstPercentage: Math.round(
      (data?.home_team_info?.stats?.stats?.over15CardsAgainstPercentage_home +
        data?.away_team_info?.stats?.stats?.over15CardsAgainstPercentage_away) /
        2 || 0
    ),
    over25CardsAgainstPercentage: Math.round(
      (data?.home_team_info?.stats?.stats?.over25CardsAgainstPercentage_home +
        data?.away_team_info?.stats?.stats?.over25CardsAgainstPercentage_away) /
        2 || 0
    ),
    over35CardsAgainstPercentage: Math.round(
      (data?.home_team_info?.stats?.stats?.over35CardsAgainstPercentage_home +
        data?.away_team_info?.stats?.stats?.over35CardsAgainstPercentage_away) /
        2 || 0
    ),
  },
});
