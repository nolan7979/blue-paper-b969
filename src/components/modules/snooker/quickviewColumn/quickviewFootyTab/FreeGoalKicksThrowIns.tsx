import { TwButtonIcon } from '@/components/buttons/IconButton';
import { TwQuickViewTitleV2 } from '@/components/modules/common';
import Filter from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Filter';
import { CompetitorDto } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { getContentColor } from '@/utils/footyUtils';
import { cn } from '@/utils/tailwindUtils';
import React, { useState } from 'react';

export type FreeGoalKicksData = {
  titleKey: string;
  goalKicksHome: number;
  goalKicksAway: number;
  goalKicksAverage: number;
};

export type ThrowInsData = {
  titleKey: string;
  throwInsHome: number;
  throwInsAway: number;
  throwInsAverage: number;
};

export type FreeGoalKicksThrowInsData = {
  goalKicks: FreeGoalKicksData[];
  throwIns: ThrowInsData[];
};

export type FreeGoalKicksThrowInsProps = {
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  data: FreeGoalKicksThrowInsData;
};

const FreeGoalKicksThrowIns: React.FC<FreeGoalKicksThrowInsProps> = ({
  data,
  homeTeam,
  awayTeam,
}) => {
  const [filter, setFilter] = useState<string>('goal-kicks');
  const i18n = useTrans();

  const filterItems = [
    {
      label: i18n.footy_stats.goal_kicks,
      value: 'goal-kicks',
    },
    { label: i18n.footy_stats.throw_ins, value: 'throw-ins' },
  ];

  const kicksValueClass =
    'max-w-18 lg:max-w-32 text-center w-full truncate px-2.5 py-2 !text-csm font-normal';
  const kicks1stColumnClass = 'w-full px-2.5 py-2 text-csm font-normal dark:text-white';

  const formatValueRecent = (value: number, key: string) => {
    if (key === 'total_goal_kicks' || key === 'total_throw_ins') {
      return value;
    }
    return `${value}%`;
  };

  return (
    <div>
      <TwQuickViewTitleV2 className='pb-3'>
        {i18n.footy_stats.free_goal_throw_title}
      </TwQuickViewTitleV2>

      {!data && (
        <div className='bg-dark-gray py-4 text-center text-csm '>
          <span>{i18n.footy_stats.goal_kicks_empty}</span>
        </div>
      )}
      <div className='py-4'>
        <Filter filter={filter} setFilter={setFilter} items={filterItems} />
      </div>
      <ul className='flex justify-between dark:bg-dark-gray bg-white'>
        <li className={cn(kicks1stColumnClass, 'dark:text-dark-text')}>
          {
            i18n.footy_stats[
              filter.replace('-', '_') as keyof typeof i18n.footy_stats
            ]
          }
        </li>
        <li className={kicksValueClass}>{homeTeam.name}</li>
        <li className={kicksValueClass}>{awayTeam.name}</li>
        <li className={kicksValueClass}>{i18n.footy_stats.average}</li>
      </ul>
      {(filter === 'goal-kicks' && (
        <div className=''>
          {data?.goalKicks?.map((item, index) => (
            <div
              key={`goalKicks-${index}`}
              className='flex justify-between border-b border-dark-time-tennis'
            >
              <div className={kicks1stColumnClass}>
                {
                  i18n.footy_stats[
                    item.titleKey as keyof typeof i18n.footy_stats
                  ]
                }
              </div>
              <div
                className={cn(
                  kicksValueClass,
                  getContentColor(item.goalKicksHome, {
                    type:
                      item.titleKey === 'total_goal_kicks' ||
                      item.titleKey === 'total_throw_ins'
                        ? 1
                        : 2,
                  })
                )}
              >
                {formatValueRecent(item.goalKicksHome, item.titleKey)}
              </div>
              <div
                className={cn(
                  kicksValueClass,
                  getContentColor(item.goalKicksAway, {
                    type:
                      item.titleKey === 'total_goal_kicks' ||
                      item.titleKey === 'total_throw_ins'
                        ? 1
                        : 2,
                  })
                )}
              >
                {formatValueRecent(item.goalKicksAway, item.titleKey)}
              </div>
              <div
                className={cn(
                  kicksValueClass,
                  getContentColor(item.goalKicksAverage, {
                    type:
                      item.titleKey === 'total_goal_kicks' ||
                      item.titleKey === 'total_throw_ins'
                        ? 1
                        : 2,
                  })
                )}
              >
                {formatValueRecent(item.goalKicksAverage, item.titleKey)}
              </div>
            </div>
          ))}
        </div>
      )) || (
        <div>
          {data?.throwIns?.map((item, index) => (
            <div
              key={`throws-${index}`}
              className='flex justify-between border-b border-dark-time-tennis'
            >
              <div className={kicks1stColumnClass}>
                {
                  i18n.footy_stats[
                    item.titleKey as keyof typeof i18n.footy_stats
                  ]
                }
              </div>
              <div
                className={cn(
                  kicksValueClass,
                  getContentColor(item.throwInsHome, {
                    type:
                      item.titleKey === 'total_goal_kicks' ||
                      item.titleKey === 'total_throw_ins'
                        ? 1
                        : 2,
                  })
                )}
              >
                {formatValueRecent(item.throwInsHome, item.titleKey)}
              </div>
              <div
                className={cn(
                  kicksValueClass,
                  getContentColor(item.throwInsAway, {
                    type:
                      item.titleKey === 'total_goal_kicks' ||
                      item.titleKey === 'total_throw_ins'
                        ? 1
                        : 2,
                  })
                )}
              >
                {formatValueRecent(item.throwInsAway, item.titleKey)}
              </div>
              <div
                className={cn(
                  kicksValueClass,
                  getContentColor(item.throwInsAverage, {
                    type:
                      item.titleKey === 'total_goal_kicks' ||
                      item.titleKey === 'total_throw_ins'
                        ? 1
                        : 2,
                  })
                )}
              >
                {formatValueRecent(item.throwInsAverage, item.titleKey)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreeGoalKicksThrowIns;

export const formatFreeGoalKicksThrowInsData = (
  data: any
): FreeGoalKicksThrowInsData => ({
  goalKicks: [
    {
      titleKey: 'total_goal_kicks',
      goalKicksHome:
        data?.home_team_info?.stats?.stats?.additional_info
          ?.goal_kicks_total_avg_home || 0,
      goalKicksAway:
        data?.away_team_info?.stats?.stats?.additional_info
          ?.goal_kicks_total_avg_away || 0,
      goalKicksAverage: parseFloat(
        (
          ((data?.home_team_info?.stats?.stats?.additional_info
            ?.goal_kicks_total_avg_home +
            data?.home_team_info?.stats?.stats?.additional_info
              ?.goal_kicks_total_avg_away) /
            2 || 0) + 0.00001
        ).toFixed(2)
      ),
    },
    {
      titleKey: 'gk_total_85',
      goalKicksHome:
        data?.home_team_info?.stats?.stats?.additional_info
          ?.goal_kicks_total_over85_home || 0,
      goalKicksAway:
        data?.away_team_info?.stats?.stats?.additional_info
          ?.goal_kicks_total_over85_away || 0,
      goalKicksAverage: Math.round(
        (data?.home_team_info?.stats?.stats?.additional_info
          ?.goal_kicks_total_over85_home +
          data?.home_team_info?.stats?.stats?.additional_info
            ?.goal_kicks_total_over85_away) /
          2 || 0
      ),
    },
    {
      titleKey: 'gk_total_95',
      goalKicksHome:
        data?.home_team_info?.stats?.stats?.additional_info
          ?.goal_kicks_total_over95_home || 0,
      goalKicksAway:
        data?.away_team_info?.stats?.stats?.additional_info
          ?.goal_kicks_total_over95_away || 0,
      goalKicksAverage: Math.round(
        (data?.home_team_info?.stats?.stats?.additional_info
          ?.goal_kicks_total_over95_home +
          data?.home_team_info?.stats?.stats?.additional_info
            ?.goal_kicks_total_over95_away) /
          2 || 0
      ),
    },
    {
      titleKey: 'gk_total_105',
      goalKicksHome:
        data?.home_team_info?.stats?.stats?.additional_info
          ?.goal_kicks_total_over105_home || 0,
      goalKicksAway:
        data?.away_team_info?.stats?.stats?.additional_info
          ?.goal_kicks_total_over105_away || 0,
      goalKicksAverage: Math.round(
        (data?.home_team_info?.stats?.stats?.additional_info
          ?.goal_kicks_total_over105_home +
          data?.home_team_info?.stats?.stats?.additional_info
            ?.goal_kicks_total_over105_away) /
          2 || 0
      ),
    },
    {
      titleKey: 'gk_total_115',
      goalKicksHome:
        data?.home_team_info?.stats?.stats?.additional_info
          ?.goal_kicks_total_over115_home || 0,
      goalKicksAway:
        data?.away_team_info?.stats?.stats?.additional_info
          ?.goal_kicks_total_over115_away || 0,
      goalKicksAverage: Math.round(
        (data?.home_team_info?.stats?.stats?.additional_info
          ?.goal_kicks_total_over115_home +
          data?.away_team_info?.stats?.stats?.additional_info
            ?.goal_kicks_total_over115_away) /
          2 || 0
      ),
    },
    {
      titleKey: 'gk_total_125',
      goalKicksHome:
        data?.home_team_info?.stats?.stats?.additional_info
          ?.goal_kicks_total_over125_home || 0,
      goalKicksAway:
        data?.away_team_info?.stats?.stats?.additional_info
          ?.goal_kicks_total_over125_away || 0,
      goalKicksAverage: Math.round(
        (data?.home_team_info?.stats?.stats?.additional_info
          ?.goal_kicks_total_over125_home +
          data?.away_team_info?.stats?.stats?.additional_info
            ?.goal_kicks_total_over125_away) /
          2 || 0
      ),
    },
    {
      titleKey: 'gk_total_135',
      goalKicksHome:
        data?.home_team_info?.stats?.stats?.additional_info
          ?.goal_kicks_total_over135_home || 0,
      goalKicksAway:
        data?.away_team_info?.stats?.stats?.additional_info
          ?.goal_kicks_total_over135_away || 0,
      goalKicksAverage: Math.round(
        (data?.home_team_info?.stats?.stats?.additional_info
          ?.goal_kicks_total_over135_home +
          data?.away_team_info?.stats?.stats?.additional_info
            ?.goal_kicks_total_over135_away) /
          2 || 0
      ),
    },
  ],
  throwIns: [
    {
      titleKey: 'total_throw_ins',
      throwInsHome:
        data?.home_team_info?.stats?.stats?.additional_info
          ?.throwins_total_avg_home || 0,
      throwInsAway:
        data?.away_team_info?.stats?.stats?.additional_info
          ?.throwins_total_avg_away || 0,
      throwInsAverage: parseFloat(
        (
          ((data?.home_team_info?.stats?.stats?.additional_info
            ?.throwins_total_avg_home +
            data?.away_team_info?.stats?.stats?.additional_info
              ?.throwins_total_avg_away) /
            2 || 0) + 0.00001
        ).toFixed(2)
      ),
    },
    {
      titleKey: 'ti_total_375',
      throwInsHome:
        data?.home_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over375_home || 0,
      throwInsAway:
        data?.away_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over375_away || 0,
      throwInsAverage: Math.round(
        (data?.home_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over375_home +
          data?.away_team_info?.stats?.stats?.additional_info
            ?.throwins_total_over375_away) /
          2 || 0
      ),
    },
    {
      titleKey: 'ti_total_385',
      throwInsHome:
        data?.home_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over385_home || 0,
      throwInsAway:
        data?.away_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over385_away || 0,
      throwInsAverage: Math.round(
        (data?.home_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over385_home +
          data?.away_team_info?.stats?.stats?.additional_info
            ?.throwins_total_over385_away) /
          2 || 0
      ),
    },
    {
      titleKey: 'ti_total_395',
      throwInsHome:
        data?.home_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over395_home || 0,
      throwInsAway:
        data?.away_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over395_away || 0,
      throwInsAverage: Math.round(
        (data?.home_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over395_home +
          data?.away_team_info?.stats?.stats?.additional_info
            ?.throwins_total_over395_away) /
          2 || 0
      ),
    },
    {
      titleKey: 'ti_total_405',
      throwInsHome:
        data?.home_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over405_home || 0,
      throwInsAway:
        data?.away_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over405_away || 0,
      throwInsAverage: Math.round(
        (data?.home_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over405_home +
          data?.away_team_info?.stats?.stats?.additional_info
            ?.throwins_total_over405_away) /
          2 || 0
      ),
    },
    {
      titleKey: 'ti_total_415',
      throwInsHome:
        data?.home_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over415_home || 0,
      throwInsAway:
        data?.away_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over415_away || 0,
      throwInsAverage: Math.round(
        (data?.home_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over415_home +
          data?.away_team_info?.stats?.stats?.additional_info
            ?.throwins_total_over415_away) /
          2 || 0
      ),
    },
    {
      titleKey: 'ti_total_425',
      throwInsHome:
        data?.home_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over425_home || 0,
      throwInsAway:
        data?.away_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over425_away || 0,
      throwInsAverage: Math.round(
        (data?.home_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over425_home +
          data?.away_team_info?.stats?.stats?.additional_info
            ?.throwins_total_over425_away) /
          2 || 0
      ),
    },
    {
      titleKey: 'ti_total_435',
      throwInsHome:
        data?.home_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over435_home || 0,
      throwInsAway:
        data?.away_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over435_away || 0,
      throwInsAverage: Math.round(
        (data?.home_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over435_home +
          data?.away_team_info?.stats?.stats?.additional_info
            ?.throwins_total_over435_away) /
          2 || 0
      ),
    },
    {
      titleKey: 'ti_total_445',
      throwInsHome:
        data?.home_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over445_home || 0,
      throwInsAway:
        data?.away_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over445_away || 0,
      throwInsAverage: Math.round(
        (data?.home_team_info?.stats?.stats?.additional_info
          ?.throwins_total_over445_home +
          data?.away_team_info?.stats?.stats?.additional_info
            ?.throwins_total_over445_away) /
          2 || 0
      ),
    },
  ],
});
