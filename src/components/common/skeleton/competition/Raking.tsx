import Circle from '../Circle';
import Rectangle from '../Rectangle';

function Raking() {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-3'>
        <Rectangle classes='w-3 h-3 rounded-sm' />
        <Circle classes='h-10 w-10' />
        <div className='flex flex-col gap-2'>
          <Rectangle classes='h-3 xl:w-[10rem]' />
          <Rectangle classes='h-3 w-[6rem]' />
        </div>
      </div>
      <Rectangle classes='h-6 w-8' />
    </div>
  );
}

export default Raking;
