import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { SPORT } from '@/constant/common';

export const useSportName = () => {
  const router = useRouter();

  const sportMapping: { [key: string]: string } = {
    '/basketball': SPORT.BASKETBALL,
    '/tennis': SPORT.TENNIS,
    '/volleyball': SPORT.VOLLEYBALL,
    '/badminton': SPORT.BADMINTON,
    '/baseball': SPORT.BASEBALL,
    '/am-football': SPORT.AMERICAN_FOOTBALL,
    '/cricket': SPORT.CRICKET,
    '/hockey': SPORT.ICE_HOCKEY,
    '/table-tennis': SPORT.TABLE_TENNIS,
    '/snooker': SPORT.SNOOKER,
  };

  const sportName = useMemo(() => {
    for (const path in sportMapping) {
      if (router.pathname.startsWith(path)) {
        return sportMapping[path];
      }
    }
    return SPORT.FOOTBALL;
  }, [router.pathname]);

  return sportName;
};
