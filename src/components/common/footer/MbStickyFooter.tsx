import { SPORT } from '@/constant/common';
import { useSportName } from '@/hooks';
import { useAllEventCounter } from '@/hooks/useCommon';
import useTrans from '@/hooks/useTrans';
import { useFilterStore, useHomeStore } from '@/stores';
import { useEventCountStore } from '@/stores/event-count';
import { debounce } from '@/utils/deounce';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import StandingsSVG from 'public/svg/standings.svg';
import { useEffect, useMemo, useRef, useState } from 'react';
import tw from 'twin.macro';
import LiveSVG from '/public/svg/live.svg';
import WhistleSVG from '/public/svg/menu-footer/freethrow.svg';
import GoalMenuSVG from '/public/svg/menu-footer/HouseSimple.svg';
import StarFillSVG from '/public/svg/star-fill.svg';
import useDeviceOrientation from '@/hooks/useDeviceOrientation';
import { useSportBefore } from '@/stores/sport-ref';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';


interface IProps {
  tournamentId: string;
  seasonId: string;
}

export function MbStickyFooter() {
  const i18n = useTrans();
  const router = useRouter();
  const { query } = router;
  const { setAllEventCount } = useHomeStore();
  const { eventNumber } = useEventCountStore();
  const { data: allEventData } = useAllEventCounter();
  const {sportName,setSportName} = useSportBefore()
  const sport: string | SPORT = useSportName();
  const getFilter = (query?.qFilter as string) ||  'all' ;
    const { setMatchFilterMobile } = useFilterStore();
  const [showModal, setShowModal] = useState(false);
  const [numOfLive, setNumOfLive] = useState(eventNumber || 0);
  const [isClient, setIsClient] = useState(false);

  const isLandscape = useDeviceOrientation();

  const isFavoritePage = useMemo(() => {
    return router.pathname === '/favorite';
  }, [router.pathname]);

  useEffect(() => {
    const sportToParams = router.pathname.split('/')[1]
    if(sportToParams && sportToParams !== 'favorite'){
      setSportName(sportToParams);
    }
    if(!sportToParams){
      setSportName(sport)
    }
  }, [router.pathname]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!allEventData || !setAllEventCount) return;

    setAllEventCount(allEventData);
    const sportKey = `${(sportName ? sportName : sport).replace('-', '_')}_live`;
    setNumOfLive(allEventData[sportKey]);
  }, [allEventData, sport,sportName, setAllEventCount]);

  // useEffect(() => {
  //   if (matchTypeFilter !== 'all') {
  //     resetMatchFilterMobile();
  //   }
  // }, [matchTypeFilter, resetMatchFilterMobile]);
  const isVisible = useScrollVisibility({ isLandscape });


 
  const handleNavigation = (filter: string, url: string) => {
    setShowModal(false);
    router.push(url);
  };

  const checkUrlSportBefore = isFavoritePage ? `${sportName}` : `${sport}`
 
  const menuItems = useMemo(
    () => [
      {
        filter: 'all',
        icon: GoalMenuSVG,
        label: i18n.filter.all,
        url: checkUrlSportBefore === SPORT.FOOTBALL && sport === SPORT.FOOTBALL ? '/' : `/${checkUrlSportBefore}`,
      },
      {
        filter: 'live',
        icon: LiveSVG,
        label: `Live${numOfLive > -1 && isClient ? ` (${numOfLive})` : ''}`,
        url: `/${checkUrlSportBefore}?qFilter=live`,
        iconClass: 'text-[#DE2400]',
        textClass: 'bg-button-live-gradient rounded-md px-1 py-0.5 !text-white',
      },
      {
        filter: 'finished',
        icon: WhistleSVG,
        label: i18n.filter.finished,
        url: `/${checkUrlSportBefore}?qFilter=finished`,
      },
      // {
      //   filter: 'standings',
      //   icon: StandingsSVG,
      //   label: i18n.menu.standings,
      //   url: `/${sport}?qFilter=standings`,
      // },
      ...([SPORT.FOOTBALL, SPORT.BASKETBALL, SPORT.TENNIS].includes(sportName as SPORT)
        ? [
          {
            filter: 'standings',
            icon: StandingsSVG,
            label: i18n.menu.standings,
            url: `/${sport}?qFilter=standings`,
          },
        ]
        : []),
      // {
      //   filter: 'users',
      //   icon: UserSVG,
      //   label: i18n.tab.other,
      //   onClick: () => {
      //     setShowDrawerStore(true);
      //   },
      // },
      {
        filter: 'favorite',
        icon: StarFillSVG,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        label: i18n.drawerMobile.favorites,
        url: `/favorite?qFilter=favorite`,
      },
    ],
    [sport, numOfLive, isClient, i18n,sportName]
  );

  return (
    <>
      <div
        className={clsx(
          'sticky bottom-[-1px] z-20 divide-y rounded-tl-3xl rounded-tr-3xl transition-all dark:bg-[#01040D] lg:hidden',
          isVisible ? 'translate-y-0' : 'translate-y-full',
        )}
        style={{
          backdropFilter: 'blur(19px)',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div
          style={{ background: 'rgba(7, 25, 118, 0.42)' }}
          className='rounded-tl-3xl rounded-tr-3xl'
        >
          <div className='dark:border-linear-menu-footer rounded-tl-3xl rounded-tr-3xl bg-light-main px-2.5 py-2'>
            <div className='dark:bg-navbar-bottom-gradient dark:border-linear-menu-list flex rounded-3xl bg-white text-cxs md:text-xs'>
              {menuItems.map(
                ({
                  filter,
                  icon: Icon,
                  label,
                  url,
                  iconClass,
                  textClass,
                }) => (
                  <TwBtmMenuItem
                    key={filter}
                    className={clsx('gap-1.5', {
                      '!p-0.5': isLandscape,
                      'border-b-item text-black dark:text-white':
                        getFilter === filter && !showModal,
                      'text-[#8D8E92] dark:text-[#8D8E92]':
                        getFilter !== filter,
                    })}
                    onClick={() => url && handleNavigation(filter, url)}
                  >
                    <Icon
                      className={clsx(
                        'h-4 w-4 md:h-6 md:w-6',
                        iconClass ||
                        (getFilter === filter && !showModal
                          ? 'text-light-primary dark:text-white'
                          : 'text-[#8D8E92] dark:text-[#8D8E92]')
                      )}
                    />
                    <TwBtmMenuText
                      className={clsx(
                        'uppercase',
                        textClass ||
                        (getFilter === filter && !showModal
                          ? 'text-light-primary dark:text-white'
                          : 'text-[#8D8E92] dark:text-[#8D8E92]')
                      )}
                    >
                      {label}
                    </TwBtmMenuText>
                  </TwBtmMenuItem>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const TwBtmMenuItem = tw.div`py-1.5 md:py-3 text-white flex justify-center  cursor-pointer drop-shadow-2xl flex-1 flex-col place-content-center items-center`;
export const TwBtmMenuText = tw.div`whitespace-nowrap font-semibold truncate max-w-[70px] xsm:max-w-full`;
