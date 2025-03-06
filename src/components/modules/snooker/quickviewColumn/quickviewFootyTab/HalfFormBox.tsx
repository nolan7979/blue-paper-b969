import { FC, useMemo } from 'react';

import Avatar from '@/components/common/Avatar';
import { SPORT } from '@/constant/common';
import { WrapperBorderLinearBox } from '@/components/modules/common/tw-components/TwWrapper';
import { calculatePercentage, genStatsPointColor } from '@/utils/footyUtils';
import useTrans from '@/hooks/useTrans';
import { HalfFormProps } from '@/components/modules/football/quickviewColumn/quickviewFootyTab/HalfForm';

const HalfFormBox: FC<HalfFormProps> = ({ homeTeam, awayTeam, data }) => {
  const i18n = useTrans();

  const percentageWinner = useMemo(() => {
    const { homePercentage } = calculatePercentage(
      data?.HTPPG_home || 0,
      data?.HTPPG_away || 0
    );
    return homePercentage;
  }, [data]);

  const subContent = useMemo(() => {
    const homePPgFormatted = Number(data?.HTPPG_home) || 0;
    const awayPPgFormatted = Number(data?.HTPPG_away) || 0;

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
    );

    if (homePPgFormatted > awayPPgFormatted) {
      return i18n.footy_stats.team_better_half_time_form
        .replace(':teamName', homeTeam?.shortName || homeTeam?.name || '')
        .replace(':percentage', `${percent}%`);
    }

    if (awayPPgFormatted > homePPgFormatted) {
      return i18n.footy_stats.team_better_half_time_form
        .replace(':teamName', awayTeam?.shortName || awayTeam?.name || '')
        .replace(':percentage', `${percent}%`);
    }

    return '';
  }, [data, i18n]);

  const pointHomeColor = genStatsPointColor(data.HTPPG_home);
  const pointAwayColor = genStatsPointColor(data.HTPPG_away);

  return (
    <WrapperBorderLinearBox className='mt-[10px] flex flex-col gap-4 p-3'>
      <div className='flex w-full justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <Avatar
            type='team'
            id={homeTeam?.id}
            isBackground={false}
            isSmall
            width={48}
            height={48}
            sport={SPORT.FOOTBALL}
          />
          <div className='flex flex-col items-start gap-2'>
            {Number(data?.HTPPG_home) > 0 && (
              <span
                className={`flex h-6 w-fit items-center rounded-sm px-2 text-center font-oswald text-[14px] font-semibold text-white ${pointHomeColor}`}
              >
                {data?.HTPPG_home}
              </span>
            )}
            <span className='text-csm dark:text-white'>
              {i18n.footy_stats.half_time}
            </span>
          </div>
        </div>
        <div className='flex flex-row-reverse items-center gap-2'>
          <Avatar
            type='team'
            id={awayTeam?.id}
            isBackground={false}
            isSmall
            width={48}
            height={48}
            sport={SPORT.FOOTBALL}
          />
          <div className='flex flex-col items-end gap-2'>
            {Number(data?.HTPPG_away) > 0 && (
              <span
                className={`flex h-6 w-fit items-center rounded-sm px-2 text-center font-oswald text-[14px] font-semibold text-white ${pointAwayColor}`}
              >
                {data?.HTPPG_away}
              </span>
            )}
            <span className='text-csm dark:text-white'>
              {i18n.footy_stats.half_time}
            </span>
          </div>
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

export default HalfFormBox;
