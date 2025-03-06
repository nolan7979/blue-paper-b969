import { CompetitorDto, FirstGoalStats } from '@/constant/interface';
import { FC, useCallback, useMemo } from 'react';
import { WrapperBorderLinearBox } from '@/components/modules/common/tw-components/TwWrapper';
import useTrans from '@/hooks/useTrans';
import Avatar from '@/components/common/Avatar';
import { SPORT } from '@/constant/common';
import PercentBar from '@/components/modules/football/quickviewColumn/quickviewFootyTab/PercentBar';

type ScoreFirstProps = {
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  data: FirstGoalStats;
};

const ScoreFirst: FC<ScoreFirstProps> = ({ homeTeam, awayTeam, data }) => {
  const i18n = useTrans();

  const genScoredFirstContent = useCallback(
    (a: number, b: number) => {
      return i18n.footy_stats.scored_first_in
        .replace(':a', String(a))
        .replace(':b', String(b));
    },
    [i18n]
  );

  return (
    <div>
      <h4 className='text-center text-xs font-bold uppercase dark:text-white'>
        {i18n.footy_stats.who_will_score_first}
      </h4>
      <WrapperBorderLinearBox className='mt-[10px] flex flex-col gap-2 p-3'>
        <div className='flex items-center gap-1'>
          <Avatar
            type='team'
            id={homeTeam?.id}
            isBackground={false}
            isSmall
            width={24}
            height={24}
            sport={SPORT.FOOTBALL}
          />
          <span className='text-csm font-bold dark:text-white'>
            {homeTeam?.shortName || homeTeam?.name}
          </span>
        </div>
        <div className='flex items-center justify-between gap-1'>
          <span className='text-csm'>
            {genScoredFirstContent(
              data.firstGoalScored_home_overall,
              data.seasonMatchesPlayed_home_overall
            )}
          </span>
          <span className='text-base font-semibold dark:text-white'>
            {`${data.firstGoalScoredPercentage_home_overall}%`}
          </span>
        </div>
        <PercentBar
          value={data.firstGoalScoredPercentage_home_overall}
          colorMain='bg-line-dark-blue'
        />

        <div className='mt-6 flex items-center gap-1'>
          <Avatar
            type='team'
            id={awayTeam?.id}
            isBackground={false}
            isSmall
            width={24}
            height={24}
            sport={SPORT.FOOTBALL}
          />
          <span className='text-csm font-bold dark:text-white'>
            {awayTeam?.shortName || awayTeam?.name}
          </span>
        </div>
        <div className='flex items-center justify-between gap-1'>
          <span className='text-csm'>
            {genScoredFirstContent(
              data.firstGoalScored_away_overall,
              data.seasonMatchesPlayed_away_overall
            )}
          </span>
          <span className='text-base font-semibold dark:text-white'>
            {`${data.firstGoalScoredPercentage_away_overall}%`}
          </span>
        </div>
        <PercentBar
          value={data.firstGoalScoredPercentage_away_overall}
          colorMain='bg-[#EECC35]'
        />
      </WrapperBorderLinearBox>
    </div>
  );
};

export default ScoreFirst;

export const formatScoreFirstData = (data: any) => ({
  //* Home
  firstGoalScored_home_overall:
    data?.home_team_info?.stats?.stats?.firstGoalScored_overall || 0,
  seasonMatchesPlayed_home_overall:
    data?.home_team_info?.stats?.stats?.seasonMatchesPlayed_overall || 0,
  firstGoalScoredPercentage_home_overall:
    data?.home_team_info?.stats?.stats?.firstGoalScoredPercentage_overall || 0,
  //* Away
  firstGoalScored_away_overall:
    data?.away_team_info?.stats?.stats?.firstGoalScored_overall || 0,
  seasonMatchesPlayed_away_overall:
    data?.away_team_info?.stats?.stats?.seasonMatchesPlayed_overall || 0,
  firstGoalScoredPercentage_away_overall:
    data?.away_team_info?.stats?.stats?.firstGoalScoredPercentage_overall || 0,
});
