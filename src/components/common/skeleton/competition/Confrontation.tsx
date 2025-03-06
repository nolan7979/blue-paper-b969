import Circle from '../Circle';
import Rectangle from '../Rectangle';

function Confrontation() {
  return (
    <div className='p-4'>
      <div className='flex justify-center'>
        <Rectangle classes='h-3 w-32' />
      </div>
      <div className='flex justify-between '>
        <div className='flex items-center gap-2'>
          <Circle classes='w-10 h-10' />
          <div className='flex flex-col gap-2'>
            <Rectangle classes='h-2 w-10' />
            <Rectangle classes='h-2 w-20' />
          </div>
        </div>

        <div className='flex flex-row-reverse items-center gap-2'>
          <Circle classes='w-10 h-10' />
          <div className='flex flex-col items-end gap-2'>
            <Rectangle classes='h-2 w-10' />
            <Rectangle classes='h-2 w-20' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Confrontation;
