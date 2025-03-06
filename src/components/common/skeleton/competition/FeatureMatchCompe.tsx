import Circle from '../Circle';
import Rectangle from '../Rectangle';

function FeatureMatchCompe() {
  return (
    <div className='dark:bg-primary-gradient rounded-lg bg-white px-2 py-1 xl:!px-8 xl:!py-4'>
      <div className='flex justify-between'>
        <div className='flex flex-col items-center gap-4'>
          <Circle classes='w-7 h-7 lg:w-10 lg:h-10 xl:!w-14 xl:!h-14' />
          <Rectangle classes='h-3 w-[3rem] xl:w-[4.5rem]' />
        </div>
        <div className='flex flex-col items-center  justify-start gap-2'>
          <Rectangle classes='h-5 w-[3.5rem]' />
          <Rectangle classes='h-3 w-[5.5rem]' />
        </div>
        <div className='flex flex-col items-center gap-4'>
          <Circle classes='w-7 h-7 lg:w-10 lg:h-10 xl:!w-14 xl:!h-14' />
          <Rectangle classes='h-3 w-[3rem] xl:w-[4.5rem]' />
        </div>
      </div>
    </div>
  );
}

export default FeatureMatchCompe;
