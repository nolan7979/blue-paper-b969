import { ShowTopPlayers } from '@/components/modules/football/competition/ShowTopPlayers';
import TopPlayerFilter from '@/components/modules/football/competition/TopPlayerFilter';
import { TwCard } from '@/components/modules/football/tw-components';
import { useTeamOfTheWeekRoundData } from '@/hooks/useFootball';

const TeamOfTheWeekSection = ({
  uniqueTournament,
  selectedSeason,
  i18n,
}: {
  uniqueTournament: any;
  selectedSeason: any;
  i18n: any;
}) => {
  const { data, isLoading } = useTeamOfTheWeekRoundData(
    uniqueTournament?.id,
    selectedSeason?.id
  );
  if (isLoading || !data || data.rounds?.length == 0) return <></>;

  return (
    <TwCard className='space-y-4 !rounded-lg bg-white dark:bg-dark-container p-4'>
      <div>
        <div className='flex items-center justify-between pb-2.5'>
          <span className='font-primary font-bold uppercase text-black dark:text-white'>
            {i18n.common.TOP_LINEUPS}
          </span>
          <TopPlayerFilter
            uniqueTournament={uniqueTournament}
            selectedSeason={selectedSeason}
            i18n={i18n}
            data={data}
          />
        </div>

        <ShowTopPlayers data={data} />
      </div>
    </TwCard>
  );
};
export default TeamOfTheWeekSection;
