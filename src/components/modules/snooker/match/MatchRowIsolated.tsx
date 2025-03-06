import clsx from 'clsx';
// import { useTheme } from 'next-themes';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useMessage } from '@/hooks/useFootball/useMessage';
// import ExcludeSVG from '~/svg/exclude.svg';

import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { BellIcon } from '@/components/modules/football/match/BellIcon';
import MatchTimeStamp from '@/components/modules/snooker/match/MatchTimeStamp';
import {
  TwBellCol,
  TwMatchRow,
  TwTeamNameCol,
  TwTeamScoreCol,
} from '@/components/modules/football/tw-components';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';

import { useFollowStore } from '@/stores/follow-store';
import { useMatchNotify } from '@/stores/notification-store';

import { audioArray } from '@/constant/audioArray';
// import { INITIAL_COLORS } from '@/constant/colors';
import { SPORT } from '@/constant/common';
import {
  FinishedStates,
  MatchOdd,
  SportEventDtoWithStat,
} from '@/constant/interface';
import { Colors, Odds, OddsRowProps } from '@/models/mathIsolated';
import { MatchScoreColumn } from '@/modules/snooker/liveScore/components/MatchScoreColumn';
// import { convertOdds, isMatchNotStarted } from '@/utils';
// import { determineColor } from '@/utils/matchingColor';
import { timeStampFormat } from '@/utils/timeStamp';

// import Button from '@/components/buttons/Button';
// import ClosedSVG from '/public/svg/closed.svg';
import { getScores } from '@/components/modules/table-tennis/match';
import { FormBadge } from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import AvatarTeamCommon from '@/components/common/AvatarTeamCommon';

export interface IMatchRowIsolatedProps {
  match: SportEventDtoWithStat | any;
  homeSound: string;
  showSelectedMatch: boolean;
  selectedMatch: string | null;
  i18n?: any;
  theme?: string;
  isSimulator?: boolean;
  isDetail?: boolean;
  onClick?: (e: SportEventDtoWithStat) => void;
  sport?: string;
  h2HFilter?: string;
}

