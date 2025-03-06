import { useDetectedCountry } from '@/hooks/useDetectDevice';
import { useLocaleStatsDetailHead, useLocaleStatsHead } from '@/hooks/useFootball';
import { getItem, setItem } from '@/utils/localStorageUtils';
import { useMemo, useEffect } from 'react';

const LOCAL_STORAGE = {
  countryDetect: 'countryDetect',
  localeList: 'localeList',
  statsLocaleDetail: 'statsLocaleDetail',
  currentLocale: 'currentLocale',
};

const useLocalStorageSync = (locale: any) => {
  // Fetch values from local storage and parse them
  const country = useMemo(() => getItem(LOCAL_STORAGE.countryDetect), []);
  const localeList = useMemo(() => getItem(LOCAL_STORAGE.localeList), []);
  const statsLocale = useMemo(() => getItem(LOCAL_STORAGE.statsLocaleDetail), []);
  const currentLocale = useMemo(() => getItem(LOCAL_STORAGE.currentLocale), []);

  const { data: dataDetected } = useDetectedCountry(!country);
  const { data: dataLocale } = useLocaleStatsHead();
  const { data: statsDetailData } = useLocaleStatsDetailHead(JSON.parse(currentLocale!));

  useEffect(() => {
    if (dataDetected) {
      setItem(LOCAL_STORAGE.countryDetect, dataDetected.country);
    }
  }, [dataDetected]);

  useEffect(() => {
    if (dataLocale && localeList && dataLocale.length !== JSON.parse(localeList).length) {
      setItem(LOCAL_STORAGE.localeList, JSON.stringify(dataLocale));
    }
  }, [dataLocale, localeList]);

  useEffect(() => {
    if (statsDetailData && JSON.stringify(statsDetailData).length !== statsLocale?.length) {
      setItem(LOCAL_STORAGE.statsLocaleDetail, JSON.stringify(statsDetailData));
    }
  }, [statsDetailData, statsLocale]);

  useEffect(() => {
    const parsedLocale = currentLocale && JSON.parse(currentLocale);
    if (parsedLocale !== locale) {
      setItem(LOCAL_STORAGE.currentLocale, JSON.stringify(locale));
    }
  }, [locale, currentLocale]);

  return {
    country,
    localeList,
    statsLocale,
    currentLocale,
    dataDetected,
    dataLocale,
    statsDetailData,
  };
};

export default useLocalStorageSync;