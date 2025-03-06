import { TopLeauges } from '@/components/modules/football/filters/FilterColumn';
import {
  TwCard,
  TwFilterTitle,
} from '@/components/modules/football/tw-components';
import { ILanguageKey } from '@/constant/leagues/hotLeaguesFootball';
import { useSortedTopLeagues } from '@/hooks/useCommon';
import { useTopLeagues } from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';
import { useHomeStore } from '@/stores';
import { isEqual } from 'lodash';
import { useEffect } from 'react';

export const footballLeagues = [
  {
    href: '/football/standings/asia/v-league/626',
    src: '/images/football/leagues/v-league.webp',
    alt: 'V-League',
    id: 'v-league',
  },
  {
    href: '/football/standings/world/world-championship/16',
    src: '/images/football/leagues/world-championship.webp',
    alt: 'World Cup',
    id: 'world-cup',
  },
  {
    href: '/football/standings/europe/uefa-champions-league/7',
    src: '/images/football/leagues/uefa-champions-league.webp',
    alt: 'UEFA Champions League',
    id: 'champions-league',
  },
  {
    href: '/football/standings/europe/uefa-europa-league/679',
    src: '/images/football/leagues/uefa-europa-league.webp',
    alt: 'UEFA Europa League',
    id: 'euroupe-league',
  },
  {
    href: '/football/standings/england/premier-league/17',
    src: '/images/football/leagues/premier-league.webp',
    alt: 'Premier League',
    id: 'premier-league',
  },
  {
    href: '/football/standings/spain/laliga/8',
    src: '/images/football/leagues/laliga.webp',
    alt: 'LaLiga',
    id: 'laliga',
  },
  {
    href: '/football/standings/germany/bundesliga/35',
    src: '/images/football/leagues/bundesliga.webp',
    alt: 'Bundesliga',
    id: 'bundesliga',
  },
  {
    href: '/football/standings/italy/serie-a/23',
    src: '/images/football/leagues/serie-a.webp',
    alt: 'Serie A',
    id: 'seria',
  },
  {
    href: '/football/standings/japan/j1-league/196',
    src: '/images/football/leagues/j1-league.webp',
    alt: 'J1 League',
    id: 'j1-league',
  },
];

export function Subcategory({ category, data }: { category: any; data: any }) {
  const i18n = useTrans();
  const {  setTopLeagues } = useHomeStore();
  const { data: topLeagues } = useTopLeagues();

  const countryLocal: ILanguageKey = (i18n.language as ILanguageKey) ?? 'en';
  const sortedTopLeagues = useSortedTopLeagues(topLeagues, countryLocal);

  useEffect(() => {
    if (!isEqual(sortedTopLeagues, topLeagues)) {
      setTopLeagues(sortedTopLeagues);
    }
  }, [sortedTopLeagues, topLeagues]);

  return (
    <>
      <TwCard className='py-2'>
        <TwFilterTitle className='font-oswald'>
          {i18n.home.top_league}
        </TwFilterTitle>
        <TopLeauges leagues={sortedTopLeagues}  sport='football'/>
      </TwCard>
      {/* <TwCard className='py-2'>
        <TwFilterTitle className=''>
          {category?.name} {i18n.article.footballToday}
        </TwFilterTitle>
        <OddsPredTopLeauges category={data} parentCate={category?.slug} />
      </TwCard> */}
    </>
  );
}
