import clsx from 'clsx';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { memo, useEffect, useState } from 'react';
import {
  HiChevronLeft,
  HiOutlineChevronRight,
  HiPlusCircle,
} from 'react-icons/hi';
import tw from 'twin.macro';

import { useWindowSize } from '@/hooks';
import {
  useCupBracketData,
  useGroupMatchData,
  useLeagueTopPlayersPerGameData,
  useLeagueTopTeamsData,
  useRoundMatchesData,
  useSeasonGroupListData,
  useSeasonLastMatchesData,
  useSeasonNextMatchesData,
  useSeasonRoundListData,
} from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';

import { Select } from '@/components/common';
import { LeftArrowBtn, RightArrowBtn } from '@/components/common/LeftArrowBtn';
import BracketPopOver from '@/components/common/pop-over/BracketPopOver';
import MatchFilterRoundSkeleton from '@/components/common/skeleton/competition/MatchFIlterRound';
import Raking from '@/components/common/skeleton/competition/Raking';
import Schedule from '@/components/common/skeleton/competition/Schedule';
import { SelectRound } from '@/components/modules/football';
import {
  PlayerPerGameStats,
  TeamStats,
} from '@/components/modules/football/players';
import {
  QuickViewColumn,
  QuickViewColumn2nd,
} from '@/components/modules/football/quickviewColumn/QuickViewColumn';
import {
  League,
  ScoreBadge,
  SoccerTeam,
} from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import { SelectBXHFormat } from '@/components/modules/football/selects/SelectBXHFormat';
import { SelectGroup } from '@/components/modules/football/selects/SelectGroup';
import {
  Tw3rdPlaceBlockContainer,
  TwBlockContainer,
  TwBracketMatchBadge,
  TwCard,
  TwFilterButton,
  TwStageTitle,
} from '@/components/modules/football/tw-components';

import {
  IRoundItemV2,
  useFilterStore,
  useLeagueMatchFilterStore,
  useMatchStore,
  useMatchStore2nd,
} from '@/stores';
import { useLeagueStore } from '@/stores/league-store';
import { useMatchCompetition } from '@/stores/match-competition';

import { MatchState } from '@/constant/interface';
import {
  extractCompetitionId,
  formatTimestamp,
  formatTimestampV2,
  getImage,
  getSeasonNotes,
  getSlug,
  getStatsLabel,
  Images,
  isMatchHaveStat,
  isValEmpty,
  roundNumber,
  StatsLabel,
} from '@/utils';

import { SPORT } from '@/constant/common';
import UnknownTeamSVG from '/public/svg/unknown-team.svg';
import { FilterButton } from '@/components/modules/football/competitor';
import AvatarTeamCommon from '@/components/common/AvatarTeamCommon';

export const TopPlayerPerGameSection = ({
  uniqueTournament,
  selectedSeason,
  i18n,
}: {
  uniqueTournament?: any;
  selectedSeason?: any;
  i18n: any;
}) => {
  const [showAll, setShowAll] = useState(false);
  const [statType, setStatsType] = useState({
    name: 'Goals',
    key: 'goals',
  });
  const { data = {}, isLoading } = useLeagueTopPlayersPerGameData(
    uniqueTournament?.id,
    selectedSeason?.id
  );

  if (isLoading || !data) {
    const numbersArray2 = Array.from({ length: 9 }, (_, index) => index + 1);

    return (
      <div className='flex h-fit w-full  flex-col gap-3 rounded-lg bg-white px-2 py-8 dark:bg-dark-container'>
        {numbersArray2.map((number) => (
          <Raking key={number} />
        ))}
      </div>
    );
  }

  const { topPlayers = {} } = data || {};
  let players = topPlayers[statType?.key] || [];

  if (!showAll) {
    players = players.slice(0, 10);
  }

  if (isValEmpty(topPlayers)) return <></>;

  const statsTypes = Object.keys(topPlayers).map((key) => {
    const typedKey = key as StatsLabel;
    return {
      name: getStatsLabel(typedKey, i18n),
      key: key,
    };
  });

  return (
    <div className='rounded-lg bg-white dark:bg-dark-container'>
      <h3 className='px-4 py-2 font-primary font-bold uppercase text-black dark:text-white'>
        {i18n.titles.top_stats}
      </h3>

      {/* Dropdown */}
      <div className='px-2'>
        <Select
          options={statsTypes}
          label='name'
          valueGetter={setStatsType}
          size='full'
        ></Select>
      </div>

      {/* Players list */}
      <div>
        <div className='flex justify-between p-4 text-csm dark:text-dark-text'>
          <div className='w-5 text-center text-csm font-normal leading-4'>
            #
          </div>
          <div className='flex-1'></div>
          <div className='text-center text-csm font-normal capitalize leading-4'>
            {statType?.name}
          </div>
        </div>
        <ul className='divide-list'>
          {players.map((playerData: any, index: number) => {
            const {
              player = {},
              statistic: statValue = 0,
              event,
            } = playerData || {};

            return (
              <li key={index} className='item-hover cursor-pointer px-4 py-2'>
                <PlayerPerGameStats
                  playerId={player?.id}
                  name={player?.name}
                  imgUrl={`${getImage(
                    Images.player,
                    player?.id,
                    true,
                    SPORT.FOOTBALL
                  )}`}
                  statType={statType?.key}
                  statValue={roundNumber(statValue)}
                  position={index + 1}
                  event={event}
                ></PlayerPerGameStats>
              </li>
            );
          })}
        </ul>
      </div>
      <div className='flex justify-end p-2.5'>
        <TwShowButton
          onClick={() => setShowAll(!showAll)}
          className='cursor-pointer text-left text-sm leading-4 text-logo-blue'
        >
          {showAll ? i18n.common.show_less : i18n.common.show_more}
        </TwShowButton>
      </div>
    </div>
  );
};

