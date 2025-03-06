import {
  CardedStats,
  CornersAgainstStats,
  CornersEarnedStats,
  CornersHalfTimeStats,
  CornersPercentageStats,
  firstSecondHalfCardsStats,
  FullTimeConcededStats,
  FullTimeScoredStats,
  GoalsConcededBy10Minutes,
  GoalsConcededBy15Minutes,
  GoalsScoredBy10Minutes,
  GoalsScoredBy15Minutes,
  HalfFormStats,
  HalfTimeConcededStats,
  HalfTimeScoredStats,
  OpponentCardsStats,
  Over_05_3CardsStats,
  OverHTPercentageStats,
  OverPercentageStats,
  ShotsTakenStats,
  TeamInfoFooty,
  TotalCardsStats,
  TotalGoalsBy10Minutes,
  TotalGoalsBy15Minutes,
  UnderHTPercentageStats,
  UnderPercentageStats,
} from '@/constant/interface';

export const renderScoreDisplay = (winnerText: string) => {
  let score: string;

  switch (winnerText) {
    case 'w':
      score = 'W';
      break;
    case 'l':
      score = 'L';
      break;
    case 'd':
      score = 'D';
      break;
    default:
      score = '';
  }

  const style =
    score === 'D'
      ? 'bg-light-default'
      : score === 'W'
      ? 'bg-dark-win'
      : 'bg-dark-loss';

  return {
    style,
    score,
  };
};

export const genStatsPointColor = (point: number): string => {
  let color = '';
  if (point <= 1) {
    color = 'bg-standings-b';
  } else if (point <= 1.6) {
    color = 'bg-match-score';
  } else {
    color = 'bg-dark-win';
  }

  return color;
};

type PercentageResult = {
  homePercentage: number;
  awayPercentage: number;
};

export const calculatePercentage = (
  homeValue: number,
  awayValue: number
): PercentageResult => {
  const total = homeValue + awayValue;

  if (total === 0) {
    return { homePercentage: 0, awayPercentage: 0 };
  }

  const homePercentage = (homeValue / total) * 100;
  const awayPercentage = (awayValue / total) * 100;

  return {
    homePercentage: parseFloat(homePercentage.toFixed(2)),
    awayPercentage: parseFloat(awayPercentage.toFixed(2)),
  };
};

export const getResultData = (teamData: TeamInfoFooty, i18n: any) => {
  return [
    {
      label: i18n.footy_stats.overall,
      result:
        teamData?.stats?.stats?.additional_info?.formRun_overall
          ?.slice(-5)
          ?.split('') || [],
      ppg: teamData?.stats?.stats?.seasonPPG_overall || 0,
    },
    {
      label: i18n.filter.home,
      result:
        teamData?.stats?.stats?.additional_info?.formRun_home
          ?.slice(-5)
          ?.split('') || [],
      ppg: teamData?.stats?.stats?.seasonPPG_home || 0,
    },
    {
      label: i18n.filter.away,
      result:
        teamData?.stats?.stats?.additional_info?.formRun_away
          ?.slice(-5)
          ?.split('') || [],
      ppg: teamData?.stats?.stats?.seasonPPG_away || 0,
    },
  ];
};

export const getStatsData = (
  teamData: TeamInfoFooty,
  i18n: any,
  isHome = false
) => {
  return [
    {
      label: `${i18n.qv.win} %`,
      overall: {
        value: `${teamData?.stats?.stats?.winPercentage_overall || 0}%`,
        className: 'w-1/4',
      },
      home: {
        value: `${teamData?.stats?.stats?.winPercentage_home || 0}%`,
        className: isHome
          ? 'w-1/4 dark:bg-[#044009] bg-[#76CFA6] text-[#105B16] dark:text-dark-win text-white'
          : 'w-1/4',
      },
      away: {
        value: `${teamData?.stats?.stats?.winPercentage_away || 0}%`,
        className: !isHome
          ? 'w-1/4 dark:bg-[#044009] bg-[#76CFA6] text-[#105B16] dark:text-dark-win text-white'
          : 'w-1/4',
      },
    },
    {
      label: i18n.footy_stats.avg,
      overall: {
        value: teamData?.stats?.stats?.seasonAVG_overall || 0,
        className: 'w-1/4',
      },
      home: {
        value: teamData?.stats?.stats?.seasonAVG_home || 0,
        className: isHome
          ? 'w-1/4 dark:bg-[#044009] bg-[#76CFA6] text-[#105B16] dark:text-dark-win text-white'
          : 'w-1/4',
      },
      away: {
        value: teamData?.stats?.stats?.seasonAVG_away || 0,
        className: !isHome
          ? 'w-1/4 dark:bg-[#044009] bg-[#76CFA6] text-[#105B16] dark:text-dark-win text-white'
          : 'w-1/4',
      },
    },
    {
      label: i18n.footy_stats.scored,
      overall: {
        value: teamData?.stats?.stats?.seasonScoredAVG_overall || 0,
        className: 'w-1/4',
      },
      home: {
        value: teamData?.stats?.stats?.seasonScoredAVG_home || 0,
        className: isHome
          ? 'w-1/4 dark:bg-[#044009] bg-[#76CFA6] text-[#105B16] dark:text-dark-win text-white'
          : 'w-1/4',
      },
      away: {
        value: teamData?.stats?.stats?.seasonScoredAVG_away || 0,
        className: !isHome
          ? 'w-1/4 dark:bg-[#044009] bg-[#76CFA6] text-[#105B16] dark:text-dark-win text-white'
          : 'w-1/4',
      },
    },
    {
      label: i18n.footy_stats.conceded,
      overall: {
        value: teamData?.stats?.stats?.seasonConcededAVG_overall || 0,
        className: 'w-1/4',
      },
      home: {
        value: teamData?.stats?.stats?.seasonConcededAVG_home || 0,
        className: isHome
          ? 'w-1/4 dark:bg-[#044009] bg-[#76CFA6] text-[#105B16] dark:text-dark-win text-white'
          : 'w-1/4',
      },
      away: {
        value: teamData?.stats?.stats?.seasonConcededAVG_away || 0,
        className: !isHome
          ? 'w-1/4 dark:bg-[#044009] bg-[#76CFA6] text-[#105B16] dark:text-dark-win text-white'
          : 'w-1/4',
      },
    },
    {
      label: i18n.footy_stats.btts,
      overall: {
        value: `${teamData?.stats?.stats?.seasonBTTSPercentage_overall || 0}%`,
        className: 'w-1/4',
      },
      home: {
        value: `${teamData?.stats?.stats?.seasonBTTSPercentage_home || 0}%`,
        className: isHome
          ? 'w-1/4 dark:bg-[#044009] bg-[#76CFA6] text-[#105B16] dark:text-dark-win text-white'
          : 'w-1/4',
      },
      away: {
        value: `${teamData?.stats?.stats?.seasonBTTSPercentage_away || 0}%`,
        className: !isHome
          ? 'w-1/4 dark:bg-[#044009] bg-[#76CFA6] text-[#105B16] dark:text-dark-win text-white'
          : 'w-1/4',
      },
    },
    {
      label: i18n.statsLabel.cleanSheets,
      overall: {
        value: `${teamData?.stats?.stats?.seasonCSPercentage_overall || 0}%`,
        className: 'w-1/4',
      },
      home: {
        value: `${teamData?.stats?.stats?.seasonCSPercentage_home || 0}%`,
        className: isHome
          ? 'w-1/4 dark:bg-[#044009] bg-[#76CFA6] text-[#105B16] dark:text-dark-win text-white'
          : 'w-1/4',
      },
      away: {
        value: `${teamData?.stats?.stats?.seasonCSPercentage_away || 0}%`,
        className: !isHome
          ? 'w-1/4 dark:bg-[#044009] bg-[#76CFA6] text-[#105B16] dark:text-dark-win text-white'
          : 'w-1/4',
      },
    },
    {
      label: i18n.footy_stats.fts,
      overall: {
        value: `${teamData?.stats?.stats?.seasonFTSPercentage_overall || 0}%`,
        className: 'w-1/4',
      },
      home: {
        value: `${teamData?.stats?.stats?.seasonFTSPercentage_home || 0}%`,
        className: isHome
          ? 'w-1/4 dark:bg-[#044009] bg-[#76CFA6] text-[#105B16] dark:text-dark-win text-white'
          : 'w-1/4',
      },
      away: {
        value: `${teamData?.stats?.stats?.seasonFTSPercentage_away || 0}%`,
        className: !isHome
          ? 'w-1/4 dark:bg-[#044009] bg-[#76CFA6] text-[#105B16] dark:text-dark-win text-white'
          : 'w-1/4',
      },
    },
    {
      label: i18n.footy_stats.xg,
      overall: {
        value: teamData?.stats?.stats?.xg_for_avg_overall || 0,
        className: 'w-1/4',
      },
      home: {
        value: teamData?.stats?.stats?.xg_for_avg_home || 0,
        className: isHome
          ? 'w-1/4 dark:bg-[#044009] bg-[#76CFA6] text-[#105B16] dark:text-dark-win text-white'
          : 'w-1/4',
      },
      away: {
        value: teamData?.stats?.stats?.xg_for_avg_away || 0,
        className: !isHome
          ? 'w-1/4 dark:bg-[#044009] bg-[#76CFA6] text-[#105B16] dark:text-dark-win text-white'
          : 'w-1/4',
      },
    },
    {
      label: i18n.footy_stats.xg_against,
      overall: {
        value: teamData?.stats?.stats?.xg_against_avg_overall || 0,
        className: 'w-1/4',
      },
      home: {
        value: teamData?.stats?.stats?.xg_against_avg_home || 0,
        className: isHome
          ? 'w-1/4 dark:bg-[#044009] bg-[#76CFA6] text-[#105B16] dark:text-dark-win text-white'
          : 'w-1/4',
      },
      away: {
        value: teamData?.stats?.stats?.xg_against_avg_away || 0,
        className: !isHome
          ? 'w-1/4 dark:bg-[#044009] bg-[#76CFA6] text-[#105B16] dark:text-dark-win text-white'
          : 'w-1/4',
      },
    },
  ];
};

