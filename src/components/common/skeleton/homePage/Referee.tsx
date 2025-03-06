import Circle from '../Circle';
import Rectangle from '../Rectangle';

function Referee() {
  return (
    <div className='flex flex-col gap-2 px-4 py-2 '>
      <div className='flex justify-between'>
        <Rectangle classes='h-2 w-10' />
        <Rectangle classes='h-2 w-[5.5rem]' />
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Circle classes='w-7 h-7' />
          <Rectangle classes='h-2 w-[5rem]' />
        </div>
        <div className='flex gap-2'>
          <Rectangle classes='h-2 w-10' />
          <Rectangle classes='h-2 w-10' />
        </div>
      </div>
    </div>
  );
}

export default Referee;
