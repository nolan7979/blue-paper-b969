import { useRoundMatchesData } from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';

import { useLeagueMatchFilterStore } from '@/stores';

import { MatchRowIsolated } from '@/components/modules/football/match/MatchRowIsolated';
import { RoundFilterSection } from '@/modules/football/competition/components';
import { getSlug } from '@/utils';
import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import { useRouter } from 'next/navigation';
import { TwSectionWrapper } from '@/components/modules/common';
import { EmptyEvent } from '@/components/common/empty';

export const FixturesMatchesByRoundSection = ({
  uniqueTournament,
  selectedSeason,
}: {
  uniqueTournament: any;
  selectedSeason: any;
}) => {
  const i18n = useTrans();
  const { selectedRound } = useLeagueMatchFilterStore();
  const router = useRouter();
  const {
    data = {},
    isLoading,
    isFetching,
    isError,
  } = useRoundMatchesData(
    uniqueTournament?.id,
    selectedSeason?.id,
    selectedRound?.stage_id || '',
    getSlug(selectedRound?.name || '')
  );

  // useEffect(() => {
  //   const { events = [] } = data || {};
  //   if (!isValEmpty(events)) {
  //     setSelectedMatch(events[0]?.id || events[0].customId);
  //     setShowSelectedMatch(true);O
  //   }
  // }, [data, selectedRound, setSelectedMatch, setShowSelectedMatch]);

  const { hasNextPage, events = [] } = data || {};

  const onClickMatch = (match: any) => {
    router.push(`/football/match/${match?.id}`);
  };

  if (isError) {
    return <></>;
  }

  return (
    <>
      <div className='space-y-2.5 p-2.5 bg-white rounded-md dark:bg-transparent'>
        <div className='flex items-center justify-between lg:flex-col lg:justify-start lg:items-start'>
          <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
            {i18n.titles.matches}
          </h3>
          <div className='w-full max-w-32 lg:max-w-50'>
            <RoundFilterSection
              uniqueTournamentId={uniqueTournament?.id}
              selectedSeasonId={selectedSeason?.id}
            />
          </div>
        </div>

        {!isLoading && events.length === 0 && (
          <TwSectionWrapper>
            <EmptyEvent
              title={i18n.notification.notiTitle}
              content={i18n.notification.notiContent}
            />
          </TwSectionWrapper>
        )}

        <ul className='space-y-1'>
          {isLoading ? (
            <MatchSkeletonMapping />
          ) : (
            events
              .sort((m1: any, m2: any) => {
                return m1.startTimestamp - m2.startTimestamp;
              })
              .map((match: any, idx: number) => {
                return (
                  <MatchRowIsolated
                    key={`${match?.id}-${idx}`}
                    match={match}
                    i18n={i18n}
                    isSimulator={false}
                    onClick={onClickMatch}
                  ></MatchRowIsolated>
                );
              })
          )}
        </ul>
      </div>
    </>
  );
};
