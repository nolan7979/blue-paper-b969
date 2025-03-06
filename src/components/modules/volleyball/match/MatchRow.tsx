/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useWindowSize } from '@/hooks';

import CustomLink from '@/components/common/CustomizeLink';
import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import MatchShowScore from '@/components/modules/basketball/common/MatchShowScore';
import { RedCard, YellowCard } from '@/components/modules/football/Cards';
import { BellIcon } from '@/components/modules/football/match/BellIcon';
import {
  FirstCol,
  TwBellCol,
  TwCornerCol,
  TwMatchRow,
  TwOddsCol,
  TwScoreCol,
  TwTeamNameCol,
  TwTeamScoreCol,
  TwTimeCol,
} from '@/components/modules/football/tw-components';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';

import {
  useMatchStore,
  useMatchStore2nd,
  useOddsStore,
  useSettingsStore,
} from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import { audioArray } from '@/constant/audioArray';
import {
  convertOdds,
  formatMatchTimestamp,
  getImage,
  Images,
  isValEmpty,
} from '@/utils';
import { timeStampFormat } from '@/utils/timeStamp';
import { SPORT } from '@/constant/common';
import { SP } from 'next/dist/shared/lib/utils';

export const extractMatchData = (match: any) => {
  const {
    // tournament,
    homeTeam,
    awayTeam,
    match_status,
    // sport_event_status: status,
    status,
    startTimestamp,
  } = match || {};

  return {
    homeTeam,
    awayTeam,
    match_status,
    status,
    startTimestamp,
  };
};

