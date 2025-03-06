/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import { development, development_local } from '@/constant/common';

export const useConvertPath = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);

  const hostName =
    isClient && window.location.origin ? window.location.origin : '';

  const renderParam = useMemo(() => {
    if (Object.keys(router.query).length > 0) {
      const { cnz } = router.query;

      return cnz && cnz === '1' && 'vn';
    }
    return null;
  }, [router.query, hostName]);

  const renderPath = useMemo(() => {
    const getEnvHost = hostName.split('.');

    const path = getEnvHost.filter(
      (item) => item.includes('vn') || item.includes('com')
    );

    if (
      hostName.includes(development) ||
      hostName.includes(development_local)
    ) {
      // return 'com' //todo change return show Odds
      return 'development';
    }

    return (path.length > 0 && path[0]?.replace('/', '')) || 'vn';
  }, [hostName]);

  return (renderParam || renderPath).toLowerCase();
};
