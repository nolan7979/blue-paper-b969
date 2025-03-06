import useTrans from '@/hooks/useTrans';
import { useSeasonStandingData } from '@/hooks/useBasketball';
import { GroupStandings, NoStandings } from '@/components/modules/basketball/quickviewColumn/QuickViewStandingsTab';

export const LeagueStandingsSection = ({
  tournamentId = '',
  seasonId = '',
}: any) => {
  const i18n = useTrans();

  const { data, isLoading }: any = useSeasonStandingData(
    tournamentId,
    seasonId
  );

  if (isLoading || !data?.standings) {
    return <></>;
  }

  return (
    <div className='space-y-4'>
      {
        data && data?.standings && data?.standings.length > 0 ? (
          <div className='w-full space-y-4'>{
            data?.standings.map((standing:any, index:number) => <GroupStandings key={standing?.name + index} standing={standing} i18n={i18n} />)
          }</div>
        ) : <NoStandings i18n={i18n} />
      }
    </div>
  );
};
