import Circle from '@/components/common/skeleton/Circle';
import Rectangle from '@/components/common/skeleton/Rectangle';

const MatchDetailSummarySkeleton: React.FC = () => {
  return (
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
  );
};
export default MatchDetailSummarySkeleton;
