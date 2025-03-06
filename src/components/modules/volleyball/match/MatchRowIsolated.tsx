import clsx from 'clsx';
import { useTheme } from 'next-themes';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import {
  TwBellCol,
  TwMatchRow,
  TwOddsCol,
  TwTeamNameCol,
  TwTeamScoreCol,
} from '@/components/modules/football/tw-components';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';

import {
  ISelectBookMaker,
  useMatchStore,
  useOddsStore,
  useSettingsStore,
  useSitulations,
} from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import { INITIAL_COLORS } from '@/constant/colors';
import { SPORT } from '@/constant/common';
import {
  MatchOdd,
  MatchOddTestStore,
  SportEventDtoWithStat,
} from '@/constant/interface';
import { Colors, Odds, OddsRowProps } from '@/models/mathIsolated';
import MatchScoreColumn from '@/modules/volleyball/liveScore/components/MatchScoreColumn';
import {
  convertOdds,
  isMatchHaveStatVlb,
  isMatchInprogressVlb,
  isMatchNotStartedVlb,
  MatchStateVolleyball,
} from '@/utils';
import { determineColor } from '@/utils/matchingColor';
import { timeStampFormat } from '@/utils/timeStamp';
import ExcludeSVG from '~/svg/exclude.svg';
import { Score } from '@/components/modules/tennis';
import MatchTimestamp from '@/components/modules/volleyball/match/MatchTimeStamp';
import ClosedSVG from '/public/svg/closed.svg';
import VolleyballSVG from '/public/svg/live/volleyball.svg';
import Button from '@/components/buttons/Button';
import Transition from '@/components/common/Transition';
import AvatarTeamCommon from '@/components/common/AvatarTeamCommon';

export interface IMatchRowIsolatedProps {
  match: SportEventDtoWithStat;
  homeSound: string;
  i18n?: any;
  theme?: string;
  isSimulator?: boolean;
  isDetail?: boolean;
  onClick?: (e: SportEventDtoWithStat) => void;
  sport?: string;
}

