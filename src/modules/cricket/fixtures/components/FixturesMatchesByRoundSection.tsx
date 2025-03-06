import { useEffect } from 'react';

import { useRoundMatchesData } from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';

import { useLeagueMatchFilterStore, useMatchStore } from '@/stores';

import { FixtureMatchRowRound } from '@/modules/football/fixtures/components/FixtureMatchRowRound';
import { getSlug, isValEmpty } from '@/utils';

export const FixturesMatchesByRoundSection = ({
  uniqueTournament,
  selectedSeason,
}: {
  uniqueTournament: any;
  selectedSeason: any;
}) => {
  const i18n = useTrans();
  const { selectedRound } = useLeagueMatchFilterStore();

  const { setSelectedMatch, setShowSelectedMatch } = useMatchStore();

  const {
    data = {},
    isLoading,
    isFetching,
    isError,
  } = useRoundMatchesData(
    uniqueTournament?.id,
    selectedSeason?.id,
    selectedRound?.stage_id,
    getSlug(selectedRound?.name)
  );

  useEffect(() => {
    const { events = [] } = data || {};
    if (!isValEmpty(events)) {
      setSelectedMatch(events[0]?.id || events[0].customId);
      setShowSelectedMatch(true);
    }
  }, [data, selectedRound, setSelectedMatch, setShowSelectedMatch]);

  if (isLoading || isFetching || isError) return <> </>;

  const { hasNextPage, events = [] } = data || {};

  return (
    <>
      <div className='py-2.5 lg:p-2.5'>
        <ul className='space-y-1'>
          {events
            .sort((m1: any, m2: any) => {
              return m1.startTimestamp - m2.startTimestamp;
            })
            // .filter((match: any) => {
            // return match.roundInfo?.round === round;
            // })
            .map((match: any, idx: number) => {
              return (
                <FixtureMatchRowRound
                  key={`${match?.id}-${idx}`}
                  match={match}
                  i18n={i18n}
                ></FixtureMatchRowRound>
              );
            })}
        </ul>
      </div>
    </>
  );
};
