/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useWindowSize } from '@/hooks';

import CustomLink from '@/components/common/CustomizeLink';
import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { RedCard, YellowCard } from '@/components/modules/football/Cards';
import { BellIcon } from '@/components/modules/football/match/BellIcon';
import { OddsColumn } from '@/components/modules/football/match/MatchRow';
import {
  FirstColByTime,
  TwBellColByTime,
  TwCornerCol,
  TwMatchRow,
  TwScoreCol,
  TwTeamNameCol,
  TwTeamScoreCol,
  TwTimeColByTime,
} from '@/components/modules/football/tw-components';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';

import { useMatchStore, useOddsStore, useSettingsStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import { audioArray } from '@/constant/audioArray';
import {
  formatMatchTimestamp,
  getFirstLetters,
  getImage,
  Images,
} from '@/utils';
import { timeStampFormat } from '@/utils/timeStamp';
import { SPORT } from '@/constant/common';

export const MatchRowByTime = ({
  match,
  matchOdds,
}: {
  match: any;
  matchOdds?: any;
}) => {
  // use Odds store
  const { oddsType, showOdds } = useOddsStore();
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
    id,
    tournament,
    homeTeam,
    awayTeam,
    status,
    startTimestamp,
    homeScore,
    awayScore,
    homeYellowCards = 0,
    awayYellowCards = 0,
    homeRedCards = 0,
    awayRedCards = 0,
    homeCornerKicks = 0,
    awayCornerKicks = 0,
  } = match || {};

  const [dateStr, timeStr] = formatMatchTimestamp(startTimestamp, status, true);
  const { formattedTime, formattedDate } = timeStampFormat(startTimestamp);
  const matchFollowed = useFollowStore((state) => state.followed.match);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [isBellOn, setIsBellOn] = useState<boolean>(false);
  
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
        match.tournament.tournament?.id,
        match.tournament.tournament.category.name,
        match.tournament.tournament.name
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

  return (
    <div>
      {/* <CustomLink href={`/match/football/${matchId}`}> */}
      <TwMatchRow className=' py-2.5 text-csm'>
        <FirstColByTime className=''>
          {/* bg-purple-950 */}
          <div className='rounded-xs w-full bg-purple-800 text-center uppercase text-white'>
            {tournament.code || getFirstLetters(tournament.name)}
          </div>
          <FirstColByTime className=''>
            {/* <div className='hidden lg:inline-block'>
              <TwFavoriteCol className=''>
                <YellowStarSVG className='h-4 w-4 cursor-pointer ' />
              </TwFavoriteCol>
            </div> */}
            <TwTimeColByTime className=''>
              <span className='mx-auto truncate px-1 text-xs md:px-0'>
                {timeStr}
              </span>
            </TwTimeColByTime>
          </FirstColByTime>
        </FirstColByTime>
        <TwTeamScoreCol
          className=' flex w-1/4 cursor-pointer '
          onClick={() => {
            if (width < 1024) {
              setSelectedMatch(`${id}`);
              // go to detailed page for small screens
              router.push(`/football/match/${match.slug}/${match?.id}`);
            } else {
              if (`${id}` === `${selectedMatch}`) {
                toggleShowSelectedMatch();
              } else {
                setShowSelectedMatch(true);
                setSelectedMatch(`${id}`);
              }
            }
          }}
        >
          {/* Clubs + FT + PG + Odds */}
          <TwTeamNameCol className=''>
            <div className=' flex  gap-2'>
              <div className='min-w-8'>
                <CustomLink
                  href={`/football/competitor/${homeTeam.slug}/${homeTeam?.id}`} // TODO use slug
                  target='_parent'
                >
                  <Image
                    unoptimized={true}
                    src={
                      homeTeam?.id
                        ? '/images/football/teams/unknown-team.png'
                        : `${getImage(
                          Images.team,
                          homeTeam?.id,
                          true,
                          SPORT.FOOTBALL
                        )}`
                    }
                    alt='home team'
                    width={20}
                    height={20}
                    className='h-5 w-5'
                  />
                </CustomLink>
              </div>
              <TwTeamName>
                <span>{homeTeam.name}</span>
              </TwTeamName>
              <div className=' ml-1 flex items-center gap-0.5'>
                {homeRedCards > 1 && showRedCard && (
                  <RedCard numCards={homeRedCards} size='xs' />
                )}
                {homeYellowCards > 1 && showYellowCard && (
                  <YellowCard numCards={homeYellowCards} size='xs' />
                )}
              </div>
            </div>
            <div className=' flex  gap-2'>
              <CustomLink
                href={`/football/competitor/${awayTeam.name}/${awayTeam?.id}`} // TODO use slug
                target='_parent'
              >
                <Image
                  unoptimized={true}
                  src={`${awayTeam?.id
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
                  className='h-5 w-5'
                />
              </CustomLink>
            </div>
            {/* <div className='my-auto shrink truncate font-thin'> */}
            <TwTeamName>
              {/* Chelsea */}
              <span>{awayTeam.name}</span>
            </TwTeamName>
            <div className=' ml-1 flex items-center gap-0.5'>
              {awayRedCards > 1 && showRedCard && (
                <RedCard numCards={awayRedCards} size='xs' />
              )}
              {awayYellowCards > 1 && showYellowCard && (
                <YellowCard numCards={awayYellowCards} size='xs' />
              )}
            </div>
          </TwTeamNameCol>

          {/* {showOdds &&
            (oddsType === 'chau-a' ? (
              <TwOddsCol className='text-xs md:text-csm'>
                <div className=' flex'>
                  <div className=' flex-1 text-center'>1</div>
                  <div className=' flex-1 text-center'>x</div>
                  <div className=' flex-1 text-center'>2</div>
                </div>
                <div className=' flex'>
                  <div className=' flex-1 text-center text-dark-red'>1.67</div>
                  <div className=' flex-1 text-center text-dark-red underline'>
                    3.20
                  </div>
                  <div className=' flex-1 text-center text-dark-red'>4.75</div>
                </div>
              </TwOddsCol>
            ) : (
              // TODO: use correct odds
              <TwOddsCol className='text-csm'>
                <div className=' flex'>
                  <div className=' flex-1 text-center'>1</div>
                  <div className=' flex-1 text-center'>x</div>
                  <div className=' flex-1 text-center'>3</div>
                </div>
                <div className=' flex'>
                  <div className=' flex-1 text-center text-dark-win'>3.6</div>
                  <div className=' flex-1 text-center text-dark-win underline'>
                    6.35
                  </div>
                  <div className=' flex-1 text-center text-dark-red'>5.55</div>
                </div>
              </TwOddsCol>
            ))} */}

          {showOdds && (
            <OddsColumn matchOdds={matchOdds} oddsType={oddsType}></OddsColumn>
          )}

          <TwScoreCol className=''>
            <div className=' rounded-sm bg-all-blue'>{homeScore.display}</div>
            <div className=' rounded-sm bg-all-blue'>{awayScore.display}</div>
          </TwScoreCol>
          <TwCornerCol className='flex flex-col justify-between'>
            <div>{homeCornerKicks > 0 ? homeCornerKicks : '-'}</div>
            <div>{awayCornerKicks > 0 ? awayCornerKicks : '-'}</div>
          </TwCornerCol>
        </TwTeamScoreCol>

        <TwBellColByTime className=''>
          <BellIcon isBellOn={isBellOn} changeBellOn={changeBellOn} />
          <div onClick={(e) => changeFollow(e)}>
            {isFollowed ? (
              <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />
            ) : (
              <StarBlank className='h-4 w-4 cursor-pointer fill-slate-950' />
            )}
          </div>
        </TwBellColByTime>
      </TwMatchRow>
      {/* </CustomLink> */}
    </div>
  );
};
