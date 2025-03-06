import MatchIcon from 'public/svg/MatchIcon.svg';
import ChatSVG from 'public/svg/chat.svg';
import DetailSVG from 'public/svg/details.svg';
import H2HSVG from 'public/svg/h2h.svg';
import StatsSVG from 'public/svg/stats.svg';

import { TwFilterButtonV2 } from '@/components/buttons';

import Transition from '@/components/common/Transition';
import { IQuickViewFilterProps } from '@/models/page/matchDetails';
import { isMatchHaveStatTableTennis } from '@/utils/tableTennisUtils';

export const QuickViewFilter = ({
  activeTab,
  setActiveTab,
  status,
  has_standing,
  has_player_stats,
  lineup,
  isHaveData,
}: IQuickViewFilterProps) => {
  // if (!isHaveData) return <QuickViewTabFilterSkeleton />;

  return (
    <Transition duration={0.5}>
      <div className='flex w-full gap-x-2.5 overflow-scroll dark:bg-dark-main lg:no-scrollbar'>
        <TwFilterButtonV2
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'details'}
          onClick={() => setActiveTab('details')}
          icon={<DetailSVG className='h-6 w-6' />}
        />
        {isMatchHaveStatTableTennis(status?.code) && (
          <TwFilterButtonV2
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'stats'}
            onClick={() => setActiveTab('stats')}
            icon={<StatsSVG className='h-6 w-6' />}
          />
        )}
        <TwFilterButtonV2
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'matches'}
          onClick={() => setActiveTab('matches')}
          icon={<H2HSVG className='h-6 w-6' />}
        />
        <TwFilterButtonV2
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'cupTree'}
          onClick={() => setActiveTab('cupTree')}
          icon={<MatchIcon className='h-6 w-6' />}
        />
        <TwFilterButtonV2
          testId='btnChat'
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'chat'}
          onClick={() => setActiveTab('chat')}
          icon={<ChatSVG className='h-6 w-6' />}
        />
      </div>
    </Transition>
  );
};
