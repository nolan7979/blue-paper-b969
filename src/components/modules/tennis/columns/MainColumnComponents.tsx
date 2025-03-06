/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import Tippy from '@tippyjs/react';
import { isSameDay } from 'date-fns';
import format from 'date-fns/format';
import { vi as dateFnsVi } from 'date-fns/locale';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import CornerSVG from 'public/svg/corner.svg';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BsInfoCircleFill } from 'react-icons/bs';
import tw from 'twin.macro';

import { useConvertPath } from '@/hooks/useConvertPath';
import { useMoreMatchData } from '@/hooks/useSportData';
import useTrans from '@/hooks/useTrans';

import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import MatchSkeletonMapping from '@/components/common/skeleton/homePage/MatchSkeletonMapping';
import WeekView from '@/components/filters/WeekFilter';
import { BellOn, StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { LoadMoreMatchesBtn } from '@/components/modules/football/loaderData/LoadMoreMatchesBtn';
import { MatchRow } from '@/components/modules/football/match/MatchRow';
import { MatchRowByTime } from '@/components/modules/football/match/MatchRowByTime';
import {
  TwBellCol,
  TwMatchHeader,
  TwScoreColHeader,
  TwTeamScoreCol,
  TwTitleHeader,
} from '@/components/modules/football/tw-components';

import { useFilterStore, useMatchStore, useOddsStore } from '@/stores';
import { useFollowStore } from '@/stores/follow-store';

import { SportEventDtoWithStat, TournamentDto } from '@/constant/interface';
import {
  extractCompetitionId,
  filterDifferentDate,
  filterOlderDateAndFinished,
  getDateFromTimestamp,
  getSlug,
  isCountryName,
  isValEmpty
} from '@/utils';

import { MainMatchFilter } from '@/components/layout/MainMatchFilter';
import { SPORT } from '@/constant/common';
import vi from '~/lang/vi';
import React from 'react';
import { useSession } from 'next-auth/react';
import { useSubsFavoriteById } from '@/hooks/useFavorite';
import { getFavoriteType, getSportType } from '@/utils/matchFilter';

export const MainColHeader: React.FC<{ inputId?: string }> = ({ inputId }) => {
  const path = useConvertPath();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <div className='flex justify-between'>
        <div className='flex w-full items-center p-2.5 dark:bg-dark-score md:pb-0 lg:hidden bg-light-main'>
          <WeekView />
          {/*<CalendarFilter />*/}
          {/*<FootBallMenuMobile />*/}
        </div>

        {/* Match filters */}
        <div className='hidden w-full lg:inline-block'>
          <MainMatchFilter sport={SPORT.TENNIS} />
        </div>

        {/* Odds filter */}
        {/* only show on domain '.com' */}
        {/* <div className='flex items-center justify-center gap-x-1'>
          {isShowOdds(path) && (
            <div className='pb-3'>
              <OddsToggler inputId={inputId} />
            </div>
          )}
          <TLKSettingsPopOver />
        </div> */}
      </div>
    </>
  );
};

export const OddsToggler = ({ inputId = 'showOdds' }: { inputId?: string }) => {
  const { showOdds, setShowOdds } = useOddsStore();
  return (
    <div className='flex flex-row items-center gap-2'>
      <span className=' my-auto text-csm'>Odds</span>
      <div className='mr-1 flex flex-1 items-center md:mr-0'>
        <label className='relative inline-flex cursor-pointer items-center'>
          <input
            type='checkbox'
            className='peer sr-only'
            onChange={setShowOdds}
            checked={showOdds}
            id={inputId}
            aria-label='switch show odds'
          />
          <div className="peer-focus:ring-none peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-logo-blue peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800" />
        </label>
      </div>
    </div>
  );
};

