import clsx from 'clsx';
import { useTheme } from 'next-themes';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMessage } from '@/hooks/useFootball/useMessage';
import ExcludeSVG from '~/svg/exclude.svg';

import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { RedCard, YellowCard } from '@/components/modules/football/Cards';
import ConnerColumn from '@/components/modules/football/CornerColumn';
import { BellIcon } from '@/components/modules/football/match/BellIcon';
import MatchTimeStamp from '@/components/modules/football/match/MatchTimeStamp';
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
  useOddsStore,
  useSettingsStore,
  useSitulations
} from '@/stores';
import { useFollowStore } from '@/stores/follow-store';
import { useMatchNotify } from '@/stores/notification-store';

import { audioArray } from '@/constant/audioArray';
import { INITIAL_COLORS } from '@/constant/colors';
import { SPORT } from '@/constant/common';
import {
  FinishedStates,
  MatchOdd,
  MatchOddTestStore,
  SportEventDtoWithStat,
} from '@/constant/interface';
import { Colors, Odds, OddsRowProps } from '@/models/mathIsolated';
import MatchScoreColumn from '@/modules/football/liveScore/components/MatchScoreColumn';
import { convertOdds, isMatchNotStarted } from '@/utils';
import { determineColor } from '@/utils/matchingColor';
import { timeStampFormat } from '@/utils/timeStamp';

import Button from '@/components/buttons/Button';
import ClosedSVG from '/public/svg/closed.svg';
import AvatarTeamCommon from '@/components/common/AvatarTeamCommon';

export interface IMatchRowIsolatedProps {
  match: SportEventDtoWithStat;
  showYellowCard?: boolean;
  showRedCard?: boolean;
  homeSound?: string;
  matchOdds?: MatchOdd | undefined;
  showSelectedMatch?: boolean;
  selectedMatch?: string | null;
  i18n?: any;
  theme?: string;
  isSimulator?: boolean;
  isDetail?: boolean;
  onClick?: (e: SportEventDtoWithStat) => void;
  sport?: string;
}

