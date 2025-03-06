import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useState } from 'react';
import { HiXMark } from 'react-icons/hi2';

import { useAllBookmakersData } from '@/hooks/useFootball/useOddsData';

import { useOddsEu1x2FilterStore } from '@/stores';

export default function Eu1x2BookFilter() {
  const { data: bookMakerData, isFetching } = useAllBookmakersData();
  const { setSelectedBookMakers, setBookMakerType, bookMakerType } =
    useOddsEu1x2FilterStore();
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setSelectedBookMakers(
      selectedPeople.reduce((acc: any, cur: any) => {
        acc[cur?.id] = cur;
        return acc;
      }, {})
    );
  }, [selectedPeople, setSelectedBookMakers]);

  useEffect(() => {
    setSelectedPeople([]);
  }, [bookMakerType, setBookMakerType, setSelectedPeople]);

  if (isFetching) return <></>;

  const filteredBooks =
    query === ''
      ? bookMakerData.bookmakers || []
      : bookMakerData.bookmakers?.filter((book: any) =>
          book.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <div className='w-56'>
      <Combobox
        value={selectedPeople}
        onChange={setSelectedPeople as unknown as (value: any[]) => void}
        multiple
      >
        <div className='relative'>
          <div className='flex w-full cursor-pointer items-center overflow-hidden rounded-xl border border-gray-light bg-light-match text-left focus:outline-none focus-visible:ring-0 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 dark:bg-dark-match'>
            <div className='flex w-full items-center'>
              <Combobox.Input
                className='item-hover w-full border-none bg-light-match text-xs leading-tight text-gray-900 outline-none focus:outline-none focus:ring-0 dark:bg-dark-match dark:text-dark-text'
                placeholder={`Chọn nhà cái (${
                  selectedPeople.length ? selectedPeople.length : 'tất cả'
                })`}
                // placeholder='Chọn nhà cái'
                onChange={(event) => setQuery(event.target.value)}
                css={{
                  padding: 6,
                  paddingLeft: 16,
                  fontSize: '0.85rem',
                }}
              />
              <Combobox.Button
                className='flex w-8 place-content-center items-center bg-light-match text-dark-text dark:bg-dark-match'
                onClick={() => setSelectedPeople([])}
              >
                <HiXMark></HiXMark>
              </Combobox.Button>
              <Combobox.Button className='flex w-8 place-content-center items-center '>
                <ChevronUpDownIcon
                  className='h-4 w-4 text-dark-text'
                  aria-hidden='true'
                />
              </Combobox.Button>
            </div>
          </div>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-dark-main sm:text-sm'>
              {filteredBooks.length === 0 && query !== '' ? (
                <div className='relative cursor-pointer select-none px-4 py-2 text-gray-700'>
                  Nothing found.
                </div>
              ) : (
                filteredBooks.map((option: any) => (
                  <Combobox.Option
                    key={option?.id}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active
                          ? 'bg-logo-blue text-white'
                          : 'dark:text-dark-default'
                      }`
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {option.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-logo-blue'
                            }`}
                          >
                            <CheckIcon className='h-5 w-5' aria-hidden='true' />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
