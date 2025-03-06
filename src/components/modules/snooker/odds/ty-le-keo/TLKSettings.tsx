import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import SettingsSVG from '/public/svg/settings.svg';

export default function TLKSettingsMenu() {
  // const i18n = useTrans();

  return (
    <Menu as='div' className='relative inline-block text-left'>
      <div>
        <Menu.Button className='my-1 inline-flex rounded-full' style={{backgroundColor: "rgb(11, 86, 162)"}}>
          <div className='hover:brightness-125'>
            <SettingsSVG className='h-6 w-6'></SettingsSVG>
          </div>
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
        <Menu.Items className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white text-sm text-light-default shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-dark-head-tab dark:text-dark-text'>
          <div className='divide-list py-1'>
            {/* <Menu.Item>
              {({ active }) => (
                <div className='item-hover flex px-4 py-3 text-sm'>
                  <div>A</div>
                  <div>B</div>
                  <div>C</div>
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div className='item-hover flex px-4 py-3 text-sm'>
                  <div>A</div>
                  <div>B</div>
                  <div>C</div>
                </div>
              )}
            </Menu.Item> */}
            <TLKSettingItems></TLKSettingItems>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export const TLKSettingItems = () => {
  return (
    <>
      <div>Odds:</div>
      <div className='flex gap-2'>{/* input type = checkbox */}</div>
      <div>All | Favorite</div>
      <div>Goals prompt</div>
      <div>RedCard prompt</div>
      <div>Home goal prompt</div>
      <div>Away goal prompt</div>
      <div>Yellow card</div>
      <Menu.Item>
        {({ active }) => (
          <div className='item-hover flex items-center gap-2 px-4 py-1.5 text-sm'>
            <span>Odds:</span>
            <div className='flex items-center gap-1'>
              <input type='checkbox' name='hdp' value='hdp' />
              <span>HDP</span>
            </div>
            <input type='checkbox' name='1x2' value='std1x2' />
            <input type='checkbox' name='tx' value='tx' />
          </div>
        )}
      </Menu.Item>
      <Menu.Item>
        {({ active }) => (
          <div className='item-hover flex px-4 py-1.5 text-sm'>
            <div>A</div>
            <div>B</div>
            <div>C</div>
          </div>
        )}
      </Menu.Item>
    </>
  );
};
