import { SeasonDto, SportEventDtoWithStat } from '@/constant/interface';
import {
  useListMatchByStageTeamData,
  useStagesData,
} from '@/hooks/useBasketball';
import useTrans from '@/hooks/useTrans';
import { useTheme } from 'next-themes';
import MatchSkeleton from '@/components/common/skeleton/homePage/MatchSkeleton';
import { useState } from 'react';
import { EmptyEvent } from '@/components/common/empty';
import RenderIf from '@/components/common/RenderIf';
import { useMatchLeague } from '@/hooks/useBadminton';
import MatchRowLeague from '@/components/modules/badminton/competition/MatchRowLeague';
import { useRouter } from 'next/router';

type MatchesProps = {
  selectedSeason: SeasonDto;
};

export const Matches: React.FC<any> = ({ seasonId }) => {
  const i18n = useTrans();
  const router = useRouter();
  const {locale} = router;

  const { data: matchDataLast = [], isLoading: isMatchLoadingLast } = useMatchLeague(
    seasonId, 'last'
  );
  const { data: matchDataNext = [], isLoading: isMatchLoadingNext } = useMatchLeague(
    seasonId, 'next'
  );

  const matchData = [...matchDataLast, ...matchDataNext]

  const onClick = (match: SportEventDtoWithStat) => {
    window.location.href = `${locale != 'en' ? '/'+locale : ''}/badminton/match/${match.slug}/${match.id}`;
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

  if (isMatchLoadingNext || isMatchLoadingLast && !matchData?.length) {
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
              sport={'badminton'}            />
          );
        })}
      </div>
    </div>
  );
};
