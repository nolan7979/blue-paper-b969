import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { HiOutlineChevronRight } from 'react-icons/hi';
import tw from 'twin.macro';

import { useWindowSize } from '@/hooks';
import {
  useTeamLastMatchesData,
  useTeamNextMatchesData,
  useTeamSeasonTopPlayersData,
  useTeamStandingsSeasonListData,
  useTeamStatsSeasonListData
} from '@/hooks/useFootball';
import {
  useTeamRecentPerformanceData,
  useTeamSeasonStatsData,
} from '@/hooks/useFootball/useFootballTeamData';
import { useMessage } from '@/hooks/useFootball/useMessage';
import useTrans from '@/hooks/useTrans';

import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep, Select } from '@/components/common';
import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import NotificationCard from '@/components/common/NotificationCard';
import PopoverTransfers from '@/components/common/pop-over/PopOverTransfers';
import { SelectSingleField } from '@/components/common/selects/SelectSingleField';
import { SelectSingleFieldSeason } from '@/components/common/selects/SelectSingleFieldSeason';
import { SelectTeamPlayerStatsSeason } from '@/components/common/selects/SelectTeamPlayerStatsSeason';
import { SelectTeamStatsSeason } from '@/components/common/selects/SelectTeamStatsSeason';
import { PlayerStats } from '@/components/modules/football/players';
import {
  FormBadge,
  League,
  QvPlayer,
  ScoreBadge,
  SoccerTeam,
} from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import {
  TwCard,
  TwFilterButton,
  TwMobileView,
} from '@/components/modules/football/tw-components';
import { Divider as DividerSpace } from '@/components/modules/football/tw-components/TwPlayer';

import { useMatchStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';
import { useTeamStore } from '@/stores/team-store';

import { NOTICE_TYPE } from '@/constant/common';
import {
  TwShowButton
} from '@/modules/football/competition/components';
import { LeagueStandingsSection } from '@/modules/football/competition/components/LeagueStandingsSection';
import {
  StatsCollapse,
  TwStatsLi,
  TwStatsUl,
} from '@/pages/football/player/[...playerParams]';
import {
  Images,
  StatsLabel,
  calTeamAvgAge,
  extractCompetitionId,
  formatMarketValue,
  formatTimestamp,
  getFullPosition,
  getImage,
  getStatsGroup,
  getStatsLabel,
  isMatchHaveStat,
  isValEmpty,
  matchResult,
  roundNumber,
  statsGroupOrder,
} from '@/utils';

import { LeagueRow } from '@/components/modules/football';
import HeadMatchTitle from '@/components/modules/football/HeadMatchTitle';
import { TournamentGroup } from '@/components/modules/football/match';
import MatchRowH2H from '@/components/modules/football/match/MatchRowH2h';
import { PlayerRowSkeleton } from '@/components/modules/football/skeletons';
import { StatsSeason, UniqueTournament } from '@/models/interface';
import { groupByTournamentShow } from '@/utils/matchFilter';
import vi from '~/lang/vi';
import CalendarSVG from '/public/svg/birth-calendar.svg';
import GlobeSVG from '/public/svg/country.svg';
import HandSVG from '/public/svg/hand.svg';
import PlayerSVG from '/public/svg/player.svg';

export const TeamRecentFormSection = ({
  teamId,
  i18n,
}: {
  teamId: any;
  i18n: any;
}) => {
  const [isErrorOpp, setIsErrorOpp] = useState(false);
  const { data, isLoading } = useTeamRecentPerformanceData(teamId);

  if (isLoading || !data) {
    return <></>;
  }

  const { events = [], points = {} } = data || {};
  const maxAbsPoints: any = Object.values(points).reduce(
    (max: any, cur: any) => Math.max(max, Math.abs(cur)),
    -100
  );

  return (
    <div className='rounded-lg bg-light-match py-4 dark:bg-dark-match'>
      <ul className=' flex h-full w-full justify-evenly gap-1'>
        {events.map((event: any, idx: number) => {
          const {
            homeTeam = {},
            awayTeam = {},
            // awayScore = {},
            // homeScore = {},
            // winnerCode,
          } = event || {};

          // const opponent = homeTeam?.id === teamId ? awayTeam : homeTeam;
          let opponent = awayTeam;
          if (`${awayTeam?.id}` === `${teamId}`) {
            opponent = homeTeam;
          }
          // console.log(
          //   'opponent?.id:',
          //   opponent?.id,
          //   'teamId:',
          //   teamId,
          //   'homeTeam?.id:',
          //   homeTeam?.id,
          //   'awayTeam?.id:',
          //   awayTeam?.id
          // );

          return (
            <li className=' h-10 w-6' key={idx}>
              <CustomLink
                href={`/match/football/${event?.id}`}
                target='_parent'
              >
                <img
                  src={`${
                    isErrorOpp
                      ? '/images/football/teams/unknown-team.png'
                      : `${getImage(Images.team, opponent?.id)}`
                  }`}
                  alt='...'
                  width={28}
                  height={28}
                  onError={() => setIsErrorOpp(true)}
                  className='h-7 w-7'
                ></img>
              </CustomLink>
            </li>
          );
        })}
      </ul>
      <ul className=' flex h-full w-full justify-evenly gap-1  border-b border-dashed dark:border-dark-text/20'>
        {events.map((event: any, idx: number) => {
          const {
            id,
            homeTeam = {},
            awayTeam = {},
            winnerCode = 0,
          } = event || {};
          const point = points[id] || 0;
          // const percent = roundNumber((point / maxAbsPoints) * 100, 2);
          const percent = (point / maxAbsPoints || 1) * 100;

          const { isWin, isLoss, isDraw } = matchResult(
            teamId,
            homeTeam?.id,
            awayTeam?.id,
            winnerCode
          );

          let color = 'bg-dark-draw';
          if (isWin) {
            color = 'bg-logo-blue';
          } else if (isLoss) {
            color = 'bg-dark-loss';
          }

          return (
            <li className=' flex h-14 w-6 flex-col' key={idx}>
              {/* {events?.id} */}
              {point >= 0 ? (
                <>
                  <div className='flex-1'></div>
                  <div
                    className={`rounded-md ${color}`}
                    css={{
                      height: `${percent}%`,
                    }}
                  ></div>
                </>
              ) : (
                <></>
              )}
            </li>
          );
        })}
      </ul>
      <ul className=' flex h-full w-full justify-evenly gap-1'>
        {events.map((event: any, idx: number) => {
          const {
            id,
            homeTeam = {},
            awayTeam = {},
            winnerCode = 0,
          } = event || {};
          const point = points[id] || 0;
          const percent = (point / maxAbsPoints || 1) * 100;

          const { isWin, isLoss, isDraw } = matchResult(
            teamId,
            homeTeam?.id,
            awayTeam?.id,
            winnerCode
          );

          let color = 'bg-dark-draw';
          if (isWin) {
            color = 'bg-logo-blue';
          } else if (isLoss) {
            color = 'bg-dark-loss';
          }

          return (
            <li className=' flex h-14 w-6 flex-col' key={idx}>
              {/* {events?.id} */}
              {point >= 0 ? (
                <></>
              ) : (
                <>
                  <div className={`flex-1 rounded-md ${color}`}></div>
                  <div
                    css={{
                      height: `${100 + percent}%`,
                    }}
                  ></div>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const TeamSeasonStandingsSection = ({
  teamId,
  i18n,
}: {
  teamId: string;
  i18n?: any;
}) => {
  return (
    <>
      <div className='flex gap-2'>
        <div className='w-2/3 md:w-1/3'>
          <TeamStandingsTournamentFilter teamId={teamId} />
        </div>

        <div className='w-1/3 md:w-1/4'>
          <TeamStandingsSeasonFilter teamId={teamId} />
        </div>
      </div>

      <ShowTeamSeasonStandings />
    </>
  );
};

export const ShowTeamSeasonStandings = () => {
  const { selectedStandingsSeason } = useTeamStore();

  return (
    <div className='flex flex-col gap-2 py-2.5'>
      <LeagueStandingsSection
        tournamentId={selectedStandingsSeason?.tournament}
        seasonId={selectedStandingsSeason?.id}
        type='total'
        wide={true}
        uniqueTournament={false}
        forTeam={true}
      />
    </div>
  );
};

export const TeamStandingsTournamentFilter = ({
  teamId,
}: // setSelectedTournament,
{
  teamId: any;
  // setSelectedTournament: any;
}) => {
  const { setSelectedStandingsTournament } = useTeamStore();

  const { data, isLoading } = useTeamStandingsSeasonListData(teamId);

  if (isLoading || !data) return <></>;

  const { tournamentSeasons = [] } = data;
  const mapTournaments: any = new Map();
  for (const tournamentRecord of tournamentSeasons) {
    const { tournament } = tournamentRecord;
    if (
      tournament?.uniqueTournament &&
      !mapTournaments.has(tournament.uniqueTournament?.id)
    ) {
      mapTournaments.set(
        tournament.uniqueTournament?.id,
        tournament?.uniqueTournament
      );
    }
  }

  return (
    <>
      <div className='flex'>
        <SelectSingleField
          options={Array.from(mapTournaments.values())}
          size='full'
          valueGetter={setSelectedStandingsTournament}
        ></SelectSingleField>
      </div>
    </>
  );
};

export const TeamStandingsSeasonFilter = ({ teamId }: { teamId: any }) => {
  const [seasonOptions, setSeasons] = useState<any[]>([]);
  const { selectedStandingsTournament, setSelectedStandingsSeason } =
    useTeamStore();

  const { data, isLoading } = useTeamStandingsSeasonListData(teamId);
  useEffect(() => {
    if (!isValEmpty(data)) {
      const { tournamentSeasons = [] } = data;
      let seasonOptionsInner: any = [];
      for (const tournamentRecord of tournamentSeasons) {
        const { tournament = {}, seasons = [] } = tournamentRecord;
        const { uniqueTournament = {} } = tournament || {};

        if (uniqueTournament?.id === selectedStandingsTournament?.id) {
          for (const season of seasons) {
            season['tournament'] = tournament?.id;
            seasonOptionsInner.push(season);
          }
        }
      }
      seasonOptionsInner = seasonOptionsInner.sort((a: any, b: any) => {
        return (b.year as string).localeCompare(a.year as string);
      });
      if (seasonOptionsInner.length > 0) {
        setSeasons(seasonOptionsInner);
        setSelectedStandingsSeason(seasonOptionsInner[0]);
      }
    }
  }, [
    selectedStandingsTournament,
    data,
    setSeasons,
    setSelectedStandingsSeason,
  ]);

  if (isLoading || !data) return <></>;

  const sortedSeasonOptions = seasonOptions.sort((a: any, b: any) => {
    return b?.id - a?.id;
  });
  return (
    <div className='flex'>
      {sortedSeasonOptions.length > 0 && (
        <SelectSingleFieldSeason
          options={sortedSeasonOptions}
          size='full'
          label='year'
          // initialSelectedProps={sortedSeasonOptions[0]}
        />
      )}
    </div>
  );
};

export const TeamSeasonStatsSection = ({
  teamId,
  i18n,
}: {
  teamId: any;
  i18n: any;
}) => {
  return (
    <div className='space-y-2.5'>
      <div className='flex items-center gap-2'>
        <div className='w-1/2'>
          <TeamSeasonStatsLeagueFilter teamId={teamId} />
        </div>
        <div className='w-1/2 flex-1'>
          <TeamStatsSeason />
        </div>
      </div>
      <ShowTeamSeasonStatsData teamId={teamId} />
    </div>
  );
};

export const TeamStatsSeason = () => {
  const { seasonOptions, setTeamStatsSeason } = useTeamStore();

  if (isValEmpty(seasonOptions)) return <></>;
  return (
    <SelectTeamStatsSeason
      options={seasonOptions}
      label='year'
      size='full'
      valueGetter={setTeamStatsSeason}
    />
  );
};

export const ShowTeamSeasonStatsData = ({ teamId }: { teamId: any }) => {
  const { teamStatsSeason, teamStatsTournament } = useTeamStore();
  const i18n = useTrans();

  const { data, isLoading } = useTeamSeasonStatsData(
    teamId,
    teamStatsTournament?.id,
    teamStatsSeason?.id
  );
  if (isLoading || !data) return <></>;

  const { statistics = {} } = data || {};
  // grouping
  const groups: any = {};
  for (const [statKey, statValue] of Object.entries(statistics)) {
    const mappedGroup = getStatsGroup(statKey);
    if (!groups[mappedGroup]) {
      groups[mappedGroup] = {
        stats: [],
        ...statsGroupOrder[mappedGroup],
      };
    }
    groups[mappedGroup]['stats'].push({
      key: statKey,
      value: statValue,
    });
  }

  const orderedGroups = Object.keys(groups).sort((a: any, b: any) => {
    return groups[a].order - groups[b].order;
  });

  return (
    <div>
      {orderedGroups.map((groupKey: any, idx: number) => {
        const groupData = groups[groupKey] || {};
        const { stats = [], name } = groupData || {};
        const orderedStats = stats.sort((a: any, b: any) => {
          return getStatsLabel(a.key) > getStatsLabel(b.key) ? 1 : -1;
        });
        return (
          <div key={idx}>
            <StatsCollapse title={name}>
              <TwStatsUl className='divide-list divide-dashed pb-2.5'>
                {orderedStats.map((stat: any, idx2: number) => {
                  const { key, value } = stat || {};
                  if (getStatsLabel(key, i18n) === '' || value === 0) {
                    return <React.Fragment key={`${groupKey}-${idx}-${idx2}`}></React.Fragment>;
                  }
                  return (
                    <TwStatsLi
                      key={`${groupKey}-${idx}-${idx2}`}
                      className=' item-hover p-1.5'
                    >
                      <span>{getStatsLabel(key, i18n)}</span>
                      <span className='text-black dark:text-white'>
                        {value ? roundNumber(value) : '-'}
                      </span>
                    </TwStatsLi>
                  );
                })}
              </TwStatsUl>
            </StatsCollapse>
          </div>
        );
      })}
    </div>
  );
};

export const TeamSeasonStatsSeasonFilter = ({
  setSelectedSeason,
  selectedTournament,
}: {
  setSelectedSeason: any;
  selectedTournament: any;
}) => {
  const { seasonOptions } = useTeamStore();

  useEffect(() => {
    if (seasonOptions.length) {
      setSelectedSeason(seasonOptions[0]);
    }
  }, [seasonOptions, selectedTournament, setSelectedSeason]);

  if (isValEmpty(seasonOptions)) return <></>;

  return (
    <>
      {/* <Select
        options={[...seasonOptions]}
        label='year'
        valueGetter={setSelectedSeason}
      ></Select> */}
    </>
  );
};

export const TeamSeasonStatsLeagueFilter = ({ teamId }: { teamId: string }) => {
  const {
    setTeamStatsTournament,
    setSeasonOptions,
    setTeamStatsSeason,
    teamStatsTournament,
  } = useTeamStore();

  const { data, isLoading } = useTeamStatsSeasonListData(teamId);

  useEffect(() => {
    const { uniqueTournamentSeasons = [], typeMaps } = data || {};
    const sameTournament = uniqueTournamentSeasons.filter((item: any) => {
      return item.uniqueTournament?.id === teamStatsTournament?.id;
    });

    if (sameTournament.length > 0) {
      setSeasonOptions(sameTournament[0]?.seasons || []);
      setTeamStatsSeason(sameTournament[0]?.seasons[0]);
    }
  }, [data, teamStatsTournament, setSeasonOptions, setTeamStatsSeason]);

  if (isLoading || !data) return <></>;

  const { uniqueTournamentSeasons = [], typeMaps } = data || {};
  const tournaments = uniqueTournamentSeasons.map((item: any) => {
    return item.uniqueTournament || {};
  });

  return (
    <div>
      <Select
        options={tournaments}
        size='full'
        valueGetter={setTeamStatsTournament}
      ></Select>
    </div>
  );
};

export const TeamSeasonTopPlayersFilter = ({
  isLoading,
  seasonOptions,
  tournaments,
  setPlayerStatsTournament,
}: {
  isLoading: boolean;
  seasonOptions: StatsSeason[];
  tournaments: UniqueTournament[];
  setPlayerStatsTournament: (playerStatsTournament: any) => void;
}) => {
  if (isLoading) {
    return <></>;
  }

  return (
    <div className='col-span-4 flex gap-2'>
      {tournaments && tournaments.length > 0 && (
        <Select
          options={tournaments}
          label='name'
          size='full'
          valueGetter={setPlayerStatsTournament}
        />
      )}
      <TeamTopPlayersSeasonFilter seasons={seasonOptions} />
    </div>
  );
};

export const TeamTopPlayersSeasonFilter = ({
  seasons,
}: {
  seasons: StatsSeason[];
}) => {
  const { playerStatsSeason, setPlayerStatsSeason } = useTeamStore();

  if (!seasons?.length) {
    return <></>;
  }

  return (
    <SelectTeamPlayerStatsSeason
      options={seasons}
      label='year'
      size='full'
      valueGetter={setPlayerStatsSeason}
      shownValue={playerStatsSeason?.year}
    />
  );
};

export const ShowTeamSeasonTopPlayers = ({
  teamId,
  playerStatsSeason,
  playerStatsTournament,
}: {
  teamId: string;
  playerStatsSeason: StatsSeason;
  playerStatsTournament: UniqueTournament;
}) => {
  const [shownData, setSetshownData] = useState<any>({});
  const i18n = useTrans();
  const [showAll, setShowAll] = useState(false);
  const [statType, setStatsType] = useState({
    name: 'Goals',
    key: 'goals',
  });

  const { data, isLoading } = useTeamSeasonTopPlayersData(
    teamId,
    playerStatsTournament?.id,
    playerStatsSeason?.id
  );

  const topPlayers = shownData?.topPlayers;

  const statsTypes = useMemo(() => {
    return Object.keys(topPlayers || {}).map((key) => {
      const typedKey = key as StatsLabel;
      return {
        name: getStatsLabel(typedKey, i18n),
        key: key,
      };
    });
  }, [topPlayers]);

  useEffect(() => {
    if (!isValEmpty(data)) {
      setSetshownData(data);
    }

    if (statsTypes.length) {
      setStatsType(statsTypes[0]);
    }
  }, [data, statsTypes]);

  if (isLoading || !data) {
    return <PlayerRowSkeleton />;
  }

  if (isValEmpty(topPlayers)) return <></>;

  let players = topPlayers[statType?.key] || [];
  if (!showAll) {
    players = players.slice(0, 10);
  }

  return (
    <>
      {/* Dropdown */}
      <div className='col-span-2 flex items-center justify-center xl:flex-col xl:items-start 2xl:flex-row'>
        {statsTypes && statsTypes.length && (
          <Select
            options={statsTypes}
            label='name'
            valueGetter={setStatsType}
            shownValue={statType?.name}
            size='full'
          />
        )}
      </div>

      {/* Players list */}
      <div className='col-span-6'>
        <div className='flex justify-between p-2.5 dark:text-dark-text'>
          <div className=' text-center text-csm font-normal leading-4'>
            # {i18n.titles.players}
          </div>
          <div className='flex-1'></div>
          <div className='text-center text-csm font-normal capitalize leading-4'>
            {statType?.name}
          </div>
        </div>
        <ul className='divide-list' test-id='list-player'>
          {players.map((playerData: any, index: number) => {
            const {
              player = {},
              statistics,
              playedEnough,
              team,
            } = playerData || {};

            const statValue = statistics?.[statType?.key] || 0;

            return (
              <li
                key={index}
                className='item-hover cursor-pointer px-2.5 py-2'
                test-id='player-item'
              >
                <PlayerStats
                  playerId={player?.id}
                  name={player?.name}
                  imgUrl={`${getImage(Images.player, player?.id)}`}
                  statType={statType?.key}
                  statValue={roundNumber(statValue)}
                  position={index + 1}
                  // team={team}
                  playPosition={getFullPosition(player?.position)}
                ></PlayerStats>
              </li>
            );
          })}
        </ul>
      </div>
      {(topPlayers[statType?.key] || []).length > 10 && (
        <div className='col-span-6 flex justify-end p-2.5 pb-0'>
          <TwShowButton
            onClick={() => setShowAll(!showAll)}
            className='cursor-pointer text-left text-sm leading-4 text-logo-blue'
          >
            {showAll ? i18n.common.show_less : i18n.common.show_more}
          </TwShowButton>
        </div>
      )}
    </>
  );
};

export const TeamInfoSection = ({
  teamDetails,
  players,
  teamTransfers,
  teamUniqueTournaments,
  i18n,
}: {
  teamDetails: any;
  players: any;
  teamTransfers: any;
  teamUniqueTournaments: any;
  i18n: any;
}) => {
  const { players: teamPlayers = [] } = players || {};

  const {
    manager = {},
    country = {},
    primaryUniqueTournament = {},
    foundationDate,
    venue = {},
    marketValue,
    marketValueCurrency,
    foreignPlayers = 0,
    nationalPlayers = 0,
  } = teamDetails || {};

  const { stadium = {}, city = {}, country: venueCountry = {} } = venue || {};
  const avgAge = calTeamAvgAge(teamPlayers);

  return (
    <div className=''>
      <div className=' flex flex-col gap-y-4 py-2 lg:flex-row'>
        <div className=' flex w-full lg:w-1/2'>
          <div className=' w-1/2'>
            <TeamInfoItem
              icon={<PlayerSVG className='h-10 w-10'></PlayerSVG>}
              val={teamPlayers.length}
              desc='Players'
            ></TeamInfoItem>
          </div>
          <div className=' flex-1'>
            <TeamInfoItem
              icon={<CalendarSVG className='h-10 w-10'></CalendarSVG>}
              val={avgAge}
              desc={i18n.competitor.avgAge}
            ></TeamInfoItem>
          </div>
        </div>
        <div className=' flex flex-1'>
          <div className=' w-1/2'>
            <TeamInfoItem
              icon={<GlobeSVG className='h-10 w-10'></GlobeSVG>}
              val={foreignPlayers}
              desc={i18n.competitor.foreignPlayer}
            ></TeamInfoItem>
          </div>
          <div className=' flex-1'>
            <TeamInfoItem
              icon={<HandSVG className='h-10 w-10'></HandSVG>}
              val={nationalPlayers}
              desc={i18n.competitor.nationPlayer}
            ></TeamInfoItem>
          </div>
        </div>
      </div>
      <div className='flex flex-col lg:flex-row'>
        {/* 1st column */}
        {/* Huấn luyện viên
        Ngày thành lập
        Quốc gia */}
        <div className=' w-full space-y-2.5 p-2 lg:w-1/2'>
          {/* Info */}
          <div className='space-y-0.5  '>
            <div className='text-csm leading-6'>{i18n.competitor.info}</div>
            <TwTeamInfoUL>
              <li className='flex justify-between'>
                <span className='leading-4'>{i18n.competitor.coach}</span>
                {/* TODO link */}
                {/* <CustomLink
                  href={`/football/manager/${manager?.id}`}
                  target='_parent'
                > */}
                  <span className='flex items-center gap-0.5  leading-4 text-logo-blue'>
                    {manager.name}{' '}
                    <HiOutlineChevronRight></HiOutlineChevronRight>
                  </span>
                {/* </CustomLink> */}
              </li>
              <li className='flex justify-between'>
                <span className='leading-4'>
                  {i18n.competitor.foundationDate}
                </span>
                <span className='leading-4'>{foundationDate}</span>
              </li>
              <li className='flex justify-between'>
                <span className='leading-4'>{i18n.competitor.country}</span>
                <span className='leading-4'>{country?.name}</span>
              </li>

              {marketValue && (
                <li className='flex justify-between'>
                  <span className='leading-4'>Tổng giá trị cầu thủ</span>
                  <span className='text-xs font-normal leading-5 text-dark-win'>
                    {formatMarketValue(marketValue)} (
                    {marketValueCurrency ? marketValueCurrency : '€'})
                  </span>
                </li>
              )}
            </TwTeamInfoUL>
          </div>
          {/* Location */}
          <div className='space-y-0.5'>
            <div className='text-csm leading-6'>{i18n.qv.location}</div>
            {/* Sân vận động
            Sức chứa
            Thành phố */}
            <TwTeamInfoUL>
              <li className='flex justify-between'>
                <span className='leading-4'>{i18n.competitor.stadium}</span>
                <span className='leading-4'>{stadium.name}</span>
              </li>
              <li className='flex justify-between'>
                <span className='leading-4'>{i18n.competitor.capacity}</span>
                <span className='leading-4'>{stadium.capacity}</span>
              </li>
              <li className='flex justify-between'>
                <span className='leading-4'>{i18n.competitor.city}</span>
                <span className='leading-4'>
                  {city.name}, {venueCountry.name}
                </span>
              </li>
            </TwTeamInfoUL>
          </div>
        </div>
        {/* 2nd column */}
        <div className=' flex-1 space-y-2.5 p-2'>
          {/* Transfers */}
          <TransfersSection teamTransfers={teamTransfers}></TransfersSection>

          <div className='space-y-0.5 pt-4'>
            <div className='text-csm leading-6'>{i18n.competitor.tourjoin}</div>
            <ParticipatedLeagueSection
              teamUniqueTournaments={teamUniqueTournaments}
            ></ParticipatedLeagueSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TransfersSection = ({ teamTransfers }: { teamTransfers: any }) => {
  const { transfersIn = [], transfersOut = [] } = teamTransfers || {};
  const i18n = useTrans();

  return (
    <>
      <div className='space-y-0.5'>
        <div className='text-csm leading-6'>{i18n.competitor.transfer}</div>
        <div className=' flex'>
          <div className=' flex-1 space-y-1 p-2 text-sm lg:w-1/2'>
            <div className=' flex cursor-pointer items-center gap-2 font-bold'>
              <PopoverTransfers
                transfers={transfersIn}
                isIn={true}
                i18n={i18n}
              ></PopoverTransfers>
            </div>
            <ul className='space-y-0.5 text-xs dark:text-dark-text'>
              {transfersIn.slice(0, 3).map((transfer: any, idx: number) => {
                return (
                  <li key={idx} className='font-normal leading-4'>
                    {transfer.player.name}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className='flex-1 space-y-1 p-2 text-sm'>
            <div className='flex cursor-pointer items-center gap-2'>
              <PopoverTransfers
                transfers={transfersOut}
                isIn={false}
                i18n={i18n}
              ></PopoverTransfers>
            </div>
            <ul className='space-y-0.5 text-xs dark:text-dark-text'>
              {transfersOut.slice(0, 3).map((transfer: any, idx: number) => {
                return (
                  <li key={idx} className='font-normal leading-4'>
                    {transfer.player.name}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export const ParticipatedLeagueSection = ({
  teamUniqueTournaments,
}: {
  teamUniqueTournaments: any;
}) => {
  const { uniqueTournaments = [] } = teamUniqueTournaments || {};

  return (
    <ul className='flex flex-wrap items-center justify-start pt-4 text-dark-text'>
      {uniqueTournaments.map((tournament: any, idx: number) => {
        return (
          <li key={idx} className=' flex h-36 w-28 place-content-center'>
            <CustomLink
              href={`/football/competition/${tournament.slug}/${tournament?.id}`}
              target='_parent'
            >
              <div className='flex flex-col place-content-center items-center space-y-2  text-xs '>
                <Avatar
                  id={tournament?.id}
                  type='competition'
                  rounded={false}
                  width={44}
                  height={44}
                  isBackground={false}
                />

                <div className='text-center'>{tournament.name}</div>
              </div>
            </CustomLink>
          </li>
        );
      })}
    </ul>
  );
};

export const TwTeamInfoUL = tw.ul`space-y-2 rounded-md bg-light-match p-2.5 text-ccsm dark:bg-dark-match dark:text-dark-text`;

export const TeamInfoItem = ({
  icon,
  val,
  desc,
}: {
  icon: any;
  val: number;
  desc: string;
}) => {
  return (
    <div className=' flex items-center'>
      <div
        className=' flex w-1/3 place-content-center items-center'
        test-id='icon'
      >
        {/* <PlayerSVG className='h-10 w-10'></PlayerSVG> */}
        {icon}
      </div>
      <div className=' flex flex-1 flex-col place-content-center'>
        <div
          className='text-left  text-sm font-bold leading-4 text-logo-blue'
          test-id='avg-player-age'
        >
          {val}
        </div>
        <div
          className='text-xs font-medium leading-4 dark:text-dark-text'
          test-id='club-desc'
        >
          {desc}
        </div>
      </div>
    </div>
  );
};

export const TeamPlayersSection = ({
  teamId,
  players = {},
  i18n,
  isMobile,
}: {
  teamId?: string;
  players: any;
  i18n: any;
  isMobile?: boolean;
}) => {
  const [viewType, setViewType] = useState<string>(() =>
    isMobile ? 'list_view' : 'box_view'
  );

  const { players: teamPlayers = [] } = players || {};

  useEffect(() => {
    if (isMobile) {
      setViewType('list_view');
    }
  }, [isMobile]);

  return (
    <>
      {!isMobile && (
        <div className='flex w-full gap-4'>
          <TwFilterButton
            isActive={viewType === 'box_view'}
            onClick={() => setViewType('box_view')}
          >
            {i18n.competitor.boxView}
          </TwFilterButton>
          <TwFilterButton
            isActive={viewType === 'list_view'}
            onClick={() => setViewType('list_view')}
          >
            {i18n.competitor.listView}
          </TwFilterButton>
        </div>
      )}
      <div>
        {viewType === 'box_view' && !isMobile && (
          <PlayersBoxView players={teamPlayers}></PlayersBoxView>
        )}
        {viewType === 'list_view' && (
          <PlayersListView players={teamPlayers} i18n={i18n}></PlayersListView>
        )}
      </div>
    </>
  );
};

export const PlayersBoxView = ({ players }: { players: any[] }) => {
  const strikers = players.filter((player) => player.player?.position === 'F');
  const midfielders = players.filter(
    (player) => player.player?.position === 'M'
  );
  const defenders = players.filter((player) => player.player?.position === 'D');
  const goalkeepers = players.filter(
    (player) => player.player?.position === 'G'
  );
  const i18n = useTrans();
  const playersByPosition = [
    { position: i18n.competitor.striker, players: strikers, color: '#AF2929' },
    {
      position: i18n.competitor.midfielder,
      players: midfielders,
      color: '#01B243',
    },
    {
      position: i18n.competitor.defender,
      players: defenders,
      color: '#7a84ff',
    },
    {
      position: i18n.competitor.goalkepper,
      players: goalkeepers,
      color: '#DA6900',
    },
  ];

  return (
    <div className='space-y-4'>
      {playersByPosition.map((positionData: any, idx: number) => {
        return (
          <div key={idx} className='space-y-1'>
            <div className='capitalize' style={{ color: positionData.color }}>
              {positionData.position}
            </div>
            <TwPlayersGrid className=''>
              {positionData.players.map((playerData: any, idx: number) => {
                const player = playerData.player || {};

                return (
                  <CustomLink
                    href={`/football/player/${player.slug}/${player?.id}`}
                    target='blank'
                    key={`p-${idx}`}
                  >
                    <TwPlayerBox className='overflow-hidden border border-line-default dark:border-0 bg-head-tab dark:bg-dark-main hover:border hover:border-logo-blue'>
                      <div className='flex h-full flex-col place-content-center items-center justify-stretch space-y-1 overflow-hidden pt-2 dark:text-dark-text'>
                        <Avatar id={player?.id} type='player' />
                        <div className='mt-4 flex h-full w-full flex-col items-center justify-center bg-white dark:bg-dark-gray'>
                          <div className='text-center text-ccsm font-medium leading-4 dark:text-dark-default'>
                            {player.name}
                          </div>
                          {(player.jerseyNumber || player.shirtNumber) && (
                            <div className='h-6'>
                              {player.jerseyNumber || player.shirtNumber || ''}
                            </div>
                          )}
                          <div className='flex items-center gap-1.5 text-xs text-dark-text'>
                            <Avatar
                              id={player?.country?.id}
                              type='country'
                              width={14}
                              height={14}
                              isBackground={false}
                              rounded={false}
                            />

                            {player.country?.name && (
                              <span className=' text-cxs uppercase leading-4'>
                                {player.country?.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TwPlayerBox>
                  </CustomLink>
                );
              })}
            </TwPlayersGrid>
          </div>
        );
      })}
    </div>
  );
};

export const PlayersListView = ({
  players,
  i18n,
}: {
  players: any[];
  i18n: any;
}) => {
  const trans = useTrans();
  const strikers = players.filter((player) => player.player?.position === 'F');
  const midfielders = players.filter(
    (player) => player.player?.position === 'M'
  );
  const defenders = players.filter((player) => player.player?.position === 'D');
  const goalkeepers = players.filter(
    (player) => player.player?.position === 'G'
  );


  const playersByPosition = [
    { position: trans.competitor.strikers, players: strikers },
    { position: trans.competitor.midfielders, players: midfielders },
    { position: trans.competitor.defenders, players: defenders },
    { position: trans.competitor.goalkeepers, players: goalkeepers },
  ];

  return (
    <div className='space-y-4'>
      {playersByPosition.map((positionData: any, idx: number) => {
        return (
          <div key={idx} className='space-y-1'>
            <div className='mb-3 pl-2.5 text-sm font-semibold uppercase dark:text-white md:pl-0'>
              {positionData.position}
            </div>
            <ul className='divide-list'>
              {positionData.players.map((playerData: any, idx: number) => {
                const player = playerData.player || {};
                return (
                  <li key={idx} className='item-hove px-4 py-1.5'>
                    <CustomLink
                      href={`/football/player/${player?.id}`}
                      target='blank'
                    >
                      <QvPlayer
                        id={player?.id}
                        type='player'
                        name={player?.name}
                        shirtNo={player.shirtNumber}
                        playerData={playerData}
                        category={player.country?.name}
                        i18n={i18n}
                      />
                    </CustomLink>
                  </li>
                );
              })}
            </ul>
            {idx <= playersByPosition.length - 2 && (
              <TwMobileView>
                <DividerSpace height='2' />
              </TwMobileView>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const TwPlayersGrid = tw.div`grid grid-cols-2 gap-1 md:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`;
export const TwPlayerBox = tw.div`aspect-h-1 aspect-w-1 flex items-center rounded-lg bg-light-match px-1 dark:bg-dark-match `;

export const TeamMatchesSection = ({
  teamId,
  i18n = vi,
}: {
  teamId: string;
  i18n: any;
}) => {
  const [page, setPage] = useState<number>(0);

  const {
    data: nextData,
    isLoading,
    isError: isErrorNext,
  } = useTeamNextMatchesData(teamId, page);

  const {
    data: lastData,
    isLoading: lastEventsIsLoading,
    isError: isErrorLast,
  } = useTeamLastMatchesData(teamId, page);

  const { setSelectedMatch, setShowSelectedMatch } = useMatchStore();

  useEffect(() => {
    let shownMatch = null;
    const lastEvents = lastData?.events;
    const nextEvents = nextData?.events;
    if (lastEvents && lastEvents.length > 0) {
      shownMatch = lastEvents[lastEvents.length - 1];
    } else if (nextEvents && nextEvents.length > 0) {
      shownMatch = nextEvents[0];
    }
    if (shownMatch) {
      setSelectedMatch(shownMatch?.id || shownMatch.customId);
      setShowSelectedMatch(true);
    }
  }, [nextData, lastData, setSelectedMatch, setShowSelectedMatch]);

  if (isLoading || lastEventsIsLoading) {
    return <></>;
  }
  
  const allEvents = [...(nextData?.events || []), ...(lastData?.events || [])];
  let matchesData: TournamentGroup[] = [];
  if (!!allEvents?.length) {
    matchesData = groupByTournamentShow(allEvents);
  }

  const notNextPage = nextData?.hasNextPage === false;
  const notPrevPage = lastData?.hasNextPage === false;

  return (
    <>
      <div className='flex gap-x-2 px-2 md:px-0'>
        <div className='w-1/2 flex-1 '>
          <div className=''>
            <div className=' flex justify-between pb-2'>
              <div className='w-1/6'>
                {(!isErrorLast || page > 0) && (
                  <div css={[notPrevPage && tw`hidden`]}>
                    <TwFilterButton onClick={() => setPage(page - 1)}>
                      {i18n.competition.previous}
                    </TwFilterButton>
                  </div>
                )}
              </div>
              <div className='flex-1'></div>
              <div>
                {(!isErrorNext || page < 0) && (
                  <div css={[notNextPage && tw`hidden`]}>
                    <TwFilterButton onClick={() => setPage(page + 1)}>
                      {i18n.competition.next}
                    </TwFilterButton>
                  </div>
                )}
              </div>
            </div>
            <ul className='max-h-[85vh] space-y-1.5 overflow-y-auto  scrollbar'>
              <HeadMatchTitle i18n={i18n} />
              {matchesData.map((group, idx: number) => (
                <React.Fragment key={`group-${idx}`}>
                  {group.matches.map((match: any, matchIdx: any) => {
                    return (
                      <React.Fragment key={`match-${match?.id}`}>
                        {matchIdx === 0 && (
                          <LeagueRow
                            match={match}
                            isLink={
                              match &&
                              match.season?.id &&
                              match.season?.id.length > 0
                                ? true
                                : false
                            }
                          />
                        )}
                        <MatchRowH2H
                          showQuickView={false}
                          h2hEvent={match}
                          h2HFilter={'home'}
                          isDetail={true}
                          teamId={teamId}
                        />
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              ))}
            </ul>
          </div>
        </div>
        {/* TODO add quick view here */}
        {/* <div className='hidden flex-1 overflow-auto' css={[tw`lg:block`]}>
          <LeagueQuickViewSection></LeagueQuickViewSection>
        </div> */}
      </div>
    </>
  );
};

export const TeamMatchRow = ({
  matchData,
  teamId,
}: {
  matchData?: any;
  teamId?: string;
}) => {
  const {
    id,
    homeTeam = {},
    awayTeam = {},
    homeScore = {},
    awayScore = {},
    winnerCode,
    tournament = {},
    startTimestamp,
    status,
  } = matchData || {};

  const { width } = useWindowSize();
  const router = useRouter();
  const { selectedMatch, setShowSelectedMatch, setSelectedMatch } =
    useMatchStore();

  const competitorId = teamId;
  let isWin = false;
  if (
    (competitorId === homeTeam?.id && winnerCode === 1) ||
    (competitorId === awayTeam?.id && winnerCode === 2)
  ) {
    isWin = true;
  }

  let isLoss = false;
  if (
    (competitorId === homeTeam?.id && winnerCode === 2) ||
    (competitorId === awayTeam?.id && winnerCode === 1)
  ) {
    isLoss = true;
  }

  return (
    <li
      className='flex cursor-pointer items-center gap-2 bg-light-match p-2.5 text-sm dark:bg-dark-match md:rounded-lg'
      onClick={() => {
        if (width < 1024) {
          setSelectedMatch(`${id}`);
          // go to detailed page for small screens
          router.push(`/football/match/${matchData?.id}`); // TODO slug
          // window.location.href = `/match/football/${matchData?.id}`;
        } else {
          if (`${id}` === `${selectedMatch}`) {
            // toggleShowSelectedMatch();
          } else {
            setShowSelectedMatch(true);
            setSelectedMatch(`${id}`);
          }
        }
      }}
    >
      <div className='dev2 w-2/5 flex-1 space-y-1 truncate'>
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
          {formatTimestamp(startTimestamp)}
        </p>
      </div>
      <div className='dev2 w-2/5 space-y-1'>
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
      <div className='divide-list-x flex w-1/6 justify-evenly'>
        <div className='flex flex-col place-content-center'>
          <div className='my-auto w-9 space-y-2 p-2 text-white'>
            <ScoreBadge score={homeScore.display}></ScoreBadge>
            <ScoreBadge score={awayScore.display}></ScoreBadge>
          </div>
        </div>

        {isMatchHaveStat(status.code) && (
          <div className='flex w-1/2 place-content-center items-center px-2'>
            <FormBadge
              isWin={isWin}
              isLoss={isLoss}
              isDraw={winnerCode === 3}
              isSmall={false}
            ></FormBadge>
          </div>
        )}
      </div>
    </li>
  );
};

export const TeamDetailSummarySection = ({
  teamDetails,
  i18n = vi,
  homeId,
}: {
  teamDetails?: any;
  homeId?: string;
  i18n?: any;
}) => {
  const sportType = 'football';

  const { teamFollowed } = useFollowStore((state) => ({
    teamFollowed: state.followed.teams,
  }));

  const { addTeam, removeTeam } = useFollowStore();
  const { mutate } = useMessage();
  const [isFollowedTeam, setIsFollowedTeam] = useState(false);
  useEffect(() => {
    const team = teamFollowed[sportType] ? teamFollowed[sportType] : [];

    const isFollowed = team.some(
      (teamMember) => teamMember?.id === teamDetails?.id
    );
    setIsFollowedTeam(isFollowed);
  }, [sportType, teamDetails, teamFollowed]);
  const changeFollow = () => {
    const newTeam = { id, name, slug: teamDetails.slug };
    if (!isFollowedTeam) {
      mutate({
        matchId: id,
        isSubscribe: true,
        locale: i18n ? i18n.language : 'en',
        type: NOTICE_TYPE.competitor,
      });
      addTeam(sportType, newTeam);
    } else {
      removeTeam(sportType, newTeam);
      mutate({
        matchId: id,
        isSubscribe: false,
        locale: i18n ? i18n.language : 'en',
        type: NOTICE_TYPE.competitor,
      });
    }
  };
  if (!teamDetails) return <></>;

  const {
    id,
    name,
    sport = {},
    category = {},
    tournament = {},
  } = teamDetails || {};
  return (
    <>
      <div className=' hidden py-3 lg:block'>
        <BreadCrumb className='layout'>
          <div className=' flex items-center gap-2 truncate text-xs font-extralight'>
            <BreadCumbLink href='/football' name={sport.name} />
            {category.name && (
              <>
                <BreadCrumbSep></BreadCrumbSep>
                <BreadCumbLink
                  href={`/football/country/${category.name}/${category?.id}`}
                  name={category.name}
                />
              </>
            )}
            <BreadCrumbSep></BreadCrumbSep>
            <BreadCumbLink
              href={`/football/competition/${tournament.slug}/${
                tournament?.id || tournament?.id
              }`}
              name={`${tournament.name || ''}`}
            />
          </div>
        </BreadCrumb>
      </div>
      <TwCard className=' layout flex flex-col gap-2 bg-white  py-3 pt-0 dark:bg-dark-dark-blue dark:bg-none md:flex-row lg:pt-3'>
        <div className='flex flex-1 flex-col items-center gap-2 pl-0  md:flex-row lg:gap-4 lg:pl-4'>
          <div
            className='w-full dark:bg-dark-dark-blue lg:w-auto lg:dark:bg-transparent'
            test-id='club-logo'
          >
            <div className='flex w-full justify-center bg-gradient-to-r from-blue-200 to-pink-100 p-2 py-10 dark:bg-none lg:h-20 lg:w-auto lg:bg-transparent lg:p-0'>
              <Avatar
                id={homeId}
                type='team'
                isBackground={false}
                rounded={false}
                width={80}
                height={80}
              />
            </div>
          </div>
          <div className=' flex flex-col place-content-center gap-1'>
            <h1
              className='text-xl font-bold not-italic lg:text-2xl lg:font-black'
              test-id='club-name'
            >
              {name}
            </h1>
            <div className='flex items-center gap-4'>
              <div
                className='hidden overflow-hidden text-cxs uppercase text-dark-text md:block lg:text-sm'
                test-id='category-name'
              >
                {category.name}
              </div>
            </div>
          </div>
        </div>
        <div className=' min-w-1/3 flex place-content-center px-2 lg:px-4'>
          <NotificationCard
            isFollowed={isFollowedTeam}
            changeFollow={changeFollow}
            title={i18n.competitor.receiveInfo}
          />
        </div>
      </TwCard>
    </>
  );
};
