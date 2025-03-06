import { TwFilterButtonV2 } from '@/components/buttons';
import Transition from '@/components/common/Transition';
import useTrans from '@/hooks/useTrans';
import { memo } from 'react';

interface IFavoriteFilter {
  activeTab: string;
  setActiveTab: (x: string) => void;
}

export const FavoriteFilter = memo(({
  activeTab,
  setActiveTab,
}: IFavoriteFilter) => {
  const i18n = useTrans();

  return (
    <Transition duration={0.5}>
      <div
        className='flex w-full gap-x-2.5 overflow-scrolllg:no-scrollbar border-b border-line-default dark:border-light-darkGray'
        test-id='tabs'
      >
        <TwFilterButtonV2
          key={i18n.filter.match}
          testId='btnMatch'
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'match'}
          onClick={() => setActiveTab('match')}
        >{i18n.filter.match}</TwFilterButtonV2>
        <TwFilterButtonV2
          key={i18n.qv.team}
          testId='btnTeam'
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'team'}
          onClick={() => setActiveTab('team')}
        >{i18n.qv.team}</TwFilterButtonV2>
        <TwFilterButtonV2
          key={i18n.filter.tournament}
          testId='btnLeague'
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'league'}
          onClick={() => setActiveTab('league')}
        >{i18n.filter.tournament}</TwFilterButtonV2>
        <TwFilterButtonV2
          key={i18n.titles.player}
          testId='btnPlayer'
          className='w-full whitespace-nowrap'
          isActive={activeTab === 'player'}
          onClick={() => setActiveTab('player')}
        >{i18n.titles.player}</TwFilterButtonV2>
      </div>
    </Transition>
  );
}, (prevProps, nextProps) => {
  return prevProps.activeTab === nextProps.activeTab
});
