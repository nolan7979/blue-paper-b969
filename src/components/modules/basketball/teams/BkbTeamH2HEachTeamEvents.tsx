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
import { LeagueRow } from '@/components/modules/football/columns/MainColumnComponents';
import { TournamentGroup } from '@/components/modules/football/match/MatchListIsolated';
import { TwMatchFilterContainer } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import { SportEventDtoWithStat } from '@/constant/interface';
import { LeagueQuickViewSection } from '@/modules/football/competition/components';
import { groupByTournamentShow } from '@/utils/matchFilter';
import vi from '~/lang/vi';
import { useBkbEachTeamEventH2HData } from '@/hooks/useBasketball';
import BkbHeadMatchTitle from '@/components/modules/basketball/BkbHeadMatchTitle';
import BkbMatchRowH2H from '@/components/modules/basketball/match/BkbMatchRowH2H';

const BkbTeamH2HEachTeamEvents: React.FC<TeamH2HEachTeamEventsProps> = ({
  h2HFilter,
  matchData,
  showQuickView = false,
  i18n = vi,
  type2nd = false,
  isDetail = false,
}) => {
  const eventsRef = useRef<number>(0);
  const [isHome, setIsHome] = useState<boolean>(false);
  const [isAway, setIsAway] = useState<boolean>(false);
  const [matchesShow, setMatchesShow] = useState<TournamentGroup[]>([]);
  const [thisCompetition, setThisCompetition] = useState<boolean>(false);
  const { homeTeam, awayTeam } = matchData || {};
  const teamIds: string[] =
    h2HFilter === 'home' ? [homeTeam?.id] : [awayTeam?.id];
  const {
    data: h2hData = [],
    isLoading,
    error,
  } = useBkbEachTeamEventH2HData(teamIds); // not h2h

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

        const dataMatch = groupByTournamentShow(filteredData);
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
          <BkbHeadMatchTitle i18n={i18n} />
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
                            isLink={
                              match &&
                              match.season?.id &&
                              match.season?.id.length > 0
                                ? true
                                : false
                            }
                          />
                        )}
                        <BkbMatchRowH2H
                          h2hEvent={match}
                          h2HFilter={h2HFilter}
                          showQuickView={showQuickView}
                          teamId={
                            h2HFilter === 'home' ? homeTeam?.id : awayTeam?.id
                          }
                          type2nd={type2nd}
                          isDetail={isDetail}
                        />
                      </React.Fragment>
                    );
                  }
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
        {/* TODO add quick view here */}
        <div
          className='no-scrollbar hidden flex-1 overflow-auto'
          css={[showQuickView && tw`lg:block`]}
        >
          <LeagueQuickViewSection></LeagueQuickViewSection>
        </div>
      </div>
    </>
  );
};

export default BkbTeamH2HEachTeamEvents;
