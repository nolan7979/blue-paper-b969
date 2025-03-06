import FeatureMatch from '@/components/common/skeleton/homePage/FeatureMatch';
import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import Rectangle from '@/components/common/skeleton/Rectangle';
import { TwSkeletonRectangle } from '@/components/modules/football/tw-components';

function QuickViewSkeleton() {
  return (
    <div className='dark:bg-primary-gradient flex h-fit w-full  flex-col gap-6 rounded-xl bg-white px-0 py-8 pt-10'>
      <FeatureMatch />
      <div className='flex gap-2 px-4'>
        <Rectangle classes='h-8 w-20' />
        <Rectangle classes='h-8 w-20' />
        <Rectangle classes='h-8 w-20' />
        <Rectangle classes='h-8 w-20' />
      </div>
      <div className='px-4'>
        <TwSkeletonRectangle className='dark:bg-primary-gradient !h-[20rem]'>
          {/* <Rectangle classes='h-[20rem] w-full' /> */}
        </TwSkeletonRectangle>
      </div>
      <MatchSkeletonMapping></MatchSkeletonMapping>
    </div>
  );
}

export default QuickViewSkeleton;
