import Circle from '@/components/common/skeleton/Circle';
import Rectangle from '@/components/common/skeleton/Rectangle';

interface SearchSkeletonProps {
  oneLine?: boolean;
}

function SearchSkeleton({ oneLine }: SearchSkeletonProps) {
  const numbersArray2 = Array.from(
    { length: oneLine ? 2 : 10 },
    (_, index) => index + 1
  );
  return (
    <div className=''>
      <div className='mt-1 flex flex-col gap-2 dark:border-black'>
        {numbersArray2.map((number) => (
          <div className='flex gap-3 px-2 py-2 lg:gap-6 lg:px-5' key={number}>
            <Circle classes='h-10 w-10 lg:h-8 lg:w-8' />
            <div className='flex flex-1 flex-col gap-2'>
              <div className='w-full'>
                <Rectangle classes='h-4 min-w-40 w-full' />
              </div>
              <div className='flex gap-4'>
                <div className='flex gap-2'>
                  <Circle classes='w-4 h-4' />
                  <div className='w-full'>
                    <Rectangle classes='w-12 h-4' />
                  </div>
                </div>
                <div className='flex gap-2'>
                  <Circle classes='w-4 h-4' />
                  <Rectangle classes='w-12 h-4' />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchSkeleton;
