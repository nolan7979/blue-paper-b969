import { TwQuickViewTitleV2 } from '@/components/modules/football/tw-components';
import { CompetitorDto } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { cn } from '@/utils/tailwindUtils';

export type OddWithStatsData = {
  odds: {
    odds_ft_1: number;
    odds_ft_2: number;
    odds_ft_x: number;
    odds_ft_over05: number;
    odds_ft_over15: number;
    odds_ft_over25: number;
    odds_ft_over35: number;
    odds_ft_over45: number;
    odds_btts_yes: number;
  };
  stats: {
    home_winPercentage_overall: number;
    away_winPercentage_overall: number;
    stats_draw: number;
    stast_ft_over05: number;
    stast_ft_over15: number;
    stast_ft_over25: number;
    stast_ft_over35: number;
    stast_ft_over45: number;
    stast_btts_yes: number;
  };
};

type OddWithStatsProps = {
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  data: OddWithStatsData;
};

const OddWithStats = ({ homeTeam, awayTeam, data }: OddWithStatsProps) => {
  const i18n = useTrans();
  const labelKeys = [
    i18n.footy_stats.team_win.replace(':teamName', homeTeam.name || ''),
    i18n.footy_stats.team_win.replace(':teamName', awayTeam.name || ''),
    i18n.footy_stats.draw,
    i18n.footy_stats.over_05,
    i18n.footy_stats.over_15,
    i18n.footy_stats.over_25,
    i18n.footy_stats.over_35,
    i18n.footy_stats.over_45,
    i18n.footy_stats.btts,
  ];
  const valuesClass = 'dark:text-white text-csm';
  const rowItemClass =
    'w-full max-w-32 text-right [&>*:not(:last-child)]:border-b [&>*]:border-[#272A31] space-y-1 [&>*]:py-2 [&>*]:px-2';

  return (
    <div>
      <TwQuickViewTitleV2>
        {i18n.footy_stats.odds_with_stats}
      </TwQuickViewTitleV2>
      <div className='w-full'>
        <ul className='pr- flex w-full justify-between bg-white p-2 px-2.5 text-csm dark:bg-[#151820]'>
          <li className='w-full'>{i18n.footy_stats.market}</li>
          <li className='w-full max-w-32 text-right'>
            {i18n.footy_stats.odds}
          </li>
          <li className='w-full max-w-32 text-right'>
            {i18n.footy_stats.stats}
          </li>
        </ul>
      </div>
      <div className='flex w-full justify-between '>
        <div className={cn(rowItemClass, 'w-full  max-w-full text-left')}>
          {labelKeys.map((label) => {
            return (
              <div key={label}>
                <span className={valuesClass}>{label}</span>
              </div>
            );
          })}
        </div>
        <div className={rowItemClass}>
          {data?.odds &&
            Object.keys(data.odds).map((key) => {
              return (
                <div key={key}>
                  <span className={valuesClass}>
                    {data.odds[key as keyof typeof data.odds]}
                  </span>
                </div>
              );
            })}
        </div>
        <div className={rowItemClass}>
          {data?.stats &&
            Object.keys(data.stats).map((key) => {
              return (
                <div key={key}>
                  <span className={valuesClass}>
                    {data.stats[key as keyof typeof data.stats]}%
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default OddWithStats;

export const formatOddWithStatsData = (data: any): OddWithStatsData => ({
  odds: {
    odds_ft_1: data?.odds_ft_1 || 0,
    odds_ft_2: data?.odds_ft_2 || 0,
    odds_ft_x: data?.odds_ft_x || 0,
    odds_ft_over05: data?.odds_ft_over05 || 0,
    odds_ft_over15: data?.odds_ft_over15 || 0,
    odds_ft_over25: data?.odds_ft_over25 || 0,
    odds_ft_over35: data?.odds_ft_over35 || 0,
    odds_ft_over45: data?.odds_ft_over45 || 0,
    odds_btts_yes: data?.odds_btts_yes || 0,
  },
  stats: {
    home_winPercentage_overall:
      data?.home_team_info?.stats?.stats?.winPercentage_overall || 0,
    away_winPercentage_overall:
      data?.away_team_info?.stats?.stats?.winPercentage_overall || 0,
    stats_draw: Math.round(
      (data?.home_team_info?.stats?.stats?.drawPercentage_overall +
        data?.away_team_info?.stats?.stats?.drawPercentage_overall) /
        2 || 0
    ),
    stast_ft_over05: Math.round(
      (data?.home_team_info?.stats?.stats?.seasonOver05Percentage_overall +
        data?.away_team_info?.stats?.stats?.seasonOver05Percentage_overall) /
        2 || 0
    ),
    stast_ft_over15: Math.round(
      (data?.home_team_info?.stats?.stats?.seasonOver15Percentage_overall +
        data?.away_team_info?.stats?.stats?.seasonOver15Percentage_overall) /
        2 || 0
    ),
    stast_ft_over25: Math.round(
      (data?.home_team_info?.stats?.stats?.seasonOver25Percentage_overall +
        data?.away_team_info?.stats?.stats?.seasonOver25Percentage_overall) /
        2 || 0
    ),
    stast_ft_over35: Math.round(
      (data?.home_team_info?.stats?.stats?.seasonOver35Percentage_overall +
        data?.away_team_info?.stats?.stats?.seasonOver35Percentage_overall) /
        2 || 0
    ),
    stast_ft_over45: Math.round(
      (data?.home_team_info?.stats?.stats?.seasonOver45Percentage_overall +
        data?.away_team_info?.stats?.stats?.seasonOver45Percentage_overall) /
        2 || 0
    ),
    stast_btts_yes: Math.round(
      (data?.home_team_info?.stats?.stats?.seasonBTTSPercentage_overall +
        data?.away_team_info?.stats?.stats?.seasonBTTSPercentage_overall) /
        2 || 0
    ),
  },
});
