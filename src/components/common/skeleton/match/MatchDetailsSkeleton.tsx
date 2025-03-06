import Circle from '@/components/common/skeleton/Circle';
import Rectangle from '@/components/common/skeleton/Rectangle';
import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';

const MatchDetailsSkeleton: React.FC = () => {
  return (
    <div className='layout'>
      <div className='hidden py-4 lg:block'>
        <Rectangle classes='h-3 w-10 xl:w-40' />
      </div>
      <div className='grid w-full grid-cols-12 gap-4'>
        <div className='col-span-4 hidden lg:col-span-3 lg:block'>
          <div className='hidden xl:block'>
            <MatchSkeletonMapping />
          </div>
        </div>
        <div className=' col-span-5 hidden lg:block'>
          <div className='sticky top-20'>
            <div className='dark:bg-primary-gradient dark:border-linear-box rounded-md'>
              <div className=' flex flex-col items-center justify-center gap-4 p-4 text-white '>
                <Rectangle classes='h-3 w-10 xl:w-40' />
                <Rectangle classes='h-3 w-10 xl:w-40' />
              </div>
              <div className='flex items-center justify-between p-4 text-white'>
                <div className='flex flex-col items-center justify-center'>
                  <Circle classes='w-[56px] h-[56px]' />
                  <div className='text-center'>
                    <Rectangle classes='h-3 w-10 xl:w-40' />
                  </div>
                </div>
                <div>
                  <Rectangle classes='h-3 w-10 xl:w-40' />
                </div>
                <div className='flex flex-col items-center justify-center'>
                  <Circle classes='w-[56px] h-[56px]' />
                  <div className='text-center'>
                    <Rectangle classes='h-3 w-10 xl:w-40' />
                  </div>
                </div>
              </div>
              <div className='flex justify-center text-center'>
                <Rectangle classes='h-3 w-10 xl:w-40' />
              </div>
              <div className='mt-5'>
                <Rectangle classes='h-[310px] w-[560px]' />
              </div>
            </div>
          </div>
        </div>
        <div className='col-span-12 lg:col-span-4'>
          <div className='top-20 lg:sticky'>
            <div className='w-full rounded-md lg:p-3 lg:pt-0'>
              <MatchSkeletonMapping />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MatchDetailsSkeleton;
