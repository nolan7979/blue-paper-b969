/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useWindowSize } from '@/hooks';
import { useSelectedMatchData } from '@/hooks/useFootball';

import CustomLink from '@/components/common/CustomizeLink';
import { RedCard, YellowCard } from '@/components/modules/football/Cards';
import {
  FirstCol,
  TwBellCol,
  TwCornerCol,
  TwMatchRow,
  TwScoreCol,
  TwTeamNameCol,
  TwTeamScoreCol,
  TwTimeCol,
} from '@/components/modules/football/tw-components';
import { BellOff } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';

import { useMatchStore, useSettingsStore } from '@/stores';
import { useFinshMatch } from '@/stores/finish-match-store';
import { useFollowStore } from '@/stores/follow-store';

import { formatMatchTimestamp, getImage, Images } from '@/utils';
import { SportEventDto } from '@/constant/interface';
import Avatar from '@/components/common/Avatar';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';
import { SPORT } from '@/constant/common';

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

export const RowMatchFa = ({ matchId }: { matchId: string }) => {
  const { width } = useWindowSize();
  const router = useRouter(); // TODO
  const [isErr1, setIsErr1] = useState(false);
  const [isErr2, setIsErr2] = useState(false);

  const { data, isLoading } = useSelectedMatchData(matchId);
  const { showYellowCard, showRedCard } = useSettingsStore();
  const {
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    toggleShowSelectedMatch,
  } = useMatchStore();

  if (!data || Object.keys(data).length === 0) return <></>;

  const {
    homeTeam,
    awayTeam,
    status,
    startTimestamp,
    homeScore,
    awayScore,
    id,
    slug,
  } = data as SportEventDto;

  const { removeMatches } = useFollowStore();
  const { addMatch } = useFinshMatch();
  const changeFollow = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    removeMatches(matchId);
  };
  useEffect(() => {
    if (status && status['code'] === 100) {
      addMatch(id);
    }
  }, [status, id, addMatch]);
  if (isLoading) {
    return <></>;
  }
  if (data) {
    const [dateStr, timeStr] = formatMatchTimestamp(
      startTimestamp,
      status,
      false
    );

    return (
      <>
        <TwMatchRow
          className='cursor-pointer py-2.5 text-csm'
          onClick={() => {
            if (width < 1024) {
              setSelectedMatch(`${id}`);
              // go to detailed page for small screens
              // Todo: Use Link instead of CustomeLink temporary
              router.push(`/match/${slug}/${id}`);
              // window.location.href = `/match/${slug}/${id}`;
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
          <FirstCol className='w-fit px-1 md:px-2'>
            <TwTimeCol className=' flex h-full flex-col gap-1'>
              <span className=' text-xs'>{dateStr}</span>
              <span className=' w-full truncate text-center text-xs'>
                {timeStr}
              </span>
            </TwTimeCol>
          </FirstCol>
          <TwTeamScoreCol className=' flex w-1/4 '>
            <TwTeamNameCol className=''>
              <div className=' flex gap-2'>
                <div className=' min-w-5'>
                  <CustomLink
                    href={`/competitor/${homeTeam.slug}/${homeTeam?.id}`}
                    target='_parent'
                  >
                    <Avatar
                      id={homeTeam?.id}
                      type='team'
                      width={20}
                      height={20}
                      isBackground={false}
                      rounded={false}
                      isSmall
                    />
                  </CustomLink>
                </div>
                <TwTeamName>{homeTeam?.name}</TwTeamName>
              </div>
              <div className=' flex gap-2'>
                <div>
                  <CustomLink
                    href={`/competitor/${awayTeam.slug}/${awayTeam?.id}`}
                    target='_parent'
                  >
                    <img
                      src={`${
                        isErr2
                          ? `${
                              `${getImage(
                                Images.team,
                                awayTeam?.id,
                                true,
                                SPORT.FOOTBALL
                              )}` || '/images/football/teams/unknown-team.png'
                            }`
                          : `${getImage(
                              Images.team,
                              homeTeam?.id,
                              true,
                              SPORT.FOOTBALL
                            )}`
                      }`}
                      alt='...'
                      width={20}
                      height={20}
                      onError={() => setIsErr2(true)}
                    ></img>
                  </CustomLink>
                </div>
                <TwTeamName>{awayTeam?.name}</TwTeamName>
                {/* <div className=' ml-1 flex items-center gap-0.5'>
                  {awayRedCards > 0 && showRedCard && (
                    <RedCard numCards={awayRedCards} size='xs' />
                  )}
                  {awayYellowCards > 0 && showYellowCard && (
                    <YellowCard numCards={awayYellowCards} size='xs' />
                  )}
                </div> */}
              </div>
            </TwTeamNameCol>

            <TwScoreCol className=''>
              <div className=' rounded-sm bg-all-blue text-black'>
                {homeScore.display}
              </div>
              <div className=' rounded-sm bg-all-blue text-black'>
                {awayScore.display}
              </div>
            </TwScoreCol>
            {/* <TwCornerCol className=' flex flex-col justify-between'>
              <div>{homeCornerKicks > 0 ? homeCornerKicks : '-'}</div>
              <div>{awayCornerKicks > 0 ? awayCornerKicks : '-'}</div>
            </TwCornerCol> */}
          </TwTeamScoreCol>
          <TwBellCol className=''>
            <BellOff className='h-4 w-4'></BellOff>
            <div onClick={(e) => changeFollow(e)}>
              <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />
            </div>
          </TwBellCol>
        </TwMatchRow>
      </>
    );
  }
  return <></>;
};
