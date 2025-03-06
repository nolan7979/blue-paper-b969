import { useQuery } from '@tanstack/react-query';
import { useWindowSize } from '@/hooks/useWindowSize';
import axios from 'axios';
import { useEffect, useState } from 'react';

export enum Device {
  mobile = 'mobile',
  desktop = 'desktop',
}

export const useDetectDevice = () => {
  const [deviceType, setDeviceType] = useState<keyof typeof Device | null>(
    null
  );
  const { width } = useWindowSize();
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;

    if (/Mobi|Android/i.test(userAgent)) {
      setDeviceType('mobile');
    } else {
      setDeviceType('desktop');
    }
  }, [width]);

  return deviceType;
};

const fetchDetectedCountry = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/country/alpha2`,
    headers: {},
  };

  return await axios
    .request(config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      throw Error(error?.message);
    });
};

export const useDetectedCountry = (shouldFetch: boolean) => {
  return useQuery({
    queryKey: ['detect_country'],
    queryFn: () => fetchDetectedCountry(),
    cacheTime: 6000000,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: shouldFetch || false,
  });
};
