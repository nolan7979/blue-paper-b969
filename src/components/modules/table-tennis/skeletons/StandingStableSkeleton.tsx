import Rectangle from '@/components/common/skeleton/Rectangle';

type StandingStableSkeletonProps = {
  title: string;
};

export const StandingStableSkeleton: React.FC<StandingStableSkeletonProps> = ({
  title,
}) => {
  return (
    <div className='flex w-full flex-col gap-4 rounded-lg bg-white dark:bg-dark-container px-4 py-3'>
      <h3 className='font-primary font-bold uppercase text-black dark:text-white'>{title}</h3>
      <div className='w-44 overflow-hidden rounded-full'>
        <Rectangle classes='w-44 h-[2.1875rem]' />
      </div>
      <Rectangle classes='h-44 w-full' fullWidth />
    </div>
  );
};
