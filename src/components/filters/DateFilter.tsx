import { subDays } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import SingleSelectDate from '@/components/common/selects/SingleSelectDate';

import { useFilterStore, useMatchStore } from '@/stores';

import LeftArrowSVG from '/public/svg/left-arrow.svg';
import RightArrowSVG from '/public/svg/right-arrow.svg';

export function DateFilter() {
  // TODO add state + events here
  const { dateFilter, setDateFilter } = useFilterStore();
  const { setLoadMoreMatches } = useMatchStore();

  // get params from router
  const router = useRouter();
  const currentPath = router.asPath;

  useEffect(() => {
    const inputDate = router.query['football-detail'];
    if (inputDate) {
      setDateFilter(new Date(inputDate as string));
    }
  }, [currentPath, router.query, setDateFilter]);

  return (
    <>
      <div className='flex h-full  divide-light-line-stroke-cd rounded-md text-sm dark:bg-dark-brand-box'>
        <button
          className='item-hover flex  place-content-center items-center rounded-l-md bg-white p-2 text-light-default dark:bg-transparent dark:text-dark-text xl:w-1/5'
          onClick={() => {
            setLoadMoreMatches(false);
            setDateFilter(subDays(dateFilter, 1));
          }}
          aria-label='Go back one day'
        >
          <LeftArrowSVG className='m-auto h-3 w-5 xl:h-4'></LeftArrowSVG>
        </button>

        <DateFilterSelect></DateFilterSelect>

        <button
          className='item-hover flex place-content-center items-center rounded-r-md bg-white p-2 text-light-default dark:bg-transparent dark:text-dark-text xl:w-1/5'
          onClick={() => {
            setLoadMoreMatches(false);
            setDateFilter(subDays(dateFilter, -1));
          }}
          aria-label='Go next one day'
        >
          <RightArrowSVG className='h-3 w-5 xl:h-4'></RightArrowSVG>
        </button>
      </div>
    </>
  );
}

export const DateFilterSelect = () => {
  // const { dateFilter, setDateFilter } = useFilterStore();

  // const inputDate = new Date(); // Pass your desired date here
  // const dates = useMemo(() => getDates(new Date()), []);

  return (
    <>
      <SingleSelectDate
      // callback={setDateFilter}
      // options={dates}
      // selectedOption={{
      //   id: '0',
      //   val: dateFilter,
      //   label: format(dateFilter, 'dd/MM - EEE'),
      // }}
      ></SingleSelectDate>
    </>
  );
};

// export interface FormattedDate {
//   val: Date;
//   id: string;
//   label: string;
// }

// function getDates(date: Date): FormattedDate[] {
//   const result: FormattedDate[] = [];

//   // Get the previous 7 dates
//   for (let i = 1; i <= 7; i++) {
//     const prevDate = subDays(date, 7 - i + 1);
//     const formattedDate: FormattedDate = {
//       id: `${i}`,
//       val: prevDate,
//       label: format(prevDate, 'dd/MM - EEE'),
//     };
//     result.push(formattedDate);
//   }

//   // add today
//   const today: FormattedDate = {
//     id: '0',
//     val: new Date(),
//     label: 'HÔM NAY',
//   };
//   result.push(today);

//   // Get the next 7 dates
//   for (let i = 1; i <= 7; i++) {
//     const nextDate = addDays(date, i);
//     const formattedDate: FormattedDate = {
//       id: `${i + 7}`,
//       val: nextDate,
//       label: format(nextDate, 'dd/MM - EEE'),
//     };
//     result.push(formattedDate);
//   }

//   return result;
// }
