import Circle from '../Circle';
import Rectangle from '../Rectangle';

function LastMatchSkeleton() {
  const numbersArray2 = Array.from({ length: 9 }, (_, index) => index + 1);
  return (
    <div>
      <div className=' flex gap-7 px-2 pt-4 lg:px-4'>
        <Rectangle classes='h-5 w-16' />
        <Rectangle classes='h-5 w-[8.25rem]' />
      </div>
      <div className=' mt-6 flex flex-col gap-1 px-0.5 py-0 dark:border-black md:mt-1 md:px-2.5 lg:px-1 xl:mt-4 xl:gap-2 xl:px-2.5 xl:py-0 xl:!pb-0'>
        {numbersArray2.map((number) => (
          <div className=' flex flex-col gap-1 md:mt-4' key={number}>
            <div className='dark:bg-primary-gradient flex items-center rounded-lg bg-[#F2F6F9] p-2 xl:!p-3 xl:!px-3'>
              <div className='flex w-2/5 flex-col gap-2'>
                <div className='flex items-center gap-1'>
                  <Circle classes='h-5 w-5' />
                  <div className='w-full flex-1'>
                    <Rectangle classes='h-3 w-[60%]' />
                  </div>
                </div>
                <Rectangle classes='h-3 w-[90%]' />
              </div>
              <div className='flex flex-col gap-1 px-1'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Circle classes='w-5 h-5' />
                    <Rectangle classes='h-3 w-10 xl:w-40' />
                  </div>
                  <Rectangle classes='h-3 w-5' />
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Circle classes='w-5 h-5' />
                    <Rectangle classes='h-3 w-24 xl:w-60' />
                  </div>
                  <Rectangle classes='h-3 w-5' />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LastMatchSkeleton;
