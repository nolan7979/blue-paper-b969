import Rectangle from '@/components/common/skeleton/Rectangle';
import { useArabicLayout, useSportName } from '@/hooks';
import useTrans from '@/hooks/useTrans';
import { useFilterStore } from '@/stores';
import clsx from 'clsx';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subMonths,
  subYears
} from 'date-fns';
import { useRouter } from 'next/router';
import { memo, useEffect, useRef, useState } from 'react';
import LeftArrowSVG from '/public/svg/left-arrow.svg';
import RightArrowSVG from '/public/svg/right-arrow.svg';

const languageStartDayMapping: { [key: string]: number } = {
  vi: 1,
  en: 0,
  'en-GB': 1,
  de: 1,
  pt: 1,
  it: 1,
  'pt-BR': 0,
  es: 1,
  fr: 1,
  id: 1,
  hi: 0,
  tr: 1,
  ms: 1,
  bn: 0,
  hr: 1,
  nl: 1,
  pl: 1,
  el: 1,
  'ar-XA': 0,
  ko: 0,
  th: 0,
  'zh-CN': 0,
  ja: 0,
  'en-PH': 0,
  'en-SG': 0,
  'en-IN': 0,
  ru: 1,
  uk: 1,
};

export const CalendarFilter = memo(function CalendarFilter() {

  // const country = useMemo(() => getItem(LOCAL_STORAGE.countryDetect), []);
  // const { data: dataDetected } = useDetectedCountry(true);
  const { locale } = useRouter();
  const i18n = useTrans();
  const sport = useSportName();
  const sportRef = useRef<string | null>(sport);
  const isArabicLayout = useArabicLayout();
  const today = new Date();
  // TODO add state + events here
  const { dateFilter, setDateFilter } = useFilterStore();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedMonth, setSelectedMonth] = useState<Date>(today);
  const [selectedYear, setSelectedYear] = useState<Date>(today);
  const dateRef = useRef<Date | null>(dateFilter);
  // get params from router
  const router = useRouter();
  const currentPath = router.asPath;
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const inputDate = router.query['football-detail'];
    if (inputDate) {
      setDateFilter(new Date(inputDate as string));
    }
  }, [currentPath, router.query, setDateFilter]);

  const [days, setDays] = useState<(Date | null)[]>([]);

  useEffect(() => {
    if (
      !isSameDay(dateFilter, today) && !isSameMonth(dateFilter, today) &&
      sport !== sportRef.current &&
      !sportRef.current
    ) {
      setDateFilter(today);
      setSelectedMonth(subMonths(today, 1));
      setSelectedYear(subYears(today, 1));
      sportRef.current = sport;
    }
    if (!isSameDay(dateFilter, selectedDate)) {
      setSelectedDate(dateFilter);
      dateRef.current = dateFilter;
    }
  }, [sport]);

  useEffect(() => {
    const start = startOfMonth(dateFilter || new Date());
    const end = endOfMonth(dateFilter || new Date());
    const daysInMonth = eachDayOfInterval({ start, end });
    
    const startDayOfWeek = languageStartDayMapping[i18n.language] ?? 0; // Mặc định là Chủ Nhật
    const startDay = (getDay(start) - startDayOfWeek + 7) % 7; // Điều chỉnh theo ngày bắt đầu tuần
    const emptyDays = Array(startDay).fill(null);

    const daysArray = emptyDays.concat(daysInMonth);
    setDays(daysArray);
  }, [dateFilter, i18n.language]);

  useEffect(() => {
    const date = new Date();
    //compare dateFilter with today
    if (!dateFilter || dateFilter.getTime() !== date.getTime()) {
      // setDateFilter(date);
    }
  }, [router.asPath]);

  useEffect(() => {
    setFormattedDate(
      `${dateFilter.toLocaleString(locale ?? 'en', {
        month: 'short',
      })} ${dateFilter.getFullYear()}`
    );
  }, [dateFilter, locale]);

  const dayLabels: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const adjustedDayLabels = dayLabels.slice(languageStartDayMapping[i18n.language] ?? 0)
  .concat(dayLabels.slice(0, languageStartDayMapping[i18n.language] ?? 0));


  const handleClickDay = async (day: Date) => {
    if (
      day != null &&
      (day !== selectedDate || day !== dateFilter || dateRef.current !== day)
    ) {
      setSelectedDate(day);
      setSelectedMonth(day);
      setSelectedYear(day);
      setDateFilter(day);
    }
  };

  return (
    <div
      className='flex h-full min-h-[204px] flex-col rounded-md bg-white p-2 font-primary text-sm text-black dark:bg-dark-gray dark:text-white'
      id='id-calendar'
    >
      <div className='flex flex-row items-center justify-between'>
        <span id='id-DateMonth' className='ml-2 text-ccsm font-semibold'>
          {formattedDate}
          {!formattedDate && <Rectangle classes='h-4 w-16' />}
        </span>

        <div className='flex w-1/2 flex-row justify-end text-white'>
          <button
            id='btnPrevious'
            className={clsx(
              'item-hover ml-3 flex place-content-center items-center bg-transparent p-2 xl:w-1/5 ',
              {
                'rounded-l-md': !isArabicLayout,
                'rounded-r-md': isArabicLayout,
              }
            )}
            onClick={(e) => {
              e.preventDefault();
              setSelectedDate(subMonths(dateFilter, 1));
              setDateFilter(subMonths(dateFilter, 1));
            }}
            aria-label='Go back one day'
          >
            {isArabicLayout ? (
              <RightArrowSVG className='h-2.5 w-1.5 text-dark-card dark:text-white' />
            ) : (
              <LeftArrowSVG className='h-2.5 w-1.5 text-dark-card dark:text-white' />
            )}
          </button>

          <button
            id='btnNext'
            className={clsx(
              'item-hover ms-3 flex place-content-center items-center bg-transparent p-2 xl:w-1/5',
              {
                'rounded-l-md': isArabicLayout,
                'rounded-r-md': !isArabicLayout,
              }
            )}
            onClick={(e) => {
              e.preventDefault();
              setSelectedDate(subMonths(dateFilter, -1));
              setDateFilter(subMonths(dateFilter, -1));
            }}
            aria-label='Go next one day'
          >
            {isArabicLayout ? (
              <LeftArrowSVG className='h-2.5 w-1.5 text-dark-card dark:text-white' />
            ) : (
              <RightArrowSVG className='h-2.5 w-1.5 text-dark-card dark:text-white' />
            )}
          </button>
        </div>
      </div>
      <div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            paddingLeft: '4px',
            marginBottom: '6px',
          }}
        >
          {adjustedDayLabels.map((day, index) => (
            <div
              key={index}
              className='text-center text-[0.563rem] font-semibold text-[#8D8E92]'
            >
              {i18n.calendar[day.toLocaleLowerCase() as keyof typeof i18n.calendar]}
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
          }}
        >
          {!days.length &&
            Array(33)
              .fill(null)
              .map((_, index) => (
                <Rectangle key={index} classes={'h-6 w-6 !rounded-full'} />
              ))}
          {days.map((day, index) => (
            <button
              id='btnDate'
              key={index}
              className={clsx(
                'flex h-6 w-6 cursor-default items-center justify-center rounded-full p-1 text-ccsm font-semibold',
                {
                  'bg-[#012C82] text-white':
                    Number(selectedDate.getDate()) ===
                    Number(day ? format(day, 'd') : ''),
                  'bg-[#2155be3a] text-white':
                    Number(today.getDate()) ===
                      Number(day ? format(day, 'd') : '') &&
                    Number(selectedDate.getDate()) !==
                      Number(day ? format(day, 'd') : '') &&
                    Number(today.getMonth()) ===
                      Number(selectedDate.getMonth()),
                  'cursor-pointer': day != null && day.getMonth() === selectedMonth.getMonth() && day.getFullYear() === selectedYear.getFullYear(),
                }
              )}
              aria-label={day ? '' : `carlender_${index}`}
              onClick={() => day && handleClickDay(day)}
            >
              {day ? format(day, 'd') : ''}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
