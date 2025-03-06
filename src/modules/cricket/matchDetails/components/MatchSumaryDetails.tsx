import React, { useEffect, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import ButtonLiveMatch from '@/components/buttons/ButtonLiveMatch';
import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { BellOff } from '@/components/icons';
import { BellIcon } from '@/components/modules/football/match/BellIcon';
import MatchSimulationIframe from '@/components/modules/football/match/MatchSimulationIframe';
import MatchTimeScore from '@/components/modules/cricket/match/MatchTimeScore';

import { useHomeStore } from '@/stores';
import { useLivescoreStore } from '@/stores/liveScore-store';
import { useMatchNotify } from '@/stores/notification-store';

import {
  IScore,
  MatchState,
  MatchStateId,
  SportEventDtoWithStat,
  StatusDto,
} from '@/constant/interface';
import { extractCompetitionId, getSlug } from '@/utils';
import { convertITSMatchScoreToIScore } from '@/utils/convertInterface';

const MatchDetailSummary = ({
  matchData,
  isDetails,
}: {
  matchData: SportEventDtoWithStat;
  isDetails?: boolean;
}) => {
  const {
    matches: matchesNotify,
    // addMore: addMoreMatchNotify,
    // removeId,
  } = useMatchNotify();
  const i18n = useTrans();
  const [isBellOn, setIsBellOn] = useState<boolean>(
    matchesNotify.includes(matchData?.id)
  );
  const { homeTeam, awayTeam, uniqueTournament } = matchData || {};
  const { liveScoresSocket } = useLivescoreStore();
  const { matchLiveInfo, setMatchLiveInfo } = useHomeStore();

  const [homeScore, setHomeScore] = useState<IScore | object>({});
  const [awayScore, setawayScore] = useState<IScore | object>({});
  const [status, setStatus] = useState<StatusDto>(matchData?.status || {});
  const [currentPeriodStartTimestamp, setCurrentPeriodStartTimestamp] =
    useState<number | undefined>(matchData?.time?.currentPeriodStartTimestamp);

  useEffect(() => {
    if (matchData) {
      setHomeScore(matchData.homeScore);
      setawayScore(matchData.awayScore);
      setStatus(matchData.status);
      setCurrentPeriodStartTimestamp(
        matchData.time?.currentPeriodStartTimestamp
      );
    }
  }, [matchData]);

  useEffect(() => {
    if (liveScoresSocket && matchData) {
      const { metadata, payload } = liveScoresSocket;
      const { sport_event_id } = metadata || {};
      if (sport_event_id === matchData.id) {
        const { sport_event_status } = payload || {};
        const { away_score, home_score, status_id, kick_of_timestamp } =
          sport_event_status || {};

        home_score && setHomeScore(convertITSMatchScoreToIScore(home_score));
        away_score && setawayScore(convertITSMatchScoreToIScore(away_score));
        kick_of_timestamp && setCurrentPeriodStartTimestamp(kick_of_timestamp);
        switch (Number(status_id)) {
          case MatchStateId.FirstHalf:
            setStatus({
              code: MatchState.FirstHalf,
              description: '1st_half',
              type: 'inprogress',
            });
            break;
          case MatchStateId.HalfTime:
            setStatus({
              code: MatchState.HalfTime,
              description: 'halftime',
              type: 'inprogress',
            });
            break;
          case MatchStateId.SecondHalf:
            setStatus({
              code: MatchState.SecondHalf,
              description: '2nd_half',
              type: 'inprogress',
            });
            break;
          case MatchStateId.OverTime:
            setStatus({
              code: MatchState.OverTime,
              description: 'overtime',
              type: 'inprogress',
            });
            break;
          case MatchStateId.Penalties:
            setStatus({
              code: MatchState.PenaltyShootOut,
              description: 'penalties',
              type: 'inprogress',
            });
            break;
          case MatchStateId.Ended:
            setStatus({
              code: MatchState.End,
              description: 'ended',
              type: 'finished',
            });
            break;
          case 9:
            setStatus({
              code: 60,
              description: 'Postponed',
              type: 'postponed',
            });
            break;
          case 10:
            setStatus({
              code: 15,
              description: 'interrupted',
              type: 'inprogress',
            });
            break;
          case 12:
            setStatus({
              code: 15,
              description: 'interrupted',
              type: 'inprogress',
            });
            break;
          case 13:
            setStatus({
              code: 70,
              description: 'cancelled',
              type: 'finished',
            });
            break;
        }
      }
    }
  }, [liveScoresSocket]);

  useEffect(() => {
    if (isDetails && !matchLiveInfo) {
      setMatchLiveInfo(!matchLiveInfo);
    }
  }, []);

  // const scoreNotAvailable = Object.keys(homeScore).length === 0;

  const changeBellOn = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  if (!matchData || Object.keys(matchData).length === 0) return <></>;

  return (
    <>
      <div className=' pb-3 text-dark-dark-blue dark:text-white'>
        <div className='mb-6 hidden items-center justify-center gap-x-1.5 pt-8 lg:flex'>
          <Avatar
            id={extractCompetitionId(uniqueTournament?.id)}
            type='competition'
            isBackground={false}
            width={20}
            height={20}
            rounded={false}
            isSmall
          />
          <span className='text-csm font-bold uppercase dark:text-white'>
            {uniqueTournament?.name}
          </span>
        </div>
        <div className='mx-2 grid-cols-3 px-2 lg:grid'>
          <div className='flex flex-1 justify-center'>
            {/* Team 1 */}
            <div
              className='flex flex-1 flex-col place-content-center items-center justify-start gap-2'
              test-id='home-detail'
            >
              <div className='relative'>
                <div className='absolute -left-8 top-6'>
                  <BellIcon isBellOn={isBellOn} changeBellOn={changeBellOn} />
                </div>
                <CustomLink
                  href={
                    homeTeam.id
                      ? `/cricket/competitor/${getSlug(homeTeam.name)}/${
                          homeTeam?.id
                        }`
                      : '/'
                  }
                  target='_parent'
                >
                  <Avatar
                    id={homeTeam?.id}
                    type='team'
                    width={50}
                    height={50}
                    isBackground={false}
                    rounded={false}
                  />
                </CustomLink>
              </div>
              <CustomLink
                href={`/cricket/competitor/${getSlug(homeTeam.name)}/${
                  homeTeam?.id
                }`}
                target='_parent'
              >
                <div
                  className='text-center text-csm font-bold text-dark-dark-blue dark:text-white'
                  test-id='home-name'
                >
                  {homeTeam?.shortName || homeTeam?.name}
                </div>
              </CustomLink>
            </div>
          </div>

          {/* Score */}
          <MatchTimeScore
            match={matchData}
            status={status}
            i18n={i18n}
          />

          {/* Team 2 */}
          <div
            className=' flex flex-1 flex-col place-content-center items-center  justify-start gap-2'
            test-id='away-detail'
          >
            <div className='relative'>
              <CustomLink
                href={
                  awayTeam.id
                    ? `/cricket/competitor/${getSlug(awayTeam.name)}/${
                        awayTeam?.id
                      }`
                    : '/'
                }
                target='_parent'
              >
                <Avatar
                  id={awayTeam?.id}
                  type='team'
                  width={50}
                  height={50}
                  isBackground={false}
                  rounded={false}
                />
              </CustomLink>
              <div className='absolute -right-8 top-6'>
                <BellOff></BellOff>
              </div>
            </div>

            <CustomLink
              href={`/cricket/competitor/${getSlug(awayTeam.name)}/${
                awayTeam?.id
              }`}
              target='_parent'
            >
              <div
                className='text-center text-csm font-bold text-dark-dark-blue dark:text-white'
                test-id='name'
              >
                {awayTeam?.shortName || awayTeam?.name}
              </div>
            </CustomLink>
          </div>
        </div>
        {/* <div className='space-y-5'>
          <div className='mt-2 flex justify-center'>
            <ButtonLiveMatch />
          </div>

          <div
            className={` ${
              matchLiveInfo
                ? 'z-10 px-4 opacity-100 transition-opacity duration-500 '
                : 'pointer-events-none absolute inset-0 z-0 opacity-0'
            }`}
          >
            <MatchSimulationIframe
              id={matchData.id}
              className='rounded-lg bg-dark-main'
              height='320px'
            />
          </div>
        </div> */}
      </div>
    </>
  );
};
export default MatchDetailSummary;
