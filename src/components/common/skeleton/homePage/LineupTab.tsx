import Formation from '@/components/common/skeleton/homePage/Formation';
import { TwSkeletonRectangle } from '@/components/modules/football/tw-components';

function LineupTab() {
  return (
    <div className='flex flex-col gap-2'>
      <TwSkeletonRectangle className='dark:bg-primary-gradient shadow-md dark:shadow-none lg:shadow-none' />
      <TwSkeletonRectangle className='dark:bg-primary-gradient !h-[10rem] shadow-md dark:shadow-none lg:shadow-none' />
      <div className='dark:bg-primary-gradient rounded-lg bg-light-main px-4 py-2'>
        <Formation />
      </div>
      <div className='dark:bg-primary-gradient rounded-lg bg-light-main px-4 py-2'>
        <Formation />
      </div>
    </div>
  );
}

export default LineupTab;