export const MatchRow = ({
  match,
  matchOdds = {},
}: {
  match?: any;
  matchOdds?: any;
}) => {
  const { showOdds, oddsType } = useOddsStore();
  const { width } = useWindowSize();
  const router = useRouter();
  const { showYellowCard, showRedCard, homeSound } = useSettingsStore();
  const {
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    toggleShowSelectedMatch,
  } = useMatchStore();

  const {
    setShowSelectedMatch: setShowSelectedMatch2nd,
    setSelectedMatch: setSelectedMatch2nd,
    // toggleShowSelectedMatch,
  } = useMatchStore2nd();
  const {
    homeTeam,
    awayTeam,
    // match_status,
    // sport_event_status: status,
    tournament = {},
    status = {},
    startTimestamp,
    homeYellowCards = 0,
    awayYellowCards = 0,
    homeRedCards = 0,
    awayRedCards = 0,
    id,
  } = match || {};
  const { category = {} } = tournament;
  const [homeScore, setHomeScore] = useState(match?.homeScore || 0);
  const [awayScore, setawayScore] = useState(match?.awayScore || 0);
  const [homeCornerKicks, setHomeCornerKicks] = useState(
    match?.homeCornerKicks || 0
  );
  const [awayCornerKicks, setawayCornerKicks] = useState(
    match?.awayCornerKicks || 0
  );
  const sportType = category && category?.sport?.name.toLowerCase();

  const [dateStr, timeStr] = formatMatchTimestamp(
    startTimestamp,
    status,
    false
  );
  const { formattedTime, formattedDate } = timeStampFormat(startTimestamp);
  const matchFollowed = useFollowStore((state) => state.followed.match);
  // is favorite the match -> isFollowed
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  // is bell on the match -> isBellOn
  const [isBellOn, setIsBellOn] = useState<boolean>(false);

  const [err, setErr] = useState(false);
  const [err2, setErr2] = useState(false);
  const [effectiveScore, setEffectiveScore] = useState(false);

  useEffect(() => {
    const isFollowedMatch = matchFollowed.some(
      (item: any) => item.matchId === match?.id
    );
    setIsFollowed(isFollowedMatch);
  }, [matchFollowed, match]);
  const { addMatches, removeMatches } = useFollowStore();
  const changeFollow = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isFollowed) {
      removeMatches(match?.id);
    } else {
      addMatches(
        match?.id,
        formattedTime,
        formattedDate,
        match.tournament?.id,
        match.tournament.category.name,
        match.tournament.name
      );
    }
  };
  const [shouldExecuteAction, setShouldExecuteAction] =
    useState<boolean>(false);
  useEffect(() => {
    if (isBellOn) {
      const timer = setTimeout(() => {
        const numericHomeSound = parseInt(homeSound, 10);

        if (!isNaN(numericHomeSound) && Number.isInteger(numericHomeSound)) {
          const audio = new Audio(audioArray[numericHomeSound - 1]);
          audio.play();
        }

        setShouldExecuteAction(false);
      }, 5000);

      setShouldExecuteAction(true);

      return () => clearTimeout(timer);
    }
  }, [isBellOn, homeSound]);
  const changeBellOn = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isBellOn) {
      setIsBellOn(false);
    } else {
      setIsBellOn(true);
    }
  };
  if (!match || Object.keys(match).length === 0) return <></>;

  return (
    <>
      {/* <CustomLink href={`/match/football/${matchId}`}> */}
      <TwMatchRow
        className={`cursor-pointer py-2.5 text-csm ${
          effectiveScore ? 'animate-flicker' : ''
        }`}
        onClick={() => {
          if (width < 1024) {
            setSelectedMatch(`${id}`);

            // go to detailed page for small screens
            router.push(`/volleyball/match/${match.slug}/${match?.id}`);
            // window.location.href = `/match/${match.slug}/${match?.id}`;
          } else {
            if (`${id}` === `${selectedMatch}`) {
              toggleShowSelectedMatch();
            } else {
              setShowSelectedMatch(true);
              setSelectedMatch(`${id}`);
              setShowSelectedMatch2nd(true);
              setSelectedMatch2nd(`${id}`);
            }
          }
        }}
      >
        <FirstCol className='w-fit px-1 md:px-2'>
          {/* <TwFavoriteCol className=''>
            <StarBlank></StarBlank>
          </TwFavoriteCol> */}
          {/* <div className='hidden lg:inline-block'>
            <TwFavoriteCol className=''>
              <StarBlank className='h-4 w-4 cursor-pointer ' />
            </TwFavoriteCol>
          </div> */}
          {/* TODO: blinking */}
          <TwTimeCol className=' flex h-full flex-col gap-1'>
            {/* 90+3' */}
            <span className=' text-xs'>{dateStr}</span>
            <span className=' w-full truncate text-center text-xs'>
              {timeStr}
            </span>
          </TwTimeCol>
        </FirstCol>
        {/* <div className=' flex flex-1'> */}
        <TwTeamScoreCol className=' flex w-1/4'>
          {/* Clubs + FT + PG + Odds */}
          <TwTeamNameCol className=''>
            <div className=' flex gap-2'>
              <div className=' min-w-5'>
                <CustomLink
                  href={`/competitor/${homeTeam.slug}/${homeTeam?.id}`} // TODO use slug
                  target='_parent'
                >
                  <div className='h-5 w-5'>
                    <img
                      src={
                        err
                          ? `${'/images/football/teams/unknown-team.png'}`
                          : `${getImage(
                              Images.team,
                              homeTeam?.id,
                              true,
                              SPORT.FOOTBALL
                            )}`
                      }
                      alt='home team'
                      onError={() => {
                        setErr(true);
                      }}
                      className='h-full w-full rounded-full object-contain'
                    ></img>
                  </div>
                </CustomLink>
              </div>
              <TwTeamName>
                {/* <div className='my-auto shrink truncate text-csm font-thin  dark:text-dark-text'> */}
                {homeTeam?.name}
              </TwTeamName>
              <div className=' ml-1 flex items-center gap-0.5'>
                {homeRedCards > 0 && showRedCard && (
                  <RedCard numCards={homeRedCards} size='xs' />
                )}
                {homeYellowCards > 0 && showYellowCard && (
                  <YellowCard numCards={homeYellowCards} size='xs' />
                )}
              </div>
            </div>
            <div className=' flex gap-2'>
              <div className=' min-w-8'>
                <CustomLink
                  href={`/competitor/${awayTeam.slug}/${awayTeam?.id}`}
                  target='_parent'
                >
                  <Image
                    unoptimized={true}
                    src={`${
                      err2
                        ? `${'/images/football/teams/unknown-team.png'}`
                        : `${getImage(
                            Images.team,
                            awayTeam?.id,
                            true,
                            SPORT.FOOTBALL
                          )}`
                    }`}
                    alt='away team'
                    width={20}
                    height={20}
                    onError={() => setErr2(true)}
                  />
                </CustomLink>
              </div>
              {/* <div className='my-auto shrink truncate text-csm font-thin  dark:text-dark-text'> */}
              <TwTeamName>{awayTeam?.name}</TwTeamName>
              <div className=' ml-1 flex items-center gap-0.5'>
                {awayRedCards > 0 && showRedCard && (
                  <RedCard numCards={awayRedCards} size='xs' />
                )}
                {awayYellowCards > 0 && showYellowCard && (
                  <YellowCard numCards={awayYellowCards} size='xs' />
                )}
              </div>
            </div>
          </TwTeamNameCol>

          {showOdds ? (
            <OddsColumn matchOdds={matchOdds} oddsType={oddsType}></OddsColumn>
          ) : (
            <>
              {sportType === 'basketball' && (
                <MatchShowScore homeScore={homeScore} awayScore={awayScore} />
              )}
            </>
          )}
          <TwScoreCol className=''>
            <div className=' text-score dark:text-score-dark rounded-sm bg-all-blue'>
              {homeScore.display}
            </div>
            <div className=' text-score dark:text-score-dark rounded-sm bg-all-blue'>
              {awayScore.display}
            </div>
          </TwScoreCol>
          <TwCornerCol className=' flex flex-col justify-between'>
            <div>{homeCornerKicks > 0 ? homeCornerKicks : '-'}</div>
            <div>{awayCornerKicks > 0 ? awayCornerKicks : '-'}</div>
          </TwCornerCol>
        </TwTeamScoreCol>
        {/* </div> */}
        {/* <div className=' w-8'>Bell</div> */}
        <TwBellCol className=''>
          <BellIcon isBellOn={isBellOn} changeBellOn={changeBellOn} />
          <div onClick={changeFollow}>
            {isFollowed ? (
              <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />
            ) : (
              <StarBlank className='inline-block h-4 w-4 cursor-pointer' />
            )}
          </div>
        </TwBellCol>
      </TwMatchRow>
      {/* </CustomLink> */}
    </>
  );
};

