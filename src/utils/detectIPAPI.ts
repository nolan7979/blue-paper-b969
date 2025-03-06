import {
  development,
  development_local,
  LOCAL_STORAGE,
} from '@/constant/common';
import { getItem } from '@/utils/localStorageUtils';

export const getAPIDetectedIP = (): string => {
  const getCountry = getItem(LOCAL_STORAGE.countryDetect);
  const path = typeof window !== 'undefined' ? window.location.origin : '';

  if (path.includes(development) || path.includes(development_local)) {
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.uniscore.com/api/v1';
  }
  //Todo open if after merge to main
  // if (getCountry && getCountry?.toLocaleLowerCase() === 'vn') {
  //   return process.env.NEXT_PUBLIC_API_BASE_URL_VN || 'https://api-n1.uniscore.com/api/v1';
  //   // return process.env.NEXT_PUBLIC_API_BASE_URL
  // }
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.uniscore.com/api/v1';
};
