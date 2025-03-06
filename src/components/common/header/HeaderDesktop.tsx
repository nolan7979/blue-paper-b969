import clsx from 'clsx';
import { useRouter } from 'next/router';
import { memo, RefObject, useEffect, useMemo, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import { TwButtonIcon } from '@/components/buttons/IconButton';
import {
  NavBar,
  NavBarMobile,
  SearchBtn,
  ThemeSwitch,
  TopLeaguesPopup,
  VersionSwitch,
} from '@/components/common/header';
import ProfileDropdown from '@/components/common/header/ProfileDropdown';
import { Logo } from '@/components/common/Logo';
import DropdownCalendar from '@/components/filters/DropdownCalendarFilter';
import { MenuItemMobile } from '@/components/menus/MenuItem';
import SortOptions from '@/components/modules/football/filters/SortOptions';

import {
  useDrawerStore,
  useFilterStore,
  useHomeStore,
  useMatchStore,
  useSitulations,
} from '@/stores';

import Avatar from '@/components/common/Avatar';
import {
  default as CustomizeLink,
  default as CustomLink,
} from '@/components/common/CustomizeLink';
import { SelectLanguage } from '@/components/common/selects/SelectLanguage';
import Transition from '@/components/common/Transition';
import Drawer from '@/components/exp/drawer/exp-drawer';
import { TwFilterCol } from '@/components/modules/common';
import { FilterColumn } from '@/components/modules/common/filters/FilterColumn';
import { IMAGE_CDN_PATH, SPORT } from '@/constant/common';
import { IScore } from '@/constant/interface';
import {
  MenuHeaderPath,
  MenuHeaderPathBadminton,
  MenuHeaderPathBasketball,
  MenuHeaderPathTennis,
  MenuHeaderPathVolleyball,
  ROUTES,
} from '@/constant/paths';
import { useArabicLayout, useDetectDeviceClient, useSportName } from '@/hooks';
import useDeviceOrientation from '@/hooks/useDeviceOrientation';
import { useHamburgerMenu } from '@/stores/menu-store';
import { usePlayerStore } from '@/stores/player-store';
import { genDisplayedTime, isValEmpty } from '@/utils';
import { useSession } from 'next-auth/react';
import HamburgerSVG from '~/svg/hamburger.svg';
import LeftArrowSVG from '~/svg/left-arrow.svg';
import IconFixtures from '~/svg/menu-mobile-fixtures.svg';
import IconResult from '~/svg/menu-mobile-result.svg';
import RightArrowSVG from '~/svg/right-arrow.svg';
import StarFill from '/public/svg/star-fill.svg';
import { useScrollVisible } from '@/stores/scroll-visible';

interface HeaderProps {
  isDesktop?: boolean;
}

export const Header: React.FC<HeaderProps> = memo(function Header({
  isDesktop,
}) {
  const { isMobile } = useDetectDeviceClient();
  const { matchDetails: match } = useMatchStore();
  const { selectedPlayer } = usePlayerStore();
  const i18n = useTrans();
  const sport = useSportName();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMenuLeft, setIsOpenMenuLeft] = useState<boolean>(false);
  const { setIsOpen: setIsOpenHamburgerMenu } = useHamburgerMenu();
  const [showHeader, setShowHeader] = useState<boolean>(false);
  const router = useRouter();
  const { matchParams } = router.query;

  const { matchLiveInfo, setMatchLiveInfo } = useHomeStore();
  const { situlations } = useSitulations();
  const isArabicLayout = useArabicLayout();
  const isShowSimulation = situlations.length > 0;
  const countryPage = router.pathname.includes('/football/country');
  const isLandscape = useDeviceOrientation();
  const { scrollVisible} = useScrollVisible();
  const isShowHeader =
    Object.values(MenuHeaderPath).includes(router.pathname) ||
    countryPage ||
    ['/football'].includes(router.pathname) ||
    Object.values(ROUTES[SPORT.FOOTBALL]).includes(router.pathname) ||
    [
      SPORT.BASKETBALL,
      SPORT.VOLLEYBALL,
      SPORT.TENNIS,
      SPORT.BADMINTON,
      SPORT.AMERICAN_FOOTBALL,
      SPORT.CRICKET,
      SPORT.BASEBALL,
      SPORT.ICE_HOCKEY,
      SPORT.TABLE_TENNIS,
      SPORT.SNOOKER,
    ].some((sport) => Object.values(ROUTES[sport]).includes(router.pathname));

  

  const isScoreNotAvailable =
    !match?.homeScore ||
    !match?.awayScore ||
    Object.keys(match.homeScore)?.length === 0 ||
    Object.keys(match.awayScore)?.length === 0 ||
    isValEmpty((match?.homeScore as IScore)?.display) ||
    isValEmpty((match?.awayScore as IScore)?.display);

  const isOtherScoreNotAvailable =
    !match?.scores || Object.keys(match.scores)?.length === 0;
  const isPlayerAvailable =
    selectedPlayer && Object.keys(selectedPlayer).length > 0;

  // const openTopLeaguesPopup = () => {
  //   setIsOpen(false);
  //   topLeaguesRef?.current?.click();
  // };

  const getTimeScore = useMemo(() => {
    if (!match) {
      return;
    }
    const newValues =
      genDisplayedTime(
        match.startTimestamp,
        match.status,
        i18n,
        match.time?.currentPeriodStartTimestamp
      ) || [];

    return newValues;
  }, [match]);

  const CheckConditionShowCenter = useMemo(() => {
    if (
      (sport === SPORT.FOOTBALL && match?.status?.code == 0) ||
      (sport !== SPORT.FOOTBALL && match?.status?.code == 1)
    ) {
      return true;
    }
    return false;
  }, [match]);

  const onClickRoundBack = () => {
    if (matchLiveInfo && !isDesktop) {
      setMatchLiveInfo(false);
      return;
    }
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(`/${sport}`);
    }
  };

  const memoizedTwFilterCol = useMemo(() => {
    return (
      <TwFilterCol className='flex-shrink-1 max-w-52'>
        <FilterColumn sport={sport} />
      </TwFilterCol>
    );
  }, [sport]);

  useEffect(() => {
    setIsOpenHamburgerMenu(isOpenMenuLeft);
  }, [isOpenMenuLeft]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > 150) {
        // Hide on scroll down
        setShowHeader(true);
      } else {
        // Show on scroll up
        setShowHeader(false);
      }
    };

    if (window.innerWidth <= 768) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (window.innerWidth <= 768) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <header
      className={clsx('dark-away-score z-20 lg:z-[9999]', {
        'position-static': isLandscape && isMobile,
        'sticky top-[-1px]': !isLandscape || !isMobile,
      })}
    >
      {isPlayerAvailable && (
        <div
          className={`fixed top-0 z-10 flex h-[54px] w-full items-center justify-center gap-2 lg:hidden  ${
            showHeader
              ? 'dark:dark-away-score translate-y-0'
              : '-translate-y-full'
          }`}
        >
          <Avatar
            id={selectedPlayer?.id}
            type='player'
            width={28}
            height={28}
            rounded={false}
            isBackground={false}
          />
          <span className='font-oswald font-bold text-white'>
            {selectedPlayer?.name}
          </span>
        </div>
      )}
      {match && matchParams && matchParams.length > 0 && (
        <Transition>
          <div
            className={`fixed top-0 z-10 flex h-[54px] w-full items-center justify-center lg:hidden  ${
              showHeader
                ? 'dark:dark-away-score translate-y-0'
                : '-translate-y-full'
            }`}
          >
            <div className='flex items-center gap-x-4 px-6'>
              {/* Team 1 */}
              <div
                className='flex flex-1 place-content-center items-center justify-end gap-x-3'
                test-id='team-1'
              >
                <div className='relative'>
                  <CustomLink
                    href={`/${sport}/competitor/${match.homeTeam.slug}/${match.homeTeam?.id}`}
                    target='_parent'
                  >
                    {match?.homeTeam?.sub_ids &&
                    match?.homeTeam?.sub_ids.length > 0 ? (
                      <>
                        <div className=' flex'>
                          {Array.isArray(match?.homeTeam?.sub_ids) && (
                            match?.homeTeam?.sub_ids?.map((item, index) => {
                              return (
                                <Avatar
                                id={item}
                                type='team'
                                width={28}
                                height={28}
                                rounded={true}
                                isBackground={true}
                              />
                            );
                            })
                          )}
                        </div>
                      </>
                    ) : (
                      <Avatar
                        id={match.homeTeam?.id}
                        type='team'
                        width={28}
                        height={28}
                        rounded={false}
                        isBackground={false}
                      />
                    )}
                  </CustomLink>
                </div>
              </div>

              {/* Score */}
              {/* {!isOtherScoreNotAvailable && isScoreNotAvailable && (
                <div
                  test-id='score-match'
                  className='rounded-lg border-2 border-match-score px-2.5 py-0.5 font-oswald text-sm font-black text-match-score dark:bg-dark-score ml-4'
                >
                  {match?.scores?.ft && `${match?.scores?.ft[0]} - ${match?.scores?.ft[1]}`}
                </div>
              )} */}
              {!CheckConditionShowCenter ? (
                <div
                  test-id='score-match'
                  className='rounded-lg border-2 border-match-score px-2.5 py-0.5 font-oswald text-sm font-black text-match-score dark:bg-dark-score'
                >
                  {!isOtherScoreNotAvailable && match?.scores?.ft
                    ? `${match?.scores?.ft[0]} - ${match?.scores?.ft[1]}`
                    : `${(match.homeScore as IScore)?.display} - ${
                        (match.awayScore as IScore)?.display
                      }`}
                </div>
              ) : (
                <div
                  test-id='time-score-match'
                  className=' font-oswald text-sm font-black text-dark-orange'
                >
                  {getTimeScore && getTimeScore?.length > 0 && getTimeScore[1]}
                </div>
              )}

              {/* Team 2 */}
              <div
                className='flex flex-1 place-content-center items-center justify-start gap-x-3 '
                test-id='team-2'
              >
                <CustomLink
                  href={`/${sport}/competitor/${match.awayTeam?.slug}/${match.awayTeam?.id}`}
                  target='_parent'
                >
                   {match?.awayTeam?.sub_ids &&
                    match?.awayTeam?.sub_ids.length > 0 ? (
                      <>
                        <div className=' flex'>
                          {Array.isArray(match?.awayTeam?.sub_ids) && (
                            match?.awayTeam?.sub_ids?.map((item, index) => {
                              return (
                                <Avatar
                                id={item}
                                type='team'
                                width={28}
                                height={28}
                                rounded={true}
                                isBackground={true}
                              />
                            );
                            })
                          )}
                        </div>
                      </>
                    ) : (
                      <Avatar
                        id={match.awayTeam?.id}
                        type='team'
                        width={28}
                        height={28}
                        rounded={false}
                        isBackground={false}
                      />
                    )}
                </CustomLink>
              </div>
            </div>
          </div>
        </Transition>
      )}
      <div
        className={`relative z-50 flex min-h-[54px] flex-col items-center justify-items-start gap-2 py-2 lg:h-[3.875rem] lg:gap-0 lg:py-0 ${
          matchParams && matchParams.length > 0 ? 'h-[54px]' : ''
        }`}
      >
        <div
          className='layout flex h-[40px] w-full flex-wrap items-center justify-between px-2.5 lg:h-full'
          test-id='m-top-bar'
        >
          <div
            className={clsx(
              'relative flex items-center justify-start lg:flex',
              {
                hidden: !isShowHeader,
              }
            )}
          >
            <div
              className={clsx(
                'hidden transform transition-all duration-200 hover:cursor-pointer lg:block',
                {
                  'pointer-events-none w-0 -translate-x-10 opacity-0':
                    !isShowSimulation,
                  'translate-x-0 opacity-100': isShowSimulation,
                }
              )}
              onClick={() => {
                setIsOpenMenuLeft(!isOpenMenuLeft);
              }}
            >
              <HamburgerSVG className='h-6 w-6' />
            </div>
            <div
              className={clsx(
                'ml-2 mr-2 flex w-min transform items-center justify-center transition-all duration-200',
                { 'lg:ml-0': !isShowSimulation }
              )}
              // onClick={() => setMatchFilter('all')}
            >
              <Logo />
            </div>
          </div>

          <TwButtonIcon
            onClick={onClickRoundBack}
            className={clsx('h-8 w-8 lg:hidden', { hidden: isShowHeader })}
            icon={
              isArabicLayout ? (
                <RightArrowSVG className='h-4 w-4 text-white' />
              ) : (
                <LeftArrowSVG className='h-4 w-4 text-white' />
              )
            }
          />
          <NavBar path={router.asPath} locale={i18n.language} />
          <MenuButtons
            setIsOpen={setIsOpen}
            isDesktop={isDesktop}
            isShowHeader={isShowHeader}
          />
        </div>
        {isShowHeader && <NavBarMobile />}
        {/* {isShowHeader && (
          <div className='w-full px-2.5 pb-2 lg:hidden'>
            <FootBallMenuMobile
              topLeaguesRef={topLeaguesRef}
              locale={router.locale}
            />
          </div>
        )} */}
      </div>
      <Drawer
        setIsOpen={setIsOpenMenuLeft}
        isOpen={isOpenMenuLeft}
        position='left'
        classNameContainer='top-[4.25rem]'
        className='w-min px-8 py-6 no-scrollbar'
      >
        {memoizedTwFilterCol}
      </Drawer>
    </header>
  );
});

