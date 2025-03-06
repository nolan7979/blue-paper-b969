
import PlayerStatsWithPopUp from '@/components/common/pop-over/PlayerStatsPopUp';
import { QvPlayer } from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import { buildTimeDisplay } from '@/components/modules/football/quickviewColumn/quickviewDetailTab';
import {
  TwTimeLineArrow,
  TwTimeLineEvent,
  TwTimeLineEventContent,
  TwTimeLineIconCol,
  TwTimeLineIconContainer,
  TwTimeLineOtherSide,
  TwTimeLineScore,
} from '@/components/modules/football/tw-components';

import { SportEventDtoWithStat } from '@/constant/interface';

import useTrans from '@/hooks/useTrans';
import GoalBlueSVG from '/public/svg/goal-blue.svg';
import OwnGoalSVG from '/public/svg/goal-own.svg';
import GoalPenMissSVG from '/public/svg/goal-pen-miss.svg';
import GoalPenSVG from '/public/svg/goal-pen.svg';
import React from 'react';

const TimeLineEventScoreAway = ({
  event,
  matchData,
}: {
  event: any;
  matchData: SportEventDtoWithStat;
}) => {
  const {
    player = {},
    time = '',
    assist1 = {},
    homeScore,
    awayScore,
    incidentType,
    incidentClass,
    addedTime = '', // TODO
  } = event;
  const i18n = useTrans();

  const isPen =
    (incidentType === 'goal' && incidentClass === 'penalty') ||
    incidentType === 'penaltyShootout' ||
    incidentType === 'inGamePenalty';

  const isPenMissed = incidentClass === 'missed'; // TODO normal pen miss
  const isOwnGoal = incidentClass === 'ownGoal';

  return (
    <li className='dev2 flex' test-id='time-item'>
      <TwTimeLineOtherSide className='dev2 text-dark-text'>
        {buildTimeDisplay(time, addedTime)}
      </TwTimeLineOtherSide>
      <TwTimeLineEvent className='dev2'>
        <TwTimeLineIconCol className='!w-[10%]'>
          <TwTimeLineIconContainer className='-ml-2.75'>
            {isPen ? (
              isPenMissed ? (
                <div test-id={`away-pen-miss`}>
                  <GoalPenMissSVG className='h-5 w-5 text-dark-loss'></GoalPenMissSVG>
                </div>
              ) : (
                <div test-id={`away-pen`}>
                  <GoalPenSVG className='h-5 w-5 text-logo-yellow'></GoalPenSVG>
                </div>
              )
            ) : (
              <>
                {isOwnGoal ? (
                  <div test-id={`away-own-goal`}>
                    <OwnGoalSVG className='h-5 w-5 text-dark-loss'></OwnGoalSVG>
                  </div>
                ) : (
                  <div test-id={`away-goal`}>
                    <GoalBlueSVG className='h-4 w-4'></GoalBlueSVG>
                  </div>
                )}
              </>
            )}
          </TwTimeLineIconContainer>
        </TwTimeLineIconCol>

        <TwTimeLineEventContent className='dev2 flex gap-1'>
          <TwTimeLineArrow />
          <TwTimeLineScore className='dev2 text-light-detail-away'>
            {!isPenMissed && (
              <span>
                {homeScore || 0}:{awayScore || 0}
              </span>
            )}
          </TwTimeLineScore>
          <div>
            <div className='dev2 flex-1 space-y-1'>
              <div className='dev2'>
                <PlayerStatsWithPopUp matchData={matchData} player={player}>
                  <QvPlayer
                    id={player?.id}
                    type='player'
                    name={player.name}
                    imgSize={32}
                  />
                </PlayerStatsWithPopUp>
              </div>
            </div>
            <PlayerStatsWithPopUp matchData={matchData} player={assist1}>
              <div className='text-mxs text-dark-text'>
                {assist1?.id !== '' && (
                  <span>
                    {i18n.timeline.assist}: {assist1.name}
                  </span>
                )}
              </div>
            </PlayerStatsWithPopUp>
          </div>
        </TwTimeLineEventContent>
      </TwTimeLineEvent>
    </li>
  );
};

export default TimeLineEventScoreAway;