export const TwShowButton = tw.button`text-sm leading-4 text-left cursor-pointer`;

export const TopTeamsSection = ({
  uniqueTournament,
  selectedSeason,
  i18n,
}: {
  uniqueTournament?: any;
  selectedSeason?: any;
  i18n: any;
}) => {
  const [showAll, setShowAll] = useState(false);
  const [statType, setStatsType] = useState({
    name: getStatsLabel('goalsScored'),
    key: 'goalsScored',
  });
  const { data = {}, isLoading } = useLeagueTopTeamsData(
    uniqueTournament?.id,
    selectedSeason?.id
  );

  if (isLoading || !data) {
    const numbersArray2 = Array.from({ length: 9 }, (_, index) => index + 1);

    return (
      <div className='flex h-fit w-full  flex-col gap-3 rounded-lg bg-white px-2 py-8 dark:bg-dark-container'>
        {numbersArray2.map((number) => (
          <Raking key={number} />
        ))}
      </div>
    );
  }

  const { topTeams = {} } = data || {};
  if (isValEmpty(topTeams)) return <></>;

  let teams = topTeams[statType?.key] || [];
  if (!showAll) {
    teams = teams.slice(0, 10);
  }
  const statsTypes = Object.keys(topTeams).map((key) => {
    const typedKey = key as StatsLabel;
    return {
      name: getStatsLabel(typedKey, i18n),
      key: key,
    };
  });

  return (
    <div className='rounded-lg bg-white dark:bg-dark-container '>
      <h3 className='px-4 py-2 font-primary font-bold uppercase text-black dark:text-white'>
        {i18n.titles.top_team}
      </h3>

      {/* Dropdown */}
      <div className='px-2'>
        <Select
          options={statsTypes}
          label='name'
          valueGetter={setStatsType}
          size='full'
        />
      </div>

      {/* Players list */}
      <div>
        <div className='flex justify-between px-4 py-2.5 text-csm dark:text-dark-text'>
          <div className='w-5 text-center text-csm font-normal leading-4'>
            #
          </div>
          <div className='flex-1'></div>
          <div className='text-center text-csm font-normal capitalize leading-4'>
            {statType?.name}
          </div>
        </div>
        <ul className='divide-list'>
          {teams.map((teamData: any, index: number) => {
            const { team = {}, statistics = {} } = teamData || {};

            return (
              <li key={index} className='item-hover cursor-pointer px-4 py-2'>
                <TeamStats
                  teamId={team?.id}
                  name={team?.name}
                  imgUrl={`${getImage(
                    Images.team,
                    team?.id,
                    true,
                    SPORT.FOOTBALL
                  )}`}
                  statType={statType?.key}
                  statValue={roundNumber(statistics[statType?.key])}
                  position={index + 1}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div className='flex justify-end p-4'>
        <TwShowButton
          onClick={() => setShowAll(!showAll)}
          className='cursor-pointer text-left text-sm leading-4 text-logo-blue'
        >
          {showAll ? i18n.common.show_less : i18n.common.show_more}
        </TwShowButton>
      </div>
    </div>
  );
};

export const MatchLeagueSection = ({
  uniqueTournament,
  selectedSeason,
  showQuickViewColumn = true,
}: {
  uniqueTournament: any;
  selectedSeason: any;
  showQuickViewColumn?: boolean;
}) => {
  const { filterMatchBy } = useLeagueMatchFilterStore();
  const { setShowSelectedMatch } = useMatchStore();

  useEffect(() => {
    setShowSelectedMatch(false);
  }, [filterMatchBy, setShowSelectedMatch]);

  if (filterMatchBy === 'by_group') {
    return (
      <>
        <GroupFilterSection
          uniqueTournamentId={uniqueTournament?.id}
          selectedSeasonId={selectedSeason?.id}
        ></GroupFilterSection>
        <MatchesByGroupSection
          uniqueTournament={uniqueTournament}
          selectedSeason={selectedSeason}
        ></MatchesByGroupSection>
      </>
    );
  } else if (filterMatchBy === 'by_round') {
    return (
      <>
        <RoundFilterSection
          uniqueTournamentId={uniqueTournament?.id}
          selectedSeasonId={selectedSeason?.id}
        ></RoundFilterSection>
        <MatchesByRoundSection
          uniqueTournament={uniqueTournament}
          selectedSeason={selectedSeason}
          showQuickViewColumn={showQuickViewColumn}
        ></MatchesByRoundSection>
      </>
    );
  } else {
    return (
      <MatchesByDateSection
        uniqueTournament={uniqueTournament}
        selectedSeason={selectedSeason}
        showQuickView={true}
      ></MatchesByDateSection>
    );
  }
};

export const MatchesByRoundSection = ({
  uniqueTournament,
  selectedSeason,
  sport = 'football',
  showQuickViewColumn = true,
}: {
  uniqueTournament: any;
  selectedSeason: any;
  sport?: string;
  showQuickViewColumn?: boolean;
}) => {
  const { selectedRound } = useLeagueMatchFilterStore();

  const { setSelectedMatch, setShowSelectedMatch } = useMatchStore();

  const {
    data = {},
    isLoading,
    isError,
  } = useRoundMatchesData(
    uniqueTournament?.id,
    selectedSeason?.id,
    selectedRound.stage_id,
    getSlug(selectedRound.name)
  );

  useEffect(() => {
    const { events = [] } = data || {};
    if (!isValEmpty(events)) {
      setSelectedMatch(events[0]?.id || events[0].customId);
      setShowSelectedMatch(true);
    }
  }, [data, selectedRound, setSelectedMatch, setShowSelectedMatch]);

  if (isLoading || isError) return <MatchFilterRoundSkeleton />;

  const { hasNextPage, events = [] } = data || {};

  return (
    <>
      <div className=' flex gap-0.5'>
        <div className='w-5/12 flex-1 overflow-scroll py-2.5 no-scrollbar xl:p-2.5'>
          <div
            className={`h-[100vh] overflow-scroll overflow-x-hidden scrollbar md:${
              events.length < 12 ? '!h-fit' : ''
            }`}
          >
            <ShowLeagueMatchesSection
              matches={events}
            ></ShowLeagueMatchesSection>
          </div>
        </div>
        {showQuickViewColumn && (
          <div className='hidden flex-1 overflow-auto lg:block'>
            <LeagueQuickViewSection></LeagueQuickViewSection>
          </div>
        )}
      </div>
    </>
  );
};

export const MatchesByGroupSection = ({
  uniqueTournament,
  selectedSeason,
}: {
  uniqueTournament: any;
  selectedSeason: any;
}) => {
  const { selectedGroup } = useLeagueMatchFilterStore();

  const { setSelectedMatch, setShowSelectedMatch } = useMatchStore();

  const {
    data = {},
    isLoading,
    isError,
  } = useGroupMatchData(selectedGroup?.tournamentId, selectedSeason?.id);

  useEffect(() => {
    if (!isValEmpty(data)) {
      setSelectedMatch(data[0]?.id || data[0].customId);
      setShowSelectedMatch(true);
    }
  }, [data, setSelectedMatch, setShowSelectedMatch]);

  if (isLoading || isError) return <></>; // TODO

  return (
    <>
      <div className=' flex gap-0.5'>
        <div className='w-5/12 flex-1 overflow-scroll py-2.5 no-scrollbar xl:p-2.5'>
          <div className='h-[100vh] overflow-scroll overflow-x-hidden scrollbar'>
            <ShowLeagueMatchesSection matches={data}></ShowLeagueMatchesSection>
          </div>
        </div>
        <div className='hidden flex-1 overflow-auto lg:block'>
          <LeagueQuickViewSection></LeagueQuickViewSection>
        </div>
      </div>
    </>
  );
};

export const GroupFilterSection = ({
  uniqueTournamentId,
  selectedSeasonId,
}: {
  uniqueTournamentId: string;
  selectedSeasonId: string;
}) => {
  const {
    data: groups = {},
    isLoading,
    isError,
  } = useSeasonGroupListData(uniqueTournamentId, selectedSeasonId);

  const { selectedGroup, setSelectedGroup } = useLeagueMatchFilterStore();
  const { setShowSelectedMatch } = useMatchStore();

  useEffect(() => {
    if (!isLoading && !isError && !isValEmpty(groups)) {
      setSelectedGroup(groups[0]?.id);
    }
    if (isValEmpty(groups)) {
      setShowSelectedMatch(false);
    }
  }, [isLoading, isError, groups, setSelectedGroup, setShowSelectedMatch]);

  if (isLoading || isValEmpty(groups) || isError) {
    return <></>;
  }

  if (groups && groups.length < 2) {
    return <></>;
  }

  return (
    <>
      <div className=' flex w-full items-center justify-between gap-2 p-2.5 lg:w-1/2'>
        <div className='w-1/6'>
          <TwFilterButton
            onClick={() => {
              if (!selectedGroup && groups.length) {
                setSelectedGroup(groups[0]);
              } else {
                for (const idx in groups) {
                  const group = groups[idx];
                  const { tournamentId, groupName } = group || {};

                  if (
                    tournamentId === selectedGroup.tournamentId &&
                    groupName === selectedGroup.groupName
                  ) {
                    const prevIdx = parseInt(idx) - 1;
                    if (prevIdx >= 0) {
                      const previousGroup = groups[prevIdx];
                      setSelectedGroup(previousGroup);
                    }
                    break;
                  }
                }
              }
            }}
          >
            Previous
          </TwFilterButton>
        </div>
        <div className='flex-1'>
          {!isValEmpty(groups) && <SelectGroup options={groups}></SelectGroup>}
        </div>
        <div>
          <TwFilterButton
            onClick={() => {
              if (!selectedGroup) {
                setSelectedGroup(groups[0]);
              } else {
                for (const idx in groups) {
                  const group = groups[idx];
                  const { tournamentId, groupName } = group || {};

                  if (
                    tournamentId === selectedGroup.tournamentId &&
                    groupName === selectedGroup.groupName
                  ) {
                    const nextIdx = parseInt(idx) + 1;
                    if (nextIdx < groups.length) {
                      const nextGroup = groups[nextIdx];
                      setSelectedGroup(nextGroup);
                    }
                    break;
                  }
                }
              }
            }}
          >
            Next
          </TwFilterButton>
        </div>
      </div>
    </>
  );
};

export const RoundFilterSection = memo(({
  uniqueTournamentId,
  selectedSeasonId,
}: {
  uniqueTournamentId: string;
  selectedSeasonId: string;
}) => {
  const { data, isLoading, isError } = useSeasonRoundListData(
    uniqueTournamentId,
    selectedSeasonId
  );
  const i18n = useTrans();
  const {  setSelectedRound } = useLeagueMatchFilterStore();


  useEffect(() => {
    if (!isLoading && !isError && data) {
      const { currentRound } = data;

      if (currentRound && currentRound.stage_id ) {
        setSelectedRound(currentRound);
      }
    }
  }, [ isError, data]);

  if (isError || !data) {
    return <></>;
  }

  const { rounds, currentRound } = data;

  return (
    <>
      <div className='flex w-auto items-center justify-between gap-2 py-2.5'>
        <div className='flex-1 h-full'>
          {!isValEmpty(rounds) && (
            <SelectRound
              options={rounds}
              currentRound={currentRound}
              className='bg-white lg:bg-light-match'
            ></SelectRound>
          )}
        </div>
      </div>
    </>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.uniqueTournamentId === nextProps.uniqueTournamentId && prevProps.selectedSeasonId === nextProps.selectedSeasonId;
  }
);

export const MatchesByDateSection = ({
  uniqueTournament,
  selectedSeason,
  showQuickView = true,
}: {
  uniqueTournament: any;
  selectedSeason: any;
  showQuickView?: boolean;
}) => {
  const {
    page,
    setPage,
    setMatchesNotStarted,
    setMatchesEnded,
    setIndex,
    resetAll,
  } = useMatchCompetition((state) => state);

  const i18n = useTrans();
  const { data: lastEvents, isError: isErrorLast } = useSeasonLastMatchesData(
    uniqueTournament?.id,
    selectedSeason?.id,
    page,
    true
  );

  const {
    data: nextEvents,
    isFetching: isFetchingNext,
    isError: isErrorNext,
  } = useSeasonNextMatchesData(uniqueTournament?.id, selectedSeason?.id, page);

  const { selectedMatch, setSelectedMatch, setShowSelectedMatch } =
    useMatchStore();
  const [allMatchEvent, setAllMatchEvent] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    resetAll();
  }, [uniqueTournament?.id, selectedSeason?.id, resetAll]);

  useEffect(() => {
    const allEvents = [...(lastEvents || []), ...(nextEvents?.events || [])];
    setMatchesEnded(lastEvents || []);
    setIndex();

    if (!isValEmpty(allEvents)) {
      const findMatch = allEvents.find(
        (item) => item.status?.code !== MatchState.End
      );

      if (findMatch) {
        setSelectedMatch(findMatch.id || findMatch?.customId);
      } else {
        setSelectedMatch(allEvents[0]?.id || allEvents[0]?.customId);
      }

      setShowSelectedMatch(true);
    }
    setAllMatchEvent(allEvents);
  }, [
    lastEvents,
    nextEvents?.events,
    setMatchesEnded,
    setMatchesNotStarted,
    setSelectedMatch,
    setShowSelectedMatch,
    setIndex,
  ]);

  useEffect(() => {
    if (!selectedMatch && allMatchEvent.length > 0) {
      setSelectedMatch(allMatchEvent[0]?.id || allMatchEvent[0]?.customId);
    }
  }, [allMatchEvent]);

  if (isValEmpty(allMatchEvent)) {
    if (isErrorNext) setPage(false);
    else if (isErrorLast) setPage(true);
  }

  return (
    <>
      <div className=' flex gap-0.5'>
        <div className='w-5/12 flex-1 overflow-scroll py-2.5 no-scrollbar xl:p-2.5'>
          <div className='flex justify-between gap-2 p-2.5'>
            <div className='w-1/4'>
              {(!isErrorLast || page > 0) && (
                <TwFilterButton onClick={() => setPage(false)} className=''>
                  {i18n.competition.previous}
                </TwFilterButton>
              )}
            </div>
            <div className='w-1/4'>
              {(page < 0 || !!nextEvents?.hasNextPage) && (
                <TwFilterButton onClick={() => setPage(true)}>
                  {i18n.competition.next}
                </TwFilterButton>
              )}
            </div>
          </div>
          <div className='h-[100vh] overflow-scroll overflow-x-hidden scrollbar'>
            {/* <ShowLeagueDateMatchesSection /> */}
            <ShowLeagueMatchesSection
              matches={allMatchEvent}
              isFetching={isFetchingNext}
            ></ShowLeagueMatchesSection>
          </div>
        </div>
        {showQuickView && (
          <div className='hidden flex-1 overflow-auto lg:block'>
            <LeagueQuickViewSection></LeagueQuickViewSection>
          </div>
        )}
      </div>
    </>
  );
};

export const MatchFilterTypeSection = ({ tournament }: { tournament: any }) => {
  // TODO use more filter here
  const { filterMatchBy, setFilterMatchBy } = useLeagueMatchFilterStore();
  const i18n = useTrans();
  return (
    <div className='flex gap-2'>
      <TwFilterButton
        isActive={filterMatchBy === 'by_date'}
        onClick={() => setFilterMatchBy('by_date')}
      >
        {i18n.competition.byDate}
      </TwFilterButton>
      {`${tournament?.id}` !== '242' && (
        <TwFilterButton
          isActive={filterMatchBy === 'by_round'}
          onClick={() => setFilterMatchBy('by_round')}
        >
          {i18n.competition.byRound}
        </TwFilterButton>
      )}
      {(tournament?.type === 2 || tournament?.type === 3) && (
        <TwFilterButton
          isActive={filterMatchBy === 'by_group'}
          onClick={() => setFilterMatchBy('by_group')}
        >
          {i18n.competition.byGroup}
        </TwFilterButton>
      )}
    </div>
  );
};

export const ShowLeagueMatchesSection = ({
  matches = [],
  isLoading,
  isFetching,
}: {
  matches: any[];
  isLoading?: boolean;
  isFetching?: boolean;
}) => {
  if (isLoading || isFetching) {
    const numbersArray = Array.from({ length: 10 }, (_, index) => index + 1);
    return (
      <div>
        {numbersArray.map((number) => (
          <Schedule key={number} />
        ))}
      </div>
    );
  }
  return (
    <ul className='space-y-1.5 px-2.5 lg:pl-0'>
      {matches.map((match: any, idx: number) => {
        return (
          <DetailedLeagueMatchRow
            key={`${idx}`}
            h2hEvent={match}
          ></DetailedLeagueMatchRow>
        );
      })}
    </ul>
  );
};

export const ShowLeagueDateMatchesSection = () => {
  const { page, index, matchesShow } = useMatchCompetition((state) => state);
  return (
    <ul className='space-y-1.5 px-2.5 lg:pl-0'>
      {matchesShow
        .slice(index + page * 10, index + 10 + page * 10)
        .map((match: any, idx: number) => {
          return (
            <DetailedLeagueMatchRow
              key={`${idx}`}
              h2hEvent={match}
            ></DetailedLeagueMatchRow>
          );
        })}
    </ul>
  );
};

export const DetailedLeagueMatchRow = ({
  h2hEvent,
}: {
  h2hEvent?: any;
  h2HFilter?: string;
  teamId?: string;
}) => {
  const router = useRouter();
  const { width } = useWindowSize();
  const i18n = useTrans();

  const {
    id,
    homeTeam = {},
    awayTeam = {},
    homeScore = {},
    awayScore = {},
    tournament = {},
    startTimestamp,
    status,
  } = h2hEvent || {};

  const {
    selectedMatch,
    setSelectedMatch,
    setShowSelectedMatch,
    toggleShowSelectedMatch,
  } = useMatchStore();
  const isSelectedMatch = selectedMatch == id;

  const time = formatTimestampV2(
    startTimestamp,
    status?.code,
    'dd/MM/yyyy - HH:mm'
  );

  return (
    <li
      className={`flex cursor-pointer items-center gap-2 rounded-md bg-light-match p-2 pl-4 text-sm dark:bg-dark-match ${
        isSelectedMatch ? 'border border-solid border-logo-blue' : ''
      }`}
      onClick={() => {
        if (width < 1024) {
          setSelectedMatch(`${id}`);
          router.push(`/football/match/${id}`);
          // window.location.href = `/match/football/${id}`;
        } else {
          if (`${id}` === `${selectedMatch}`) {
            toggleShowSelectedMatch();
          } else {
            setShowSelectedMatch(true);
            setSelectedMatch(`${id}`);
          }
        }
      }}
    >
      <div className='w-2/5 space-y-1 truncate'>
        <div className=' flex gap-1'>
          <League
            logoUrl={`${getImage(
              Images.competition,
              extractCompetitionId(tournament?.id)
            )}`}
            name={`${tournament.name}`}
          ></League>
        </div>
        <p className='ml-1 text-csm font-normal not-italic leading-5'>
          {typeof time === 'string' &&
          i18n.common[time as keyof typeof i18n.common]
            ? i18n.common[time as keyof typeof i18n.common]
            : time}
        </p>
      </div>
      <div className='w-2/5 space-y-1 truncate'>
        <SoccerTeam
          logoUrl={`${getImage(Images.team, homeTeam?.id)}`}
          name={`${homeTeam.name}`}
          team={homeTeam}
        ></SoccerTeam>

        <SoccerTeam
          logoUrl={`${getImage(Images.team, awayTeam?.id)}`}
          name={`${awayTeam.name}`}
          team={awayTeam}
        ></SoccerTeam>
      </div>
      {isMatchHaveStat(status?.code) && (
        <div className='divide-list-x flex w-1/6 justify-evenly'>
          <div className='flex flex-col place-content-center'>
            <div className='my-auto w-9 space-y-1 p-2 text-white'>
              <ScoreBadge score={homeScore.display}></ScoreBadge>
              <ScoreBadge score={awayScore.display}></ScoreBadge>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

export const LeagueQuickViewSection = () => {
  const { showSelectedMatch } = useMatchStore();

  return (
    <div className='space-y-4 py-2.5 lg:p-2.5'>
      {showSelectedMatch && (
        <QuickViewColumn top={false} sticky={false} isBreadCumb={false} />
      )}
    </div>
  );
};

export const LeagueQuickViewSection2nd = () => {
  const { showSelectedMatch } = useMatchStore2nd();

  return (
    <div className='space-y-4 py-2.5 lg:p-2.5'>
      {showSelectedMatch && (
        <QuickViewColumn2nd type2nd={true} top={false} sticky={false} />
      )}
    </div>
  );
};

export const StandingPromotionNotes = ({
  rankingColors,
}: {
  rankingColors: any;
}) => {
  const promotionNotes = getSeasonNotes(rankingColors) || [];

  return (
    <ul className='px-2.5'>
      {promotionNotes.map((note: any, idx: number) => {
        const { text, color } = note;
        return (
          //   bg-[${color}] text-black
          <li key={idx} className='flex items-center gap-2 py-0.5'>
            <div
              className='h-2.5 w-2.5 rounded-full'
              style={{ backgroundColor: color, color: '#000000' }}
              css={[color]}
            ></div>
            <div className='text-csm text-dark-text'>{text}</div>
          </li>
        );
      })}
    </ul>
  );
};

export const GroupMatches = ({
  tournamentId,
  seasonId,
  stageId,
}: {
  tournamentId?: string;
  seasonId?: string;
  stageId?: string;
}) => {
  const [round, setRound] = useState<number>(1);
  const [maxRound, setMaxRound] = useState<number>(1);

  const { data, isLoading } = useGroupMatchData(
    tournamentId,
    seasonId,
    stageId
  );
  const { events = [], cur_round } = data || {};

  useEffect(() => {
    const findMaxRound = (matches: any, condition: any) => {
      return (
        matches?.reduce((max: any, match: any) => {
          const { roundInfo } = match;
          return roundInfo?.round > max ? roundInfo?.round : max;
        }, 0) || 0
      );
    };

    const maxRound = findMaxRound(events, () => true);

    setRound(cur_round > 0 ? cur_round : maxRound);

    setMaxRound(maxRound);
  }, [events, cur_round]);

  if (isLoading || !events) return <></>; // TODO: skeletons

  if (!events[0]?.roundInfo) {
    // MLS doesn't use round
    return <></>;
  }
  return (
    <div className='hidden rounded-md bg-light-match px-0.5 dark:bg-dark-match md:p-2 lg:block'>
      <div className='flex items-center justify-between p-2 md:p-0'>
        <RoundSwitcher
          maxRound={maxRound}
          round={round}
          setRound={setRound}
        ></RoundSwitcher>
      </div>
      <div className='pt-2'>
        <ul className='space-y-1'>
          {events
            .filter((match: any) => {
              return (
                match.roundInfo?.round === round
                // && match.stage_id === stageId
              );
            })
            .sort((a: any, b: any) => a.startTimestamp - b.startTimestamp)
            .map((match: any, idx: number) => {
              return (
                <MatchRowRound
                  key={`${match?.id}-${idx}`}
                  match={match}
                ></MatchRowRound>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export const RoundSwitcher = ({
  maxRound,
  round,
  setRound,
}: {
  maxRound: number;
  round: number;
  setRound: any;
}) => {
  const i18n = useTrans();

  const prevRound = round - 1 > 0 ? round - 1 : round;
  const nextRound = round + 1 > maxRound ? maxRound : round + 1;

  return (
    <>
      <LeftArrowBtn onClick={() => setRound(prevRound)}></LeftArrowBtn>
      <span className='text-xs font-bold not-italic leading-4'>
        <span className='text-xs font-bold not-italic leading-4'>
          {round !== 0
            ? `${i18n.football.round} ${round}`
            : `${i18n.common.scheduledMatches}`}
        </span>
      </span>
      <RightArrowBtn onClick={() => setRound(nextRound)}></RightArrowBtn>
    </>
  );
};

export const MatchRowRound = ({ match }: { match: any }) => {
  const router = useRouter();
  const i18n: any = useTrans();
  const [isErrorHomeTeam, setIsErrorHomeTeam] = useState(false);
  const [isErrorAwayTeam, setIsErrorAwayTeam] = useState(false);

  const {
    homeTeam = {},
    awayTeam = {},
    homeScore = {},
    awayScore = {},
    status = {},
  } = match || {};
  const { type = '' } = status || {};
  //bg-head-tab dark:bg-dark-head-tab
  return (
    <TwMatchLi
      className=''
      onClick={() => {
        router.push(`/football/match/${match?.id}`);
      }}
    >
      <div className='flex w-1/6 flex-col items-center gap-x-2 md:flex-row md:gap-x-4'>
        <TwMatchText className='inline-block md:hidden'>
          {formatTimestamp(match?.startTimestamp, 'dd/MM')}
        </TwMatchText>
        <TwMatchText className='hidden md:inline-block'>
          {formatTimestamp(match?.startTimestamp, 'dd/MM/yyyy')}
        </TwMatchText>
        <TwMatchText className=''>
          {i18n.status[type] || format(match?.startTimestamp * 1000, 'HH:mm')}
        </TwMatchText>
      </div>
      <div className='flex flex-1  items-center gap-1 overflow-hidden md:gap-3'>
        <div className='flex w-1/3  items-center justify-end gap-2'>
          <TwMatchText className='truncate'>{homeTeam.name}</TwMatchText>
          <img
            src={`${
              isErrorHomeTeam
                ? '/images/football/teams/unknown-team.png'
                : `${getImage(Images.team, homeTeam?.id, true, SPORT.FOOTBALL)}`
            }`}
            alt='..'
            width={18}
            height={18}
            onError={() => setIsErrorHomeTeam(true)}
            className='h-[18px] w-[18px]'
          />
        </div>
        <TwScoreText className='w-10 text-center md:w-14'>
          {homeScore.display} - {awayScore.display}
        </TwScoreText>
        <div className='flex w-1/3 items-center gap-2'>
          <img
            src={`${
              isErrorAwayTeam
                ? '/images/football/teams/unknown-team.png'
                : `${getImage(Images.team, awayTeam?.id, true, SPORT.FOOTBALL)}`
            }`}
            alt='..'
            width={18}
            height={18}
            className='h-[18px] w-[18px]'
            onError={() => setIsErrorAwayTeam(true)}
          />
          <TwMatchText className='truncate'>{awayTeam.name}</TwMatchText>
        </div>
      </div>
      {/* <TwMatchText className='w-1/12'></TwMatchText> */}
    </TwMatchLi>
  );
};

export const TwScoreText = tw.span`rounded-sm bg-logo-blue px-0.5 md:px-2.5 text-csm font-bold not-italic leading-5 text-white`;
export const TwMatchText = tw.span`not-italic font-normal text-xs leading-5  `;
export const TwMatchLi = tw.li`flex rounded-md bg-white dark:bg-dark-hl-1 items-center md:p-2 cursor-pointer`;

export const StandingTypeFilterGroup = ({
  bxhData,
  setBxhData,
  wide,
  showRecentMatch
}: {
  bxhData: string;
  setBxhData: any;
  wide: boolean;
  showRecentMatch?: boolean
}) => {
  const i18n = useTrans();
  const { showRecentMatchMobile, setShowRecentMatchMobile } = useFilterStore();

  const filterOptions = [
    { value: 'total', label: i18n.filter.all },
    { value: 'home', label: i18n.filter.home_venue },
    { value: 'away', label: i18n.filter.away_venue },
    // { value: 'topScore', label: i18n.tab.topScore },
  ];

  return (
    <div className='flex justify-between gap-x-2 w-full'>
      <div className='flex gap-0 lg:gap-3 px-1 lg:px-0 rounded-full bg-white dark:bg-transparent dark:lg:bg-dark-head-tab '>
        {filterOptions.map((option) => (
          <FilterButton
            key={option.value}
            label={option.label}
            isActive={bxhData === option.value}
            onClick={() => {
              setBxhData(option.value);
              showRecentMatchMobile && setShowRecentMatchMobile(false);
            }}
          />
        ))}
        {showRecentMatch && <FilterButton
            label={i18n.tab.topScore}
            isActive={showRecentMatchMobile}
            onClick={() => {
              setShowRecentMatchMobile(true)
              setBxhData('');
            }}
          />
        }
      </div>
      <div className='flex gap-2'>{!wide && <SelectBXHFormat />}</div>
    </div>
  );
};

const PlayoffsBracket = ({ cupTree }: { cupTree?: any }) => {
  // const router = useRouter();
  // const parts = router.asPath.split('\\');
  // const sport = parts[1];

  const { selectedView } = useLeagueStore();

  if (!cupTree) return <></>;

  const { views = [], name, thirdPlaceCupBlock = {} } = cupTree || {};
  const selectedViewData = views[selectedView] || [];

  return (
    <TwCard className='space-y-2.5 p-2.5'>
      <TwStageTitle className='text-center'>{name}</TwStageTitle>

      <BracketPages
        pages={selectedViewData}
        maxView={views.length - 1 || 0}
        thirdPlaceCupBlock={thirdPlaceCupBlock}
      ></BracketPages>

      {/* <div className='flex place-content-center gap-3'>
        <TwFilterButton
          onClick={() => {
            setSelectedView(Math.min(selectedView + 1, views.length - 1 || 0));
            setMaxViews(views.length - 1 || 0);
          }}
        >
          <HiChevronDoubleLeft />
          {i18n.filter.previous}
        </TwFilterButton>
        <TwFilterButton
          onClick={() => setSelectedView(Math.max(selectedView - 1, 0))}
        >
          {i18n.filter.next} <HiChevronDoubleRight />
        </TwFilterButton>
      </div> */}
    </TwCard>
  );
};

export const BracketTrees = ({
  tournamentId,
  seasonId,
}: {
  tournamentId: string;
  seasonId: string;
}) => {
  const { data, isLoading, refetch } = useCupBracketData(
    tournamentId,
    seasonId
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (isLoading || !data) return <></>; // TODO: skeletons
  return (
    <>
      {data
        .slice()
        .reverse()
        .map((cupTree: any, idx: number) => {
          return (
            <PlayoffsBracket key={idx} cupTree={cupTree}></PlayoffsBracket>
          );
        })}
    </>
  );
};

const TwRoundsContainer = tw.div``;
const TwRoundContainer = tw.div`w-52`;

const BracketPages = ({
  pages,
  maxView,
  thirdPlaceCupBlock,
}: {
  pages: any[];
  maxView: number;
  thirdPlaceCupBlock?: any;
}) => {
  const { selectedOrder, selectedView } = useLeagueStore();
  let selectedPage = pages.find((page: any) => page.order === selectedOrder);
  if (isValEmpty(selectedPage)) selectedPage = pages[0] || {};

  const firstOrder = selectedPage.order;

  return (
    <>
      <div className=' flex place-content-center rounded-md bg-light-match p-4 dark:bg-dark-main'>
        <Rounds
          roundData={selectedPage}
          firstOrder={firstOrder}
          maxView={maxView}
          parentOrder={firstOrder}
          root={true}
          thirdPlaceCupBlock={thirdPlaceCupBlock}
        ></Rounds>
      </div>
    </>
  );
};

function getClosestDivisibleByFour(num: number) {
  if (num % 4 === 0) {
    return num;
  }

  const lower = num - (num % 4);

  return lower;
}

function getParentOrder(order: number) {
  return Math.round(getClosestDivisibleByFour(order) / 4);
}

const Rounds = ({
  roundData,
  firstOrder,
  maxView,
  parentOrder = 1,
  thirdPlaceCupBlock,
  root = false,
}: {
  roundData: any;
  firstOrder: number;
  maxView: number;
  parentOrder?: number;
  thirdPlaceCupBlock?: any;
  root?: boolean;
}) => {
  const router = useRouter();
  const [isErrorLeftTeam, setIsErrorLeftTeam] = useState(false);
  const [isErrorRightTeam, setIsErrorRightTeam] = useState(false);

  // const sport = useMemo(() => {
  //   const parts = router.asPath.split('/');
  //   return parts[2] || 'football';
  // }, [router.asPath]);

  const {
    selectedView,
    selectedOrder,
    setSelectedOrder,
    setSelectedView,
    // maxViews,
  } = useLeagueStore();

  const {
    order,
    left,
    right,
    // round,
    participants,
    events = [],
    height,
    depth,
    parent_order,
  } = roundData || {};
  const leftParticipant = participants ? participants[0] : null;
  const rightParticipant = participants ? participants[1] : null;
  let usedParentOrder = parent_order;
  if (!usedParentOrder) {
    usedParentOrder = getParentOrder(order);
  }

  const {
    team: leftTeam = {},
    score: leftScore,
    winner: leftWin,
  } = leftParticipant || {};
  const {
    team: rightTeam = {},
    score: rightScore,
    winner: rightWin,
  } = rightParticipant || {};

  return (
    <div className='flex overflow-y-scroll no-scrollbar'>
      <TwRoundsContainer className='relative flex flex-1 flex-col'>
        {left && (
          <Rounds
            roundData={left}
            firstOrder={firstOrder}
            maxView={maxView}
            parentOrder={usedParentOrder || parentOrder}
          ></Rounds>
        )}
        {right && (
          <Rounds
            roundData={right}
            firstOrder={firstOrder}
            maxView={maxView}
            parentOrder={usedParentOrder || parentOrder}
          ></Rounds>
        )}
        {left && (
          <span className='absolute right-0 top-[25%] h-[50%] w-[1.5px] bg-logo-blue/50'></span>
        )}
      </TwRoundsContainer>
      <TwRoundContainer className='flex w-56 flex-col place-content-center items-center text-dark-text '>
        <div className='flex w-full place-content-center items-center'>
          {order > 1 && !left && selectedView < maxView && (
            <button
              className='mr-1 rounded-full bg-logo-blue/50 text-center text-white'
              onClick={() => {
                setSelectedOrder(order);
                setSelectedView(Math.min(selectedView + 1, maxView));
              }}
            >
              <HiChevronLeft className='h-5 w-5'></HiChevronLeft>
            </button>
          )}

          {left && <span className=' h-[1.5px] flex-1 bg-logo-blue/50'></span>}
          <TwBlockContainer
            className=' border-gradient-to-r relative my-1.5 cursor-pointer border-logo-blue from-blue-500 via-blue-200 to-blue-500'
            onClick={() => {
              if (events && events.length > 0) {
                if (events.length > 1) {
                  // console.log('Show hover for events:', eventIds);
                } else {
                  router.push(`/football/match/${events[0]}`);
                  // window.location.href = `/match/${events[0]}`;
                }
              }
            }}
          >
            {events && events.length > 1 && (
              <div className='absolute -right-2.5 top-[52%] -translate-y-1/2 transform'>
                {/* TODO no need for last match */}
                <BracketPopOver matches={events}>
                  <button className=''>
                    <HiPlusCircle className='h-5 w-5'></HiPlusCircle>
                  </button>
                </BracketPopOver>
              </div>
            )}
            <div
              className='flex gap-2 border-b border-dark-text/10 p-3'
              css={[leftWin && tw`text-black dark:text-white`]}
            >
              {leftTeam?.id ? (
                <AvatarTeamCommon
                  team={leftTeam}
                  size={20}
                  sport={SPORT.FOOTBALL}
                  onlyImage
                />
              ) : (
                <UnknownTeamSVG className='h-5 w-5'></UnknownTeamSVG>
              )}
              <span className='flex-1 truncate'>{leftTeam.name || 'N/A'}</span>
              <span>{leftScore}</span>
            </div>
            <div
              className='flex items-center gap-2 p-3'
              css={[rightWin && tw`text-black dark:text-white`]}
            >
              {rightTeam?.id ? (
                <AvatarTeamCommon
                  team={leftTeam}
                  size={20}
                  sport={SPORT.FOOTBALL}
                  onlyImage
                />
              ) : (
                <UnknownTeamSVG className='h-5 w-5'></UnknownTeamSVG>
              )}
              <span className='flex-1 truncate'>{rightTeam.name || 'N/A'}</span>
              <span>{rightScore}</span>
              {root && !isValEmpty(thirdPlaceCupBlock) && (
                <TwBracketMatchBadge className=' bg-logo-yellow text-black'>
                  Final
                </TwBracketMatchBadge>
              )}
            </div>
            {root && !isValEmpty(thirdPlaceCupBlock) && (
              <ThirdPlaceBlock
                thirdPlaceCupBlock={thirdPlaceCupBlock}
              ></ThirdPlaceBlock>
            )}
          </TwBlockContainer>
          {/* {order > 1 && (
            <span className=' h-[1.5px] flex-1 bg-logo-blue/50'></span>
          )} */}
          {!root ? (
            <span className=' h-[1.5px] flex-1 bg-logo-blue/50'></span>
          ) : (
            <span className=' h-[1.5px] w-2 bg-logo-blue/0'></span>
          )}

          {order > 1 && order === firstOrder && (
            <span className='flex-1'>
              <button
                className='  rounded-full bg-logo-blue/50 p-0.5 text-white'
                onClick={() => {
                  setSelectedOrder(parent_order);
                  setSelectedView(Math.max(selectedView - 1, 0));
                }}
              >
                <HiOutlineChevronRight></HiOutlineChevronRight>
              </button>
            </span>
          )}
        </div>
        <div className='w-56'></div>
      </TwRoundContainer>
    </div>
  );
};

const ThirdPlaceBlock = ({
  thirdPlaceCupBlock,
}: {
  thirdPlaceCupBlock: any;
}) => {
  const router = useRouter();

  const {
    participants = [],
    events: eventIds = [],
    homeTeamScore: leftScore,
    awayTeamScore: rightScore, // TODO
  } = thirdPlaceCupBlock || {};

  const [leftTeamData = {}, rightTeamData = {}] = participants || [];
  const { team: leftTeam, winner: leftWin } = leftTeamData || {};
  const { team: rightTeam, winner: rightWin } = rightTeamData || {};

  return (
    <Tw3rdPlaceBlockContainer
      className=' border-gradient-to-r absolute left-0 top-[130%] my-1.5 h-[100%] w-full cursor-pointer border-logo-blue from-blue-500 via-blue-200 to-blue-500'
      onClick={() => {
        if (eventIds && eventIds.length > 0) {
          if (eventIds.length > 1) {
            return;
          } else {
            router.push(`/football/match/${eventIds[0]}`);
            // window.location.href = `/match/${eventIds[0]}`;
          }
        }
      }}
    >
      {eventIds && eventIds.length > 1 && (
        <div className='absolute -right-2.5 top-[52%] -translate-y-1/2 transform'>
          {/* TODO no need for last match */}
          <BracketPopOver matches={eventIds}>
            <button className=''>
              <HiPlusCircle className='h-5 w-5'></HiPlusCircle>
            </button>
          </BracketPopOver>
        </div>
      )}
      <div
        className='flex gap-2 border-b border-dark-text/10 p-3'
        css={[leftWin && tw`text-black dark:text-white`]}
      >
        {leftTeam?.id ? (
          <AvatarTeamCommon
            team={leftTeam}
            size={20}
            sport={SPORT.FOOTBALL}
            onlyImage
          />
        ) : (
          <UnknownTeamSVG className='h-5 w-5'></UnknownTeamSVG>
        )}
        <span className='flex-1 truncate'>{leftTeam.name || 'N/A'}</span>
        <span>{leftScore}</span>
      </div>
      <div
        className='flex items-center gap-2 p-3'
        css={[rightWin && tw`text-black dark:text-white`]}
      >
        {rightTeam?.id ? (
          <AvatarTeamCommon
            team={rightTeam}
            size={20}
            sport={SPORT.FOOTBALL}
            onlyImage
          />
        ) : (
          <UnknownTeamSVG className='h-5 w-5'></UnknownTeamSVG>
        )}
        <span className='flex-1 truncate'>{rightTeam.name || 'N/A'}</span>
        <span>{rightScore}</span>
        <TwBracketMatchBadge className=' bg-[#666666]'>
          3rd place
        </TwBracketMatchBadge>
      </div>
    </Tw3rdPlaceBlockContainer>
  );
};