// Buttons props
interface ButtonsProps {
  setIsOpen: (isOpen: boolean) => void;
  isShowHeader?: boolean;
  isDesktop?: boolean;
}

export const MenuButtons = ({
  setIsOpen,
  isShowHeader,
  isDesktop,
}: ButtonsProps) => {
  const i18n = useTrans();
  // const router = useRouter();
  // const currentPath = router.asPath;
  const { setShowDrawer } = useDrawerStore();

  const { data: session } = useSession();
  return (
    <div
      className='mr-1 flex flex-1 items-center justify-end gap-1 text-dark-default'
      test-id='icon_search'
    >
      {/*<div className='sm:inline-block lg:hidden'>*/}
      {/*  /!* <TopLeague /> *!/*/}
      {/*  <TopLeaguesPopup />*/}
      {/*</div>*/}
      {/* {isShowOdds(path) && (
        <div>
          <OddsTypeSelect />
        </div>
      )} */}
      {isShowHeader && (
        <div className='lg:hidden'>
          <SortOptions />
        </div>
      )}
      <div className='hidden lg:inline-block'>
        <FavoriteButton />
      </div>

      <div className='inline-block'>
        <SearchBtn />
      </div>

      <div className='hidden lg:inline-block'>
        <ThemeSwitch />
      </div>
      {/* {isDesktop && (
        <>
          <div className='hidden lg:inline-block'>
            <SelectLanguage size='max' />
          </div>
          <div className='hidden md:inline-block'>
            <VersionSwitch
              href='/mobile'
              label={i18n.header.mobile}
              isMobile={false}
            />
          </div>
        </>
      )} */}

      <div className='hidden lg:inline-block'>
        <SelectLanguage size='max' />
      </div>

      <div className='hidden lg:inline-block'>
        {/* Use domain-url for PROD: m.domain.com */}
        <VersionSwitch
          href='/mobile'
          label={i18n.header.mobile}
          isMobile={false}
        />
        {/* <VersionSwitch href='/mobile' label='Mobile' /> */}
      </div>

      <div
        className='hidden lg:inline-block'
        onClick={() => setShowDrawer(true)}
      >
        <ProfileDropdown />
      </div>
      {!isDesktop && (
      <div
        className='inline-block lg:hidden'
        onClick={() => setShowDrawer(true)}
      >
        {session && session.user?.image ? (
          <img
            src={session.user?.image}
            alt='User Avata'
            loading='lazy'
            className='h-6 w-6 rounded-full'
          />
        ) : (
          <img
            src={`${IMAGE_CDN_PATH}/public/images/football/players/unknown1.webp`}
            alt='unknown1'
            loading='lazy'
            className='h-6 w-6 rounded-full'
          />
        )}
        {/* <HeaderDrawer setIsOpen={setIsOpen} /> */}
      </div>
      )}
    </div>
  );
};