export const getFullTimeGoalsScoredData = (
  data: FullTimeScoredStats,
  i18n: any
) => {
  return [
    {
      label: i18n.footy_stats.over_05,
      home: {
        value: `${data?.seasonScoredOver05PercentageHome || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.seasonScoredOver05PercentageHome || 0,
          {
            type: 0,
            customRange: [
              [0, 49],
              [50, 69],
              [70, 79],
              [80, 100],
            ],
          }
        )}`,
      },
      away: {
        value: `${data?.seasonScoredOver05PercentageAway || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.seasonScoredOver05PercentageAway || 0,
          {
            type: 0,
            customRange: [
              [0, 49],
              [50, 69],
              [70, 79],
              [80, 100],
            ],
          }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_15,
      home: {
        value: `${data?.seasonScoredOver15PercentageHome || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.seasonScoredOver15PercentageHome || 0,
          {
            type: 0,
            customRange: [
              [0, 49],
              [50, 69],
              [70, 79],
              [80, 100],
            ],
          }
        )}`,
      },
      away: {
        value: `${data?.seasonScoredOver15PercentageAway || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.seasonScoredOver15PercentageAway || 0,
          {
            type: 0,
            customRange: [
              [0, 49],
              [50, 69],
              [70, 79],
              [80, 100],
            ],
          }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_25,
      home: {
        value: `${data?.seasonScoredOver25PercentageHome || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.seasonScoredOver25PercentageHome || 0,
          {
            type: 0,
            customRange: [
              [0, 49],
              [50, 69],
              [70, 79],
              [80, 100],
            ],
          }
        )}`,
      },
      away: {
        value: `${data?.seasonScoredOver25PercentageAway || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.seasonScoredOver25PercentageAway || 0,
          {
            type: 0,
            customRange: [
              [0, 49],
              [50, 69],
              [70, 79],
              [80, 100],
            ],
          }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_35,
      home: {
        value: `${data?.seasonScoredOver35PercentageHome || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.seasonScoredOver35PercentageHome || 0,
          {
            type: 0,
            customRange: [
              [0, 49],
              [50, 69],
              [70, 79],
              [80, 100],
            ],
          }
        )}`,
      },
      away: {
        value: `${data?.seasonScoredOver35PercentageAway || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.seasonScoredOver35PercentageAway || 0,
          {
            type: 0,
            customRange: [
              [0, 49],
              [50, 69],
              [70, 79],
              [80, 100],
            ],
          }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.failed_to_score,
      home: {
        value: `${data?.seasonFTSPercentageHome || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.seasonFTSPercentageHome || 0,
          {
            type: 0,
            customRange: [
              [0, 49],
              [50, 69],
              [70, 79],
              [80, 100],
            ],
          }
        )}`,
      },
      away: {
        value: `${data?.seasonFTSPercentageAway || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.seasonFTSPercentageAway || 0,
          {
            type: 0,
            customRange: [
              [0, 49],
              [50, 69],
              [70, 79],
              [80, 100],
            ],
          }
        )}`,
      },
    },
  ];
};

export const getFullTimeGoalsConcededData = (
  data: FullTimeConcededStats,
  i18n: any
) => {
  return [
    {
      label: i18n.footy_stats.over_05,
      home: {
        value: `${data?.seasonConcededOver05PercentageHome || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.seasonConcededOver05PercentageHome || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.seasonConcededOver05PercentageAway || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.seasonConcededOver05PercentageAway || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_15,
      home: {
        value: `${data?.seasonConcededOver15PercentageHome || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.seasonConcededOver15PercentageHome || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.seasonConcededOver15PercentageAway || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.seasonConcededOver15PercentageAway || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_25,
      home: {
        value: `${data?.seasonConcededOver25PercentageHome || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.seasonConcededOver25PercentageHome || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.seasonConcededOver25PercentageAway || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.seasonConcededOver25PercentageAway || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_35,
      home: {
        value: `${data?.seasonConcededOver35PercentageHome || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.seasonConcededOver35PercentageHome || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.seasonConcededOver35PercentageAway || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.seasonConcededOver25PercentageAway || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.statsLabel.cleanSheet,
      home: {
        value: `${data?.seasonCSPercentageHome || 0}%`,
        className: `w-1/3 ${getContentColor(data?.seasonCSPercentageHome || 0, {
          type: 2,
        })}`,
      },
      away: {
        value: `${data?.seasonCSPercentageAway || 0}%`,
        className: `w-1/3 ${getContentColor(data?.seasonCSPercentageAway || 0, {
          type: 2,
        })}`,
      },
    },
  ];
};

const getColorIndex = (value: number, ranges: number[][]) => {
  for (let i = 0; i < ranges.length; i++) {
    if (value >= ranges[i][0] && value <= ranges[i][1]) {
      return ranges.length - i;
    }
  }
  return 0;
};

export const getContentColor = (
  value: number,
  options: { type: number; customRange?: [number, number][] } = {
    type: 0,
    customRange: [],
  } // 0: custom rule, 1: number, 2: percentage 1, 3: percentage 2, 4: percentage 3, 5: percentage 4, 6: number 2
) => {
  const { type } = options;
  let colorIndex = 0;

  if (type === 1) {
    colorIndex = getColorIndex(value, [
      [0, 0.499],
      [0.5, 0.999],
      [1, 2],
      [2, Infinity],
    ]);
  } else if (type === 2) {
    colorIndex = getColorIndex(value, [
      [0, 30.999],
      [31, 50.999],
      [51, 80.999],
      [81, 100],
    ]);
  } else if (type === 3) {
    colorIndex = getColorIndex(value, [
      [0, 4],
      [5, 13],
      [14, 20],
      [21, 100],
    ]);
  } else if (type === 4) {
    colorIndex = getColorIndex(value, [
      [0, 9],
      [10, 19],
      [20, 29],
      [30, 100],
    ]);
  } else if (type === 5) {
    colorIndex = getColorIndex(value, [
      [0, 29],
      [30, 49],
      [50, 59],
      [60, Infinity],
    ]);
  } else if (type === 6) {
    colorIndex = getColorIndex(value, [
      [0, 2.99],
      [3, 5.99],
      [6, 7.99],
      [8, Infinity],
    ]);
  } else if (type === 7) {
    colorIndex = getColorIndex(value, [
      [0, 24],
      [25, 40],
      [41, 50],
      [51, 100],
    ]);
  } else if (type === 0) {
    colorIndex = getColorIndex(value, options.customRange || []);
  }

  const colorClasses = [
    '',
    'dark:bg-[#044009] dark:text-dark-win text-[#105B16] bg-[#76CFA6]',
    'dark:bg-[#248257] bg-[#A1DEC2] dark:text-dark-win text-[#248257]',
    'dark:bg-[#674C00] bg-[#FEF8E6] dark:text-match-score text-[#AF8100]',
    'dark:bg-[#5D0F00] text-[#E55033] bg-[#FCE9E6]',
  ];

  return colorClasses[colorIndex];
};

export const getHalfGoalsScoredData = (
  data: HalfTimeScoredStats,
  i18n: any
) => {
  return [
    {
      label: i18n.footy_stats.scored_in_both_halves,
      home: {
        value: `${data?.scoredBothHalvesPercentageHome || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.scoredBothHalvesPercentageHome || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.scoredBothHalvesPercentageAway || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.scoredBothHalvesPercentageAway || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.scored_average_1h,
      home: {
        value: data?.scoredAVGHTHome || 0,
        className: `w-1/3 ${getContentColor(data?.scoredAVGHTHome || 0, {
          type: 1,
        })}`,
      },
      away: {
        value: data?.scoredAVGHTAway || 0,
        className: `w-1/3 ${getContentColor(data?.scoredAVGHTAway || 0, {
          type: 1,
        })}`,
      },
    },
    {
      label: i18n.footy_stats.scored_average_2h,
      home: {
        value: data?.scored2hgAvgHome || 0,
        className: `w-1/3 ${getContentColor(data?.scored2hgAvgHome || 0, {
          type: 1,
        })}`,
      },
      away: {
        value: data?.scored2hgAvgAway || 0,
        className: `w-1/3 ${getContentColor(data?.scored2hgAvgAway || 0, {
          type: 1,
        })}`,
      },
    },
  ];
};

export const getHalfGoalsConcededData = (
  data: HalfTimeConcededStats,
  i18n: any
) => {
  return [
    {
      label: i18n.footy_stats.avg_1h_conceded,
      home: {
        value: data?.concededAVGHTHome || 0,
        className: `w-1/3 ${getContentColor(data?.concededAVGHTHome || 0, {
          type: 1,
        })}`,
      },
      away: {
        value: data?.concededAVGHTAway || 0,
        className: `w-1/3 ${getContentColor(data?.concededAVGHTAway || 0, {
          type: 1,
        })}`,
      },
    },
    {
      label: i18n.footy_stats.avg_2h_conceded,
      home: {
        value: data?.conceded2hgAvgHome || 0,
        className: `w-1/3 ${getContentColor(data?.conceded2hgAvgHome || 0, {
          type: 1,
        })}`,
      },
      away: {
        value: data?.conceded2hgAvgAway || 0,
        className: `w-1/3 ${getContentColor(data?.conceded2hgAvgAway || 0, {
          type: 1,
        })}`,
      },
    },
    {
      label: i18n.footy_stats.clean_1h,
      home: {
        value: `${data?.seasonCSPercentageHTHome || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.seasonCSPercentageHTHome || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.seasonCSPercentageHTAway || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.seasonCSPercentageHTAway || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.clean_2h,
      home: {
        value: `${data?.cs2hgPercentageHome || 0}%`,
        className: `w-1/3 ${getContentColor(data?.cs2hgPercentageHome || 0, {
          type: 2,
        })}`,
      },
      away: {
        value: `${data?.cs2hgPercentageAway || 0}%`,
        className: `w-1/3 ${getContentColor(data?.cs2hgPercentageAway || 0, {
          type: 2,
        })}`,
      },
    },
  ];
};

export const getOverTotalsData = (data: OverPercentageStats, i18n: any) => {
  return [
    {
      label: i18n.footy_stats.over_05,
      home: {
        value: `${data?.seasonOver05Percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonOver05Percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.seasonOver05Percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonOver05Percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.o05Potential || 0}%`,
        className: `w-1/4 ${getContentColor(data?.o05Potential, { type: 2 })}`,
      },
    },
    {
      label: i18n.footy_stats.over_15,
      home: {
        value: `${data?.seasonOver15Percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonOver15Percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.seasonOver15Percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonOver15Percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.o15Potential || 0}%`,
        className: `w-1/4 ${getContentColor(data?.o15Potential, { type: 2 })}`,
      },
    },
    {
      label: i18n.footy_stats.over_25,
      home: {
        value: `${data?.seasonOver25Percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonOver25Percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.seasonOver25Percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonOver25Percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.o25Potential || 0}%`,
        className: `w-1/4 ${getContentColor(data?.o25Potential, { type: 2 })}`,
      },
    },
    {
      label: i18n.footy_stats.over_35,
      home: {
        value: `${data?.seasonOver35Percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonOver35Percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.seasonOver35Percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonOver35Percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.o35Potential || 0}%`,
        className: `w-1/4 ${getContentColor(data?.o35Potential, { type: 2 })}`,
      },
    },
    {
      label: i18n.footy_stats.over_45,
      home: {
        value: `${data?.seasonOver45Percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonOver45Percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.seasonOver45Percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonOver45Percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.o45Potential || 0}%`,
        className: `w-1/4 ${getContentColor(data?.o45Potential, { type: 2 })}`,
      },
    },
  ];
};

export const getOverHalfData = (data: OverHTPercentageStats, i18n: any) => {
  return [
    {
      label: i18n.footy_stats.over_1h_05,
      home: {
        value: `${data?.seasonOver05PercentageHT_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonOver05PercentageHT_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.seasonOver05PercentageHT_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonOver05PercentageHT_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.o05HT_potential || 0}%`,
        className: `w-1/4 ${getContentColor(data?.o05HT_potential, {
          type: 2,
        })}`,
      },
    },
    {
      label: i18n.footy_stats.over_1h_15,
      home: {
        value: `${data?.seasonOver15PercentageHT_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonOver15PercentageHT_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.seasonOver15PercentageHT_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonOver15PercentageHT_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.o15HT_potential || 0}%`,
        className: `w-1/4 ${getContentColor(data?.o15HT_potential, {
          type: 2,
        })}`,
      },
    },
    {
      label: i18n.footy_stats.over_1h_25,
      home: {
        value: `${data?.seasonOver25PercentageHT_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonOver25PercentageHT_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.seasonOver25PercentageHT_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonOver25PercentageHT_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.o25HT_potential || 0}%`,
        className: `w-1/4 ${getContentColor(data?.o25HT_potential, {
          type: 2,
        })}`,
      },
    },
    {
      label: i18n.footy_stats.over_2h_05,
      home: {
        value: `${data?.over05_2hg_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over05_2hg_percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over05_2hg_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over05_2hg_percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.o05_2H_potential || 0}%`,
        className: `w-1/4 ${getContentColor(data?.o05_2H_potential, {
          type: 2,
        })}`,
      },
    },
    {
      label: i18n.footy_stats.over_2h_15,
      home: {
        value: `${data?.over15_2hg_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over15_2hg_percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over15_2hg_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over15_2hg_percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.o15_2H_potential || 0}%`,
        className: `w-1/4 ${getContentColor(data?.o15_2H_potential, {
          type: 2,
        })}`,
      },
    },
    {
      label: i18n.footy_stats.over_2h_25,
      home: {
        value: `${data?.over25_2hg_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over25_2hg_percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over25_2hg_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over25_2hg_percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.o25_2H_potential || 0}%`,
        className: `w-1/4 ${getContentColor(data?.o25_2H_potential, {
          type: 2,
        })}`,
      },
    },
  ];
};

export const getUnderTotalsData = (data: UnderPercentageStats, i18n: any) => {
  return [
    {
      label: i18n.footy_stats.under_05,
      home: {
        value: `${data?.seasonUnder05Percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonUnder05Percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.seasonUnder05Percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonUnder05Percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.u05Potential || 0}%`,
        className: `w-1/4 ${getContentColor(data?.u05Potential, { type: 2 })}`,
      },
    },
    {
      label: i18n.footy_stats.under_15,
      home: {
        value: `${data?.seasonUnder15Percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonUnder15Percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.seasonUnder15Percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonUnder15Percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.u15Potential || 0}%`,
        className: `w-1/4 ${getContentColor(data?.u15Potential, { type: 2 })}`,
      },
    },
    {
      label: i18n.footy_stats.under_25,
      home: {
        value: `${data?.seasonUnder25Percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonUnder25Percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.seasonUnder25Percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonUnder25Percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.u25Potential || 0}%`,
        className: `w-1/4 ${getContentColor(data?.u25Potential, { type: 2 })}`,
      },
    },
    {
      label: i18n.footy_stats.under_35,
      home: {
        value: `${data?.seasonUnder35Percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonUnder35Percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.seasonUnder35Percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonUnder35Percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.u35Potential || 0}%`,
        className: `w-1/4 ${getContentColor(data?.u35Potential, { type: 2 })}`,
      },
    },
    {
      label: i18n.footy_stats.under_45,
      home: {
        value: `${data?.seasonUnder45Percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonUnder45Percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.seasonUnder45Percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.seasonUnder45Percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.u45Potential || 0}%`,
        className: `w-1/4 ${getContentColor(data?.u45Potential, { type: 2 })}`,
      },
    },
  ];
};

export const getUnderHalfData = (data: OverHTPercentageStats, i18n: any) => {
  return [
    {
      label: i18n.footy_stats.under_1h_05,
      home: {
        value: `${100 - (data?.seasonOver05PercentageHT_home || 0)}%`,
        className: `w-1/4 ${getContentColor(
          100 - (data?.seasonOver05PercentageHT_home || 0),
          { type: 2 }
        )}`,
      },
      away: {
        value: `${100 - (data?.seasonOver05PercentageHT_away || 0)}%`,
        className: `w-1/4 ${getContentColor(
          100 - (data?.seasonOver05PercentageHT_away || 0),
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${100 - (data?.o05HT_potential || 0)}%`,
        className: `w-1/4 ${getContentColor(
          100 - (data?.o05HT_potential || 0),
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.under_1h_15,
      home: {
        value: `${100 - (data?.seasonOver15PercentageHT_home || 0)}%`,
        className: `w-1/4 ${getContentColor(
          100 - (data?.seasonOver15PercentageHT_home || 0),
          { type: 2 }
        )}`,
      },
      away: {
        value: `${100 - (data?.seasonOver15PercentageHT_away || 0)}%`,
        className: `w-1/4 ${getContentColor(
          100 - (data?.seasonOver15PercentageHT_away || 0),
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${100 - (data?.o15HT_potential || 0)}%`,
        className: `w-1/4 ${getContentColor(
          100 - (data?.o15HT_potential || 0),
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.under_1h_25,
      home: {
        value: `${100 - (data?.seasonOver25PercentageHT_home || 0)}%`,
        className: `w-1/4 ${getContentColor(
          100 - (data?.seasonOver25PercentageHT_home || 0),
          { type: 2 }
        )}`,
      },
      away: {
        value: `${100 - (data?.seasonOver25PercentageHT_away || 0)}%`,
        className: `w-1/4 ${getContentColor(
          100 - (data?.seasonOver25PercentageHT_away || 0),
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${100 - (data?.o25HT_potential || 0)}%`,
        className: `w-1/4 ${getContentColor(
          100 - (data?.o25HT_potential || 0),
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.under_2h_05,
      home: {
        value: `${100 - (data?.over05_2hg_percentage_home || 0)}%`,
        className: `w-1/4 ${getContentColor(
          100 - (data?.over05_2hg_percentage_home || 0),
          { type: 2 }
        )}`,
      },
      away: {
        value: `${100 - (data?.over05_2hg_percentage_away || 0)}%`,
        className: `w-1/4 ${getContentColor(
          100 - (data?.over05_2hg_percentage_away || 0),
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${100 - (data?.o05_2H_potential || 0)}%`,
        className: `w-1/4 ${getContentColor(
          100 - (data?.o05_2H_potential || 0),
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.under_2h_15,
      home: {
        value: `${100 - (data?.over15_2hg_percentage_home || 0)}%`,
        className: `w-1/4 ${getContentColor(
          100 - (data?.over15_2hg_percentage_home || 0),
          { type: 2 }
        )}`,
      },
      away: {
        value: `${100 - (data?.over15_2hg_percentage_away || 0)}%`,
        className: `w-1/4 ${getContentColor(
          100 - (data?.over15_2hg_percentage_away || 0),
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${100 - (data?.o15_2H_potential || 0)}%`,
        className: `w-1/4 ${getContentColor(
          100 - (data?.o15_2H_potential || 0),
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.under_2h_25,
      home: {
        value: `${100 - (data?.over25_2hg_percentage_home || 0)}%`,
        className: `w-1/4 ${getContentColor(
          100 - (data?.over25_2hg_percentage_home || 0),
          { type: 2 }
        )}`,
      },
      away: {
        value: `${100 - (data?.over25_2hg_percentage_away || 0)}%`,
        className: `w-1/4 ${getContentColor(
          100 - (data?.over25_2hg_percentage_away || 0),
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${100 - (data?.o25_2H_potential || 0)}%`,
        className: `w-1/4 ${getContentColor(
          100 - (data?.o25_2H_potential || 0),
          { type: 2 }
        )}`,
      },
    },
  ];
};

export const getTotalCornerData = (data: CornersPercentageStats, i18n: any) => {
  return [
    {
      label: i18n.footy_stats.over_65,
      home: {
        value: `${data?.over65CornersPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over65CornersPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over65CornersPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over65CornersPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over65CornersPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over65CornersPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_75,
      home: {
        value: `${data?.over75CornersPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over75CornersPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over75CornersPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over75CornersPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over75CornersPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over75CornersPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_85,
      home: {
        value: `${data?.over85CornersPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over85CornersPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over85CornersPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over85CornersPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over85CornersPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over85CornersPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_95,
      home: {
        value: `${data?.over95CornersPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over95CornersPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over95CornersPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over95CornersPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over95CornersPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over95CornersPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_105,
      home: {
        value: `${data?.over105CornersPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over105CornersPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over105CornersPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over105CornersPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over105CornersPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over105CornersPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_115,
      home: {
        value: `${data?.over115CornersPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over115CornersPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over115CornersPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over115CornersPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over115CornersPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over115CornersPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_125,
      home: {
        value: `${data?.over125CornersPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over125CornersPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over125CornersPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over125CornersPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over125CornersPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over125CornersPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_135,
      home: {
        value: `${data?.over135CornersPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over135CornersPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over135CornersPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over135CornersPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over135CornersPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over135CornersPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_145,
      home: {
        value: `${data?.over145CornersPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over145CornersPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over145CornersPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over145CornersPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over145CornersPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over145CornersPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
  ];
};

export const getHalfTimeCornerData = (
  data: CornersHalfTimeStats,
  i18n: any
) => {
  return [
    {
      label: i18n.footy_stats.average_1h,
      home: {
        value: data?.corners_fh_avg_home || 0,
        className: `w-1/4 ${getContentColor(data?.corners_fh_avg_home || 0, {
          type: 1,
        })}`,
      },
      away: {
        value: data?.corners_fh_avg_away || 0,
        className: `w-1/4 ${getContentColor(data?.corners_fh_avg_away || 0, {
          type: 1,
        })}`,
      },
      avg: {
        value: data?.corners_fh_avg || 0,
        className: `w-1/4 ${getContentColor(data?.corners_fh_avg || 0, {
          type: 1,
        })}`,
      },
    },
    {
      label: i18n.footy_stats.over_4_1h,
      home: {
        value: `${data?.corners_fh_over4_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.corners_fh_over4_percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.corners_fh_over4_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.corners_fh_over4_percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.corners_fh_over4_percentage || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.corners_fh_over4_percentage || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_5_1h,
      home: {
        value: `${data?.corners_fh_over5_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.corners_fh_over5_percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.corners_fh_over5_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.corners_fh_over5_percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.corners_fh_over5_percentage || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.corners_fh_over5_percentage || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_6_1h,
      home: {
        value: `${data?.corners_fh_over6_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.corners_fh_over6_percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.corners_fh_over6_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.corners_fh_over6_percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.corners_fh_over6_percentage || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.corners_fh_over6_percentage || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.average_2h,
      home: {
        value: data?.corners_2h_avg_home || 0,
        className: `w-1/4 ${getContentColor(data?.corners_2h_avg_home || 0, {
          type: 1,
        })}`,
      },
      away: {
        value: data?.corners_2h_avg_away || 0,
        className: `w-1/4 ${getContentColor(data?.corners_2h_avg_away || 0, {
          type: 1,
        })}`,
      },
      avg: {
        value: data?.corners_2h_avg || 0,
        className: `w-1/4 ${getContentColor(data?.corners_2h_avg || 0, {
          type: 1,
        })}`,
      },
    },
    {
      label: i18n.footy_stats.over_4_2h,
      home: {
        value: `${data?.corners_2h_over4_home || 0}%`,
        className: `w-1/4 ${getContentColor(data?.corners_2h_over4_home || 0, {
          type: 2,
        })}`,
      },
      away: {
        value: `${data?.corners_2h_over4_away || 0}%`,
        className: `w-1/4 ${getContentColor(data?.corners_2h_over4_away || 0, {
          type: 2,
        })}`,
      },
      avg: {
        value: `${data?.corners_2h_over4_percentage || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.corners_2h_over4_percentage || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_5_2h,
      home: {
        value: `${data?.corners_2h_over5_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.corners_2h_over5_percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.corners_2h_over5_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.corners_2h_over5_percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.corners_2h_over5_percentage || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.corners_2h_over5_percentage || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_6_2h,
      home: {
        value: `${data?.corners_2h_over6_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.corners_2h_over6_percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.corners_2h_over6_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.corners_2h_over6_percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.corners_2h_over6_percentage || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.corners_2h_over6_percentage || 0,
          { type: 2 }
        )}`,
      },
    },
  ];
};

export const getCornersEarnedData = (data: CornersEarnedStats, i18n: any) => {
  return [
    {
      label: i18n.footy_stats.corners_earned,
      home: {
        value: data?.cornersAVG_home || 0,
        className: `w-1/4 ${getContentColor(data?.cornersAVG_home || 0, {
          type: 1,
        })}`,
      },
      away: {
        value: data?.cornersAVG_away || 0,
        className: `w-1/4 ${getContentColor(data?.cornersAVG_away || 0, {
          type: 1,
        })}`,
      },
      avg: {
        value: data?.cornersAVG_overall || 0,
        className: `w-1/4 ${getContentColor(data?.cornersAVG_overall || 0, {
          type: 1,
        })}`,
      },
    },
    {
      label: i18n.footy_stats.over_25,
      home: {
        value: `${data?.over25CornersForPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over25CornersForPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over25CornersForPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over25CornersForPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over25CornersForPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over25CornersForPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_35,
      home: {
        value: `${data?.over35CornersForPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over35CornersForPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over35CornersForPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over35CornersForPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over35CornersForPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over35CornersForPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_45,
      home: {
        value: `${data?.over45CornersForPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over45CornersForPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over45CornersForPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over45CornersForPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over45CornersForPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over45CornersForPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_55,
      home: {
        value: `${data?.over55CornersForPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over55CornersForPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over55CornersForPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over55CornersForPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over55CornersForPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over55CornersForPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
  ];
};

export const getCornersAgainstData = (data: CornersAgainstStats, i18n: any) => {
  return [
    {
      label: i18n.statsLabel.cornersAgainst,
      home: {
        value: data?.cornersAgainstAVG_home || 0,
        className: `w-1/4 ${getContentColor(data?.cornersAgainstAVG_home || 0, {
          type: 1,
        })}`,
      },
      away: {
        value: data?.cornersAgainstAVG_away || 0,
        className: `w-1/4 ${getContentColor(data?.cornersAgainstAVG_away || 0, {
          type: 1,
        })}`,
      },
      avg: {
        value: data?.cornersAgainstAVG_overall || 0,
        className: `w-1/4 ${getContentColor(
          data?.cornersAgainstAVG_overall || 0,
          { type: 1 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_25,
      home: {
        value: `${data?.over25CornersAgainstPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over25CornersAgainstPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over25CornersAgainstPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over25CornersAgainstPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over25CornersAgainstPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over25CornersAgainstPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_35,
      home: {
        value: `${data?.over35CornersAgainstPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over35CornersAgainstPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over35CornersAgainstPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over35CornersAgainstPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over35CornersAgainstPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over35CornersAgainstPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_45,
      home: {
        value: `${data?.over45CornersAgainstPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over45CornersAgainstPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over45CornersAgainstPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over45CornersAgainstPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over45CornersAgainstPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over45CornersAgainstPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_55,
      home: {
        value: `${data?.over55CornersAgainstPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over55CornersAgainstPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over55CornersAgainstPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over55CornersAgainstPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over55CornersAgainstPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over55CornersAgainstPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
  ];
};

export const getMatchCardData = (data: TotalCardsStats, i18n: any) => {
  return [
    {
      label: i18n.footy_stats.match_cards_avg,
      home: {
        value: data?.cards_total_avg_home || 0,
        className: `w-1/4 ${getContentColor(data?.cards_total_avg_home || 0, {
          type: 1,
        })}`,
      },
      away: {
        value: data?.cards_total_avg_away || 0,
        className: `w-1/4 ${getContentColor(data?.cards_total_avg_away || 0, {
          type: 1,
        })}`,
      },
      avg: {
        value: data?.cards_total_avg_overall || 0,
        className: `w-1/4 ${getContentColor(
          data?.cards_total_avg_overall || 0,
          {
            type: 1,
          }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_05,
      home: {
        value: `${data?.over05CardsPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over05CardsPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over05CardsPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over05CardsPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over05CardsPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over05CardsPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_15,
      home: {
        value: `${data?.over15CardsPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over15CardsPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over15CardsPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over15CardsPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over15CardsPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over15CardsPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_25,
      home: {
        value: `${data?.over25CardsPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over25CardsPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over25CardsPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over25CardsPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over25CardsPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over25CardsPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_35,
      home: {
        value: `${data?.over35CardsPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over35CardsPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over35CardsPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over35CardsPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over35CardsPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over35CardsPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_45,
      home: {
        value: `${data?.over45CardsPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over45CardsPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over45CardsPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over45CardsPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over45CardsPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over45CardsPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_55,
      home: {
        value: `${data?.over55CardsPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over55CardsPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over55CardsPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over55CardsPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over55CardsPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over55CardsPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_65,
      home: {
        value: `${data?.over65CardsPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over65CardsPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over65CardsPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over65CardsPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over65CardsPercentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over65CardsPercentage_overall || 0,
          { type: 2 }
        )}`,
      },
    },
  ];
};

export const getCardedData = (data: CardedStats, i18n: any) => {
  return [
    {
      label: i18n.footy_stats.carded_match,
      home: {
        value: data?.cards_for_avg_home || 0,
        className: `w-1/4 ${getContentColor(data?.cards_for_avg_home || 0, {
          type: 1,
        })}`,
      },
      away: {
        value: data?.cards_for_avg_away || 0,
        className: `w-1/4 ${getContentColor(data?.cards_for_avg_away || 0, {
          type: 1,
        })}`,
      },
      avg: {
        value: data?.cards_for_avg || 0,
        className: `w-1/4 ${getContentColor(data?.cards_for_avg || 0, {
          type: 1,
        })}`,
      },
    },
    {
      label: i18n.footy_stats.over_05,
      home: {
        value: `${data?.over05CardsForPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over05CardsForPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over05CardsForPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over05CardsForPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over05CardsForPercentage || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over05CardsForPercentage || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_15,
      home: {
        value: `${data?.over15CardsForPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over15CardsForPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over15CardsForPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over15CardsForPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over15CardsForPercentage || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over15CardsForPercentage || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_25,
      home: {
        value: `${data?.over25CardsForPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over25CardsForPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over25CardsForPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over25CardsForPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over25CardsForPercentage || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over25CardsForPercentage || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_35,
      home: {
        value: `${data?.over35CardsForPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over35CardsForPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over35CardsForPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over35CardsForPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over35CardsForPercentage || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over35CardsForPercentage || 0,
          { type: 2 }
        )}`,
      },
    },
  ];
};

export const getOpponentCardsData = (data: OpponentCardsStats, i18n: any) => {
  return [
    {
      label: i18n.footy_stats.opponent_average,
      home: {
        value: data?.cards_against_avg_home || 0,
        className: `w-1/4 ${getContentColor(data?.cards_against_avg_home || 0, {
          type: 1,
        })}`,
      },
      away: {
        value: data?.cards_against_avg_away || 0,
        className: `w-1/4 ${getContentColor(data?.cards_against_avg_away || 0, {
          type: 1,
        })}`,
      },
      avg: {
        value: data?.cards_against_avg || 0,
        className: `w-1/4 ${getContentColor(data?.cards_against_avg || 0, {
          type: 1,
        })}`,
      },
    },
    {
      label: i18n.footy_stats.over_05,
      home: {
        value: `${data?.over05CardsAgainstPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over05CardsAgainstPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over05CardsAgainstPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over05CardsAgainstPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over05CardsAgainstPercentage || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over05CardsAgainstPercentage || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_15,
      home: {
        value: `${data?.over15CardsAgainstPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over15CardsAgainstPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over15CardsAgainstPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over15CardsAgainstPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over15CardsAgainstPercentage || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over15CardsAgainstPercentage || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_25,
      home: {
        value: `${data?.over25CardsAgainstPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over25CardsAgainstPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over25CardsAgainstPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over25CardsAgainstPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over25CardsAgainstPercentage || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over25CardsAgainstPercentage || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.over_35,
      home: {
        value: `${data?.over35CardsAgainstPercentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over35CardsAgainstPercentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.over35CardsAgainstPercentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over35CardsAgainstPercentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.over35CardsAgainstPercentage || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.over35CardsAgainstPercentage || 0,
          { type: 2 }
        )}`,
      },
    },
  ];
};

export const getFirstSecondCardsData = (
  data: firstSecondHalfCardsStats,
  i18n: any
) => {
  return [
    {
      label: i18n.footy_stats['1h_match_cards_avg'],
      home: {
        value: data?.fh_cards_total_avg_home || 0,
        className: `w-1/4 ${getContentColor(
          data?.fh_cards_total_avg_home || 0,
          { type: 1 }
        )}`,
      },
      away: {
        value: data?.fh_cards_total_avg_away || 0,
        className: `w-1/4 ${getContentColor(
          data?.fh_cards_total_avg_away || 0,
          { type: 1 }
        )}`,
      },
      avg: {
        value: data?.fh_cards_total_avg || 0,
        className: `w-1/4 ${getContentColor(data?.fh_cards_total_avg || 0, {
          type: 1,
        })}`,
      },
    },
    {
      label: i18n.footy_stats['2h_match_cards_avg'],
      home: {
        value: data?.h2_cards_total_avg_home || 0,
        className: `w-1/4 ${getContentColor(
          data?.h2_cards_total_avg_home || 0,
          { type: 1 }
        )}`,
      },
      away: {
        value: data?.h2_cards_total_avg_away || 0,
        className: `w-1/4 ${getContentColor(
          data?.h2_cards_total_avg_away || 0,
          { type: 1 }
        )}`,
      },
      avg: {
        value: data?.h2_cards_total_avg || 0,
        className: `w-1/4 ${getContentColor(data?.h2_cards_total_avg || 0, {
          type: 1,
        })}`,
      },
    },
    {
      label: i18n.footy_stats['1h_carded_avg'],
      home: {
        value: data?.fh_cards_for_avg_home || 0,
        className: `w-1/4 ${getContentColor(data?.fh_cards_for_avg_home || 0, {
          type: 1,
        })}`,
      },
      away: {
        value: data?.fh_cards_for_avg_away || 0,
        className: `w-1/4 ${getContentColor(data?.fh_cards_for_avg_away || 0, {
          type: 1,
        })}`,
      },
      avg: {
        value: data?.fh_cards_for_avg || 0,
        className: `w-1/4 ${getContentColor(data?.fh_cards_for_avg || 0, {
          type: 1,
        })}`,
      },
    },
    {
      label: i18n.footy_stats['2h_carded_avg'],
      home: {
        value: data?.h2_cards_for_avg_home || 0,
        className: `w-1/4 ${getContentColor(data?.h2_cards_for_avg_home || 0, {
          type: 1,
        })}`,
      },
      away: {
        value: data?.h2_cards_for_avg_away || 0,
        className: `w-1/4 ${getContentColor(data?.h2_cards_for_avg_away || 0, {
          type: 1,
        })}`,
      },
      avg: {
        value: data?.h2_cards_for_avg || 0,
        className: `w-1/4 ${getContentColor(data?.h2_cards_for_avg || 0, {
          type: 1,
        })}`,
      },
    },
  ];
};

export const getOver05_3CardsData = (data: Over_05_3CardsStats, i18n: any) => {
  return [
    {
      label: i18n.footy_stats['1h_under_2'],
      home: {
        value: `${data?.fh_total_cards_under2_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.fh_total_cards_under2_percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.fh_total_cards_under2_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.fh_total_cards_under2_percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.fh_total_cards_under2_percentage || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.fh_total_cards_under2_percentage || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['2h_under_2'],
      home: {
        value: `${data?.h2_total_cards_under2_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.h2_total_cards_under2_percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.h2_total_cards_under2_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.h2_total_cards_under2_percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.h2_total_cards_under2_percentage || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.h2_total_cards_under2_percentage || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['1h_2_to_3_cards'],
      home: {
        value: `${data?.fh_total_cards_2to3_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.fh_total_cards_2to3_percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.fh_total_cards_2to3_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.fh_total_cards_2to3_percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.fh_total_cards_2to3_percentage || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.fh_total_cards_2to3_percentage || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['2h_2_to_3_cards'],
      home: {
        value: `${data?.h2_total_cards_2to3_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.h2_total_cards_2to3_percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.h2_total_cards_2to3_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.h2_total_cards_2to3_percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.h2_total_cards_2to3_percentage || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.h2_total_cards_2to3_percentage || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['1h_over_3'],
      home: {
        value: `${data?.fh_total_cards_over3_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.fh_total_cards_over3_percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.fh_total_cards_over3_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.fh_total_cards_over3_percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.fh_total_cards_over3_percentage || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.fh_total_cards_over3_percentage || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['2h_over_3'],
      home: {
        value: `${data?.h2_total_cards_over3_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.h2_total_cards_over3_percentage_home || 0,
          { type: 2 }
        )}`,
      },
      away: {
        value: `${data?.h2_total_cards_over3_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.h2_total_cards_over3_percentage_away || 0,
          { type: 2 }
        )}`,
      },
      avg: {
        value: `${data?.h2_total_cards_over3_percentage || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.h2_total_cards_over3_percentage || 0,
          { type: 2 }
        )}`,
      },
    },
  ];
};

export const getHalfFormData = (data: HalfFormStats, i18n: any) => {
  return [
    {
      label: i18n.footy_stats.win_percent_1st_half,
      home: {
        value: `${data?.leadingAtHTPercentage_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.leadingAtHTPercentage_home || 0,
          { type: 7 }
        )}`,
      },
      away: {
        value: `${data?.leadingAtHTPercentage_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.leadingAtHTPercentage_away || 0,
          { type: 7 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.win_percent_2nd_half,
      home: {
        value: `${data?.wins_2hg_percentage_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.wins_2hg_percentage_home || 0,
          { type: 7 }
        )}`,
      },
      away: {
        value: `${data?.wins_2hg_percentage_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.wins_2hg_percentage_away || 0,
          { type: 2 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.draw_percent_1st_half,
      home: {
        value: `${data?.drawingAtHTPercentage_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.drawingAtHTPercentage_home || 0,
          { type: 7 }
        )}`,
      },
      away: {
        value: `${data?.drawingAtHTPercentage_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.drawingAtHTPercentage_away || 0,
          { type: 7 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.draw_percent_2nd_half,
      home: {
        value: `${data?.draws_2hg_percentage_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.draws_2hg_percentage_home || 0,
          { type: 7 }
        )}`,
      },
      away: {
        value: `${data?.draws_2hg_percentage_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.draws_2hg_percentage_away || 0,
          { type: 7 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.loss_percent_1st_half,
      home: {
        value: `${data?.trailingAtHTPercentage_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.trailingAtHTPercentage_home || 0,
          { type: 7 }
        )}`,
      },
      away: {
        value: `${data?.trailingAtHTPercentage_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.trailingAtHTPercentage_away || 0,
          { type: 7 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.loss_percent_2nd_half,
      home: {
        value: `${data?.losses_2hg_percentage_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.losses_2hg_percentage_home || 0,
          { type: 7 }
        )}`,
      },
      away: {
        value: `${data?.losses_2hg_percentage_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.losses_2hg_percentage_away || 0,
          { type: 7 }
        )}`,
      },
    },
  ];
};

export const getTotalGoalsBy10Minutes = (
  data: TotalGoalsBy10Minutes,
  i18n: any
) => {
  return [
    {
      label: i18n.footy_stats['0_10_min'],
      home: {
        value: `${data?.goals_all_min_0_to_10_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_0_to_10_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_all_min_0_to_10_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_0_to_10_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['11_20_min'],
      home: {
        value: `${data?.goals_all_min_11_to_20_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_11_to_20_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_all_min_11_to_20_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_11_to_20_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['21_30_min'],
      home: {
        value: `${data?.goals_all_min_21_to_30_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_21_to_30_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_all_min_21_to_30_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_21_to_30_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['31_40_min'],
      home: {
        value: `${data?.goals_all_min_31_to_40_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_31_to_40_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_all_min_31_to_40_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_31_to_40_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['41_50_min'],
      home: {
        value: `${data?.goals_all_min_41_to_50_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_41_to_50_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_all_min_41_to_50_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_41_to_50_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['51_60_min'],
      home: {
        value: `${data?.goals_all_min_51_to_60_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_51_to_60_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_all_min_51_to_60_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_51_to_60_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['61_70_min'],
      home: {
        value: `${data?.goals_all_min_61_to_70_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_61_to_70_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_all_min_61_to_70_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_61_to_70_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['71_80_min'],
      home: {
        value: `${data?.goals_all_min_71_to_80_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_71_to_80_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_all_min_71_to_80_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_71_to_80_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['81_90_min'],
      home: {
        value: `${data?.goals_all_min_81_to_90_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_81_to_90_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_all_min_81_to_90_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_81_to_90_away || 0,
          { type: 3 }
        )}`,
      },
    },
  ];
};

export const getTotalGoalsBy15Minutes = (
  data: TotalGoalsBy15Minutes,
  i18n: any
) => {
  return [
    {
      label: i18n.footy_stats['0_15_min'],
      home: {
        value: `${data?.goals_all_min_0_to_15_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_0_to_15_home || 0,
          {
            type: 4,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_all_min_0_to_15_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_0_to_15_away || 0,
          { type: 4 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['16_30_min'],
      home: {
        value: `${data?.goals_all_min_16_to_30_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_16_to_30_home || 0,
          {
            type: 4,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_all_min_16_to_30_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_16_to_30_away || 0,
          { type: 4 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['31_45_min'],
      home: {
        value: `${data?.goals_all_min_31_to_45_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_31_to_45_home || 0,
          {
            type: 4,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_all_min_31_to_45_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_31_to_45_away || 0,
          { type: 4 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['46_60_min'],
      home: {
        value: `${data?.goals_all_min_46_to_60_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_46_to_60_home || 0,
          {
            type: 4,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_all_min_46_to_60_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_46_to_60_away || 0,
          { type: 4 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['61_75_min'],
      home: {
        value: `${data?.goals_all_min_61_to_75_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_61_to_75_home || 0,
          {
            type: 4,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_all_min_61_to_75_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_61_to_75_away || 0,
          { type: 4 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['76_90_min'],
      home: {
        value: `${data?.goals_all_min_76_to_90_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_76_to_90_home || 0,
          {
            type: 4,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_all_min_76_to_90_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_all_min_76_to_90_away || 0,
          { type: 4 }
        )}`,
      },
    },
  ];
};

export const getGoalScoredBy10Minutes = (
  data: GoalsScoredBy10Minutes,
  i18n: any
) => {
  return [
    {
      label: i18n.footy_stats['0_10_min'],
      home: {
        value: `${data?.goals_scored_min_0_to_10_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_0_to_10_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_scored_min_0_to_10_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_0_to_10_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['11_20_min'],
      home: {
        value: `${data?.goals_scored_min_11_to_20_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_11_to_20_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_scored_min_11_to_20_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_11_to_20_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['21_30_min'],
      home: {
        value: `${data?.goals_scored_min_21_to_30_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_21_to_30_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_scored_min_21_to_30_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_21_to_30_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['31_40_min'],
      home: {
        value: `${data?.goals_scored_min_31_to_40_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_31_to_40_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_scored_min_31_to_40_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_31_to_40_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['41_50_min'],
      home: {
        value: `${data?.goals_scored_min_41_to_50_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_41_to_50_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_scored_min_41_to_50_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_41_to_50_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['51_60_min'],
      home: {
        value: `${data?.goals_scored_min_51_to_60_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_51_to_60_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_scored_min_51_to_60_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_51_to_60_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['61_70_min'],
      home: {
        value: `${data?.goals_scored_min_61_to_70_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_61_to_70_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_scored_min_61_to_70_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_61_to_70_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['71_80_min'],
      home: {
        value: `${data?.goals_scored_min_71_to_80_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_71_to_80_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_scored_min_71_to_80_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_71_to_80_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['81_90_min'],
      home: {
        value: `${data?.goals_scored_min_81_to_90_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_81_to_90_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_scored_min_81_to_90_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_81_to_90_away || 0,
          { type: 3 }
        )}`,
      },
    },
  ];
};

export const getGoalScoredBy15Minutes = (
  data: GoalsScoredBy15Minutes,
  i18n: any
) => {
  return [
    {
      label: i18n.footy_stats['0_15_min'],
      home: {
        value: `${data?.goals_scored_min_0_to_15_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_0_to_15_home || 0,
          {
            type: 4,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_scored_min_0_to_15_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_0_to_15_away || 0,
          { type: 4 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['16_30_min'],
      home: {
        value: `${data?.goals_scored_min_16_to_30_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_16_to_30_home || 0,
          {
            type: 4,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_scored_min_16_to_30_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_16_to_30_away || 0,
          { type: 4 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['31_45_min'],
      home: {
        value: `${data?.goals_scored_min_31_to_45_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_31_to_45_home || 0,
          {
            type: 4,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_scored_min_31_to_45_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_31_to_45_away || 0,
          { type: 4 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['46_60_min'],
      home: {
        value: `${data?.goals_scored_min_46_to_60_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_46_to_60_home || 0,
          {
            type: 4,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_scored_min_46_to_60_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_46_to_60_away || 0,
          { type: 4 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['61_75_min'],
      home: {
        value: `${data?.goals_scored_min_61_to_75_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_61_to_75_home || 0,
          {
            type: 4,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_scored_min_61_to_75_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_61_to_75_away || 0,
          { type: 4 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['76_90_min'],
      home: {
        value: `${data?.goals_scored_min_76_to_90_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_76_to_90_home || 0,
          {
            type: 4,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_scored_min_76_to_90_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_scored_min_76_to_90_away || 0,
          { type: 4 }
        )}`,
      },
    },
  ];
};

export const getGoalConcededBy10Minutes = (
  data: GoalsConcededBy10Minutes,
  i18n: any
) => {
  return [
    {
      label: i18n.footy_stats['0_10_min'],
      home: {
        value: `${data?.goals_conceded_min_0_to_10_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_0_to_10_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_conceded_min_0_to_10_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_0_to_10_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['11_20_min'],
      home: {
        value: `${data?.goals_conceded_min_11_to_20_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_11_to_20_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_conceded_min_11_to_20_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_11_to_20_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['21_30_min'],
      home: {
        value: `${data?.goals_conceded_min_21_to_30_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_21_to_30_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_conceded_min_21_to_30_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_21_to_30_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['31_40_min'],
      home: {
        value: `${data?.goals_conceded_min_31_to_40_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_31_to_40_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_conceded_min_31_to_40_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_31_to_40_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['41_50_min'],
      home: {
        value: `${data?.goals_conceded_min_41_to_50_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_41_to_50_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_conceded_min_41_to_50_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_41_to_50_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['51_60_min'],
      home: {
        value: `${data?.goals_conceded_min_51_to_60_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_51_to_60_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_conceded_min_51_to_60_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_51_to_60_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['61_70_min'],
      home: {
        value: `${data?.goals_conceded_min_61_to_70_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_61_to_70_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_conceded_min_61_to_70_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_61_to_70_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['71_80_min'],
      home: {
        value: `${data?.goals_conceded_min_71_to_80_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_71_to_80_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_conceded_min_71_to_80_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_71_to_80_away || 0,
          { type: 3 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['81_90_min'],
      home: {
        value: `${data?.goals_conceded_min_81_to_90_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_81_to_90_home || 0,
          {
            type: 3,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_conceded_min_81_to_90_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_81_to_90_away || 0,
          { type: 3 }
        )}`,
      },
    },
  ];
};

export const getGoalConcededBy15Minutes = (
  data: GoalsConcededBy15Minutes,
  i18n: any
) => {
  return [
    {
      label: i18n.footy_stats['0_15_min'],
      home: {
        value: `${data?.goals_conceded_min_0_to_15_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_0_to_15_home || 0,
          {
            type: 4,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_conceded_min_0_to_15_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_0_to_15_away || 0,
          { type: 4 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['16_30_min'],
      home: {
        value: `${data?.goals_conceded_min_16_to_30_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_16_to_30_home || 0,
          {
            type: 4,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_conceded_min_16_to_30_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_16_to_30_away || 0,
          { type: 4 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['31_45_min'],
      home: {
        value: `${data?.goals_conceded_min_31_to_45_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_31_to_45_home || 0,
          {
            type: 4,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_conceded_min_31_to_45_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_31_to_45_away || 0,
          { type: 4 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['46_60_min'],
      home: {
        value: `${data?.goals_conceded_min_46_to_60_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_46_to_60_home || 0,
          {
            type: 4,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_conceded_min_46_to_60_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_46_to_60_away || 0,
          { type: 4 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['61_75_min'],
      home: {
        value: `${data?.goals_conceded_min_61_to_75_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_61_to_75_home || 0,
          {
            type: 4,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_conceded_min_61_to_75_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_61_to_75_away || 0,
          { type: 4 }
        )}`,
      },
    },
    {
      label: i18n.footy_stats['76_90_min'],
      home: {
        value: `${data?.goals_conceded_min_76_to_90_home || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_76_to_90_home || 0,
          {
            type: 4,
          }
        )}`,
      },
      away: {
        value: `${data?.goals_conceded_min_76_to_90_away || 0}%`,
        className: `w-1/3 ${getContentColor(
          data?.goals_conceded_min_76_to_90_away || 0,
          { type: 4 }
        )}`,
      },
    },
  ];
};

export const getShotsTakenData = (data: ShotsTakenStats, i18n: any) => {
  return [
    {
      label: i18n.footy_stats.shot_taken_per_match,
      home: {
        value: data?.shotsAVG_home || 0,
        className: `w-1/4 ${getContentColor(data?.shotsAVG_home || 0, {
          type: 0,
          customRange: [
            [0, 4.99],
            [5, 9.99],
            [10, 13.99],
            [14, Infinity],
          ],
        })}`,
      },
      away: {
        value: data?.shotsAVG_away || 0,
        className: `w-1/4 ${getContentColor(data?.shotsAVG_away || 0, {
          type: 0,
          customRange: [
            [0, 4.99],
            [5, 9.99],
            [10, 13.99],
            [14, Infinity],
          ],
        })}`,
      },
      avg: {
        value: data?.shotsAVG_overall || 0,
        className: `w-1/4 ${getContentColor(data?.shotsAVG_overall, {
          type: 0,
          customRange: [
            [0, 4.99],
            [5, 9.99],
            [10, 13.99],
            [14, Infinity],
          ],
        })}`,
      },
    },
    {
      label: i18n.footy_stats.shot_conversion_rate,
      home: {
        value: `${data?.shot_conversion_rate_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.shot_conversion_rate_home || 0,
          {
            type: 0,
            customRange: [
              [0, 4],
              [5, 9],
              [10, 15],
              [16, 100],
            ],
          }
        )}`,
      },
      away: {
        value: `${data?.shot_conversion_rate_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.shot_conversion_rate_away || 0,
          {
            type: 0,
            customRange: [
              [0, 4],
              [5, 9],
              [10, 15],
              [16, 100],
            ],
          }
        )}`,
      },
      avg: {
        value: `${data?.shot_conversion_rate_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.shot_conversion_rate_overall,
          {
            type: 0,
            customRange: [
              [0, 4],
              [5, 9],
              [10, 15],
              [16, 100],
            ],
          }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.shots_on_target_per_match,
      home: {
        value: data?.shotsOnTargetAVG_home || 0,
        className: `w-1/4 ${getContentColor(data?.shotsOnTargetAVG_home || 0, {
          type: 6,
        })}`,
      },
      away: {
        value: data?.shotsOnTargetAVG_away || 0,
        className: `w-1/4 ${getContentColor(data?.shotsOnTargetAVG_away || 0, {
          type: 6,
        })}`,
      },
      avg: {
        value: data?.shotsOnTargetAVG_overall || 0,
        className: `w-1/4 ${getContentColor(data?.shotsOnTargetAVG_overall, {
          type: 6,
        })}`,
      },
    },
    {
      label: i18n.footy_stats.shots_off_target_per_match,
      home: {
        value: data?.shotsOffTargetAVG_home || 0,
        className: `w-1/4 ${getContentColor(data?.shotsOffTargetAVG_home || 0, {
          type: 6,
        })}`,
      },
      away: {
        value: data?.shotsOffTargetAVG_away || 0,
        className: `w-1/4 ${getContentColor(data?.shotsOffTargetAVG_away || 0, {
          type: 6,
        })}`,
      },
      avg: {
        value: data?.shotsOffTargetAVG_overall || 0,
        className: `w-1/4 ${getContentColor(data?.shotsOffTargetAVG_overall, {
          type: 6,
        })}`,
      },
    },
    {
      label: i18n.footy_stats.shots_per_goal_scored,
      home: {
        value: data?.shots_per_goals_scored_home || 0,
        className: `w-1/4 ${getContentColor(
          data?.shots_per_goals_scored_home || 0,
          {
            type: 6,
          }
        )}`,
      },
      away: {
        value: data?.shots_per_goals_scored_away || 0,
        className: `w-1/4 ${getContentColor(
          data?.shots_per_goals_scored_away || 0,
          {
            type: 6,
          }
        )}`,
      },
      avg: {
        value: data?.shots_per_goals_scored_overall || 0,
        className: `w-1/4 ${getContentColor(
          data?.shots_per_goals_scored_overall,
          {
            type: 6,
          }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.team_shots_over_10_5,
      home: {
        value: `${data?.team_shots_over105_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_over105_percentage_home || 0,
          {
            type: 5,
          }
        )}`,
      },
      away: {
        value: `${data?.team_shots_over105_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_over105_percentage_away || 0,
          {
            type: 5,
          }
        )}`,
      },
      avg: {
        value: `${data?.team_shots_over105_percentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_over105_percentage_overall,
          {
            type: 5,
          }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.team_shots_over_11_5,
      home: {
        value: `${data?.team_shots_over115_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_over115_percentage_home || 0,
          {
            type: 5,
          }
        )}`,
      },
      away: {
        value: `${data?.team_shots_over115_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_over115_percentage_away || 0,
          {
            type: 5,
          }
        )}`,
      },
      avg: {
        value: `${data?.team_shots_over115_percentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_over115_percentage_overall,
          {
            type: 5,
          }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.team_shots_over_12_5,
      home: {
        value: `${data?.team_shots_over125_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_over125_percentage_home || 0,
          {
            type: 5,
          }
        )}`,
      },
      away: {
        value: `${data?.team_shots_over125_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_over125_percentage_away || 0,
          {
            type: 5,
          }
        )}`,
      },
      avg: {
        value: `${data?.team_shots_over125_percentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_over125_percentage_overall,
          {
            type: 5,
          }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.team_shots_over_13_5,
      home: {
        value: `${data?.team_shots_over135_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_over135_percentage_home || 0,
          {
            type: 5,
          }
        )}`,
      },
      away: {
        value: `${data?.team_shots_over135_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_over135_percentage_away || 0,
          {
            type: 5,
          }
        )}`,
      },
      avg: {
        value: `${data?.team_shots_over135_percentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_over135_percentage_overall,
          {
            type: 5,
          }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.team_shots_over_14_5,
      home: {
        value: `${data?.team_shots_over145_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_over145_percentage_home || 0,
          {
            type: 5,
          }
        )}`,
      },
      away: {
        value: `${data?.team_shots_over145_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_over145_percentage_away || 0,
          {
            type: 5,
          }
        )}`,
      },
      avg: {
        value: `${data?.team_shots_over145_percentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_over145_percentage_overall,
          {
            type: 5,
          }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.team_shots_over_15_5,
      home: {
        value: `${data?.team_shots_over155_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_over155_percentage_home || 0,
          {
            type: 5,
          }
        )}`,
      },
      away: {
        value: `${data?.team_shots_over155_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_over155_percentage_away || 0,
          {
            type: 5,
          }
        )}`,
      },
      avg: {
        value: `${data?.team_shots_over155_percentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_over155_percentage_overall,
          {
            type: 5,
          }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.on_target_over_3_5,
      home: {
        value: `${data?.team_shots_on_target_over35_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_on_target_over35_percentage_home || 0,
          {
            type: 5,
          }
        )}`,
      },
      away: {
        value: `${data?.team_shots_on_target_over35_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_on_target_over35_percentage_away || 0,
          {
            type: 5,
          }
        )}`,
      },
      avg: {
        value: `${data?.team_shots_on_target_over35_percentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_on_target_over35_percentage_overall,
          {
            type: 5,
          }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.on_target_over_4_5,
      home: {
        value: `${data?.team_shots_on_target_over45_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_on_target_over45_percentage_home || 0,
          {
            type: 5,
          }
        )}`,
      },
      away: {
        value: `${data?.team_shots_on_target_over45_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_on_target_over45_percentage_away || 0,
          {
            type: 5,
          }
        )}`,
      },
      avg: {
        value: `${data?.team_shots_on_target_over45_percentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_on_target_over45_percentage_overall,
          {
            type: 5,
          }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.on_target_over_5_5,
      home: {
        value: `${data?.team_shots_on_target_over55_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_on_target_over55_percentage_home || 0,
          {
            type: 5,
          }
        )}`,
      },
      away: {
        value: `${data?.team_shots_on_target_over55_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_on_target_over55_percentage_away || 0,
          {
            type: 5,
          }
        )}`,
      },
      avg: {
        value: `${data?.team_shots_on_target_over55_percentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_on_target_over55_percentage_overall,
          {
            type: 5,
          }
        )}`,
      },
    },
    {
      label: i18n.footy_stats.on_target_over_6_5,
      home: {
        value: `${data?.team_shots_on_target_over65_percentage_home || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_on_target_over65_percentage_home || 0,
          {
            type: 5,
          }
        )}`,
      },
      away: {
        value: `${data?.team_shots_on_target_over65_percentage_away || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_on_target_over65_percentage_away || 0,
          {
            type: 5,
          }
        )}`,
      },
      avg: {
        value: `${data?.team_shots_on_target_over65_percentage_overall || 0}%`,
        className: `w-1/4 ${getContentColor(
          data?.team_shots_on_target_over65_percentage_overall,
          {
            type: 5,
          }
        )}`,
      },
    },
  ];
};
