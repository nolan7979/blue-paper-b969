// import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  checkActivePath,
  NavBarItemProps,
} from '@/components/common/header/NavBar';

import { SPORT } from '@/constant/common';
import { listKeysMenusByLocale } from '@/constant/menusByLocale';
import useDeviceOrientation from '@/hooks/useDeviceOrientation';
import useTrans from '@/hooks/useTrans';
import { useFilterStore, useHomeStore } from '@/stores';
import { useScrollStore } from '@/stores/scroll-progess';
import { useScrollVisible } from '@/stores/scroll-visible';
import { cn } from '@/utils/tailwindUtils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SnookerSVG from '/public/svg/sport/snooker.svg';
import { debounce } from '@/utils/deounce';
import {
  useScrollVisibility,
  useScrollVisibilityForRef,
} from '@/hooks/useScrollVisibility';
import { motion, useReducedMotion } from 'framer-motion';
import { useDevicePerformance } from '@/hooks/useDevicePerformance';
const IMAGE_CDN_PATH =
  process.env.NEXT_PUBLIC_CDN_URL || 'https://cdn.uniscore.com';

interface NavbarItemMobileProps extends NavBarItemProps {
  link: string;
}

export const NavBarMobile = memo(() => {
  const i18n = useTrans();
  const idRef = useRef<HTMLDivElement>(null);
  const { allEventCount } = useHomeStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const createQueryString = useCallback(() => {
    const stringParams = searchParams.toString();

    if (!stringParams) {
      return '';
    }

    return `?${searchParams.toString()}`;
  }, [searchParams]);

  const createHeaderTitle = (
    href: string,
    label: string,
    evenCount: number,
    renderIcon: () => ReactElement,
    renderIconMono: () => ReactElement
  ) => ({
    href, // : locale === 'en' ? href : `/${locale}${href}`,
    label,
    evenCount,
    renderIcon,
    renderIconMono,
  });
  const headerTitles = useMemo(() => {
    let titles = [
      createHeaderTitle(
        '/football',
        i18n.header.football || 'Football',
        allEventCount?.football_live || 0,
        () => (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/menu-icons/football.png`}
            width={24}
            height={24}
            loading='lazy'
            alt='Football'
          />
        ),
        () => (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/menu-icons/football_mono.png`}
            width={24}
            height={24}
            loading='lazy'
            alt='Football'
          />
        )
      ),
      createHeaderTitle(
        '/basketball',
        i18n.header.basketball || 'Basketball',
        allEventCount?.basketball_live || 0,
        () => (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/menu-icons/basketball.png`}
            width={24}
            height={24}
            loading='lazy'
            alt='Basketball'
          />
        ),
        () => (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/menu-icons/basketball_mono.png`}
            width={24}
            height={24}
            loading='lazy'
            alt='Basketball'
          />
        )
      ),
      createHeaderTitle(
        '/tennis',
        i18n.header.tennis || 'Tennis',
        allEventCount?.tennis_live || 0,
        () => (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/menu-icons/tennis.png`}
            width={24}
            height={24}
            loading='lazy'
            alt='Tennis'
          />
        ),
        () => (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/menu-icons/tennis_mono.png`}
            width={24}
            height={24}
            loading='lazy'
            alt='Tennis'
          />
        )
      ),
      createHeaderTitle(
        '/am-football',
        i18n.header.am_football || 'AM-Football',
        allEventCount?.am_football_live || 0,
        () => (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/menu-icons/rugby.png`}
            width={24}
            height={24}
            loading='lazy'
            alt='AM-Football'
          />
        ),
        () => (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/menu-icons/rugby_mono.png`}
            width={24}
            height={24}
            loading='lazy'
            alt='AM-Football-mono'
          />
        )
      ),
      createHeaderTitle(
        '/volleyball',
        i18n.header.volleyball || 'Volleyball',
        allEventCount?.volleyball_live || 0,
        () => (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/menu-icons/volleyball.png`}
            width={24}
            height={24}
            loading='lazy'
            alt='Volleyball'
          />
        ),
        () => (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/menu-icons/volleyball_mono.png`}
            width={24}
            height={24}
            loading='lazy'
            alt='volleyball_mono'
          />
        )
      ),
      createHeaderTitle(
        '/baseball',
        i18n.header.baseball || 'Baseball',
        allEventCount?.baseball_live || 0,
        () => (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/menu-icons/baseball.png`}
            width={24}
            height={24}
            loading='lazy'
            alt='Baseball'
          />
        ),
        () => (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/menu-icons/baseball_mono.png`}
            width={24}
            height={24}
            loading='lazy'
            alt='baseball_mono'
          />
        )
      ),
      createHeaderTitle(
        '/badminton',
        i18n.header.badminton || 'Badminton',
        allEventCount?.badminton_live || 0,
        () => (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/menu-icons/badminton.png`}
            width={24}
            height={24}
            loading='lazy'
            alt='Badminton'
          />
        ),
        () => (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/menu-icons/badminton_mono.png`}
            width={24}
            height={24}
            loading='lazy'
            alt='badminton_mono'
          />
        )
      ),
      createHeaderTitle(
        '/cricket',
        i18n.header.cricket || 'Cricket',
        allEventCount?.cricket_live || 0,
        () => (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/menu-icons/cricket.png`}
            width={24}
            height={24}
            loading='lazy'
            alt='Cricket'
          />
        ),
        () => (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/menu-icons/cricket_mono.png`}
            width={24}
            height={24}
            loading='lazy'
            alt='cricket_mono'
          />
        )
      ),
      createHeaderTitle(
        '/hockey',
        i18n.header.hockey || 'Hockey',
        allEventCount?.hockey_live || 0,
        () => (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/menu-icons/hockey.png`}
            width={24}
            height={24}
            loading='lazy'
            alt='Hockey'
          />
        ),
        () => (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/menu-icons/ice_hockey_mono.png`}
            width={24}
            height={24}
            loading='lazy'
            alt='ice_hockey_mono'
          />
        )
      ),
      createHeaderTitle(
        '/table-tennis',
        'Table Tennis',
        allEventCount?.table_tennis_live || 0,
        () => (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/menu-icons/table_tennis_1.png`}
            width={24}
            height={24}
            loading='lazy'
            alt='table-tennis'
          />
        ),
        () => (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/menu-icons/table_tennis_mono_1.png`}
            width={24}
            height={24}
            loading='lazy'
            alt='table-tennis-mono'
          />
        )
      ),
      createHeaderTitle(
        '/snooker',
        'Snooker',
        allEventCount?.snooker_live || 0,
        () => (
          <img
            src={'/images/menu-icons/snooker_1.png'}
            width={24}
            height={24}
            loading='lazy'
            alt='table-tennis-mono'
          />
        ),
        () => <SnookerSVG className='h-6 w-6' />
      ),
    ];

    const menusByLocale =
      listKeysMenusByLocale[
        i18n.language as keyof typeof listKeysMenusByLocale
      ];

    if (!menusByLocale) return titles;

    const menusNotInLocale = titles.filter(
      (menu) =>
        !menusByLocale.some((item) => item === menu.href.replace('/', ''))
    );

    const sortIndexMenusByLocale = titles.sort((a, b) => {
      return (
        menusByLocale.indexOf(a.href.replace('/', '')) -
        menusByLocale.indexOf(b.href.replace('/', ''))
      );
    });

    const remainingMenus = sortIndexMenusByLocale.filter(
      (menu) => !menusNotInLocale.some((item) => item.href === menu.href)
    );

    return [...remainingMenus, ...menusNotInLocale];
  }, [i18n.language, allEventCount]);

  //Trigger Behavior scroll
  useEffect(() => {
    // Set isInitialLoad to false after component mounts
    setIsInitialLoad(false);
  }, []);
  const isLandscape = useDeviceOrientation();
  const isVisible = useScrollVisibility({ isLandscape });

  const MatchType = 'standings';
  const { matchTypeFilter } = useFilterStore();

  const prefersReducedMotion = useReducedMotion();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isLowPerformance = useDevicePerformance();
  

  const isExpanded = matchTypeFilter === MatchType || isVisible;

  const animationVariants = {
    expanded: { maxHeight: 500, opacity: 1, overflow: 'hidden' },
    collapsed: { maxHeight: 0, opacity: 0, overflow: 'hidden' },
  };

  return (
    <motion.div
      className={`w-full overflow-hidden lg:hidden ${
        isCollapsed ? 'hidden' : ''
      }`}
      ref={idRef}
      initial='collapsed'
      animate={
        isExpanded ? 'expanded' : 'collapsed'
      }
      variants={animationVariants}
      transition={
        prefersReducedMotion || isLowPerformance
          ? { duration: 0 }
          : { duration: 0.3, ease: 'easeOut' }
      }
      onAnimationComplete={() => {
        if (!isExpanded) setIsCollapsed(true); // Ẩn khi collapse xong
      }}
      onAnimationStart={() => {
        if (isExpanded) setIsCollapsed(false); // Hiện lại khi expand
      }}
    >
      <div className={'flex w-full overflow-x-scroll no-scrollbar'}>
        {headerTitles.map((item) => (
          <NavBarItemMobile
            key={item.href}
            isActived={checkActivePath(item.href, router.asPath)}
            label={item.label}
            renderIcon={
              item.href === pathname || checkActivePath(item.href, pathname)
                ? item.renderIcon
                : item.renderIconMono
            }
            eventCount={item.evenCount}
            // onClick={() => router.push(`${item.href}${createQueryString()}`)}
            link={`${item.href}`}
          />
        ))}
      </div>
    </motion.div>
  );
});

