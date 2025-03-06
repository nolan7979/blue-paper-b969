import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import tw from 'twin.macro';
import { TeamH2HEachTeamEventsProps } from 'types/football';
import { CheckBox } from '@/components/common';
import LastMatchSkeleton from '@/components/common/skeleton/match/LastMatchSkeleton';
import { useRouter as useRouterNav } from 'next/navigation';
import { useRouter } from 'next/router';

import { TournamentGroup } from '@/components/modules/football/match/MatchListIsolated';
import { TwMatchFilterContainer } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import HeadMatchTitle from '@/components/modules/cricket/HeadMatchTitle';
import { SportEventDtoWithStat } from '@/constant/interface';
import { LeagueQuickViewSection } from '@/modules/football/competition/components';
import {
  groupByUniqueTournamentShow,
  TournamentGroupVlb,
} from '@/utils/matchFilter';
import vi from '~/lang/vi';
import MatchRowH2H from '@/components/modules/football/match/MatchRowH2h';
import { useEachTeamEventH2HData } from '@/hooks/useCommon';
import { SPORT } from '@/constant/common';
import { MatchRowIsolated } from '@/components/modules/cricket/match/MatchRowIsolated';
import { LeagueRow } from '@/components/modules/cricket/columns/MainColumnComponents';
import { useMatchStore } from '@/stores';
import { useWindowSize } from '@/hooks';

const TeamH2HEachTeamEvents: React.FC<TeamH2HEachTeamEventsProps> = ({
  h2HFilter,
  matchData,
  showQuickView = false,
  i18n = vi,
  type2nd = false,
}) => {
  const eventsRef = useRef<number>(0);
  const router = useRouterNav();
  const routerPath = useRouter();
  const {asPath} = routerPath;
  const isDetail = asPath.includes('/match/')
  const { width } = useWindowSize();
  const [isHome, setIsHome] = useState<boolean>(false);
  const [isAway, setIsAway] = useState<boolean>(false);
  const [matchesShow, setMatchesShow] = useState<TournamentGroupVlb[]>([]);
  const [thisCompetition, setThisCompetition] = useState<boolean>(false);
  const { homeTeam, awayTeam } = matchData || {};
  const {
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    setMatchDetails,
  } = useMatchStore();
  
  const teamIds: string[] =
    h2HFilter === 'home' ? [homeTeam?.id] : [awayTeam?.id];
  const {
    data: h2hData = [],
    isLoading,
    error,
  } = useEachTeamEventH2HData(teamIds, SPORT.CRICKET); // not h2h

  const displayedData = useMemo(() => h2hData[0] || [], [h2hData]);

  const filterMatches = useCallback(
    (team: string) => {
      let filteredData = displayedData;

      if (team === 'home' && isHome) {
        filteredData = filteredData.filter(
          (match: SportEventDtoWithStat) =>
            match.homeTeam?.id === matchData.homeTeam?.id &&
            match.startTimestamp !== matchData.startTimestamp
        );
      }

      if (team === 'away' && isAway) {
        filteredData = filteredData.filter(
          (match: any) => match.awayTeam?.id === matchData.awayTeam?.id
        );
      }

      if (thisCompetition) {
        filteredData = filteredData.filter(
          (match: any) =>
            match.uniqueTournament?.id === matchData.uniqueTournament?.id
        );
      }

      filteredData = filteredData.filter(
        (match: SportEventDtoWithStat) =>
          match.startTimestamp !== matchData.startTimestamp
      );

      if (eventsRef.current !== filteredData.length) {
        eventsRef.current = filteredData.length;

        const dataMatch = groupByUniqueTournamentShow(filteredData);
        setMatchesShow(dataMatch as TournamentGroupVlb[]);
      }
    },
    [displayedData, isHome, isAway, thisCompetition, matchData]
  );

  useEffect(() => {
    filterMatches(h2HFilter);
  }, [filterMatches, h2HFilter]);

  if (isLoading || !h2hData)
    return (
      <div>
        <LastMatchSkeleton />
      </div>
    );

  if (error) {
    return <div>data error</div>;
  }

  const handleClick = (match: SportEventDtoWithStat) => {
    setMatchDetails(match);
    if (match.id !== selectedMatch) {
      setShowSelectedMatch(true);
      setSelectedMatch(`${match.id}`);
      // setShowSelectedMatch2nd(true);
      // setSelectedMatch2nd(`${match.id}`);
    }
    if (width < 1024 || isDetail) {
      router.push(`/cricket/match/${match.slug}/${match.id}`);
    }
  };

  return (
    <>
      <TwMatchFilterContainer>
        {h2HFilter === 'home' && (
          <CheckBox label={i18n.filter.home} val={isHome} setVal={setIsHome} />
        )}
        {h2HFilter === 'away' && (
          <CheckBox label={i18n.filter.away} val={isAway} setVal={setIsAway} />
        )}
        <CheckBox
          label={i18n.filter.this_competition}
          val={thisCompetition}
          setVal={setThisCompetition}
        />
      </TwMatchFilterContainer>
      <div className='flex max-h-[100vh] gap-x-3'>
        <div className='w-1/2 flex-1 overflow-y-auto scrollbar'>
          <HeadMatchTitle i18n={i18n} />
          <ul className='space-y-1.5 lg:pr-1'>
            {matchesShow.map((group, idx) => (
              <div
                className='space-y-2'
                key={`group-${idx}`}
                // ref={idx === matchesToShow.length - 1 ? lastElementRef : null}
                test-id='match-league'
              >
                {group.matches.map((match, matchIdx) => {
                  const matchId = match?.id;

                  return (
                    <React.Fragment key={`match-${match?.id}`}>
                      {matchIdx === 0 && (
                        <LeagueRow
                          match={match}
                          isLink={
                            match &&
                            match.season_id &&
                            match.season_id.length > 0
                              ? true
                              : false
                          }
                        />
                      )}
                      <MatchRowIsolated
                        key={match?.id}
                        match={match}
                        i18n={i18n}
                        onClick={handleClick}
                        sport={SPORT.CRICKET}
                        homeSound=''
                      />
                    </React.Fragment>
                  );
                })}
              </div>
            ))}
          </ul>
        </div>
        {/* TODO add quick view here */}
        <div
          className='hidden flex-1 overflow-auto no-scrollbar'
          css={[showQuickView && tw`lg:block`]}
        >
          <LeagueQuickViewSection></LeagueQuickViewSection>
        </div>
      </div>
    </>
  );
};

export default TeamH2HEachTeamEvents;
