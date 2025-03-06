import { LOCAL_STORAGE } from "@/constant/common";
import { getItem } from "@/utils/localStorageUtils";

export const useStastLocale = () => {

  const statisticLocale = getItem(LOCAL_STORAGE.statsLocaleDetail);
  const stat = (statisticLocale && JSON.parse(statisticLocale)) || {};

  return stat
}