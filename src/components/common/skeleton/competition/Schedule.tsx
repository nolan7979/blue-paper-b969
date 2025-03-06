import Rectangle from '../Rectangle';

function Schedule() {
  return (
    <div className='flex gap-10 px-2 py-4'>
      <div className='px-4'>
        <div className='flex flex-col items-end gap-2'>
          <Rectangle classes='h-3 w-[7rem]' />
          <Rectangle classes='h-3 w-[7rem]' />
        </div>
      </div>
      <div className=''>
        <div className='flex flex-col gap-2'>
          <Rectangle classes='h-3 w-[5rem]' />
          <Rectangle classes='h-3 w-[8rem]' />
        </div>
      </div>
    </div>
  );
}

export default Schedule;
