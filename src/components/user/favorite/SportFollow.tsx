import React, { useState } from 'react';
import tw from 'twin.macro';

import RowFollow from '@/components/user/favorite/RowFollow';

export const TwButtonFa = tw.button`
  rounded-lg px-3 py-1.5 lg:px-0 lg:text-csm
`;
export const TwTitleFa = tw.div`
  text-base font-bold uppercase lg:text-logo-blue
`;
export const TwSportTitleFa = tw.div`text-ccsm`;
export const TwCardFa = tw.div`space-y-6 border-b border-solid border-light-line-stroke-cd dark:border-dark-stroke p-4`;

interface TeamMember {
  id: number;
  name: string;
}

interface SportFollowProps {
  title: string;
  arrayFollow: TeamMember[];
  type: string;
}

function SportFollow({ title, arrayFollow, type }: SportFollowProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleItems = showAll ? arrayFollow : arrayFollow.slice(0, 5);

  const toggleShowAll = () => {
    setShowAll((prevShowAll) => !prevShowAll);
  };

  return (
    <TwCardFa>
      <div className='space-y-4'>
        <TwSportTitleFa>
          <p className='capitalize'>{title}</p>
        </TwSportTitleFa>
        <div className='flex flex-col gap-y-3'>
          {visibleItems.map((item: TeamMember, index: number) => (
            <RowFollow key={index} team={item} type={type} title={title} />
          ))}
          {arrayFollow.length > 5 && (
            <TwButtonFa
              onClick={toggleShowAll}
              className='text-right !text-msm text-logo-blue'
            >
              {showAll ? 'Show Less' : 'Show All'}
            </TwButtonFa>
          )}
        </div>
      </div>
    </TwCardFa>
  );
}

export default SportFollow;
