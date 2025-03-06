import React from 'react';

import Circle from '../Circle';
import Rectangle from '../Rectangle';

function Streak() {
  const numbersArray2 = Array.from({ length: 9 }, (_, index) => index + 1);

  return (
    <div>
      <div className='flex flex-col gap-2'>
        {numbersArray2.map((number) => (
          <div key={number} className='flex items-center justify-between'>
            <Rectangle classes='h-3 w-[8rem]' />
            <Circle classes='h-5 w-5' />
            <Rectangle classes='h-3 w-5' />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Streak;
