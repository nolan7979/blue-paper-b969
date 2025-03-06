import useTrans from '@/hooks/useTrans';

import {
  buildTimeDisplay,
  varResult,
} from '@/components/modules/football/quickviewColumn/quickviewDetailTab';
import {
  TwTimeLineArrow,
  TwTimeLineEvent,
  TwTimeLineEventContent,
  TwTimeLineIconContainer,
} from '@/components/modules/football/tw-components';
import VarSVG from '/public/svg/var.svg';
import { QvPlayer } from '@/components/modules/football/quickviewColumn/QuickViewComponents';

const TimeLineEventVarAway = ({ event }: { event: any }) => {
  const i18n = useTrans();
  const { incidentClass, time, confirmed, addedTime = '', player } = event || {};

  const varResultDisplay = varResult(incidentClass, confirmed, i18n);

  return (
    <li className='dev2 flex'>
      <div className='dev2 h-fit w-1/2 pr-4 pt-2 text-end text-dark-text'>
        {buildTimeDisplay(time, addedTime)}
      </div>
      <TwTimeLineEvent className='dev2'>
        <div className='dev2 w-[10%] '>
          <TwTimeLineIconContainer className='-ml-2.5'>
            <div test-id="away-var">
              <VarSVG className='h-4 w-4'></VarSVG>
            </div>
          </TwTimeLineIconContainer>
        </div>
        <TwTimeLineEventContent className='dev2 flex gap-1'>
          <TwTimeLineArrow />
          <div className='dev2 ml-2 flex-1 space-y-1'>
            <div className='dev2'>
              <QvPlayer
                name={player?.name}
                id={player?.id}
                imgSize={32}
                type='player'
              />
              <div className=' text-xs text-dark-text'>
                {varResultDisplay}
              </div>
            </div>
          </div>
        </TwTimeLineEventContent>
      </TwTimeLineEvent>
    </li>
  );
};
export default TimeLineEventVarAway;