export const MatchListHeader = () => {
  const { showOdds } = useOddsStore();
  const { t } = useTranslation();

  return (
    <TwMatchListContainer className='h-auto !px-0 text-csm dark:bg-dark-wrap-match dark:lg:bg-transparent'>
      <TwMatchHeader className=''>
        <div className='flex w-14 flex-col-reverse items-center justify-evenly md:flex-row lg:w-12'>
          {/* <TwFavoriteCol className=''></TwFavoriteCol> */}
          <TwTitleHeader>{t('football:menu.time')}</TwTitleHeader>
        </div>
        <TwTeamScoreCol className=''>
          <TwTitleHeader className=''>{t('football:menu.team')}</TwTitleHeader>

          {showOdds && (
            <>
              {/* <TwOddsColHeader className='flex dev8'>
                <OddsFilters></OddsFilters>
              </TwOddsColHeader> */}

              {/* <OddsSettingsMainCol showAll={true}></OddsSettingsMainCol> */}
            </>
          )}
        </TwTeamScoreCol>
        <div className='flex gap-1 xl:gap-2.5'>
          <TwScoreColHeader className='text-black dark:text-white'>
            FT
          </TwScoreColHeader>
          <div className='flex flex-row items-center gap-1'>
            <Tippy content={t('football:menu.corner')}>
              <span>
                <CornerSVG />
              </span>
            </Tippy>

            {/* <span>{i18n.menu.corner}</span> */}
          </div>
        </div>
        <TwBellCol className=''>
          <Tippy
            content={
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-1'>
                  <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />: {t('football:info.add_to_my_favorite')}
                </div>
                <div className='flex items-center gap-1'>
                  <BellOn />:{' '}
                  {t('football:info.follow_receive_notifications_match')}
                </div>
              </div>
            }
          >
            <span>
              <BsInfoCircleFill />
            </span>
          </Tippy>
        </TwBellCol>
        {/* <div className=''>
          <MdNoteAlt />
        </div> */}
      </TwMatchHeader>
    </TwMatchListContainer>
  );
};

export const MatchList = ({
  matches = [],
  page = 'live-score',
  odds = {},
  sport = 'football',
}: {
  matches?: any[];
  page?: string;
  odds?: any;
  sport: string;
}) => {
  const { loadMoreMatches } = useMatchStore();
  const { matchTypeFilter } = useFilterStore();
  if (isValEmpty(matches)) {
    return <></>; // TODO
  }

  let filteredMatches = [...matches];
  if (page === 'results') {
    filteredMatches = filteredMatches.filter((match: any) => {
      if (match.status?.code >= 91 || match.status?.type === 'finished') {
        return true;
      }
      return false;
    });
  }

  return (
    <>
      <TwMatchListContainer>
        <div className=' flex h-full flex-col space-y-1'>
          {filteredMatches &&
            filteredMatches?.map((match, idx) => {
              const matchOdds = odds[match?.id] || {};

              if (
                match.tournament &&
                match.tournament?.id !==
                filteredMatches[idx - 1]?.tournament?.id
              ) {
                return (
                  <div key={`m-${idx}`}>
                    <LeagueRow
                      key={`m-${idx}`}
                      match={match}
                      isLink={
                        match && match.season_id && match.season_id.length > 0
                          ? true
                          : false
                      }
                    />
                    <MatchRow
                      key={`m-${match?.id}`}
                      match={match}
                      matchOdds={matchOdds}
                    />
                  </div>
                );
              } else {
                return (
                  <MatchRow
                    key={`m-${match?.id}`}
                    match={match}
                    matchOdds={matchOdds}
                  />
                );
              }
            })}
        </div>

        {!loadMoreMatches && matchTypeFilter !== 'live' && (
          <LoadMoreMatchesBtn></LoadMoreMatchesBtn>
        )}
        {loadMoreMatches && (
          <MoreMatches page={page} sport={sport}></MoreMatches>
        )}
      </TwMatchListContainer>
    </>
  );
};

// const LoadMoreMatchesBtn = () => {
//   const i18n = useTrans();
//   const { setLoadMoreMatches } = useMatchStore();

//   return (
//     <div className='mt-2 flex place-content-center items-center text-logo-blue'>
//       <button
//         onClick={() => setLoadMoreMatches(true)}
//         className='item-hover flex items-center space-x-1 rounded-full bg-light-match p-2 px-4 dark:bg-dark-match'
//       >
//         <span className='text-sm'>{i18n.common.show_all_matches}</span>
//         <span>
//           <HiChevronDown></HiChevronDown>
//         </span>
//       </button>
//     </div>
//   );
// };

