/* eslint-disable @next/next/no-img-element */
import { Dialog, Listbox, Transition } from '@headlessui/react';
import React, { Fragment, useRef, ReactNode } from 'react';

export default function CustomModal({
  open,
  setOpen,
  children
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
  children: ReactNode;
}) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-30'
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

        <div className='fixed inset-0 z-30 overflow-y-auto scrollbar'>
          <div className='flex min-h-full items-center justify-center p-4 text-center sm:p-0 '>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative w-full max-w-[37.5rem] transform space-y-2 overflow-hidden rounded-lg bg-light-match p-3 text-left text-light-black shadow-xl transition-all dark:bg-dark-card dark:text-dark-text sm:my-8 md:space-y-4 md:p-4'>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
