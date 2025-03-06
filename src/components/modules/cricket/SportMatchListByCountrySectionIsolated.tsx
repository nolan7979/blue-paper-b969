import useTrans from '@/hooks/useTrans';

import {
  LeagueRow,
  TwMatchListContainer,
} from '@/components/modules/football/columns/MainColumnComponents';
import { MatchRowIsolated } from '@/components/modules/football/match/MatchRowIsolated';

import { useFilterStore, useHomeStore, useMatchStore, useSettingsStore } from '@/stores';
import { useLeagueByCountryStore } from '@/stores/league-country-store';

import { SportEventDtoWithStat } from '@/constant/interface';
import { isValEmpty } from '@/utils';
import { useCallback } from 'react';
import { useRouter as useRouterNav } from 'next/navigation';
import { useWindowSize } from '@/hooks';
import { PAGE, SPORT } from '@/constant/common';

interface MatchesToShow {
  [leagueId: string]: SportEventDtoWithStat[];
}

export const SportMatchListByCountrySectionIsolated = () => {
  const { leagues } = useLeagueByCountryStore();
  const { matches } = useHomeStore();
  const { showYellowCard, showRedCard, homeSound } = useSettingsStore();
  const router = useRouterNav();
  const { matchTypeFilter, dateFilter, setMatchFilter, matchTypeFilterMobile } =
    useFilterStore();
  const { matchesOdds, matchesOddEuropean, matchesOddOverUnder } =
    useHomeStore();
    const {
      selectedMatch,
      showSelectedMatch,
      setShowSelectedMatch,
      setSelectedMatch,
      setMatchDetails,
    } = useMatchStore();
  const { width } = useWindowSize();
    const sport = SPORT.CRICKET;
    const page = PAGE.liveScore;
  const i18n = useTrans();
  const filterMatches = Object.values(matches);
  const tmp: MatchesToShow = {};
  const matchesToShow: SportEventDtoWithStat[] = [];
  leagues.forEach((league) => {
    tmp[league?.id] = [];
  });
  filterMatches &&
    filterMatches.forEach((m: any) => {
      const tournamentId = m.tournament?.id;
      if (Object.prototype.hasOwnProperty.call(tmp, tournamentId)) {
        tmp[tournamentId].push(m);
      }
    });

  const keyOfTournament = Object.keys(tmp);

  keyOfTournament.forEach((key: string) => {
    tmp[key].sort((a: any, b: any) => a.startTimestamp - b.startTimestamp);
    matchesToShow.push(...tmp[key]);
  });
  const handleClick = useCallback((match: SportEventDtoWithStat) => {
    setMatchDetails(match);
    if (match.id !== selectedMatch) {
      setShowSelectedMatch(true);
      setSelectedMatch(`${match.id}`);
    }
    if ( width < 1024) {
      router.push(`/${sport}/match/${match.slug}/${match.id}`);
    }
  },[selectedMatch]);
  if (isValEmpty(matches)) {
    return <></>;
  }
  return (
    <>
      <TwMatchListContainer>
        <div className=' h-full space-y-1'>
          {matchesToShow &&
            matchesToShow?.map((match, idx) => {
              if (
                match.tournament &&
                match.tournament?.id !== matchesToShow[idx - 1]?.tournament?.id
              ) {
                const matchId = match?.id;
                const matchOdds = matchesOdds[matchId];
                const matchOddEuropean = matchesOddEuropean[matchId];
                const matchOddOverUnder = matchesOddOverUnder[matchId];
                return (
                  <div key={`m-${idx}`}>
                    <LeagueRow
                      key={`m-${idx}`}
                      match={match as any}
                      isLink={
                        match && match.season_id && match.season_id.length > 0
                          ? true
                          : false
                      }
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
                    isSimulator={
                      page === 'live-score' && matchTypeFilter !== 'finished'
                    }
                    sport={sport}
                    />
                  </div>
                );
              } else {
                const matchId = match?.id;
                const matchOdds = matchesOdds[matchId];
                return (
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
                    isSimulator={
                      page === 'live-score' && matchTypeFilter !== 'finished'
                    }
                    sport={sport}
                  />
                );
              }
            })}
        </div>
      </TwMatchListContainer>
    </>
  );
};
