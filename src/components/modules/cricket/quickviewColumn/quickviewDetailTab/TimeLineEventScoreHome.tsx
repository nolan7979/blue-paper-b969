
import PlayerStatsWithPopUp from '@/components/common/pop-over/PlayerStatsPopUp';
import { QvPlayerReverse } from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import { buildTimeDisplay } from '@/components/modules/football/quickviewColumn/quickviewDetailTab';
import {
  TwTimeLineArrowHome,
  TwTimeLineEventContentHome,
  TwTimeLineEventHome,
  TwTimeLineIconCol,
  TwTimeLineIconContainerHome,
  TwTimeLineOtherSideHome,
  TwTimeLineScore,
} from '@/components/modules/football/tw-components';

import { SportEventDtoWithStat } from '@/constant/interface';

import useTrans from '@/hooks/useTrans';
import GoalBlueSVG from '/public/svg/goal-blue.svg';
import OwnGoalSVG from '/public/svg/goal-own.svg';
import GoalPenMissSVG from '/public/svg/goal-pen-miss.svg';
import GoalPenSVG from '/public/svg/goal-pen.svg';
import React from 'react';

const TimeLineEventScoreHome = ({
  event,
  matchData,
}: {
  event: any;
  matchData: SportEventDtoWithStat;
}) => {
  const i18n = useTrans();
  const {
    player = {},
    time = '',
    incidentType,
    incidentClass,
    homeScore,
    awayScore,
    assist1 = {},
    addedTime = '',
  } = event;

  const isPen =
    (incidentType === 'goal' && incidentClass === 'penalty') ||
    incidentType === 'penaltyShootout' ||
    incidentType === 'inGamePenalty';

  const isPenMissed = incidentClass === 'missed'; // TODO normal pen miss
  const isOwnGoal = incidentClass === 'ownGoal';

  return (
    <li test-id='time-line-row' className='dev flex'>
      <TwTimeLineEventHome>
        <TwTimeLineEventContentHome>
          <div className=''>
            <div className=' flex-1 space-y-1'>
              <div className='dev'>
                <PlayerStatsWithPopUp matchData={matchData} player={player}>
                  <QvPlayerReverse
                    name={player.name}
                    imgSize={32}
                    id={player?.id}
                    type='player'
                  />
                </PlayerStatsWithPopUp>
              </div>
            </div>
            <PlayerStatsWithPopUp matchData={matchData} player={assist1}>
              <div className='text-end text-xs text-dark-text hover:text-logo-blue'>
                {assist1?.id !== '-1' && !!assist1.name && (
                  <span className='text-cxs'>
                    {i18n.timeline.assist}: {assist1.name}
                  </span>
                )}
              </div>
            </PlayerStatsWithPopUp>
          </div>
          <TwTimeLineArrowHome />

          <TwTimeLineScore className='text-logo-blue dark:brightness-125'>
            {!isPenMissed && (
              <span>
                {homeScore || 0}:{awayScore || 0}
              </span>
            )}
          </TwTimeLineScore>
        </TwTimeLineEventContentHome>
        <TwTimeLineIconCol className='relative'>
          <TwTimeLineIconContainerHome className='absolute -right-2.75 top-2'>
            {isPen ? (
              isPenMissed ? (
                <div test-id={`goal-pen-miss`}>
                  <GoalPenMissSVG className='h-5 w-5 text-dark-loss'></GoalPenMissSVG>
                </div>
              ) : (
                <div test-id={`goal-pen`}>
                  <GoalPenSVG className='h-5 w-5 text-logo-blue'></GoalPenSVG>
                </div>
              )
            ) : (
              <>
                {isOwnGoal ? (
                  <div test-id={`onw-goal`}>
                    <OwnGoalSVG className='h-5 w-5 text-dark-loss'></OwnGoalSVG>
                  </div>
                ) : (
                  <div test-id='goal-blue'>
                    <GoalBlueSVG className='h-4 w-4'></GoalBlueSVG>
                  </div>
                )}
              </>
            )}
          </TwTimeLineIconContainerHome>
        </TwTimeLineIconCol>
      </TwTimeLineEventHome>

      <TwTimeLineOtherSideHome className='dev2 text-dark-text'>
        {/* {buildTimeDisplay(time, addedTime)} */}
        {buildTimeDisplay(time, addedTime)}
      </TwTimeLineOtherSideHome>
    </li>
  );
};

export default TimeLineEventScoreHome;
