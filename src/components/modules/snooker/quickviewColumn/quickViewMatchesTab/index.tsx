import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import tw from 'twin.macro';

import useTrans from '@/hooks/useTrans';

import { TwQuickViewTitleV2 } from '@/components/modules/football/tw-components';
import {
  TwBorderLinearBox,
  TwTabHead,
} from '@/components/modules/football/tw-components/TwCommon.module';

import { SportEventDto, SportEventDtoWithStat } from '@/constant/interface';
import { isValEmpty } from '@/utils';

import Avatar from '@/components/common/Avatar';
import TeamH2HSection from '@/components/modules/snooker/teams/TeamH2HSection';
import { SPORT } from '@/constant/common';
import { useSportName } from '@/hooks';
import { useEachTeamEventH2HData } from '@/hooks/useCommon';

const TeamH2HEachTeamEvents = dynamic(
  () => import('@/components/modules/snooker/teams/TeamH2HEachTeamEvents')
);
const TeamH2HCommonEvents = dynamic(
  () => import('@/components/modules/snooker/teams/TeamH2HCommonEvents')
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
    <div className='space-y-8'>
      <MatchesSection
        matchData={matchData}
        type2nd={type2nd}
        isDetail={isDetail}
      />
      {/* <StreakSection matchData={matchData}></StreakSection> */}
    </div>
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
    <div className='space-y-4 px-2.5 dark:bg-transparent lg:bg-transparent lg:px-0'>
      <TwQuickViewTitleV2 className='mb-3 hidden lg:block'>
        {i18n.titles.past_match}
      </TwQuickViewTitleV2>
      <H2HFilter
        h2HFilter={h2HFilter}
        setH2HFilter={setH2HFilter}
        matchData={matchData}
        i18n={i18n}
      />

      {h2HFilter === 'home' && (
        <TeamH2HEachTeamEvents
          h2HFilter={h2HFilter}
          matchData={matchData}
          i18n={i18n}
          isDetail={isDetail}
        />
      )}
      {h2HFilter === 'away' && (
        <TeamH2HEachTeamEvents
          h2HFilter={h2HFilter}
          matchData={matchData}
          i18n={i18n}
          isDetail={isDetail}
        />
      )}
      {h2HFilter === 'h2h' && (
        <TeamH2HCommonEvents
          h2HFilter={h2HFilter}
          matchData={matchData}
          i18n={i18n}
          isDetail={isDetail}
        />
      )}

      {/* <HeadMatchesTabSection matchData={matchData} /> */}
      <TeamH2HSection matchData={matchData} i18n={i18n} />
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

  const { error, isLoading } = useEachTeamEventH2HData(teamIds, SPORT.FOOTBALL);

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
  matchData?: SportEventDtoWithStat;
  i18n?: any;
}) => {
  const sport = useSportName();
  const { homeTeam, awayTeam } = matchData || {};
  return (
    <TwTabHead>
      <TwBorderLinearBox
        className={`h-full w-full !rounded-full ${
          h2HFilter === 'home' ? 'border-linear-form' : ''
        }`}
      >
        <button
          test-id='btn-home-recent-poise'
          className={clsx(
            'flex h-full w-full items-center justify-center gap-x-1 rounded-full px-2',
            h2HFilter === 'home' ? 'dark:bg-button-gradient bg-dark-button' : ''
          )}
          onClick={() => setH2HFilter('home')}
        >
          <Avatar
            id={homeTeam?.id}
            height={24}
            width={24}
            sport={sport}
            type='competitor'
          />
        </button>
      </TwBorderLinearBox>
      <TwBorderLinearBox
        className={`h-full w-full !rounded-full ${
          h2HFilter === 'h2h' ? 'border-linear-form' : ''
        }`}
      >
        <button
          test-id='btn-h2h'
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
          test-id='btnAway'
          className={clsx(
            'flex h-full w-full items-center justify-center gap-x-1 rounded-full px-2',
            h2HFilter === 'away' ? 'dark:bg-button-gradient bg-dark-button' : ''
          )}
          onClick={() => setH2HFilter('away')}
        >
          <Avatar
            id={awayTeam?.id}
            height={24}
            width={24}
            sport={sport}
            type='competitor'
          />
        </button>
      </TwBorderLinearBox>
    </TwTabHead>
  );
};

export const TwMbQuickViewWrapper = tw.div`space-y-2 bg-light dark:bg-transparent`;
