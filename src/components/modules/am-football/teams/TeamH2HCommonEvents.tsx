import React, { useEffect, useState } from 'react';

import vi from '~/lang/vi';
import { CheckBox } from '@/components/common';
import LastMatchSkeleton from '@/components/common/skeleton/match/LastMatchSkeleton';
import { TournamentGroup } from '@/components/modules/football/match/MatchListIsolated';
import { groupByUniqueTournamentShow } from '@/utils/matchFilter';
import { TwMatchFilterContainer } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import { SportEventDtoWithStat } from '@/constant/interface';
import { LeagueQuickViewSection2nd } from '@/modules/football/competition/components';
import { useTeamCommonEventH2HData } from '@/hooks/useAmericanFootball';
import LeagueRow from '@/components/modules/am-football/components/LeagueRow';
import HeadMatchTitle from '@/components/modules/am-football/HeadMatchTitle';
import MatchRowH2H from '@/components/modules/am-football/match/MatchRowH2H';

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
  const [matchesShow, setMatchesShow] = useState<TournamentGroup[] | any[]>([]);

  const customId = matchData?.id;
  const homeId = matchData.homeTeam?.id;
  const awayId = matchData.awayTeam?.id;

  const { data: h2hData = [], isLoading } = useTeamCommonEventH2HData(
    customId,
    homeId,
    awayId
  );

  useEffect(() => {
    if (JSON.stringify(h2hData).length !== JSON.stringify(matchesData).length) {
      setMatchesData(() =>
        h2hData.filter(
          (item: SportEventDtoWithStat) =>
            item.status.code !== 0 &&
            item.startTimestamp !== matchData.startTimestamp
        )
      );
    }
  }, [h2hData]);

  useEffect(() => {
    const h2hDataFiltered = showAll ? matchesData : matchesData.slice(0, 5);
    if (matchesData && h2hDataFiltered) {
      setMatchesShow(groupByUniqueTournamentShow(h2hDataFiltered));
    }
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

      <div className='flex max-h-[100vh] gap-x-3'>
        <div className='max-h-[100vh] w-1/2 flex-1 overflow-y-auto overflow-x-hidden scrollbar'>
          <HeadMatchTitle i18n={i18n} />
          <ul className='space-y-1.5 pr-1'>
            {matchesShow.map((group, idx: number) => (
              <React.Fragment key={`group-${idx}`}>
                {group.matches.map((match: any, matchIdx: any) => {
                  return (
                    <React.Fragment key={`match-${match?.id}`}>
                      {matchIdx === 0 && (
                        <LeagueRow
                          match={match}
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
        <div
          className={`no-scrollbar flex-1 overflow-auto ${
            showQuickView ? 'block' : 'hidden'
          }`}
        >
          <LeagueQuickViewSection2nd />
        </div>
      </div>
    </>
  );
};
export default TeamH2HCommonEvents;
