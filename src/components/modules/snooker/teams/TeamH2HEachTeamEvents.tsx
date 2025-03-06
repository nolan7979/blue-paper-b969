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
import { LeagueRow } from '@/components/modules/snooker/columns/MainColumnComponents';
import { TwMatchFilterContainer } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import HeadMatchTitle from '@/components/modules/snooker/HeadMatchTitle';
import { SportEventDtoWithStat } from '@/constant/interface';
import { LeagueQuickViewSection } from '@/modules/football/competition/components';
import {
  groupByUniqueTournamentShow,
  TournamentGroupVlb,
} from '@/utils/matchFilter';
import vi from '~/lang/vi';
import { useEachTeamEventH2HData } from '@/hooks/useCommon';
import { SPORT } from '@/constant/common';
import { MatchRowIsolated } from '@/components/modules/snooker/match/MatchRowIsolated';
import { useRouter } from 'next/navigation';
import { useWindowSize } from '@/hooks';
import { useMatchStore } from '@/stores';

const TeamH2HEachTeamEvents: React.FC<TeamH2HEachTeamEventsProps> = ({
  h2HFilter,
  matchData,
  showQuickView = false,
  i18n = vi,
  isDetail = false,
}) => {
  const router = useRouter();
  const { width } = useWindowSize();
  const { setShowSelectedMatch, setSelectedMatch, setMatchDetails } =
    useMatchStore();
  const eventsRef = useRef<number>(0);
  const [matchesShow, setMatchesShow] = useState<TournamentGroupVlb[]>([]);
  const [currentLeague, setCurrentLeague] = useState<boolean>(false);
  const { homeTeam, awayTeam } = matchData || {};
  const teamIds: string[] =
    h2HFilter === 'home' ? [homeTeam?.id] : [awayTeam?.id];
  const {
    data: h2hData = [],
    isLoading,
    error,
  } = useEachTeamEventH2HData(teamIds, SPORT.SNOOKER); // not h2h

  const displayedData = useMemo(() => h2hData[0] || [], [h2hData]);

  const filterMatches = useCallback(
    (team: string) => {
      let filteredData = displayedData;

      if (currentLeague) {
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
        setMatchesShow(dataMatch);
      }
    },
    [displayedData, currentLeague, matchData]
  );

  useEffect(() => {
    filterMatches(h2HFilter);
  }, [filterMatches, h2HFilter]);

  const handleClick = (match: SportEventDtoWithStat) => {
    if (isDetail || width < 1024) {
      router.push(`/snooker/match/${match?.slug || 'slug'}/${match.id}`);
    } else {
      setShowSelectedMatch(true);
      setMatchDetails(match);
      setSelectedMatch(match?.id?.toString());
    }
  };

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
        <CheckBox
          label={i18n.filter.this_league}
          val={currentLeague}
          setVal={setCurrentLeague}
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
                      <React.Fragment key={`match-key-${match?.id}`}>
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
                          isDetail={isDetail}
                          match={match}
                          i18n={i18n}
                          homeSound=''
                          selectedMatch={null}
                          showSelectedMatch={false}
                          onClick={handleClick}
                          sport={SPORT.SNOOKER}
                          h2HFilter={h2HFilter}
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
