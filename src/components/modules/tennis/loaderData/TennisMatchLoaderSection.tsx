import { useEffect, useState } from 'react';

import { useTopLeagues } from '@/hooks/useCommon';


import { useHomeStore } from '@/stores';

import { SPORT } from '@/constant/common';

export const TennisMatchLoaderSection = ({ page }: { page: string }) => {
  const { setTopLeagues } = useHomeStore();
  const { data: topLeagues } = useTopLeagues(SPORT.TENNIS);

  const [focusKey, setFocusKey] = useState(0);

  // Add an event listener for window focus
  useEffect(() => {
    const handleFocus = () => {
      setFocusKey((prevKey) => prevKey + 1);
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    if(topLeagues){
      setTopLeagues(topLeagues);
    }
  }, [topLeagues,  focusKey]);

  return <></>;
};
