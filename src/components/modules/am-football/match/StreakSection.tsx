import { useH2HData, useMatchTeamStreaksData } from '@/hooks/useBasketball';
import useTrans from '@/hooks/useTrans';

import Streak from '@/components/common/skeleton/homePage/Streak';

import { ITeamStreaksData, SportEventDto } from '@/constant/interface';
import TeamStreakSection from '@/components/modules/basketball/teams/TeamStreakSection';
import H2HStreakSection from '@/components/modules/basketball/quickviewColumn/quickViewMatchesTab/H2HStreakSection';
import H2HBasketball from '@/components/modules/basketball/components/H2HBasketball';

export const StreakSection = ({ matchData }: { matchData: SportEventDto }) => {
  const { id: matchId, homeTeam, awayTeam, startTimestamp } = matchData;
  const i18n = useTrans();
  const { data, isLoading, error } = useMatchTeamStreaksData(
    matchId,
    homeTeam.id!,
    awayTeam.id!,
    startTimestamp,
    i18n.language
  );

  const {
    data: h2hData,
    isLoading: isLoadingH2H,
    isFetching: isFetchingH2H,
  } = useH2HData(matchId, homeTeam?.id, awayTeam?.id, startTimestamp);

  if (isLoading) {
    return (
      <div className='rounded-lg bg-light-main px-4 py-2 dark:bg-dark-skeleton'>
        <Streak />
      </div>
    );
  }
  if (error) {
    return <></>;
  }

  const { generalTotal, generalPerLastX, head2HeadTotal, head2HeadPerLastX } =
    data as ITeamStreaksData | any;

  return (
    <>
      {generalTotal.length === 0 ? (
        <></>
      ) : (
        <TeamStreakSection
          general={[...generalTotal, ...generalPerLastX]}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
        />
      )}
      {head2HeadTotal.length === 0 ? (
        <></>
      ) : (
        <H2HStreakSection
          head2head={[...head2HeadTotal, ...head2HeadPerLastX]}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
        />
      )}
      {/* if h2hData */}
      <H2HBasketball
        head2head={h2hData}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
      />
    </>
  );
};
