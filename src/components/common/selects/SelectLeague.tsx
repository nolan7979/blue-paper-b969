/* eslint-disable @next/next/no-img-element */
import Avatar from '@/components/common/Avatar';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useState } from 'react';
import tw from 'twin.macro';

export function SelectLeague({
  options,
  label = 'name',
  size = 'sm',
  valueGetter,
  shownValue,
}: {
  options: any[];
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  valueGetter?: any;
  shownValue?: any;
}) {
  const [selected, setSelected] = useState(options[0]);

  useEffect(() => {
    if (valueGetter) valueGetter(selected);
  }, [selected, valueGetter]);

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
        <div className='relative h-full rounded-lg bg-light-match dark:bg-dark-match'>
          <Listbox.Button className=' relative flex w-full h-full cursor-pointer items-center rounded-lg py-1.5 pr-6 text-left  dark:bg-dark-match sm:text-sm'>
            <span className='flex items-center truncate text-center'>
              {shownValue
                ? shownValue
                : selected && (
                    // <SoccerTeam team={selected} logoSize={18}></SoccerTeam>
                    <div className=' flex items-center gap-2 pl-2'>
                      <div className=''>
                        <Avatar
                          id={selected?.id}
                          type='competition'
                          height={18}
                          width={18}
                          isSmall
                          rounded={false}
                          isBackground={false}
                        />
                      </div>
                      <TwTeamName>
                        <span className='min-w-0 block max-w-36 lg:max-w-full truncate'>
                          {selected?.name}
                        </span>
                      </TwTeamName>
                    </div>
                  )}
            </span>
            <span className='pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center pr-2'>
              <ChevronUpDownIcon
                className='h-4 w-4 text-gray-400'
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
            <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-md  focus:outline-none dark:bg-dark-head-tab sm:text-sm'>
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
                        {/* {option[label]} */}
                        {/* {<SoccerTeam team={option} logoSize={18}></SoccerTeam>} */}
                        <div className=' flex gap-1.5 '>
                          <div className=''>
                          <Avatar
                            id={option?.id}
                            type='competition'
                            height={18}
                            width={18}
                            isSmall
                            rounded={false}
                            isBackground={false}
                          />
                          </div>
                          <TwTeamName>
                            <span>{option?.name}</span>
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
