import { FC, useMemo } from 'react';
import { WrapperBorderLinearBox } from '@/components/modules/common/tw-components/TwWrapper';
import TeamSummary from '@/components/modules/football/quickviewColumn/quickviewFootyTab/TeamSummary';
import { CompetitorDto } from '@/constant/interface';
import { calculatePercentage } from '@/utils/footyUtils';
import useTrans from '@/hooks/useTrans';

export type WhoWillWinData = {
  homePPG: number | undefined;
  awayPPG: number | undefined;
  formRunHome: string[];
  formRunAway: string[];
};

type WhoWillWinProps = {
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  data: WhoWillWinData;
};

const WhoWillWin: FC<WhoWillWinProps> = ({ homeTeam, awayTeam, data }) => {
  const i18n = useTrans();
  const subContent = useMemo(() => {
    const homePPgFormatted = Number(data?.homePPG) || 0;
    const awayPPgFormatted = Number(data?.awayPPG) || 0;

    if (homePPgFormatted === awayPPgFormatted) {
      return homePPgFormatted === 0 ? '' : i18n.footy_stats.teams_equal_ppg;
    }

    if (homePPgFormatted === 0) {
      return i18n.footy_stats.team_advantage_ppg.replace(
        ':teamName',
        awayTeam?.shortName || awayTeam?.name || ''
      );
    }

    if (awayPPgFormatted === 0) {
      return i18n.footy_stats.team_advantage_ppg.replace(
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
      return i18n.footy_stats.team_better_ppg
        .replace(':teamName', homeTeam?.shortName || homeTeam?.name || '')
        .replace(':percentage', percent);
    }

    if (awayPPgFormatted > homePPgFormatted) {
      return i18n.footy_stats.team_better_ppg
        .replace(':teamName', awayTeam?.shortName || awayTeam?.name || '')
        .replace(':percentage', percent);
    }

    return '';
  }, [data, i18n]);

  const percentageWinner = useMemo(() => {
    const { homePercentage } = calculatePercentage(
      data?.homePPG || 0,
      data?.awayPPG || 0
    );
    return homePercentage;
  }, [data]);

  return (
    <div className='flex flex-col gap-[10px]'>
      <h4 className='text-center text-xs font-bold uppercase dark:text-white'>
        {i18n.footy_stats.who_will_win}
      </h4>
      <WrapperBorderLinearBox className='flex flex-col gap-4 p-3'>
        <div className='flex items-center justify-between'>
          <TeamSummary
            team={homeTeam}
            ppg={data?.homePPG || 0}
            formRun={data?.formRunHome}
          />
          <span className='font-bold dark:text-white'>vs</span>
          <TeamSummary
            team={awayTeam}
            ppg={data?.awayPPG || 0}
            formRun={data?.formRunAway}
            isAway
          />
        </div>
        <div className='relative h-[5px] w-full overflow-hidden rounded-lg bg-[#EECC35]'>
          <div
            className='left-0 h-5 bg-line-dark-blue'
            css={{ width: percentageWinner + '%' }}
          />
        </div>
        <p
          className='text-msm'
          dangerouslySetInnerHTML={{ __html: subContent }}
        />
      </WrapperBorderLinearBox>
    </div>
  );
};

export default WhoWillWin;
