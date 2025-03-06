import clsx from 'clsx';
import { RankingDto, RankingRecordDto, SeasonDto } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { SelectTeam } from '@/components/modules/basketball/selects';
import {
  TopPlayerRow,
  RankingHeaderRow,
  formatProperties,
  type Option,
} from '@/components/modules/basketball/competition';
import {
  useSeasonalPlayerStatTyeData,
  useTopPlayerBySeasonData,
} from '@/hooks/useBasketball';
import { useMemo, useState } from 'react';
import React from 'react';
import { Divider } from '@/components/modules/basketball/quickviewColumn';
import { TopTeamSkeleton } from '@/components/modules/basketball/skeletons';
import RenderIf from '@/components/common/RenderIf';
import { EmptyEvent } from '@/components/common/empty';
import Raking from '@/components/common/skeleton/competition/Raking';
import { useDetectDeviceClient } from '@/hooks/useWindowSize';

type TopPlayerProps = {
  selectedSeason: SeasonDto;
  isShowedHeader?: boolean;
};

export const TopPlayer: React.FC<TopPlayerProps> = ({
  selectedSeason,
  isShowedHeader = true,
}) => {
  const i18n = useTrans();
  const { isMobile } = useDetectDeviceClient();
  const [type, setType] = useState<Option>({ id: '', name: '' });
  const [stat, setStat] = useState<Option>({ id: '', name: '' });

  const { data: typeData, isLoading: isTypeDataLoading } =
    useSeasonalPlayerStatTyeData(selectedSeason?.id);

  const typeId = typeData?.[0]?.scope;

  const { data, isLoading } = useTopPlayerBySeasonData(
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
      className={clsx('bg-dark-con flex flex-col gap-4 rounded-lg pb-4', {
        'bg-transparent': isMobile,
        'bg-white pt-4 dark:bg-dark-container': !isMobile,
      })}
    >
      {isShowedHeader && (
        <h3 className='px-4 font-primary font-bold uppercase text-black dark:text-white'>
          {i18n.titles.top_players}
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
          className={clsx('flex flex-col gap-[0.375rem] lg:px-4', {
            hidden: isTypeDataLoading,
          })}
        >
          <div className='flex-1'>
            <SelectTeam
              size='full'
              isDisplayLogo={false}
              options={mapTypeData}
              valueGetter={setType}
            />
          </div>
          <div className='flex-1'>
            <SelectTeam
              className={clsx({
                hidden: !stat,
                block: !!stat,
              })}
              key={`player-${type?.id}`}
              size='full'
              isDisplayLogo={false}
              options={mapStatsData}
              valueGetter={setStat}
            />
          </div>
        </div>
        {isTypeDataLoading && <TopTeamSkeleton />}
        <div>
          <RankingHeaderRow
            mailLabel={i18n.titles.players}
            statLabel={stat?.name}
          />
          <div className='py-2.5'>
            {Array.isArray(dataShow[stat?.id]) &&
              dataShow[stat?.id]?.map((item, index: number) => {
                return (
                  <React.Fragment key={item?.player?.id}>
                    <TopPlayerRow
                      rank={index + 1}
                      record={item}
                      stats={String(stat.id)}
                    />
                    <Divider />
                  </React.Fragment>
                );
              })}
          </div>
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
