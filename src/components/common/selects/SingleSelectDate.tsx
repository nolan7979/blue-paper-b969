import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { addDays, format, subDays } from 'date-fns';
import { Fragment, useMemo } from 'react';
import tw from 'twin.macro';

import useTrans from '@/hooks/useTrans';

import { useFilterStore, useMatchStore } from '@/stores';

import CalendarSVG from '/public/svg/calendar.svg';

const SingleSelectDate = () => {
  const { dateFilter, setDateFilter } = useFilterStore();
  const { setLoadMoreMatches } = useMatchStore();
  const i18n = useTrans();
  const dates = useMemo(() => getDates(new Date(), i18n), []);

  let formattedDate = '';
  try {
    formattedDate = format(dateFilter, 'dd/MM - EEE');
  } catch (error) {
    setDateFilter(new Date());
  }

  return (
    <Listbox
      value={{
        id: '7.5',
        val: dateFilter,
        label: format(new Date(), 'dd/MM - EEE'),
      }}
      onChange={(x: FormattedDate) => {
        setDateFilter(x.val);
        // if (callback) callback(x.val);
        setLoadMoreMatches(false);
      }}
    >
      {({ open }) => (
        <>
          <div className='relative flex-1 bg-white dark:bg-transparent'>
            <Listbox.Button className='focus:ring-none relative h-full w-full cursor-pointer rounded-md  px-2 text-center text-csm'>
              <div className='item-hover flex h-full w-full flex-1 items-center justify-evenly gap-2 px-2.5'>
                <div className='h-full w-6'>
                  <CalendarSVG className=' h-full w-full text-light-default dark:text-white'></CalendarSVG>
                </div>
                <div className='flex-1 place-content-center items-center'>
                  <span className='my-auto truncate text-csm text-light-default dark:text-white'>
                    {formattedDate}
                  </span>
                </div>
              </div>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options className='absolute z-10 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-csm shadow-xl focus:outline-none dark:bg-dark-head-tab'>
                {dates.map(
                  (option: { id: string; val: Date; label: string }) => (
                    <Listbox.Option
                      key={option?.id}
                      // css={[dateFilter === option.val && tw`text-logo-blue`]}
                      css={[
                        format(dateFilter, 'yyyy-MM-dd') ===
                          format(option.val, 'yyyy-MM-dd') &&
                          tw`text-logo-blue`,
                      ]}
                      className='item-hover relative cursor-pointer select-none py-1.5 pl-3 pr-3'
                      value={option}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className='flex items-center'>
                            <span
                              className='ml-3 block cursor-pointer truncate'
                              css={[
                                option.label.startsWith('-') && tw`font-bold`,
                              ]}
                            >
                              {option.label}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className='absolute inset-y-0 right-0 flex items-center pr-4 text-logo-blue'
                              css={[
                                dateFilter === option.val && tw`text-logo-blue`,
                              ]}
                            >
                              <CheckIcon
                                className='h-5 w-5'
                                aria-hidden='true'
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  )
                )}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default SingleSelectDate;

export interface FormattedDate {
  val: Date;
  id: string;
  label: string;
}

function getDates(date: Date, i18n: any): FormattedDate[] {
  const result: FormattedDate[] = [];

  // Get the previous 7 dates
  for (let i = 1; i <= 7; i++) {
    const prevDate = subDays(date, 7 - i + 1);
    const formattedDate: FormattedDate = {
      id: `${i}`,
      val: prevDate,
      label: format(prevDate, 'dd/MM - EEE'),
    };
    result.push(formattedDate);
  }

  // add today
  const today: FormattedDate = {
    id: '0',
    val: new Date(),
    label: `-- ${i18n.time.today} --`,
  };
  result.push(today);

  // Get the next 7 dates
  for (let i = 1; i <= 7; i++) {
    const nextDate = addDays(date, i);
    const formattedDate: FormattedDate = {
      id: `${i + 7}`,
      val: nextDate,
      label: format(nextDate, 'dd/MM - EEE'),
    };
    result.push(formattedDate);
  }

  return result;
}
