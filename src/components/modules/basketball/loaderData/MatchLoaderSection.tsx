import { useEffect, useMemo } from 'react';

import useTrans from '@/hooks/useTrans';


import { useHomeStore } from '@/stores';

import { useTopLeagues as useTopLeaguesBkb } from '@/hooks/useBasketball';

export const MatchLoaderSection = ({
  page,
  sport,
}: {
  page: string;
  sport: string;
}) => {
  const i18n = useTrans();
  const { setTopLeagues } = useHomeStore();
  const { data: topLeagues } = useTopLeaguesBkb();
  // const [focusKey, setFocusKey] = useState(0);

  // // Add an event listener for window focus
  // useEffect(() => {
  //   const handleFocus = () => {
  //     setFocusKey((prevKey) => prevKey + 1);
  //   };
  //   window.addEventListener('focus', handleFocus);

  //   return () => {
  //     window.removeEventListener('focus', handleFocus);
  //   };
  // }, []);
  const topLeaguesData = useMemo(() => topLeagues, [topLeagues])

  useEffect(() => {
    if (topLeaguesData) setTopLeagues(topLeaguesData);
  }, [
    topLeaguesData, setTopLeagues,
    i18n.language,
    sport,
  ]);

  return <></>;
};
