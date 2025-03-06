import {
  formatCardFullTimeData
} from '@/components/modules/football/quickviewColumn/quickviewFootyTab/CardFullTime';
import {
  formatCardHalfTimeData
} from '@/components/modules/football/quickviewColumn/quickviewFootyTab/CardHalfTime';
import {
  formatFreeGoalKicksThrowInsData
} from '@/components/modules/football/quickviewColumn/quickviewFootyTab/FreeGoalKicksThrowIns';
import {
  formatGoalsConcededData
} from '@/components/modules/football/quickviewColumn/quickviewFootyTab/GoalsConceded';
import {
  GoalsScoredData,
  formatGoalsScoredData,
} from '@/components/modules/football/quickviewColumn/quickviewFootyTab/GoalsScored';
import OddWithStats, {
  OddWithStatsData,
  formatOddWithStatsData,
} from '@/components/modules/football/quickviewColumn/quickviewFootyTab/OddWithStats';
import {
  formatOverUnderGoalsData
} from '@/components/modules/football/quickviewColumn/quickviewFootyTab/OverUnderGoals';
import ScoreFirst, {
  formatScoreFirstData,
} from '@/components/modules/football/quickviewColumn/quickviewFootyTab/ScoreFirst';
import {
  formatTeamCornersData
} from '@/components/modules/football/quickviewColumn/quickviewFootyTab/TeamCorners';
import {
  formatTotalCornerData
} from '@/components/modules/football/quickviewColumn/quickviewFootyTab/TotalCorners';
import WhoWillWin, {
  WhoWillWinData,
} from '@/components/modules/football/quickviewColumn/quickviewFootyTab/WhoWillWin';
import {
  FirstGoalStats,
  SportEventDtoWithStat
} from '@/constant/interface';
import { FC, useMemo } from 'react';
import Summary, { SummaryData } from './Summary';

import GoalsByMinutes, {
  GoalsByMinutesData,
  formatGoalByMinutesData,
} from '@/components/modules/football/quickviewColumn/quickviewFootyTab/GoalsByMinutes';
import HalfForm, {
  HalfFormData,
  formatHalfFormData,
} from '@/components/modules/football/quickviewColumn/quickviewFootyTab/HalfForm';
import { HeadToHeadData } from '@/components/modules/football/quickviewColumn/quickviewFootyTab/HeadToHead';
import { formatShotsTakenData } from '@/components/modules/football/quickviewColumn/quickviewFootyTab/ShotsTaken';
import { SPORT } from '@/constant/common';
import { useFootyEventData } from '@/hooks/useCommon';
import dynamic from 'next/dynamic';

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

const GoalsScored = dynamic(
  () =>
    import(
      '@/components/modules/football/quickviewColumn/quickviewFootyTab/GoalsScored'
    ),
  { ssr: false }
);

const GoalsConceded = dynamic(
  () =>
    import(
      '@/components/modules/football/quickviewColumn/quickviewFootyTab/GoalsConceded'
    ),
  { ssr: false }
);

const OverUnderGoals = dynamic(
  () =>
    import(
      '@/components/modules/football/quickviewColumn/quickviewFootyTab/OverUnderGoals'
    ),
  { ssr: false }
);

type QuickVewFootyProps = {
  matchData: SportEventDtoWithStat;
};

