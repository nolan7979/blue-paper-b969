import { TwFilterButton } from '@/components/modules/football/tw-components';
import { useManagerEventsData } from '@/hooks/useFootball';
import { LeagueQuickViewSection } from '@/modules/football/competition/components';
import { TeamMatchRow } from '@/modules/football/competitor/components';
import { useMatchStore } from '@/stores';
import { useEffect, useState } from 'react';
import tw from 'twin.macro';

const ManagerMatchesSection = ({ manager }: { manager: any }) => {
  const [page, setPage] = useState<number>(0);

  const { teams = [], id: managerId } = manager || {};
  let team: any = {};
  if (teams.length) {
    team = teams[0];
  }

  const {
    data: nextEventsData,
    isLoading,
    isFetching,
    isError: isErrorNext,
  } = useManagerEventsData(managerId, 'next', page);

  const {
    data: lastEventsData,
    isLoading: isLoadingLastEvents,
    isFetching: isFetchingLastEvents,
    isError: isErrorLast,
  } = useManagerEventsData(managerId, 'last', page);

  const { setSelectedMatch, setShowSelectedMatch } = useMatchStore();

  useEffect(() => {
    const { events: nextEvents } = nextEventsData || [];
    const { events: lastEvents } = lastEventsData || [];

    let shownMatch = null;
    if (lastEvents && lastEvents.length > 0) {
      shownMatch = lastEvents[lastEvents.length - 1];
    } else if (nextEvents && nextEvents.length > 0) {
      shownMatch = nextEvents[0];
    }
    if (shownMatch) {
      setSelectedMatch(shownMatch?.id || shownMatch.customId);
      setShowSelectedMatch(true);
    }
  }, [setSelectedMatch, setShowSelectedMatch, nextEventsData, lastEventsData]);

  if (isFetching || isLoading || isFetchingLastEvents || isLoadingLastEvents) {
    return <></>;
  }

  const allEvents = [
    ...(lastEventsData?.events || []),
    ...(nextEventsData?.events || []),
  ].reverse();

  return (
    <>
      <div className='mb-2.5 flex w-full justify-between px-2 lg:w-1/2'>
        {(!isErrorLast || page > 0) && (
          <TwFilterButton onClick={() => setPage(page - 1)}>
            Previous
          </TwFilterButton>
        )}
        {/* <span>{page}</span> */}
        {(!isErrorNext || page < 0) && (
          <TwFilterButton onClick={() => setPage(page + 1)}>
            Next
          </TwFilterButton>
        )}
      </div>
      <div className='flex max-h-[75vh]'>
        <div className='w-1/2 flex-1 overflow-y-auto scrollbar xl:pl-2'>
          <ul className='space-y-1.5 '>
            {allEvents.map((match: any, idx: number) => {
              return (
                <TeamMatchRow
                  key={idx}
                  matchData={match}
                  teamId={team?.id}
                  // h2HFilter={h2HFilter}
                  // teamId={h2HFilter === 'home' ? homeTeam?.id : awayTeam?.id}
                  // type2nd={false}
                ></TeamMatchRow>
                // <li key={idx}>{match?.id}</li>
              );
            })}
          </ul>
        </div>
        {/* TODO add quick view here */}
        <div className='hidden flex-1 overflow-auto' css={[tw`lg:block`]}>
          <LeagueQuickViewSection></LeagueQuickViewSection>
        </div>
      </div>
    </>
  );
};

export default ManagerMatchesSection;
