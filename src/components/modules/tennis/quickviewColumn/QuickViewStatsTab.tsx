/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';

// import { useMatchStatsData } from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';

import EmptySection from '@/components/common/empty';
import Statistic from '@/components/common/skeleton/homePage/Statistic';
import { StreakSection } from '@/components/modules/football/match/StreakSection';
import { TwMbQuickViewWrapper } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import {
  TwMobileView,
  TwQuickViewSection,
} from '@/components/modules/football/tw-components';
import {
  TwBorderLinearBox
} from '@/components/modules/football/tw-components/TwCommon.module';

import { LOCAL_STORAGE } from '@/constant/common';
import { SportEventDto, StatusDto } from '@/constant/interface';
import {
  isMatchLive,
  isMatchLiveTennis,
  isValEmpty
} from '@/utils';
import { getItem, setItem } from '@/utils/localStorageUtils';

import { useMatchStatsData } from '@/hooks/useTennis';
import vi from '~/lang/vi';
import { useLocaleStatsDetailHead } from '@/hooks/useFootball/useFootballDataHead';
import { useRouter } from 'next/router';
import ScoreStats from '@/components/modules/common/scores/scoreStats';
import TabsSlider from '@/components/common/tabsSlider';

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
  const [statsPeriod, setStatsPeriod] = useState<string>('All');

  const currentLocale = getItem(LOCAL_STORAGE.currentLocale);
  const statsLocale = useMemo(
    () => getItem(LOCAL_STORAGE.statsLocaleDetail),
    [locale]
  );
  const { data: statsDetailData, refetch } = useLocaleStatsDetailHead(
    locale || JSON.parse(currentLocale!)
  );
  const statisticLocale = getItem(LOCAL_STORAGE.statsLocaleDetail);
  const stat = (statisticLocale && JSON.parse(statisticLocale)) || {};
  const [statTrans, setStatTrans] = useState(stat);

  const status: StatusDto = matchData
    ? matchData.status
    : { code: 100, description: '', type: '' };

  const shouldRefetching = isMatchLiveTennis(status?.code);

  const {
    data: periods,
    isLoading,
    isError,
    refetch: refetchMatchStat,
  } = useMatchStatsData(
    matchData?.id,
    i18n.language
  );

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
      <div className='dark:bg-primary-gradient rounded-lg bg-light-main px-4 py-2'>
        <Statistic />
      </div>
    );
  if (isError) return <div>Error...</div>;
  const { period = 'All', statisticsItems = [] } =
    periods.filter((p: any) => p.period === statsPeriod)[0] || {};

  if (isValEmpty(statisticsItems)) {
    return <></>;
  }
  return (
    <div className='space-y-5 rounded-md bg-white p-4  text-sm dark:bg-dark-card'>
      {status && (
        <div className='space-y-3' id='stats'>
          <div className='space-y-3 px-2.5 lg:px-0'>
            <PeriodFilter
              statsPeriod={statsPeriod}
              setStatsPeriod={setStatsPeriod}
              i18n={i18n}
              periods={periods}
            />
            <TwQuickViewSection className='space-y-5 p-4 text-sm'>
              {statisticsItems &&
                statisticsItems.map((item: any, idx:any) => {
                  const {
                    fields,
                    home = 0,
                    away = 0,
                    compareCode,
                  } = item;
                  return (
                    <StatsIndexRow
                      key={`${period}--${fields}-${idx}}`}
                      statistic={(statTrans && statTrans[fields]) || fields}
                      homeScoreDisplay={home}
                      awayScoreDisplay={away}
                      compareCode={compareCode}
                    />
                  );
                })}
            </TwQuickViewSection>
          </div>

          {/* <div className='pb-8'>
            <ShotMapSection i18n={i18n} className='' matchData={matchData} />
          </div> */}
        </div>
      )}
      {/* <TwMobileView>
        <StreakSection matchData={matchData} />
      </TwMobileView> */}
    </div>
  );
};

