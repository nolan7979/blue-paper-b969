import RakingHome from './RakingHome';
import Circle from '../Circle';
import Rectangle from '../Rectangle';

function Formation() {
  const numbersArray2 = Array.from({ length: 9 }, (_, index) => index + 1);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-center gap-2'>
        <Circle classes='h-12 w-12' />
        <Rectangle classes='h-3 w-10' />
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Circle classes='h-12 w-12' />
          <div className='flex flex-col gap-2'>
            <Rectangle classes='h-3 xl:w-[10rem]' />
            <Rectangle classes='h-3 w-[6rem]' />
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        {numbersArray2.map((number) => (
          <RakingHome key={number} />
        ))}
      </div>
    </div>
  );
}

export default Formation;