export const MatchRowIsolated: React.FC<IMatchRowIsolatedProps> = memo(
  ({
    match,
    homeSound,
    showSelectedMatch,
    selectedMatch,
    i18n,
    isDetail,
    theme = 'light',
    sport = SPORT.SNOOKER,
    onClick,
    isSimulator = true,
    h2HFilter,
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
      id,
      time,
      status,
      uniqueTournament,
      winnerCode = 0,
    } = match || {};

    const { currentPeriodStartTimestamp } = time || {};

    const memoziedScore = useMemo(() => {
      const { scores, scoresRest } = getScores(match?.scores);
      return {
        scores,
        scoresRest,
      };
    }, [match?.scores]) as {
      scores: number[];
      scoresRest: Record<string, any>;
    };

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
    // const { setSitulations } = useSitulations();

    const [isClickBlocked, setIsClickBlocked] = useState(false);
    const [isBellOn, setIsBellOn] = useState<boolean>(
      matchesNotify.includes(id)
    );
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
            match?.uniqueTournament?.id,
            match?.uniqueTournament.category?.name || '',
            match?.uniqueTournament?.name || '',
            match?.tournament?.name || '',
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

    // const handleOpenMatchLive = useCallback(
    //   (e: any) => {
    //     e.stopPropagation();
    //     setSitulations(match?.id);
    //   },
    //   [match?.id, setSitulations]
    // );

    useEffect(() => {
      if (isBellOn) {
        const timer = setTimeout(() => {
          const numericHomeSound = parseInt(homeSound, 10);

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
          const numericHomeSound = parseInt(homeSound, 10);

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

    const isFinished = FinishedStates.includes(status.code);

    if (!match || (match && Object.keys(match).length === 0))
      return <MatchSkeletonMapping />;

    const teamScoreCol = useMemo(
      () => (
        <TwTeamScoreCol className=' flex w-1/4 items-center '>
          <TwTeamNameCol className=''>
            <div className=' flex items-center gap-2' test-id='club1-info'>
              <div
                className=' min-w-5'
                test-id='club1-logo'
                onClick={(e) => e.stopPropagation()}
              >
                <AvatarTeamCommon
                  team={homeTeam}
                  size={20}
                  sport={sport}
                  onlyImage
                />
              </div>
              <TwTeamName>{homeTeam?.name}</TwTeamName>
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
            </div>
          </TwTeamNameCol>
          <div className='flex items-center gap-x-1' test-id='score-info'>
            {/* {!isDetail &&
            isSimulator &&
            !isMatchNotStarted(match?.status?.code) && (
              <Button
                onClick={handleOpenMatchLive}
                className='hidden rounded-full border-none !bg-[#EAEAEA] dark:!bg-[#151820] px-1.5 py-0.5 lg:block'
                test-id='view-stimulation'
                aria-label='view-stimulation'
              >
                <ExcludeSVG className="text-black dark:text-white" />
              </Button>
            )} */}
            {status?.type == 'finished' && (
              <MatchScoreColumn
                code={status.code}
                homeScore={memoziedScore.scores[0]}
                awayScore={memoziedScore.scores[1]}
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
        isDetail,
        isSimulator,
        match,
      ]
    );

    const teamId = h2HFilter === 'home' ? homeTeam?.id : awayTeam?.id;

    let isWin = false;
    if (h2HFilter === 'home' || h2HFilter === 'away') {
      if (
        (teamId === homeTeam?.id && winnerCode === 1) ||
        (teamId === awayTeam?.id && winnerCode === 2)
      ) {
        isWin = true;
      }
    } else {
      isWin = false;
    }

    let isLoss = false;
    if (h2HFilter === 'home' || h2HFilter === 'away') {
      if (
        (teamId === homeTeam?.id && winnerCode === 2) ||
        (teamId === awayTeam?.id && winnerCode === 1)
      ) {
        isLoss = true;
      }
    } else {
      isLoss = false;
    }

    const memoizedMatchRow = useMemo(
      () => (
        <TwMatchRow
          data-testid='match-row' // Add the 'data-' prefix to the 'testId' prop
          id={match?.id}
          className='dark:border-linear-box cursor-pointer border border-line-default bg-white  py-2.5 text-csm dark:border-0 dark:bg-primary-gradient'
          onClick={() => onClick && onClick(match)}
        >
          <MatchTimeStamp
            type='league'
            startTimestamp={startTimestamp}
            status={status}
            id={id}
            i18n={i18n}
            currentPeriodStartTimestamp={currentPeriodStartTimestamp}
            competition={uniqueTournament}
            showTime={false}
            sport={sport}
          />
          {teamScoreCol}
          {h2HFilter !== 'h2h' && (
            <div className='flex place-content-center items-center justify-center px-2'>
              <FormBadge
                isWin={isWin}
                isLoss={isLoss}
                isDraw={winnerCode === 3}
                isSmall={true}
              />
            </div>
          )}
          {/* <TwBellCol className={clsx({ '!justify-center': isFinished })}>
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
          </TwBellCol> */}
        </TwMatchRow>
      ),
      [
        match?.id,
        match?.scores,
        match?.status,
        isSelectedMatch,
        startTimestamp,
        status.code,
        id,
        i18n,
        currentPeriodStartTimestamp,
        uniqueTournament,
        teamScoreCol,
        isFinished,
        isBellOn,
        changeBellOn,
        isFollowed,
        changeFollow,
      ]
    );

    return memoizedMatchRow;
  },
  (prevProps, nextProps) => {
    return (
      prevProps?.match?.id === nextProps.match?.id &&
      prevProps?.match?.scores === nextProps.match?.scores &&
      prevProps?.match?.status?.code === nextProps.match?.status?.code &&
      prevProps?.h2HFilter === nextProps.h2HFilter
    );
  }
);
