import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';

import { useLocaleStatsDetailHead } from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';

import EmptySection from '@/components/common/empty';
import Statistic from '@/components/common/skeleton/homePage/Statistic';
import {
  TwBorderLinearBox,
  TwTabHead,
} from '@/components/modules/football/tw-components/TwCommon.module';

import { LOCAL_STORAGE } from '@/constant/common';
import { SportEventDto, StatusDto } from '@/constant/interface';
import {
  // isMatchHaveStat,
  isMatchLive,
  isValEmpty,
} from '@/utils';
import { isMatchHockeyHaveStat, isMatchHockeyLive } from '@/utils/hockeyUtils';
import { getItem, setItem } from '@/utils/localStorageUtils';

import { EmptyEvent } from '@/components/common/empty';
import ScoreStats from '@/components/modules/common/scores/scoreStats';
import { useMatchStatsData } from '@/hooks/useHockey';
import { useRouter } from 'next/router';
import vi from '~/lang/vi';

const QuickViewStatsTab: React.FC<{
  matchData: SportEventDto;
}> = ({ matchData }) => {
  const i18n = useTrans();

  if (isValEmpty(matchData)) {
    return <EmptySection content={i18n.common.nodata} />;
  }

  return (
    <>
      <StatsSection matchData={matchData} i18n={i18n}></StatsSection>
    </>
  );
};
export default QuickViewStatsTab;