const QuickVewFooty: FC<QuickVewFootyProps> = ({ matchData }) => {
  const { id, homeTeam, awayTeam } = matchData;
  const { data, isLoading } = useFootyEventData(id, SPORT.FOOTBALL);

  const formattedData = useMemo(() => {
    if (!data) return {};
    const isHomeCup =
      data?.home_team_info?.stats?.season_format?.toLowerCase() === 'cup';
    const isAwayCup =
      data?.away_team_info?.stats?.season_format?.toLowerCase() === 'cup';
    
    const formRun_home = isHomeCup
      ? data.home_team_info?.stats?.stats?.additional_info?.formRun_overall
      : data.home_team_info?.stats?.stats?.additional_info?.formRun_home;
    const formRun_away = isAwayCup
      ? data.away_team_info?.stats?.stats?.additional_info?.formRun_overall
      : data.away_team_info?.stats?.stats?.additional_info?.formRun_away;

    return {
      summaryData: {
        homePPG: data?.home_ppg,
        awayPPG: data?.away_ppg,
        formRunHome: formRun_home?.split('')?.reverse() || [],
        formRunAway: formRun_away?.split('')?.reverse() || [],
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
        formRunHome: formRun_home?.split('')?.reverse() || [],
        formRunAway: formRun_away?.split('')?.reverse() || [],
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
      goalsScoredData: formatGoalsScoredData(data, isHomeCup, isAwayCup),
      goalsConcededData: formatGoalsConcededData(data, isHomeCup, isAwayCup),
      overUnderGoals: formatOverUnderGoalsData(data, isHomeCup, isAwayCup),
      oddWithStats: formatOddWithStatsData(data),
      goalKicksThrow: formatFreeGoalKicksThrowInsData(data),
      bothTeamsToScore: {},
      totalCorners: formatTotalCornerData(data, isHomeCup, isAwayCup),
      teamCorners: formatTeamCornersData(data, isHomeCup, isAwayCup),
      cardFullTime: formatCardFullTimeData(data, isHomeCup, isAwayCup),
      cardHalfTime: formatCardHalfTimeData(data, isHomeCup, isAwayCup),
      scoreFirst: formatScoreFirstData(data),
      halfForm: formatHalfFormData(data),
      goalByMinutes: formatGoalByMinutesData(data),
      shotsTaken: formatShotsTakenData(data, isHomeCup, isAwayCup),
    };
  }, [data, matchData]);

  if (isLoading) {
    return <></>;
  }

  return (
    <div className='my-2 flex flex-col gap-6 px-2.5 lg:px-0'>
      <Summary
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={(formattedData?.summaryData as SummaryData) || {}}
      />
      <WhoWillWin
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={(formattedData?.whoWillWinData as WhoWillWinData) || {}}
      />
      {/* <TeamInfo
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homeTeamData={formattedData?.homeTeamInfo}
        awayTeamData={formattedData?.awayTeamInfo}
        tournament={formattedData?.tournament || ({} as TournamentDto)}
      /> */}
      <HeadToHead
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={formattedData?.headToHeadData || ({} as HeadToHeadData)}
      />
      <GoalsScored
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={formattedData.goalsScoredData || ({} as GoalsScoredData)}
      />
      {/* <GoalsConceded
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={formattedData.goalsConcededData || ({} as GoalsConcededData)}
      /> */}
      {/* <OverUnderGoals
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={formattedData.overUnderGoals || ({} as OverUnderGoalsData)}
      /> */}
      {/* <BothTeamsScore //! Not available
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={formatData.bothTeamsToScore || ({} as BothTeamsScoreData)}
      /> */}
      {/* <TotalCorners
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={formattedData.totalCorners || ({} as TotalCornersScoreData)}
      /> */}
      {/* <TeamCorners
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={formattedData.teamCorners || ({} as TeamCornersData)}
      /> */}
      {/* <CardFullTime
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={formattedData.cardFullTime || ({} as CardFullTimeData)}
      /> */}
      {/* <CardHalfTime
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={formattedData.cardHalfTime || ({} as CardHalfTimeData)}
      /> */}
      <ScoreFirst
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={formattedData.scoreFirst || ({} as FirstGoalStats)}
      />
      <GoalsByMinutes
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={formattedData.goalByMinutes || ({} as GoalsByMinutesData)}
      />
      <HalfForm
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={formattedData?.halfForm || ({} as HalfFormData)}
      />
      {/* <ShotsTaken
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={formattedData.shotsTaken || ({} as ShotsTakenStats)}
      /> */}
      {/* 
      <FreeGoalKicksThrowIns
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={
          formattedData?.goalKicksThrow || ({} as FreeGoalKicksThrowInsData)
        }
      /> */}

      <OddWithStats
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        data={formattedData?.oddWithStats || ({} as OddWithStatsData)}
      />
    </div>
  );
};

export default QuickVewFooty;
