import { use, useCallback, useEffect, useMemo, useState } from 'react';
import { SeasonDto, TournamentDto } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import {
  StandingFilter,
  StandingHeaderRow,
  StandingRow,
} from '@/components/modules/tennis/competition';
import { useSeasonStandingData } from '@/hooks/useTableTennis';
import { StandingStableSkeleton } from '@/components/modules/tennis/skeletons';
import { EmptyEvent } from '@/components/common/empty';
import RenderIf from '@/components/common/RenderIf';

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
  const { data, isLoading, refetch } = useSeasonStandingData(
    selectedSeason?.id
  );
  const [seasonData, setSeasonData] = useState<any>(null);
  const filterLabel = useMemo(() => {
    if (data?.standings) {
      return data.standings.map((item: { name: any }) => item.name);
    }
    return [];
  }, [data]);
  useEffect(() => {
    if (data?.standings) {
      setSeasonData(data.standings[0]);
      setStandingFilter(data.standings[0]?.name);
    }
  }, [data]);

  const changeStandingFilter = useCallback(
    (filter: string) => {
      if (data?.standings) {
        const selectedStanding = data.standings.find(
          (item: { name: string }) => item.name === filter
        );
        setStandingFilter(filter);
        setSeasonData(selectedStanding);
      }
    },
    [data]
  );

  useEffect(() => {
    refetch()
  }, [selectedSeason, uniqueTournament]);

  if (!selectedSeason) {
    return (
      <div className='flex flex-col gap-4 rounded-lg bg-white dark:bg-dark-container px-4 py-3'>
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
    <div className='flex flex-col gap-4 rounded-lg bg-white dark:bg-dark-container px-4 py-3'>
      <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
        {i18n.tab.standings}
      </h3>
      <RenderIf isTrue={!!seasonData?.rows?.length}>
        <StandingFilter
          filterLabel={filterLabel}
          standingFilter={standingFilter}
          setStandingFilter={changeStandingFilter}
        />
      </RenderIf>
      <div>
        <StandingHeaderRow />
        <ul>
          <RenderIf isTrue={!seasonData?.rows?.length}>
            <EmptyEvent title={i18n.common.nodata} content='' />
          </RenderIf>
          {seasonData?.rows.map((item: any, index: number) => (
            <StandingRow key={item.team.id} rank={index + 1} record={item} />
          ))}
        </ul>
      </div>
    </div>
  );
};
