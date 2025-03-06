/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';
import tw from 'twin.macro';

import useTrans from '@/hooks/useTrans';

import { StreakSection } from '@/components/modules/basketball/match/StreakSection';
import { TwQuickViewTitleV2 } from '@/components/modules/football/tw-components';
import {
  TwBorderLinearBox,
  TwTabHead,
} from '@/components/modules/football/tw-components/TwCommon.module';

import { SPORT } from '@/constant/common';
import { SportEventDto, SportEventDtoWithStat } from '@/constant/interface';
import { useEachTeamEventH2HData } from '@/hooks/useCommon';
import { Images, getImage, isValEmpty } from '@/utils';

const BkbTeamH2HCommonEvents = dynamic(
  () => import('@/components/modules/basketball/teams/BkbTeamH2HCommonEvents'),
  { ssr: false }
);
const BkbTeamH2HEachTeamEvents = dynamic(
  () =>
    import('@/components/modules/basketball/teams/BkbTeamH2HEachTeamEvents'),
  { ssr: false }
);

const QuickViewMatchesTab = ({
  matchData,
  type2nd,
  isDetail,
}: {
  matchData: SportEventDtoWithStat;
  type2nd?: boolean;
  isDetail?: boolean;
}) => {
  return (
    <>
      <MatchesSection matchData={matchData} type2nd={type2nd} isDetail={isDetail}></MatchesSection>
      <StreakSection matchData={matchData}></StreakSection>
    </>
  );
};
export default QuickViewMatchesTab;

export const MatchesSection = ({
  matchData,
  type2nd,
  isDetail,
}: {
  matchData: SportEventDtoWithStat;
  type2nd?: boolean;
  isDetail?: boolean;
}) => {
  const i18n = useTrans();
  const [h2HFilter, setH2HFilter] = useState<string>('h2h');
  if (isValEmpty(matchData)) return <>{i18n.common.nodata}</>;

  return (
    <div className='space-y-4  px-2.5 pb-5 dark:bg-transparent lg:bg-transparent lg:px-0'>
      <TwQuickViewTitleV2 className='mb-3 text-center xl:text-left'>
        {i18n.titles.recent_poise}
      </TwQuickViewTitleV2>
      <H2HFilter
        h2HFilter={h2HFilter}
        setH2HFilter={setH2HFilter}
        matchData={matchData}
        i18n={i18n}
      />

      {h2HFilter === 'home' && (
        <BkbTeamH2HEachTeamEvents
          h2HFilter={h2HFilter}
          matchData={matchData}
          i18n={i18n}
          isDetail={isDetail}
        />
      )}
      {h2HFilter === 'away' && (
        <BkbTeamH2HEachTeamEvents
          h2HFilter={h2HFilter}
          matchData={matchData}
          i18n={i18n}
          isDetail={isDetail}
        />
      )}

      {h2HFilter === 'h2h' && (
        <BkbTeamH2HCommonEvents
          h2HFilter={h2HFilter}
          matchData={matchData}
          i18n={i18n}
          type2nd={type2nd}
          isDetail={isDetail}
        />
      )}

      <HeadMatchesTabSection matchData={matchData} />
    </div>
  );
};

export const HeadMatchesTabSection = ({
  matchData,
}: {
  matchData: SportEventDto;
}) => {
  const teamIds = [matchData.homeTeam?.id, matchData.awayTeam?.id].filter(
    Boolean
  ) as string[];

  const { error, isLoading } = useEachTeamEventH2HData(teamIds, SPORT.BASKETBALL);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  // Render your component using the fetched data
  return <div>{/* Render your component content here */}</div>;
};

export const TwMatchFilterContainer = tw.div`flex space-x-8 justify-center px-2 lg:px-0`;

export const H2HFilter = ({
  h2HFilter,
  setH2HFilter,
  matchData,
  i18n,
}: {
  h2HFilter?: string;
  setH2HFilter?: any;
  matchData?: any;
  i18n?: any;
}) => {
  const { homeTeam = {}, awayTeam = {} } = matchData || {};
  return (
    <TwTabHead>
      <TwBorderLinearBox
        className={`h-full w-full !rounded-full ${
          h2HFilter === 'home' ? 'border-linear-form' : ''
        }`}
      >
        <button
          className={clsx(
            'flex h-full w-full items-center justify-center rounded-full',
            h2HFilter === 'home' ? 'dark:bg-button-gradient bg-dark-button' : ''
          )}
          onClick={() => setH2HFilter('home')}
        >
          <Image
            unoptimized={true}
            src={`${getImage(
              Images.team,
              homeTeam?.id,
              true,
              SPORT.BASKETBALL
            )}`}
            alt='home team'
            width={24}
            height={24}
            className='h-5 w-5'
          />
        </button>
      </TwBorderLinearBox>
      <TwBorderLinearBox
        className={`h-full w-full !rounded-full ${
          h2HFilter === 'h2h' ? 'border-linear-form' : ''
        }`}
      >
        <button
          className={clsx(
            'flex h-full w-full items-center justify-center rounded-full ',
            h2HFilter === 'h2h'
              ? 'dark:bg-button-gradient bg-dark-button text-white'
              : ''
          )}
          onClick={() => setH2HFilter('h2h')}
        >
          <span className='text-csm'>{i18n.filter.h2h}</span>
        </button>
      </TwBorderLinearBox>
      <TwBorderLinearBox
        className={`h-full w-full !rounded-full ${
          h2HFilter === 'away' ? 'border-linear-form' : ''
        }`}
      >
        <button
          className={clsx(
            'flex h-full w-full items-center justify-center rounded-full',
            h2HFilter === 'away' ? 'dark:bg-button-gradient bg-dark-button' : ''
          )}
          onClick={() => setH2HFilter('away')}
        >
          <Image
            unoptimized={true}
            src={`${getImage(
              Images.team,
              awayTeam?.id,
              true,
              SPORT.BASKETBALL
            )}`}
            alt='away team'
            width={24}
            height={24}
            className='h-5 w-5'
          />
        </button>
      </TwBorderLinearBox>
    </TwTabHead>
  );
};

export const TwMbQuickViewWrapper = tw.div`space-y-2 bg-light dark:bg-transparent
p-2.5 px-0 lg:p-0`;
