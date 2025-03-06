import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useWindowSize } from '@/hooks';

import {
  FirstCol,
  TwBellCol,
  TwTeamNameCol,
  TwTeamScoreCol,
} from '@/components/modules/football/tw-components';
import { TwBorderLinearBox } from '@/components/modules/football/tw-components/TwCommon.module';

import HandleGroupAvatar from '@/components/modules/badminton/components/HandleGroupAvatar';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';
import clsx from 'clsx';
import { SPORT } from '@/constant/common';
import { useMatchNotify } from '@/stores/notification-store';
//icon
import { BellIcon } from '@/components/modules/football/match/BellIcon';
import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { useFollowStore } from '@/stores/follow-store';

import { useSelectedMatchData } from '@/hooks/useCommon';
import MatchTimeStampCommon from '@/modules/favorite/components/MatchTimeStampCommon';
import MatchScoreColumnCommon from '@/modules/favorite/components/MatchScoreColumnCommon';
import { ISelectedFavorite, useHomeStore, useMatchStore } from '@/stores/match-store';

import { MatchRowIsolated as MatchRowIsolatedCricket } from '@/components/modules/cricket/match/MatchRowIsolated';

import { MatchRowIsolated as MatchRowIsolatedFootball } from '@/components/modules/football/match/MatchRowIsolated';
import { MatchRowIsolated as MatchRowIsolatedHockey } from '@/components/modules/hockey/match';
import { MatchRowIsolated as MatchRowIsolatedAMFootball } from '@/components/modules/am-football/match';
import { MatchRowIsolated as MatchRowIsolatedBadminton } from '@/components/modules/badminton/match/MatchRowIsolated';
import { MatchRowIsolated as MatchRowIsolatedBasketball } from '@/components/modules/basketball/match';
import { MatchRowIsolated as MatchRowIsolatedBaseball } from '@/components/modules/baseball/match/MatchRowIsolated';
import { MatchRowIsolated as MatchRowIsolatedTennis} from '@/components/modules/tennis';
import { MatchRowIsolated as MatchRowIsolatedTTennis } from '@/components/modules/table-tennis';
import { MatchRowIsolated as MatchRowIsolatedVolleyball } from '@/components/modules/volleyball/match/MatchRowIsolated';

import { useSettingsStore } from '@/stores/settings-store';
import useTrans from '@/hooks/useTrans';
import { MatchOdd, SportEventDtoWithStat } from '@/constant/interface';
import { useTheme } from 'next-themes';
import { scrollToTop } from '@/utils/common-utils';

export interface IMatchFavorite {
  categoryName: string;
  formatDate: string;
  formatTime: string;
  matchId: string;
  tournamentId: string;
  tournamentName: string;
  sport?: string;
}


