import { StandingStableSkeleton } from '@/components/modules/football/skeletons';
import { SeasonDto, TournamentDto } from '@/constant/interface';
import { useSeasonStandingsData } from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';
import { LeagueStandingsSection } from '@/modules/football/competition/components/LeagueStandingsSection';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

type StandingStableProps = {
  uniqueTournament: TournamentDto;
  selectedSeason: SeasonDto;
};

export const StandingStable: React.FC<StandingStableProps> = ({
  uniqueTournament,
  selectedSeason,
}) => {
  const i18n = useTrans();
  const [standingFilter, setStandingFilter] = useState<string>('1');

  const { data, isLoading } = useSeasonStandingsData(
    uniqueTournament?.id,
    selectedSeason?.id,
    '',
    'total',
    true
  );

  const [seasonData, setSeasonData] = useState<Record<string, any>[]>([]);
  const filterLabel = useMemo(() => {
    if (data?.stage) {
      return data.stage.map((item: { name: string; id: string }) => ({
        name: item.name,
        id: item.id,
      }));
    }
    return [];
  }, [data]);

  useEffect(() => {
    if (data?.standings) {
      const firstFilter = data.stage[0]?.id;
      const selectedStanding = data.standings.filter(
        (item: any) => item.stage_id === firstFilter
      );
      setSeasonData(selectedStanding);
      setStandingFilter(firstFilter);
    } else {
      setSeasonData([]);
    }
  }, [data]);

  const changeStandingFilter = useCallback(
    (filter: string) => {
      if (data?.standings) {
        const selectedStanding = data.standings.filter(
          (item: { stage_id: string }) => item.stage_id === filter
        );
        setStandingFilter(filter);
        setSeasonData(selectedStanding);
      }
    },
    [data]
  );

  // if (!selectedSeason) {
  //   return (
  //     <div className='flex flex-col gap-4 rounded-lg bg-white dark:bg-dark-container px-4 py-3'>
  //       <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
  //         {i18n.tab.standings}
  //       </h3>{' '}
  //       <EmptyEvent title={i18n.common.nodata} content='' />
  //     </div>
  //   );
  // }

  if (selectedSeason?.id && isLoading) {
    return <StandingStableSkeleton title={i18n.tab.standings} />;
  }

  return (
    <div className='flex flex-col gap-4 rounded-lg bg-white dark:bg-dark-container px-4 py-3'>
      <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
        {i18n.tab.standings}
      </h3>
      {/* <RenderIf isTrue={seasonData.length > 0}>
        <StandingFilter
          filterLabel={filterLabel}
          standingFilter={standingFilter}
          setStandingFilter={changeStandingFilter}
        />
      </RenderIf> */}
        <LeagueStandingsSection
          tournamentId={uniqueTournament?.id}
          seasonId={selectedSeason?.id}
          uniqueTournament={true}
          forTeam={false}
        />
      {/* <div>
        <ul className='space-y-4 lg:h-[80vh] lg:overflow-x-auto'>
          <RenderIf isTrue={seasonData?.length === 0}>
            <EmptyEvent title={i18n.common.nodata} content='' />
          </RenderIf>
          {seasonData?.map((item: any, index: number) => {
            return (
              <React.Fragment key={item?.name}>
                <div className='ml-2'>
                  <h4 className='font-primary font-bold text-white'>
                    {item?.name.split('_').slice(0, -1).pop()}
                  </h4>
                </div>
                <div key={`${item}-${index}`} className='space-y-1 rounded-t-md border border-[#171B2E]'>
                  <StandingHeaderRow />
                  <div>
                    {item?.rows?.map((row: any, idx: number) => (
                      <StandingRow
                        key={row.team.id}
                        rank={idx + 1}
                        record={row}
                      />
                    ))}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </ul>
      </div> */}
    </div>
  );
};
