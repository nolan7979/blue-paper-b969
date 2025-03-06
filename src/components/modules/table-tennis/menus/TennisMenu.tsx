import MenuItem from '@/components/menus/MenuItem';
import { MenuHeaderPath } from '@/constant/paths';
import useTrans from '@/hooks/useTrans';
import { useFilterStore } from '@/stores';
import { useRouter } from 'next/router';
import IconFixtures from 'public/svg/tab-fixtures.svg';
import IconResult from 'public/svg/tab-results.svg';
import IconScore from 'public/svg/tab-score.svg';
import IconStandings from 'public/svg/tab-standings.svg';
import { useMemo } from 'react';

export function TennisMenu() {
  const i18n = useTrans();
  const { locale } = useRouter();
  const { resetMatchFilter } = useFilterStore();

  const renderStandingHref = useMemo(() => {
    return locale === 'pt-BR'
      ? MenuHeaderPath.standings
      : MenuHeaderPath.standings_normal;
  }, [locale]);

  return (
    <section>
      <ul className='flex flex-col gap-1'>
        <MenuItem
          href='/tennis'
          className='font-oswald'
          name={'Live score'}
          icon={IconStandings}
          onClick={() => resetMatchFilter()}
        />
        <MenuItem
          href='/tennis/results'
          className='font-oswald'
          name={i18n.menu.results}
          icon={IconResult}
          onClick={() => resetMatchFilter()}
        />
        <MenuItem
          href='/tennis/fixtures'
          className='font-oswald'
          name={i18n.menu.schedule}
          icon={IconFixtures}
          onClick={() => resetMatchFilter()}
        />

        {/* <MenuItem
          href={renderStandingHref}
          className='font-oswald'
          name={i18n.menu.standings}
          icon={IconScore}
          onClick={() => resetMatchFilter()}
        /> */}
      </ul>
    </section>
  );
}
