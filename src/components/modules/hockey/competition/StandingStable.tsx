import { SeasonDto, TournamentDto } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import {
  StandingHeaderRow,
  StandingRow,
} from '@/components/modules/hockey/competition';
import { useSeasonStandingData } from '@/hooks/useHockey';
import { StandingStableSkeleton } from '@/components/modules/hockey/skeletons';
import { EmptyEvent } from '@/components/common/empty';

type StandingStableProps = {
  uniqueTournament: TournamentDto;
  selectedSeason: SeasonDto;
  currIdClub?: string;
};

export const StandingStable: React.FC<StandingStableProps> = ({
  uniqueTournament,
  selectedSeason,
  currIdClub
}) => {
  const i18n = useTrans();
  const { data, isLoading }: any = useSeasonStandingData(
    uniqueTournament?.id,
    selectedSeason?.id
  );

  if (!selectedSeason) {
    return (
      <div className='flex flex-col gap-4 lg:rounded-lg bg-white dark:bg-dark-container px-4 py-3'>
        <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
          {i18n.tab.standings}
        </h3>{' '}
        <EmptyEvent title={i18n.common.nodata} content='' />
      </div>
    );
  }

  if (selectedSeason?.id && isLoading) {
    return <StandingStableSkeleton title={i18n.tab.standings} />;
  }

  return (
    <div className='flex flex-col gap-4 lg:rounded-lg bg-white dark:bg-dark-container px-4 py-3'>
      <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
        {i18n.tab.standings}
      </h3>
      {data && data?.standings && data?.standings.length > 0 ? (
        <div className='w-full space-y-4'>{
          data?.standings.map((standing:any, index:number) => <GroupStandings key={standing?.name + index} standing={standing} i18n={i18n} currIdClub={currIdClub} />)
        }</div>
      ) : (
        <EmptyEvent title={i18n.common.nodata} content='' />
      )}
    </div>
  );
};

const GroupStandings = ({standing, i18n, currIdClub}:any) => {
  return (
    <>
      <h3 className='text-csm mb-3'>{standing?.name}</h3>
      <div className='overflow-x-auto scrollbar border dark:border-head-tab rounded-lg'>
        <StandingHeaderRow />
        <ul className='w-full'>
          {standing?.rows.map((item: any, index: number) => (
            <StandingRow key={item.team.id} rank={index + 1} record={item} locale={i18n.language} currIdClub={currIdClub} />
          ))}
        </ul>
      </div>
    </>
  )
}