import DetailSVG from 'public/svg/details.svg';
import TopTitle from 'public/svg/top-title.svg';
import H2HSVG from 'public/svg/h2h.svg';
import LineupsSVG from 'public/svg/lineups.svg';
import StandingsSVG from 'public/svg/standings.svg';
import MatchIcon from 'public/svg/MatchIcon.svg';

import { TwFilterButtonV2 } from '@/components/buttons';

import Transition from '@/components/common/Transition';

export const TabViewFilterMobile = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (x:string) => void;
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
        <TwFilterButtonV2
          testId='btnMatches'
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'cup-tree'}
          onClick={() => setActiveTab('cup-tree')}
          icon={<H2HSVG className='h-6 w-6' />}
        />
        <TwFilterButtonV2
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'top-player'}
          onClick={() => setActiveTab('top-player')}
          icon={<TopTitle className='h-6 w-6' />}
        />
        <TwFilterButtonV2
          testId='btnStandings'
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'top-team'}
          icon={<LineupsSVG className='h-6 w-6' />}
          onClick={() => setActiveTab('top-team')}
        />
      </div>
    </Transition>
  );
};
