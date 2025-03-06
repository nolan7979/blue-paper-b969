import {
  ResultTable,
  StatsTable,
  TeamHeader,
} from '@/components/modules/football/quickviewColumn/quickviewFootyTab/Table';
import {
  CompetitorDto,
  TeamInfoFooty,
  TournamentDto,
} from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { getResultData, getStatsData } from '@/utils/footyUtils';
import { FC, useMemo } from 'react';

type TeamInfoProps = {
  homeTeam: CompetitorDto;
  awayTeam: CompetitorDto;
  homeTeamData: TeamInfoFooty;
  awayTeamData: TeamInfoFooty;
  tournament: TournamentDto;
};

const TeamInfo: FC<TeamInfoProps> = ({
  homeTeam,
  awayTeam,
  homeTeamData,
  awayTeamData,
  tournament,
}) => {
  const i18n = useTrans();
  const resultHome = useMemo(
    () => getResultData(homeTeamData, i18n),
    [homeTeamData, i18n]
  );
  const statsHome = useMemo(
    () => getStatsData(homeTeamData, i18n, true),
    [homeTeamData, i18n]
  );
  const resultAway = useMemo(
    () => getResultData(awayTeamData, i18n),
    [awayTeamData, i18n]
  );
  const statsAway = useMemo(
    () => getStatsData(awayTeamData, i18n, false),
    [awayTeamData, i18n]
  );

  const headerTitleResults = [
    { title: i18n.filter.form, className: 'w-1/4' },
    { title: i18n.menu.results, className: 'w-1/2' },
    { title: i18n.footy_stats.ppg, className: 'w-1/4' },
  ];

  const headerTitleStats = (isHome = false) => [
    { title: i18n.footy_stats.stats, className: 'w-1/4' },
    { title: i18n.footy_stats.overall, className: 'w-1/4' },
    {
      title: i18n.filter.home,
      className: isHome
        ? 'w-1/4 dark:bg-[#044009] bg-[#76CFA6] text-[#105B16] dark:text-dark-win border-b dark:border-light-darkGray border-light-theme'
        : 'w-1/4',
    },
    {
      title: i18n.filter.away,
      className: !isHome
        ? 'w-1/4 dark:bg-[#044009] bg-[#76CFA6] text-[#105B16] dark:text-dark-win border-b dark:border-light-darkGray border-light-theme'
        : 'w-1/4',
    },
  ];

  return (
    <div className='flex flex-col gap-4'>
      <TeamHeader team={homeTeam} tournament={tournament} />
      <ResultTable headerTitles={headerTitleResults} results={resultHome} />
      <StatsTable headerTitles={headerTitleStats(true)} stats={statsHome} />
      <TeamHeader team={awayTeam} tournament={tournament} />
      <ResultTable headerTitles={headerTitleResults} results={resultAway} />
      <StatsTable headerTitles={headerTitleStats()} stats={statsAway} />
    </div>
  );
};

export default TeamInfo;
