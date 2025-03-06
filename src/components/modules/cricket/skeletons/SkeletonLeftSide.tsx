import React from 'react';
import Rectangle from '@/components/common/skeleton/Rectangle';
import { Divider } from '@/components/modules/common/tw-components/TwPlayer';

export const SkeletonLeftSide = () => {
  const numbersArray = Array.from({ length: 9 }, (_, index) => index + 1);

  return (
    <div>
      {numbersArray.map((number) => (
        <React.Fragment key={number}>
          <Divider />
          <Rectangle classes='h-[3.75rem] w-full' fullWidth />
        </React.Fragment>
      ))}
    </div>
  );
};
