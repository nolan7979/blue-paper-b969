import { FC, useMemo } from 'react';

import Avatar from '@/components/common/Avatar';
import { GoalsScoredProps } from '@/components/modules/football/quickviewColumn/quickviewFootyTab/GoalsScored';
import { SPORT } from '@/constant/common';
import { WrapperBorderLinearBox } from '@/components/modules/common/tw-components/TwWrapper';
import { calculatePercentage } from '@/utils/footyUtils';
import useTrans from '@/hooks/useTrans';

const GoalsScoredBox: FC<GoalsScoredProps> = ({ homeTeam, awayTeam, data }) => {
  const i18n = useTrans();

  const percentageWinner = useMemo(() => {
    const { homePercentage } = calculatePercentage(
      data?.seasonScoredAVGHome || 0,
      data?.seasonScoredAVGAway || 0
    );
    return homePercentage;
  }, [data]);

  const subContent = useMemo(() => {
    const homePPgFormatted = Number(data?.seasonScoredAVGHome) || 0;
    const awayPPgFormatted = Number(data?.seasonScoredAVGAway) || 0;

    if (homePPgFormatted === awayPPgFormatted) {
      return homePPgFormatted === 0 ? '' : i18n.footy_stats.equal_point;
    }

    if (homePPgFormatted === 0) {
      return i18n.footy_stats.advantage_point.replace(
        ':teamName',
        awayTeam?.shortName || awayTeam?.name || ''
      );
    }

    if (awayPPgFormatted === 0) {
      return i18n.footy_stats.advantage_point.replace(
        ':teamName',
        homeTeam?.shortName || homeTeam?.name || ''
      );
    }

    const percent = Math.round(
      Math.abs(
        ((homePPgFormatted - awayPPgFormatted) /
          Math.min(homePPgFormatted, awayPPgFormatted)) *
          100
      )
    ).toString();

    if (homePPgFormatted > awayPPgFormatted) {
      return i18n.footy_stats.better_point
        .replace(':teamName', homeTeam?.shortName || homeTeam?.name || '')
        .replace(':percentage', `${percent}%`);
    }

    if (awayPPgFormatted > homePPgFormatted) {
      return i18n.footy_stats.better_point
        .replace(':teamName', awayTeam?.shortName || awayTeam?.name || '')
        .replace(':percentage', `${percent}%`);
    }

    return '';
  }, [data, i18n]);

  return (
    <WrapperBorderLinearBox className='mt-[10px] flex flex-col gap-4 p-3'>
      <div className='flex w-full justify-around gap-4'>
        <div className='flex flex-col items-center gap-1'>
          <Avatar
            type='team'
            id={homeTeam?.id}
            isBackground={false}
            isSmall
            width={48}
            height={48}
            sport={SPORT.FOOTBALL}
          />
          {data?.seasonScoredAVGHome && (
            <span className='text-base font-semibold dark:text-white'>
              {data?.seasonScoredAVGHome || ''}
            </span>
          )}
          <span className='text-csm'>{i18n.footy_stats.scored_per_game}</span>
        </div>
        <div className='flex flex-col items-center gap-1'>
          <Avatar
            type='team'
            id={awayTeam?.id}
            isBackground={false}
            isSmall
            width={48}
            height={48}
            sport={SPORT.FOOTBALL}
          />
          {data?.seasonScoredAVGAway && (
            <span className='text-base font-semibold dark:text-white'>
              {data?.seasonScoredAVGAway || ''}
            </span>
          )}
          <span className='text-csm'>{i18n.footy_stats.scored_per_game}</span>
        </div>
      </div>
      <div className='relative h-[5px] w-full overflow-hidden rounded-lg bg-[#EECC35]'>
        <div
          className='left-0 h-5 bg-line-dark-blue'
          css={{ width: percentageWinner + '%' }}
        />
      </div>
      <p
        className='text-start text-msm'
        dangerouslySetInnerHTML={{ __html: subContent }}
      />
    </WrapperBorderLinearBox>
  );
};

export default GoalsScoredBox;
