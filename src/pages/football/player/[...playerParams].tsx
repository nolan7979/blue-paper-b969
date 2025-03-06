import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  HiOutlineChevronDown,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineChevronUp,
} from 'react-icons/hi';
import tw from 'twin.macro';
import { decode } from '@/utils/hash.id';
import { usePlayerSeasonPenaltyData } from '@/hooks/useFootball';
import {
  usePlayerCharacteristicsData,
  usePlayerEventsData,
  usePlayerLastRatingsData,
  usePlayerLastYearSummaryData,
  usePlayerStatsOverallData,
  usePlayerStatsSeasonsData,
  useTeamPlayerDataClub,
} from '@/hooks/useFootball/useFootballPlayerData';
import useTrans from '@/hooks/useTrans';

import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep, Select } from '@/components/common';
import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { PlayerSeasonHeatmap } from '@/components/common/PlayerHeatmapSeason';
import LastMatchSkeleton from '@/components/common/skeleton/match/LastMatchSkeleton';
import { TabsRef } from '@/components/common/tabs/TabCustom';
import { RedCard, YellowCard } from '@/components/modules/football';
import { MatchPenaltyShotMap } from '@/components/modules/football/match';
import { SoccerTeam } from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import { RatingBadge } from '@/components/modules/football/RatingBadge';
import {
  TwFilterBtn,
  TwFilterButton,
  TwFilterCol,
  TwMainCol,
  TwQuickViewCol,
  TwSection,
  TwTitle,
} from '@/components/modules/football/tw-components';
import { Divider } from '@/components/modules/football/tw-components/TwPlayer';
import Seo from '@/components/Seo';

import { useMatchStore } from '@/stores';
import { usePlayerStore } from '@/stores/player-store';

import { Player } from '@/models';
import { LeagueQuickViewSection } from '@/modules/football/competition/components';
// import { TeamMatchRow } from '@/pages/competitor/[...competitorId]';
import {
  formatTimestamp,
  genRatingColor,
  genTransferTexts,
  getCharacteristic,
  getImage,
  getSlug,
  getStatsGroup,
  getStatsLabel,
  Images,
  isValEmpty,
  roundNumber,
  statsGroupOrder,
} from '@/utils';

