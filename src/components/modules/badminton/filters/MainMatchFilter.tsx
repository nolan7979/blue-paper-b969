import clsx from 'clsx';
import { useEffect, useState } from 'react';
import useTrans from '@/hooks/useTrans';
import { TwButtonIcon } from '@/components/buttons/IconButton';
import SortOptions from '@/components/modules/football/filters/SortOptions';
import { useFilterStore, useHomeStore, useMatchStore } from '@/stores';
import { useEventCountStore } from '@/stores/event-count';
import { PAGE } from '@/constant/common';
import FinishedIconSVG from '/public/svg/finished.svg';
import HomeIconSVG from '/public/svg/home.svg';
import HotIconSVG from '/public/svg/hot_v2.svg';
import LiveIconSVG from '/public/svg/live.svg';
import { useEventCounter } from '@/hooks/useBadminton';
import { useAllEventCounter } from '@/hooks/useCommon';
import { useSportName } from '@/hooks';
// import { useEventCounter } from '@/hooks/useTennis';

export const MainMatchFilter = ({ page }: { page?: string }) => {
  const i18n = useTrans();
  const sport = useSportName();
  const isHidden = page !== PAGE.results;
  const { eventNumber } = useEventCountStore();
  const { setAllEventCount } = useHomeStore();

  const [numOfLive, setNumOfLive] = useState<number>(eventNumber || 0);
  const [isClient, setIsClient] = useState(false);

  const { matchTypeFilter, setMatchFilter } = useFilterStore();
  // Todo: update useEventCounter for badminton
  const { data: allEventData } = useAllEventCounter();
  const { setLoadMoreMatches } = useMatchStore();



  useEffect(() => {
    setIsClient(true);
  }, []);


  useEffect(() => {
    if (allEventData && setAllEventCount) {
      setAllEventCount(allEventData);
      setNumOfLive(allEventData[`${sport.replace('-', '_')}_live`]);
    }
  }, [allEventData, sport]);

  return (
    <div className='flex w-full items-center justify-between gap-2 px-1 py-1 xl:gap-4 xl:px-2'>
      <div className='no-scrollbar flex gap-4 overflow-x-auto'>
        <TwButtonIcon
          isActive={matchTypeFilter === 'all'}
          onClick={() => setMatchFilter('all')}
          icon={
            <HomeIconSVG
              className={clsx('h-4 w-5', {
                'dark:fill-white': matchTypeFilter === 'all',
              })}
            />
          }
          className=''
        >
          {i18n.filter.all}
        </TwButtonIcon>
        {isHidden && (
          <TwButtonIcon
            isActive={matchTypeFilter === 'live'}
            onClick={() => {
              setMatchFilter('live');
              setLoadMoreMatches(false);
            }}
            icon={<LiveIconSVG className='h-5 w-5  fill-live-score' />}
            className=''
          >
            <span className=' rounded-md bg-live-score p-2 py-1 text-white'>
              {i18n.filter.live}
              {numOfLive > -1 && isClient ? ` (${numOfLive})` : ``}
            </span>
          </TwButtonIcon>
        )}
        <TwButtonIcon
          isActive={matchTypeFilter === 'hot'}
          onClick={() => setMatchFilter('hot')}
          icon={
            <HotIconSVG
              className={clsx('h-4 w-5', {
                'dark:fill-white': matchTypeFilter === 'hot',
              })}
            />
          }
          className=''
        >
          {i18n.filter.hot}
        </TwButtonIcon>
        {isHidden && (
          <TwButtonIcon
            isActive={matchTypeFilter === 'finished'}
            onClick={() => setMatchFilter('finished')}
            icon={
              <FinishedIconSVG
                className={clsx('h-4 w-5', {
                  'dark:fill-white': matchTypeFilter === 'finished',
                })}
              />
            }
            className=''
          >
            {i18n.filter.finished}
          </TwButtonIcon>
        )}
      </div>
      <SortOptions />
    </div>
  );
};
