/* eslint-disable @next/next/no-img-element */
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import tw from 'twin.macro';

import {
  useFeaturedMatchdaily,
  useLeagueTopPlayersData,
  useSelectedMatchLineupsData,
} from '@/hooks/useFootball';

import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/common';

import { useHomeStore, useMatchStore, useMatchStore2nd } from '@/stores';

import RenderIf from '@/components/common/RenderIf';
import QuickViewColumnSkeleton from '@/components/common/skeleton/quickview/QuickViewColumnSkeleton';
// import { QuickViewMatchesTab } from '@/components/modules/volleyball/quickviewColumn/quickViewMatchesTab';
import { SPORT } from '@/constant/common';
import { SportEventDto, SportEventDtoWithStat } from '@/constant/interface';
// import { useSelectedMatchData } from '@/hooks/useBasketball';
import { QuickViewFilter } from '@/modules/table-tennis/liveScore/components/QuickViewFilter';
import { isValEmpty } from '@/utils';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { twMerge } from 'tailwind-merge';
import { useSelectedMatchData } from '@/hooks/useTennis';
import React from 'react';
import QuickViewDetailTab from '@/components/modules/table-tennis/quickviewColumn/detailTab/QuickViewDetailTab';
import QuickViewStatsTab from '@/components/modules/table-tennis/quickviewColumn/QuickViewStatsTab';

