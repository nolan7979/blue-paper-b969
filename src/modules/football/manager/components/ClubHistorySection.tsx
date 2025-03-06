import { useState } from 'react';
import { HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';
import tw from 'twin.macro';
import useTrans from '@/hooks/useTrans';

import CareerHistoryEntry from '@/modules/football/manager/components/CareerHistoryEntry';

const ClubHistorySection = ({
  // managerDetails,
  managerCareerHistory,
}: {
  // managerDetails: any;
  managerCareerHistory: any;
}) => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const { careerHistory = [] } = managerCareerHistory || {};
  const i18n = useTrans();

  const trimmedCareerHistory = showAll
    ? careerHistory
    : careerHistory.slice(0, 6);

  return (
    <div className=''>
      <div className=' flex items-center gap-4 border-b border-light-match py-1.5 text-dark-text dark:border-dark-stroke'>
        <span className=' w-10'></span>
        <div className=' flex-1 text-csm font-bold'>{i18n.menu.team}</div>
        <div className=' flex w-2/5 text-csm font-bold'>
          {/* <TwCareerText className='text-right'>{avgPoints}</TwCareerText> */}
          {/* <div className='flex justify-between'> */}
          <div className='w-1/5 text-right'>
            <span className=''>{i18n.menu.total}</span>
          </div>
          <div className='w-1/5 text-right'>
            <span className='text-dark-win'>W</span>
          </div>
          <div className='w-1/5 text-right'>
            <span className='text-dark-draw'>D</span>
          </div>
          <div className='w-1/5 text-right'>
            <span className='text-dark-loss'>L</span>
          </div>
          <div className='w-1/5 text-right'>
            <span className='text-dark-orange'>Avg</span>
          </div>
          {/* </div> */}
        </div>
      </div>
      <ul className='divide-list divide-y divide-dashed'>
        {trimmedCareerHistory.map((historyEntry: any, idx: number) => {
          return (
            <CareerHistoryEntry
              key={idx}
              historyEntry={historyEntry}
            ></CareerHistoryEntry>
          );
        })}
      </ul>
      <div className=' flex justify-end'>
        {/* button show all/hide */}
        <button
          className=' flex items-center text-xs font-normal not-italic leading-5 text-dark-win '
          onClick={() => setShowAll(!showAll)}
          css={[showAll ? tw`text-dark-loss` : tw`text-logo-blue`]}
        >
          {/* icon */}
          <span className=''>
            {showAll ? (
              <HiOutlineChevronUp className='w-4'></HiOutlineChevronUp>
            ) : (
              <HiOutlineChevronDown className='w-4'></HiOutlineChevronDown>
            )}
          </span>
          {showAll ? 'Ẩn bớt' : 'Xem tất cả'}
        </button>
      </div>
    </div>
  );
};
export default ClubHistorySection;
