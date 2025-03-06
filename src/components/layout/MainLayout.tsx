import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import tw from 'twin.macro';

import { Footer, MbStickyFooter } from '@/components/common/footer';
import ScrollToTopButton from '@/components/common/GoToTop';

const PlayerStatsPopUpContentContainer = dynamic(
  () =>
    import('@/components/common/pop-over/PlayerStatsPopUp').then(
      (mod) => mod.PlayerStatsPopUpContentContainer
    ),
  { ssr: false }
);

import { DrawerMenu, Header } from '@/components/common/header';
import { LOCAL_STORAGE } from '@/constant/common';
import { ALL_ADS_PATH, ALL_HOME_PATH } from '@/constant/paths';
import { useLocaleStatsDetailHead } from '@/hooks/useFootball';
import { LayoutProps } from '@/models';
import { useDrawerStore } from '@/stores/filter-store';
import { useHamburgerMenu } from '@/stores/menu-store';
import { getItem, setItem } from '@/utils/localStorageUtils';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const AdComponentVertical = dynamic(
  () => import('@/components/layout/AdComponent'),
  { ssr: false }
);

export function MainLayout({ children, isDesktop }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const domain = typeof window !== 'undefined' ? window.location.origin : '';
  const { isOpen: isOpenHamburgerMenu } = useHamburgerMenu();
  const { setShowDrawer, showDrawer } = useDrawerStore();
  const { locale } = router;

  const hasMBStickyFooter = useMemo(() => {
    return ALL_HOME_PATH.some((route) => route === pathname);
  }, [pathname]);

  const hasAds = useMemo(() => {
    return (
      !ALL_ADS_PATH.some((route) => route === pathname) &&
      !domain.includes('.com')
    );
  }, [pathname, domain]);

  const currentLocale = useMemo(
    () => getItem(LOCAL_STORAGE.currentLocale),
    [locale]
  );
  const statsLocale = useMemo(
    () => getItem(LOCAL_STORAGE.statsLocaleDetail),
    [currentLocale, locale]
  );

  const { data: statsDetailData } = useLocaleStatsDetailHead(
    (currentLocale && JSON.parse(currentLocale!)) || locale
  );

  useEffect(() => {
    if (
      statsDetailData &&
      JSON.stringify(statsDetailData).length !== statsLocale?.length
    ) {
      setItem(LOCAL_STORAGE.statsLocaleDetail, JSON.stringify(statsDetailData));
    }
  }, [statsDetailData, statsLocale]);

  return (
    <PageContainer>
      <Header isDesktop={isDesktop} />
      <div
        className={`relative flex w-full flex-1 justify-center ${
          hasAds ? 'layout' : ''
        }`}
      >
        {hasAds && !isOpenHamburgerMenu && (
          <div className='absolute hidden h-full w-[160px] shrink-0 lg:-left-[143px] 3xl:flex'>
            <div
              className='sticky top-[5.375rem] z-50'
              style={{
                height: '250px',
                width: '160px',
              }}
            >
              <AdComponentVertical />
            </div>
          </div>
        )}
        <TwMainContentSection>{children}</TwMainContentSection>
        {hasAds && (
          <div className='absolute hidden h-full w-[160px] shrink-0 lg:-right-[143px] 3xl:flex'>
            <div
              className='sticky top-[5.375rem] z-50'
              style={{
                height: '250px',
                width: '160px',
              }}
            >
              <AdComponentVertical />
            </div>
          </div>
        )}
      </div>
      <PlayerStatsPopUpContentContainer></PlayerStatsPopUpContentContainer>
      <Footer />
      {hasMBStickyFooter && <MbStickyFooter />}
      {!isDesktop && (
        <DrawerMenu setIsOpen={setShowDrawer} isOpen={showDrawer} />
      )}
      <ScrollToTopButton></ScrollToTopButton>
      {/* <BottomDrawer /> */}
    </PageContainer>
  );
}

export const PageContainer = tw.div`
  flex
  min-h-screen
  flex-col
  bg-light-main
  dark:bg-dark-main
  text-light-default
  dark:text-dark-text
`;
export const TwMainContentSection = tw.main`bg-light-main w-full
dark:bg-dark-main`;