import { LeagueRow } from '@/components/modules/football/columns/MainColumnComponents';
import MatchTimeStamp from '@/components/modules/football/match/MatchTimeStamp';
import PlayerMoreDetail from '@/components/modules/football/players/PlayerMoreDetail';
import PlayerSummary from '@/components/modules/football/players/PlayerSummary';
import PlayerTransfer from '@/components/modules/football/players/PlayerTransfer';
import { SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { groupByTournamentShow } from '@/utils/matchFilter';
import vi from '~/lang/vi';
import AssistSVG from '/public/svg/assist.svg';
import BenchSVG from '/public/svg/bench.svg';

import GoalBlueSVG from '/public/svg/goal-blue.svg';
import GoalPenSVG from '/public/svg/goal-pen.svg';

import BottomSheetComponent from '@/components/modules/tennis/selects/BottomSheetComponent';
import { useDetectDeviceClient } from '@/hooks/useWindowSize';
import MatchScoreColumn from '@/modules/football/liveScore/components/MatchScoreColumn';
import { PlayerMobileView } from '@/modules/football/player/components/PlayerMobileView';
import ArrowDownIcon from '/public/svg/arrow-down-line.svg';
import ArrowRight from '/public/svg/arrow-right.svg';
import { EmptyEvent } from '@/components/common/empty';

interface Props {
  player: Player;
  transfers: any[];
}
const PlayerDetailedPage = ({ player, transfers }: Props) => {
  const { isDesktop } = useDetectDeviceClient();
  const { setSelectedPlayer } = usePlayerStore();
  const i18n = useTrans();
  const refTabs = useRef<TabsRef>(null);
  const {
    id: playerId,
    name: playerName,
    team,
  } = player || {
    team: { id: '', tournament: { name: '', slug: '', category: null } },
  };
  const { id: teamId, tournament } = team;
  const leagueId = tournament?.uniqueTournament?.id || '';
  const { name: leagueName, slug: leagueSlug, category } = tournament;
  const {
    name: categoryName,
    slug: categorySlug,
    id: categoryId,
  } = category || {};

  const { data } = useTeamPlayerDataClub(player?.team?.id);

  // Remove player not available
  const playerAvailable = useMemo(() => {
    return (
      data?.players?.length > 0 &&
      data?.players?.filter((item: any) => !!item.player.id)
    );
  }, [data?.players]);

  useEffect(() => {
    if (player) {
      setSelectedPlayer(player);
    }
  }, [player]);

  // const playerTab = useMemo(() => {
  //   return [
  //     {
  //       title: i18n.tab.overview,
  //       content: (
  //         <div className='w-full space-y-3'>
  //           <TwCard className='flex flex-col gap-2.5 p-2.5 pb-5 lg:flex-row'>
  //             <div>
  //               <span className=' text-sm font-semibold uppercase'>
  //                 {i18n.titles.general_information}
  //               </span>
  //             </div>
  //             <div className='w-full lg:w-1/2'>
  //               <PlayerSummary playerDetail={player} />
  //             </div>
  //           </TwCard>
  //           <TwCard className='flex flex-col gap-2.5 p-2.5 lg:flex-row'>
  //             <div className='rounded-md  py-2.5'>
  //               <PlayerAttributeOverviewGraph player={player} />
  //             </div>
  //           </TwCard>
  //           <TwCard>
  //             <TwMainColContainer>
  //               {/* Transfers */}
  //               <TransfersSection
  //                 player={player}
  //                 transfers={[...transfers]}
  //                 proposedMarketValueRaw={proposedMarketValueRaw}
  //               />
  //             </TwMainColContainer>
  //           </TwCard>
  //         </div>
  //       ),
  //     },
  //     {
  //       title: i18n.tab.matches,
  //       content: (
  //         <>
  //           <TwCard className='space-y-3 py-2'>
  //             <PlayerMatchesSection playerId={playerId} teamId={teamId} />
  //           </TwCard>
  //         </>
  //       ),
  //     },
  //   ];
  // }, [player, transfers, proposedMarketValueRaw, playerId, teamId]);
  //https://img.uniscore.com/football/thumbnail/leagues/p3glrw7h1jnqdyj/image

  const contentSEO = (playerName?: any) => {
    if (!playerName) {
      return {
        templateTitle: i18n.seo.player.title.replaceAll('{playerName}', ''),
        description: i18n.seo.player.description.replaceAll('{playerName}', ''),
      };
    }

    const templateTitle = i18n.seo.player.title.replaceAll(
      '{playerName}',
      playerName
    );
    const description = i18n.seo.player.description.replaceAll(
      '{playerName}',
      playerName
    );

    const newId = decode(playerId);
    const image = `${process.env.NEXT_PUBLIC_IMAGE_URL}/football/player/${newId}/image`;
    return {
      templateTitle,
      description,
      image,
      isSquareImage: true,
    };
  };

  if (!player) {
    return <Seo {...contentSEO()} />;
  }

  return (
    <>
      {/*<FootBallMenu />*/}
      <Seo {...contentSEO(playerName)} />
      <div className='layout hidden lg:block'>
        <BreadCrumb className='overflow-x-scroll py-2.5 no-scrollbar'>
          <BreadCumbLink href='/' name={i18n.common.football} />
          <BreadCrumbSep />
          <BreadCumbLink
            href={`/football/country/${categoryName}/${categoryId}`}
            name={categoryName}
          />
          <BreadCrumbSep />
          <BreadCumbLink
            href={`/football/competition/${categorySlug}/${leagueSlug}/${leagueId}`}
            name={leagueName}
          />
          <BreadCrumbSep />
          <BreadCumbLink
            href={`/football/player/${playerId}`}
            name={playerName}
            isEnd
          />
        </BreadCrumb>
      </div>
      {/* new ui */}

      <div className='flex w-full'>
        <div className='layout flex w-full gap-6 transition-all duration-150 lg:flex-row'>
          <TwFilterCol className='flex-shrink-1 sticky top-20 w-full max-w-[209px] no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
            <div className='bg-white p-4 dark:bg-dark-card lg:rounded-lg'>
              <TeamComponent
                teamName={player?.team?.name}
                teamId={player?.team?.id}
              />
              {playerAvailable &&
                playerAvailable.map((item: any) => (
                  <PlayerRow player={item.player} key={item.player.id} />
                ))}
            </div>
          </TwFilterCol>
          <div className='block w-full lg:grid lg:w-[calc(100%-209px)] lg:grid-cols-3 lg:gap-x-6'>
            <TwMainCol className='!col-span-2'>
              <div className='h-full lg:overflow-hidden'>
                {!isDesktop ? (
                  <PlayerMobileView
                    i18n={i18n}
                    player={player}
                    transfers={transfers}
                    playerId={playerId}
                    teamId={teamId}
                    isDesktop={isDesktop}
                  />
                ) : (
                  <div className='flex w-full flex-col space-y-6'>
                    <PlayerSummary
                      playerDetail={player}
                      isDesktop={isDesktop}
                    />
                    <PlayerMoreDetail playerDetail={player} />
                    <PlayerTransfer
                      playerDetail={player}
                      transfers={transfers}
                    />
                    <div className='space-y-4'>
                      {/* Match section */}
                      <TwTitle className='px-2.5 pt-2.5'>
                        {i18n.tab.matches}
                      </TwTitle>
                      <div className='bg-white p-4 dark:bg-dark-card lg:rounded-lg !mb-4'>
                        <PlayerMatchesSection
                          playerId={playerId}
                          teamId={teamId}
                          i18n={i18n}
                        ></PlayerMatchesSection>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TwMainCol>

            <TwQuickViewCol className='sticky top-20 col-span-1 no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
              <PlayerStatsSection
                player={player}
                isDesktop={isDesktop}
              ></PlayerStatsSection>
            </TwQuickViewCol>
          </div>
        </div>
      </div>

      {/* end new ui */}
    </>
  );
};

PlayerDetailedPage.getInitialProps = async (
  context: GetServerSidePropsContext
) => {
  const { params = {}, locale = vi } = context;
  const { playerParams } = context.query as { playerParams: string[] };
  const playerId = playerParams[playerParams.length - 1];

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/player/${playerId}`;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {},
  };

  const player = await axios
    .request(config)
    .then((response) => {
      return response.data.data.player || {};
    })
    .catch((error) => {
      return -1;
    });

  const urlTransfers = `${process.env.NEXT_PUBLIC_API_BASE_URL}/player/${playerId}/transfer-history`;
  const configTransfers = {
    method: 'get',
    maxBodyLength: Infinity,
    url: urlTransfers,
    headers: {},
  };

  const transfers = await axios
    .request(configTransfers)
    .then((response) => {
      return response.data.data.transferHistory || [];
    })
    .catch((error) => {
      return [];
    });

  if (player === -1) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { player, transfers };
};

export default PlayerDetailedPage;

const TeamComponent = ({ teamName, teamId }: any) => (
  <div className='flex items-center gap-2 border-b border-dark-time-tennis p-2'>
    <CustomLink
      href={`/${SPORT.FOOTBALL}/competitor/${teamName}/${teamId}`}
      target='_parent'
    >
      <Avatar
        id={teamId}
        type='team'
        width={40}
        height={40}
        rounded={false}
        isBackground={false}
      />
    </CustomLink>
    <span className='font-oswald text-sm font-medium uppercase text-black dark:text-white'>
      {teamName}
    </span>
  </div>
);

const PlayerRow = ({ player }: any) => {
  const router = useRouter();
  return (
    <div
      className='relative flex cursor-pointer items-center gap-2 border-b border-line-default p-2 dark:border-dark-time-tennis'
      onClick={() =>
        router.push(`/${SPORT.FOOTBALL}/player/${player?.slug}/${player?.id}`)
      }
    >
      <div className='w-10'>
        <Avatar
          id={player?.id}
          type='player'
          width={40}
          height={40}
          sport={SPORT.FOOTBALL}
        />
      </div>
      <div className='flex-1'>
        <h3 className='block w-full max-w-24 truncate text-[13px] text-black dark:text-white'>
          {player?.name}
        </h3>
        <div className='flex gap-1'>
          <span className='text-[11px] text-black dark:text-white'>
            {player?.shirt_number}
          </span>
          <span className='text-[11px] text-light-secondary'>
            {player?.position}
          </span>
        </div>
      </div>
      <ArrowRight className='absolute right-2 text-black dark:text-white' />
    </div>
  );
};

// export const Last12MonthsSection = ({
//   player,
//   i18n,
// }: {
//   player: any;
//   i18n: any;
// }) => {
//   const { data, isLoading, isFetching } = usePlayerLastYearSummaryData(
//     player?.id
//   );
//   const mapMonthStatsInjuryed: any[] = [];

//   const orderedMonthStats: any[] = useMemo(() => {
//     if (isValEmpty(data)) {
//       return [];
//     }

//     const { summary = [] } = data || {};
//     if (isValEmpty(summary)) {
//       return [];
//     }
//     // get all event by month
//     const mapMonthEvents: Map<any, any[]> = new Map();

//     for (const event of summary) {
//       const { timestamp = 0 } = event || {};
//       const month: any = formatTimestamp(timestamp, 'yyyyMM');
//       const monthEvents = mapMonthEvents.get(month) || [];
//       monthEvents.push(event);
//       mapMonthEvents.set(month, monthEvents);
//     }

//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     const currentMonth = currentDate.getMonth() + 1;

//     const twelveMonths = [];
//     for (let i = 0; i < 12; i++) {
//       let tempYear = currentYear;
//       let tempMonth = currentMonth - i;

//       if (tempMonth < 1) {
//         tempYear--;
//         tempMonth += 12;
//       }

//       const monthString = `${tempYear}${tempMonth.toString().padStart(2, '0')}`;
//       twelveMonths.push(monthString);
//     }

//     twelveMonths.forEach((month) => {
//       if (!mapMonthEvents.has(month)) {
//         mapMonthEvents.set(month, []);
//       }
//     });

//     const sortedEntries = Array.from(mapMonthEvents.entries()).sort((a, b) =>
//       a[0] < b[0] ? -1 : 1
//     );

//     const sortedMapMonthEvents = new Map(sortedEntries);

//     // calculate avg rating and number of appearances by month
//     const mapMonthStatsEvent: Map<any, any> = new Map();
//     for (const month of Array.from(sortedMapMonthEvents.keys())) {
//       const monthEvents = sortedMapMonthEvents.get(month) || [];
//       monthEvents.map((event) => {
//         if (event.type === 'injury') {
//           const percent = calculateInjuryPercentage(event);
//           mapMonthStatsInjuryed.push({ ...event, percent: percent });
//         }
//       });
//       // appearances if type is event
//       const filteredEvents = monthEvents.filter(
//         (event: any) => event.type === 'event'
//       );
//       const numApps = filteredEvents.length;

//       const avgRating =
//         numApps === 0
//           ? 0
//           : filteredEvents.reduce((acc: number, cur: any) => {
//               return acc + Number(cur?.value);
//             }, 0) / numApps;

//       mapMonthStatsEvent.set(month, {
//         numApps,
//         avgRating: numApps === 0 ? '-' : roundNumber(avgRating, 2),
//         monthTimestamp: monthEvents[0]?.timestamp
//           ? monthEvents[0]?.timestamp
//           : convertMonthStringToTimestamp(month),
//       });
//     }

//     const orderedMonthStats = Array.from(mapMonthStatsEvent.values()).sort(
//       (a, b) => {
//         return a.monthTimestamp - b.monthTimestamp;
//       }
//     );

//     return orderedMonthStats;
//   }, [data]);
//   if (isLoading || isFetching || !data) {
//     return <></>;
//   }
//   return (
//     <>
//       <div className='flex h-full text-xs text-black '>
//         <ul className=' relative  grid h-full flex-1 grid-cols-12 gap-2 px-2'>
//           {orderedMonthStats.map((monthStats, index) => {
//             const { numApps, avgRating, monthTimestamp } = monthStats || {};
//             return (
//               <li key={index} className=' flex h-36 flex-col pt-2'>
//                 <div
//                   className={`h-1/6 text-center ${
//                     index % 2 === 1 ? '' : 'opacity-0'
//                   }`}
//                 >
//                   {formatTimestamp(monthTimestamp, 'MMM')}
//                 </div>
//                 <div className='flex flex-1 flex-col'>
//                   <div className='flex-1 '></div>
//                   <div
//                     className={`${genRatingColor(avgRating)} rounded-t-sm `}
//                     css={{
//                       height: `${calcu(avgRating)}%`,
//                     }}
//                   >
//                     {index === 0 ? (
//                       mapMonthStatsInjuryed.map((event: any, index: number) => {
//                         const left = calculateLeftTimeStamp(
//                           orderedMonthStats[0].monthTimestamp,
//                           orderedMonthStats[orderedMonthStats.length - 1]
//                             .monthTimestamp,
//                           event.timestamp
//                         );
//                         return (
//                           <div
//                             key={index}
//                             className='absolute bottom-[2.125rem] h-[58%] bg-[#FF00004D] bg-opacity-30 opacity-80'
//                             style={{
//                               width: `${
//                                 parseFloat(event.percent) + left > 100
//                                   ? 100 - left
//                                   : event.percent
//                               }%`, // Add '%' to event.percent
//                               left: `${left < 0 ? 0 : left}%`, // Add '%' to left
//                             }}
//                           >
//                             <div className='flex items-center justify-center pt-1'>
//                               <InjurySvg></InjurySvg>
//                             </div>
//                           </div>
//                         );
//                       })
//                     ) : (
//                       <></>
//                     )}
//                   </div>
//                 </div>
//                 <div
//                   className={`${genRatingColorText(
//                     avgRating
//                   )} mt-0.5 h-5 rounded-t-sm text-center`}
//                 >
//                   {avgRating}
//                 </div>
//                 <div className='h-3 text-center text-xs text-dark-text'>
//                   {numApps}
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//         <div className=' flex w-3 flex-col justify-end pt-2'>
//           <div className='h-1/6 '></div>
//           <ul className=' flex-1'>
//             {/* <li className='h-[10%] w-1.5 bg-[#037ab0]'></li> */}
//             <li className='h-1/6 w-1.5 bg-[#20ac03]'></li>
//             <li className='h-2/6 w-1.5 bg-[#a2bc00]'></li>
//             <li className='h-1/6 w-1.5 bg-[#d3ad04]'></li>
//             <li className='h-1/6 w-1.5 bg-[#e67a29]'></li>
//             <li className='h-1/6 w-1.5 bg-[#c52b2b]'></li>
//           </ul>
//           <div className='mt-0.5 h-5 '></div>
//           <div className='h-3 text-center text-xs '></div>
//         </div>
//       </div>
//       {/* <div className='mt-2 flex items-center gap-2'>
//         <div className=' flex items-center gap-x-1.5'>
//           <InjuredSVG className='w-5'></InjuredSVG>
//           <TwTransferFeeText>Thời kỳ chấn thương</TwTransferFeeText>
//         </div>
//         <div className=' flex items-center gap-x-1.5'>
//           <LoanOutSVG className='w-5'></LoanOutSVG>
//           <TwTransferFeeText>Chuyển nhượng / Cho mượn</TwTransferFeeText>
//         </div>
//       </div> */}
//       <div className='flex justify-between px-2.5 py-1'>
//         <div className=' flex items-center gap-x-1.5'>
//           {/* <div className={`${genRatingColor(avgRating)} w-5`}></div> */}
//           <ul className='flex'>
//             <li className='h-1 w-1 bg-[#FA5151]'></li>
//             <li className='h-1 w-1 bg-[#EE8749]'></li>
//             <li className='h-1 w-1 bg-[#D8B62A]'></li>
//             <li className='h-1 w-1 bg-[#A2B719]'></li>
//             <li className='h-1 w-1 bg-[#47C152]'></li>
//             <li className='h-1 w-1 bg-[#3498DB]'></li>
//           </ul>
//           <TwTransferFeeText>Rating</TwTransferFeeText>
//         </div>
//         <div className=' flex items-center gap-x-1.5'>
//           {/* <LoanOutSVG className='w-5'></LoanOutSVG> */}
//           <div className='h-1 w-6 bg-dark-text'></div>
//           <TwTransferFeeText>Appearances</TwTransferFeeText>
//         </div>
//       </div>
//     </>
//   );
// };

// ========================================
// export const NationalTeamStatsSection = ({ player }: { player: any }) => {
//   const { data, isLoading, isFetching } = usePlayerNationalStatsData(
//     player?.id
//   );

//   if (isLoading || isFetching || !data) {
//     return <></>;
//   }

//   const playerStats = data.length ? data[0] : null;
//   if (!playerStats) {
//     return <></>;
//   }

//   const {
//     appearances = 0,
//     debutTimestamp = 0,
//     goals = 0,
//     team = {},
//   } = playerStats || {};

//   const { id: teamId, name, slug } = team;
//   return (
//     <>
//       <TwCard className=' space-y-4 p-2.5'>
//         <TwTitle className=''>National Team</TwTitle>
//         <div className='flex'>
//           <div className=' flex w-1/2 items-center gap-2'>
//             <div>
//               <CustomLink
//                 href={`/football/competitor/${slug}/${teamId}`}
//                 target='_parent'
//               >
//                 <Avatar
//                   id={teamId}
//                   type='team'
//                   width={36}
//                   height={36}
//                   isBackground={false}
//                   rounded={false}
//                 />
//               </CustomLink>
//             </div>
//             <div className=''>
//               <div className='truncate text-sm font-normal leading-4'>
//                 {name}
//               </div>
//               <div className='text-xs font-medium leading-4 text-dark-text'>
//                 Debut: {formatTimestamp(debutTimestamp, 'yyyy-MM-dd')}
//               </div>
//             </div>
//           </div>
//           <div className=' flex-1'>
//             <div className='flex items-center justify-end gap-3'>
//               <span className='truncate text-csm font-normal leading-4 text-dark-text'>
//                 Appearances
//               </span>
//               <span className='w-10 text-right text-sm leading-5 text-neutral-600'>
//                 {appearances}
//               </span>
//             </div>
//             <div className='flex items-center justify-end gap-3'>
//               <span className='truncate text-csm leading-4 text-dark-text'>
//                 Goals
//               </span>
//               <span className='w-10 text-right text-sm leading-4 text-neutral-600'>
//                 {goals}
//               </span>
//             </div>
//           </div>
//         </div>
//       </TwCard>
//     </>
//   );
// };

export const PlayerMatchesSection = ({
  playerId,
  teamId,
  i18n = vi,
}: {
  playerId: string;
  teamId?: string;
  i18n?: any;
}) => {
  const [page, setPage] = useState<number>(0);

  const {
    data: lastEventsData,
    isLoading: lastEventsIsLoading,
    isFetching: lastEventsIsFetching,
    isError: isErrorLast,
  } = usePlayerEventsData(playerId, 'last', page);

  const { setSelectedMatch, setShowSelectedMatch } = useMatchStore();

  useEffect(() => {
    const { events: lastEvents } = lastEventsData || [];

    let shownMatch = null;
    if (lastEvents && lastEvents.length > 0) {
      shownMatch = lastEvents[lastEvents.length - 1];
    }
    if (shownMatch) {
      setSelectedMatch(shownMatch?.id || shownMatch.customId);
      setShowSelectedMatch(true);
    }
  }, [lastEventsData, setSelectedMatch, setShowSelectedMatch]);

  if (lastEventsIsLoading || lastEventsIsFetching) {
    return (
      <>
        <LastMatchSkeleton />
      </>
    );
  }

  const {
    events: lastEvents,
    incidentsMap: lastIncidentsMap,
    onBenchMap: lastOnBenchMap,
    playedForTeamMap: lastPlayedForTeamMap,
    statisticsMap: lastStatisticsMap,
  } = lastEventsData || [];

  const allEvents = [...(lastEvents || [])];
  const allIncidentsMap = { ...lastIncidentsMap };
  const allOnBenchMap = { ...lastOnBenchMap };
  const allPlayedForTeamMap = {
    ...lastPlayedForTeamMap,
  };
  const allStatisticsMap = { ...lastStatisticsMap };
  const dataMatch = allEvents ? groupByTournamentShow(allEvents) : [];

  return (
    <>
      <div className='flex w-full justify-between px-2 lg:pb-2.5'>
        <div>
          {(!isErrorLast || page > 0) && dataMatch && dataMatch.length > 0 && (
            <TwFilterButton onClick={() => setPage(page - 1)}>
              {i18n.filter.previous}
            </TwFilterButton>
          )}
        </div>
        {page < 0 && (
          <TwFilterButton onClick={() => setPage(page + 1)}>
            {i18n.filter.next}
          </TwFilterButton>
        )}
      </div>
      <div className='flex max-h-[70vh] md:max-h-[90vh]'>
        <div className='w-full flex-shrink space-y-2 overflow-y-auto overflow-x-hidden scrollbar md:px-2.5 xl:pl-2 xl:pr-0'>
          <div className='space-y-1.5 px-2 lg:p-0'>
            {dataMatch.map((group, idx) => (
              <React.Fragment key={`group-${idx}`}>
                {group.matches.map(
                  (match: SportEventDtoWithStat, matchIdx: any) => {
                    const incidents = allIncidentsMap[match?.id] || {};
                    const isOnBench = allOnBenchMap[match?.id];
                    const playedForTeam =
                      allPlayedForTeamMap[match?.id] || teamId;
                    const statistics = allStatisticsMap[match?.id] || {};
                    return (
                      <React.Fragment key={`match-${match?.id}`}>
                        {matchIdx === 0 && (
                          <LeagueRow
                            match={match}
                            isLink={
                              match &&
                              match.season_id &&
                              match.season_id.length > 0
                                ? true
                                : false
                            }
                          />
                        )}
                        <PlayerMatchRow
                          key={matchIdx}
                          matchData={match}
                          teamId={teamId}
                          incidents={incidents}
                          isOnBench={isOnBench}
                          playedForTeam={playedForTeam}
                          statistics={statistics}
                          i18n={i18n}
                        ></PlayerMatchRow>
                      </React.Fragment>
                    );
                  }
                )}
              </React.Fragment>
            ))}

            {dataMatch.length === 0 && (
              <div className='flex flex-col items-center justify-center mb-4 lg:mb-0'>
                <EmptyEvent content={i18n.info.noData} />
              </div>
            )}
            {/* {allEvents.map((match: any, idx: number) => {
              const incidents = allIncidentsMap[match?.id] || {};
              const isOnBench = allOnBenchMap[match?.id];
              const playedForTeam = allPlayedForTeamMap[match?.id] || teamId;
              const statistics = allStatisticsMap[match?.id] || {};

              return (
                <PlayerMatchRow
                  key={idx}
                  matchData={match}
                  teamId={teamId}
                  incidents={incidents}
                  isOnBench={isOnBench}
                  playedForTeam={playedForTeam}
                  statistics={statistics}
                  i18n={i18n}
                ></PlayerMatchRow>
              );
            })} */}
          </div>
        </div>
        {/* TODO add quick view here */}
        <div className='hidden flex-1 overflow-auto' css={[tw`lg:block`]}>
          <LeagueQuickViewSection></LeagueQuickViewSection>
        </div>
      </div>
    </>
  );
};

export const PlayerMatchRow = ({
  matchData,
  teamId,
  incidents = {},
  isOnBench = false,
  playedForTeam,
  statistics = {},
  i18n,
}: {
  matchData?: any;
  teamId?: string;
  incidents?: any;
  isOnBench?: boolean;
  playedForTeam?: any;
  statistics?: any;
  i18n?: any;
}) => {
  const {
    id: matchId,
    homeTeam = {},
    awayTeam = {},
    homeScore = {},
    awayScore = {},
    winnerCode = 1,
    tournament = {},
    startTimestamp,
    status,
    time,
  } = matchData || {};

  const { currentPeriodStartTimestamp } = time || {};

  const router = useRouter();

  // const { selectedMatch, setShowSelectedMatch, setSelectedMatch } =
  //   useMatchStore();

  // const competitorId = Number(teamId);
  const { rating = 0 } = statistics || {};

  return (
    <div
      className=' flex cursor-pointer items-center gap-2 border border-line-default bg-white px-1.5 text-csm text-sm dark:border-transparent  dark:bg-dark-match dark:bg-primary-gradient  md:rounded-md'
      onClick={() => {
        router.push(
          `/${SPORT.FOOTBALL}/match/${getSlug(homeTeam.name)}-${getSlug(
            awayTeam.name
          )}/${matchId}`
        ); // TODO slug
      }}
    >
      <MatchTimeStamp
        type='league'
        startTimestamp={startTimestamp}
        status={status}
        id={matchId}
        i18n={i18n}
        currentPeriodStartTimestamp={currentPeriodStartTimestamp}
        competition={tournament}
        showTime={false}
        sport={SPORT.FOOTBALL}
      />

      {/* Team */}
      <div className='flex flex-1 justify-between space-y-1'>
        <div className='flex w-[60%] flex-col justify-center gap-1 truncate'>
          <div css={[winnerCode !== 1 && tw`text-dark-text`]}>
            <SoccerTeam
              logoUrl={`${getImage(Images.team, homeTeam?.id)}`}
              name={`${homeTeam.name}`}
              team={homeTeam}
            ></SoccerTeam>
          </div>

          <div css={[winnerCode !== 2 && tw`text-dark-text`]}>
            <SoccerTeam
              logoUrl={`${getImage(Images.team, awayTeam?.id)}`}
              name={`${awayTeam.name}`}
              team={awayTeam}
            ></SoccerTeam>
          </div>
        </div>
        <div className='flex flex-1 items-center justify-end'>
          {incidents && (
            <PlayerIncidents incidents={incidents}></PlayerIncidents>
          )}
        </div>
        {/* <div className='flex h-full flex-1 flex-col place-content-center'>
          <div className='flex flex-col justify-between'>
            <div className=''>
              {playedForTeam === homeTeam?.id ? (
                <PlayerIncidents incidents={incidents}></PlayerIncidents>
              ) : (
                <></>
              )}
            </div>
            <div className=''>
              {playedForTeam === awayTeam?.id ? (
                <PlayerIncidents incidents={incidents}></PlayerIncidents>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div> */}
        <div className='flex flex-col place-content-center'>
          <div className='my-auto w-9 space-y-2 p-2 text-white'>
            <MatchScoreColumn
              code={status?.code}
              homeScore={homeScore.display}
              awayScore={awayScore.display}
            />
          </div>
        </div>
      </div>

      <div className='divide-list-x flex min-w-6 justify-evenly'>
        <div className='flex place-content-center items-center'>
          {rating > 0 && <RatingBadge point={rating}></RatingBadge>}
          {isOnBench && !rating && (
            <BenchSVG className='h-5 w-5 text-dark-text'></BenchSVG>
          )}
        </div>
      </div>
    </div>
  );
};

export const PlayerIncidents = ({ incidents }: { incidents: any }) => {
  const {
    assists: numAssists = 0,
    yellowCards = 0,
    redCards = 0,
    yellowReds = 0,
    goals = 0,
    penaltyGoals: penGoals = 0,
  } = incidents || {};

  const numGoals = goals - penGoals;

  return (
    <div className='flex items-center justify-end gap-1'>
      {redCards > 0 && <RedCard numCards={redCards} size='xs'></RedCard>}
      {yellowCards < 2 && yellowCards > 0 && (
        <YellowCard numCards={yellowCards} size='xs'></YellowCard>
      )}
      {yellowReds > 0 && (
        <div className='flex justify-end'>
          <span className=''>
            <YellowCard numCards={1} size='xs'></YellowCard>
          </span>
          <RedCard numCards={1} size='xs'></RedCard>
        </div>
      )}
      {/* {yellowCards > 0 && (
        <div className='flex'>
          <YellowCard numCards={yellowCards} size='xs'></YellowCard>
          <RedCard numCards={1} size='sm'></RedCard>
        </div>
      )} */}
      <span className='flex items-center justify-end'>
        {numGoals > 0 ? <GoalBlueSVG className='h-4 w-4'></GoalBlueSVG> : ''}
        {numGoals > 1 && (
          <span className='text-cxs text-logo-blue'>
            <>x{numGoals}</>
          </span>
        )}
      </span>
      {penGoals > 0 && (
        <div className='flex items-center justify-end text-logo-blue'>
          <GoalPenSVG css={[tw`h-4 w-4 text-logo-blue`]}></GoalPenSVG>
          {penGoals > 1 && <span className='text-cxs'>x{penGoals}</span>}
        </div>
      )}

      {/* {missedPens > 0 && (
        <div className='relative'>
          <MisssedPenSVG css={[tw`h-4 w-4 text-dark-loss`]}></MisssedPenSVG>
          {missedPens > 1 && (
            <span className='absolute -right-3 top-0 text-xs text-white'>
              x{missedPens}
            </span>
          )}
        </div>
      )} */}

      {/* {ownGoals > 0 && (
        <div className='relative'>
          <OwnGoalSVG css={[tw`h-5 w-5 text-dark-loss`]}></OwnGoalSVG>
          {ownGoals > 1 && (
            <span className='absolute -right-3 top-0 text-xs text-white'>
              x{ownGoals}
            </span>
          )}
        </div>
      )} */}

      {numAssists > 0 && (
        <span className='flex items-center justify-end text-logo-blue'>
          <AssistSVG className='inline-block h-4 w-4'></AssistSVG>
          {numAssists > 1 && <sub className='text-cxs'>{`x${numAssists}`}</sub>}
        </span>
      )}
    </div>
  );
};

export const TransferHistorySection = ({
  transfers,
  player,
}: {
  transfers: any;
  player: any;
}) => {
  const [showAll, setShowAll] = useState<boolean>(false);

  const trimmedTransfers = showAll ? transfers : transfers.slice(0, 6);

  return (
    <div className=''>
      <ul className='divide-list'>
        {trimmedTransfers.map((transfer: any, idx: number) => {
          const {
            transferTo = {},
            type,
            transferFeeDescription,
            transferDateTimestamp,
          } = transfer || {};

          const [transferDesc] = genTransferTexts(type, transferFeeDescription);
          return (
            <TransferHistoryEntry
              key={idx}
              team={transferTo}
              dateStr={`${formatTimestamp(
                transferDateTimestamp,
                'yyyy-MM-dd'
              )}`}
              fee={transferFeeDescription}
              transferDesc={transferDesc}
            ></TransferHistoryEntry>
          );
        })}
      </ul>
      <div className=' flex justify-end'>
        {/* button show all/hide */}
        {transfers.length > 5 && (
          <button
            className=' flex items-center text-xs font-normal not-italic leading-5 text-dark-win '
            onClick={() => setShowAll(!showAll)}
            css={[showAll ? tw`text-dark-loss` : tw`text-logo-blue`]}
          >
            <span className=''>
              {showAll ? (
                <HiOutlineChevronUp className='w-4'></HiOutlineChevronUp>
              ) : (
                <HiOutlineChevronDown className='w-4'></HiOutlineChevronDown>
              )}
            </span>
            {showAll ? 'Ẩn bớt' : 'Xem tất cả'}
          </button>
        )}
      </div>
    </div>
  );
};

export const TransferHistoryEntry = ({
  team,
  dateStr,
  fee,
  transferDesc,
}: {
  team: any;
  dateStr?: string;
  fee?: string;
  transferDesc?: string;
}) => {
  return (
    <li className=' flex items-center gap-4 py-1'>
      <span className='w-10'>
        <CustomLink
          href={`/football/competitor/${team?.slug || team?.name}/${team?.id}`}
          target='_parent'
        >
          <Avatar
            id={team?.id}
            type='team'
            width={40}
            height={40}
            isBackground={false}
            rounded={false}
          />
        </CustomLink>
      </span>
      <div className='flex-1'>
        <span className='block text-csm font-semibold not-italic leading-5 text-light-default dark:text-dark-default'>
          {team.name}
        </span>
        <span className='block text-xs font-normal not-italic leading-4 dark:text-dark-text'>
          {dateStr}
        </span>
      </div>
      <span className='flex w-24 flex-col text-right  text-xs font-semibold not-italic leading-5'>
        <span className='text-logo-blue'>{fee}</span>
        <span className='text-dark-text'>{transferDesc}</span>
      </span>
    </li>
  );
};

export const AppearanceEntry = ({
  appearance,
  rating,
  tournament = {},
}: {
  appearance?: string;
  rating?: number;
  tournament?: any;
}) => {
  return (
    <li className=' flex h-fit items-center gap-4 py-1'>
      <div className=' flex place-content-center'>
        <CustomLink
          href={`/football/competitor/${tournament?.slug || tournament?.name}/${
            tournament?.id
          }`}
          target='_parent'
        >
          <Avatar
            id={tournament?.id}
            type='team'
            width={40}
            height={40}
            isBackground={false}
            rounded={false}
          />
        </CustomLink>
      </div>
      <div className='flex flex-1 justify-between'>
        <div>
          <div className=' flex-1 text-csm font-semibold not-italic leading-5 '>
            {tournament?.name}
          </div>
          <div className=' space-x-2 text-xs font-normal not-italic leading-4 dark:text-dark-text'>
            <span>Appearances:</span>
            <span>{appearance}</span>
          </div>
        </div>

        <div className='flex items-center'>
          <RatingBadge point={rating || 0} isSmall={false}></RatingBadge>
        </div>
      </div>
    </li>
  );
};

export const AppearanceSection = ({
  player,
  i18n,
}: {
  player: any;
  i18n: any;
}) => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const { data, isLoading, isFetching } = usePlayerLastYearSummaryData(
    player?.id
  );

  const orderedLeagueStats = useMemo(() => {
    if (isValEmpty(data)) {
      return [];
    }

    const { summary = [], uniqueTournamentsMap = {} } = data || {};
    if (isValEmpty(summary) || isValEmpty(uniqueTournamentsMap)) {
      return [];
    }

    const mapLeagueEvents: Map<string, any[]> = new Map();
    for (const event of summary) {
      const { type, uniqueTournamentId } = event || {};
      if (type === 'event') {
        const leagueEvents = mapLeagueEvents.get(`${uniqueTournamentId}`) || [];
        leagueEvents.push(event);
        mapLeagueEvents.set(`${uniqueTournamentId}`, leagueEvents);
      }
    }

    const mapLeagueStats: Map<string, any> = new Map();
    for (const [tournamentId, tournament] of Object.entries(
      uniqueTournamentsMap
    )) {
      const leagueEvents = mapLeagueEvents.get(tournamentId) || [];
      const numApps = leagueEvents.length;
      const avgRating =
        leagueEvents.reduce((acc, cur) => {
          return acc + Number(cur.value);
        }, 0) / numApps;
      mapLeagueStats.set(tournamentId, {
        numApps,
        avgRating,
        tournament,
      });
    }

    const orderedLeagueStats = Array.from(mapLeagueStats.values()).sort(
      (a, b) => {
        return b.numApps - a.numApps;
      }
    );

    return orderedLeagueStats;
  }, [data]);

  if (isLoading || isFetching || !data) {
    return <></>;
  }

  const trimmedLeagesStats = showAll
    ? orderedLeagueStats
    : orderedLeagueStats.slice(0, 6);

  return (
    <div className=''>
      <ul className='divide-list'>
        {trimmedLeagesStats.map((leagueStat: any, index: number) => {
          const {
            avgRating = 0,
            numApps = 0,
            tournament = {},
          } = leagueStat || {};
          return (
            <AppearanceEntry
              key={index}
              appearance={numApps}
              rating={avgRating}
              tournament={tournament}
            ></AppearanceEntry>
          );
        })}
      </ul>
      <div className=' flex justify-end'>
        {/* button show all/hide */}
        {orderedLeagueStats.length > 5 && (
          <button
            className=' flex items-center text-xs font-normal not-italic leading-5 text-dark-win '
            onClick={() => setShowAll(!showAll)}
            css={[showAll ? tw`text-dark-loss` : tw`text-logo-blue`]}
          >
            {/* icon */}
            <span className=''>
              {showAll ? (
                <HiOutlineChevronUp className='w-4'></HiOutlineChevronUp>
              ) : (
                <HiOutlineChevronDown className='w-4'></HiOutlineChevronDown>
              )}
            </span>
            {showAll ? 'Ẩn bớt' : 'Xem tất cả'}
          </button>
        )}
      </div>
    </div>
  );
};

export const PlayerStatsSection = ({
  player,
  isDesktop,
}: {
  player: any;
  isDesktop?: boolean;
}) => {
  return (
    <div className='space-y-2.5 rounded-lg bg-transparent lg:bg-white lg:p-4 lg:dark:bg-dark-card'>
      <PlayerStatsSeasonFilters
        player={player}
        isDesktop={isDesktop}
      ></PlayerStatsSeasonFilters>
      <Divider></Divider>
      <div>
        <PlayerStatsOverallSection
          player={player}
          isDesktop={isDesktop}
        ></PlayerStatsOverallSection>
      </div>
    </div>
  );
};

export const TwStatsUl = tw.ul``;
export const TwStatsLi = tw.li`flex justify-between`;

export const PlayerSeasonHeatmapSection = ({
  player,
  i18n,
}: {
  player: any;
  i18n: any;
}) => {
  const { statsTournament, statsSeason } = usePlayerStore();

  return (
    <>
      <PlayerSeasonHeatmap
        tournamentId={statsTournament?.id}
        seasonId={statsSeason?.id}
        playerId={player?.id}
      ></PlayerSeasonHeatmap>
    </>
  );
};

export const PlayerStatsOverallSection = ({
  player,
  isDesktop,
}: {
  player: any;
  isDesktop?: boolean;
}) => {
  const { statsTournament, statsSeason } = usePlayerStore();

  const i18n = useTrans();
  const {
    data: overallStats,
    isLoading: isLoadingOverall,
    isFetching: isFetchingOverall,
  } = usePlayerStatsOverallData(
    player?.id,
    statsTournament?.id,
    statsSeason?.id
  );

  if (isFetchingOverall || isLoadingOverall || !overallStats) {
    return <></>;
  }

  const { statistics = {}, team = {} } = overallStats || {};
  const { rating: avgRating = 0 } = statistics || {};

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

  // return (
  //   <>
  //     <StatsCollapse title='Trận đấu'>
  //       <TwStatsUl className='divide-list pb-2.5'>
  //         {Object.keys(statistics).map((key: string, idx: number) => {
  //           return (
  //             <TwStatsLi key={idx} className=' item-hover p-1.5'>
  //               <span>{getStatsLabel(key)}</span>
  //               <span>{roundNumber(statistics[key])}</span>
  //             </TwStatsLi>
  //           );
  //         })}
  //       </TwStatsUl>
  //     </StatsCollapse>

  //     <StatsCollapse title='Tấn công'></StatsCollapse>
  //     <Divider />
  //     <StatsCollapse title='Chuyền'></StatsCollapse>
  //     <Divider />
  //     <StatsCollapse title='Phòng thủ'></StatsCollapse>
  //     <Divider />
  //     <StatsCollapse title='Khác'></StatsCollapse>
  //     <Divider />
  //     <StatsCollapse title='Thẻ'></StatsCollapse>
  //     <Divider />
  //   </>
  // );

  const ratingData =
    groups?.summary?.stats.find((it: any) => it.key == 'rating') || {};

  return (
    <div className='lg:px-2.5'>
      {!isDesktop && (
        <div className='flex flex-wrap gap-y-2.5 rounded-md bg-white p-4 dark:bg-dark-card'>
          <div className='w-1/3 text-center'>
            <b className='block text-clg text-black dark:text-white'>
              {
                groups?.summary?.stats.find((it: any) => it.key == 'goals')
                  ?.value
              }
            </b>
            <span className='text-csm text-black dark:text-light-secondary'>
              {getStatsLabel('goals', i18n)}
            </span>
          </div>
          <div className='w-1/3 text-center'>
            <b className='block text-clg text-black dark:text-white'>
              {
                groups?.summary?.stats.find((it: any) => it.key == 'assists')
                  ?.value
              }
            </b>
            <span className='text-csm text-black dark:text-light-secondary'>
              {getStatsLabel('assists', i18n)}
            </span>
          </div>
          <div className='w-1/3 text-center'>
            <b className='block text-clg text-black dark:text-white'>
              {ratingData && ratingData?.value > 0 && (
                <RatingBadge
                  className='m-auto text-clg'
                  point={ratingData?.value.toFixed(2)}
                ></RatingBadge>
              )}
            </b>
            <span className='text-csm text-black dark:text-light-secondary'>
              {getStatsLabel('rating', i18n)}
            </span>
          </div>
          <div className='w-1/3 text-center'>
            <b className='block text-clg text-black dark:text-white'>
              {
                groups?.summary?.stats.find((it: any) => it.key == 'matches')
                  ?.value
              }
            </b>
            <span className='text-csm text-black dark:text-light-secondary'>
              {getStatsLabel('matches', i18n)}
            </span>
          </div>
          <div className='w-1/3 text-center'>
            <b className='block text-clg text-black dark:text-white'>
              {groups?.other?.stats.find((it: any) => it.key == 'first')?.value}
            </b>
            <span className='text-csm text-black dark:text-light-secondary'>
              {getStatsLabel('first', i18n)}
            </span>
          </div>
          <div className='w-1/3 text-center'>
            <b className='block text-clg text-black dark:text-white'>
              {
                groups?.other?.stats.find(
                  (it: any) => it.key == 'minutesPlayed'
                )?.value
              }
            </b>
            <span className='text-csm text-black dark:text-light-secondary'>
              {getStatsLabel('minutesPlayed', i18n)}
            </span>
          </div>
        </div>
      )}
      {orderedGroups.map((groupKey: any, idx: number) => {
        const groupData = groups[groupKey] || {};
        const { stats = [], name } = groupData || {};
        const orderedStats = stats.sort((a: any, b: any) => {
          return getStatsLabel(a.key) > getStatsLabel(b.key) ? 1 : -1;
        });

        return (
          <div key={idx}>
            <StatsCollapse title={name}>
              <TwStatsUl className='divide-list pb-2.5'>
                {orderedStats.map((stat: any, idx: number) => {
                  const { key, value } = stat || {};
                  return (
                    <TwStatsLi key={idx} className=' item-hover p-1.5'>
                      <span>{getStatsLabel(key, i18n)}</span>
                      <span>{value ? roundNumber(value) : '-'}</span>
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

export const PlayerLastRatingsSection = ({ player }: { player: any }) => {
  const { statsTournament, statsSeason } = usePlayerStore();

  const { data, isLoading, isFetching } = usePlayerLastRatingsData(
    player?.id,
    statsTournament?.id,
    statsSeason?.id
  );

  const {
    data: overallStats,
    isLoading: isLoadingOverall,
    isFetching: isFetchingOverall,
  } = usePlayerStatsOverallData(
    player?.id,
    statsTournament?.id,
    statsSeason?.id
  );

  if (
    isLoading ||
    isFetching ||
    !data ||
    isFetchingOverall ||
    isLoadingOverall ||
    !overallStats
  ) {
    return <></>;
  }

  const { lastRatings = [] } = data || {};
  const { statistics = {}, team = {} } = overallStats || {};
  const { rating: avgRating = 0 } = statistics || {};

  return (
    <div className=''>
      <div className='flex items-center justify-between'>
        <TwPlayerDetailTitle>Xếp hạng</TwPlayerDetailTitle>
        {avgRating > 0 && (
          <RatingBadge
            point={roundNumber(avgRating, 2)}
            isSmall={false}
          ></RatingBadge>
        )}
      </div>
      <div className='flex h-36 rounded-xl bg-light-match p-2.5 dark:bg-dark-match'>
        <div className='relative  h-full w-full flex-1 '>
          <ul className=' flex h-full justify-evenly'>
            {lastRatings.slice(0, 5).map((record: any, idx: number) => {
              const {
                // event,
                // eventId,
                // isHome,
                opponent = {},
                rating,
                startTimestamp,
              } = record || {};
              return (
                <li key={idx} className=' flex flex-col '>
                  {/* Team + date */}
                  <div className=' flex h-2/5 flex-col place-content-center items-center gap-1 text-sm'>
                    <div className='text-xs font-medium leading-4 text-dark-text'>
                      {formatTimestamp(startTimestamp, 'dd/MM')}
                    </div>
                    <Avatar
                      id={opponent?.id}
                      type='team'
                      isBackground={false}
                      rounded={false}
                      width={24}
                      height={24}
                    />
                  </div>
                  {/* Rating */}
                  <div className=' flex h-3/5 flex-col'>
                    <div className='flex-1'></div>
                    <div
                      className='flex place-content-center'
                      css={{
                        height: `${(Number(rating) / 10) * 100}%`,
                      }}
                    >
                      <span className='h-fit w-fit shadow-lg'>
                        <RatingBadge point={rating}></RatingBadge>
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          {avgRating > 0 && (
            <div
              className={`absolute h-[0.063rem] w-[98%] bg-opacity-40 ${genRatingColor(
                avgRating
              )}`}
              css={{
                bottom: `${((Number(avgRating) / 10) * 100 * 3) / 5}%`,
              }}
            ></div>
          )}
        </div>
        <div className=' flex w-3 flex-col justify-end'>
          <ul className='h-3/5'>
            <li className='h-[10%] w-1.5 bg-[#037ab0]'></li>
            <li className='h-[10%] w-1.5 bg-[#20ac03]'></li>
            <li className='h-[10%] w-1.5 bg-[#a2bc00]'></li>
            <li className='h-[5%] w-1.5 bg-[#d3ad04]'></li>
            <li className='h-[5%] w-1.5 bg-[#e67a29]'></li>
            <li className='h-[60%] w-1.5 bg-[#c52b2b]'></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const PlayerStatsSeasonFilters = ({
  player,
  isDesktop,
}: {
  player: any;
  isDesktop?: boolean;
}) => {
  const i18n = useTrans();
  const { data, isLoading, isFetching } = usePlayerStatsSeasonsData(player?.id);
  const [ssOptions, setSSOptions] = useState<any[]>([]);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showBottomSheetYear, setShowBottomSheetYear] = useState(false);
  const { statsTournament, statsSeason, setStatsTournament, setStatsSeason } =
    usePlayerStore();

  const { uniqueTournamentSeasons = [], typesMap = {} } = data || {};

  useEffect(() => {
    const selectedTournaments = uniqueTournamentSeasons.filter(
      (record: any) => {
        return statsTournament?.id === record.uniqueTournament?.id;
      }
    );

    if (selectedTournaments.length) {
      const seasonOptions = selectedTournaments[0]?.seasons;
      if (seasonOptions.length) {
        setSSOptions(seasonOptions);
        setStatsSeason(seasonOptions[0]);
      }
    }
  }, [statsTournament, setStatsSeason, uniqueTournamentSeasons, setSSOptions]);

  const uniqueTournaments = uniqueTournamentSeasons.map((record: any) => {
    return record.uniqueTournament;
  });

  useEffect(() => {
    if (uniqueTournaments.length) {
      setStatsTournament(uniqueTournaments[0]);
    }
  }, [uniqueTournamentSeasons]);

  if (isLoading || isFetching || !data || !uniqueTournamentSeasons.length) {
    return <></>;
  }

  return (
    <div className='flex gap-2.5'>
      {isDesktop ? (
        <>
          <div className='w-2/3'>
            <Select
              options={uniqueTournaments}
              size='full'
              valueGetter={setStatsTournament}
              shownValue={statsTournament?.name}
            ></Select>
          </div>

          <div className='flex-1'>
            {ssOptions.length && (
              <Select
                options={ssOptions}
                size='full'
                label='year'
                valueGetter={setStatsSeason}
                shownValue={statsSeason?.year || statsSeason?.name}
              ></Select>
            )}
          </div>
        </>
      ) : (
        <>
          <div className='flex w-full gap-2.5'>
            <div
              className='flex flex-1 cursor-pointer items-center justify-between gap-2 rounded-md bg-head-tab p-2 dark:bg-dark-head-tab'
              onClick={() => setShowBottomSheet(true)}
            >
              <Avatar
                id={statsTournament?.id}
                type='competition'
                width={24}
                height={24}
                rounded={false}
                isBackground={false}
              />
              <span className='block max-w-36 truncate font-primary text-sm text-black dark:text-white'>
                {statsTournament?.name}
              </span>
              <ArrowDownIcon />
            </div>
            <div
              className='flex min-w-24 cursor-pointer items-center justify-between truncate rounded-md bg-head-tab p-2 dark:bg-dark-head-tab'
              onClick={() => setShowBottomSheetYear(true)}
            >
              <span className='font-primary text-sm text-black dark:text-white'>
                {statsSeason?.year || statsSeason?.name}
              </span>
              <ArrowDownIcon />
            </div>
          </div>

          <BottomSheetComponent
            open={showBottomSheet}
            onClose={() => setShowBottomSheet(false)}
          >
            <div className='flex flex-col'>
              <h3 className='mb-4 border-b border-line-default pb-2 text-center text-black dark:border-dark-stroke dark:text-white'>
                {i18n.filter.tournament}
              </h3>
              <div className='max-h-[370px] overflow-y-scroll'>
                {uniqueTournaments.map((option: any) => (
                  <div
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-md p-3 text-left ${
                      option.id === statsTournament?.id
                        ? 'bg-head-tab dark:bg-[#333]'
                        : ''
                    }`}
                    onClick={() => {
                      setStatsTournament(option);
                      setShowBottomSheet(false);
                    }}
                  >
                    <Avatar
                      id={option.id}
                      type='competition'
                      width={24}
                      height={24}
                      rounded={false}
                      isBackground={false}
                    />
                    <span
                      className={`${
                        option.id === statsTournament?.id
                          ? 'text-black dark:text-white'
                          : 'text-black'
                      } dark:text-white`}
                    >
                      {option.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </BottomSheetComponent>
          <BottomSheetComponent
            open={showBottomSheetYear}
            onClose={() => setShowBottomSheetYear(false)}
          >
            <div className='flex flex-col'>
              <h3 className='mb-4 border-b border-line-default pb-2 text-center text-black dark:border-dark-stroke dark:text-white'>
                {i18n.titles.season}
              </h3>
              <div className='max-h-[370px] overflow-y-scroll'>
                {ssOptions.map((option: any) => (
                  <div
                    key={option.id}
                    className={`cursor-pointer rounded-md p-3 text-left ${
                      option.id === statsSeason?.id
                        ? 'bg-head-tab dark:bg-[#333]'
                        : ''
                    }`}
                    onClick={() => {
                      setStatsSeason(option);
                      setShowBottomSheetYear(false);
                    }}
                  >
                    <span
                      className={`${
                        option.id === statsSeason?.id
                          ? 'text-black dark:text-white'
                          : 'text-black'
                      } dark:text-white`}
                    >
                      {option.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </BottomSheetComponent>
        </>
      )}
    </div>
  );
};

export const PenaltyShotmapSection = ({
  player,
  i18n,
}: {
  player: any;
  i18n: any;
}) => {
  const { statsTournament, statsSeason } = usePlayerStore();
  const [penFilter, setPenFilter] = useState<string>('all');

  const { data, isLoading, isFetching } = usePlayerSeasonPenaltyData(
    player?.id,
    statsTournament?.id,
    statsSeason?.id
  );

  if (isFetching || isLoading || !data) {
    return <></>;
  }

  const { penalties = [], scored = 0, attempts = 0 } = data || {};
  const scoredPenalties = penalties.filter((record: any) => {
    return record.outcome === 'goal';
  });

  const missedPenalties = penalties.filter((record: any) => {
    return record.outcome === 'miss';
  });

  const savedPenalties = penalties.filter((record: any) => {
    return record.outcome === 'save';
  });
  let penaltyData = penalties;
  if (penFilter === 'scored') {
    penaltyData = scoredPenalties;
  } else if (penFilter === 'missed') {
    penaltyData = missedPenalties;
  } else if (penFilter === 'saved') {
    penaltyData = savedPenalties;
  }

  return (
    <div className='space-y-4'>
      <div className='flex gap-2'>
        <TwFilterBtn
          isActive={penFilter === 'all'}
          onClick={() => setPenFilter('all')}
          disabled={penalties.length === 0}
        >
          Tất cả
        </TwFilterBtn>
        <TwFilterBtn
          isActive={penFilter === 'scored'}
          onClick={() => setPenFilter('scored')}
          disabled={scoredPenalties.length === 0}
        >
          Bàn thắng
        </TwFilterBtn>
        {/* TODO */}
        <TwFilterBtn
          isActive={penFilter === 'missed'}
          onClick={() => setPenFilter('missed')}
          disabled={missedPenalties.length === 0}
        >
          Trượt
        </TwFilterBtn>

        <TwFilterBtn
          isActive={penFilter === 'saved'}
          onClick={() => setPenFilter('saved')}
          disabled={savedPenalties.length === 0}
        >
          Cản phá
        </TwFilterBtn>
      </div>

      <PenHistoryGraphSection
        penalties={[...penaltyData]}
        i18n={i18n}
      ></PenHistoryGraphSection>

      <TwSection className='p-2'>
        <TwStatsUl className='space-y-1'>
          <TwStatsLi>
            <span>Penalty goals</span>
            <span>
              {scored}/{attempts}
            </span>
          </TwStatsLi>
          <TwStatsLi>
            <span>Penalty conversion</span>
            <span>{roundNumber((scored / (attempts || 1)) * 100, 2)}%</span>
          </TwStatsLi>
        </TwStatsUl>
      </TwSection>
    </div>
  );
};

export const PenHistoryGraphSection = ({
  penalties = [],
  i18n,
}: {
  penalties: any;
  i18n: any;
}) => {
  const [selectedPenIdx, setSelectedPenIdx] = useState<number>(0);

  useEffect(() => {
    setSelectedPenIdx(0);
  }, [penalties, setSelectedPenIdx]);

  const selectedPen = penalties.length > 0 ? penalties[selectedPenIdx] : {};
  const { event = {}, outcome, zone, x = 0, y = 0 } = selectedPen || {};
  const {
    homeTeam = {},
    awayTeam = {},
    homeScore = {},
    awayScore = {},
    winnerCode,
    startTimestamp = 0,
  } = event;

  return (
    <>
      <div className='flex'>
        {/* <SwitchLeftButton></SwitchLeftButton> */}
        <TwFilterBtn
          onClick={() => {
            if (selectedPenIdx > 0) {
              setSelectedPenIdx(selectedPenIdx - 1);
            } else {
              setSelectedPenIdx(penalties.length - 1);
            }
          }}
        >
          <HiOutlineChevronLeft className='h-5 w-5'></HiOutlineChevronLeft>
        </TwFilterBtn>
        <div className='flex flex-1 place-content-center items-center gap-4'>
          <SoccerTeam
            showName={false}
            logoUrl={`${getImage(Images.team, homeTeam?.id)}`}
            logoSize={36}
          ></SoccerTeam>
          <span className='text-2xl font-bold not-italic leading-4.5 tracking-widest text-black dark:text-white'>
            {homeScore.display} - {awayScore.display}
          </span>
          <SoccerTeam
            showName={false}
            logoUrl={`${getImage(Images.team, awayTeam?.id)}`}
            logoSize={36}
          ></SoccerTeam>
        </div>
        {/* <SwitchRightButton></SwitchRightButton> */}
        <TwFilterBtn
          onClick={() =>
            setSelectedPenIdx((selectedPenIdx + 1) % (penalties.length || 1))
          }
        >
          <HiOutlineChevronRight className='h-5 w-5'></HiOutlineChevronRight>
        </TwFilterBtn>
      </div>

      <div>{formatTimestamp(startTimestamp, 'yyyy-MM-dd')}</div>

      <div className='flex place-content-center items-center'>
        {/* <Image unoptimized={true} 
          src='/images/football/graphs/pen-shotmap.png'
          height={56}
          width={600}
          alt='stadium'
          className='rounded-md'
        ></Image> */}

        <MatchPenaltyShotMap
          penalties={[...penalties]}
          setSelectedPenIdx={setSelectedPenIdx}
        ></MatchPenaltyShotMap>
      </div>
    </>
  );
};

export const StatsCollapse = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const i18n = useTrans();
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <>
          <Disclosure.Button className='flex w-full items-center justify-between rounded-lg text-left text-sm font-medium focus:outline-none'>
            <TwStatsTitle>
              {title && i18n.competitor[title.toLocaleLowerCase() as 'summary']}
            </TwStatsTitle>
            <ChevronUpIcon
              className={`${
                open ? 'rotate-180 transform' : ''
              } h-5 w-5 dark:text-white`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className='text-sm dark:text-dark-text'>
            {children}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export const TwStatsTitle = tw.div`font-medium uppercase text-sm py-2.5 dark:text-white`;
export const TwPlayerDetailTitle = tw.div`not-italic font-medium text-sm py-2.5 leading-4.5 text-logo-blue`;

// export const PlayerImageSection = ({ player }: { player?: any }) => {
//   const sportType = 'football';

//   const { playerFollowed } = useFollowStore((state) => ({
//     playerFollowed: state.followed.players,
//   })); // get player follow from state

//   const { addPlayer, removePlayer } = useFollowStore();
//   const [isFollowedPlayer, setIsFollowedPlayer] = useState(false);
//   useEffect(() => {
//     const playerSport = playerFollowed[sportType]
//       ? playerFollowed[sportType]
//       : [];
//     const isFollowed = playerSport.some((item) => item?.id === player?.id);
//     setIsFollowedPlayer(isFollowed);
//   }, [player, playerFollowed, sportType]);
//   const changeFollow = () => {
//     const newPlayer = { id: player?.id, name: player.name, slug: player.slug };
//     if (!isFollowedPlayer) {
//       addPlayer(sportType, newPlayer);
//     } else {
//       removePlayer(sportType, newPlayer);
//     }
//   };
//   return (
//     <TwCard className='space-y-4 pb-3'>
//       <div className=' dark:text-dark-text'>
//         <CardsMbSection>
//           <Avatar
//             id={player?.id}
//             type='player'
//             width={196}
//             height={196}
//             className='inline-block'
//           />
//         </CardsMbSection>
//         <h1 className='py-3 text-center font-bold dark:text-white'>
//           {player.name}
//         </h1>
//         <div className='lg:px-2.5'>
//           <NotificationCard
//             isFollowed={isFollowedPlayer}
//             changeFollow={changeFollow}
//           />
//         </div>
//       </div>
//     </TwCard>
//   );
// };

// export const GeneralInfoSection = ({ player }: { player: Player }) => {
//   const i18n = useTrans();
//   if (!player) return null;

//   const {
//     team,
//     position,
//     jerseyNumber,
//     height,
//     preferredFoot,
//     dateOfBirthTimestamp,
//     contractUntilTimestamp = 0,
//     proposedMarketValueRaw,
//     nationality,
//   } = player;

//   const { name: teamName, slug: teamSlug, id: teamId, country } = team;
//   const nationalityID = nationality?.id;
//   const nationalityName = nationality?.name || '';
//   const { value: marketValue, currency } = proposedMarketValueRaw;

//   return (
//     <div className='flex-1 space-y-2.5'>
//       <div className=''>
//         <div className='py-2'>
//           <div className='flex items-start gap-4'>
//             <CustomLink
//               href={`/football/competitor/${teamSlug}/${teamId}`}
//               target='_parent'
//             >
//               <Avatar
//                 id={team?.id}
//                 type='team'
//                 width={48}
//                 height={48}
//                 rounded={false}
//                 isBackground={false}
//               />
//             </CustomLink>
//             <div>
//               <div className='truncate text-csm font-semibold leading-5'>
//                 {teamName}
//               </div>
//               <div className='truncate text-xs font-normal leading-4 dark:text-dark-text'>
//                 {i18n.player.contractUntil}
//                 {(contractUntilTimestamp > 0 &&
//                   `${formatTimestamp(contractUntilTimestamp, 'yyyy-MM-dd')}`) ||
//                   '- -'}
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className='flex py-2'>
//           <GeneralInfo
//             label={i18n.player.nationality}
//             subLabel={nationalityName}
//             id={nationalityID}
//             type='country'
//           />

//           <GeneralInfo
//             label={i18n.player.birthday}
//             icon={<BirthSVG className='inline-block h-5 w-5' />}
//             subLabel={`${formatTimestamp(
//               dateOfBirthTimestamp,
//               'yyyy-MM-dd'
//             )} (${getAgeFromTimestamp(dateOfBirthTimestamp)} tuổi)`}
//           />
//         </div>
//         <div className='flex py-2'>
//           <GeneralInfo
//             label={i18n.player.height}
//             icon={<HeightSVG className='inline-block h-5 w-5' />}
//             subLabel={`${height}cm`}
//           />
//           <GeneralInfo
//             label={i18n.player.preferFoot}
//             icon={<StrongFootSVG className='inline-block h-5 w-5' />}
//             subLabel={preferredFoot}
//           />
//         </div>
//         <div className='flex py-2'>
//           <GeneralInfo
//             label={i18n.player.position}
//             icon={<PositionSVG className='inline-block h-5 w-5' />}
//             subLabel={getFullPosition(position)}
//           />
//           <GeneralInfo
//             label={i18n.player.shirtNo}
//             icon={<PoloSVG className='inline-block h-5 w-5' />}
//             subLabel={jerseyNumber}
//           />
//         </div>
//       </div>
//       <TwQuickViewSection>
//         <div className='flex place-content-center items-center gap-x-4 p-2.5'>
//           <div>
//             <MarketValueSVG className='h-10 w-10' />
//           </div>
//           <div>
//             <span className='text-sm uppercase dark:text-dark-text'>
//               {i18n.player.value}
//             </span>{' '}
//             <span className='font-bold text-logo-blue'>
//               {`${formatMarketValue(marketValue)} ${currency}`}
//             </span>
//           </div>
//         </div>
//         {/* <Divider /> */}
//         <div className='flex justify-between p-2.5 text-sm'>
//           <span className='flex-[0_1_50%] text-xs dark:text-dark-text'>
//             {i18n.player.isCrease}
//           </span>
//           <div className='flex space-x-2'>
//             <button className='flex h-9 w-9 flex-col items-end justify-center rounded-md border border-light-stroke dark:border-gray-light dark:bg-dark-stroke'>
//               <ArrowUpIcon className='mx-auto w-2 text-all-blue' />
//               <CurrenyIcon className='mx-auto w-5' />
//             </button>
//             <button className='flex h-9 w-9 flex-col items-end justify-center rounded-md border border-light-stroke dark:border-gray-light dark:bg-dark-stroke'>
//               <CurrenyIcon className='mx-auto w-5' />
//               <ArrowDownIcon className='mx-auto w-2 text-light-detail-away' />
//             </button>
//           </div>
//         </div>
//       </TwQuickViewSection>
//       <PlayerCharcteristicsSection player={player} />
//     </div>
//   );
// };

export const PlayerCharcteristicsSection = ({ player }: { player: any }) => {
  const { locale } = useRouter();
  const { data, isLoading, isFetching } = usePlayerCharacteristicsData(
    player?.id
  );
  const i18n = useTrans();
  if (isLoading || isFetching || !data) {
    return <></>;
  }

  const { positive = [], positions = [], negative = [] } = data || {};

  return (
    <div className=' flex justify-between rounded-md rounded-b-2xl border-b-8 border-line-heatmap bg-dark-stadium p-4'>
      <div className='flex w-1/2 flex-col place-content-center gap-3 text-csm leading-4'>
        <div>
          <p className='text-strength'>{i18n.player.strongPoints}</p>
          {positive.length === 0 ? (
            <ul>
              <TwCharacLi>{i18n.player.NoOutstandingStrengths}</TwCharacLi>
            </ul>
          ) : (
            <ul>
              {positive.map((item: any, idx: number) => {
                return (
                  <TwCharacLi key={idx}>
                    {getCharacteristic(item.type, locale ?? 'en')}
                  </TwCharacLi>
                );
              })}
            </ul>
          )}
        </div>
        <div>
          <p className='text-csm text-weekness'>{i18n.player.weakness}</p>
          {negative.length === 0 ? (
            <ul>
              <TwCharacLi>{i18n.player.NoOutstandingStrengths}</TwCharacLi>
            </ul>
          ) : (
            <ul>
              {negative.map((item: any, idx: number) => {
                return (
                  <TwCharacLi key={idx}>
                    {getCharacteristic(item.type, locale ?? 'en')}
                  </TwCharacLi>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <div className='relative h-28 w-40 flex-1'>
        {/* <RwSVG className='absolute left-8 top-3 h-6 w-5'></RwSVG> */}
        {/* <StSVG className='absolute left-3 top-11 h-6 w-5'></StSVG> */}
        {positions.map((pos: any, idx: number) => {
          return (
            <div key={idx}>
              {pos === 'ST' && (
                <TwPos className='left-4 top-14 text-dark-loss'>ST</TwPos>
              )}
              {pos === 'RW' && (
                <TwPos className='left-8 top-6 text-dark-loss'>RW</TwPos>
              )}
              {pos === 'LW' && (
                <TwPos className='left-8 top-22 text-dark-loss'>LW</TwPos>
              )}
              {pos === 'AM' && (
                <TwPos className='left-12 top-14 text-logo-blue'>AM</TwPos>
              )}
              {pos === 'MC' && (
                <TwPos className='left-20 top-14 text-logo-blue'>MC</TwPos>
              )}
              {pos === 'DM' && (
                <TwPos className='left-28 top-14 text-logo-blue'>DM</TwPos>
              )}
              {pos === 'DC' && (
                <TwPos className=' left-32 top-14 text-dark-win'>CB</TwPos>
              )}
              {pos === 'DL' && (
                <TwPos className=' left-32 top-22 text-dark-win'>LB</TwPos>
              )}
              {pos === 'DR' && (
                <TwPos className=' left-32 top-6 text-dark-win'>RB</TwPos>
              )}
              {pos === 'GK' && (
                <TwPos className=' left-36 top-14 text-[#F2902D]'>GK</TwPos>
              )}
            </div>
          );
        })}
        {/* <TwPosition className='left-8 top-3 text-dark-loss'>RW</TwPosition>
        <TwPosition className='left-3 top-11 text-dark-loss'>ST</TwPosition>
        <TwPosition className='left-8 top-20 text-dark-loss'>LW</TwPosition> */}
        {/* <Image unoptimized={true} 
          src='/images/football/general/stadium-small.png'
          height={28}
          width={196}
          alt='stadium'
          className=' '
        ></Image> */}
      </div>
    </div>
  );
};

export const TwPos = tw.span`absolute transform -translate-y-1/2 -translate-x-1/2 h-5 w-5 text-[0.55rem] font-bold bg-white flex items-center place-content-center rounded-full leading-4 uppercase`;

export const TwCharacLi = tw.li` text-csm font-normal leading-4 text-white `;

// const GeneralInfo = ({
//   label,
//   icon,
//   subLabel,
//   id,
//   type = 'team',
// }: {
//   label: string;
//   icon?: React.ReactNode;
//   id?: string;
//   type?: keyof typeof Images;
//   subLabel: string;
// }) => {
//   return (
//     <div className=' flex-1 space-y-1'>
//       <TwDesktopView>
//         <div className=' flex items-center'>
//           {id && (
//             <div className='flex w-12 items-center justify-center'>
//               <Avatar
//                 id={id}
//                 type={type}
//                 width={16}
//                 className='text-center'
//                 height={16}
//                 isBackground={false}
//                 rounded={false}
//               />
//             </div>
//           )}
//           {icon && (
//             <div className='w-12 text-center dark:text-dark-text'>{icon}</div>
//           )}
//           <span className='border-l-2 border-logo-blue px-2 text-csm font-normal leading-5 text-logo-blue'>
//             {label}
//           </span>
//         </div>
//         <div className=' flex items-center'>
//           <span className='w-12'></span>
//           <span className='flex items-center gap-2 px-2'>
//             <span className='text-xs font-normal leading-4 dark:text-dark-text'>
//               {subLabel}
//             </span>
//           </span>
//         </div>
//       </TwDesktopView>
//       <TwMobileView>
//         <span className='text-ccsm dark:text-dark-text'>{label}</span>
//         <div className='flex items-start justify-start gap-x-2'>
//           {(icon || id) && (
//             <span className='w-6 '>
//               {icon}
//               {id && (
//                 <Avatar
//                   id={id}
//                   type={type}
//                   width={24}
//                   height={24}
//                   isBackground={type === 'player'}
//                   rounded={type === 'player'}
//                 />
//               )}
//             </span>
//           )}
//           <div>
//             <span className='text-xs font-semibold leading-4 text-all-blue'>
//               {subLabel || '-'}
//             </span>
//           </div>
//         </div>
//       </TwMobileView>
//     </div>
//   );
// };
