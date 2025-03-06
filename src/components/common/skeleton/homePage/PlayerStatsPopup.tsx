import Circle from '../Circle';
import Rectangle from '../Rectangle';

function PlayerSkeleton() {
  const numbersArray2 = Array.from({ length: 20 }, (_, index) => index + 1);

  return (
    <div className='mt-2 flex flex-col gap-0 bg-white px-0 py-0 dark:border-black md:mt-1 md:px-2.5 xl:mt-0 xl:gap-2 xl:px-2.5 xl:py-3 xl:!pb-0'>
      <div className='flex flex-col items-center justify-center gap-4 px-2 py-2.5 md:px-2 md:py-3 lg:px-1'>
        <Circle classes='w-8 h-8 xl:!w-20 xl:!h-20' />
        <Rectangle classes='h-6 w-24' />
      </div>
      <div className='flex justify-center pb-3'>
        <Circle classes='w-52 h-14' />
      </div>
      <div className='flex flex-col gap-4'>
        {numbersArray2.map((item, idx) => {
          return (
            <div key={idx} className='flex justify-between'>
              <Rectangle classes='h-4 w-52' />
              <Rectangle classes='h-4 w-10' />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PlayerSkeleton;