export const MatchRowIsolated: React.FC<IMatchRowIsolatedProps> = ({
  match,
  i18n,
  isDetail,
  sport,
  theme,
  onClick,
  isSimulator
}) => {
  const { showSelectedMatch, selectedMatch } = useMatchStore();
  const {
    homeTeam,
    awayTeam,
    startTimestamp = 0,
    id,
    time,
    status,
    uniqueTournament,
    scores,
    serve
  } = match;

  const { ft, ...scoresRest } = scores || {};
  const { currentPeriodStartTimestamp, remainTime } = time || {};

  const matchFollowed = useFollowStore((state) => state.followed.match);
  const { formattedTime, formattedDate } = timeStampFormat(startTimestamp);
  const { addMatches, removeMatches } = useFollowStore();
  const { setSitulations } = useSitulations();

  const [isFollowed, setIsFollowed] = useState(() => {
    const isMatchFollowed = matchFollowed.some(
      (item: any) => item.matchId === id
    );
    return isMatchFollowed;
  });

  const isSelectedMatch = selectedMatch == id && showSelectedMatch;
  const isDark = theme === 'dark';
  // to save local favorite

  const changeFollow = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isFollowed) {
      removeMatches(id);
      setIsFollowed(false);
    } else {
      if (match?.uniqueTournament)
        addMatches(
          id,
          formattedTime,
          formattedDate,
          match?.uniqueTournament?.id,
          match?.uniqueTournament.category?.name || '',
          match?.uniqueTournament?.name || '',
          match?.tournament?.name || '',
          sport
        );
      setIsFollowed(true);
    }
  };
  const isFinished = [MatchStateVolleyball.ENDED].includes(status.code);

  const handleOpenMatchLive = (e: any) => {
    e.stopPropagation();
    setSitulations(match.id);
  };

  if (!match || Object.keys(match).length === 0)
    return <MatchSkeletonMapping />;
  return (
    <TwMatchRow
      data-testid='match-row' // Add the 'data-' prefix to the 'testId' prop
      id={match.id}
      className={clsx(
        'dark:border-linear-box cursor-pointer border border-line-default bg-white  py-2.5 text-csm dark:border-0 dark:bg-primary-gradient',
        {
          'dark:!border-all-blue': isSelectedMatch,
        }
      )}
      onClick={() => onClick && onClick(match)}
    >
      {uniqueTournament && (
        <MatchTimestamp
          type='league'
          startTimestamp={startTimestamp}
          status={status}
          id={id}
          i18n={i18n}
          currentPeriodStartTimestamp={currentPeriodStartTimestamp}
          remainTime={remainTime}
          competition={uniqueTournament}
          showTime={false}
          sport={sport}
        />
      )}

      <TwTeamScoreCol className=' flex w-1/4 items-center '>
        <TwTeamNameCol className=''>
          <div className=' flex items-center gap-2' test-id='club1-info'>
            <div className=' min-w-5' test-id='club1-logo'>
              <AvatarTeamCommon
                team={homeTeam}
                size={20}
                sport={sport}
                onlyImage
              />
            </div>
            <TwTeamName>{homeTeam?.name}</TwTeamName>
            {serve == 1 && (
              <Transition>
                <div className='flex h-3 w-3 items-center justify-center'>
                  <VolleyballSVG className='h-3 w-3' />
                </div>
              </Transition>
            )}
            {/* <div className=' ml-1 flex items-center gap-0.5'>
              {homeRedCards > 0 && showRedCard && (
                <RedCard numCards={homeRedCards} size='xs' />
              )}
              {homeYellowCards > 0 && showYellowCard && (
                <YellowCard numCards={homeYellowCards} size='xs' />
              )}
            </div> */}
          </div>
          <div className=' flex gap-2' test-id='club2-info'>
            <div className=' min-w-5' test-id='club2-logo'>
              <AvatarTeamCommon
                team={awayTeam}
                size={20}
                sport={sport}
                onlyImage
              />
            </div>
            <TwTeamName>{awayTeam?.name}</TwTeamName>
            {serve == 2 && (
              <Transition>
                <div className='flex h-3 w-3 items-center justify-center'>
                  <VolleyballSVG className='h-3 w-3' />
                </div>
              </Transition>
            )}
          </div>
        </TwTeamNameCol>

        <div className='flex items-center gap-x-1' test-id='score-info'>
          {!isDetail &&
            isSimulator &&
            !isMatchNotStartedVlb(match?.status?.code) && (
              <Button
                style={{
                  background: isDark ? 'rgba(9, 55, 148, 0.28)' : '#EAEAEA',
                }}
                onClick={handleOpenMatchLive}
                className='hidden rounded-full border-none !p-1 lg:block'
                test-id='view-stimulation'
                aria-label='view-stimulation'
              >
                <ExcludeSVG className='text-black dark:text-white' />
              </Button>
            )}
          {isMatchInprogressVlb(status.code) && ft && ft.length > 0 && (
            <Score scores={scoresRest} status={status} />
          )}
          {isMatchHaveStatVlb(status?.code) && ft && ft.length > 0 && (
            <MatchScoreColumn
              code={status.code}
              homeScore={ft[0]}
              awayScore={ft[1]}
            />
          )}
        </div>
      </TwTeamScoreCol>
      <TwBellCol className={clsx({ '!justify-center': isFinished })}>
        {/* {!isFinished && (
          <BellIcon isBellOn={isBellOn} changeBellOn={changeBellOn} />
        )} */}
        <div onClick={(e) => changeFollow(e)} test-id='star-follow'>
          {isFollowed ? (
            <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />
          ) : (
            <StarBlank className='inline-block h-4 w-4 cursor-pointer' />
          )}
        </div>
      </TwBellCol>
    </TwMatchRow>
  );
};

export const OddsRow = ({
  odd1,
  odd2,
  odd3,
  keyIndex,
  selectedBookMaker,
  oddsType,
  theme = 'light',
}: OddsRowProps & { i18n?: any }) => {
  const prevOddsRef = useRef<Odds>({
    odd1: parseFloat(odd1),
    odd2: parseFloat(odd2),
    odd3: parseFloat(odd3),
  });
  const prevBookMaket = useRef<ISelectBookMaker>(selectedBookMaker!);
  const { resolvedTheme } = useTheme(); // Get the theme using next-themes

  const [colors, setColors] = useState<Colors>({
    color1: 'inherit',
    color2: 'inherit',
    color3: 'inherit',
  });

  useEffect(() => {
    const newOdds: Odds = {
      odd1: parseFloat(odd1),
      odd2: parseFloat(odd2),
      odd3: parseFloat(odd3),
    };

    const newColors: Colors = {
      color1: determineColor(
        newOdds.odd1,
        prevOddsRef.current.odd1,
        INITIAL_COLORS,
        theme
      ),
      color2: determineColor(
        newOdds.odd2,
        prevOddsRef.current.odd2,
        INITIAL_COLORS,
        theme
      ),
      color3: determineColor(
        newOdds.odd3,
        prevOddsRef.current.odd3,
        INITIAL_COLORS,
        theme
      ),
    };
    prevOddsRef.current = newOdds;
    // Update previous odds references
    if (prevBookMaket.current.id === selectedBookMaker?.id) {
      setColors(newColors);
    } else {
      prevBookMaket.current = selectedBookMaker!;
      setColors({ color1: 'inherit', color2: 'inherit', color3: 'inherit' });
    }

    // Clear color after 3 seconds
    const timeoutId = setTimeout(
      () =>
        setColors({ color1: 'inherit', color2: 'inherit', color3: 'inherit' }),
      10000
    );

    // Cleanup timeout
    return () => clearTimeout(timeoutId);
  }, [odd1, odd2, odd3]);

  useEffect(() => {
    setColors({ color1: 'inherit', color2: 'inherit', color3: 'inherit' });
  }, [resolvedTheme]);

  const getTextColor = (color?: string): string => {
    if (color && color !== 'inherit') {
      switch (color) {
        case INITIAL_COLORS.bgColor1:
        case INITIAL_COLORS.bgColorDark1:
          return resolvedTheme === 'light'
            ? INITIAL_COLORS.colorReduce
            : INITIAL_COLORS.colorReduceDark;

        default:
          return resolvedTheme === 'light'
            ? INITIAL_COLORS.colorIncrease
            : INITIAL_COLORS.colorIncreaseDark;
      }
    }
    return keyIndex === 'hdp'
      ? INITIAL_COLORS.color2
      : keyIndex === 'tx'
      ? INITIAL_COLORS.color1
      : 'inherit';
  };

  if (!odd1 && !odd2 && !odd3) {
    return <></>;
  }

  return (
    <div key={keyIndex} className='flex items-center gap-x-1'>
      {Object.entries({ odd1, odd2, odd3 }).map(([key, value], index) => (
        <div
          key={key}
          className={`min-w-[34px] flex-1 rounded px-1 text-center text-msm font-normal ${
            colors[`color${index + 1}` as keyof Colors] !== 'inherit'
              ? 'fade-out'
              : 'fade-in'
          }`}
          style={{
            background: colors[`color${index + 1}` as keyof Colors],
            color: getTextColor(colors[`color${index + 1}` as keyof Colors]),
          }}
        >
          {value && convertOdds(value, keyIndex, oddsType, index + 1)}
        </div>
      ))}
    </div>
  );
};

