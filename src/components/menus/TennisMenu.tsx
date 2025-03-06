import React from 'react';

import useTrans from '@/hooks/useTrans';

import {
  TwDesktopMenu,
  TwFootballMenu,
  TwMobileMenu,
} from '@/components/menus/MainLeftMenu';
import MenuItem from '@/components/menus/MenuItem';
import MbMenuItem from '@/components/menus/MenuItemMobile';

import { useFilterStore } from '@/stores';

export function TennisMenu() {
  const i18n = useTrans();
  const { resetMatchFilter } = useFilterStore();

  return (
    <TwFootballMenu>
      <TwDesktopMenu className='layout'>
        <MenuItem
          href='/tennis/ty-so-truc-tuyen/'
          name={i18n.menu.live_score}
          onClick={() => resetMatchFilter()}
        ></MenuItem>
        <MenuItem
          href='/tennis/results/'
          name={i18n.menu.results}
          onClick={() => resetMatchFilter()}
        ></MenuItem>
        <MenuItem
          href='/tennis/fixtures/'
          name={i18n.menu.schedule}
          onClick={() => resetMatchFilter()}
        ></MenuItem>
        <MenuItem
          href='/tennis/odds/'
          name={i18n.menu.odds}
          onClick={() => resetMatchFilter()}
        ></MenuItem>
        <MenuItem
          href='/tennis/ty-le-chau-au/'
          name={i18n.menu.europe_odds}
          onClick={() => resetMatchFilter()}
        ></MenuItem>
        <MenuItem
          href='/tennis/soi-keo/'
          name={i18n.menu.predictions}
          onClick={() => resetMatchFilter()}
        ></MenuItem>
        <MenuItem
          href='/tennis/tips/'
          name={i18n.menu.tips}
          onClick={() => resetMatchFilter()}
        ></MenuItem>
        <MenuItem
          href='/tennis/tin-tuc/'
          name={i18n.menu.news}
          onClick={() => resetMatchFilter()}
        ></MenuItem>
        <MenuItem
          href='/tennis/standings/'
          name={i18n.menu.standings}
          onClick={() => resetMatchFilter()}
        ></MenuItem>
        <MenuItem
          href='/betting-tips-today/soccer/'
          name='Dropping Odds'
          onClick={() => resetMatchFilter()}
        ></MenuItem>
      </TwDesktopMenu>

      {/* TODO Mobile menu: Scrollable + different styles */}
      <TwMobileMenu className='layout no-scrollbar overflow-scroll'>
        <MbMenuItem
          href='/tennis/ty-so-truc-tuyen/'
          name={i18n.menu.live_score}
        ></MbMenuItem>
        <MbMenuItem
          href='/tennis/results/'
          name={i18n.menu.results}
        ></MbMenuItem>
        <MbMenuItem
          href='/tennis/fixtures/'
          name={i18n.menu.schedule}
        ></MbMenuItem>
        <MbMenuItem href='/tennis/odds/' name={i18n.menu.odds}></MbMenuItem>
        <MbMenuItem
          href='/tennis/ty-le-chau-au/'
          name={i18n.menu.europe_odds}
        ></MbMenuItem>
        <MbMenuItem
          href='/tennis/soi-keo/'
          name={i18n.menu.predictions}
        ></MbMenuItem>
        <MbMenuItem href='/tennis/tips/' name={i18n.menu.tips}></MbMenuItem>
        <MbMenuItem href='/tennis/tin-tuc/' name={i18n.menu.news}></MbMenuItem>
        <MbMenuItem href='/tennis/standings/' name={i18n.menu.bxh}></MbMenuItem>

        {/* TODO: i18n */}
        {/* <MbMenuItem
          href='/betting-tips-today/soccer/'
          name='Dropping Odds'
        ></MbMenuItem> */}
      </TwMobileMenu>
    </TwFootballMenu>
  );
}
