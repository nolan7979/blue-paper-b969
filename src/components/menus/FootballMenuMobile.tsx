import React from 'react';
import tw from 'twin.macro';

import MbMenuItem from '@/components/menus/MenuItemMobile';

export function MbFootBallMenu() {
  return (
    <TwFootballMenu>
      {/* TODO Mobile menu: Scrollable + different styles */}
      <TwMobileMenu className='layout'>
        <MbMenuItem
          href='/m/football/ty-so-truc-tuyen'
          name='Tỉ số trực tuyến'
        ></MbMenuItem>
        <MbMenuItem href='/m/football/results/' name='Kết quả'></MbMenuItem>
        <MbMenuItem href='/m/football/b' name='Lịch thi đấu'></MbMenuItem>
        {/* <MbMenuItem href='/football/c' name='Tỉ lệ kèo'></MbMenuItem> */}
      </TwMobileMenu>
    </TwFootballMenu>
  );
}

const TwFootballMenu = tw.div`
  bg-light
  dark:bg-dark-match
  text-light-default
  dark:text-dark-default
  // font-oswald
`;

// const TwDesktopMenu = tw.ul`
//   hidden
//   lg:(flex flex-wrap)  // TODO scrollable

// font-oswald
//   not-italic
//   font-medium
//   text-sm
//   leading-5
//   tracking-wide
//   uppercase
// `;
const TwMobileMenu = tw.ul`
  flex
  flex-wrap
  // lg:hidden
  not-italic
  // font-medium 
  // text-xss
  text-sm
  leading-5
`;
