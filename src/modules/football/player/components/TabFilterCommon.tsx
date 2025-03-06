import MatchIcon from 'public/svg/MatchIcon.svg';
import DetailSVG from 'public/svg/details.svg';
import LineupsSVG from 'public/svg/lineups.svg';
import StandingsSVG from 'public/svg/standings.svg';
import StatsSVG from 'public/svg/stats.svg';
import TopTitle from 'public/svg/top-title.svg';

import { TwFilterButtonV2 } from '@/components/buttons';

import Transition from '@/components/common/Transition';

interface ITabCommon {
  activeTab: string;
  setActiveTab: (x:string) => void;
  details?: boolean;
  matches?: boolean;
  stats?: boolean;
  player?: boolean;
  topTitle?: boolean;
  standings?: boolean;
}

export const TabFilterCommon = ({
  activeTab,
  setActiveTab,
  details,
  matches,
  stats,
  player,
  topTitle,
  standings,
}: ITabCommon) => {
  // if (!isHaveData) return <QuickViewTabFilterSkeleton />;

  return (
    <Transition duration={0.5}>
      <div className='flex w-full gap-x-2.5 overflow-scroll bg-white dark:bg-dark-main no-scrollbar'>
        {details && (
          <TwFilterButtonV2
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'details'}
            onClick={() => setActiveTab('details')}
            icon={<DetailSVG className='h-6 w-6' />}
          />
        )}
        {stats && (
          <TwFilterButtonV2
            className='w-full whitespace-nowrap '
            isActive={activeTab === 'stats'}
            onClick={() => setActiveTab('stats')}
            icon={<StatsSVG className='h-6 w-6' />}
          />
        )}
        {matches && (
          <TwFilterButtonV2
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'matches'}
            onClick={() => setActiveTab('matches')}
            icon={<MatchIcon className='h-6 w-6' />}
          />
        )}
        {player && (
          <TwFilterButtonV2
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'player'}
            icon={<LineupsSVG className='h-6 w-6' />}
            onClick={() => setActiveTab('player')}
          />
        )}
        {topTitle && (
          <TwFilterButtonV2
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'top-title'}
            onClick={() => setActiveTab('top-title')}
            icon={<TopTitle className='h-5 w-5' />}
          />
        )}
        {standings && (
          <TwFilterButtonV2
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'standings'}
            onClick={() => setActiveTab('standings')}
            icon={<StandingsSVG className='h-6 w-6' />}
          />
        )}
      </div>
    </Transition>
  );
};
