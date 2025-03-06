import { SeasonDto, SportEventDtoWithStat } from '@/constant/interface';
import {
  useListMatchByStageTeamData,
  useStagesData,
} from '@/hooks/useBasketball';
import useTrans from '@/hooks/useTrans';
import { MatchRowIsolated as BkbMatchRowIsolated } from '@/components/modules/basketball/match';
import { useTheme } from 'next-themes';
import MatchSkeleton from '@/components/common/skeleton/homePage/MatchSkeleton';
import { useMemo, useState } from 'react';
import { SelectTeam } from '@/components/modules/basketball/selects';
import { EmptyEvent } from '@/components/common/empty';
import RenderIf from '@/components/common/RenderIf';
import clsx from 'clsx';
import { useDetectDeviceClient } from '@/hooks';

type MatchesProps = {
  selectedSeason: SeasonDto;
};

export const Matches: React.FC<any> = ({
  teams,
  selectedSeason,
  isShowedHeader = true,
}) => {
  const i18n = useTrans();
  const { isMobile } = useDetectDeviceClient();
  const { resolvedTheme } = useTheme();
  const [team1, setTeam1] = useState<any>({});
  const [team2, setTeam2] = useState<any>({});
  const [stage, setStage] = useState<any>({});

  const { data: stagesData = [], isLoading: isStagesLoading } = useStagesData(
    selectedSeason?.id
  );

  const { data: listMatchData, isLoading: isListMatchLoading } =
    useListMatchByStageTeamData(
      selectedSeason?.id,
      [team1?.id || '', team2?.id || ''],
      stage?.id || ''
    );

  const defaultFilter = useMemo(() => ({ id: '', name: i18n.filter.all }), [i18n]);

  const onClick = (match: SportEventDtoWithStat) => {
    window.location.href = `/basketball/match/${match.slug}/${match.id}`;
  };

  const renderFilter = () => {
    return (
      <div className='flex gap-2'>
        <SelectTeam
          className='w-1/3'
          options={[defaultFilter, ...teams]}
          valueGetter={setTeam1}
          size='full'
          label='shortName'
        />
        <SelectTeam
          className='w-1/3'
          options={[defaultFilter, ...teams]}
          valueGetter={setTeam2}
          size='full'
          label='shortName'
        />
        <SelectTeam
          className='w-1/3'
          options={[defaultFilter, ...stagesData]}
          valueGetter={setStage}
          size='full'
          label='shortName'
          isDisplayLogo={false}
        />
      </div>
    );
  };

  if (isListMatchLoading) {
    return (
      <div
        className={clsx('flex flex-col gap-4 p-4', {
          'bg-transparent': isMobile,
          'bg-white dark:bg-dark-container': !isMobile,
        })}
      >
        {isShowedHeader && (
          <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
            {i18n.titles.matches}
          </h3>
        )}
        {renderFilter()}
        <MatchSkeleton />
      </div>
    );
  }

  if (isStagesLoading && !listMatchData?.length) {
    return (
      <div
        className={clsx(
          'flex flex-col gap-4 p-4',
          {
            'bg-transparent': isMobile,
            'bg-white dark:bg-dark-container': !isMobile,
          }
        )}
      >
        {isShowedHeader && (
          <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
            {i18n.titles.matches}
          </h3>
        )}
        <EmptyEvent title={i18n.common.nodata} content={''} />
      </div>
    );
  }

  return (
    <div
      className={clsx('flex flex-col gap-4 px-2.5 lg:px-4 pb-4 rounded-md', {
        'bg-transparent': isMobile,
        'bg-white pt-4 dark:bg-dark-container': !isMobile,
      })}
    >
      {isShowedHeader && (
        <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
          {i18n.titles.matches}
        </h3>
      )}
      {renderFilter()}
      <div>
        <RenderIf isTrue={!listMatchData?.length}>
          <EmptyEvent title={i18n.common.nodata} content='' />
        </RenderIf>
        <div className='space-y-2'>
          {listMatchData?.map((match: any) => {
            return (
              <BkbMatchRowIsolated
                key={match?.id}
                match={match}
                i18n={i18n}
                theme={resolvedTheme}
                isSimulator={false}
                onClick={onClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
