import { CheckBox } from '@/components/common';
import LastMatchSkeleton from '@/components/common/skeleton/match/LastMatchSkeleton';
// import { LeagueRow } from '@/components/modules/football/columns/MainColumnComponents';
import {
  HeadMatchTitle as HeadMatchTitleBmt,
  MatchRowH2H as MatchRowH2HBmt,
} from '@/components/modules/badminton';
import { TournamentGroup } from '@/components/modules/football/match/MatchListIsolated';
import { TwMatchFilterContainer } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import { SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { useEachTeamEventH2HData } from '@/hooks/useCommon';
// import { LeagueQuickViewSection } from '@/modules/football/competition/components';
import { groupByUniqueTournamentShow } from '@/utils/matchFilter';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TeamH2HEachTeamEventsProps } from 'types/football';
import vi from '~/lang/vi';

export const TeamH2HEachTeamEvents: React.FC<TeamH2HEachTeamEventsProps> = ({
  h2HFilter,
  matchData,
  showQuickView = false,
  i18n = vi,
  type2nd = false,
}) => {
  const eventsRef = useRef<number>(0);
  const [isHome, setIsHome] = useState<boolean>(false);
  const [isAway, setIsAway] = useState<boolean>(false);
  const [thisCompetition, setThisCompetition] = useState<boolean>(false);
  const [matchesShow, setMatchesShow] = useState<TournamentGroup[]>([]);
  const { homeTeam, awayTeam } = matchData || {};
  const teamIds: string[] =
    h2HFilter === 'home' ? [homeTeam?.id] : [awayTeam?.id];
  const {
    data: h2hData = [],
    isLoading,
    error,
  } = useEachTeamEventH2HData(teamIds, SPORT.BADMINTON); // not h2h

  const isSingle = (match:any) => {
    if((match?.homeTeam?.sub_ids && match?.homeTeam?.sub_ids.length > 0 && match?.awayTeam?.sub_ids && match?.awayTeam?.sub_ids.length > 0) || (match?.homeTeam?.sub_ids && match?.homeTeam?.sub_ids.includes('~') && match?.awayTeam?.sub_ids && match?.awayTeam?.sub_ids.includes('~'))) return false;
    return true;
  }

  const isCurrentSingle = isSingle(matchData)

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
          (match: any) => match?.uniqueTournament?.id === matchData?.uniqueTournament?.id
        );
      }

      filteredData = filteredData.filter(
        (match: SportEventDtoWithStat) =>
          match.startTimestamp !== matchData.startTimestamp
      );

      if (eventsRef.current !== filteredData.length) {
        eventsRef.current = filteredData.length;

        const dataMatch = groupByUniqueTournamentShow(filteredData) as any;
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
          <HeadMatchTitleBmt i18n={i18n} />
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
                        <MatchRowH2HBmt
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
        {/* TODO add quick view here */}
        {/* <div
          className='no-scrollbar hidden flex-1 overflow-auto'
          css={[showQuickView && tw`lg:block`]}
        >
          <LeagueQuickViewSection></LeagueQuickViewSection>
        </div> */}
      </div>
    </>
  );
};

import Avatar from "@/components/common/Avatar";
import CustomLink from "@/components/common/CustomizeLink";

const LeagueRow = ({
  match,
}: {
  match: SportEventDtoWithStat;
}) => {
  const { uniqueTournament } = match;

  return (
    <div className='flex items-center gap-x-1.5' test-id='match-row'>
      <div className='flex items-center gap-3'>
        <CustomLink
          href={`/${SPORT.BADMINTON}/competition/${uniqueTournament?.slug}/${uniqueTournament?.id}`}
          target='_parent'
          disabled
        >
          <Avatar
            id={uniqueTournament?.id}
            type='competition'
            width={32}
            height={32}
            rounded={false}
            isBackground={false}
            sport={SPORT.BADMINTON}
            isSmall
          />
        </CustomLink>
        <div>
          <h3 className='text-black dark:text-white text-[11px]'>{uniqueTournament?.name}</h3>
          { uniqueTournament?.country ? (
            <div className='flex gap-1'>
              <Avatar
                id={uniqueTournament?.country?.id}
                type='country'
                width={16}
                height={10}
                rounded={false}
                isBackground={false}
                sport={SPORT.BADMINTON}
                isSmall
              />
              <span className='text-light-secondary uppercase text-[11px]'>{uniqueTournament?.country?.name ? uniqueTournament?.country?.name : '-'}</span>
            </div>
          ) : '--'}
        </div>
      </div>
    </div>
  );
};

export default LeagueRow;