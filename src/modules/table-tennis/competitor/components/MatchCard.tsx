import React, { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';

import useTrans from '@/hooks/useTrans';

import { SportEventDtoWithStat } from '@/constant/interface';
import { useRouter } from 'next/navigation';
import { groupByUniqueTournamentShow } from '@/utils/matchFilter';
import { SPORT } from '@/constant/common';
import { LeagueRow } from '@/components/modules/table-tennis';
import { useListMatchPlayerData } from '@/hooks/useTableTennis';

const MatchRowIsolated = dynamic(
  () =>
    import('@/components/modules/table-tennis').then(
      (mod) => mod.MatchRowIsolated
    ),
  { ssr: false }
);

export const MatchCard = ({
  playerId,
  matchData,
  showFormBadge,
}: {
  showFormBadge?: boolean;
  playerId?: string;
  matchData: SportEventDtoWithStat[];
}) => {
  const i18n = useTrans();
  const { push } = useRouter();

  const { data: matchDataClient, refetch } = useListMatchPlayerData(playerId!);

  const dataMatch = useMemo(() => {
    if (!!matchDataClient?.length) {
      return groupByUniqueTournamentShow(matchDataClient);
    }

    return !!matchData?.length ? groupByUniqueTournamentShow(matchData) : [];
  }, [matchData, matchDataClient]);

  const onClick = (match: SportEventDtoWithStat) => {
    push(`/table-tennis/match/${match?.slug || 'slug'}/${match.id}`);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (!!matchData?.length || !!matchDataClient?.length) {
      intervalId = setInterval(() => {
        refetch();
      }, 1000 * 5);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [matchData, matchDataClient]);

  if (dataMatch && dataMatch.length == 0) return <></>;

  return (
    <div className='w-full bg-white p-4 dark:bg-dark-card lg:rounded-lg'>
      <h2 className='mb-4 text-[14px] font-bold uppercase text-black dark:text-white'>
        {i18n.titles.matches}
      </h2>
      <div className='w-full'>
        <ul className='space-y-1.5 pr-1'>
          {Array.isArray(dataMatch) &&
            dataMatch.map((group, idx) => (
              <React.Fragment key={`group-${idx}`}>
                {group.matches.map(
                  (match: SportEventDtoWithStat, matchIdx: any) => {
                    return (
                      <div key={`match-${match?.id}`}>
                        {matchIdx === 0 && <LeagueRow match={match} isLink />}
                        <MatchRowIsolated
                          key={match?.id}
                          match={match}
                          i18n={i18n}
                          handleClick={onClick}
                          sport={SPORT.TABLE_TENNIS}
                          homeSound=''
                          showFormBadge={showFormBadge}
                          playerId={playerId}
                        />
                      </div>
                    );
                  }
                )}
              </React.Fragment>
            ))}
        </ul>
      </div>
    </div>
  );
};
