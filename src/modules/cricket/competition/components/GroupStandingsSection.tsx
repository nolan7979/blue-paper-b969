import { useWindowSize } from '@/hooks';
import {
  useGroupMatchData,
  useSeasonStandingsData,
  useSeasonStandingsFormData,
} from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';

import StandingRowGroup from '@/components/common/skeleton/competition/StandingRowGroup';
import {
  Match,
  StandingHeaderRow,
  StandingRow,
} from '@/components/modules/football/quickviewColumn/QuickViewStandingsTab';

import { useFilterStore } from '@/stores';

import {
  StandingPromotionNotes
} from '@/modules/football/competition/components';
import { Images, genRankingColors, getImage, getLastMatches } from '@/utils';

const GroupStandingsSection: React.FC<{
  stageId: string;
  groupName: any;
  tournamentId?: string;
  seasonId?: string;
  uniqueTournament?: boolean;
  forTeam?: boolean;
  isLastGroup?: boolean;
}> = ({
  stageId,
  groupName,
  tournamentId,
  seasonId,
  uniqueTournament = true,
  forTeam = false,
  isLastGroup = false,
}) => {
  const i18n = useTrans();
  const { bxhFormat, bxhData } = useFilterStore();
  const { width } = useWindowSize();

  const { data, isLoading } = useSeasonStandingsData(
    tournamentId,
    seasonId,
    '',
    bxhData,
    uniqueTournament
  );

  const { data: groupMatch } = useGroupMatchData(
    tournamentId,
    seasonId,
    stageId
  );

  const { data: matches, isLoading: isLoadingForm } =
    useSeasonStandingsFormData(
      tournamentId,
      seasonId,
      stageId,
      bxhData,
      uniqueTournament
    );
  if (isLoading || !data.standings) {
    return (
      <StandingRowGroup
        check={groupName && groupName.includes('Group') ? true : false}
      />
    );
  }

  if (isLoadingForm || !matches) {
    return (
      <StandingRowGroup
        check={groupName && groupName.includes('Group') ? true : false}
      />
    );
  }

  const { standings: groups } = data;

  const groupData =
    groups?.find((group: any) => group.name === groupName) || {};
  const { rows = [] } = groupData || {};
  let wide = true;
  if (width < 800) {
    wide = false;
  }
  let groupLastMatches: any = {};
  if (forTeam) {
    groupLastMatches = matches || {};
  } else {
    const allGroupMatches: any[] = Object.values(matches);
    const allTeamMatches: any = {};
    for (const groupMatches of allGroupMatches) {
      for (const teamId in groupMatches) {
        const teamMatches: any[] = groupMatches[teamId] || [];
        allTeamMatches[teamId] = [
          ...(allTeamMatches[teamId] || []),
          ...teamMatches,
        ];
      }
    }
    groupLastMatches = allTeamMatches;
  }
  const rankingColors = genRankingColors(rows);

  const arrMatch = groupMatch?.events?.filter(
    (item: any) => item?.status?.code === 0
  );

  const arrMatchSort = arrMatch?.sort(
    (a: any, b: any) => a.startTimestamp - b.startTimestamp
  );

  const rowsNextMatch = rows?.map((item: any) => {
    const nextMatch = arrMatchSort?.find(
      (match: Match) =>
        match.homeTeam.id === item.team.id || match.awayTeam.id === item.team.id
    );

    return {
      ...item,
      nextTeam: nextMatch
        ? nextMatch.homeTeam.id === item.team.id
          ? nextMatch.awayTeam
          : nextMatch.homeTeam
        : undefined,
    };
  });

  return (
    <>
      <div className='overflow-x-auto rounded-lg border border-light-theme dark:border-head-tab scrollbar bg-white dark:bg-dark-match'>
        {rowsNextMatch.length > 0 && (
          <StandingHeaderRow
            showForm={bxhFormat === 'form' || wide}
            showLong={bxhFormat === 'full'}
            wide={wide}
          />
        )}
        {rowsNextMatch.length < 1 && (
          <div className='p-4 text-center text-xs dark:text-dark-text'>
            {i18n.common.nodata}
          </div>
        )}
        <ul className='divide-list w-fit text-xs'>
          {rowsNextMatch.map((row: any, idx: number) => {
            const {
              team = {},
              promotion = {},
              position,
              matches,
              wins,
              scoresFor,
              scoresAgainst,
              id,
              losses,
              draws,
              points,
              change,
              live,
              nextTeam,
            } = row;
            let teamLastMatches = groupLastMatches[team?.id] || [];
            teamLastMatches = getLastMatches(teamLastMatches);

            return (
              <StandingRow
                key={`key-${idx}`}
                uniqueKey={idx}
                no={position}
                team={team}
                nextMatchTeam={nextTeam}
                logoUrl={`${getImage(Images.team, team?.id)}`}
                isRankUp={change > 0} // TODO add more
                isRankDown={change < 0} // TODO add more
                change={change}
                noMatches={matches}
                noWin={wins}
                noDraw={draws}
                noLoss={losses}
                scoresFor={scoresFor}
                scoresAgainst={scoresAgainst}
                goalDiff={scoresFor - scoresAgainst}
                points={points}
                showForm={bxhFormat === 'form' || wide}
                showLong={bxhFormat === 'full'}
                promotion={promotion}
                lastMatches={teamLastMatches}
                wide={wide}
                rankingColors={rankingColors}
                live={live}
                classNameStickyColumn='bg-light-match dark:bg-dark-card'
              />
            );
          })}
        </ul>
      </div>

      <div>
        <StandingPromotionNotes rankingColors={rankingColors} />
      </div>
      {/* 
        <GroupMatches
          tournamentId={tournament?.id}
          seasonId={seasonId}
          stageId={stage_id}
        /> */}

      {/* {isLastGroup && (
          <div className='mt-4 text-xs text-dark-text'>
            {tieBreakingRule?.text}
          </div>
        )} */}
    </>
  );
};

export default GroupStandingsSection;