export const OddsColumn = ({
  matchOdds = {},
  oddsType,
}: {
  matchOdds?: any;
  oddsType?: any;
}) => {
  const { choices = [], marketId } = matchOdds || {};

  if (isValEmpty(matchOdds)) {
    return <></>;
  }
  const [homeOdds = {}, drawOdds = {}, awayOdds = {}] = choices || [];

  return (
    <>
      <TwOddsCol className=' text-xs'>
        <div className='  flex items-center text-dark-text'>
          <div className='  flex-1 text-center font-normal leading-5'>
            {homeOdds.name || 1}
          </div>
          <div className='  flex-1 text-center font-normal leading-5'>
            {drawOdds.name || 'X'}
          </div>
          <div className='  flex-1 text-center font-normal leading-5'>
            {awayOdds.name || 2}
          </div>
        </div>
        <div className='  flex items-center'>
          <div className=' flex-1 text-center text-dark-win'>
            {convertOdds(homeOdds.v, marketId, oddsType, 1)}
          </div>
          <div className=' flex-1 text-center text-dark-win'>
            {convertOdds(drawOdds.v, marketId, oddsType, 2)}
          </div>
          <div className=' flex-1 text-center text-dark-red'>
            {convertOdds(awayOdds.v, marketId, oddsType, 3)}
          </div>
        </div>
      </TwOddsCol>
    </>
  );
};