const MoreMatches = ({
  page,
  sport = 'football',
}: {
  page?: string;
  sport: string;
}) => {
  const { dateFilter, matchTypeFilter, setDateFilter } = useFilterStore();
  let dateFilterString = '';
  try {
    dateFilterString = format(dateFilter, 'yyyy-MM-dd');
  } catch (error) {
    setDateFilter(new Date());
  }

  const {
    data: matches,
    isLoading,
    isFetching,
  } = useMoreMatchData(dateFilterString, sport);

  if (isLoading || isFetching) {
    return <MatchSkeletonMapping />;
  }

  let filteredMatches: any[] = [];

  if (matchTypeFilter !== 'live') {
    filteredMatches = filterDifferentDate(matches, dateFilter);

    if (matchTypeFilter === 'finished') {
      filteredMatches = filteredMatches.filter((match: any) => {
        if (match.status?.code >= 91 || match.status?.type === 'finished') {
          return true;
        }
        return false;
      });
    } else if (matchTypeFilter === 'hot') {
      // TODO hot matches
    }
  }

  if (page === 'results') {
    filteredMatches = filteredMatches.filter((match: any) => {
      if (match.status?.code >= 91 || match.status?.type === 'finished') {
        return true;
      }
      return false;
    });
  }

  return (
    <div className=' h-full space-y-1'>
      {filteredMatches &&
        filteredMatches?.map((match: any, idx: number) => {
          if (
            match.tournament &&
            match.tournament?.id !== filteredMatches[idx - 1]?.tournament?.id
          ) {
            return (
              <div key={`mm-${match?.id}`}>
                <LeagueRow
                  match={match}
                  isLink={
                    match && match.season_id && match.season_id.length > 0
                      ? true
                      : false
                  }
                />
                <MatchRow match={match} />
              </div>
            );
          } else {
            return <MatchRow key={`mm-${match?.id}`} match={match} />;
          }
        })}
    </div>
  );
};

// TODO: use SportEvent with updated fields
const LeagueRow = ({
  match,
  isLink,
}: {
  match: SportEventDtoWithStat;
  isLink: boolean;
}) => {
  const { data: session = {} } = useSession();
  const { mutate } = useSubsFavoriteById();
  const sportType = SPORT.TENNIS;
  const { tournament } = match;
  const { category } = tournament;
  const { tournamentFollowed, addTournament, removeTournament } =
    useFollowStore((state) => ({
      tournamentFollowed: state.followed.tournament,
      addTournament: state.addTournament,
      removeTournament: state.removeTournament,
    }));

  const isTournamentFollowed = (
    tournament: TournamentDto,
    followedTournaments: any
  ) => {
    const tournamentSport = followedTournaments[sportType] || [];
    return tournamentSport.some((item: any) => item?.id === tournament?.id);
  };
  const [isFollowedTour, setIsFollowedTour] = useState(() =>
    isTournamentFollowed(tournament, tournamentFollowed)
  );

  useEffect(() => {
    setIsFollowedTour(isTournamentFollowed(tournament, tournamentFollowed));
  }, [tournament, tournamentFollowed]);

  const newTournament: any = useMemo(
    () => ({
      id: tournament?.id,
      name: tournament.name,
      slug: tournament.slug,
    }),
    [tournament]
  );

  const changeFollow = useCallback(() => {
    if (!isFollowedTour) {
      addTournament(sportType, newTournament);
    } else {
      removeTournament(sportType, newTournament);
    }
    // if(session && Object.keys(session).length > 0) {
    //   const dataFavoriteId = {
    //     id: tournament?.id,
    //     sportType: getSportType(sportType),
    //     type: getFavoriteType('competition'),
    //     isFavorite: !isFollowedTour,
    //   }
    //   mutate({session, dataFavoriteId})
    // }
  }, [isFollowedTour, addTournament, removeTournament, newTournament]);

  const buildCompetitionLink = useCallback(
    () =>
      `/competition/${tournament?.slug}/${tournament?.id?.split('_')[0] || ''}`,
    [tournament]
  );

  return (
    <div className='flex items-center gap-x-1.5' test-id='match-row'>
      <div className='flex w-12 items-center justify-end'>
        <CustomLink
          disabled={!isLink}
          href={buildCompetitionLink()}
          className='hover:text-logo-blue'
          target='_parent'
        >
          <Avatar
            id={extractCompetitionId(tournament?.id)}
            type='competition'
            height={24}
            width={24}
            rounded={false}
            isBackground={false}
            isSmall={true}
          />
        </CustomLink>
      </div>
      <div
        className='flex w-80 flex-col items-start truncate leading-normal  md:w-full md:flex-1'
        test-id='match-category'
      >
        {(category?.name && category?.id && (
          <div className='text-msm dark:text-dark-text'>
            {isCountryName(category.name) && (
              <Link
                href={`/football/country/${getSlug(category.name)}/${category?.id
                  }`}
                className='hover:text-logo-blue'
              >
                {category.name}
              </Link>
            )}
          </div>
        )) }
        <CustomLink
          href={buildCompetitionLink()}
          className='text-csm font-normal text-black hover:text-logo-blue dark:text-white'
          target='_parent'
          disabled={!isLink}
          test-id='tourname-name'
        >
          {tournament?.name}
        </CustomLink>
      </div>
      <div className='flex w-5  items-center justify-end' test-id='star-icon'>
        <div onClick={changeFollow}>
          {isFollowedTour ? (
            <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />
          ) : (
            <StarBlank className='inline-block h-4 w-4 cursor-pointer' />
          )}
        </div>
      </div>
    </div>
  );
};

