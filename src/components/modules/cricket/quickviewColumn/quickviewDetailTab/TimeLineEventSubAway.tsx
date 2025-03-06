import { useTranslation } from 'next-i18next';

import Avatar from '@/components/common/Avatar';
import PlayerStatsWithPopUp from '@/components/common/pop-over/PlayerStatsPopUp';
import { buildTimeDisplay } from '@/components/modules/football/quickviewColumn/quickviewDetailTab';
import {
  TwTimeLineArrow,
  TwTimeLineEvent,
  TwTimeLineEventContent,
  TwTimeLineIconContainer,
} from '@/components/modules/football/tw-components';

import SubSVG from '/public/svg/sub.svg';
import useTrans from '@/hooks/useTrans';

const TimeLineEventSubAway = ({
  event = null,
  matchData = {},
}: {
  event?: any;
  matchData?: any;
}) => {
  const i18n = useTrans()
  const { time = '', playerIn = {}, playerOut = {}, addedTime } = event;

  return (
    <li className='dev2 flex'>
      <div className='dev2 h-fit w-1/2 pr-4 pt-2 text-end text-csm text-dark-text dark:text-white'>
        {buildTimeDisplay(time, addedTime)}
      </div>
      <TwTimeLineEvent className='dev2'>
        <div className='dev2 w-[10%] '>
          <TwTimeLineIconContainer className='-ml-2.5'>
            <div test-id={`away-player`}>
              <SubSVG className='h-5 w-5'></SubSVG>
            </div>
          </TwTimeLineIconContainer>
        </div>
        <TwTimeLineEventContent className='dev2 flex gap-1'>
          <TwTimeLineArrow />
          <div className='space-y-1'>
            <div className='dev2 ml-1 flex flex-1 gap-2 space-y-1' test-id='player-timeline'>
              <div className='dev2 flex flex-row-reverse items-center -space-x-1'>
                <PlayerStatsWithPopUp
                  matchData={matchData}
                  player={playerOut}
                  classes='z-0 bg-white rounded-full w-8 h-8'
                >
                  <Avatar
                    id={playerOut?.id}
                    type='player'
                    width={32}
                    height={32}
                    className='ring-2 ring-red-600'
                    isSmall
                  />
                </PlayerStatsWithPopUp>

                <PlayerStatsWithPopUp
                  matchData={matchData}
                  player={playerIn}
                  classes='z-10 bg-white rounded-full w-8 h-8'
                >
                  <Avatar
                    id={playerIn?.id}
                    type='player'
                    width={32}
                    height={32}
                    className='ring-2 ring-green-400'
                    isSmall
                  />
                </PlayerStatsWithPopUp>
              </div>
              <div className='grid'>
                <p className='truncate whitespace-nowrap text-mxs text-dark-text-full lg:text-xs' test-id='name-play-in'>
                  {playerIn?.name}
                </p>
                {playerOut?.name && (
                  <p className='dev2 truncate whitespace-nowrap text-mxs text-black dark:text-dark-text lg:text-xs'>
                    {i18n.timeline.out}: {playerOut?.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </TwTimeLineEventContent>
      </TwTimeLineEvent>
    </li>
  );
};
export default TimeLineEventSubAway;
