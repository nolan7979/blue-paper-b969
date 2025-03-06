import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import { IRoundItemV2, useLeagueMatchFilterStore } from '@/stores';

import { isValEmpty } from '@/utils';
import { cn } from '@/utils/tailwindUtils';

const genRoundLabel = (option: any, title?: string) => {
  const { round, name = '', prefix = '' } = option || {};

  let label = `${title ? title : 'Round'} ${round} - ${name}${prefix}`;

  if (!name && !prefix) {
    label = `${title ? title : 'Round'} ${round}`;
  } else if (name && !prefix) {
    label = `${name}`;
  } else if (name && prefix) {
    label = `${prefix} - ${name}`;
  }

  return label;
};

interface SelectRoundProps {
  options: IRoundItemV2[];
  label?: string;
  valueGetter?: (value: IRoundItemV2) => void;
  currentRound?: IRoundItemV2;
  className?: string;
}

export function SelectRound({
  options,
  valueGetter,
  currentRound,
  className
}: SelectRoundProps) {
  const i18n = useTrans();
  const {
    selectedRound,
    selectedRoundSlug,
    selectedRoundPrefix,
    setSelectedRound,
  } = useLeagueMatchFilterStore();

  const [selected, setSelected] = useState<IRoundItemV2>(() => {
    if (!isValEmpty(currentRound)) {
      return currentRound as IRoundItemV2;
    }
    return (options[0] || {}) as IRoundItemV2;
  });

 
 

  // useEffect(() => {
  //   if (selectedRound.name !== selected.name) {
  //     setSelectedRound(selected);
  //   }
  // }, [selected]);

  useEffect(() => {
    // const round = options.find(
    //   (o) =>
    //     o.name === selectedRound.name && o.stage_id === selectedRound.stage_id
    // );
    // if (round) {
    //   setSelected(round);
    // }
  }, [selectedRound, selectedRoundSlug, selectedRoundPrefix, options]);

  return (
    <div className="h-full w-full">
      <Listbox value={selected} onChange={(value) => {
        setSelected(value)
        setSelectedRound(value)
      }}>
        <div className={cn('relative rounded-lg bg-light-match dark:bg-dark-match h-full', className)}>
          <Listbox.Button className='dev relative  w-full cursor-pointer space-x-1 rounded-lg pr-3 text-left shadow-sm h-[32px] focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 dark:bg-dark-head-tab text-sm'>
            <span className='block truncate text-center max-w-[130px] px-2'>{selected?.name}</span>
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
            <Listbox.Options className='absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-dark-head-tab dark:shadow-sm-light text-sm'>
              {options.map((option: IRoundItemV2, idx: number) => (
                <Listbox.Option
                  key={`${option?.stage_id}-${idx}` || idx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 px-2.5 w-full text-center ${
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
                        {genRoundLabel(option)}
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
