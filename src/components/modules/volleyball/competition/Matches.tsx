import { SeasonDto, SportEventDtoWithStat } from '@/constant/interface';
import {
  useListMatchByStageTeamData,
  useStagesData,
} from '@/hooks/useBasketball';
import useTrans from '@/hooks/useTrans';
import { useTheme } from 'next-themes';
import MatchSkeleton from '@/components/common/skeleton/homePage/MatchSkeleton';
import { useMemo, useState } from 'react';
import { EmptyEvent } from '@/components/common/empty';
import RenderIf from '@/components/common/RenderIf';
import { useMatchLeague } from '@/hooks/useVolleyball';
import MatchRowLeague from '@/components/modules/volleyball/competition/MatchRowLeague';
import { useRouter } from 'next/navigation';
import { SPORT } from '@/constant/common';

type MatchesProps = {
  selectedSeason: SeasonDto;
};

export const Matches: React.FC<MatchesProps> = ({
  selectedSeason,
}) => {
  const i18n = useTrans();
  const { push } = useRouter();

  const { data: matchDataLast = [], isLoading: isMatchLoadingLast } =
    useMatchLeague(selectedSeason?.id, 'last');
  const { data: matchDataNext = [], isLoading: isMatchLoadingNext } =
    useMatchLeague(selectedSeason?.id, 'next');

  const matchData = useMemo(
    () => [...matchDataLast, ...matchDataNext],
    [matchDataLast, matchDataNext]
  );

  const onClick = (match: SportEventDtoWithStat) => {
    push(`/volleyball/match/${match.slug}/${match.id}`);
  };

  if (isMatchLoadingNext || isMatchLoadingLast) {
    return (
      <div className='flex flex-col gap-4 bg-white dark:bg-dark-container p-4'>
        <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
          {i18n.titles.matches}
        </h3>
        {/* {renderFilter()} */}
        <MatchSkeleton />
      </div>
    );
  }

  if (isMatchLoadingNext || (isMatchLoadingLast && !matchData?.length)) {
    return (
      <div className='flex flex-col gap-4 bg-white dark:bg-dark-container p-4'>
        <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
          {i18n.titles.matches}
        </h3>
        <EmptyEvent title={i18n.common.nodata} content={''} />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4 bg-white dark:bg-dark-container p-4'>
      <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
        {i18n.titles.matches}
      </h3>
      {/* {renderFilter()} */}
      <div>
        <RenderIf isTrue={!matchData?.length}>
          <EmptyEvent title={i18n.common.nodata} content='' />
        </RenderIf>
        {matchData?.map((match: any) => {
          return (
            <MatchRowLeague
              key={match?.id}
              match={match}
              i18n={i18n}
              onClick={onClick}
              sport={SPORT.VOLLEYBALL}
            />
          );
        })}
      </div>
    </div>
  );
};
