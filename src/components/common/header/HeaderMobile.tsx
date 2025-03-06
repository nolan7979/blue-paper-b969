import { useState } from 'react';

import { Logo } from '@/components/common';
import {
  DrawerMenu,
  FootBallMenuMobile,
  HeaderDrawer,
  MenuButtons,
  NavBar,
  NavBarMobile,
} from '@/components/common/header';

import useTrans from '@/hooks/useTrans';
import { useFilterStore } from '@/stores';
import { useRouter } from 'next/router';

export function MbHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const i18n = useTrans();
  const { setMatchFilter } = useFilterStore();

  return (
    <header className='sticky top-0 z-30 bg-gradient-to-r from-[#203397] via-[#122690] to-[#091557] lg:hidden'>
      <div className='flex flex-col items-center justify-items-start'>
        <div className='layout flex w-full items-center justify-between py-2'>
          <div className='flex items-center'>
            <div className='ml-2 hidden md:ml-0 md:inline-block'>
              <HeaderDrawer setIsOpen={setIsOpen} />
            </div>
            <div
              className='ml-2 mr-2 flex items-center justify-center lg:ml-0'
              onClick={() => setMatchFilter('all')}
            >
              <Logo />
            </div>
             <NavBarMobile />
          </div>
          <NavBar path={router.asPath} locale={i18n.language as string} />
          <MenuButtons setIsOpen={setIsOpen} />
        </div>
        <div className='w-full px-2 pb-2 lg:hidden'>
          <FootBallMenuMobile />
        </div>
      </div>

      <DrawerMenu setIsOpen={setIsOpen} isOpen={isOpen} />
    </header>
  );
}
