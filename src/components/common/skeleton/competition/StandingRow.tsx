import Circle from '../Circle';
import Rectangle from '../Rectangle';

function StandingRow() {
  return (
    <div className='px-4 py-2'>
      <div className='flex items-center gap-5'>
        <Circle classes='w-7 h-7' />
        <div className='flex w-full justify-between'>
          <div className='w-[80%]'>
            <Rectangle classes='h-3 w-full' />
          </div>
          <div className='w-[18%]'>
            <Rectangle classes='h-3 w-full' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StandingRow;
