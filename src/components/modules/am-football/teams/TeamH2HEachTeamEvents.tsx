import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TeamH2HEachTeamEventsProps } from 'types/football';
import { CheckBox } from '@/components/common';
import LastMatchSkeleton from '@/components/common/skeleton/match/LastMatchSkeleton';
import LeagueRow from '@/components/modules/am-football/components/LeagueRow';
import { TournamentGroup } from '@/components/modules/football/match/MatchListIsolated';
import { TwMatchFilterContainer } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import { SportEventDtoWithStat } from '@/constant/interface';
import { groupByUniqueTournamentShow } from '@/utils/matchFilter';
import vi from '~/lang/vi';
import { useEachTeamEventH2HData } from '@/hooks/useAmericanFootball';
import HeadMatchTitle from '@/components/modules/am-football/HeadMatchTitle';
import MatchRowH2H from '@/components/modules/am-football/match/MatchRowH2H';

const TeamH2HEachTeamEvents: React.FC<TeamH2HEachTeamEventsProps> = ({
  h2HFilter,
  matchData,
  showQuickView = false,
  i18n = vi,
  type2nd = false,
}) => {
  const eventsRef = useRef<number>(0);
  const [isHome, setIsHome] = useState<boolean>(false);
  const [isAway, setIsAway] = useState<boolean>(false);
  const [matchesShow, setMatchesShow] = useState<TournamentGroup[] | any[]>([]);
  const [thisCompetition, setThisCompetition] = useState<boolean>(false);
  const { homeTeam, awayTeam } = matchData || {};
  const teamIds: string[] =
    h2HFilter === 'home' ? [homeTeam?.id] : [awayTeam?.id];
  const {
    data: h2hData = [],
    isLoading,
    error,
  } = useEachTeamEventH2HData(teamIds); // not h2h

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
          (match: any) => match.tournament?.id === matchData.tournament?.id
        );
      }

      filteredData = filteredData.filter(
        (match: SportEventDtoWithStat) =>
          match.startTimestamp !== matchData.startTimestamp
      );

      if (eventsRef.current !== filteredData.length) {
        eventsRef.current = filteredData.length;

        const dataMatch = groupByUniqueTournamentShow(filteredData);
        setMatchesShow(dataMatch);
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
    ); // TODO skeletons

  if (error) {
    return <div>data error</div>;
  }

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
          label='This tournament'
          val={thisCompetition}
          setVal={setThisCompetition}
        />
      </TwMatchFilterContainer>
      <div className='flex max-h-[100vh] gap-x-3'>
        <div className='w-1/2 flex-1 overflow-y-auto scrollbar'>
          <HeadMatchTitle i18n={i18n} />
          <ul className='space-y-1.5 lg:pr-1'>
            {matchesShow.map((group, idx) => (
              <React.Fragment key={`group-${idx}`}>
                {group.matches.map(
                  (match: SportEventDtoWithStat, matchIdx: any) => {
                    return (
                      <React.Fragment key={`match-${match?.id}`}>
                        {matchIdx === 0 && (
                          <LeagueRow
                            match={match}
                          />
                        )}
                        <MatchRowH2H
                          h2hEvent={match}
                          h2HFilter={h2HFilter}
                          showQuickView={showQuickView}
                          teamId={
                            h2HFilter === 'home' ? homeTeam?.id : awayTeam?.id
                          }
                          type2nd={type2nd}
                        />
                      </React.Fragment>
                    );
                  }
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default TeamH2HEachTeamEvents;
