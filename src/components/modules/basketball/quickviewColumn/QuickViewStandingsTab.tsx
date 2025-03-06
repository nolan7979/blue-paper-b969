import useTrans from '@/hooks/useTrans';
import {
  IQuickViewStandingsTab,
} from '@/models/page/matchDetails';

import { useSeasonStandingData } from '@/hooks/useBasketball';
import { StandingHeaderRow } from '@/components/modules/basketball/components/StandingHeaderRow';
import { StandingRow } from '@/components/modules/basketball/components/StandingRow';
import dynamic from "next/dynamic";
import { SPORT } from '@/constant/common';
import { LeagueShortLink } from '@/components/modules/basketball/components/LeagueShortLink';

const StandingStableBkb = dynamic(
  () =>
    import('@/components/modules/basketball/competition').then(
      (mod) => mod.StandingStable
    ),
  { ssr: false }
);

const QuickViewStandingsTab = ({
  matchData,
}: IQuickViewStandingsTab) => {



  const {tournament , season_id = '' as string, homeTeam, awayTeam } = matchData;

  const { data, isLoading }: any = useSeasonStandingData(
    tournament?.id,
    season_id
  );

  if (isLoading || !data?.standings) {
    return <></>;
  }

  return (
    // <div className='space-y-4'>
    //   {
    //     data && data?.standings && data?.standings.length > 0 ? (
    //       <div className='w-full space-y-4'>{
    //         data?.standings.map((standing:any, index:number) => <GroupStandings key={standing?.name + index} standing={standing} i18n={i18n} homeId={homeTeam?.id} awayId={awayTeam?.id} />)
    //       }</div>
    //     ) : <NoStandings i18n={i18n} />
    //   }
    // </div>
    <div className='flex flex-col'>
      <LeagueShortLink tournament={tournament} sport={SPORT.BASKETBALL} />

      <StandingStableBkb
        classNameTitle='p-2'
        uniqueTournamentId={tournament?.id}
        seasonId={season_id}
      ></StandingStableBkb>
    </div>
  );
};

export default QuickViewStandingsTab;

export const GroupStandings = ({standing, i18n, homeId, awayId}:any) => {
  return (
    <div className='bg-white dark:bg-dark-card rounded-lg'>
      <h3 className='text-csm px-3 py-2'>{standing?.name}</h3>
      <div className='overflow-x-auto scrollbar border border-light-theme dark:border-head-tab rounded-b-lg'>
        <StandingHeaderRow />
        <ul className='w-full'>
          {standing?.rows.map((item: any, index: number) => (
            <StandingRow key={item.team.id} rank={index + 1} record={item} locale={i18n.language} homeId={homeId} awayId={awayId} />
          ))}
        </ul>
      </div>
    </div>
  )
}

export const NoStandings = ({i18n}:any) => {
  return (
    <div className='bg-white dark:bg-dark-card'>
      <div className='overflow-x-auto scrollbar border border-light-theme dark:border-head-tab rounded-lg'>
        <StandingHeaderRow />
        <div className='text-center py-3 text-csm'>{i18n.common.nodata}</div>
      </div>
    </div>
  )
}