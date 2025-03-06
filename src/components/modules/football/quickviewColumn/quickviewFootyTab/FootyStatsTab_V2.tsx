import { FC, useMemo } from 'react';
import { SportEventDtoWithStat, TournamentDto } from '@/constant/interface';
import Summary, { SummaryData } from './Summary';
import { useFootyEventData } from '@/hooks/useCommon';

import WhoWillWin, {
  WhoWillWinData,
} from '@/components/modules/football/quickviewColumn/quickviewFootyTab/WhoWillWin';
import dynamic from 'next/dynamic';
import { HeadToHeadData } from '@/components/modules/football/quickviewColumn/quickviewFootyTab/HeadToHead';
import OddWithStats, { OddWithStatsData } from '@/components/modules/football/quickviewColumn/quickviewFootyTab/OddWithStats';
import { TwQuickViewTitleV2 } from '@/components/modules/common';
import FreeGoalKicksThrowIns, { FreeGoalKicksData, FreeGoalKicksThrowInsData, FreeGoalKicksThrowInsProps } from '@/components/modules/football/quickviewColumn/quickviewFootyTab/FreeGoalKicksThrowIns';

const TeamInfo = dynamic(
  () =>
    import(
      '@/components/modules/football/quickviewColumn/quickviewFootyTab/TeamInfo'
    ),
  { ssr: false }
);

const HeadToHead = dynamic(
  () =>
    import(
      '@/components/modules/football/quickviewColumn/quickviewFootyTab/HeadToHead'
    ),
  { ssr: false }
);

type QuickVewFootyProps = {
  matchData: SportEventDtoWithStat;
};