const MatchRowIsolateCommon = ({
  match
}: {
  match: SportEventDtoWithStat
}) => {
  const {
    categoryName,
    formatDate,
    formatTime,
    matchId,
    tournamentId,
    tournamentName,
    sport = '',
  } = match;

  const { setSelectedFavorite, } = useMatchStore();
  const { showYellowCard, showRedCard, homeSound } = useSettingsStore();
  const { matchesOdds } = useHomeStore();
  const matchOdds: MatchOdd = matchesOdds[matchId];
  const { resolvedTheme } = useTheme();
  const i18n = useTrans();
  const {
    selectedMatch,
    showSelectedMatch,
  } = useMatchStore();

  // const { data } = useSelectedMatchData(
  //   matchId || '', sport || SPORT.FOOTBALL
  // );

  const { homeTeam, awayTeam } = (match as any) || {};

  const { addMatches, removeMatches } = useFollowStore();

  const matchFollowed = useFollowStore((state) => state.followed.match);

  const [isFollowed, setIsFollowed] = useState(() => {
    const isMatchFollowed = matchFollowed.some(
      (item: any) => item.matchId === matchId
    );
    return isMatchFollowed;
  });

  const {
    matches: matchesNotify,
  } = useMatchNotify();

  const { width } = useWindowSize();
  const isMobile = useMemo(() => width < 768, [width]);
  const router = useRouter();

  const [isBellOn, setIsBellOn] = useState<boolean>(matchesNotify.includes(matchId));
  const [matchScore, setMatchScore] = useState<any>({ft: [0,0]});

  const changeBellOn = () => {
    console.log('click bell')
  }

  const handleQuickViewFavorite = () => {
    const selectedData: ISelectedFavorite = {
      id: matchId,
      sport: sport,
      type: 'match',
    }
    if(isMobile) {
      router.push(`/${sport}/match/${tournamentName}/${matchId}`);
    } else {
      setSelectedFavorite(selectedData)
    }
    scrollToTop()
  }

  const changeFollow = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (isFollowed) {
        removeMatches(matchId);
        setIsFollowed(false);
      } else {
        addMatches(
          matchId,
          formatTime,
          formatDate,
          tournamentId,
          '',
          tournamentName || '',
          sport
        );
        setIsFollowed(true);
      }
    },
    [
      isFollowed,
      match,
      addMatches,
      removeMatches,
    ]
  );

  const getScore = (scoreData:any) => {
    if (sport == SPORT.FOOTBALL || sport == SPORT.BASKETBALL) {
      return {
        ft: [scoreData?.homeScore?.display || 0, scoreData?.awayScore?.display || 0]
      }
    }
    return scoreData?.scores || {ft: [0,0]}
  }

  useEffect(() => {
    if (match) {
      const score = getScore(match);
      setMatchScore(score);
    }
  }, [match]);

  if (!match) return <></>;

  if(sport == SPORT.CRICKET) return (
    <MatchRowIsolatedCricket
      key={match?.matchId}
      isDetail={false}
      match={match}
      i18n={i18n}
      homeSound={homeSound}
      onClick={handleQuickViewFavorite}
      isSimulator={false}
      sport={sport}
    />
  );

  if(sport == SPORT.FOOTBALL) return (
    <MatchRowIsolatedFootball
      key={matchId}
      isDetail={false}
      match={match}
      i18n={i18n}
      theme={resolvedTheme}
      homeSound={homeSound}
      matchOdds={matchOdds}
      showYellowCard={showYellowCard}
      showRedCard={showRedCard}
      selectedMatch={match?.id}
      showSelectedMatch={showSelectedMatch}
      onClick={handleQuickViewFavorite}
      isSimulator={false}
      sport={sport}
    />
  );

  if(sport == SPORT.BADMINTON) return (
    <MatchRowIsolatedBadminton
      key={matchId}
      isDetail={false}
      match={match}
      i18n={i18n}
      theme={resolvedTheme}
      onClick={handleQuickViewFavorite}
      isSimulator={false}
      sport={sport}
    />
  )

  if(sport == SPORT.BASKETBALL) return (
    <MatchRowIsolatedBasketball
      key={matchId}
      isDetail={false}
      match={match}
      i18n={i18n}
      theme={resolvedTheme}
      homeSound={homeSound}
      onClick={handleQuickViewFavorite}
      isSimulator={false}
      sport={sport}
    />
  )

  if(sport == SPORT.BASEBALL) return (
    <MatchRowIsolatedBaseball
      key={matchId}
      isDetail={false}
      match={match}
      i18n={i18n}
      theme={resolvedTheme}
      showYellowCard={showYellowCard}
      showRedCard={showRedCard}
      homeSound={homeSound}
      onClick={handleQuickViewFavorite}
      sport={sport}
      isSimulator={false}
    />
  )

  if(sport == SPORT.AMERICAN_FOOTBALL) return (
    <MatchRowIsolatedAMFootball
      key={matchId}
      isDetail={false}
      match={match}
      i18n={i18n}
      theme={resolvedTheme}
      homeSound={homeSound}
      onClick={handleQuickViewFavorite}
      sport={sport}
    />
  )
  if(sport == SPORT.ICE_HOCKEY) return (
    <MatchRowIsolatedHockey
      key={matchId}
      isDetail={false}
      match={match}
      i18n={i18n}
      theme={resolvedTheme}
      homeSound={homeSound}
      onClick={handleQuickViewFavorite}
      isSimulator={false}
      sport={sport}
    />
  )
  if(sport == SPORT.TENNIS) return (
    <MatchRowIsolatedTennis
      key={matchId}
      isDetail={false}
      handleClick={handleQuickViewFavorite}
      match={match}
      i18n={i18n}
      theme={resolvedTheme}
      homeSound={homeSound}
      isSimulator={false}
    />
  )

  if(sport == SPORT.TABLE_TENNIS) return (
    <MatchRowIsolatedTTennis
      key={matchId}
      isDetail={false}
      handleClick={handleQuickViewFavorite}
      match={match}
      i18n={i18n}
      // theme={resolvedTheme}
      homeSound={homeSound}
    />
  )

  if(sport == SPORT.VOLLEYBALL) return (
    <MatchRowIsolatedVolleyball
      key={matchId}
      isDetail={false}
      match={match}
      i18n={i18n}
      theme={resolvedTheme}
      homeSound={homeSound}
      onClick={handleQuickViewFavorite}
      sport={sport}
      isSimulator={false}
    />
  )

  return (
    <TwBorderLinearBox className='border dark:border-0 border-line-default dark:border-linear-box bg-white dark:bg-primary-gradient'>
      <li
        className={clsx(
          'flex cursor-pointer items-center gap-2 rounded-md  bg-white p-1.5 text-sm dark:bg-transparent lg:!border-all-blue'
        )}
        onClick={() => handleQuickViewFavorite()}
      >
        <FirstCol className='w-fit px-1 md:px-2 block text-center'>
          <MatchTimeStampCommon match={match} sport={sport} />
        </FirstCol>
        <TwTeamScoreCol className=' flex w-1/4 items-center '>
          <TwTeamNameCol className=''>
            <div className=' flex items-center gap-2'>
              <div className=' min-w-5'>
                <HandleGroupAvatar team={homeTeam} sport={sport} size={20}></HandleGroupAvatar>
              </div>
              <TwTeamName>{homeTeam?.name}</TwTeamName>
            </div>
            <div className=' flex gap-2'>
              <div className=' min-w-5'>
                <HandleGroupAvatar team={awayTeam} sport={sport} size={20}></HandleGroupAvatar>
              </div>
              <TwTeamName>{awayTeam?.name}</TwTeamName>
            </div>
          </TwTeamNameCol>
        </TwTeamScoreCol>
        <div className='flex items-center gap-x-1'>
          <MatchScoreColumnCommon
            code={match?.status?.code}
            homeScore={matchScore.ft[0]}
            awayScore={matchScore.ft[1]}
          />
        </div>
        <TwBellCol className='!justify-center'>
          <BellIcon isBellOn={isBellOn} changeBellOn={changeBellOn} />
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
      </li>
    </TwBorderLinearBox>
  );
};

export default MatchRowIsolateCommon;
