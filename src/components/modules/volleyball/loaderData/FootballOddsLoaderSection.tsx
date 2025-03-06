import { FootballOddsLoader } from '@/components/modules/football/loaderData/FootballOddsLoader';

import { useOddsStore } from '@/stores';

export const FootballOddsLoaderSection = () => {
  const { showOdds } = useOddsStore();

  if (showOdds) {
    return <FootballOddsLoader></FootballOddsLoader>;
  }
  return <></>;
};
