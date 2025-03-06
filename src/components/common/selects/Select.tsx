import { ImageSquad } from '@/components/modules/football/quickviewColumn/QuickViewSquadTab';
import { Images } from '@/utils';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useState } from 'react';
import CalendarSVG from '/public/svg/calendar.svg';
import tw from 'twin.macro';

export function Select({
  options,
  label = 'name',
  size = 'sm',
  valueGetter,
  shownValue,
  classes,
  classText,
  type,
  isTime,
}: {
  options: any[];
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  valueGetter?: any;
  shownValue?: any;
  classes?: string;
  classText?: any;
  type?: keyof typeof Images;
  isTime?: boolean;
}) {
  const [selected, setSelected] = useState(options?.length ? options[0] : null);

  useEffect(() => {
    if (valueGetter) valueGetter(selected);
  }, [selected, valueGetter]);

  return (
    <div
      className={classes}
      css={[
        size === 'sm' && tw`w-36`,
        size === 'md' && tw`w-48`,
        size === 'lg' && tw`w-64`,
        size === 'xl' && tw`w-80`,
        size === 'full' && tw`w-full`,
      ]}
    >
      <Listbox value={selected} onChange={setSelected}>
        <div className='relative rounded-lg bg-light-match dark:bg-dark-head-tab'>
          <Listbox.Button className='dev relative h-8 w-full cursor-pointer rounded-lg px-3 py-1 text-left shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 dark:bg-dark-head-tab sm:text-sm'>
            <div className='flex items-center gap-x-1'>
              {isTime && (
                <CalendarSVG className='h-[0.813rem] w-[0.875rem] text-light-default dark:text-dark-text' />
              )}

              {type && (
                <ImageSquad
                  type={type}
                  width={20}
                  height={20}
                  url={selected?.id}
                />
              )}
              <span
                className={`block truncate pr-2 text-xs dark:text-white mr-1 ${
                  classText ? classText : 'text-center'
                }`}
              >
                {shownValue ? shownValue : selected && selected[label]}
              </span>
              <span className='pointer-events-none absolute inset-y-0 right-0 z-[1] flex items-center pr-2'>
                <ChevronUpDownIcon
                  className='h-4 w-4 text-gray-400'
                  aria-hidden='true'
                />
              </span>
            </div>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-dark-head-tab sm:text-sm'>
              {options?.map((option: any, idx: number) => (
                <Listbox.Option
                  key={option?.id || idx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none px-4 py-2 ${
                      active
                        ? ' text-logo-blue'
                        : 'text-gray-900 dark:text-white'
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <div className='flex items-center justify-start gap-x-1 pl-2'>
                      {type && (
                        <ImageSquad
                          type={type}
                          width={20}
                          height={20}
                          url={option?.id}
                        />
                      )}
                      <span
                        className={`block truncate text-xs dark:text-white ${
                          selected
                            ? 'font-medium text-logo-blue'
                            : 'font-normal'
                        }`}
                      >
                        {option[label]}
                      </span>
                      {selected ? (
                        <span className='absolute inset-y-0 -left-2 flex items-center pl-3 text-logo-blue'>
                          <CheckIcon
                            className='h-3.5 w-3.5'
                            aria-hidden='true'
                          />
                        </span>
                      ) : null}
                    </div>
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
