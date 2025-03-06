import { useMatchTeamStreaksData } from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';

import Streak from '@/components/common/skeleton/homePage/Streak';

import { ITeamStreaksData, SportEventDto } from '@/constant/interface';
import TeamStreakSection from '@/components/modules/football/teams/TeamStreakSection';
import H2HStreakSection from '@/components/modules/football/quickviewColumn/quickViewMatchesTab/H2HStreakSection';

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

  const { general, head2head } = data as ITeamStreaksData;

  return (
    <>
      {general.length === 0 ? (
        <></>
      ) : (
        <TeamStreakSection
          general={general}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
        />
      )}
      {head2head.length === 0 ? (
        <></>
      ) : (
        <H2HStreakSection
          head2head={head2head}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
        />
      )}
    </>
  );
};
