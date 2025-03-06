import MatchIcon from 'public/svg/MatchIcon.svg';
import DetailSVG from 'public/svg/details.svg';
import LineupsSVG from 'public/svg/lineups.svg';
import StandingsSVG from 'public/svg/standings.svg';
import StatsSVG from 'public/svg/stats.svg';
import TopTitle from 'public/svg/top-title.svg';

import { TwFilterButtonV2 } from '@/components/buttons';

import Transition from '@/components/common/Transition';

export const TabViewFilterMobile = ({
  activeTab,
  setActiveTab,
  hasTopPlayers,
  hasTopStats,
  hasTopTeams,
}: {
  activeTab: string;
  setActiveTab: (x: string) => void;
  hasTopPlayers?: boolean;
  hasTopStats?: boolean;
  hasTopTeams?: boolean;
}) => {
  // if (!isHaveData) return <QuickViewTabFilterSkeleton />;


  return (
    <Transition duration={0.5}>
      <div className='flex w-full gap-x-2.5 overflow-scroll bg-white dark:bg-dark-main lg:no-scrollbar'>
        <TwFilterButtonV2
          testId='btnDetails'
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'details'}
          onClick={() => setActiveTab('details')}
          icon={<DetailSVG className='h-6 w-6' />}
        />
        <TwFilterButtonV2
          testId='btnSquad'
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'standings'}
          onClick={() => setActiveTab('standings')}
          icon={<StandingsSVG className='h-6 w-6' />}
        />
        <TwFilterButtonV2
          testId='btnMatches'
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'matches'}
          onClick={() => setActiveTab('matches')}
          icon={<MatchIcon className='h-6 w-6' />}
        />
        {hasTopPlayers && (
          <TwFilterButtonV2
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'top-title'}
            onClick={() => setActiveTab('top-title')}
            icon={<TopTitle className='h-6 w-6' />}
          />
        )}
        {hasTopStats && (
          <TwFilterButtonV2
            testId='btnStats'
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'stats'}
            onClick={() => setActiveTab('stats')}
            icon={<StatsSVG className='h-6 w-6' />}
          />
        )}
        {hasTopTeams && (
          <TwFilterButtonV2
            testId='btnStandings'
            className='w-full whitespace-nowrap'
            isActive={activeTab === 'player'}
            icon={<LineupsSVG className='h-6 w-6' />}
            onClick={() => setActiveTab('player')}
          />
        )}
      </div>
    </Transition>
  );
};
