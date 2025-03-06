import AggregateScoreSkeleton from '@/components/common/skeleton/quickview/AggregateScoreSkeleton';
import ScoreHomeAndAwayTeam from '@/components/modules/football/quickviewColumn/quickviewDetailTab/ScoreHomeAndAwayTeam';
import { IScore, SportEventDtoWithStat } from '@/constant/interface';
import { useMemo, useState } from 'react';

const AggregateScoreSection = ({
  matchData,
  i18n,
}: {
  matchData: SportEventDtoWithStat;
  i18n: any;
}) => {
  const home_score = useMemo(() => {
    const home_score_old =
      matchData.agg_score?.home_score !== undefined
        ? matchData.agg_score.home_score
        : -1;
    const home_score_agg =
      home_score_old + ((matchData.homeScore as IScore)?.display || 0);

    return {
      old: home_score_old,
      agg: home_score_agg,
    };
  }, [matchData]);

  const away_score = useMemo(() => {
    const away_score_old =
      matchData.agg_score?.away_score !== undefined
        ? matchData.agg_score.away_score
        : -1;
    const away_score_agg =
      away_score_old + ((matchData.awayScore as IScore)?.display || 0);

    return {
      old: away_score_old,
      agg: away_score_agg,
    };
  }, [matchData]);

  if (!matchData) {
    return <AggregateScoreSkeleton />;
  }

  if (home_score.old === -1 || away_score.old === -1) {
    return <></>;
  }

  return (
    <div className='pt-4'>
      <div className='grid grid-cols-2 gap-x-2 px-2.5 lg:p-0'>
        <div className='flex flex-col items-center justify-center gap-1.5'>
          <h3 className='text-csm font-medium dark:text-white'>
            {i18n.common.first_leg}
          </h3>
          <ScoreHomeAndAwayTeam
            isFirst={true}
            homeName={matchData.awayTeam.name || ''}
            awayName={matchData.homeTeam.name || ''}
            matchId={matchData.id || ''}
            homeScore={away_score.old}
            awayScore={home_score.old}
            homeId={matchData.awayTeam.id || ''}
            awayId={matchData.homeTeam.id || ''}
          />
        </div>
        <div className='flex flex-col items-center justify-center gap-1.5'>
          <h3 className='text-csm font-medium'>{i18n.common.aggregated}</h3>
          <ScoreHomeAndAwayTeam
            isFirst={false}
            homeName={matchData.homeTeam.name || ''}
            awayName={matchData.awayTeam.name || ''}
            matchId={matchData.id || ''}
            homeScore={home_score.agg}
            awayScore={away_score.agg}
            homeId={matchData.homeTeam.id || ''}
            awayId={matchData.awayTeam.id || ''}
          />
        </div>
      </div>
    </div>
  );
};
export default AggregateScoreSection;
