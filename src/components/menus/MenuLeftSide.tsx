import IconFixtures from 'public/svg/tab-fixtures.svg';
import IconResult from 'public/svg/tab-results.svg';

import useTrans from '@/hooks/useTrans';

import MenuItem from '@/components/menus/MenuItem';

import { useFilterStore } from '@/stores';

export const MenuLeftSide = ({ sport }: { sport: string }) => {
  const i18n = useTrans();
  const { resetMatchFilter } = useFilterStore();

  return (
    <section className='mt-2'>
      <ul className='flex flex-col gap-1'>
        <MenuItem
          href={`/${sport}`}
          className='font-oswald'
          name='Live score'
          // icon={IconStandings}
          onClick={() => resetMatchFilter()}
        />
        <MenuItem
          href={`/${sport}/results`}
          className='font-oswald'
          name={i18n.menu.results}
          icon={IconResult}
          onClick={() => resetMatchFilter()}
        />
        <MenuItem
          href={`/${sport}/fixtures`}
          className='font-oswald'
          name={i18n.menu.schedule}
          icon={IconFixtures}
          onClick={() => resetMatchFilter()}
        />
        {/* <MenuItem
          href={`/${sport}/standings`}
          className='font-oswald'
          name={i18n.menu.standings}
          icon={IconScore}
          onClick={() => resetMatchFilter()}
        /> */}
      </ul>
    </section>
  );
};
