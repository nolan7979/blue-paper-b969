import React, { useEffect, useState } from 'react';

import { CheckBox } from '@/components/common';
import LastMatchSkeleton from '@/components/common/skeleton/match/LastMatchSkeleton';
import { UniqueTournamentGroup } from '@/components/modules/football/match/MatchListIsolated';
import { TwMatchFilterContainer } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import { LeagueRow } from '@/components/modules/hockey/columns';
import HeadMatchTitle from '@/components/modules/hockey/HeadMatchTitle';
import MatchRowH2H from '@/components/modules/hockey/match/MatchRowH2H';
import TeamH2HSection from '@/components/modules/hockey/teams/TeamH2HSection';
import { SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { useTeamCommonEventH2HData } from '@/hooks/useCommon/useEventData';
import { groupByUniqueTournamentShow } from '@/utils/matchFilter';
import vi from '~/lang/vi';

const TeamH2HCommonEvents = ({
  h2HFilter,
  matchData,
  showQuickView = false,
  i18n = vi,
  type2nd,
}: {
  h2HFilter: string;
  matchData: SportEventDtoWithStat;
  showFilter?: boolean;
  showQuickView?: boolean;
  i18n: any;
  type2nd?: boolean;
}) => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const [matchesData, setMatchesData] = useState<any>([]);
  const [matchesShow, setMatchesShow] = useState<UniqueTournamentGroup[]>([]);

  const customId = matchData?.id;
  const homeId = matchData.homeTeam?.id;
  const awayId = matchData.awayTeam?.id;

  const { data: h2hData = [], isLoading } = useTeamCommonEventH2HData(
    customId,
    homeId,
    awayId,
    SPORT.ICE_HOCKEY
  );

  useEffect(() => {
    // Only update matchesData if h2hData has changed
    const h2hDataString = JSON.stringify(h2hData);
    const matchesDataString = JSON.stringify(matchesData);

    if (h2hDataString !== matchesDataString) {
      const filteredMatches = h2hData.filter(
        (item: SportEventDtoWithStat) => 
          // Filter out matches that haven't started and current match
          item.status.code !== 0 && 
          item.startTimestamp !== matchData.startTimestamp
      );
      setMatchesData(filteredMatches);
    }
  }, [h2hData, matchData.startTimestamp]);

  useEffect(() => {
    if (!matchesData) return;

    // Show all matches or just first 5 based on showAll flag
    const displayedMatches = showAll ? matchesData : matchesData.slice(0, 5);
    
    // Group matches by tournament
    const groupedMatches = groupByUniqueTournamentShow(displayedMatches);
    setMatchesShow(groupedMatches);
  }, [matchesData, showAll]);

  if (isLoading || !h2hData)
    return (
      <>
        <LastMatchSkeleton />
      </>
    );

  return (
    <>
      <TwMatchFilterContainer className='flex'>
        <CheckBox
          label={i18n.filter.all}
          val={showAll}
          setVal={setShowAll}
        ></CheckBox>
      </TwMatchFilterContainer>

      <TeamH2HSection matchData={matchData} i18n={i18n} />
      
      <div className='flex max-h-[100vh] gap-x-3'>
        <div className='max-h-[100vh] w-1/2 flex-1 overflow-y-auto overflow-x-hidden scrollbar'>
          <HeadMatchTitle i18n={i18n} />
          <ul className='space-y-1.5 pr-1'>
            {matchesShow.map((group, idx: number) => (
              <React.Fragment key={`group-${idx}`}>
                {group.matches.map((match: any, matchIdx: any) => {
                  if (match?.id === matchData?.id) 
                    return  (
                      <React.Fragment key={`match-${match?.id}`} />
                    );

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
                      <MatchRowH2H
                        showQuickView={showQuickView}
                        h2hEvent={match}
                        h2HFilter={h2HFilter}
                        type2nd={type2nd}
                      />
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            ))}
          </ul>
        </div>
        {/* TODO add quick view here */}
        {/* <div
          className={`no-scrollbar flex-1 overflow-auto ${
            showQuickView ? 'block' : 'hidden'
          }`}
        >
          <LeagueQuickViewSection2nd />
        </div> */}
      </div>
    </>
  );
};
export default TeamH2HCommonEvents;
