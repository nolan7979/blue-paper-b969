import React, { useEffect, useState } from 'react';

import { CheckBox } from '@/components/common';
import LastMatchSkeleton from '@/components/common/skeleton/match/LastMatchSkeleton';
import { LeagueRow } from '@/components/modules/snooker/columns/MainColumnComponents';
import {
  groupByUniqueTournamentShow,
  TournamentGroupVlb,
} from '@/utils/matchFilter';
import { TwMatchFilterContainer } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import HeadMatchTitle from '@/components/modules/snooker/HeadMatchTitle';
import vi from '~/lang/vi';
import { SportEventDtoWithStat } from '@/constant/interface';
import { useH2HData } from '@/hooks/useSnooker';
import { MatchRowIsolated } from '@/components/modules/snooker/match/MatchRowIsolated';
import { SPORT } from '@/constant/common';
import { useMatchStore } from '@/stores';
import { useRouter } from 'next/navigation';
import { useWindowSize } from '@/hooks';

const TeamH2HCommonEvents = ({
  matchData,
  showQuickView = false,
  i18n = vi,
  isDetail = false,
  h2HFilter,
}: {
  h2HFilter: string;
  matchData: SportEventDtoWithStat;
  showFilter?: boolean;
  showQuickView?: boolean;
  i18n: any;
  type2nd?: boolean;
  isDetail?: boolean;
}) => {
  const router = useRouter();
  const { width } = useWindowSize();
  const { setShowSelectedMatch, setSelectedMatch, setMatchDetails } =
    useMatchStore();
  const [currentLeague, setCurrentLeague] = useState<boolean>(false);
  const [matchesData, setMatchesData] = useState<any>([]);
  const [matchesShow, setMatchesShow] = useState<TournamentGroupVlb[]>([]);

  const customId = matchData?.id;
  const homeId = matchData.homeTeam?.id;
  const awayId = matchData.awayTeam?.id;

  const { data: h2hData = [], isLoading } = useH2HData(
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
    const h2hDataFiltered = currentLeague
      ? matchesData.filter((item: any) => {
          return item?.uniqueTournament?.id === matchData?.uniqueTournament?.id;
        })
      : matchesData;
    if (matchesData && h2hDataFiltered) {
      setMatchesShow(groupByUniqueTournamentShow(h2hDataFiltered));
    }
  }, [matchesData, currentLeague]);

  const handleClick = (match: SportEventDtoWithStat) => {
    if (isDetail || width < 1024) {
      router.push(`/snooker/match/${match?.slug || 'slug'}/${match.id}`);
    } else {
      setShowSelectedMatch(true);
      setMatchDetails(match);
      setSelectedMatch(match?.id?.toString());
    }
  };

  if (isLoading || !h2hData) return <LastMatchSkeleton />;

  return (
    <>
      <TwMatchFilterContainer className='flex'>
        <CheckBox
          label={i18n.filter.this_league}
          val={currentLeague}
          setVal={setCurrentLeague}
        />
      </TwMatchFilterContainer>

      <div className='flex max-h-[100vh] gap-x-3'>
        <div className='max-h-[100vh] w-1/2 flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar'>
          <HeadMatchTitle i18n={i18n} />
          <ul className='space-y-1.5 pr-1'>
            {matchesShow.map((group, idx: number) => (
              <React.Fragment key={`group-${idx}`}>
                {group.matches.map((match: any, matchIdx: any) => {
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
                })}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
export default TeamH2HCommonEvents;
