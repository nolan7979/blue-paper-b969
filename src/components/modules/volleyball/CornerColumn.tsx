import {
  TwCornerCol,
  TwScoreCol,
} from '@/components/modules/football/tw-components';
import { isMatchNotStarted } from '@/utils';

interface IConnerColumn {
  homeConner: string | number;
  awayConner: string | number;
}

const ConnerColumn: React.FC<IConnerColumn> = ({ homeConner, awayConner }) => {
  return (
    <div className='flex flex-col place-content-center items-center justify-center ' test-id='score-info'>
      <TwScoreCol className='!w-full justify-between'>
        <div className='h-full min-w-[1.375rem] rounded-t-[4px]  pb-1 pt-[2px] text-msm font-bold text-all-blue  dark:text-white' test-id='home-conner'>
          {homeConner}
        </div>
        <div className='h-full min-w-[1.375rem] rounded-b-[4px] pb-[2px] pt-1 text-msm font-bold  text-all-blue  dark:text-white' test-id='away-conner'>
          {awayConner}
        </div>
      </TwScoreCol>
    </div>
  );
};

export default ConnerColumn;
