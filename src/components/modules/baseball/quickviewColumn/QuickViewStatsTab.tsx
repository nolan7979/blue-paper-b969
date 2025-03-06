import React, { useEffect, useMemo, useState } from 'react';
import { SportEventDto, StatusDto } from '@/constant/interface';
import {
  TwBorderLinearBox,
  TwTabHead,
} from '@/components/modules/football/tw-components/TwCommon.module';
import {
  TwMobileView,
  TwQuickViewSection,
} from '@/components/modules/football/tw-components';
import { getItem, setItem } from '@/utils/localStorageUtils';
import { isMatchLive, isValEmpty, parseStatsVal } from '@/utils';

import EmptySection from '@/components/common/empty';
import { LOCAL_STORAGE } from '@/constant/common';
import Statistic from '@/components/common/skeleton/homePage/Statistic';
// import { StreakSection } from '@/components/modules/football/match/StreakSection';
import { TwMbQuickViewWrapper } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import clsx from 'clsx';
import en from '~/lang/en';
import { isMatchHaveStatBB } from '@/utils/baseballUtils';
import { useLocaleStatsDetailHead } from '@/hooks/useFootball';
import { useMatchStatsData } from '@/hooks/useBaseball';
import { useRouter } from 'next/router';
import useTrans from '@/hooks/useTrans';

const QuickViewStatsTab: React.FC<{
  matchData: SportEventDto;
}> = ({ matchData }) => {
  const i18n = useTrans();

  if (isValEmpty(matchData)) {
    return <EmptySection content={i18n.common.nodata} />;
  }

  return <StatsSection matchData={matchData} i18n={i18n}></StatsSection>;
};
export default QuickViewStatsTab;

export const StatsSection: React.FC<{
  matchData?: any;
  i18n: any;
}> = ({ matchData, i18n }) => {
  const { locale } = useRouter();

  const statsLocale = useMemo(
    () => getItem(LOCAL_STORAGE.statsLocaleDetail),
    [locale]
  );

  const [statsPeriod, setStatsPeriod] = useState<string>('All');

  const currentLocale = getItem(LOCAL_STORAGE.currentLocale);

  const { data: statsDetailData, refetch } = useLocaleStatsDetailHead(
    JSON.parse(currentLocale!)
  );

  const status: StatusDto = matchData
    ? matchData.status
    : { code: 100, description: '', type: '' };

  const shouldRefetching = isMatchLive(status?.code);

  const {
    data: periods,
    isLoading,
    isError,
    refetch: refetchMatchStat,
  } = useMatchStatsData(matchData?.id, i18n.language);

  const statisticLocale = getItem(LOCAL_STORAGE.statsLocaleDetail);
  const stat = (statisticLocale && JSON.parse(statisticLocale)) || {};
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
      <div className='dark:bg-primary-gradient rounded-lg bg-light-main px-4 py-2'>
        <Statistic />
      </div>
    );
  if (isError) return <div>Error...</div>;

  const { period = 'ALL', statisticsItems = [] } =
    periods.find((p: any) => p.period === statsPeriod) || {};

  if (isValEmpty(statisticsItems)) {
    return <></>;
  }

  // const possessionData = groups?.find(
  //   (p: any) => p?.groupName?.toUpperCase() === 'Possession'.toUpperCase()
  // );
  // const shotsTotalData =
  //   groups?.find(
  //     (p: any) => p?.groupName?.toUpperCase() === 'Shots'.toUpperCase()
  //   ) || [];

  // const shotsData = shotsTotalData?.statisticsItems?.find(
  //   (p: any) => p?.fields?.toUpperCase() === 'Shots'.toUpperCase()
  // );
  // const shots_on_targetData = shotsTotalData?.statisticsItems?.find(
  //   (p: any) => p?.fields?.toUpperCase() === 'shots_on_target'.toUpperCase()
  // );
  // const blocked_shotsData = shotsTotalData?.statisticsItems?.find(
  //   (p: any) => p?.fields?.toUpperCase() === 'blocked_shots'.toUpperCase()
  // );

  return (
    <div className=''>
      {status && isMatchHaveStatBB(status.code) && (
        <TwMbQuickViewWrapper className='space-y-3' id='stats'>
          <div className='space-y-3 px-2.5 lg:px-0'>
            <PeriodFilter
              statsPeriod={statsPeriod}
              setStatsPeriod={setStatsPeriod}
              i18n={i18n}
              periods={periods}
            />
            {/* <div className='pt-8'>
              {possessionData && (
                <PossessionStats
                  i18n={i18n}
                  team1Possession={
                    possessionData?.statisticsItems?.[0]?.homeValue || 0
                  }
                  team2Possession={
                    possessionData?.statisticsItems?.[0]?.awayValue || 0
                  }
                />
              )}
            </div> */}
            <TwQuickViewSection className='space-y-5 px-2.5 py-8 text-sm lg:px-0'>
              {statisticsItems &&
                statisticsItems.map((item: any) => {
                  return (
                    <StatsIndexRow
                      key={`${period}-${period}-${item.fields}}`}
                      statistic={
                        (statTrans && statTrans[item.fields]) || item.fields
                      }
                      homeScore={item.home}
                      awayScore={item.away}
                      isPercent={item.fields === 'batting_average'}
                    />
                  );
                })}
            </TwQuickViewSection>
          </div>
        </TwMbQuickViewWrapper>
      )}
      {/* <TwMobileView>
        <StreakSection matchData={matchData} />
      </TwMobileView> */}
    </div>
  );
};

