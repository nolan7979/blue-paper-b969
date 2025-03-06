import Rectangle from '../Rectangle';

function PredictFeatureMatch() {
  return (
    <div className='rounded-lg bg-white px-4 py-4 dark:bg-dark-skeleton'>
      <div className='flex flex-col gap-4'>
        <div>
          <Rectangle classes='h-3 w-14' />
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <Rectangle classes='h-[2.5rem] w-full rounded-md' />
          <Rectangle classes='h-[2.5rem] w-full rounded-md' />

          <Rectangle classes='h-[2.5rem] w-full rounded-md' />
        </div>
        <div className='flex justify-end'>
          <Rectangle classes='h-3 w-14' />
        </div>
      </div>
    </div>
  );
}

export default PredictFeatureMatch;
