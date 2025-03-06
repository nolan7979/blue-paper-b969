import { useState } from 'react';

import { TwFilterButton } from '@/components/modules/football/tw-components';
import LeagueFilterModal from '@/components/modules/football/odds/ty-le-keo/LeagueFilterModal';

import { useFilterStore } from '@/stores';

export const FilterByLeagueBtn = () => {
  const { matchTypeFilter } = useFilterStore();
  const [open, setOpen] = useState(false);

  return (
    <>
      <TwFilterButton
        className=''
        isActive={matchTypeFilter === 'league'}
        onClick={() => setOpen(true)}
      >
        {/* {i18n.filter.hot} */}
        Giải đấu
      </TwFilterButton>
      <LeagueFilterModal open={open} setOpen={setOpen}></LeagueFilterModal>
    </>
  );
};
