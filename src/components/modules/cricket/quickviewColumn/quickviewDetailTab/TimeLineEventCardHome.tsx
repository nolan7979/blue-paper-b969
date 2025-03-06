import PlayerStatsWithPopUp from '@/components/common/pop-over/PlayerStatsPopUp';
import { RedCard, YellowCard } from '@/components/modules/football/Cards';
import { QvPlayerReverse } from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import { buildTimeDisplay } from '@/components/modules/football/quickviewColumn/quickviewDetailTab';
import {
  TwTimeLineArrowHome,
  TwTimeLineEventContentHome,
  TwTimeLineEventHome,
  TwTimeLineIconContainerHome,
  TwTimeLineOtherSideHome,
} from '@/components/modules/football/tw-components';

import YellowRedCardSVG from '/public/svg/yellow-red-card.svg';

const TimeLineEventCardHome = ({
  event = null,
  matchData = {},
}: {
  event?: any;
  matchData?: any;
}) => {
  const {
    player = {},
    time = '',
    incidentType,
    incidentClass,
    reason,
    addedTime = '',
  } = event;
  const yellowCard = incidentType === 'card' && incidentClass === 'yellow';
  const yellowRedCard =
    incidentType === 'card' && incidentClass === 'yellowRed';
  const redCard = incidentType === 'card' && incidentClass === 'red';
  return (
    <li className='dev2 flex' test-id='time-item'>
      <TwTimeLineEventHome className='dev2'>
        <TwTimeLineEventContentHome className='dev2 flex gap-1'>
          <TwTimeLineArrowHome />
          <div className='dev2 ml-2 flex-1 space-y-1'>
            <div className='dev2'>
              <PlayerStatsWithPopUp matchData={matchData} player={player}>
                <QvPlayerReverse
                  name={player.name}
                  imgSize={32}
                  type='player'
                  id={player?.id}
                />
              </PlayerStatsWithPopUp>
            </div>
          </div>
        </TwTimeLineEventContentHome>
        <div className='dev2 relative w-1/12' test-id='timeline-icon'>
          {yellowRedCard ? (
            <TwTimeLineIconContainerHome className='absolute -right-3 top-0'>
              <div test-id={`home-yellow-red-card`}>
                <YellowRedCardSVG className='h-6 w-6'></YellowRedCardSVG>
              </div>
            </TwTimeLineIconContainerHome>
          ) : (
            <TwTimeLineIconContainerHome className='absolute -right-2.5 top-1'>
              <div test-id={redCard ? `home-red-card` : `home-yellow-card`}>
                {redCard && <RedCard size='xs' numCards={1} />}
                {yellowCard && <YellowCard size='xs' numCards={1} />}
              </div>
            </TwTimeLineIconContainerHome>
          )}
        </div>
      </TwTimeLineEventHome>
      <TwTimeLineOtherSideHome className='dev2 text-dark-text'>
        {/* {Number(time) > 0 && `${time}'`} */}
        {buildTimeDisplay(time, addedTime)}
      </TwTimeLineOtherSideHome>
    </li>
  );
};
export default TimeLineEventCardHome;
