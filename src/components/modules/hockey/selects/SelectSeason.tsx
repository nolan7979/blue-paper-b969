import tw from 'twin.macro';
import { Fragment, useEffect, useState } from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { Listbox, Transition } from '@headlessui/react';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';
import ArrowSVG from 'public/svg/arrow-down-line.svg';
import { Option } from '@/components/modules/basketball/selects';
import React from 'react';

export function SelectSeason({
  options,
  label = 'name',
  size = 'sm',
  valueGetter,
  shownValue,
}: {
  options: Option[];
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  valueGetter?: any;
  shownValue?: any;
}) {
  const [selected, setSelected] = useState(options[0]);
  
  useEffect(() => {
    if (valueGetter) {
      valueGetter(selected);
    }
  }, [selected, valueGetter]);

  useEffect(() => {
    if (!!options.length && !selected) {
      setSelected(options[0]);
    }
  }, [options]);

  return (
    <div
      className=''
      css={[
        size === 'sm' && tw`w-32`,
        size === 'md' && tw`w-48`,
        size === 'lg' && tw`w-64`,
        size === 'xl' && tw`w-80`,
        size === 'full' && tw`w-full`,
      ]}
    >
      <Listbox value={selected} onChange={setSelected}>
        <div className='relative rounded-lg'>
          <Listbox.Button className='relative flex w-fit cursor-pointer items-center rounded-lg bg-transparent py-1 pr-3 text-left sm:text-sm'>
            <span className='flex items-center truncate text-center'>
              {shownValue
                ? shownValue
                : selected && (
                    <div className='flex items-center gap-2 pl-2'>
                      <TwTeamName>
                        <span className='min-w-0 truncate'>
                          {selected?.name || 'Unknown'}
                        </span>
                      </TwTeamName>
                      <ArrowSVG
                        className='h-4 w-4 text-gray-400'
                        aria-hidden='true'
                      />
                    </div>
                  )}
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className='absolute z-[9] mt-1 max-h-60 w-full overflow-auto  rounded-md bg-white py-1 text-base shadow-md  focus:outline-none dark:bg-dark-match sm:text-sm'>
              {options.map((option: any, idx: number) => (
                <Listbox.Option
                  key={option?.id || idx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-6 pr-4 ${
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
                        className={`block truncate ${
                          selected
                            ? 'font-medium text-logo-blue'
                            : 'font-normal'
                        }`}
                      >
                        <div className=' flex gap-1.5 '>
                          <TwTeamName>
                            <span>{option?.name || 'Unknown'}</span>
                          </TwTeamName>
                        </div>
                      </span>
                      {selected ? (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-1 text-logo-blue'>
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