const QuickViewSummary = dynamic(
  () => import('@/components/modules/table-tennis/quickviewColumn/QuickViewSummary')
);
const QuickViewMatchesTab = dynamic(
  () =>
    import(
      '@/components/modules/table-tennis/quickviewColumn/quickviewMatchsTab'
    ).then((mod) => mod.QuickViewMatchesTab),
  { ssr: false }
);
export const QuickViewColumn = ({
  top = true,
  sticky = true,
  matchId,
  isDetail,
  sport,
}: {
  top: boolean;
  isBreadCumb?: boolean;
  sticky: boolean;
  matchId?: string;
  isDetail?: boolean;
  sport?: string;
}) => {
  const [activeTab, setActiveTab] = useState<string>('details');
  const [featureMatchId, setFeatureMatchId] = useState<string | null>();
  const [firstMatch, setFirstMatch] = useState<any>({});
  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  const {
    showSelectedMatch,
    selectedMatch,
    setShowSelectedMatch,
    matchDetails,
  } = useMatchStore();

  const { data } = useSelectedMatchData(
    matchId || selectedMatch || featureMatchId || ''
  );
  // console.log(data)

  const { matches: matchesHome } = useHomeStore();

  const matchShowData = useMemo(() => {
    if (isDetail) {
      return data; // show detail match
    }
    // show selected match or feature match
    return !selectedMatch ? data || firstMatch : data;
  }, [selectedMatch, data, featureMatchId]);

  useEffect(() => {
    setActiveTab('details');
  }, [selectedMatch, matchId]);

  useEffect(() => {
    if (isDetail && !showSelectedMatch) {
      setShowSelectedMatch(true);
    }
    if (matchShowData) setFirstLoad(false);
  }, [matchShowData]);

  useEffect(() => {
    if (!selectedMatch) {
      const getMatch = matchesHome && Object.values(matchesHome)[0];
      setFirstMatch(getMatch);
      if (getMatch && !featureMatchId) setFeatureMatchId(getMatch?.id);
    } else {
      setFeatureMatchId(null);
    }
  }, [matchesHome, data]);

  const { status, lineup, has_standing, has_player_stats } =
    matchShowData || {};

  // console.log(matchShowData, matchDetails)

  return (
    <div
      className={clsx({ 'w-full lg:h-[91vh]': sticky })}
      css={[top && tw`top-[5.375rem]`, sticky && tw`sticky z-[9]`]}
    >
      <div className='h-full no-scrollbar lg:overflow-y-scroll'>
        {/* Ty so */}
        <div className={clsx({ 'lg:hidden': isDetail })}>
          <QuickViewSummary
            match={(matchShowData as SportEventDtoWithStat) || matchDetails}
            isSelectMatch={showSelectedMatch}
            isDetail={isDetail}
          />
        </div>
        <div className='space-y-4 '>
          <div className='sticky top-[3.313rem] z-10 lg:relative lg:top-0'>
            {/* Filter */}
            <QuickViewFilter
              isHaveData={!!matchShowData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              status={status}
              has_standing={has_standing}
              has_player_stats={has_player_stats}
              lineup={lineup}
            />
          </div>
          <Divider className='!mt-0'></Divider>

          <RenderIf isTrue={!matchShowData && firstLoad}>
            <QuickViewColumnSkeleton />
          </RenderIf>

          {activeTab === 'details' && (matchShowData || matchDetails) && (
            <QuickViewDetailTab
              isDetail={isDetail}
              matchData={
                (matchShowData as SportEventDtoWithStat) || matchDetails
              }
              setActiveTab={setActiveTab}
              sport={SPORT.TABLE_TENNIS}
              setTabActive={setActiveTab}
            />
          )}
          {activeTab === 'stats' && (matchShowData || matchDetails) && (
            <QuickViewStatsTab
              matchData={(matchShowData as SportEventDto) || matchDetails}
            />
          )}
          {/* {activeTab === 'squad' && (matchShowData || matchDetails) && (
            <QuickViewSquadTab
              matchData={(matchShowData as SportEventDto) || matchDetails}
            />
          )}
           */}
          {activeTab === 'matches' && (matchShowData || matchDetails) && (
            <QuickViewMatchesTab
              matchData={
                (matchShowData as SportEventDtoWithStat) || matchDetails
              }
            />
          )}
          {/* {activeTab === 'standings' &&
            matchShowData &&
            (!!has_standing || !!has_player_stats) && (
              <>
                <QuickViewStandingsTab
                  isPlayerStats={has_player_stats}
                  isStandings={has_standing}
                  wide={false}
                  isDetails={isDetail}
                  matchData={(matchShowData as SportEventDto) || matchDetails}
                />
              </>
            )}
          {activeTab === 'odds' &&
            matchShowData &&
            Object.keys(matchShowData).length > 0 && (
              <QuickViewOddsTab
                matchData={(matchShowData as SportEventDto) || matchDetails}
              />
            )}

          {activeTab === 'top-score' &&
            data &&
            Object.keys(matchShowData).length > 0 && (
              <QuickViewTopScore
                matchData={(matchShowData as SportEventDto) || matchDetails}
              />
            )} */}

          {matchShowData && Object.keys(matchShowData).length > 0 && (
            <HeadSection
              matchData={(matchShowData as SportEventDto) || matchDetails}
            ></HeadSection>
          )}
        </div>
      </div>
    </div>
  );
};

export const HeadSection = ({ matchData }: { matchData: SportEventDto }) => {
  // const { tournament, season } = matchData;
  // useSelectedMatchLineupsData(matchData?.id);

  // useTimelineData(
  //   matchData?.id,
  //   matchData?.status?.code,
  //   (value: boolean) => setIsDisabled && setIsDisabled(value)
  // );

  // tournament?.id &&
  //   season &&
  //   season?.id &&
  //   useLeagueTopPlayersData(tournament?.id, season?.id);

  return <></>;
};

export const QuickViewColumn2nd = ({
  top = true,
  sticky = true,
  type2nd = false,
}: {
  top?: boolean;
  sticky?: boolean;
  type2nd?: boolean;
}) => {
  const [activeTab, setActiveTab] = useState('details');
  // const i18n = useTrans();
  const { t } = useTranslation();
  const { showSelectedMatch, selectedMatch, setShowSelectedMatch } =
    useMatchStore2nd();

  if (isValEmpty(selectedMatch) || !showSelectedMatch) {
    setShowSelectedMatch(false);
  }

  const { data, isLoading } = useSelectedMatchData(
    selectedMatch || '',
    15000,
    10000
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || Object.keys(data).length === 0) {
    return <></>;
  }

  const { tournament, roundInfo, lineup, status, season } =
    data as SportEventDto;
  const { category } = tournament;
  let round = '';
  if (!isValEmpty(roundInfo.round) && roundInfo.name) {
    round = `, ${roundInfo.name}`;
  } else if (!isValEmpty(roundInfo.round)) {
    round = `, ${t('football:football.round')} ${roundInfo.round}`;
  }

  return (
    <div
      className='h-[91vh]'
      css={[top && tw`top-16`, sticky && tw`sticky z-10`]}
    >
      <div className='h-full space-y-4 overflow-y-scroll no-scrollbar'>
        <div className='flex justify-between '>
          <div className=' flex items-center gap-2 overflow-hidden text-xs font-extralight'>
            <BreadCumbLink
              href={`/country/football/${category ? category.slug : ''}`}
              name={category ? category.name : ''}
            />
            <BreadCrumbSep></BreadCrumbSep>
            <BreadCumbLink
              href={`/competition/${tournament.slug}/${
                tournament?.id || tournament?.id
              }`}
              name={`${tournament.name}${round}`}
              classes=' '
            />
          </div>
          <button
            className='item-hover rounded-lg p-1 dark:text-dark-text'
            onClick={() => setShowSelectedMatch(false)}
          >
            <HiOutlineX className='h-5 w-6'></HiOutlineX>
          </button>
        </div>
        {/* Ty so */}
        {data && Object.keys(data).length > 0 && (
          <QuickViewSummary
            match={data as SportEventDtoWithStat}
            isSelectMatch={showSelectedMatch}
          />
        )}

        {/* Filter */}
        <QuickViewFilter
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lineup={lineup}
          status={status}
        />
        <Divider></Divider>

        {activeTab === 'details' && data && Object.keys(data).length !== 0 && (
          <QuickViewDetailTab
            matchData={data as SportEventDtoWithStat}
            sport={SPORT.BASKETBALL}
          />
        )}
        {/* {activeTab === 'squad' && data && Object.keys(data).length !== 0 && (
          <QuickViewSquadTab matchData={data as SportEventDto} />
        )}
        {activeTab === 'stats' && data && Object.keys(data).length !== 0 && (
          <QuickViewStatsTab matchData={data as SportEventDto} />
        )}
        {activeTab === 'matches' && data && Object.keys(data).length !== 0 && (
          <QuickViewMatchesTab
            matchData={data as SportEventDtoWithStat}
            type2nd={true}
          />
        )} */}
        {/* {activeTab === 'standings' &&
          data &&
          Object.keys(data).length !== 0 && (
            <>
              <QuickViewStandingsTab
                wide={false}
                matchData={data as SportEventDto}
              />
            </>
          )}
        {activeTab === 'odds' && data && Object.keys(data).length !== 0 && (
          <QuickViewOddsTab matchData={data as SportEventDto} />
        )} */}
      </div>
    </div>
  );
};

export const Divider = ({ className }: { className?: string }) => {
  return <div className={clsx(twMerge(className, 'divide-single'))}></div>;
};

export const TwQuickviewTeamName = tw.div`text-center text-sm font-bold text-dark-dark-blue dark:text-white`;
