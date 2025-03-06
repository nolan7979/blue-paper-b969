let columns = [
  {
    id: 0,
    name: 'Summary',
    data: [
      {
        header: 'Goals',
        accessorKey: 'statistics.goals',
        sorted: true,
      },
      {
        header: 'Assists',
        accessorKey: 'statistics.assists',
        sorted: true,
      },
      {
        header: 'Tackles',
        accessorKey: 'statistics.tackles',
        sorted: true,
      },
      {
        header: 'Acc.passes',
        accessorKey: 'statistics.passes_accuracy',
        accessorKeySecond: 'statistics.passes',
        sorted: true,
      },
      {
        header: 'Duels(won)',
        accessorKey: 'statistics.duels',
        accessorKeySecond: 'statistics.duels_won',
        sorted: true,
      },
      // {
      //   header: "Minutes played",
      //   accessorKey: "statistics.minutes_played",
      // },
      // {
      //   header: "Ground duels(won)",
      //   accessorKey: "statistics.aerialWon",
      //   accessorKeySecond: "statistics.aerialLost",
      //   accessorKeyThird: "statistics.duelLost",
      //   accessorKeyFourth: "statistics.duelWon",
      // },
      // {
      //   header: "Aerial duels(won)",
      //   accessorKey: "statistics.aerialLost",
      //   accessorKeySecond: "statistics.aerialWon",
      // },
      // {
      //   header: "Position",
      //   accessorKey: "player.position",
      // },
      {
        header: 'Rating',
        accessorKey: 'statistics.rating',
      },
    ],
  },
  {
    id: 1,
    name: 'Attack',
    data: [
      {
        header: 'Shot on target',
        accessorKey: 'statistics.shots_on_target',
        sorted: true,
      },
      // {
      //   header: "Shot off target",
      //   accessorKey: "statistics.shotOffTarget",
      //   sorted: true,
      // },
      // {
      //   header: "Shot blocked",
      //   accessorKey: "statistics.blockedScoringAttempt",
      //   sorted: true,
      // },
      {
        header: 'Dribble attempts(succ.)',
        accessorKey: 'statistics.dribble_succ',
        accessorKeySecond: 'statistics.dribble',
        sorted: true,
      },
      // {
      //   header: "Notes",
      //   accessorKey: "statistics.penalty",
      //   accessorKeySecond: "statistics.hit_woodwork",
      //   accessorKeyThird : "statistics.bigChanceMissed",
      //   accessorKeyFourth : "statistics.penaltyMiss"
      // },
      {
        header: 'Position',
        accessorKey: 'player.position',
      },
      {
        header: 'Rating',
        accessorKey: 'statistics.rating',
      },
    ],
  },
  {
    id: 2,
    name: 'Defence',
    data: [
      {
        header: 'Clearances',
        accessorKey: 'statistics.clearances',
        sorted: true,
      },
      // {
      //   header: "Blocked shots",
      //   accessorKey: "statistics.outfielderBlock",
      //   sorted: true,
      // },
      {
        header: 'Interceptions',
        accessorKey: 'statistics.interceptions',
        sorted: true,
      },
      {
        header: 'Tackles',
        accessorKey: 'statistics.tackles',
        sorted: true,
      },
      // {
      //   header: "Dribbled past",
      //   accessorKey: "statistics.challengeLost",
      // },
      // {
      //   header: "Notes",
      //   accessorKey: "statistics.penaltyConceded",
      // },
      // {
      //   header: "Position",
      //   accessorKey: "player.position",
      // },
      {
        header: 'Rating',
        accessorKey: 'statistics.rating',
        sorted: true,
      },
    ],
  },
  {
    id: 3,
    name: 'Passing',
    data: [
      // {
      //   header: "Touches",
      //   accessorKey: "statistics.touches",
      //   sorted: true,
      // },
      {
        header: 'Acc.passes',
        accessorKey: 'statistics.passes_accuracy',
        accessorKeySecond: 'statistics.passes',
        sorted: true,
      },
      {
        header: 'Key passes',
        accessorKey: 'statistics.key_passes',
        sorted: true,
      },
      {
        header: 'Crosses(acc.)',
        accessorKey: 'statistics.crosses',
        accessorKeySecond: 'statistics.crosses_accuracy',
        sorted: true,
      },
      {
        header: 'Long balls(acc.)',
        accessorKey: 'statistics.long_balls',
        accessorKeySecond: 'statistics.long_balls_accuracy',
        sorted: true,
      },
      // {
      //   header: "Notes",
      //   accessorKey: "statistics.bigChanceCreated",
      // },
      // {
      //   header: "Position",
      //   accessorKey: "player.position",
      // },
      {
        header: 'Rating',
        accessorKey: 'statistics.rating',
        sorted: true,
      },
    ],
  },
  {
    id: 4,
    name: 'Duels',
    data: [
      // {
      //   header: "Ground duels(won)",
      //   accessorKey: "statistics.aerialWon",
      //   accessorKeySecond: "statistics.aerialLost",
      //   accessorKeyThird: "statistics.duelLost",
      //   accessorKeyFourth: "statistics.duelWon",
      // },
      // {
      //   header: "Aerial duels(won)",
      //   accessorKey: "statistics.aerialLost",
      //   accessorKeySecond: "statistics.aerialWon",
      // },
      {
        header: 'Possession lost',
        accessorKey: 'statistics.poss_losts',
        sorted: true,
      },
      {
        header: 'Fouls',
        accessorKey: 'statistics.fouls',
        sorted: true,
      },
      {
        header: 'Was fouled',
        accessorKey: 'statistics.was_fouled',
        sorted: true,
      },
      {
        header: 'Offsides',
        accessorKey: 'statistics.offsides',
        sorted: true,
      },
      // {
      //   header:"Position",
      //   accessorKey:"player.position",
      //   sorted:true
      // },
      {
        header: 'Rating',
        accessorKey: 'statistics.rating',
        sorted: true,
      },
    ],
  },
  {
    id: 5,
    name: 'Goalkeeper',
    data: [
      {
        header: 'Saves',
        accessorKey: 'statistics.saves',
        sorted: true,
      },
      // {
      //   header: "Goals prevented",
      //   accessorKey: "statistics.goalsPrevented",
      //   sorted: true,
      // },
      {
        header: 'Punches',
        accessorKey: 'punches',
        sorted: true,
      },
      {
        header: 'Runs out(succ.)',
        accessorKey: 'runs_out',
        sorted: true,
      },
      {
        header: 'High claims',
        accessorKey: 'good_high_claim',
      },
      // {
      //   header: "Notes",
      //   accessorKey: "statistics.savedShotsFromInsideTheBox",
      //   accessorKeySecond:"statistics.penaltySave"
      // },
      {
        header: 'Rating',
        accessorKey: 'statistics.rating',
        sorted: true,
      },
    ],
  },
];

export default columns;
