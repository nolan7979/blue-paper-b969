import { StandingStableSkeleton } from '@/components/modules/football/skeletons';
import { SPORT } from '@/constant/common';
import { SeasonDto, TournamentDto } from '@/constant/interface';
import { useSeasonStandingCommonData } from '@/hooks/useCommon';
// import { useSeasonStandingsData } from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';
import { LeagueStandingsSection } from '@/modules/football/competition/components/LeagueStandingsSection';
import StandingHeaderRowCommon from '@/modules/standings/table-standing/StandingHeaderRowCommon';
import StandingRowCommon from '@/modules/standings/table-standing/StandingRowCommon';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

type StandingStableProps = {
  uniqueTournament: TournamentDto;
  selectedSeason: SeasonDto;
  sport: SPORT;
};

const StandingStableCommon: React.FC<StandingStableProps> = ({
  uniqueTournament,
  selectedSeason,
  sport
}) => {
  const i18n = useTrans();

  const { data, isLoading } = useSeasonStandingCommonData(
    uniqueTournament?.id,
    selectedSeason?.id,
    sport
  );

  if (selectedSeason?.id && isLoading) {
    return <StandingStableSkeleton title={i18n.tab.standings} />;
  }

  return (
    <div className='space-y-4 p-4'>
      {
        data && data?.standings && data?.standings.length > 0 ? (
          <div className='w-full space-y-4'>{
            data?.standings.map((standing:any, index:number) => <GroupStandings key={standing?.name + index} standing={standing} sport={sport} />)
          }</div>
        ) : <NoStandings i18n={i18n} sport={sport} />
      }
    </div>
  );
};

export default StandingStableCommon;

export const GroupStandings = ({standing, sport}:any) => {
  return (
    <div className='bg-white dark:bg-dark-card rounded-lg'>
      <h3 className='text-csm px-3 py-2'>{standing?.name}</h3>
      <div className='overflow-x-auto scrollbar border border-light-theme dark:border-head-tab rounded-b-lg'>
        <StandingHeaderRowCommon sport={sport} />
        <ul className='w-full'>
          {standing?.rows.map((item: any, index: number) => (
            <StandingRowCommon key={item.team.id} standingData={item} sport={sport} />
          ))}
        </ul>
      </div>
    </div>
  )
}

export const NoStandings = ({i18n, sport}:any) => {
  return (
    <div className='bg-white dark:bg-dark-card'>
      <div className='overflow-x-auto scrollbar border border-light-theme dark:border-head-tab rounded-lg'>
        <StandingHeaderRowCommon sport={sport} />
        <div className='text-center py-3 text-csm'>{i18n.common.nodata}</div>
      </div>
    </div>
  )
}