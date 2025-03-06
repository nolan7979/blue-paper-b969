import React, { useEffect, useState } from 'react';

import { CheckBox } from '@/components/common';
import LastMatchSkeleton from '@/components/common/skeleton/match/LastMatchSkeleton';
import { TournamentGroup } from '@/components/modules/football/match/MatchListIsolated';
import { groupByTournamentShow } from '@/utils/matchFilter';
import { TwMatchFilterContainer } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import vi from '~/lang/vi';
import { SportEventDtoWithStat } from '@/constant/interface';
import { LeagueQuickViewSection2nd } from '@/modules/football/competition/components';
import MatchRowH2H from '@/components/modules/football/match/MatchRowH2h';
import { useTeamCommonEventH2HData } from '@/hooks/useCommon';
import { SPORT } from '@/constant/common';
import TeamH2HSection from '@/components/modules/cricket/teams/TeamH2HSection';
import HeadMatchTitle from '@/components/modules/cricket/HeadMatchTitle';
import { LeagueRow } from '@/components/modules/cricket/columns/MainColumnComponents';
import { MatchRowIsolated } from '@/components/modules/cricket/match/MatchRowIsolated';
import { useMatchStore } from '@/stores';
import { useRouter as useRouterNav } from 'next/navigation';
import { useRouter } from 'next/router';
import { useWindowSize } from '@/hooks';

const TeamH2HCommonEvents = ({
  h2HFilter,
  matchData,
  showQuickView = false,
  i18n = vi,
  type2nd,
  setShowTabH2H
}: {
  h2HFilter: string;
  matchData: SportEventDtoWithStat;
  showFilter?: boolean;
  showQuickView?: boolean;
  i18n: any;
  type2nd?: boolean;
  setShowTabH2H: (val:boolean) => void;
}) => {
  const router = useRouterNav();
  const routerPath = useRouter();
  const {asPath} = routerPath;
  const isDetail = asPath.includes('/match/')
  const { width } = useWindowSize();
  const [showAll, setShowAll] = useState<boolean>(false);
  const [matchesData, setMatchesData] = useState<any>([]);
  const [matchesShow, setMatchesShow] = useState<TournamentGroup[]>([]);
  const {
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
    setMatchDetails,
  } = useMatchStore();
  const customId = matchData?.id;
  const homeId = matchData.homeTeam?.id;
  const awayId = matchData.awayTeam?.id;

  const { data: h2hData = [], isLoading } = useTeamCommonEventH2HData(
    customId,
    homeId,
    awayId,
    SPORT.CRICKET
  );

  useEffect(() => {
    setShowTabH2H(true)
    if (JSON.stringify(h2hData).length !== JSON.stringify(matchesData).length) {
      const filterData = h2hData?.filter(
        (item: SportEventDtoWithStat) =>
          item.status.code !== 0 &&
          item.startTimestamp !== matchData.startTimestamp
      )
      setMatchesData(filterData);
      if(filterData.length == 0) {
        setShowTabH2H(false)
      }
    }
  }, [h2hData]);

  useEffect(() => {
    const h2hDataFiltered = showAll ? matchesData : matchesData.slice(0, 5);
    if (matchesData && h2hDataFiltered) {
      setMatchesShow(groupByTournamentShow(h2hDataFiltered));
    }
  }, [matchesData, showAll]);

  const handleClick = (match: SportEventDtoWithStat) => {
    setMatchDetails(match);
    if (match.id !== selectedMatch) {
      setShowSelectedMatch(true);
      setSelectedMatch(`${match.id}`);
    }
    if (width < 1024 || isDetail) {
      router.push(`/cricket/match/${match.slug}/${match.id}`);
    }
  };

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
                          isLink={
                            match &&
                            match.season?.id &&
                            match.season?.id.length > 0
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
              </React.Fragment>
            ))}
          </ul>
        </div>
        {/* TODO add quick view here */}
      </div>
      <TeamH2HSection matchData={matchData} i18n={i18n} />
    </>
  );
};
export default TeamH2HCommonEvents;
