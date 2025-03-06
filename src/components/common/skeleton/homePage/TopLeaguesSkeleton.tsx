import Rectangle from '@/components/common/skeleton/Rectangle';
import clsx from 'clsx';

type TopLeaguesSkeletonProps = {
  className?: string;
};

export const TopLeaguesSkeleton: React.FC<TopLeaguesSkeletonProps> = ({
  className,
}) => {
  return (
    <div className={clsx(className)}>
      <div className='flex flex-col gap-3 px-3 lg:mt-0 lg:gap-0 lg:space-y-0 lg:px-0'>
        {Array(8)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className='flex h-8 items-center pr-3  lg:py-1 lg:pl-3'
            >
              <Rectangle classes='w-6 h-5' />
              <Rectangle classes='w-24 h-5 mx-3' />
            </div>
          ))}
      </div>
    </div>
  );
};