export const StatsSection: React.FC<{
  matchData?: any;
  i18n: any;
}> = ({ matchData, i18n }) => {
  const { locale } = useRouter();
  const router = useRouter();
  const isDetail = router.pathname.includes('/match/');
  const statsLocale = useMemo(
    () => getItem(LOCAL_STORAGE.statsLocaleDetail),
    [locale]
  );

  const [statsPeriod, setStatsPeriod] = useState<string>('Match');

  const currentLocale = getItem(LOCAL_STORAGE.currentLocale);

  const { data: statsDetailData, refetch } = useLocaleStatsDetailHead(
    i18n.language
  );

  const status: StatusDto = matchData
    ? matchData.status
    : { code: 100, description: '', type: '' };

  const shouldRefetching = isMatchHockeyLive(status?.code);

  const {
    data: periods,
    isLoading,
    isError,
    refetch: refetchMatchStat,
  } = useMatchStatsData(
    matchData?.id,

    i18n.language
  );

  const stat = (statsLocale && JSON.parse(statsLocale)) || {};

  const [statTrans, setStatTrans] = useState(stat);

  useEffect(() => {
    if (shouldRefetching) {
      const timer = setInterval(() => {
        refetchMatchStat();
      }, 2000);

      return () => clearInterval(timer);
    }
  }, [shouldRefetching, refetchMatchStat]);

  useEffect(() => {
    const parseLocale = currentLocale && JSON.parse(currentLocale);
    if (parseLocale !== locale) {
      setItem(LOCAL_STORAGE.currentLocale, JSON.stringify(locale));
      refetch();
    }
  }, [locale]);

  useEffect(() => {
    if (
      statsDetailData &&
      JSON.stringify(statsDetailData).length !== statsLocale?.length
    ) {
      setItem(LOCAL_STORAGE.statsLocaleDetail, JSON.stringify(statsDetailData));
      setStatTrans(statsDetailData);
    }
  }, [statsDetailData, statsLocale]);

  if (isLoading)
    return (
      <div className='rounded-lg bg-light-main px-4 py-2 dark:bg-primary-gradient'>
        <Statistic />
      </div>
    );
  if (isError) return <div>Error...</div>;
  const period = 'Match';

  const groups = periods.filter((p: any) => p.period === statsPeriod)[0] || {};
  if (isValEmpty(groups)) {
    return (
      <>
        <EmptyEvent content='Data not available'></EmptyEvent>
      </>
    );
  }

  return (
    <div className='space-y-6 pb-6 pt-2 lg:space-y-8'>
      {status && isMatchHockeyHaveStat(status.code) && (
        <div className='space-y-3' id='stats'>
          <div className='space-y-8 px-2.5 lg:px-0'>
            <PeriodFilter
              statsPeriod={statsPeriod}
              setStatsPeriod={setStatsPeriod}
              i18n={i18n}
              periods={periods}
            />
            <div className='space-y-5 rounded-md bg-white p-4  text-sm dark:bg-dark-card'>
              {groups?.statisticsItems &&
                groups?.statisticsItems.map((groupData: any) => {
                  const rows: any[] = [];
                  rows.push(
                    <StatsIndexRow
                      key={`${period}-${groupData?.fields}`}
                      statistic={statTrans && statTrans[groupData?.fields]}
                      homeScoreDisplay={groupData?.home}
                      homeScore={Number(groupData?.home)}
                      awayScoreDisplay={groupData?.away}
                      awayScore={Number(groupData?.away)}
                      // compareCode={compareCode}
                      fieldKey={groupData?.fields}
                    />
                  );
                  return rows;
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const PeriodFilter = ({
  statsPeriod,
  setStatsPeriod,
  i18n = vi,
  periods,
}: {
  statsPeriod: string;
  setStatsPeriod: any;
  i18n?: any;
  periods: any;
}) => {
  return (
    // <div className='flex w-full justify-center gap-3 px-2 py-3 lg:justify-start lg:px-0'>
    <TwTabHead>
      {periods.map((period: any, index: number) => (
        <TwBorderLinearBox
          key={index}
          className={`h-full flex-1 !rounded-full ${
            statsPeriod === period.period ? 'border-linear-form' : ''
          }`}
        >
          <button
            onClick={() => setStatsPeriod(period.period)}
            className={`h-full w-full rounded-full transition-colors duration-300 ${
              statsPeriod === period.period
                ? 'dark:bg-button-gradient bg-dark-button ' +
                  (statsPeriod === period.period
                    ? 'text-white'
                    : 'text-black dark:text-white')
                : 'bg-transparent text-gray-400'
            }`}
          >
            <span className='text-csm font-medium' id='tabStats'>
              {i18n.filter[period.period.toLowerCase()]}
            </span>
          </button>
        </TwBorderLinearBox>
      ))}
    </TwTabHead>
  );
};

interface StatsIndexRowProps {
  statistic: string;
  homeScore: any;
  homeScoreDisplay?: string;
  awayScore: any;
  awayScoreDisplay?: string;
  compareCode?: number;
  fieldKey?: string;
}

export const StatsIndexRow = ({
  statistic,
  homeScoreDisplay,
  homeScore,
  awayScoreDisplay,
  awayScore,
  fieldKey,
}: StatsIndexRowProps) => {
  const totalScore = Math.abs(homeScore) + Math.abs(awayScore);
  const isDisplayPercentage =
    fieldKey &&
    ['shooting_pct', 'saves_pct','power_play_pct','pen_killing_pct','faceoffs'].includes(fieldKey);
  const except =
    statistic === 'Crosses' || statistic === 'Dribbles' ? true : false;
  return (
    <div className='space-y-1 font-primary text-csm font-normal'>
      <div className='flex justify-between'>
        <ScoreStats
          id='id-percentage-team1'
          score={
            isDisplayPercentage
              ? `${(homeScore * 100).toFixed(1)}%`
              : homeScoreDisplay || homeScore
          }
          highlight={(homeScore ==0 && awayScore == 0) ? false : homeScore >= awayScore}
          type='home'
        />
        <span className='capitalize text-black dark:text-white'>
          {statistic}
        </span>
        <ScoreStats
          id='id-percentage-team2'
          score={
            isDisplayPercentage
              ? `${(awayScore * 100).toFixed(1)}%`
              : awayScoreDisplay || awayScore
          }
          highlight={(homeScore ==0 && awayScore == 0) ? false :homeScore <= awayScore}
          type='away'
        />
      </div>
      <div className=' flex gap-x-0.5 rounded-xl bg-light-blur-line dark:bg-dark-blur-line'>
        <div className=' flex h-[0.313rem] flex-1 justify-end rounded-s-md'>
          <span
            className={clsx(
              'rounded-l-full',
              homeScore < awayScore
                ? 'bg-primary-disabled/40'
                : 'bg-line-dark-blue'
            )}
            style={{
              width: except
                ? `${homeScore}%`
                : totalScore === 0 ? 0 :  `${Math.round((Math.abs(homeScore) / totalScore) * 100)}%`,
            }}
          />
        </div>
        <div className=' flex h-[0.313rem] flex-1 justify-start rounded-e-md '>
          <span
            className={clsx(
              'rounded-r-full',
              awayScore < homeScore
                ? 'bg-primary-disabled/40'
                : 'bg-logo-yellow'
            )}
            style={{
              width: except
                ? `${awayScore}%`
                : totalScore === 0 ? 0 :  `${Math.round((Math.abs(awayScore) / totalScore) * 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

// function calculateDistance(x1: number, y1: number, x2: number, y2: number) {
//   const dx = x2 - x1;
//   const dy = y2 - y1;
//   return Math.sqrt(dx * dx + dy * dy);
// }
