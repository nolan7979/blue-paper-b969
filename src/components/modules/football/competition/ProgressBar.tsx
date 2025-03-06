export const ProgressBar = () => {
  return (
    <div className='flex flex-col gap-1'>
      <div className='relative h-[0.315rem] w-full overflow-hidden rounded-full  bg-primary-mask'>
        <div className='absolute left-0 h-full w-1/2 bg-dark-blue'></div>
      </div>
      <div className='flex w-full justify-between font-primary text-xs'>
        <span>25/08/24</span>
        <span>02/09/24</span>
      </div>
    </div>
  );
};
