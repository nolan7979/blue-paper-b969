type SubScoreProps = {
  homScore: number;
  awayScore: number;
}
export const SubScore: React.FC<SubScoreProps> = ({homScore, awayScore}) => {
  return (
    <div
      className='flex flex-col place-content-center items-center justify-center '
      test-id='score-info'
    >
      <div className=' text-white!w-full flex w-4 flex-col justify-between text-center lg:w-6'>
        <div
          className='h-full min-w-[1.375rem] rounded-t-[4px]  pb-1 pt-[2px] text-msm font-bold text-light-green dark:text-dark-green'
          test-id='home-conner'
        >
          {homScore || 0}
        </div>
        <div
          className='h-full min-w-[1.375rem] rounded-b-[4px] pb-[2px] pt-1 text-msm font-bold  text-light-green dark:text-dark-green'
          test-id='away-conner'
        >
          {awayScore || 0}
        </div>
      </div>
    </div>
  );
};
