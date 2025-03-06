import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { Fragment, useState } from 'react';
import tw from 'twin.macro';

import ArrowDownSVG from '/public/svg/odd-down.svg';
import { IOddsCompany } from '@/models/football/common';
import { useOddsStore } from '@/stores';
import { setItem } from '@/utils/localStorageUtils';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const SingleSelectBookMaker = ({
  options,
  callback,
  shownValue,
  setWidth = false,
}: {
  options: IOddsCompany[];
  callback?: (x: any) => void;
  shownValue?: any;
  setWidth?: boolean;
}) => {
  const { selectedBookMaker } = useOddsStore();

  const [selectedOption, setSelected] =
    useState<IOddsCompany>(selectedBookMaker);

  return (
    <Listbox
      value={selectedOption}
      onChange={(x) => {
        setSelected(x);
        setItem('bookMaker', JSON.stringify(x));
        if (callback) {
          callback(x);
        }
      }}
    >
      {({ open }) => (
        <div className=''>
          <div className='relative w-full'>
            <Listbox.Button className='focus:ring-none relative  w-full cursor-pointer rounded-md text-center text-csm'>
              <span className='flex items-center gap-2 px-2 text-logo-blue'>
                <span className='block truncate'>
                  {shownValue?.name || selectedOption?.name}
                </span>
                <ArrowDownSVG className='inline'></ArrowDownSVG>
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options
                css={[setWidth && tw`w-32`]}
                className='no-scrollbar absolute right-3 z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-csm shadow-lg focus:outline-none dark:bg-dark-sub-bg-main'
              >
                {options.map((option: IOddsCompany) => (
                  <Listbox.Option
                    key={option?.id}
                    className='item-hover relative cursor-pointer select-none py-1.5 pl-3 pr-3'
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className='flex items-center'>
                          <span
                            className={classNames(
                              // selected ? 'text-logo-blue' : '',
                              'ml-3 block truncate'
                            )}
                            css={[
                              selectedOption.id === option.id &&
                                tw`text-logo-blue`,
                            ]}
                          >
                            {option.name}
                          </span>
                        </div>

                        {selectedOption.id === option.id ? (
                          <span
                            className={classNames(
                              active ? 'text-logo-blue' : '',
                              'absolute inset-y-0 right-0 hidden items-center pr-4 text-logo-blue xl:flex'
                            )}
                          >
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
        </div>
      )}
    </Listbox>
  );
};

export default SingleSelectBookMaker;
