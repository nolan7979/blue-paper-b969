import WeekView from '@/components/filters/WeekFilter';
import { MainMatchFilter } from '@/components/layout/MainMatchFilter';
import { MatchListHeader as ListHeaderFootball } from '@/components/modules/football';
import { MatchListHeader as ListHeaderSnooker } from '@/components/modules/snooker';
import { PAGE, SPORT } from '@/constant/common';
import useDeviceOrientation from '@/hooks/useDeviceOrientation';
import { useScrollVisible } from '@/stores/scroll-visible';
import { useFilterStore } from '@/stores';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import {
  useScrollVisibility,
  useScrollVisibilityForRef,
} from '@/hooks/useScrollVisibility';
import { useDevicePerformance } from '@/hooks/useDevicePerformance';

export const MainColHeader: React.FC<{ sport: SPORT; page?: PAGE }> = ({
  sport,
  page,
}) => {
  const isLandscape = useDeviceOrientation();
const isLowPerformance = useDevicePerformance();
  const router = useRouter();
  const { query } = router;
  const getFilter = (query?.qFilter as string) || 'all';

  const isVisible = useScrollVisibility({ isLandscape });
  const { targetRef } = useScrollVisible();
  const IsShow = useScrollVisibilityForRef({
    isLandscape,
    targetRef: targetRef,
  });

  return (
    <>
      <div
        className={clsx(
          'z-[5] flex flex-col justify-between',
          {
            sticky: !isLandscape,
            'top-[53px] z-[21]': !isVisible,
            'top-[53px] !z-[19]': !IsShow,
            'transition-[top] duration-200 ease-in-out':isLowPerformance,
            TopMobiCustom: isVisible && !isLandscape,
            'md:top-[126px]': isVisible && !isLandscape,
            'md:top-[54px]': !isVisible && !isLandscape,
            'lg:relative lg:top-0': true,
          }
        )}
      >
        {getFilter !== 'live' && (
          <div className='flex w-full items-center border-b-[0.5px] bg-white dark:border-primary-mask dark:bg-dark-score lg:hidden'>
            <WeekView />
          </div>
        )}

        <div className='hidden w-full lg:inline-block'>
          <MainMatchFilter sport={sport} page={page} />
        </div>
        <div className='dark:bg-dark-match-header dark:lg:bg-dark-match-header-transparent w-full bg-white shadow-sm lg:bg-transparent lg:shadow-none'>
          {[
            SPORT.TABLE_TENNIS,
            SPORT.TENNIS,
            SPORT.BADMINTON,
            SPORT.SNOOKER,
          ].includes(sport) ? (
            <ListHeaderSnooker />
          ) : (
            <ListHeaderFootball />
          )}
        </div>
      </div>
    </>
  );
};
