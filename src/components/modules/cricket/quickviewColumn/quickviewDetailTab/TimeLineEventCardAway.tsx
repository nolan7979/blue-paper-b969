import PlayerStatsWithPopUp from '@/components/common/pop-over/PlayerStatsPopUp';
import { RedCard, YellowCard } from '@/components/modules/football/Cards';
import { QvPlayer } from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import { buildTimeDisplay } from '@/components/modules/football/quickviewColumn/quickviewDetailTab';
import {
  TwTimeLineEvent,
  TwTimeLineIconContainer,
} from '@/components/modules/football/tw-components';
import {
  TwTimeLineArrow,
  TwTimeLineEventContent,
} from '@/components/modules/football/tw-components/TwQuickview.module';

import YellowRedCardSVG from '/public/svg/yellow-red-card.svg';

const TimeLineEventCardAway = ({
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
    addedTime = '',
  } = event;

  const yellowCard = incidentType === 'card' && incidentClass === 'yellow';
  const yellowRedCard =
    incidentType === 'card' && incidentClass === 'yellowRed';
  const redCard = incidentType === 'card' && incidentClass === 'red';

  return (
    <li className='dev2 flex' test-id='time-item'>
      <div className='dev2 h-fit w-1/2 pr-4 pt-2 text-end text-csm text-dark-text dark:text-white' test-id='time'>
        {buildTimeDisplay(time, addedTime)}
      </div>
      <TwTimeLineEvent className='dev2'>
        <div className='dev2 w-[10%] '>
          {yellowRedCard ? (
            <div test-id={`away-yellow-red-card`}>
              <TwTimeLineIconContainer className='-ml-3'>
                <YellowRedCardSVG className='h-6 w-6'></YellowRedCardSVG>
              </TwTimeLineIconContainer>
            </div>
          ) : (
            <div test-id={redCard ? `away-red-card` : `away-yellow-card`}>
              <TwTimeLineIconContainer className='-ml-1.5'>
                {redCard && <RedCard size='xs' numCards={1} />}
                {yellowCard && <YellowCard size='xs' numCards={1} />}
              </TwTimeLineIconContainer>
            </div>
          )}
        </div>
        <TwTimeLineEventContent className='dev2 flex gap-1'>
          <TwTimeLineArrow />
          <div className='dev2 ml-3 flex-1 space-y-1'>
            <div className='dev2'>
              {player?.id && (
                <PlayerStatsWithPopUp matchData={matchData} player={player}>
                  <QvPlayer
                    id={player.id}
                    type='player'
                    name={player.name}
                    imgSize={32}
                  />
                </PlayerStatsWithPopUp>
              )}
            </div>
          </div>
        </TwTimeLineEventContent>
      </TwTimeLineEvent>
    </li>
  );
};

export default TimeLineEventCardAway;
