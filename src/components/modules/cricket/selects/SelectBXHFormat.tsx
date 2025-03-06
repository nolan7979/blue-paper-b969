import clsx from 'clsx';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import tw from 'twin.macro';

import useTrans from '@/hooks/useTrans';

import { useFilterStore } from '@/stores';
import SortSVG from '/public/svg/sort_1.svg';
import { useArabicLayout } from '@/hooks';

export const SelectBXHFormat = () => {
  const i18n = useTrans();
  const isArabicLayout = useArabicLayout();
  const { bxhFormat, setBxhFormat } = useFilterStore();

  return (
    <Menu
      as='div'
      className='relative inline-block rounded-full hover:z-[2] dark:hover:brightness-150'
    >
      <div>
        <Menu.Button className='flex h-[2.188rem] w-[2.188rem] cursor-pointer flex-col items-center justify-center !rounded-full bg-white dark:bg-dark-head-tab'>
          {/* <HiMenu className='h-4 w-4'></HiMenu> */}
          <SortSVG className='h-4 w-4 text-black dark:text-white' />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items
          className={clsx(
            'absolute z-[2] mt-2 w-32 origin-top-right rounded-md bg-white text-sm text-light-default shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-dark-head-tab dark:text-dark-text',
            {
              'left-0': isArabicLayout,
              'right-0': !isArabicLayout,
            }
          )}
        >
          <div className='py-1'>
            <Menu.Item>
              <button
                aria-label=''
                onClick={() => setBxhFormat('full')}
                className=' item-hover block w-full px-4 py-2 text-sm'
                css={[bxhFormat === 'full' && tw`text-logo-blue`]}
              >
                {i18n.filter.full}
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                aria-label=''
                onClick={() => setBxhFormat('short')}
                className='item-hover block w-full px-4 py-2 text-sm'
                css={[bxhFormat === 'short' && tw`text-logo-blue`]}
              >
                {i18n.filter.short}
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                aria-label=''
                onClick={() => setBxhFormat('form')}
                className='item-hover block w-full px-4 py-2 text-sm'
                css={[bxhFormat === 'form' && tw`text-logo-blue`]}
              >
                {i18n.filter.form}
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
