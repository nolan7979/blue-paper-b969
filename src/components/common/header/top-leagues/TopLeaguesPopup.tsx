import { Popover, Transition } from '@headlessui/react';
// import { TrophyIcon } from '@heroicons/react/20/solid';
import { forwardRef, Fragment } from 'react';

const TopLeaguesFilterColumn = dynamic(
  () => import('@/components/common/header/top-leagues/TopLeaguesFilterColumn').then(mod => mod.TopLeaguesFilterColumn),
  { ssr: false }
);

import dynamic from 'next/dynamic';
import IconTopHot from '~/svg/menu-mobile-tophot.svg';
import TrophyIcon from '/public/svg/trophy.svg';

export const TopLeaguesPopup = forwardRef<
  HTMLButtonElement,
  { isTournaments?: boolean; sport: string }
>(({ isTournaments = false, sport }, ref) => {
  return (
    <div className=''>
      <Popover className=''>
        {({ open }) => (
          <>
            <div className='flex cursor-pointer items-center rounded-full text-base font-medium text-dark-default focus:ring-0'>
              <Popover.Button
                className=' inline-flex items-center rounded-full p-2 py-1.5 lg:p-2.5'
                aria-label='Open Leagues Filter'
                ref={ref}
              >
                {isTournaments ? (
                  <IconTopHot className=' h-5 w-5' />
                ) : (
                  <TrophyIcon className=' h-5 w-5' />
                )}
              </Popover.Button>
            </div>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-200'
              enterFrom='opacity-0 translate-y-1'
              enterTo='opacity-100 translate-y-0'
              leave='transition ease-in duration-150'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 translate-y-1'
            >
              <Popover.Panel className='fixed left-1/2 top-[3rem] z-10 mt-2 max-h-[89vh] w-screen -translate-x-1/2 transform overflow-x-hidden overflow-y-scroll scrollbar'>
                {open &&<TopLeaguesFilterColumn sport={sport}></TopLeaguesFilterColumn>}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
});
