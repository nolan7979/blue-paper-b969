import clsx from 'clsx';
import React, { useEffect, useMemo } from 'react';
import { addDays, format, startOfToday, subDays } from 'date-fns';
import { useRouter } from 'next/router';
import { useFilterStore, useMatchStore } from '@/stores';
import { useArabicLayout } from '@/hooks';
import DropdownCalendar from '@/components/filters/DropdownCalendarFilter';
import { isSameDay } from 'date-fns';
import useTrans from '@/hooks/useTrans';

const WeekView: React.FC = () => {
  const { locale } = useRouter();
  const i18n = useTrans();
  const isArabicLayout = useArabicLayout();
  const { dateFilter, setDateFilter } = useFilterStore();
  const { setLoadMoreMatches } = useMatchStore();
  const today = startOfToday();
  const router = useRouter();
  const currentPath = router.asPath;

  useEffect(() => {
    const inputDate = router.query['football-detail'];
    if (inputDate) {
      setDateFilter(new Date(inputDate as string));
    }
  }, [currentPath, router.query, setDateFilter]);

  const getWeekDays = (today: Date) => {
    const days = [];
    for (let i = -3; i <= 3; i++) {
      days.push(addDays(today, i));
    }
    return days;
  };

  const days = useMemo(() => getWeekDays(dateFilter), [dateFilter]);

  const dayLabels: string[] =['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const getDayLabels = (day: Date) => {
    const dateLocal =  dayLabels[day.getDay()].toLocaleLowerCase()
    return i18n.calendar[dateLocal as keyof typeof i18n.calendar]
  }

  const setDay = (day: Date) => {
    setLoadMoreMatches(false);
    setDateFilter(day);
    // setDateFilter(subDays(dateFilter, dateFilter.getDate() - day.getDate()));
  };

  return (
    <div className='flex w-full items-center  text-msm font-normal xs:justify-between xs:gap-2.5 md:justify-center'>
      <div className='flex w-full justify-between px-2 py-2.5 '>
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => setDay(day)}
            className={`flex flex-col items-center justify-items-center text-center hover:brightness-125 ${
              day.getDate() === dateFilter.getDate()
                ? 'text-[#2187E5]'
                : 'text-black dark:text-white'
            }`}
          >
            <p>{isSameDay(day, today) ? i18n.time.today : getDayLabels(day)}</p>
            <p> {format(day, 'dd/MM')}</p>
          </button>
        ))}
      </div>
      <div
        className={clsx('h-full w-2/12 py-2.5 dark:border-primary-mask', {
          'border-r': isArabicLayout,
          'border-l': !isArabicLayout,
        })}
      >
        <div className='flex h-full w-full items-center justify-center'>
          <DropdownCalendar isArabicLayout={isArabicLayout} />
        </div>
      </div>
    </div>
  );
};

export default WeekView;
