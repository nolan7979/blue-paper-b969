import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useState } from 'react';
import tw from 'twin.macro';

import { useTeamStore } from '@/stores/team-store';

import CalendarSVG from '/public/svg/calendar.svg';

export function SelectTeamStatsSeason({
  options,
  label = 'name',
  size = 'sm',
}: {
  options: any[];
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  valueGetter?: any;
}) {
  const [selected, setSelected] = useState(options[0]);
  const { teamStatsSeason, setTeamStatsSeason } = useTeamStore();

  useEffect(() => {
    setTeamStatsSeason(selected);
  }, [selected, setTeamStatsSeason]);

  return (
    <div
      className=''
      css={[
        size === 'sm' && tw`w-36`,
        size === 'md' && tw`w-48`,
        size === 'lg' && tw`w-64`,
        size === 'xl' && tw`w-80`,
        size === 'full' && tw`w-full`,
      ]}
    >
      <Listbox value={selected} onChange={setSelected}>
        <div className='relative rounded-lg bg-light-match dark:bg-dark-match'>
          <Listbox.Button className='dev relative h-8 w-full cursor-pointer rounded-lg p-3 py-1 text-left shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 dark:bg-dark-head-tab sm:text-sm'>
            <div className='flex w-full items-center justify-start gap-x-2'>
              <CalendarSVG className='h-[13px] w-[14px] text-light-default dark:text-white' />
              <span className='block truncate text-center text-xs dark:text-white'>
                {teamStatsSeason?.year || teamStatsSeason?.name}
              </span>
            </div>

            <span className='pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center pr-2'>
              <ChevronUpDownIcon
                className='h-4 w-4 dark:text-gray-400'
                aria-hidden='true'
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-dark-head-tab sm:text-sm'>
              {options.map((option: any, idx: number) => (
                <Listbox.Option
                  key={option?.id || idx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active
                        ? ' text-logo-blue'
                        : 'text-gray-900 dark:text-white'
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate text-xs dark:text-white text-dark-text ${
                          selected
                            ? 'font-medium text-logo-blue'
                            : 'font-normal'
                        }`}
                      >
                        {option[label]}
                      </span>
                      {selected ? (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-logo-blue'>
                          <CheckIcon className='h-4 w-4' aria-hidden='true' />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