const LockOdds: React.FC = () => {
  const numbersArray2 = Array.from({ length: 3 }, (_, index) => index + 1);
  return (
    <div className='flex justify-between gap-x-2'>
      {numbersArray2.map((item) => (
        <div
          className='flex min-w-[34px] items-center justify-center'
          key={item}
        >
          <ClosedSVG />
        </div>
      ))}
    </div>
  );
};

const OddsColumn = ({
  matchOdds,
  matchTestStore,
  i18n,
  oddsType,
  theme,
}: {
  matchOdds: MatchOdd | undefined;
  matchTestStore: MatchOddTestStore;
  i18n?: any;
  oddsType: string;
  theme?: string;
}) => {
  const { selectedBookMaker } = useOddsStore();
  const { show1x2, showHdp, showTX } = useSettingsStore();

  const displayOdds = useMemo(() => {
    const odds: any[] = [];

    if (matchOdds || matchTestStore) {
      if (showHdp) {
        if (!matchTestStore.close_asian) {
          odds.push(
            <OddsRow
              keyIndex='hdp'
              theme={theme}
              key='handicap'
              oddsType={oddsType}
              selectedBookMaker={selectedBookMaker}
              odd1={
                matchTestStore?.asian_hdp_home ||
                (matchOdds?.asian_hdp_home as string)
              }
              odd2={
                matchTestStore?.asian_hdp || (matchOdds?.asian_hdp as string)
              }
              odd3={
                matchTestStore?.asian_hdp_away ||
                (matchOdds?.asian_hdp_away as string)
              }
            />
          );
        } else {
          odds.push(<LockOdds key='handicap' />);
        }
      }

      if (show1x2) {
        if (!matchTestStore.close_european) {
          odds.push(
            <OddsRow
              keyIndex='1x2'
              theme={theme}
              key='european'
              oddsType={oddsType}
              selectedBookMaker={selectedBookMaker}
              odd1={
                matchTestStore?.european_home ||
                (matchOdds?.european_home as string)
              }
              odd2={
                matchTestStore?.european_draw ||
                (matchOdds?.european_draw as string)
              }
              odd3={
                matchTestStore?.european_away ||
                (matchOdds?.european_away as string)
              }
            />
          );
        } else {
          odds.push(<LockOdds key='european' />);
        }
      }

      if (showTX) {
        if (!matchTestStore.over_under_close) {
          odds.push(
            <OddsRow
              keyIndex='tx'
              key='over_under'
              theme={theme}
              oddsType={oddsType}
              selectedBookMaker={selectedBookMaker}
              odd1={matchTestStore?.over || (matchOdds?.over as string)}
              odd2={
                matchTestStore?.over_under_hdp ||
                (matchOdds?.over_under_hdp as string)
              }
              odd3={matchTestStore?.under || (matchOdds?.under as string)}
            />
          );
        } else {
          odds.push(<LockOdds key='over_under' />);
        }
      }
    }
    return odds;
  }, [matchOdds, matchTestStore, theme, selectedBookMaker]);

  return (
    <>
      <TwOddsCol className='flex gap-1.5'>{displayOdds}</TwOddsCol>
    </>
  );
};

export default OddsColumn;