export const MatchRowIsolated: React.FC<IMatchRowIsolatedProps> = memo(({
  match,
  showYellowCard,
  showRedCard,
  homeSound,
  matchOdds,
  showSelectedMatch,
  selectedMatch,
  i18n,
  isDetail,
  theme = 'light',
  sport = SPORT.FOOTBALL,
  onClick,
  isSimulator = true,
}) => {
  // const { width } = useWindowSize();
  // const router = useRouter();
  // const { selectedBookMaker, showOdds, oddsType } = useOddsStore();
  // const { OddAsianHandicap, OddOverUnder, OddEuropean } = useTestStore();
  // // const matchOddsStore = mappingOddsTestStore({
  //   OddAsianHandicap: OddAsianHandicap,
  //   OddOverUnder: OddOverUnder,
  //   OddEuropean: OddEuropean,
  //   matchMapping: match.is_id!,
  //   bookMakerId: selectedBookMaker?.id?.toString(),
  // });

  // const {
  //   showSelectedMatch,
  //   selectedMatch,
  //   // setShowSelectedMatch,
  //   // setSelectedMatch,
  //   // setMatchDetails,
  // } = useMatchStore();
  // const {
  //   setShowSelectedMatch: setShowSelectedMatch2nd,
  //   setSelectedMatch: setSelectedMatch2nd,
  //   // toggleShowSelectedMatch,
  // } = useMatchStore2nd();


  const {
    homeTeam,
    awayTeam,
    startTimestamp = 0,
    homeYellowCards = 0,
    awayYellowCards = 0,
    homeRedCards = 0,
    awayRedCards = 0,
    homeCornerKicks,
    awayCornerKicks,
    id,
    time,
    status,
    slug,
    tournament,
  } = match || {};

  const { currentPeriodStartTimestamp } = time || {};
  
  const { mutate } = useMessage();
  const {
    matches: matchesNotify,
    addMore: addMoreMatchNotify,
    removeId,
  } = useMatchNotify();
  // const path = useConvertPath();
  const matchFollowed = useFollowStore((state) => state.followed.match);
  const { formattedTime, formattedDate } = timeStampFormat(startTimestamp);
  const { addMatches, removeMatches } = useFollowStore();
  const { setSitulations } = useSitulations();

  const [isClickBlocked, setIsClickBlocked] = useState(false);
  const [isBellOn, setIsBellOn] = useState<boolean>(matchesNotify.includes(id));
  const [isFollowed, setIsFollowed] = useState(() => {
    const isMatchFollowed = matchFollowed.some(
      (item: any) => item.matchId === id
    );
    return isMatchFollowed;
  });

  const isSelectedMatch = selectedMatch == id && showSelectedMatch;

  const changeFollow = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (isFollowed) {
        removeMatches(id);
        setIsFollowed(false);
      } else {
        addMatches(
          id,
          formattedTime,
          formattedDate,
          match?.tournament?.id,
          match?.tournament.category?.name || '',
          match?.tournament?.name || '',
          match?.uniqueTournament?.name || '',
          sport
        );
        setIsFollowed(true);
      }
    },
    [
      isFollowed,
      id,
      formattedTime,
      formattedDate,
      match,
      addMatches,
      removeMatches,
    ]
  );

  const changeBellOn = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (isClickBlocked) {
        alert('Please wait before clicking again!');
        return;
      }
      setIsClickBlocked(true);
      if (isBellOn) {
        setIsBellOn(false);
        mutate({
          matchId: id,
          isSubscribe: false,
          locale: i18n ? i18n.language : 'en',
          type: 'match',
        });
        removeId(id);
      } else {
        setIsBellOn(true);
        mutate({
          matchId: id,
          isSubscribe: true,
          locale: i18n ? i18n.language : 'en',
          type: 'match',
        });
        addMoreMatchNotify(id);
      }

      setTimeout(() => {
        setIsClickBlocked(false);
      }, 2000);
    },
    [isClickBlocked, isBellOn, id, i18n, mutate, addMoreMatchNotify, removeId]
  );

  const handleOpenMatchLive = useCallback(
    (e: any) => {
      e.stopPropagation();
      setSitulations(match?.id);
    },
    [match?.id, setSitulations]
  );

  useEffect(() => {
    if (isBellOn) {
      const timer = setTimeout(() => {
        const numericHomeSound = parseInt(homeSound || '', 10);

        if (!isNaN(numericHomeSound) && Number.isInteger(numericHomeSound)) {
          const audio = new Audio(audioArray[numericHomeSound - 1]);
          audio.play();
        }

        // setShouldExecuteAction(false);
      }, 5000);

      // setShouldExecuteAction(true);

      return () => clearTimeout(timer);
    }
  }, [isBellOn, homeSound]);

  useEffect(() => {
    if (isBellOn) {
      const timer = setTimeout(() => {
        const numericHomeSound = parseInt(homeSound || '', 10);

        if (!isNaN(numericHomeSound) && Number.isInteger(numericHomeSound)) {
          const audio = new Audio(audioArray[numericHomeSound - 1]);
          audio.play();
        }

        // setShouldExecuteAction(false);
      }, 5000);

      // setShouldExecuteAction(true);

      return () => clearTimeout(timer);
    }
  }, [isBellOn, homeSound]);

  const isFinished = FinishedStates.includes(status?.code);

  const isShowSimulator = isSimulator && !isFinished;

  if (!match || (match && Object.keys(match).length === 0))
    return <MatchSkeletonMapping />;

  const teamScoreCol = useMemo(
    () => (
      <TwTeamScoreCol className=' flex w-1/4 items-center '>
        <TwTeamNameCol className=''>
          <div className=' flex items-center gap-2' test-id='club1-info'>
            <div className=' min-w-5' test-id='club1-logo' onClick={(e) => e.stopPropagation()}>
              <AvatarTeamCommon
                team={homeTeam}
                size={20}
                sport={sport}
                onlyImage
              />
            </div>
            <TwTeamName>{homeTeam?.name}</TwTeamName>
            <div className=' ml-1 flex items-center gap-0.5'>
              {homeRedCards > 0 && (
                <RedCard numCards={homeRedCards} size='xs' />
              )}
              {match?.homeScore?.red_card && match?.homeScore?.red_card > 0 ? <RedCard numCards={match?.homeScore?.red_card} size='xs' /> : ''}
              {homeYellowCards > 0 && showYellowCard && (
                <YellowCard numCards={homeYellowCards} size='xs' />
              )}
            </div>
          </div>
          <div className=' flex gap-2' test-id='club2-info'>
            <div test-id='club2-logo' onClick={(e) => e.stopPropagation()}>
              <AvatarTeamCommon
                team={awayTeam}
                size={20}
                sport={sport}
                onlyImage
              />
            </div>
            <TwTeamName>{awayTeam?.name}</TwTeamName>
            <div className=' ml-1 flex items-center gap-0.5'>
              {awayRedCards > 0 && (
                <RedCard numCards={awayRedCards} size='xs' />
              )}
              {match?.awayScore?.red_card && match?.awayScore?.red_card > 0 ? <RedCard numCards={match?.awayScore?.red_card} size='xs' /> : ''}
              {awayYellowCards > 0 && showYellowCard && (
                <YellowCard numCards={awayYellowCards} size='xs' />
              )}
            </div>
          </div>
        </TwTeamNameCol>

        {/* {isShowOdds(path) && showOdds && !isDetail && (
        <OddsColumn
          matchOdds={matchOdds}
          i18n={i18n}
          oddsType={oddsType}
          theme={theme}
          matchTestStore={matchOddsStore}
        ></OddsColumn>
      )} */}
        <div className='flex items-center gap-x-1' test-id='score-info'>
          {!isDetail &&
            isShowSimulator &&
            !isMatchNotStarted(match?.status?.code) && (
              <Button
                onClick={handleOpenMatchLive}
                className='hidden rounded-full border-none !bg-[#EAEAEA] dark:!bg-[#151820] px-1.5 py-0.5 lg:block'
                test-id='view-stimulation'
                aria-label='view-stimulation'
              >
                <ExcludeSVG className="text-black dark:text-white" />
              </Button>
            )}
          {match?.homeScore && match?.awayScore && Object.keys(match?.homeScore).length !== 0 &&
            Object.keys(match?.awayScore).length !== 0 && (
              <MatchScoreColumn
                code={status?.code}
                homeScore={match?.homeScore?.display!}
                awayScore={match?.awayScore?.display!}
              />
            )}
          {!isMatchNotStarted(status?.code) && (
            <ConnerColumn
              homeConner={
                !isMatchNotStarted(status?.code) && homeCornerKicks > 0
                  ? homeCornerKicks
                  : (match?.homeScore?.corner && match?.homeScore?.corner > 0 ? match?.homeScore?.corner : 0)
              }
              awayConner={
                !isMatchNotStarted(status?.code) && awayCornerKicks > 0
                  ? awayCornerKicks
                  : (match?.awayScore?.corner && match?.awayScore?.corner > 0 ? match?.awayScore?.corner : 0)
              }
            />
          )}
        </div>
      </TwTeamScoreCol>
    ),
    [
      homeTeam,
      status?.code,
      match?.homeScore,
      match?.awayScore,
      awayTeam,
      homeRedCards,
      homeCornerKicks,
      awayCornerKicks,
      awayRedCards,
      showRedCard,
      showYellowCard,
      isDetail,
      isShowSimulator,
      match,
    ]
  );

  const memoizedMatchRow = useMemo(
    () => (
      <TwMatchRow
        data-testid='match-row' // Add the 'data-' prefix to the 'testId' prop
        id={match?.id}
        className='dark:border-linear-box cursor-pointer bg-white py-2.5 text-csm  dark:bg-primary-gradient border border-line-default dark:border-0'
        onClick={()=> onClick && onClick(match)}
      >
        <MatchTimeStamp
          type='league'
          startTimestamp={startTimestamp}
          status={status}
          id={id}
          i18n={i18n}
          currentPeriodStartTimestamp={currentPeriodStartTimestamp}
          competition={tournament}
          showTime={false}
          sport={sport}
        />
        {teamScoreCol}
        <TwBellCol className={clsx({ '!justify-center': isFinished })}>
          {!isFinished && (
            <BellIcon isBellOn={isBellOn} changeBellOn={changeBellOn} />
          )}
          <div onClick={(e) => changeFollow(e)} test-id='star-follow'>
            {isFollowed ? (
              <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />
            ) : (
              <StarBlank
                id='blank-start'
                className='inline-block h-4 w-4 cursor-pointer'
              />
            )}
          </div>
        </TwBellCol>
      </TwMatchRow>
    ),
    [
      match?.id,
      match?.homeScore,
      match?.awayScore,
      match?.status?.code,
      match?.homeScore?.corner,
      match?.awayScore?.corner,
      isSelectedMatch,
      startTimestamp,
      status?.code,
      id,
      i18n,
      currentPeriodStartTimestamp,
      tournament,
      teamScoreCol,
      isFinished,
      isBellOn,
      changeBellOn,
      isFollowed,
      changeFollow,
    ]
  );

  return memoizedMatchRow;
}, (prevProps, nextProps) => {
  return (
    prevProps?.match?.id === nextProps.match?.id && prevProps?.match?.homeScore?.display === nextProps.match?.homeScore?.display && prevProps?.match?.awayScore === nextProps.match?.awayScore
    && prevProps?.match?.status?.code === nextProps.match?.status?.code && prevProps?.match?.homeCornerKicks === nextProps.match?.homeCornerKicks && prevProps?.match?.awayCornerKicks === nextProps.match?.awayCornerKicks
  )
});

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
          className={`min-w-[34px] flex-1 rounded px-1 text-center text-msm font-normal ${colors[`color${index + 1}` as keyof Colors] !== 'inherit'
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
