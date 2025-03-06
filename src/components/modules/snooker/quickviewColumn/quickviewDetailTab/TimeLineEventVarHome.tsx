import useTrans from '@/hooks/useTrans';

import {
  buildTimeDisplay,
  varResult,
} from '@/components/modules/football/quickviewColumn/quickviewDetailTab';
import {
  TwTimeLineArrowHome,
  TwTimeLineEventContentHome,
  TwTimeLineEventHome,
  TwTimeLineIconContainerHome,
  TwTimeLineOtherSideHome,
} from '@/components/modules/football/tw-components';
import VarSVG from '/public/svg/var.svg';
import { QvPlayerReverse } from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import PlayerStatsWithPopUp from '@/components/common/pop-over/PlayerStatsPopUp';
import { SportEventDtoWithStat } from '@/constant/interface';

const TimeLineEventVarHome = ({ event,matchData }: { event: any, matchData: SportEventDtoWithStat }) => {
  const i18n = useTrans();
  const { incidentClass, time, confirmed, addedTime = '',player  } = event || {};

  const varResultDisplay = varResult(incidentClass, confirmed, i18n);

  return (
    <li className='dev2 flex'>
      <TwTimeLineEventHome className='dev2'>
        <TwTimeLineEventContentHome className='dev2 flex gap-1'>
          <div className='dev2 mr-2 flex-1 space-y-1'>
            <div className='dev2'>
            <PlayerStatsWithPopUp matchData={matchData} player={player}>
              <QvPlayerReverse
                name={player?.name}
                id={player?.id}
                imgSize={32}
              />
              <div className=' text-end text-xs text-dark-text'>
                {varResultDisplay}
              </div>
            </PlayerStatsWithPopUp>
            </div>
          </div>
          <TwTimeLineArrowHome />
        </TwTimeLineEventContentHome>
        <div className='dev2 relative w-1/12'>
          <TwTimeLineIconContainerHome className='dev2 absolute -right-0.5 top-2 -mr-2'>
            <div test-id='home-var'>
              <VarSVG className='h-4 w-4'></VarSVG>
            </div>
          </TwTimeLineIconContainerHome>
        </div>
      </TwTimeLineEventHome>
      <TwTimeLineOtherSideHome className='dev2 text-dark-text'>
        {/* {buildTimeDisplay(time, addedTime)} */}
        {buildTimeDisplay(time, addedTime)}
      </TwTimeLineOtherSideHome>
    </li>
  );
};
export default TimeLineEventVarHome;