export const PeriodFilter = ({
  statsPeriod,
  setStatsPeriod,
  i18n = en,
  periods,
}: {
  statsPeriod: string;
  setStatsPeriod: any;
  i18n?: any;
  periods: any;
}) => {
  return (
    <TwTabHead className='no-scrollbar !grid grid-cols-10 gap-4 overflow-scroll px-2'>
      {periods.map((period: any, index: number) => (
        <TwBorderLinearBox
          key={index}
          className={`h-full min-w-10 !rounded-full ${
            statsPeriod === period.period ? 'border-linear-form' : ''
          }`}
        >
          <button
            onClick={() => setStatsPeriod(period.period)}
            className={`h-full w-full rounded-full capitalize transition-colors duration-300 ${
              statsPeriod === period.period
                ? 'dark:bg-button-gradient bg-dark-button  text-black dark:text-white'
                : 'bg-transparent text-gray-400'
            }`}
          >
            <span className='text-csm font-medium' id='tabStats'>
              {period.period.toLowerCase()}
            </span>
          </button>
        </TwBorderLinearBox>
      ))}
    </TwTabHead>
  );
};

interface StatsIndexRowProps {
  statistic: string;
  homeScore: number;
  awayScore: number;
  isPercent?: boolean;
}

const formatPercentScore = (score: number) => {
  return `${(score * 100).toFixed(1)}%`;
};

export const StatsIndexRow = ({
  statistic,
  homeScore,
  awayScore,
  isPercent,
}: StatsIndexRowProps) => {
  const totalScore = Math.abs(homeScore) + Math.abs(awayScore);
  const except =
    statistic === 'Crosses' || statistic === 'Dribbles' ? true : false;

  const displayScore = isPercent
    ? {
        homeScore: `${formatPercentScore(homeScore)}`,
        awayScore: `${formatPercentScore(awayScore)}`,
      }
    : { homeScore, awayScore };
  return (
    <div className='space-y-1 text-msm font-normal'>
      <div className='flex justify-between'>
        <span
          id='id-percentage-team1'
          className={
            homeScore < awayScore ? 'text-black dark:text-white' : 'text-icon-highlight'
          }
        >
          {displayScore.homeScore}
        </span>
        <span className='uppercase text-[#8D8E92]'>{statistic}</span>
        <span
          id='id-percentage-team2'
          className={
            awayScore < homeScore
              ? 'text-black dark:text-white'
              : 'text-color-accent-secondary-solid-yellow-500'
          }
        >
          {displayScore.awayScore}
        </span>
      </div>
      <div className=' flex gap-x-0.5'>
        <div className=' flex h-[0.313rem] flex-1 justify-end rounded-s-md'>
          <span
            className={clsx(
              'rounded-l-full',
              homeScore < awayScore
                ? 'bg-accent-primary-alpha-03'
                : 'bg-line-dark-blue'
            )}
            style={{
              width: except
                ? `${homeScore}%`
                : `${Math.round((Math.abs(homeScore) / totalScore) * 100)}%`,
            }}
          />
        </div>
        <div className=' flex h-[0.313rem] flex-1 justify-start rounded-e-md '>
          <span
            className={clsx(
              'rounded-r-full',
              awayScore < homeScore
                ? 'bg-accent-secondary-alpha-02'
                : 'bg-logo-yellow'
            )}
            style={{
              width: except
                ? `${awayScore}%`
                : `${Math.round((Math.abs(awayScore) / totalScore) * 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
