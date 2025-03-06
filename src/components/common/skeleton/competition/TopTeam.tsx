import React from 'react';

import Circle from '../Circle';
import Rectangle from '../Rectangle';

interface TopTeamProps {
  number: number;
}

const TopTeam: React.FC<TopTeamProps> = ({ number }) => {
  return (
    <div className='flex items-center justify-between gap-5'>
      <div className='flex flex-1 items-center gap-5'>
        <p className='flex justify-end text-gray-600 dark:text-[#888]'>
          {number}
        </p>
        <Circle classes='h-10 w-10' />
        <div className='w-full flex-1'>
          <Rectangle classes='h-3 w-full' />
        </div>
      </div>
      <Rectangle classes='h-6 w-8' />
    </div>
  );
};

export default TopTeam;
