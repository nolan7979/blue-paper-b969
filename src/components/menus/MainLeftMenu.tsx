import MenuItem from '@/components/menus/MenuItem';
import useTrans from '@/hooks/useTrans';
import { useFilterStore } from '@/stores';
import IconFixtures from 'public/svg/tab-fixtures.svg';
import IconResult from 'public/svg/tab-results.svg';
import tw from 'twin.macro';

export function MainLeftMenu({ sport, testId }: { sport: string, testId?: string }) {
  const i18n = useTrans();
  const { resetMatchFilter } = useFilterStore();

  return (
    <div className='hidden lg:block' test-id={testId}>
      <ul className='flex flex-col gap-1'>
        <MenuItem
          href={sport === 'football' ? '/' : `/${sport}`}
          className='font-oswald'
          name='Live score'
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
      </ul>
    </div>
  );
}

export const TwFootballMenu = tw.div`
  bg-light
  dark:bg-dark-hl-3
  text-light-default
  dark:text-dark-default
`;

export const TwDesktopMenu = tw.ul`
  hidden
  lg:(flex)
  xl:(flex flex-wrap)  // TODO scrollable
  // font-oswald
  not-italic
  font-medium
  text-sm
  leading-5
  tracking-wide
  uppercase
`;

export const TwMobileMenu = tw.ul`
  flex
  // flex-wrap  // TODO scrollable
  lg:hidden
  // not-italic
  // font-medium 
  // text-xss
  text-sm
  leading-5
`;
