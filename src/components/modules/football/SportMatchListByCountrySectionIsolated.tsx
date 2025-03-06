import { useRouter as useRouterNav } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';

import useTrans from '@/hooks/useTrans';
import {
  LeagueRow,
  TwMatchListContainer,
} from '@/components/modules/football/columns/MainColumnComponents';
import {
  useFilterStore,
  useHomeStore,
  useMatchStore,
  useSettingsStore,
} from '@/stores';
import { useLeagueByCountryStore } from '@/stores/league-country-store';
import { SportEventDtoWithStat } from '@/constant/interface';
import { isMatchEnded, isMatchLive, isValEmpty } from '@/utils';
import { useWindowSize } from '@/hooks';
import { PAGE, SPORT } from '@/constant/common';
import { MatchRowIsolated } from '@/components/modules/football/match/MatchRowIsolated';
import { filterMatches } from '@/utils/matchFilter';

interface MatchesToShow {
  [leagueId: string]: SportEventDtoWithStat[];
}

export const SportMatchListByCountrySectionIsolated = () => {
  const router = useRouterNav();

  const { leagues } = useLeagueByCountryStore();
  const { showYellowCard, showRedCard, homeSound } = useSettingsStore();
  const { matchesOdds, matchesOddEuropean, matchesOddOverUnder, matches } = useHomeStore();
  const { matchTypeFilter, dateFilter, setMatchFilter, matchTypeFilterMobile } = useFilterStore();
  const {
    selectedMatch,
    showSelectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    setMatchDetails,
  } = useMatchStore();
  const { width } = useWindowSize();
  const sport = SPORT.FOOTBALL;
  const page = PAGE.liveScore;

  const handleClick = useCallback((match: SportEventDtoWithStat) => {
    setMatchDetails(match);
    if (match.id !== selectedMatch) {
      setShowSelectedMatch(true);
      setSelectedMatch(`${match.id}`);
    }
    if (width < 1024) {
      router.push(`/${sport}/match/${match.slug}/${match.id}`);
    }
  }, [selectedMatch]);

  const memoizedMatchesData: SportEventDtoWithStat[] = useMemo(() => {
    const tmp: MatchesToShow = {};
    const matchesToShow: SportEventDtoWithStat[] = [];

    if(isValEmpty(matches)) {
      return [];
    }

    const matchesFilter = Object.values(matches).filter((match: any) => {
      if(matchTypeFilter === 'live') {
        return isMatchLive(match.status.code);
      }
      if(matchTypeFilter === 'finished') {
        return  isMatchEnded(match.status.code);
      }
      return true
    });

    leagues.forEach((league) => {
      tmp[league?.id] = [];
    });

    Object.values(matchesFilter).forEach((m: any) => {
      const tournamentId = m.tournament?.id;
      if (Object.prototype.hasOwnProperty.call(tmp, tournamentId)) {
        tmp[tournamentId].push(m);
      }
    });

    Object.keys(tmp).forEach((key: string) => {
      tmp[key].sort((a: any, b: any) => a.startTimestamp - b.startTimestamp);
      matchesToShow.push(...tmp[key]);
    });
    return matchesToShow;
  }, [matches, leagues, matchTypeFilter]);


  if (isValEmpty(matches)) {
    return null;
  }
  return (
    <TwMatchListContainer>
      <div className='h-full space-y-2'>
        {memoizedMatchesData.map((match, idx) => {
          const matchId = match?.id;
          const matchOdds = matchesOdds[matchId];
          const matchOddEuropean = matchesOddEuropean[matchId];
          const matchOddOverUnder = matchesOddOverUnder[matchId];

          if (
            match.tournament &&
            match.tournament?.id !== memoizedMatchesData[idx - 1]?.tournament?.id
          ) {
            return (
              <React.Fragment key={`m-${idx} space-y-1.5`}>
                <LeagueRow
                  key={`m-${idx}`}
                  match={match as any}
                  isLink={!!(match && match.season_id && match.season_id.length > 0)}
                />
                <MatchRowIsolated
                  key={`m-${match?.id}`}
                  match={match}
                  showYellowCard={showYellowCard}
                  showRedCard={showRedCard}
                  homeSound={homeSound}
                  matchOdds={matchOdds}
                  selectedMatch={selectedMatch}
                  showSelectedMatch={showSelectedMatch}
                  onClick={handleClick}
                  isSimulator={page === 'live-score' && matchTypeFilter !== 'finished'}
                  sport={sport}
                />
              </React.Fragment>
            );
          } else {
            return (
              <MatchRowIsolated
                key={`${match?.id}`}
                match={match}
                showYellowCard={showYellowCard}
                showRedCard={showRedCard}
                homeSound={homeSound}
                matchOdds={matchOdds}
                selectedMatch={selectedMatch}
                showSelectedMatch={showSelectedMatch}
                onClick={handleClick}
                isSimulator={page === 'live-score' && matchTypeFilter !== 'finished'}
                sport={sport}
              />
            );
          }
        })}
      </div>
    </TwMatchListContainer>
  );
};
