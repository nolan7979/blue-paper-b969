
import Avatar from '@/components/common/Avatar';
import PlayerStatsWithPopUp from '@/components/common/pop-over/PlayerStatsPopUp';
import { buildTimeDisplay } from '@/components/modules/football/quickviewColumn/quickviewDetailTab';
import {
  TwTimeLineArrowHome,
  TwTimeLineEventContentHome,
  TwTimeLineEventHome,
  TwTimeLineIconContainerHome,
  TwTimeLineOtherSideHome,
} from '@/components/modules/football/tw-components';

import useTrans from '@/hooks/useTrans';
import SubSVG from '/public/svg/sub.svg';
const TimeLineEventSubHome = ({
  event = null,
  matchData,
}: {
  event?: any;
  matchData?: any;
}) => {
  const i18n = useTrans()
  const { time = '', playerIn = {}, playerOut = {}, addedTime = '' } = event;

  return (
    <li className='dev2 flex'>
      <TwTimeLineEventHome className='dev2'>
        <TwTimeLineEventContentHome className='dev2 flex gap-1'>
          <div className='flex-1  space-y-1'>
            <div className='dev2 ml-1 flex flex-1 justify-end gap-2 space-y-1'>
              <div className='grid'>
                {playerIn?.name && (
                  <p className='truncate whitespace-nowrap text-mxs text-dark-text-full lg:text-xs'>
                    {playerIn?.name}
                  </p>
                )}
                {playerOut?.name && (
                  <p className='dev2 truncate whitespace-nowrap text-mxs text-black dark:text-dark-text lg:text-xs'>
                    {i18n.timeline.out}: {playerOut?.name}
                  </p>
                )}
              </div>

              <div className='dev2 flex items-center -space-x-1'>
                <PlayerStatsWithPopUp
                  matchData={matchData}
                  player={playerOut}
                  classes='bg-white rounded-full w-8 h-8'
                >
                  <Avatar
                    id={playerOut?.id}
                    type='player'
                    width={32}
                    height={32}
                    isSmall
                    className='ring-2 ring-red-600'
                  />
                </PlayerStatsWithPopUp>

                <PlayerStatsWithPopUp
                  matchData={matchData}
                  player={playerIn}
                  classes='bg-white rounded-full w-8 h-8'
                >
                  <Avatar
                    id={playerIn?.id}
                    type='player'
                    width={32}
                    height={32}
                    isSmall
                    className='ring-2 ring-green-400'
                  />
                </PlayerStatsWithPopUp>
              </div>
            </div>
          </div>
          <TwTimeLineArrowHome />
        </TwTimeLineEventContentHome>
        <div className='dev2 relative w-1/12' test-id={`home-player-${playerOut?.name?.toLowerCase()}-${playerIn?.name?.toLowerCase()}`}>
          <TwTimeLineIconContainerHome className='absolute -right-3 top-1'>
            <SubSVG className='h-5 w-5'></SubSVG>
          </TwTimeLineIconContainerHome>
        </div>
      </TwTimeLineEventHome>
      <TwTimeLineOtherSideHome className='dev2 text-dark-text'>
        {buildTimeDisplay(time, addedTime)}
      </TwTimeLineOtherSideHome>
    </li>
  );
};

export default TimeLineEventSubHome;
