import Circle from '../Circle';
import Rectangle from '../Rectangle';

function MatchSkeleton() {
  return (
    <div className='mt-2 flex flex-col gap-0 px-0 py-0 dark:border-black md:mt-1 md:px-2.5 xl:mt-0 xl:gap-2 xl:px-2.5 xl:py-3 xl:!pb-0'>
      <div className='flex items-center gap-4 px-2 py-2.5 md:px-2 md:py-3 lg:px-1 xl:py-0'>
        <Circle classes='w-8 h-8 xl:!w-10 xl:!h-10' />
        <div className='flex flex-col gap-2'>
          <Rectangle classes='h-3 w-10 md:w-full' />
          <Rectangle classes='h-3 w-10 md:w-20' />
        </div>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='dark:bg-primary-gradient flex items-center gap-3 rounded-lg bg-[#F2F6F9] p-2 xl:!p-3 xl:!px-6'>
          <div className='flex flex-col gap-1'>
            <Rectangle classes='h-3 w-8' />
            <Rectangle classes='h-3 w-8' />
          </div>
          <div className='flex w-full flex-col gap-1 border-l border-solid border-gray-200 px-1 dark:border-[#333]'>
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
                <Rectangle classes='h-3 w-24 xl:w-40' />
              </div>
              <Rectangle classes='h-3 w-5' />
            </div>
          </div>
        </div>
        <div className='dark:bg-primary-gradient flex items-center gap-3 rounded-lg bg-[#F2F6F9] p-2 xl:!p-4 xl:!px-6'>
          <div className='flex flex-col gap-1'>
            <Rectangle classes='h-3 w-8' />
            <Rectangle classes='h-3 w-8' />
          </div>
          <div className='flex w-full flex-col gap-1 border-l border-solid border-gray-200 px-1 dark:border-[#333]'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Circle classes='w-5 h-5' />
                <Rectangle classes='h-3 w-10 xl:w-40' />
              </div>
              <Rectangle classes='h-3 w-5' />
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex w-full items-center gap-3'>
                <Circle classes='w-5 h-5' />
                <Rectangle classes='h-3 w-10 xl:w-40' />
              </div>
              <Rectangle classes='h-3 w-5' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchSkeleton;
