import { use, useCallback, useEffect, useMemo, useState } from 'react';
import { SeasonDto, TournamentDto } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import {
  StandingFilter,
  StandingHeaderRow,
  StandingRow,
} from '@/components/modules/basketball/competition';
import { useSeasonStandingData } from '@/hooks/useBasketball';
import { StandingStableSkeleton } from '@/components/modules/basketball/skeletons';
import { EmptyEvent } from '@/components/common/empty';
import RenderIf from '@/components/common/RenderIf';
import clsx from 'clsx';
import { useDetectDeviceClient } from '@/hooks/useWindowSize';
import { cn } from '@/utils/tailwindUtils';

type StandingStableProps = {
  uniqueTournament?: TournamentDto;
  selectedSeason?: SeasonDto;
  isTabStandings?: boolean;

  uniqueTournamentId?: string;
  seasonId?: string;
  classNameTitle?: string,
};

export const StandingStable: React.FC<StandingStableProps> = ({
  uniqueTournament,
  selectedSeason,
  isTabStandings,

  uniqueTournamentId = '',
  seasonId = '',
  classNameTitle = ''
}) => {
  const i18n = useTrans();
  const { isMobile } = useDetectDeviceClient();
  const [standingFilter, setStandingFilter] = useState<string>('1');
  const { data, isLoading, refetch }: any = useSeasonStandingData(
    uniqueTournament?.id || uniqueTournamentId ,
    selectedSeason?.id || seasonId
  );
  const [seasonData, setSeasonData] = useState<any>(null);
  const filterLabel = useMemo(() => {
    if (data?.standings) {
      return data.standings.map((item: any) => ({
        id: item.id,
        name: item.name,
      }));
    }
    return [];
  }, [data]);

  useEffect(() => {
    if (data?.standings) {
      setSeasonData(data.standings[0]);
      setStandingFilter(data.standings[0]?.id);
    }
  }, [data]);

  const changeStandingFilter = useCallback(
    (filter: string) => {
      if (data?.standings) {
        const selectedStanding = data.standings.find(
          (item: any) => item.id === filter
        );
        setStandingFilter(filter);
        setSeasonData(selectedStanding);
      }
    },
    [data]
  );

  useEffect(() => { refetch()  }, [uniqueTournament]);
 
  if (!selectedSeason && !seasonId) {
    return (
      <div
        className={clsx(
          'flex flex-col gap-4 rounded-lg px-4 py-3',
          {
            'bg-transparent': isMobile,
            'bg-white dark:bg-dark-container': !isMobile,
          }
        )}
      >
        {isTabStandings && (
          <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
            {i18n.tab.standings}
          </h3>
        )}
        <EmptyEvent title={i18n.common.nodata} content='' />
      </div>
    );
  }

  if ( (selectedSeason?.id || seasonId ) && isLoading) {
    return <StandingStableSkeleton title={i18n.tab.standings} />;
  }

  return (
    <div className={cn(
      `flex flex-col gap-4 rounded-lg`,
      {
        'bg-transparent': isMobile,
        'pt-3 px-2 lg:px-0 dark:bg-dark-container': !isMobile || !isTabStandings,
      }
    )}>
      {!isTabStandings && (
        <h3 className={`font-primary font-bold uppercase text-black dark:text-white ${classNameTitle}`}>
          {i18n.tab.standings}
        </h3>
      )}
      <RenderIf isTrue={!!seasonData?.rows?.length}>
        <StandingFilter
          filterLabel={filterLabel}
          standingFilter={standingFilter}
          setStandingFilter={changeStandingFilter}
        />
      </RenderIf>
      {isTabStandings && <h2 className='text-csm font-bold text-black dark:text-white'>{filterLabel.length > 0 && filterLabel.find((item: any) => item.id === standingFilter)?.name.split('_').pop()}</h2>}
      <div className='rounded-lg overflow-hidden bg-white dark:bg-dark-card'>
        <StandingHeaderRow />
        <ul>
          <RenderIf isTrue={!seasonData?.rows?.length}>
            <EmptyEvent title={i18n.common.nodata} content='' />
          </RenderIf>
          {seasonData?.rows.map((item: any, index: number) => (
            <StandingRow
              key={item.team.id}
              rank={index + 1}
              record={item}
              locale={i18n.language}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
