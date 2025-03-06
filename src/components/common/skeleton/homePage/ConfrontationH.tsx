import Circle from '../Circle';
import Rectangle from '../Rectangle';

function ConfrontationH() {
  return (
    <div className='dark:bg-primary-gradient rounded-lg bg-light-main'>
      <div className='p-4'>
        <div className='flex justify-center'>
          <Rectangle classes='h-3 w-32' />
        </div>
        <div className='mt-2 flex justify-between'>
          <div className='flex items-center gap-2'>
            <Circle classes='lg:w-10 lg:h-10 xl:w-14 xl:h-14' />
            <div className='flex flex-col gap-4'>
              <Rectangle classes='h-2 w-10' />
              <Rectangle classes='h-2 w-20' />
            </div>
          </div>

          <div className='flex flex-row-reverse items-center gap-2'>
            <Circle classes='lg:w-10 lg:h-10 xl:w-14 xl:h-14' />
            <div className='flex flex-col items-end gap-4'>
              <Rectangle classes='h-2 w-10' />
              <Rectangle classes='h-2 w-20' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfrontationH;
