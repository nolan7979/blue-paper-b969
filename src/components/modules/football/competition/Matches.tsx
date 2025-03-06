import { SeasonDto, SportEventDtoWithStat } from '@/constant/interface';
import {
  useListMatchByStageTeamData,
  useStagesData,
} from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';
import { useTheme } from 'next-themes';
import MatchSkeleton from '@/components/common/skeleton/homePage/MatchSkeleton';
import { useMemo, useState } from 'react';
import { SelectTeam } from '@/components/modules/basketball/selects';
import { EmptyEvent } from '@/components/common/empty';
import RenderIf from '@/components/common/RenderIf';
import { MatchRowIsolated } from '@/components/modules/football/match/MatchRowIsolated';

type MatchesProps = {
  selectedSeason: SeasonDto;
};

export const Matches: React.FC<any> = ({ teams, selectedSeason }) => {
  const i18n = useTrans();
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

  const defaultFilter = useMemo(() => ({ id: '', name: i18n.filter.all }), []);

  const onClick = (match: SportEventDtoWithStat) => {
    window.location.href = `/football/match/${match.slug}/${match.id}`;
  };

  const renderFilter = () => {
    return (
      <div className='flex flex-col gap-2 lg:flex-row'>
        <SelectTeam
          options={[defaultFilter, ...teams]}
          valueGetter={setTeam1}
          size='full'
          label='shortName'
        />
        <SelectTeam
          options={[defaultFilter, ...teams]}
          valueGetter={setTeam2}
          size='full'
          label='shortName'
        />
        <SelectTeam
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
      <div className='flex flex-col gap-4 bg-white p-4 dark:bg-dark-container'>
        <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
          {i18n.titles.matches}
        </h3>
        {renderFilter()}
        <MatchSkeleton />
      </div>
    );
  }

  if (isStagesLoading && !listMatchData?.length) {
    return (
      <div className='flex flex-col gap-4 bg-white p-4 dark:bg-dark-container'>
        <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
          {i18n.titles.matches}
        </h3>
        <EmptyEvent title={i18n.common.nodata} content={''} />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4 bg-white p-4 dark:bg-dark-container'>
      <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
        {i18n.titles.matches}
      </h3>
      {renderFilter()}
      <div>
        <RenderIf isTrue={!listMatchData?.length}>
          <EmptyEvent title={i18n.common.nodata} content='' />
        </RenderIf>
        <div className='space-y-2'>
          {listMatchData?.map((match: any) => {
            return (
              <MatchRowIsolated
                isDetail={false}
                match={match}
                i18n={i18n}
                theme={resolvedTheme}
                showYellowCard={false}
                showRedCard={false}
                homeSound={''}
                onClick={onClick}
                isSimulator={false}
                sport={'football'}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