// export const TwTabHead = tw.div`flex h-[35px] w-full  items-center justify-center rounded-full bg-white dark:bg-dark-head-tab`;
const getPeriodTitle = (period: string) => {
  switch (period.toLowerCase()) {
    case 'all':
      return 'all';
    case '1st':
      return 'S1';
    case '2nd':
      return 'S2';
    case '3rd':
      return 'S3';
    default:
      return period;
  }
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
    <TabsSlider id='stats-tennis'>
      {periods.map((period: any, index: number) => (
        <TwBorderLinearBox
          key={index}
          className={`h-full !rounded-full  ${
            statsPeriod === period.period ? 'border-linear-form' : ''
          }`}
        >
          <button
            // isActive={statsPeriod === period.period}
            onClick={() => setStatsPeriod(period.period)}
            className={`h-full w-full px-4 py-1 rounded-full min-w-20 ${
              statsPeriod === period.period
                ? 'dark:bg-button-gradient bg-dark-button '+ (statsPeriod === period.period ? 'text-white' : 'text-black dark:text-white')
                : 'bg-head-tab dark:bg-dark-head-tab text-black dark:text-white'
            }`}
            // className={`h-7 w-1/3 border ${
            //   statsPeriod === period.period
            //     ? 'border-logo-blue'
            //     : 'dark:!border-dark-button'
            // }`}
          >
            <span className='text-csm font-medium'>
              {getPeriodTitle(period.period) === 'all'? i18n.filter.all : getPeriodTitle(period.period)}
            </span>
          </button>
        </TwBorderLinearBox>
      ))}
    </TabsSlider>
  );
};

interface StatsIndexRowProps {
  statistic: string;
  homeScoreDisplay?: number;
  awayScoreDisplay?: number;
  compareCode?: number;
}

export const StatsIndexRow = ({
  statistic,
  homeScoreDisplay = 0,
  awayScoreDisplay = 0,
}: StatsIndexRowProps) => {
  const totalScore = Math.abs(homeScoreDisplay) + Math.abs(awayScoreDisplay);
  const except = statistic === 'Crosses' || statistic === 'Dribbles' ? true : false;

  const viewPercent = (num:number) => num < 1 && num !== 0 ? `${Math.round(Math.abs(num * 100))}%` : num;

  return (
    <div className='space-y-1 text-msm font-normal'>
      <div className='flex justify-between'>
        <ScoreStats score={viewPercent(homeScoreDisplay)} highlight={homeScoreDisplay > awayScoreDisplay} type='home' />
        
        <span className='uppercase text-black dark:text-white'>{statistic}</span>
        <ScoreStats score={viewPercent(awayScoreDisplay)} highlight={homeScoreDisplay < awayScoreDisplay} type='away' />
        
      </div>
      <div className=' flex gap-x-0.5 bg-light-blur-line dark:bg-dark-blur-line rounded-xl'>
        <div className=' flex h-[0.313rem] flex-1 justify-end rounded-s-md'>
          <span
            className={clsx(
              'rounded-l-full',
              homeScoreDisplay < awayScoreDisplay
                ? 'bg-accent-primary-alpha-03'
                : 'bg-line-dark-blue'
            )}
            style={{
              width: except
                ? `${homeScoreDisplay}%`
                : `${Math.round((Math.abs(homeScoreDisplay) / totalScore) * 100)}%`,
            }}
          />
        </div>
        <div className=' flex h-[0.313rem] flex-1 justify-start rounded-e-md '>
          <span
            className={clsx(
              'rounded-r-full',
              awayScoreDisplay < homeScoreDisplay
                ? 'bg-accent-secondary-alpha-02'
                : 'bg-logo-yellow'
            )}
            style={{
              width: except
                ? `${awayScoreDisplay}%`
                : `${Math.round((Math.abs(awayScoreDisplay) / totalScore) * 100)}%`,
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
