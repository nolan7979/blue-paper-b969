import BoxScore from 'public/svg/box-score.svg';
import ChatSVG from 'public/svg/chat.svg';
import DetailSVG from 'public/svg/details.svg';
import H2HSVG from 'public/svg/h2h.svg';
import StandingsSVG from 'public/svg/standings.svg';

import { TwFilterButtonV2 } from '@/components/buttons';

import Transition from '@/components/common/Transition';
import QuickViewTabFilterSkeleton from '@/components/common/skeleton/quickview/QuickViewTabFilterSkeleton';
import { IQuickViewFilterProps } from '@/models/page/matchDetails';
import { isMatchHaveStatBkb } from '@/utils';

export const QuickViewFilter = ({
  activeTab,
  setActiveTab,
  status,
  has_standing,
  has_player_stats,
  lineup,
  isHaveData,
  hasBoxScore,
}: IQuickViewFilterProps) => {
  if (!isHaveData) return <QuickViewTabFilterSkeleton />;

  return (
    <Transition duration={0.5}>
      <div className='flex w-full gap-x-2.5 overflow-scroll dark:bg-dark-main lg:no-scrollbar bg-white lg:bg-light-main'>
        <TwFilterButtonV2
          testId='btnDetail'
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'details'}
          onClick={() => setActiveTab('details')}
          icon={<DetailSVG className='h-6 w-6' />}
        />
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
        {hasBoxScore && (
          <TwFilterButtonV2
            testId='btnBoxScore'
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'box-score'}
            onClick={() => setActiveTab('box-score')}
            icon={<BoxScore className='h-6 w-6' />}
          />
        )}

        {has_standing && (
          <TwFilterButtonV2
            testId='btnStandings'
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'standings'}
            icon={<StandingsSVG className='h-6 w-6' />}
            onClick={() => setActiveTab('standings')}
          />
        )}
        {/*
        {isMatchHaveStatBB(status?.code) && (
          <TwFilterButtonV2
            testId='btnStats'
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'stats'}
            onClick={() => setActiveTab('stats')}
            icon={<StatsSVG className='h-6 w-6' />}
          />
        )}
        */}
      </div>
    </Transition>
  );
};
