import clsx from 'clsx';
import React, { memo, useEffect, useState } from 'react';

import { TwButtonIcon } from '@/components/buttons/IconButton';

import { useFilterStore, useHomeStore } from '@/stores';
import { useEventCountStore } from '@/stores/event-count';

import { PAGE, SPORT } from '@/constant/common';

import { useAllEventCounter } from '@/hooks/useCommon';
import useTrans from '@/hooks/useTrans';
import FinishedIconSVG from '/public/svg/finished.svg';
import HomeIconSVG from '/public/svg/home.svg';
import LiveIconSVG from '/public/svg/live.svg';

export const MatchFilterCountry = React.memo(
  ({ page, sport = SPORT.FOOTBALL }: { page?: PAGE; sport: string }) => {
    const i18n = useTrans();
    const isHidden = page !== PAGE.results;
    const { eventNumber } = useEventCountStore();
    const { setAllEventCount } = useHomeStore();

    const [numOfLive, setNumOfLive] = useState<number>(eventNumber || 0);
    const [isClient, setIsClient] = useState(false);

    const { matchTypeFilter, setMatchFilter } = useFilterStore();

    const { data: allEventData } = useAllEventCounter();
    // const ChangeLoadMoreMatches = useCallback(setLoadMoreMatches, [
    //   setLoadMoreMatches,
    // ]);
    useEffect(() => {
      if (allEventData) {
        // @ts-ignore: Unreachable code error
        setAllEventCount(allEventData);
        setNumOfLive(allEventData[`${sport.replace('-', '_')}_live`]);
      }
    }, [allEventData]);

    useEffect(() => {
      setIsClient(true);
    }, []);

    return (
      <MemoMainMatchFilter
        matchTypeFilter={matchTypeFilter}
        setMatchFilter={setMatchFilter}
        i18n={i18n}
        isHidden={isHidden}
        numOfLive={numOfLive}
        isClient={isClient}
      />
    );
  },
  (prevProps, prevNext) => {
    return (
      prevProps?.page === prevNext?.page && prevProps?.sport === prevNext?.sport
    );
  }
);

interface MemoMainMatchFilterProps {
  matchTypeFilter: string;
  setMatchFilter: (event: string) => void;
  i18n: any;
  isHidden: boolean;
  numOfLive: number;
  isClient: boolean;
}
const MemoMainMatchFilter: React.FC<MemoMainMatchFilterProps> = memo(
  ({
    matchTypeFilter,
    setMatchFilter,
    i18n,
    isHidden,
    numOfLive,
    isClient,
  }) => {
    return (
      <div className='flex w-full items-center justify-between gap-2 px-1 xl:gap-4 xl:px-2'>
        <div className='flex items-end justify-center gap-4 overflow-x-auto no-scrollbar'>
          <TwButtonIcon
            testId='btnAll'
            isActive={matchTypeFilter === 'all'}
            onClick={() => setMatchFilter('all')}
            icon={
              <HomeIconSVG
                className={clsx('h-4 w-5', {
                  'dark:fill-white': matchTypeFilter === 'all',
                })}
              />
            }
            className='py-2'
          >
            <span className='py-1'>{i18n.filter.all}</span>
          </TwButtonIcon>
          {isHidden && (
            <TwButtonIcon
              testId='btnLiveScore'
              isActive={matchTypeFilter === 'live'}
              onClick={() => {
                setMatchFilter('live');
                // setLoadMoreMatches(false);
              }}
              icon={<LiveIconSVG className='h-5 w-5  fill-live-score' />}
            >
              <span className='min-w-[75px] rounded-md bg-live-score py-1 text-white'>
                {i18n.filter.live}
                {numOfLive > -1 && isClient ? ` (${numOfLive})` : ``}
              </span>
            </TwButtonIcon>
          )}
          {/* <TwButtonIcon
            testId='btnHot'
            isActive={matchTypeFilter === 'hot'}
            onClick={() => setMatchFilter('hot')}
            icon={
              <HotIconSVG
                className={clsx('h-4 w-5', {
                  'dark:fill-white': matchTypeFilter === 'hot',
                })}
              />
            }
          >
            <span className='py-1'>{i18n.filter.hot}</span>
          </TwButtonIcon> */}
          {isHidden && (
            <TwButtonIcon
              testId='btnFinished'
              isActive={matchTypeFilter === 'finished'}
              onClick={() => setMatchFilter('finished')}
              icon={
                <FinishedIconSVG
                  className={clsx('h-4 w-5', {
                    'dark:fill-white': matchTypeFilter === 'finished',
                  })}
                />
              }
            >
              <span className='py-1'>{i18n.filter.finished}</span>
            </TwButtonIcon>
          )}
        </div>
        {/* <SortOptions /> */}
      </div>
    );
  },
  (prevProps, prevNext) => {
    return (
      prevProps?.matchTypeFilter === prevNext?.matchTypeFilter &&
      prevProps?.setMatchFilter === prevNext?.setMatchFilter &&
      prevProps?.i18n === prevNext?.i18n &&
      prevProps?.isHidden === prevNext?.isHidden &&
      prevProps?.numOfLive === prevNext?.numOfLive &&
      prevProps?.isClient === prevNext?.isClient
    );
  }
);
