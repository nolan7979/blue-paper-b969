import {
  TwScoreCol
} from '@/components/modules/football/tw-components';

interface IConnerColumn {
  homeConner: string | number;
  awayConner: string | number;
}

const ConnerColumn: React.FC<IConnerColumn> = ({ homeConner, awayConner }) => {
  const baseClasses = 'flex h-full min-w-[1.375rem] items-center justify-center rounded-t-[4px] py-[2px] text-xs  text-all-blue dark:text-white font-semibold';
  return (
    <div
      className='flex flex-col place-content-center items-center justify-center '
      test-id='score-info'
    >
      <TwScoreCol className='!w-full justify-between'>
        <div
          className={baseClasses}
          test-id='home-conner'
        >
          {homeConner}
        </div>
        <div
          className={baseClasses}
          test-id='away-conner'
        >
          {awayConner}
        </div>
      </TwScoreCol>
    </div>
  );
};

export default ConnerColumn;
