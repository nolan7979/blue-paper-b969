import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import tw from 'twin.macro';

import useTrans from '@/hooks/useTrans';

import { TwQuickViewTitleV2 } from '@/components/modules/football/tw-components';
import {
  TwBorderLinearBox,
  TwTabHead,
} from '@/components/modules/football/tw-components/TwCommon.module';

import { SportEventDto, SportEventDtoWithStat } from '@/constant/interface';
import { Images, getImage, isValEmpty } from '@/utils';

import { useSportName } from '@/hooks';
import { StreakSection } from '@/components/modules/football/match/StreakSection';
import { useEachTeamEventH2HData } from '@/hooks/useCommon';
import { SPORT } from '@/constant/common';
import TeamH2HSection from '@/components/modules/cricket/teams/TeamH2HSection';
import TeamH2HCommonEvents from '@/components/modules/cricket/teams/TeamH2HCommonEvents';

const TeamH2HEachTeamEvents = dynamic(
  () => import('@/components/modules/cricket/teams/TeamH2HEachTeamEvents')
);

const QuickViewMatchesTab = ({
  matchData,
  type2nd,
}: {
  matchData: SportEventDtoWithStat;
  type2nd?: boolean;
}) => {
  return <MatchesSection matchData={matchData} type2nd={type2nd} />;
};

export default QuickViewMatchesTab;

export const MatchesSection = ({
  matchData,
  type2nd,
}: {
  matchData: SportEventDtoWithStat;
  type2nd?: boolean;
}) => {
  const i18n = useTrans();
  const [h2HFilter, setH2HFilter] = useState<string>('h2h');
  const [showTabH2H, setShowTabH2H] = useState<boolean>(false);

  useEffect(() => {
    if(!showTabH2H){
      setH2HFilter('home')
    } else {
      setH2HFilter('h2h')
    }
  }, [showTabH2H])

  if (isValEmpty(matchData)) return <>{i18n.common.nodata}</>;

  return (
    <div className='space-y-4 px-2.5 pb-5 dark:bg-transparent lg:bg-transparent lg:px-0'>
      <H2HFilter
        h2HFilter={h2HFilter}
        setH2HFilter={setH2HFilter}
        matchData={matchData}
        i18n={i18n}
        showTabH2H={showTabH2H}
      />

      {h2HFilter === 'home' && (
        <TeamH2HEachTeamEvents
          h2HFilter={h2HFilter}
          matchData={matchData}
          i18n={i18n}
        />
      )}
      {h2HFilter === 'away' && (
        <TeamH2HEachTeamEvents
          h2HFilter={h2HFilter}
          matchData={matchData}
          i18n={i18n}
        />
      )}

      {h2HFilter === 'h2h' && (
        <TeamH2HCommonEvents
          h2HFilter={h2HFilter}
          matchData={matchData}
          i18n={i18n}
          type2nd={type2nd}
          setShowTabH2H={setShowTabH2H}
        />
      )}

      {/* <HeadMatchesTabSection matchData={matchData} /> */}
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

  const { error, isLoading } = useEachTeamEventH2HData(teamIds, SPORT.CRICKET);

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
  showTabH2H,
}: {
  h2HFilter?: string;
  setH2HFilter?: any;
  matchData?: SportEventDtoWithStat;
  i18n?: any;
  showTabH2H: boolean;
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
            'flex h-full w-full items-center justify-center gap-x-1 rounded-full',
            h2HFilter === 'home' ? 'dark:bg-button-gradient bg-dark-button' : ''
          )}
          onClick={() => setH2HFilter('home')}
        >
          <Image
            unoptimized={true}
            src={`${getImage(Images.team, homeTeam?.id, true, sport)}`}
            alt='home team'
            width={24}
            height={24}
            className='h-5 w-5'
          />
          <span className='text-csm text-white'>
            {matchData?.homeTeam?.shortName}
          </span>
        </button>
      </TwBorderLinearBox>
      {showTabH2H && <TwBorderLinearBox
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
      </TwBorderLinearBox>}
      <TwBorderLinearBox
        className={`h-full w-full !rounded-full ${
          h2HFilter === 'away' ? 'border-linear-form' : ''
        }`}
      >
        <button
          test-id='btnAway'
          className={clsx(
            'flex h-full w-full items-center justify-center gap-x-1 rounded-full',
            h2HFilter === 'away' ? 'dark:bg-button-gradient bg-dark-button' : ''
          )}
          onClick={() => setH2HFilter('away')}
        >
          <span className='text-csm text-white'>{awayTeam?.shortName}</span>
          <Image
            unoptimized={true}
            src={`${getImage(Images.team, awayTeam?.id, true, sport)}`}
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

export const TwMbQuickViewWrapper = tw.div`space-y-2 bg-light dark:bg-transparent p-2.5 px-0 lg:p-0`;
