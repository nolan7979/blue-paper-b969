/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';

import { useLocaleStatsDetailHead, useMatchStatsData } from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';

import EmptySection from '@/components/common/empty';
import Statistic from '@/components/common/skeleton/homePage/Statistic';
import { StreakSection } from '@/components/modules/football/match/StreakSection';
import PossessionStats from '@/components/modules/football/PossessionStats';
import { TwMbQuickViewWrapper } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import { ShotMapSection } from '@/components/modules/football/shotmapsSection/ShotMapSection';
import ShotStatistics from '@/components/modules/football/shotmapsSection/ShotStatistics';
import {
  TwMobileView,
  TwQuickViewSection,
} from '@/components/modules/football/tw-components';
import {
  TwBorderLinearBox,
  TwTabHead,
} from '@/components/modules/football/tw-components/TwCommon.module';

import { LOCAL_STORAGE } from '@/constant/common';
import { SportEventDto, StatusDto } from '@/constant/interface';
import {
  isMatchHaveStat,
  isMatchLive,
  isValEmpty,
  parseStatsVal,
} from '@/utils';
import { getItem, setItem } from '@/utils/localStorageUtils';

import vi from '~/lang/vi';
import { useRouter } from 'next/router';

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

  const statsLocale = useMemo(() => getItem(LOCAL_STORAGE.statsLocaleDetail), [locale]);

  const [statsPeriod, setStatsPeriod] = useState<string>('ALL');

  const currentLocale = getItem(LOCAL_STORAGE.currentLocale);

  const { data: statsDetailData, refetch } = useLocaleStatsDetailHead(i18n.language);


  const status: StatusDto = matchData
    ? matchData.status
    : { code: 100, description: '', type: '' };

  const shouldRefetching = isMatchLive(status?.code);

  const {
    data: periods,
    isLoading,
    isError,
    refetch: refetchMatchStat,
  } = useMatchStatsData(
    matchData?.id,
    matchData.homeTeam?.id,
    matchData.awayTeam?.id,
    i18n.language
  );

  const statisticLocale = getItem(LOCAL_STORAGE.statsLocaleDetail);
  const stat = (statisticLocale && JSON.parse(statisticLocale)) || {};
  const [statTrans, setStatTrans] = useState(stat)
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
      refetch()
    }
  }, [locale]);

  useEffect(() => {
    if (statsDetailData && JSON.stringify(statsDetailData).length !== statsLocale?.length) {
      setItem(LOCAL_STORAGE.statsLocaleDetail, JSON.stringify(statsDetailData));
      setStatTrans(statsDetailData)
    }
  }, [statsDetailData, statsLocale]);

  if (isLoading)
    return (
      <div className='dark:bg-primary-gradient rounded-lg bg-light-main px-4 py-2'>
        <Statistic />
      </div>
    );
  if (isError) return <div>Error...</div>;
  const { period = 'ALL', groups = [] } =
    periods.filter((p: any) => p.period === statsPeriod)[0] || {};

  if (isValEmpty(groups)) {
    return <></>;
  }

  const possessionData = groups?.find(
    (p: any) => p?.groupName?.toUpperCase() === 'Possession'.toUpperCase()
  );
  const shotsTotalData =
    groups?.find(
      (p: any) => p?.groupName?.toUpperCase() === 'Shots'.toUpperCase()
    ) || [];

  const shotsData = shotsTotalData?.statisticsItems?.find(
    (p: any) => p?.fields?.toUpperCase() === 'Shots'.toUpperCase()
  );
  const shots_on_targetData = shotsTotalData?.statisticsItems?.find(
    (p: any) => p?.fields?.toUpperCase() === 'shots_on_target'.toUpperCase()
  );
  const blocked_shotsData = shotsTotalData?.statisticsItems?.find(
    (p: any) => p?.fields?.toUpperCase() === 'blocked_shots'.toUpperCase()
  );

  return (
    <div className='pt-6'>
      {status && isMatchHaveStat(status.code) && (
        <TwMbQuickViewWrapper className='space-y-3' id='stats'>
          <div className='space-y-3 px-2.5 lg:px-0'>
            <PeriodFilter
              statsPeriod={statsPeriod}
              setStatsPeriod={setStatsPeriod}
              i18n={i18n}
              periods={periods}
            />
            <div className='pt-8'>
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
            </div>
            <div className='pt-8'>
              <ShotStatistics
                i18n={i18n}
                team1Shots={shotsData?.homeValue || 0}
                team2Shots={shotsData?.awayValue || 0}
                team1OffTarget={
                  (shotsData?.homeValue || 0) -
                  ((shots_on_targetData?.homeValue || 0) +
                    (blocked_shotsData?.homeValue || 0))
                }
                team2OffTarget={
                  (shotsData?.awayValue || 0) -
                  ((shots_on_targetData?.awayValue || 0) +
                    (blocked_shotsData?.awayValue || 0))
                }
                team1OnTarget={shots_on_targetData?.homeValue || 0}
                team2OnTarget={shots_on_targetData?.awayValue || 0}
              />
            </div>
            <TwQuickViewSection className='space-y-5 px-2.5 py-8 text-sm lg:px-0'>
              {groups &&
                groups.map((groupData: any) => {
                  const { groupName, statisticsItems } = groupData;

                  const rows: any[] = [];
                  for (const idx in statisticsItems) {
                    const item = statisticsItems[idx];
                    const {
                      fields,
                      home = 0,
                      away = 0,
                      compareCode,
                      homeValue = 0,
                      awayValue = 0,
                      name,
                    } = item;
                    const homeVal = parseStatsVal(homeValue);
                    const awayVal = parseStatsVal(awayValue);

                    rows.push(
                      <StatsIndexRow
                        key={`${period}-${groupName}-${fields}-${idx}}`}
                        statistic={(statTrans && statTrans[fields]) || name}
                        homeScoreDisplay={home}
                        homeScore={Number(homeVal)}
                        awayScoreDisplay={away}
                        awayScore={Number(awayVal)}
                        compareCode={compareCode}
                      />
                    );
                  }

                  return rows;
                })}
            </TwQuickViewSection>
          </div>

          {/* <div className='pb-8'>
            <ShotMapSection i18n={i18n} className='' matchData={matchData} />
          </div> */}
        </TwMbQuickViewWrapper>
      )}
      <TwMobileView>
        <StreakSection matchData={matchData} />
      </TwMobileView>
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
    <TwTabHead >
      {periods.map((period: any, index: number) => (
        <TwBorderLinearBox
          key={index}
          className={`h-full flex-1 !rounded-full ${statsPeriod === period.period ? 'border-linear-form' : ''
            }`}
        >
          <button
            // isActive={statsPeriod === period.period}
            onClick={() => setStatsPeriod(period.period)}
            className={`h-full w-full rounded-full transition-colors duration-300 ${statsPeriod === period.period
              ? 'dark:bg-button-gradient bg-dark-button  text-black dark:text-white'
              : 'bg-transparent text-gray-400'
              }`}
          // className={`h-7 w-1/3 border ${
          //   statsPeriod === period.period
          //     ? 'border-logo-blue'
          //     : 'dark:!border-dark-button'
          // }`}
          >
            <span className='text-csm font-medium' id="tabStats">
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
}

export const StatsIndexRow = ({
  statistic,
  homeScoreDisplay,
  homeScore,
  awayScoreDisplay,
  awayScore,
}: StatsIndexRowProps) => {
  const totalScore = Math.abs(homeScore) + Math.abs(awayScore);
  const except =
    statistic === 'Crosses' || statistic === 'Dribbles' ? true : false;
  return (
    <div className='space-y-1 text-msm font-normal'>
      <div className='flex justify-between'>
        <span
          id="id-percentage-team1"
          className={
            homeScore < awayScore ? 'text-black dark:text-white' : 'text-icon-highlight'
          }
        >
          {homeScoreDisplay || homeScore}
        </span>
        <span className='uppercase text-[#8D8E92]'>{statistic}</span>
        <span
          id="id-percentage-team2"
          className={
            awayScore < homeScore
              ? 'text-black dark:text-white'
              : 'text-color-accent-secondary-solid-yellow-500'
          }
        >
          {awayScoreDisplay || awayScore}
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

// function calculateDistance(x1: number, y1: number, x2: number, y2: number) {
//   const dx = x2 - x1;
//   const dy = y2 - y1;
//   return Math.sqrt(dx * dx + dy * dy);
// }
