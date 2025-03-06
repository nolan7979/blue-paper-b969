/* eslint-disable @next/next/no-img-element */
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useRef, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import tw from 'twin.macro';

// import { useDebounce } from '@uidotdev/usehooks';
import { useFilterStore, useOddsLeagueStore, useTLKMatchStore } from '@/stores';

import { isValEmpty } from '@/utils';

export default function LeagueFilterModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
}) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto scrollbar'>
          <div className='flex min-h-full items-center justify-center p-4 sm:p-0 '>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              {/* <Dialog.Panel className='relative w-11/12 transform space-y-2 overflow-hidden rounded-lg bg-light-match bg-opacity-[0.8] p-3 text-left text-light-black shadow-xl transition-all dark:bg-dark-match dark:text-dark-text sm:my-8 sm:max-w-lg md:space-y-4 md:p-4 lg:w-9/12'> */}
              <Dialog.Panel className='relative w-11/12 transform overflow-hidden rounded-lg bg-light-match text-light-black shadow-xl transition-all dark:bg-dark-match dark:text-dark-text lg:w-2/3'>
                <LeagueOptionContainer
                  setOpen={setOpen}
                ></LeagueOptionContainer>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

const LeagueOptionContainer = ({ setOpen }: { setOpen: any }) => {
  const { matches } = useTLKMatchStore();

  const mapLeagues = new Map();
  Object.values(matches).forEach((match: any) => {
    const tournament = match?.tournament || {};
    const { uniqueTournament, category } = tournament || {};

    if (!mapLeagues.has(uniqueTournament?.id)) {
      mapLeagues.set(uniqueTournament?.id, {
        ...uniqueTournament,
        category,
      });
    }
  });

  const leagues = Array.from(mapLeagues.values());

  return (
    <LeaguesComponent setOpen={setOpen} leagues={leagues}></LeaguesComponent>
  );
};

type FormValues = {
  selectedLeagues: string[];
};

