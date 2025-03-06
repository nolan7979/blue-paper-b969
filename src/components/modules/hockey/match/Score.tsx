import { StatusDto } from '@/constant/interface';

interface IScore {
  scores: { [key: string]: number[] };
  status?: StatusDto;
}


export const Score: React.FC<IScore> = ({ scores }) => {
  const orderedAvailableKeys = Object.keys(scores);

  if (Object.values(scores).length === 0) return null;

  return (
    <>
      {/* {InProgressStatesTennis.includes(status?.code || -1) && (
        <div
          className='flex flex-col place-content-center items-center justify-center'
          test-id='score-info'
        >
          <div className='flex w-full flex-col justify-between text-center text-white lg:w-6'>
            <div
              className='h-full min-w-[1.375rem] rounded-t-[4px] pb-1 pt-[2px] text-msm font-bold text-all-blue text-light-green dark:text-dark-green'
              test-id='home-conner'
            >
              {pt?.[0] || 0}
            </div>
            <div
              className='h-full min-w-[1.375rem] rounded-t-[4px] pb-1 pt-[2px] text-msm font-bold text-all-blue text-light-green dark:text-dark-green'
              test-id='home-conner'
            >
              {pt?.[1] || 0}
            </div>
          </div>
        </div>
      )} */}
      {orderedAvailableKeys.map((orderedKey, index) => {
        return (
          <div
            className='flex flex-col place-content-center items-center justify-center'
            test-id='score-info'
            key={orderedKey}
          >
            <div className='flex w-full flex-col justify-between text-center text-white lg:w-6'>
              <div className='h-full min-w-[1.375rem] rounded-t-[4px] pb-1 pt-[2px] text-msm font-bold text-all-blue dark:text-white'>
                {scores[orderedKey][0]}
                {/* {xScore && <sup>{xScore[0]}</sup>} */}
              </div>
              <div className='h-full min-w-[1.375rem] rounded-t-[4px] pb-1 pt-[2px] text-msm font-bold text-all-blue dark:text-white'>
              {scores[orderedKey][1]}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
