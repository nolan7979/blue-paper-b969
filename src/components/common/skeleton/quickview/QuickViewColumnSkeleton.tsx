import Circle from '@/components/common/skeleton/Circle';
import Rectangle from '@/components/common/skeleton/Rectangle';

const QuickViewColumnSkeleton = () => {
  return (
    <div className='h- space-y-4'>
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
      <div className='bg-primary-gradient p-4'>
        <div className='flex w-full flex-col items-center justify-center space-y-6'>
          <Rectangle classes='h-4 w-32' />
          <div className='flex w-full justify-evenly'>
            <div className='flex flex-col items-center justify-center gap-2'>
              <Circle classes='h-12 w-12 !rounded-full' />
              <Rectangle classes='h-3 w-20' />
            </div>
            <div className='flex flex-col items-center justify-center gap-2'>
              <Circle classes='h-12 w-12 !rounded-full' />
              <Rectangle classes='h-3 w-20' />
            </div>
            <div className='flex flex-col items-center justify-center gap-2'>
              <Circle classes='h-12 w-12 !rounded-full' />
              <Rectangle classes='h-3 w-20' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewColumnSkeleton;