const NavBarItemMobile = memo(
  function NavBarItemMobile({
    label,
    classes = '',
    disable = false,
    isActived,
    link = '',
    eventCount = 0,
    renderIcon = () => <></>,
  }: Partial<NavbarItemMobileProps>) {
    const { matchTypeFilter } = useFilterStore();
    return (
      <Link
        test-id={`tab-${label}`}
        className={`flex size-18 h-max min-w-18 flex-col items-center justify-start gap-1 truncate rounded-lg px-2 py-1 text-xxs text-dark-text opacity-75 dark:text-white ${
          isActived && 'bg-menu-dark text-white !opacity-100'
        }`}
        // onClick={onClick}
        href={`${link}${
          [SPORT.FOOTBALL, SPORT.BASKETBALL, SPORT.TENNIS].includes(
            link.split('/').join('') as SPORT
          ) && matchTypeFilter === 'standings'
            ? '?qFilter=standings'
            : ''
        }`}
      >
        <span className='min-h-6 min-w-6'>{renderIcon()}</span>
        <span className='whitespace-nowrap'>{label}</span>
        <span className='rounded-2xl bg-neutral-alpha-04 px-1'>
          {!!eventCount && eventCount}
        </span>
      </Link>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps?.isActived === nextProps.isActived &&
      prevProps?.eventCount === nextProps.eventCount &&
      prevProps?.label === nextProps.label &&
      prevProps?.onClick === nextProps.onClick &&
      prevProps?.renderIcon === nextProps.renderIcon
    );
  }
);
