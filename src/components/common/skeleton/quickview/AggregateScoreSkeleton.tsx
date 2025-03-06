import Rectangle from '@/components/common/skeleton/Rectangle';

const AggregateScoreSkeleton: React.FC = () => {
  return (
    <div className='bg-primary-gradient h-'>
      <div className='flex justify-center gap-x-8 rounded-md p-2.5'>
        <div className='flex w-full flex-col items-center justify-center gap-2'>
          <Rectangle classes='h-4 w-24' />
          <Rectangle classes='h-8 w-full' fullWidth />
        </div>
        <div className='flex w-full flex-col items-center justify-center gap-2'>
          <Rectangle classes='h-4 w-24' />
          <Rectangle classes='h-8 w-full' fullWidth />
        </div>
      </div>
    </div>
  );
};
export default AggregateScoreSkeleton;