const LeaguesComponent = ({
  setOpen,
  leagues,
}: {
  setOpen: any;
  leagues: any;
}) => {
  const { selectedLeagues, setSelectedLeagues } = useOddsLeagueStore();
  const { setMatchFilter } = useFilterStore();
  const [selectCountry, setSelectCountry] = useState<boolean>(false);
  const [sortAZ, setSortAZ] = useState<boolean>(false);
  // const [reverse, setReverse] = useState<boolean>(false);

  const [chosenLeagues, setChosenLeagues] = useState<any>(() => {
    if (isValEmpty(selectedLeagues)) {
      const initialChosenLeagues: any = {};

      leagues.forEach((league: any) => {
        initialChosenLeagues[`${league?.id}`] = `${league?.id}`;
      });

      setSelectedLeagues(Object.values(initialChosenLeagues));

      return initialChosenLeagues;
    } else {
      const initialChosenLeagues: any = {};

      selectedLeagues.forEach((league: any) => {
        initialChosenLeagues[`${league}`] = `${league}`;
      });

      return initialChosenLeagues;
    }
  });

  const methods = useForm<FormValues>({
    defaultValues: {
      selectedLeagues: Object.values(chosenLeagues) || [],
    },
    shouldUnregister: false,
  });

  const onSubmit = (data: any) => {
    setOpen(false);
    setMatchFilter('league');
    setSelectedLeagues(data.selectedLeagues);
    methods.reset();
  };

  const handleChangeSelectCountry = (e: any) => {
    e.preventDefault();
    setSelectCountry(!selectCountry);
  };

  const handleSetReverse = () => {
    const newSelectedLeagues: any = {};
    leagues.forEach((league: any) => {
      if (!chosenLeagues[`${league?.id}`]) {
        newSelectedLeagues[`${league?.id}`] = `${league?.id}`;
      }
    });
    methods.setValue('selectedLeagues', Object.keys(newSelectedLeagues));
    setChosenLeagues(newSelectedLeagues);
    // setReverse(!reverse);
  };

  const handleSelectAll = (e: any) => {
    e.preventDefault();
    leagues.forEach((league: any) => {
      chosenLeagues[`${league?.id}`] = `${league?.id}`;
    });
    setChosenLeagues({ ...chosenLeagues });
    methods.setValue('selectedLeagues', Object.keys(chosenLeagues));
  };

  const handleSelectLeague = (id: any, checked: boolean) => {
    if (checked) {
      setChosenLeagues({ ...chosenLeagues, [`${id}`]: `${id}` });
    } else {
      const newSelectedLeagues = { ...chosenLeagues };
      delete newSelectedLeagues[`${id}`];
      setChosenLeagues(newSelectedLeagues);
    }

    methods.setValue('selectedLeagues', Object.keys(chosenLeagues));
  };

  let sortedLeagues = leagues;
  if (sortAZ) {
    sortedLeagues = leagues.sort((a: any, b: any) => {
      if (a.name < b.name) {
        return 1;
      }
      return -1;
    });
  }

  return (
    <div className=' divide-list flex h-full flex-col'>
      <div className='flex place-content-center py-3 font-bold'>
        Chọn giải đấu
      </div>
      <div className='flex-1'>
        <FormProvider {...methods}>
          <form action='' onSubmit={methods.handleSubmit(onSubmit)}>
            <div className='flex flex-col'>
              <div className='flex-1 overflow-scroll p-4 text-sm'>
                <TwLeaguesGrid>
                  {(sortedLeagues || []).map((league: any, idx: number) => {
                    const { category } = league;

                    const isChecked = !!chosenLeagues[league?.id.toString()];

                    const isCategoryChanged =
                      selectCountry &&
                      (idx === 0 || category !== leagues[idx - 1].category);

                    if (isCategoryChanged) {
                      // const letter = `${league.name[0]}`.toUpperCase();
                      return (
                        <div key={league?.id || idx} className=''>
                          <div className='dev8'>{category?.name}</div>
                          <LeagueCheckBox
                            label={league?.name}
                            name='selectedLeagues'
                            checked={isChecked}
                            value={league?.id}
                            onChange={handleSelectLeague}
                          ></LeagueCheckBox>
                        </div>
                      );
                    }
                    return (
                      <div key={league?.id || idx} className=''>
                        <LeagueCheckBox
                          label={league?.name}
                          name='selectedLeagues'
                          checked={isChecked}
                          value={league?.id}
                          onChange={handleSelectLeague}
                        ></LeagueCheckBox>
                      </div>
                    );
                  })}
                </TwLeaguesGrid>
              </div>
              <div className='flex place-content-center items-center gap-4 py-3'>
                <div
                  className='item-hover flex cursor-pointer items-center gap-2 rounded-md border border-dark-text/20 p-2 text-sm'
                  onClick={(e) => handleChangeSelectCountry(e)}
                >
                  <input
                    type='checkbox'
                    checked={selectCountry}
                    onChange={(e) => handleChangeSelectCountry(e)}
                    // onClick={(e) => handleChangeSelectCountry(e)}
                    className='hover:cursor-pointer'
                  />
                  Chọn quốc gia
                </div>
                <div
                  className='item-hover flex cursor-pointer items-center gap-2 rounded-md border border-dark-text/20 p-2 text-sm'
                  onClick={(e) => {
                    e.preventDefault();
                    setSortAZ(!sortAZ);
                  }}
                >
                  <input
                    type='checkbox'
                    checked={sortAZ}
                    onChange={(e) => {
                      e.preventDefault();
                      setSortAZ(!sortAZ);
                    }}
                    className='hover:cursor-pointer'
                  />
                  A - Z
                </div>
                <TwLeagueFilterBtn
                  className='item-hover'
                  onClick={(e) => handleSelectAll(e)}
                >
                  Tất cả
                </TwLeagueFilterBtn>
                <TwLeagueFilterBtn
                  className='item-hover'
                  onClick={(e) => {
                    e.preventDefault();
                    handleSetReverse();
                  }}
                >
                  Đảo ngược
                </TwLeagueFilterBtn>

                <TwLeagueFilterBtn className='item-hover' type='submit'>
                  Xác nhận
                </TwLeagueFilterBtn>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

const LeagueCheckBox = ({ label, name, checked, value, onChange }: any) => {
  const { register } = useFormContext();
  const handleChange = (e: any) => {
    if (onChange) {
      onChange(e.target.value, e.target.checked);
    }
  };
  return (
    <div>
      <label className='flex items-center gap-1 hover:cursor-pointer'>
        <input
          type='checkbox'
          checked={checked}
          {...register(name)}
          value={value}
          onChange={(e) => handleChange(e)}
          className='hover:cursor-pointer'
        />

        {label}
      </label>
    </div>
  );
};

export const TwLeaguesGrid = tw.div`grid grid-cols-1 gap-1 md:gap-4 md:grid-cols-2`;
export const TwLeagueFilterBtn = tw.button`rounded-md border border-dark-text/20 p-2 text-sm`;
