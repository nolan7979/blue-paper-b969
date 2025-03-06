import { IconType } from 'react-icons';

import CustomizeLink from '@/components/common/CustomizeLink';
import SingleSelectLink from '@/components/common/selects/SingleSelectLink';
import { listKeysMenusByLocale } from '@/constant/menusByLocale';
import { ROUTES_PATH } from '@/constant/paths';
import useTrans from '@/hooks/useTrans';
import clsx from 'clsx';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import AmericanFootballIcon from '/public/svg/sport/am-football.svg';
import BadmintonIcon from '/public/svg/sport/badminton.svg';
import BaseballIcon from '/public/svg/sport/baseball.svg';
import BasketballIcon from '/public/svg/sport/basketball.svg';
import CricketIcon from '/public/svg/sport/cricket.svg';
import FootballIcon from '/public/svg/sport/football.svg';
import IceHockeyIcon from '/public/svg/sport/ice-hockey.svg';
import SnookerIcon from '/public/svg/sport/snooker.svg';
import TableTennisIcon from '/public/svg/sport/table-tennis.svg';
import TennisIcon from '/public/svg/sport/tennis.svg';
import VolleyballIcon from '/public/svg/sport/volleyball.svg';
export const menusMain = [
  {
    id: 'football',
    path: ROUTES_PATH.football,
    icon: FootballIcon,
    label: 'football',
  },
  {
    id: 'basketball',
    path: ROUTES_PATH.basketball,
    icon: BasketballIcon,
    label: 'basketball',
  },
  {
    id: 'tennis',
    path: ROUTES_PATH.tennis,
    icon: TennisIcon,
    label: 'tennis',
  },
  {
    id: 'volleyball',
    path: ROUTES_PATH.volleyball,
    icon: VolleyballIcon,
    label: 'volleyball',
  },
  {
    id: 'baseball',
    path: ROUTES_PATH.baseball,
    icon: BaseballIcon,
    label: 'baseball',
  },
  {
    id: 'badminton',
    path: ROUTES_PATH.badminton,
    icon: BadmintonIcon,
    label: 'badminton',
  },
  {
    id: 'am-football',
    path: ROUTES_PATH.amFootball,
    icon: AmericanFootballIcon,
    label: 'am-football',
  },
  {
    id: 'hockey',
    path: ROUTES_PATH.hockey,
    icon: IceHockeyIcon,
    label: 'hockey',
  },
  {
    id: 'cricket',
    path: ROUTES_PATH.cricket,
    icon: CricketIcon,
    label: 'cricket',
  },
  {
    id: 'table-tennis',
    path: ROUTES_PATH.tableTennis,
    icon: TableTennisIcon,
    label: 'table tennis',
  },
  {
    id: 'snooker',
    path: ROUTES_PATH.snooker,
    icon: SnookerIcon,
    label: 'snooker',
  },
];

export const checkActivePath = (href: string, currentPath: string) => {
  const isRootPath =
    currentPath === '/' && (href === '/' || href === '/football');
  const isSubPath = currentPath.startsWith(href) && href !== '/';
  const isFootballPath =
    (href === '/' || href === '/football') &&
    currentPath.startsWith('/football');
  return isRootPath || isSubPath || isFootballPath;
};

