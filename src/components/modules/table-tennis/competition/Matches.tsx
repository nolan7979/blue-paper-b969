import { EmptyEvent } from '@/components/common/empty';
import MatchSkeleton from '@/components/common/skeleton/homePage/MatchSkeleton';
import { MatchRowIsolated } from '@/components/modules/table-tennis/match';
import {
  MatchOdd,
  SeasonDto,
  SportEventDto,
  SportEventDtoWithStat,
  TournamentDto,
} from '@/constant/interface';
import { useListMatchByStageTeamData } from '@/hooks/useTableTennis';
import useTrans from '@/hooks/useTrans';
import { useHomeStore, useSettingsStore } from '@/stores';
import { useTheme } from 'next-themes';
import { useState } from 'react';

type MatchesProps = {
  selectedSeason: SeasonDto;
  teams: SportEventDto[];
  uniqueTournament: TournamentDto;
  leagues: any;
};

export const Matches: React.FC<MatchesProps> = ({
  leagues,
  uniqueTournament,
  teams,
  selectedSeason,
}) => {
  const i18n = useTrans();
  const { resolvedTheme } = useTheme();
  const [stage, setStage] = useState<any>({});
  const { homeSound } = useSettingsStore();
  const { matchesOdds } = useHomeStore();

  // Fetch the list of matches by stage and teams
  const { data: listMatchData = [], isLoading: isListMatchLoading } =
    useListMatchByStageTeamData(selectedSeason?.id);

  const onClick = (match: SportEventDtoWithStat) => {
    window.location.href = `/tennis/match/${match.slug}/${match.id}`;
  };

  if (isListMatchLoading) {
    return (
      <div className='flex flex-col gap-4 bg-white p-4 dark:bg-dark-container'>
        <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
          {i18n.titles.matches}
        </h3>
        <MatchSkeleton />
      </div>
    );
  }

  // No data case
  if (!listMatchData.length) {
    return (
      <div className='flex flex-col gap-4 bg-white p-4 dark:bg-dark-container'>
        <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
          {i18n.titles.matches}
        </h3>
        <EmptyEvent title={i18n.common.nodata} content={''} />
      </div>
    );
  }

  // Main rendering of matches
  return (
    <div className='flex flex-col gap-4 bg-white p-4 dark:bg-dark-container'>
      <h3 className='font-primary font-bold uppercase text-black dark:text-white'>
        {i18n.titles.matches}
      </h3>
      {/* {renderFilter()} */}
      <div className='flex max-h-[380px]'>
        <div className='w-full flex-1 overflow-y-auto scrollbar'>
          {Array.isArray(listMatchData) && listMatchData.length > 0 ? (
            listMatchData.map((match: any) => {
              const matchId = match?.id;
              const matchOdds: MatchOdd = matchesOdds[matchId];

              return (
                <MatchRowIsolated
                  key={match?.id}
                  handleClick={onClick}
                  match={match}
                  homeSound={homeSound}
                  i18n={i18n}
                  isDetail={true}
                  theme={resolvedTheme}
                  isSimulator={false}
                  matchOdds={matchOdds}
                />
              );
            })
          ) : (
            <EmptyEvent title={i18n.common.nodata} content='' />
          )}
        </div>
      </div>
    </div>
  );
};
