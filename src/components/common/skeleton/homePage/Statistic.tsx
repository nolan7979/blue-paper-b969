import React from 'react';

import Rectangle from '../Rectangle';

function Statistic() {
  const numbersArray2 = Array.from({ length: 9 }, (_, index) => index + 1);

  return (
    <div className='flex flex-col gap-4'>
      {numbersArray2.map((number) => (
        <div key={number} className='grid grid-cols-2'>
          {number % 2 === 1 ? (
            <>
              <div className='flex justify-between'>
                <Rectangle classes='w-5 h-3' />
                <Rectangle classes='w-[10rem] h-3' />
              </div>
              <div></div>
            </>
          ) : (
            <>
              <div></div>
              <div className='flex justify-between'>
                <Rectangle classes='w-[10rem] h-3' />
                <Rectangle classes='w-5 h-3' />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Statistic;
