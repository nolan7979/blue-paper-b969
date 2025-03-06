import useTrans from '@/hooks/useTrans';
import {
  RankingHeaderRow,
  TopTeamRow,
} from '@/components/modules/basketball/competition';
import { SelectTeam } from '@/components/modules/basketball/selects';
import { RankingDto, SeasonDto } from '@/constant/interface';
import {
  useTopTeamBySeasonData,
  useSeasonalTeamStatTyeData,
} from '@/hooks/useBasketball';
import { useMemo, useState } from 'react';
import { TopTeamSkeleton } from '@/components/modules/basketball/skeletons';
import React from 'react';
import { Divider } from '@/components/modules/basketball/quickviewColumn';
import clsx from 'clsx';
import RenderIf from '@/components/common/RenderIf';
import { EmptyEvent } from '@/components/common/empty';
import Raking from '@/components/common/skeleton/competition/Raking';
import { useDetectDeviceClient } from '@/hooks';

type TopTeamProps = {
  selectedSeason: SeasonDto;
  isShowedHeader?: boolean;
};

export type Option = {
  id: string | number;
  name: string;
};

export const formatProperties = (str: string) => {
  const spacedStr = str.replace(/([A-Z])/g, ' $1');
  const result = spacedStr.charAt(0).toUpperCase() + spacedStr.slice(1);

  return result;
};

export const TopTeam: React.FC<TopTeamProps> = ({
  selectedSeason,
  isShowedHeader = true,
}) => {
  const i18n = useTrans();
  const { isMobile } = useDetectDeviceClient();
  const [type, setType] = useState<Option>({ id: '', name: '' });
  const [stat, setStat] = useState<Option>({ id: '', name: '' });

  const { data: typeData, isLoading: isTypeDataLoading } =
    useSeasonalTeamStatTyeData(selectedSeason?.id);

  const typeId = typeData?.[0]?.scope;

  const { data, isLoading } = useTopTeamBySeasonData(
    selectedSeason?.id,
    Number(type?.id || typeId)
  );

  const mapStatsData = useMemo(() => {
    if (!data) return [];

    return Object.keys(data).map((key) => ({
      id: key,
      name:
        (i18n.statsLabel as Record<string, string>)[key] ||
        formatProperties(key),
    }));
  }, [data, i18n]);

  const mapTypeData = useMemo(() => {
    if (!typeData) return [];

    return typeData.map((item) => ({
      id: item.scope,
      name: item.name,
    }));
  }, [typeData]);

  

  const dataShow = useMemo(() => {
    const formatData: RankingDto = {};

    if (!data) return formatData;

    Object.keys(data).forEach((key) => {
      formatData[key] = data[key].sort(
        (
          a: { statistics: { [key: string]: number } },
          b: { statistics: { [key: string]: number } }
        ) => b.statistics[stat?.id] - a.statistics[stat?.id]
      );
    });

    return formatData;
  }, [data]);

  return (
    <div
      className={clsx(
        'bg-dark-con flex flex-col gap-4 rounded-lg pb-4',
        {
          'bg-transparent': isMobile,
          'bg-white pt-4 dark:bg-dark-container': !isMobile,
        }
      )}
    >
      {isShowedHeader && (
        <h3 className='px-4 font-primary font-bold uppercase text-black dark:text-white'>
          {i18n.titles.top_team}
        </h3>
      )}
      <RenderIf
        isTrue={(!isTypeDataLoading && !typeData?.length) || !selectedSeason}
      >
        <EmptyEvent title={i18n.common.nodata} content='' />
      </RenderIf>
      <RenderIf
        isTrue={selectedSeason && (isTypeDataLoading || !!typeData?.length)}
      >
        <div
          className={clsx('flex flex-col gap-[0.375rem] px-4', {
            hidden: isTypeDataLoading,
          })}
        >
          <div className='flex-1'>
            <SelectTeam
              size='full'
              isDisplayLogo={false}
              options={mapTypeData}
              valueGetter={setType}
              i18n={i18n}
            />
          </div>
          <div className='flex-1'>
            <SelectTeam
              className={clsx({
                hidden: !stat,
                block: !!stat,
              })}
              key={`team-${type?.id}`}
              size='full'
              isDisplayLogo={false}
              options={mapStatsData}
              valueGetter={setStat}
              i18n={i18n}
            />
          </div>
        </div>
        {isTypeDataLoading && <TopTeamSkeleton />}
        <div>
          <RankingHeaderRow statLabel={stat?.name} />
          {Array.isArray(dataShow[stat?.id]) &&
            dataShow[stat?.id]?.map((item, index: number) => {
              return (
                <React.Fragment key={item.team.id}>
                  <TopTeamRow
                    rank={index + 1}
                    record={item}
                    stats={String(stat.id)}
                  />
                  <Divider />
                </React.Fragment>
              );
            })}
          {isLoading && (
            <div className='flex h-fit w-full  flex-col gap-3 rounded-xl px-2 py-8'>
              {Array.from({ length: 9 }, (_, index) => index + 1).map(
                (number) => (
                  <Raking key={number} />
                )
              )}
            </div>
          )}
        </div>
      </RenderIf>
    </div>
  );
};
