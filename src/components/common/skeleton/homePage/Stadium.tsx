import Rectangle from '../Rectangle';

function Stadium() {
  return (
    <div className='flex flex-col gap-2 px-4 py-2 '>
      <div className='flex justify-between'>
        <Rectangle classes='h-2 w-10' />
        <Rectangle classes='h-2 w-[3rem]' />
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Rectangle classes='h-2 w-[5rem]' />
        </div>
        <div className='flex gap-2'>
          <Rectangle classes='h-2 w-[6rem]' />
        </div>
      </div>
    </div>
  );
}

export default Stadium;
