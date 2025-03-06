import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import IconCalendar from '~/svg/menu-mobile-calendar.svg';
import { CalendarFilter } from '@/components/filters/CalendarFilter';

type DropdownCalendarProps = {
  isArabicLayout?: boolean;
};

const DropdownCalendar: React.FC<DropdownCalendarProps> = ({
  isArabicLayout = false,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useClickOutside(calendarRef, () => setShowCalendar(false));

  const toggleCalendar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowCalendar(!showCalendar);
  };

  return (
    <div className='relative' ref={calendarRef}>
      <button
        type="button"
        className="flex items-center justify-center p-1 rounded-full transition-colors"
        onClick={toggleCalendar}
        aria-label="Toggle calendar"
      >
        <IconCalendar className='h-5 w-5 text-black dark:text-white' />
      </button>

      {showCalendar && (
        <div
          className={clsx(
            'absolute top-6 z-50 bg-white dark:bg-gray-900 rounded-lg shadow-lg',
            {
              'left-0': isArabicLayout,
              'right-0': !isArabicLayout,
            }
          )}
        >
          <CalendarFilter />
        </div>
      )}
    </div>
  );
};

export default DropdownCalendar;

export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]);
};
