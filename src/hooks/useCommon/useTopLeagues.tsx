import { competitionsByCountry } from '@/constant/competitions';
import {
  ILanguageKey,
  hotLeaguesFootball,
} from '@/constant/leagues/hotLeaguesFootball';
import { ILeaguesItems } from '@/models';
import { useMemo } from 'react';

const useSortedTopLeagues = (
  topLeagues: ILeaguesItems[],
  countryLocal: ILanguageKey
) => {
  const competitionCountry = competitionsByCountry[countryLocal] ?? [];

  const sortedTopLeagues = useMemo(() => {
    if (!topLeagues || (topLeagues && Object.keys(topLeagues).length === 0))
      return [];
    const prioritizedLeagues: ILeaguesItems[] =
      hotLeaguesFootball[countryLocal];

    if (!prioritizedLeagues) return topLeagues;

    const remainingLeagues = topLeagues.filter(
      (league: ILeaguesItems) =>
        !prioritizedLeagues.some(
          (prioritized: ILeaguesItems) => prioritized.id === league.id
        )
    );

    const sortedRemainingLeagues = remainingLeagues.sort(
      (a: ILeaguesItems, b: ILeaguesItems) => {
        const indexA = competitionCountry.indexOf(a.id);
        const indexB = competitionCountry.indexOf(b.id);
        return (
          (indexA === -1 ? Infinity : indexA) -
          (indexB === -1 ? Infinity : indexB)
        );
      }
    );

    return [...prioritizedLeagues, ...sortedRemainingLeagues];
  }, [topLeagues, competitionCountry]);

  return sortedTopLeagues;
};

export { useSortedTopLeagues };