const QuickVewFootyV2: FC<QuickVewFootyProps> = ({ matchData }) => {
  const { id, homeTeam, awayTeam } = matchData;
  const { data, isLoading } = useFootyEventData(id);

  const formatData = useMemo(() => {
    if (!data) return {};
    return {
      summaryData: {
      homePPG: data?.home_ppg,
      awayPPG: data?.away_ppg,
      formRunHome:
        data.home_team_info?.stats?.stats?.additional_info?.formRun_home
        ?.split('')
        ?.reverse() || [],
      formRunAway:
        data.away_team_info?.stats?.stats?.additional_info?.formRun_away
        ?.split('')
        ?.reverse() || [],
      o25Potential: data?.o25_potential,
      seasonOver25PercentageOverall:
        data?.season_data?.seasonOver25Percentage_overall,
      o15Potential: data?.o15_potential,
      seasonOver15PercentageOverall:
        data?.season_data?.seasonOver15Percentage_overall,
      bttsPotential: data?.btts_potential,
      seasonBTTSPercentage: data?.season_data?.seasonBTTSPercentage,
      avgPotential: data?.avg_potential,
      seasonAVGOverall: data?.season_data?.seasonAVG_overall,
      cardsPotential: data?.cards_potential,
      cardsAVGOverall: data?.season_data?.cardsAVG_overall,
      cornersPotential: data?.corners_potential,
      cornersAVGOverall: data?.season_data?.cornersAVG_overall,
      },
      whoWillWinData: {
      homePPG: data?.home_ppg,
      awayPPG: data?.away_ppg,
      formRunHome:
        data.home_team_info?.stats?.stats?.additional_info?.formRun_home
        ?.split('')
        ?.reverse() || [],
      formRunAway:
        data.away_team_info?.stats?.stats?.additional_info?.formRun_away
        ?.split('')
        ?.reverse() || [],
      },
      homeTeamInfo: data.home_team_info || {},
      awayTeamInfo: data.away_team_info || {},
      tournament: matchData?.tournament || {},
      headToHeadData: {
      totalMatches: data?.h2h?.previous_matches_results?.totalMatches || 0,
      teamAWins: data?.h2h?.previous_matches_results?.team_a_wins || 0,
      draw: data?.h2h?.previous_matches_results.draw || 0,
      teamBWins: data?.h2h?.previous_matches_results?.team_b_wins || 0,
      over15Percentage: data?.h2h?.betting_stats?.over15Percentage || 0,
      over15: data?.h2h?.betting_stats?.over15 || 0,
      over25Percentage: data?.h2h?.betting_stats?.over25Percentage || 0,
      over25: data?.h2h?.betting_stats?.over25 || 0,
      over35Percentage: data?.h2h?.betting_stats?.over35Percentage || 0,
      over35: data?.h2h?.betting_stats?.over35 || 0,
      bttsPercentage: data?.h2h?.betting_stats?.bttsPercentage || 0,
      btts: data?.h2h?.betting_stats?.btts || 0,
      clubACSPercentage: data?.h2h?.betting_stats?.clubACSPercentage || 0,
      clubBCSPercentage: data?.h2h?.betting_stats?.clubBCSPercentage || 0,
      },
      oddWithStats: {
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
        home_winPercentage_overall: data?.home_team_info?.stats?.stats?.winPercentage_overall || 0,
        away_winPercentage_overall: data?.away_team_info?.stats?.stats?.winPercentage_overall || 0,
        stats_draw: (data?.home_team_info?.stats?.stats?.drawPercentage_overall + data?.away_team_info?.stats?.stats?.drawPercentage_overall) / 2 || 0,
        stast_ft_over05: (data?.home_team_info?.stats?.stats?.seasonOver05Percentage_overall + data?.away_team_info?.stats?.stats?.seasonOver05Percentage_overall) / 2 || 0,
        stast_ft_over15: (data?.home_team_info?.stats?.stats?.seasonOver15Percentage_overall + data?.away_team_info?.stats?.stats?.seasonOver15Percentage_overall) / 2 || 0,
        stast_ft_over25: (data?.home_team_info?.stats?.stats?.seasonOver25Percentage_overall + data?.away_team_info?.stats?.stats?.seasonOver25Percentage_overall) / 2 || 0,
        stast_ft_over35: (data?.home_team_info?.stats?.stats?.seasonOver35Percentage_overall + data?.away_team_info?.stats?.stats?.seasonOver35Percentage_overall) / 2 || 0,
        stast_ft_over45: (data?.home_team_info?.stats?.stats?.seasonOver45Percentage_overall + data?.away_team_info?.stats?.stats?.seasonOver45Percentage_overall) / 2 || 0,
        stast_btts_yes: (data?.home_team_info?.stats?.stats?.seasonBTTSPercentage_overall + data?.away_team_info?.stats?.stats?.seasonBTTSPercentage_overall) / 2 || 0,
      },
      },
       goalKicksThrow: {
        goalKicks: [
          {
          titleKey: 'total_goal_kicks',
          goalKicksHome: data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_avg_home || 0,
          goalKicksAway: data?.away_team_info?.stats?.stats?.additional_info?.goal_kicks_total_avg_away || 0,
          goalKicksAverage: (data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_avg_home +  data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_avg_away) / 2 || 0,
          },
          {
          titleKey: 'gk_total_85',
          goalKicksHome: data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over85_home || 0,
          goalKicksAway: data?.away_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over85_away || 0,
          goalKicksAverage: (data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over85_home + data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over85_away) / 2 || 0,
          },
          {
          titleKey: 'gk_total_95',
          goalKicksHome: data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over95_home || 0,
          goalKicksAway: data?.away_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over95_away || 0,
          goalKicksAverage: (data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over95_home + data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over95_away) / 2 || 0,
          },
          {
          titleKey: 'gk_total_105',
          goalKicksHome: data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over105_home || 0,
          goalKicksAway: data?.away_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over105_away || 0,
          goalKicksAverage: (data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over105_home + data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over105_away) / 2 || 0,
          },
          {
          titleKey: 'gk_total_115',
          goalKicksHome: data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over115_home || 0,
          goalKicksAway: data?.away_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over115_away || 0,
          goalKicksAverage: (data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over115_home + data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over115_away) / 2 || 0,
          },
          {
          titleKey: 'gk_total_125',
          goalKicksHome: data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over125_home || 0,
          goalKicksAway: data?.away_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over125_away || 0,
          goalKicksAverage: (data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over125_home + data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over125_away) / 2 || 0,
          },
          {
          titleKey: 'gk_total_135',
          goalKicksHome: data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over135_home || 0,
          goalKicksAway: data?.away_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over135_away || 0,
          goalKicksAverage: (data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over135_home + data?.home_team_info?.stats?.stats?.additional_info?.goal_kicks_total_over135_away) / 2 || 0,
          },
        ],
        throwIns: [
          {
            titleKey: 'total_throw_ins',
            throwInsHome: data?.home_team_info?.stats?.stats?.additional_info?.throwins_total_avg_home || 0,
            throwInsAway: data?.away_team_info?.stats?.stats?.additional_info?.throwins_total_avg_away || 0,
            throwInsAverage: (data?.home_team_info?.stats?.stats?.additional_info?.throwins_total_avg_home + data?.away_team_info?.stats?.stats?.additional_info?.throwins_total_avg_away) / 2 || 0,
          },
          {
            titleKey: 'ti_total_375',
            throwInsHome: data?.home_team_info?.stats?.stats?.additional_info?.throwins_total_over375_home || 0,
            throwInsAway: data?.away_team_info?.stats?.stats?.additional_info?.throwins_total_over375_away || 0,
            throwInsAverage: (data?.home_team_info?.stats?.stats?.additional_info?.throwins_total_over375_home + data?.away_team_info?.stats?.stats?.additional_info?.throwins_total_over375_away) / 2 || 0,
          },
          {
            titleKey: 'ti_total_385',
            throwInsHome: data?.home_team_info?.stats?.stats?.additional_info?.throwins_total_over385_home || 0,
            throwInsAway: data?.away_team_info?.stats?.stats?.additional_info?.throwins_total_over385_away || 0,
            throwInsAverage: (data?.home_team_info?.stats?.stats?.additional_info?.throwins_total_over385_home + data?.away_team_info?.stats?.stats?.additional_info?.throwins_total_over385_away) / 2 || 0,
          },
          {
            titleKey: 'ti_total_395',
            throwInsHome: data?.home_team_info?.stats?.stats?.additional_info?.throwins_total_over395_home || 0,
            throwInsAway: data?.away_team_info?.stats?.stats?.additional_info?.throwins_total_over395_away || 0,
            throwInsAverage: (data?.home_team_info?.stats?.stats?.additional_info?.throwins_total_over395_home + data?.away_team_info?.stats?.stats?.additional_info?.throwins_total_over395_away) / 2 || 0,
          },
          {
            titleKey: 'ti_total_405',
            throwInsHome: data?.home_team_info?.stats?.stats?.additional_info?.throwins_total_over405_home || 0,
            throwInsAway: data?.away_team_info?.stats?.stats?.additional_info?.throwins_total_over405_away || 0,
            throwInsAverage: (data?.home_team_info?.stats?.stats?.additional_info?.throwins_total_over405_home + data?.away_team_info?.stats?.stats?.additional_info?.throwins_total_over405_away) / 2 || 0,
          },
          {
            titleKey: 'ti_total_415',
            throwInsHome: data?.home_team_info?.stats?.stats?.additional_info?.throwins_total_over415_home || 0,
            throwInsAway: data?.away_team_info?.stats?.stats?.additional_info?.throwins_total_over415_away || 0,
            throwInsAverage: (data?.home_team_info?.stats?.stats?.additional_info?.throwins_total_over415_home + data?.away_team_info?.stats?.stats?.additional_info?.throwins_total_over415_away) / 2 || 0,
          },
          {
            titleKey: 'ti_total_425',
            throwInsHome: data?.home_team_info?.stats?.stats?.additional_info?.throwins_total_over425_home || 0,
            throwInsAway: data?.away_team_info?.stats?.stats?.additional_info?.throwins_total_over425_away || 0,
            throwInsAverage: (data?.home_team_info?.stats?.stats?.additional_info?.throwins_total_over425_home + data?.away_team_info?.stats?.stats?.additional_info?.throwins_total_over425_away) / 2 || 0,
          },
          {
            titleKey: 'ti_total_435',
            throwInsHome: data?.home_team_info?.stats?.stats?.additional_info?.throwins_total_over435_home || 0,
            throwInsAway: data?.away_team_info?.stats?.stats?.additional_info?.throwins_total_over435_away || 0,
            throwInsAverage: (data?.home_team_info?.stats?.stats?.additional_info?.throwins_total_over435_home + data?.away_team_info?.stats?.stats?.additional_info?.throwins_total_over435_away) / 2 || 0,
          },
          {
            titleKey: 'ti_total_445',
            throwInsHome: data?.home_team_info?.stats?.stats?.additional_info?.throwins_total_over445_home || 0,
            throwInsAway: data?.away_team_info?.stats?.stats?.additional_info?.throwins_total_over445_away || 0,
            throwInsAverage: (data?.home_team_info?.stats?.stats?.additional_info?.throwins_total_over445_home + data?.away_team_info?.stats?.stats?.additional_info?.throwins_total_over445_away) / 2 || 0,
          },
        ]
      }
    };
  }, [data, matchData]);

  return (
    <div className='my-2 flex flex-col gap-6 px-2.5 lg:px-0'>
      <Summary
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={(formatData?.summaryData as SummaryData) || {}}
      />
      <WhoWillWin
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={(formatData?.whoWillWinData as WhoWillWinData) || {}}
      />
      <TeamInfo
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homeTeamData={formatData?.homeTeamInfo}
        awayTeamData={formatData?.awayTeamInfo}
        tournament={formatData?.tournament || ({} as TournamentDto)}
      />
      <HeadToHead
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={formatData?.headToHeadData || ({} as HeadToHeadData)}
      />

      <FreeGoalKicksThrowIns
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={formatData?.goalKicksThrow || {} as FreeGoalKicksThrowInsData}
      />

      <OddWithStats
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={formatData?.oddWithStats || {} as OddWithStatsData}
      />
    </div>
  );
};

export default QuickVewFootyV2;