const FavoriteButton = () => {
  const i18n = useTrans();
  const router = useRouter();
  const isActive = router.asPath == '/favorite';
  return (
    <>
      <CustomizeLink href={'/favorite'} className='!inline'>
        <div
          className={clsx(
            'flex h-[2.375rem]  w-auto max-w-full cursor-pointer items-center gap-1 overflow-hidden truncate overflow-ellipsis rounded-[5.438rem] border-[0.082rem] px-3 py-2 font-oswald text-ccsm font-medium uppercase hover:brightness-125',
            {
              ' border-solid border-[#1456FF] bg-gradient-to-tl from-[#0C1A4C] via-[#0C3089] to-[#1553EF] text-white':
                isActive,
              'border-transparent bg-[#001338] text-dark-text opacity-95':
                !isActive,
            }
          )}
        >
          <StarFill className='h-3 w-3 text-white' />
          <span>{i18n.drawerMobile.favorites}</span>
        </div>
      </CustomizeLink>
    </>
  );
};

type MenuPaths = {
  liveScore: string;
  results: string;
  fixtures: string;
  standings: string;
  standings_normal: string;
  basketBall?: string;
  liveScoreTennis?: string;
};

type SportMenuPaths = {
  [key: string]: MenuPaths;
};
export function FootBallMenuMobile({
  topLeaguesRef,
  locale,
}: {
  topLeaguesRef?: RefObject<HTMLButtonElement>;
  locale?: string;
}) {
  const i18n = useTrans();
  const isArabicLayout = useArabicLayout();
  const { resetMatchFilter, setMatchFilter } = useFilterStore();
  const sport = useSportName();

  const menuPath = useMemo(() => {
    const mapMenuPath: SportMenuPaths = {
      [SPORT.FOOTBALL]: MenuHeaderPath,
      [SPORT.BASKETBALL]: MenuHeaderPathBasketball,
      [SPORT.VOLLEYBALL]: MenuHeaderPathVolleyball,
      [SPORT.TENNIS]: MenuHeaderPathTennis,
      [SPORT.BADMINTON]: MenuHeaderPathBadminton,
    };

    return mapMenuPath[sport] || MenuHeaderPath;
  }, [sport]);

  return (
    <section className='dark:bg-menu-gradient relative flex w-full items-center justify-between rounded-full py-1 pr-1'>
      <ul className='flex items-center justify-start'>
        <MenuItemMobile
          href={'all'}
          className='font-oswald'
          name={i18n.menu.live_score}
          onClick={() => resetMatchFilter()}
        />
        <MenuItemMobile
          href={'finished'}
          className='font-oswald'
          icon={IconResult}
          onClick={() => resetMatchFilter()}
        />

        <MenuItemMobile
          href={'fixtures'}
          className='font-oswald'
          icon={IconFixtures}
          onClick={() => resetMatchFilter()}
        />

        {/* <MenuItemMobile
          href={
            locale === 'br' ? menuPath.standings : menuPath.standings_normal
          }
          className='font-oswald'
          icon={IconStandings}
          onClick={() => resetMatchFilter()}
        /> */}
        <TopLeaguesPopup
          isTournaments={true}
          ref={topLeaguesRef}
          sport={sport}
        />
      </ul>
      <div
        className={clsx('absolute', {
          'left-2': isArabicLayout,
          'right-2': !isArabicLayout,
        })}
      >
        <DropdownCalendar isArabicLayout={isArabicLayout} />
      </div>
    </section>
  );
}
