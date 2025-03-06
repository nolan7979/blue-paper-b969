import ChatSVG from 'public/svg/chat.svg';
import DetailSVG from 'public/svg/details.svg';
import H2HSVG from 'public/svg/h2h.svg';
import LineupsSVG from 'public/svg/lineups.svg';
import StandingsSVG from 'public/svg/standings.svg';

import { TwFilterButtonV2 } from '@/components/buttons';
import QuickViewTabFilterSkeleton from '@/components/common/skeleton/quickview/QuickViewTabFilterSkeleton';
import Transition from '@/components/common/Transition';

import { IQuickViewFilterProps } from '@/models/page/matchDetails';
import { useEffect, useMemo, useState } from 'react';
import { memo } from 'react';

export const QuickViewFilter = memo(
  ({
    activeTab,
    setActiveTab,
    status,
    has_standing,
    has_player_stats,
    lineup,
    isHaveData,
    hasHighlight,
    has_lineup
  }: IQuickViewFilterProps | any) => {
    const isLoading = useMemo(() => !isHaveData, [isHaveData]);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
      setIsMounted(true);
    }, []);

    if (!isMounted) {
      return null; // Or return a skeleton/loading state
    }

    if (isLoading) {
      return (
        <div>
          <QuickViewTabFilterSkeleton />
        </div>
      );
    }

    return (
      <Transition duration={0.5}>
        <div
          className='flex w-full gap-x-2.5 overflow-scroll dark:bg-dark-main lg:no-scrollbar bg-white lg:bg-light-main'
          test-id='tabs'
        >
          <TwFilterButtonV2
            testId='btnDetails'
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'details'}
            onClick={() => setActiveTab('details')}
            icon={<DetailSVG className='h-6 w-6' />}
          />
          {has_lineup && <TwFilterButtonV2
            testId='btnSquad'
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'squad'}
            onClick={() => setActiveTab('squad')}
            icon={<LineupsSVG className='h-6 w-6' />}
          />}
          <TwFilterButtonV2
            testId='btnMatches'
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'matches'}
            onClick={() => setActiveTab('matches')}
            icon={<H2HSVG className='h-6 w-6' />}
          />
          <TwFilterButtonV2
            testId='btnChat'
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'chat'}
            onClick={() => setActiveTab('chat')}
            icon={<ChatSVG className='h-6 w-6' />}
          />

          <TwFilterButtonV2
            testId='btnStandings'
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'standings'}
            icon={<StandingsSVG className='h-6 w-6' />}
            onClick={() => setActiveTab('standings')}
          />
        </div>
      </Transition>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps?.activeTab === nextProps.activeTab &&
      prevProps?.isHaveData === nextProps.isHaveData &&
      prevProps?.has_standing === nextProps.has_standing &&
      prevProps?.has_player_stats === nextProps.has_player_stats &&
      prevProps?.hasHighlight === nextProps.hasHighlight
    );
  }
);