export const NavBar = memo(
  ({ path, locale }: { path: string; locale: string }) => {
    const currentPath = path;
    const i18n = useTrans();
    // cache menu after change locale
    const cacheLocale = useRef<string>(locale);
    const getLabel = (labelKey: string) => {
      return (
        i18n?.header?.[
          labelKey
            .replace(' ', '_')
            .replace('-', '_') as keyof typeof i18n.header
        ] || labelKey
      );
    };

    const [visibleCount, setVisibleCount] = useState(5);

    const baseMenus = useMemo(() => {
      if (cacheLocale.current !== locale) {
        cacheLocale.current = locale;
      }
      const localeCurrent = cacheLocale.current;
      const menusByLocale =
        listKeysMenusByLocale[
          localeCurrent as keyof typeof listKeysMenusByLocale
        ] || [];
      const menuSet = new Set(menusByLocale);

      // Split menus into those that exist in locale and those that don't
      const [localeMenus, otherMenus] = menusMain.reduce<
        [typeof menusMain, typeof menusMain]
      >(
        ([inLocale, notInLocale], menu) => {
          if (menuSet.has(menu.id)) {
            inLocale.push(menu);
          } else {
            notInLocale.push(menu);
          }
          return [inLocale, notInLocale];
        },
        [[], []]
      );

      // Sort menus according to locale order
      const sortedLocaleMenus = [...localeMenus].sort(
        (a, b) => menusByLocale.indexOf(a.id) - menusByLocale.indexOf(b.id)
      );

      return [...sortedLocaleMenus, ...otherMenus];
    }, [locale]);

    const memoizedFirstMenu = useMemo(() => {
      const firstArrayMenu = baseMenus.slice(0, visibleCount);
      return firstArrayMenu;
    }, [baseMenus, visibleCount]);

    const memoizedSecondMenu = useMemo(() => {
      const secondArrayMenu = baseMenus.slice(visibleCount);
      return secondArrayMenu;
    }, [baseMenus, visibleCount]);

    useEffect(() => {
      const handleResize = () => {
        let widthItem = 300;
        if (window.innerWidth <= 1100) {
          widthItem = 360;
        }
        if (window.innerWidth < 1390) {
          let visibleItemsCount = Math.floor(window.innerWidth / widthItem);
          visibleItemsCount = Math.max(visibleItemsCount, 1);
          setVisibleCount(visibleItemsCount);
        } else {
          setVisibleCount(5);
        }
      };

      window.addEventListener('resize', handleResize);
      handleResize(); // Initial check

      return () => window.removeEventListener('resize', handleResize);
    }, [locale]);

    return (
      <div className='mx-10 hidden h-full flex-1 items-center overflow-x-auto whitespace-nowrap no-scrollbar md:overflow-visible lg:flex'>
        <ul id='desktop-menu' className='flex items-center gap-2.5'>
          {memoizedFirstMenu.map((menu: any) => (
            <NavBarItem
              isActived={checkActivePath(menu.path, currentPath)}
              key={menu.id}
              label={getLabel(menu.label)}
              icon={menu.icon}
              href={menu.path}
            />
          ))}
        </ul>
        <SingleSelectLink
          options={memoizedSecondMenu}
          setWidth={true}
          currentPath={currentPath}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.locale === nextProps.locale && prevProps.path === nextProps.path
    );
  }
);

export interface NavBarItemProps {
  keyTest?: string;
  href: string;
  disable?: boolean;
  label: string;
  icon: IconType;
  classes?: string;
  onClick?: () => void;
  isActived: boolean;
  eventCount?: number;
  renderIcon?: () => React.ReactElement;
}

function NavBarItem({
  keyTest,
  label,
  href,
  icon: MenuIcon,
  classes = '',
  onClick,
  isActived,
}: NavBarItemProps) {
  return (
    <li
      test-id={`match-type-${keyTest}`}
      className={twMerge(classes)}
      key={`nav-${label.replace(' ', '-')}`}
    >
      <CustomizeLink href={href} className='!inline'>
        <div
          className={clsx(
            'flex h-[2.375rem]  w-auto max-w-full cursor-pointer items-center gap-1 overflow-hidden truncate overflow-ellipsis rounded-[5.438rem] border-[0.082rem] px-3 py-2 font-oswald text-ccsm font-medium uppercase hover:brightness-125',
            {
              ' border-solid border-[#1456FF] bg-gradient-to-tl from-[#0C1A4C] via-[#0C3089] to-[#1553EF] text-white':
                isActived,
              'border-transparent bg-[#001338] text-dark-text opacity-95':
                !isActived,
            }
          )}
        >
          <MenuIcon className='h-5 w-5' />
          <span>{label}</span>
        </div>
      </CustomizeLink>
    </li>
  );
}
