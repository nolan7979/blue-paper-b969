import Rectangle from '@/components/common/skeleton/Rectangle';
import { TwSkeletonRectangle } from '@/components/modules/football/tw-components';

function StandingSkeleton() {
  return (
    <TwSkeletonRectangle className='dark:bg-primary-gradient !h-[50rem] space-y-4 !p-2.5'>
      <Rectangle classes='h-5 w-32' />
      <div className='flex gap-3'>
        <Rectangle classes='h-9 w-16 !rounded-lg' />
        <Rectangle classes='h-9 w-16 !rounded-lg' />
        <Rectangle classes='h-9 w-16 !rounded-lg' />
      </div>
      <div className='h-full w-full !bg-[#F2F6F9] dark:!bg-[#1B1B1B]'></div>
    </TwSkeletonRectangle>
  );
}

export default StandingSkeleton;
