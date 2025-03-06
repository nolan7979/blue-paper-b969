import AppearanceEntry from '@/modules/football/manager/components/AppearanceEntry';
import { useState } from 'react';
import tw from 'twin.macro';
import { HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';

const AppearanceSection = () => {
  const [showAll, setShowAll] = useState<boolean>(false);
  // TODO use filter instead of show/hide

  return (
    <div className=''>
      <ul>
        <AppearanceEntry
          league='Premier League'
          appearance='12 lần ra sân'
          rating={7.5}
          logoUrl='/images/football/leagues/premier-league.webp'
        ></AppearanceEntry>
        <AppearanceEntry
          league='Uefa Champions League'
          appearance='13 lần ra sân'
          rating={7.4}
          logoUrl='/images/football/leagues/uefa-champions-league.webp'
        ></AppearanceEntry>
        <AppearanceEntry
          league='Europa League'
          appearance='14 lần ra sân'
          rating={8.3}
          logoUrl='/images/football/leagues/uefa-europa-league.webp'
        ></AppearanceEntry>
        <AppearanceEntry
          league='FA Cup'
          appearance='8 lần ra sân'
          rating={7.2}
          logoUrl='/images/football/leagues/uefa-europa-league.webp'
        ></AppearanceEntry>
        <AppearanceEntry
          league='League Cup'
          appearance='9 lần ra sân'
          rating={7.1}
          logoUrl='/images/football/leagues/uefa-europa-league.webp'
        ></AppearanceEntry>
        {showAll && (
          <>
            <AppearanceEntry
              league='League Cup'
              appearance='9 lần ra sân'
              rating={7.1}
              logoUrl='/images/football/leagues/uefa-europa-league.webp'
            ></AppearanceEntry>
            <AppearanceEntry
              league='League Cup'
              appearance='9 lần ra sân'
              rating={7.1}
              logoUrl='/images/football/leagues/uefa-europa-league.webp'
            ></AppearanceEntry>
            <AppearanceEntry
              league='League Cup'
              appearance='9 lần ra sân'
              rating={7.1}
              logoUrl='/images/football/leagues/uefa-europa-league.webp'
            ></AppearanceEntry>
          </>
        )}
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
export default AppearanceSection;
