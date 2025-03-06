import MatchIcon from 'public/svg/MatchIcon.svg';
import DetailSVG from 'public/svg/details.svg';
import H2HSVG from 'public/svg/h2h.svg';

import { TwFilterButtonV2 } from '@/components/buttons';

import Transition from '@/components/common/Transition';
import { IQuickViewFilterProps } from '@/models/page/matchDetails';

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
      <div className='lg:no-scrollbar flex w-full gap-x-2.5 overflow-scroll dark:bg-dark-main bg-white lg:bg-transparent'>
        <TwFilterButtonV2
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'details'}
          onClick={() => setActiveTab('details')}
          icon={<DetailSVG className='h-6 w-6' />}
        />
        {/* <TwFilterButtonV2
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'standings'}
          icon={<StandingsSVG className='h-6 w-6' />}
          onClick={() => setActiveTab('standings')}
        /> */}
        <TwFilterButtonV2
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'matchtop'}
          onClick={() => setActiveTab('matchtop')}
          icon={<MatchIcon className='h-6 w-6' />}
        />
        <TwFilterButtonV2
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'matches'}
          onClick={() => setActiveTab('matches')}
          icon={<H2HSVG className='h-6 w-6' />}
        />
      </div>
    </Transition>
  );
};
