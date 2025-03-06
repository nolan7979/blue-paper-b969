/* eslint-disable @next/next/no-img-element */
import Avatar from '@/components/common/Avatar';
import RenderIf from '@/components/common/RenderIf';
import { TwTeamName } from '@/components/modules/football/tw-components/TwFBHome';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { Fragment, useEffect, useState } from 'react';
import tw from 'twin.macro';

export type Option = {
  id: string | number;
  name: string;
};

export function SelectTeam({
  options,
  label = 'name',
  size = 'sm',
  valueGetter,
  shownValue,
  isDisplayLogo = true,
  className = '',
}: {
  options: Option[];
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  valueGetter?: any;
  shownValue?: any;
  isDisplayLogo?: boolean;
  className?: string;
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
      className={clsx(className)}
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
          <Listbox.Button className=' relative flex w-full cursor-pointer items-center rounded-lg py-1 pr-3 text-left  dark:bg-dark-match sm:text-sm'>
            <span className='flex items-center truncate text-center'>
              {shownValue
                ? shownValue
                : selected && (
                    // <SoccerTeam team={selected} logoSize={18}></SoccerTeam>
                    <div className=' flex items-center gap-2 pl-4'>
                      <RenderIf isTrue={isDisplayLogo && selected?.id !== ''}>
                        <div className=''>
                          <Avatar
                            id={String(selected?.id)}
                            type='team'
                            height={18}
                            width={18}
                            isSmall
                          />
                          {/* <img
                          src={
                            selected?.id
                              ? `${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/team/${selected?.id}/image`
                              : '/images/football/teams/unknown-team.png'
                          }
                          alt='...'
                          width={18}
                          height={18}
                        ></img> */}
                        </div>
                      </RenderIf>

                      <TwTeamName>
                        <span className='min-w-0 truncate'>
                          {selected?.name || 'Unknown'}
                        </span>
                      </TwTeamName>
                    </div>
                  )}
            </span>
            <span className='pointer-events-none absolute inset-y-0 right-0 z-[9] flex items-center pr-2'>
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
                          <RenderIf isTrue={isDisplayLogo && option?.id !== ''}>
                            <div className=''>
                              <Avatar
                                id={option?.id}
                                type='team'
                                height={18}
                                width={18}
                                isSmall
                              />
                            </div>
                          </RenderIf>
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
