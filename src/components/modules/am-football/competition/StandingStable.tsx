import { use, useCallback, useEffect, useMemo, useState } from 'react';
import { SeasonDto, TournamentDto } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import {
  StandingFilter,
  StandingHeaderRow,
  StandingRow,
} from '@/components/modules/am-football/competition';
import { StandingStableSkeleton } from '@/components/modules/basketball/skeletons';
import { EmptyEvent } from '@/components/common/empty';
import RenderIf from '@/components/common/RenderIf';
import { useSeasonStandingData } from '@/hooks/useAmericanFootball';
import { useDetectDeviceClient } from '@/hooks';
import clsx from 'clsx';
import { cn } from '@/utils/tailwindUtils';

type StandingStableProps = {
  uniqueTournament: TournamentDto;
  selectedSeason: SeasonDto;
  isTeam?: Boolean;
  teamPageId?: String;
  isShowedHeader?: Boolean;
};

export const StandingStable: React.FC<StandingStableProps> = ({
  uniqueTournament,
  selectedSeason,
  isTeam,
  teamPageId,
  isShowedHeader = true,
}) => {
  const i18n = useTrans();
  const { isMobile } = useDetectDeviceClient();
  const [standingFilter, setStandingFilter] = useState<string>('1');
  const { data = [] as any, isLoading } = useSeasonStandingData(
    selectedSeason?.id
  );
  const [seasonData, setSeasonData] = useState<any>(null);
  const filterLabel = useMemo(() => {
    if (data) {
      return data.map((item: { name: any }) => item.name);
    }
    return [];
  }, [data]);

  useEffect(() => {
    if (data) {
      setSeasonData(data[0]);
      setStandingFilter(data[0]?.name);
    }
  }, [data]);

  const changeStandingFilter = useCallback(
    (filter: any) => {
      if (data) {
        const selectedStanding = data.find(
          (item: { name: string }) => item.name === filter.name
        );
        setStandingFilter(filter.name);
        setSeasonData(selectedStanding);
      }
    },
    [data]
  );

  if (!selectedSeason) {
    return (
      <div
        className={clsx(
          'flex flex-col gap-4 rounded-lg px-4',
          {
            'bg-white py-3 dark:bg-dark-container': !isMobile,
            'bg-transparent': isMobile,
          }
        )}
      >
        {isShowedHeader && (
          <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
            {i18n.tab.standings}
          </h3>
        )}
        <EmptyEvent title={i18n.common.nodata} content='' />
      </div>
    );
  }

  if (selectedSeason?.id && isLoading) {
    return <StandingStableSkeleton title={i18n.tab.standings} />;
  }

  return (
    <div
      className={clsx(
        'flex flex-col gap-4 rounded-lg px-4',
        {
          'bg-white py-3 dark:bg-dark-container': !isMobile,
          'bg-transparent': isMobile,
        }
      )}
    >
      {!isTeam && isShowedHeader && (
        <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
          {i18n.tab.standings}
        </h3>
      )}
      <RenderIf isTrue={!!seasonData?.rows?.length}>
        <div className={isTeam ? ' absolute -top-12 right-4' : ''}>
          <StandingFilter
            filterLabel={filterLabel}
            standingFilter={standingFilter}
            setStandingFilter={changeStandingFilter}
          />
        </div>
      </RenderIf>
      <div>
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
              teamPageId={teamPageId}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
