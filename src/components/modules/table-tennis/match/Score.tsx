import { StatusDto } from '@/constant/interface';
import { checkInProgessMatch } from '@/utils/tableTennisUtils';
import clsx from 'clsx';

interface IScore {
  scores: { [key: string]: number[] };
  status?: StatusDto;
}

export const Score: React.FC<IScore> = ({ scores, status }) => {
  const lastPScore =
    Object.keys(scores).length > 0 ? Object.keys(scores).length : 0;

  if (Object.values(scores).length === 0) return null;

  return (
    <>
      {checkInProgessMatch(status?.code || -1) && (
        <div
          className='flex flex-col place-content-center items-center justify-center'
          test-id='score-info'
        >
          <div className='flex w-full flex-col justify-between text-center text-white lg:w-6'>
            <div
              className='h-full min-w-[1.375rem] rounded-t-[4px] pb-1 pt-[2px] text-msm font-bold text-all-blue text-light-green dark:text-dark-green'
              test-id='home-conner'
            >
              {lastPScore > 0 ? scores[`p${lastPScore}`][0] : 0}
            </div>
            <div
              className='h-full min-w-[1.375rem] rounded-t-[4px] pb-1 pt-[2px] text-msm font-bold text-all-blue text-light-green dark:text-dark-green'
              test-id='home-conner'
            >
              {lastPScore > 0 ? scores[`p${lastPScore}`][1] : 0}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