export const MatchListByTime = ({
  matches,
  dateFilter,
  page = 'live-score',
  odds = {},
  sport = 'football',
}: {
  matches?: any[];
  dateFilter: any;
  page?: string;
  odds?: any;
  sport: string;
}) => {
  const { loadMoreMatches } = useMatchStore();
  const { matchTypeFilter } = useFilterStore();
  const i18n = useTrans();
  const [moreMatches, setMoreMatches] = useState<any[]>([]);

  if (!matches) {
    return <></>;
  }

  let allMatches = [...matches];
  if (matchTypeFilter !== 'live') {
    allMatches = [...matches, ...moreMatches];
  }

  let filteredMatches = [...allMatches];

  if (page === 'results') {
    filteredMatches = filteredMatches.filter((match: any) => {
      if (match.status?.code >= 91 || match.status?.type === 'finished') {
        return true;
      }
      return false;
    });
  } else {
    if (matchTypeFilter !== 'live') {
      if (matchTypeFilter === 'finished') {
        filteredMatches = filteredMatches.filter((match: any) => {
          if (match.status?.code >= 91 || match.status?.type === 'finished') {
            return true;
          }
          return false;
        });
      } else if (matchTypeFilter === 'hot') {
        // TODO hot matches
      } else {
        filteredMatches = filterOlderDateAndFinished(allMatches, dateFilter);
      }
    }
  }

  filteredMatches = filteredMatches.sort((a, b) => {
    return b.startTimestamp - a.startTimestamp;
  });

  return (
    <>
      <TwMatchListContainer className=''>
        <div className=' h-full space-y-1'>
          <div className=' dev3 space-y-1 '>
            {filteredMatches?.map((match: any, idx: number) => {
              const matchDate = getDateFromTimestamp(match?.startTimestamp);
              const prevRowDate = getDateFromTimestamp(
                filteredMatches[idx - 1]?.startTimestamp
              );

              const matchOdds = odds[match?.id] || {};

              if (idx > 0 && !isSameDay(matchDate, prevRowDate)) {
                return (
                  <div key={match?.id || idx}>
                    <div
                      key={`nd-${match?.id}`}
                      className='flex place-content-center items-center p-2 text-csm text-logo-blue'
                    >
                      {i18n === vi
                        ? format(matchDate, 'dd/MM/yyyy (eeee)', {
                          locale: dateFnsVi,
                        })
                        : format(matchDate, 'eeee, yyyy/MM/dd')}
                    </div>
                    <MatchRowByTime
                      key={match?.id || idx}
                      match={match}
                      matchOdds={matchOdds}
                    />
                  </div>
                );
              } else {
                return (
                  <MatchRowByTime
                    key={match?.id || idx}
                    match={match}
                    matchOdds={matchOdds}
                  />
                );
              }
            })}
          </div>
        </div>

        {!loadMoreMatches && matchTypeFilter !== 'live' && (
          <LoadMoreMatchesBtn></LoadMoreMatchesBtn>
        )}
        {loadMoreMatches && (
          <MoreMatchesLoader
            getMatches={setMoreMatches}
            sport={sport}
          ></MoreMatchesLoader>
        )}
      </TwMatchListContainer>
    </>
  );
};

const MoreMatchesLoader = ({
  getMatches,
  sport = 'football',
}: {
  getMatches: any;
  sport: string;
}) => {
  const { dateFilter, setDateFilter } = useFilterStore();

  let dateFilterString = '';
  try {
    dateFilterString = format(dateFilter, 'yyyy-MM-dd');
  } catch (error) {
    setDateFilter(new Date());
  }

  const {
    data: matches,
    isLoading,
    isFetching,
  } = useMoreMatchData(dateFilterString, sport);

  if (isLoading || isFetching) {
    return <MatchSkeletonMapping />;
  }

  if (!isValEmpty(matches)) {
    getMatches(matches);

    // const filteredMatches = filterOlderDate(matches, dateFilter);
    // getMatches(filteredMatches);

    // TODO filter
    // const filteredMatches = filterDifferentDate(matches, dateFilter);
    // getMatches(filteredMatches);
  }

  return <div></div>;
};

export const TwMatchListContainer = tw.div`p-2 py-0 md:px-2.5 font-primary`;

export { LeagueRow };
