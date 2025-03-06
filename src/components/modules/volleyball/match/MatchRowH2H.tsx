import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { useWindowSize } from '@/hooks';

import {
  FormBadge,
  SoccerTeam,
} from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import {
  FirstCol,
  TwTeamNameCol,
  TwTeamScoreCol,
} from '@/components/modules/football/tw-components';
import { TwBorderLinearBox } from '@/components/modules/football/tw-components/TwCommon.module';

import { useMatchStore, useMatchStore2nd } from '@/stores';

import { SportEventDtoWithStat } from '@/constant/interface';
import MatchScoreColumn from '@/modules/football/liveScore/components/MatchScoreColumn';
import { Images, getImage, getSlug, isMatchHaveStat, isMatchHaveStatVlb, isMatchNotStarted, isMatchNotStartedVlb } from '@/utils';
import clsx from 'clsx';
import Avatar from '@/components/common/Avatar';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';
import CustomizeLink from '@/components/common/CustomizeLink';
import { SPORT } from '@/constant/common';

const MatchTimeStamp = dynamic(
  () => import('@/components/modules/volleyball/match/MatchTimeStamp')
);

const MatchRowH2H = ({
  h2hEvent,
  h2HFilter,
  teamId,
  type2nd = false,
  showQuickView,
  isDetail
}: {
  h2hEvent: SportEventDtoWithStat;
  h2HFilter?: string;
  teamId?: string;
  type2nd?: boolean;
  showQuickView?: boolean;
  isDetail?: boolean
}) => {
  const {
    id,
    homeTeam,
    awayTeam,
    scores,
    winnerCode = 0,
    status,
    tournament,
    startTimestamp = 0,
    time,
  } = h2hEvent;

  const { currentPeriodStartTimestamp } = time || {};

  const { width } = useWindowSize();
  const router = useRouter();
  const {
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    // toggleShowSelectedMatch,
  } = useMatchStore();

  const {
    selectedMatch: selectedMatch2nd,
    setShowSelectedMatch: setShowSelectedMatch2nd,
    setSelectedMatch: setSelectedMatch2nd,
    // toggleShowSelectedMatch,
  } = useMatchStore2nd();

  const isSelectedMatch = useMemo(() => {
    return selectedMatch === id;
  }, [selectedMatch]);

  const isSelectMatch2nd = useMemo(() => {
    return selectedMatch2nd === id;
  }, [selectedMatch2nd]);

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

  return (
    <TwBorderLinearBox className='border dark:border-0 border-line-default dark:border-linear-box bg-white dark:bg-primary-gradient'>
      <li
        className={clsx(
          'flex cursor-pointer items-center gap-2 rounded-md  bg-white p-1.5 text-sm dark:bg-transparent',
          {
            'lg:!border-all-blue':
              isSelectedMatch && !type2nd && !!showQuickView,
          },
          {
            'lg:!border-all-blue':
              isSelectMatch2nd && type2nd && !!showQuickView,
          }
        )}
        onClick={() => {
          if (width < 1024 || isDetail) {
            setSelectedMatch(`${id}`);
            // go to detailed page for small screens
            router.push(`/volleyball/match/${h2hEvent?.slug}/${h2hEvent?.id}`); // TODO slug
          } else {
            if (type2nd) {
              if (`${id}` === `${selectedMatch2nd}`) {
                // toggleShowSelectedMatch();
              } else {
                setShowSelectedMatch2nd(true);
                setSelectedMatch2nd(`${id}`);
              }
            } else {
              if (`${id}` === `${selectedMatch}`) {
                // toggleShowSelectedMatch();
              } else {
                setShowSelectedMatch(true);
                setSelectedMatch(`${id}`);
              }
            }
          }
        }}
      >
        <FirstCol className='w-fit px-1 md:px-2'>
          <MatchTimeStamp
            type='league'
            startTimestamp={startTimestamp}
            status={status}
            id={id}
            currentPeriodStartTimestamp={currentPeriodStartTimestamp}
            competition={tournament}
            showTime={false}
          />
        </FirstCol>
        <TwTeamScoreCol className=' flex w-1/4 items-center '>
          <TwTeamNameCol className=''>
            <div className=' flex items-center gap-2' test-id='club1-info'>
              <div className=' min-w-5' test-id='club1-logo'>
                <CustomizeLink
                  href={`/${SPORT.VOLLEYBALL}/competitor/${homeTeam?.slug || getSlug(homeTeam?.name)}/${homeTeam?.id}`}
                  target='_parent'
                >
                  <Avatar
                    id={homeTeam?.id}
                    type='team'
                    isBackground={false}
                    rounded={false}
                    sport={SPORT.VOLLEYBALL}
                    width={20}
                    height={20}
                    isSmall
                  />
                </CustomizeLink>
              </div>
              <TwTeamName>{homeTeam?.name}</TwTeamName>
            </div>
            <div className=' flex gap-2' test-id='club2-info'>
              <div className=' min-w-5' test-id='club2-logo'>
                <CustomizeLink
                  href={`/${SPORT.VOLLEYBALL}/competitor/${awayTeam?.slug || getSlug(awayTeam?.name)}/${awayTeam?.id}`}
                  target='_parent'
                >
                  <Avatar
                    id={awayTeam?.id}
                    type='team'
                    sport={SPORT.VOLLEYBALL}
                    isBackground={false}
                    rounded={false}
                    width={20}
                    height={20}
                    isSmall
                  />
                </CustomizeLink>
              </div>
              <TwTeamName>{awayTeam?.name}</TwTeamName>
            </div>
          </TwTeamNameCol>

          <div className=' flex  justify-evenly space-x-2'>
            {!isMatchNotStartedVlb(status.code) && (
              <div className='flex flex-col place-content-center'>
                <MatchScoreColumn
                  code={status.code}
                  homeScore={scores?.ft?.[0]}
                  awayScore={scores?.ft?.[1]}
                />
              </div>
            )}
            {h2HFilter !== 'h2h' && isMatchHaveStatVlb(status.code) && (
              <div className='flex place-content-center items-center justify-center px-2'>
                <FormBadge
                  isWin={isWin}
                  isLoss={isLoss}
                  isDraw={winnerCode === 3}
                  isSmall={true}
                ></FormBadge>
              </div>
            )}
          </div>
        </TwTeamScoreCol>
      </li>
    </TwBorderLinearBox>
  );
};

export default MatchRowH2H;
