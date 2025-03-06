export const ScoreRow: React.FC<{ pScore: number[]; xScore?: number[] }> = ({
  pScore,
  xScore,
}) => (
  <div className='flex w-full flex-col justify-between text-center text-white lg:w-6'>
    <div className='h-full min-w-[1.375rem] rounded-t-[4px] pb-1 pt-[2px] text-msm font-bold text-all-blue dark:text-white'>
      {pScore[0]}
      {xScore && <sup>{xScore[0]}</sup>}
    </div>
    <div className='h-full min-w-[1.375rem] rounded-t-[4px] pb-1 pt-[2px] text-msm font-bold text-all-blue dark:text-white'>
      {pScore[1]}
      {xScore && <sup>{xScore[1]}</sup>}
    </div>
  </div>
);
