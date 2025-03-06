import useTrans from '@/hooks/useTrans';

import { TwFilterButton } from '@/components/modules/cricket/tw-components';

import { useFilterStore } from '@/stores';

export const FilterPlayer = () => {
  const i18n = useTrans();
  const { playerFilter, setPlayerFilter } = useFilterStore();

  return (
    <div className='flex gap-4'>
      <TwFilterButton
        isActive={playerFilter === 'player-lineup'}
        onClick={() => setPlayerFilter('player-lineup')}
      >
        {i18n.tab.squad}
      </TwFilterButton>
      <TwFilterButton
        isActive={playerFilter === 'player-stats'}
        onClick={() => setPlayerFilter('player-stats')}
      >
        {i18n.tab.player_stats}
      </TwFilterButton>
    </div>
  );
};
