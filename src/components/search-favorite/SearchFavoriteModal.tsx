/* eslint-disable @next/next/no-img-element */
import { useSearchData } from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';
import { Dialog, Listbox, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import React, { Fragment, useMemo, useRef, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import SearchSkeleton from '@/components/common/skeleton/SearchSkeleton';
import { TwSearchInput } from '@/components/common/TwSearchInput';

import { CheckIsFollowAllCate, formatTimestamp, getImage, getSlug, Images } from '@/utils';

import CaretDown from 'public/svg/caret-down.svg';
import BadmintonSVG from '/public/svg/badminton.svg';
import BasketballSVG from '/public/svg/basketball.svg';
import CloseX from '/public/svg/close-x.svg';
import FootballSVG from '/public/svg/football.svg';
import BaseballSVG from '/public/svg/sport/baseball.svg';
import TennisSVG from '/public/svg/tennis.svg';
import VolleyballSVG from '/public/svg/volleyball.svg';
// import CricketSVG from '/public/svg/cricket.svg';
import { TwButtonIcon } from '@/components/buttons/IconButton';
import { menusMain } from '@/components/common/header';
import { useWindowSize } from '@/hooks';
import useDebounce from '@/hooks/useDebounce';
import { encodeLinkForPro } from '@/utils/hash.id';
import tw from 'twin.macro';
import AMFootballSVG from '/public/svg/sport/am-football.svg';
import { SPORT } from '@/constant/common';
import {
  TwBorderLinearBox,
  TwSectionWrapper,
} from '@/components/modules/common';
import { EmptyEvent } from '@/components/common/empty';
import CheckIcon from '@heroicons/react/20/solid/CheckIcon';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { StarBlank } from '@/components/icons';
import { useFollowStore } from '@/stores/follow-store';
import { timeStampFormat } from '@/utils/timeStamp';
import Avatar from '@/components/common/Avatar';
import { useSession } from 'next-auth/react';
import { useSubsFavoriteById } from '@/hooks/useFavorite';
import { getFavoriteType, getSportType } from '@/utils/matchFilter';

export enum SearchType {
  teams = 'team',
  players = 'player',
  tounaments = 'tournament',
  matches = 'match',
}

export default function SearchFavoriteModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
}) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto scrollbar'>
          <div className='flex min-h-full items-center justify-center p-4 text-center sm:p-0 '>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative w-full max-w-[37.5rem] transform space-y-2 overflow-hidden rounded-lg bg-light-match  p-3 text-left text-light-black shadow-xl transition-all dark:bg-dark-card dark:text-dark-text sm:my-8 md:space-y-4 md:p-4'>
                <SearchDataComponent setOpen={setOpen} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

const SearchDataComponent = ({ setOpen }: { setOpen: any }) => {
  const i18n = useTrans();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedOption, setSelected] = useState<Record<string, any>>(
    menusMain[0]
  );
  const [selectedType, setSelectedType] = useState<SearchType | null>(null);

  const handleChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleSelected = (selected: any) => {
    setSelected(selected);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setSearchTerm(`${formData.get('search')}`);
    // e.target.reset();

    e.target.focus();
  };

  return (
    <>
      <div className=' space-y-2'>
        <div className='pb-2 text-left text-base font-bold leading-5'>
          {i18n.titles.search}
        </div>
        <form
          onSubmit={handleSubmit}
          className='flex max-h-9 items-center rounded-xl border border-light-default bg-opacity-[0.4] px-2 py-1.5 text-sm leading-4'
        >
          <div className=''>
            <SearchSVG />
          </div>
          <TwSearchInput
            placeholder={i18n.titles.search_place_holder} //'Đội bóng, cầu thủ, giải đấu...'
            className='m-auto block w-full text-black dark:text-white'
            test-id='search-input'
            defaultValue=''
            value={searchTerm}
            style={{
              borderWidth: 'medium',
              outline: 'none',
              listStyle: 'outside',
            }}
            onChange={handleChange}
            name='search'
          />
          <span
            className={`m-3 hover:cursor-pointer ${
              searchTerm.length == 0 ? 'hidden' : 'block'
            }`}
            onClick={() => setSearchTerm('')}
          >
            X
          </span>
        </form>
      </div>

      <div className='flex items-center justify-start gap-2 py-2'>
        <SelectSport
          size='lg'
          selectedOption={selectedOption}
          handleChange={handleSelected}
        />
        <div className='flex flex-nowrap items-center gap-2 overflow-x-auto no-scrollbar'>
          {Object.values(SearchType).map((key: any, idx: number) => (
            <TwBorderLinearBox
              key={idx}
              className={`w-auto rounded-3xl bg-white dark:bg-dark-head-tab ${
                selectedType === key ? 'border-linear-form text-white' : ''
              }`}
              test-id='close-button'
            >
              <TwButtonIcon
                className={`w-full min-w-[4.375rem] rounded-3xl px-4 py-2 !pb-2 capitalize ${
                  selectedType === key
                    ? 'dark:bg-button-gradient bg-dark-button'
                    : ''
                }`}
                onClick={() => {
                  if (selectedType === key) {
                    setSelectedType(null);
                  } else {
                    setSelectedType(key);
                  }
                }}
              >
                {i18n.filter[key as keyof typeof i18n.filter]}
              </TwButtonIcon>
            </TwBorderLinearBox>
          ))}
        </div>
      </div>

      <FetchDataComponent
        debouncedSearchTerm={debouncedSearchTerm}
        sport={selectedOption?.id || SPORT.FOOTBALL}
        type={selectedType}
        setOpen={setOpen}
      />
    </>
  );
};

const FetchDataComponent = ({
  debouncedSearchTerm,
  setOpen,
  type,
  sport,
}: {
  debouncedSearchTerm: string;
  setOpen: any;
  sport: SPORT;
  type: SearchType | null;
}) => {
  const i18n = useTrans();
  // const [recentSearchs, setRecentSearchs] = useLocalStorage<any[]>(
  //   'recent_search_results',
  //   []
  // );
  const { data: session = {} } = useSession();
  const { mutate: mutateFavorite } = useSubsFavoriteById();
  const { followed, addMatches, removeMatches, addTeam, removeTeam, addPlayer, removePlayer, addTournament, removeTournament } = useFollowStore();

  // const saveSelectedSearch = (selectedItem: any) => {
  //   const deduped = recentSearchs.filter(
  //     (item: any) => item?.entity?.id !== selectedItem.entity?.id
  //   );
  //   setRecentSearchs([selectedItem, ...deduped.slice(0, 10)]);
  // };

  const changeFollowMatch = (row:any) => {
    const { formattedTime, formattedDate } = timeStampFormat(row?.entity?.match_time);
    if (CheckIsFollowAllCate(row, followed)) {
      removeMatches(row?.id);
    } else {
      addMatches(
        row?.entity?.id,
        formattedTime,
        formattedDate,
        row?.entity?.competition?.id,
        row?.entity?.competition.category?.name || '',
        row?.entity?.competition?.name || '',
        row?.entity?.tournament?.name || '',
        row?.sport.toLocaleLowerCase()
      );
    }
  };

  const changeFollowLeague = (row:any) => {
    const newLeague:any = { id: row?.entity?.id, name: row?.entity?.name, slug: getSlug(row?.entity?.name) };
    if (!CheckIsFollowAllCate(row, followed)) {
      addTournament(row?.sport.toLocaleLowerCase(), newLeague);
    } else {
      removeTournament(row?.sport.toLocaleLowerCase(), newLeague);
    }
  };

  const changeFollowTeam = (row:any) => {
    const newTeam:any = { id: row?.entity?.id, name: row?.entity?.name, slug: getSlug(row?.entity?.name) };
    if (!CheckIsFollowAllCate(row, followed)) {
      addTeam(row?.sport.toLocaleLowerCase(), newTeam);
    } else {
      removeTeam(row?.sport.toLocaleLowerCase(), newTeam);
    }
  };

  const changeFollowPlayer = (row:any) => {
    const newPlayer:any = { id: row?.entity?.id, name: row?.entity?.name, slug: getSlug(row?.entity?.name) };
    if (!CheckIsFollowAllCate(row, followed)) {
      addPlayer(row?.sport.toLocaleLowerCase(), newPlayer);
    } else {
      removePlayer(row?.sport.toLocaleLowerCase(), newPlayer);
    }
  };

  const HandleChangeFollow = (favItem:any) => {
    let sportCategory = '';
    if(favItem?.type == 'sport-event') {
      changeFollowMatch(favItem)
      sportCategory = 'sports';
    }
    if(favItem?.type == 'team') {
      changeFollowTeam(favItem)
      sportCategory = 'competitor';
    }
    if(favItem?.type == 'player') {
      changeFollowPlayer(favItem)
      sportCategory = 'player';
    }
    if(favItem?.type == 'competition') {
      changeFollowLeague(favItem)
      sportCategory = 'competition';
    }
    
    // if(session && Object.keys(session).length > 0) {
    //   const dataFavoriteId = {
    //     id: favItem?.entity?.id,
    //     sportType: getSportType(favItem?.sport.toLocaleLowerCase()),
    //     type: getFavoriteType(sportCategory),
    //     isFavorite: !CheckIsFollowAllCate(favItem, followed),
    //   }
    //   mutateFavorite({session, dataFavoriteId})
    // }
  }

  // const router = useRouter();

  // const { width } = useWindowSize();
  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchData(debouncedSearchTerm, sport?.replaceAll('-', '_'), type);

  if (isLoading || !data) {
    return (
      <div className='h-[50vh] overflow-scroll overflow-x-hidden scrollbar lg:h-[70vh]'>
        <SearchSkeleton />
      </div>
    ); // TODO skeletons
  }

  if (!isLoading && data.pages[0].length === 0 && debouncedSearchTerm) {
    return (
      <TwSectionWrapper className='h-[50vh] lg:h-[70vh]'>
        <EmptyEvent
          title={i18n.common.nodata}
          content={''}
        />
      </TwSectionWrapper>
    );
  }

  const hasData = data.pages[0].length > 0;
  const handleScroll = (event: any) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isAtScrollEnd =
      Math.abs(scrollHeight - (scrollTop + clientHeight)) <= 1;

    if (isAtScrollEnd) {
      if (data.pages[data.pages.length - 1].length > 0) {
        fetchNextPage({ pageParam: data.pages.length });
      }
    }
  };

  return (
    <div
      className='h-[50vh] overflow-y-scroll scrollbar lg:h-[70vh]'
      onScroll={handleScroll}
    >
      <ul className='' test-id='search-all-type-list'>
        {data.pages.flatMap((page, index) =>
          page.map((item: any, idx: number) => {
            const {
              name,
              logoUrl,
              logoUrl2nd,
              region,
              regionUrl,
              sportType,
              sportTypeIcon,
              href,
              searchType,
            } = parseAttributes(item);
            return (
              <li
                key={`${index}-${idx}`}
                onClick={() => {
                  if (
                    (item.type === 'team' && sport === SPORT.TENNIS) ||
                    (sport === SPORT.AMERICAN_FOOTBALL &&
                      item.type === 'player')
                  ) {
                    return;
                  }
                  HandleChangeFollow(item)
                  // setOpen(false);
                  // saveSelectedSearch(item);
                }}
                className={`relative ${
                  (item.type === 'team' && sport === SPORT.TENNIS) ||
                  (sport === SPORT.AMERICAN_FOOTBALL && item.type === 'player')
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
                test-id='search-item'
              >
                {searchType == 'sport-event' ? <RowMatch row={item} /> : <SearchRow
                  name={name}
                  logoUrl={logoUrl}
                  logoUrl2nd={logoUrl2nd}
                  region={region}
                  regionUrl={regionUrl}
                  sportType={sportType}
                  sportTypeIcon={sportTypeIcon}
                  entityId={item?.entity?.id}
                  type={searchType}
                />}
                <div className={`absolute right-4 z-10 text-white ${searchType == 'sport-event' ? 'top-6' : 'top-4'}`}>
                  {CheckIsFollowAllCate(item, followed) ? (
                    <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />
                  ) : (
                    <StarBlank className='inline-block h-4 w-4 cursor-pointer' />
                  )}
                </div>
              </li>
            );
          })
        )}
      </ul>

      {!hasData && (
        <SuggestedAndRecent setOpen={setOpen} type={type} sport={sport} />
      )}
      {isFetchingNextPage ? <SearchSkeleton oneLine={true} /> : <></>}
    </div>
  );
};

const RowMatch = ({row}:any) => {
  const { formattedTime, formattedDate } = timeStampFormat(row?.entity?.match_time, true);
  return(
    <div className='flex justify-between items-center p-3 pr-14 border-b border-line-default dark:border-dark-time-tennis last:border-0'>
      <div className='space-y-2'>
        <div className='gap-2 flex items-center'>
          <Avatar
            id={row?.entity?.home_team?.id}
            type='team'
            height={24}
            width={24}
            isSmall
            sport={row?.sport.toLocaleLowerCase()}
            rounded={false}
            isBackground={false}
          />
          <span className='text-csm text-black dark:text-white'>{row?.entity?.home_team?.name}</span>
        </div>
        <div className='gap-2 flex items-center'>
          <Avatar
            id={row?.entity?.away_team?.id}
            type='team'
            height={24}
            width={24}
            isSmall
            sport={row?.sport.toLocaleLowerCase()}
            rounded={false}
            isBackground={false}
          />
          <span className='text-csm text-black dark:text-white'>{row?.entity?.away_team?.name}</span>
        </div>
      </div>
      <div className='text-csm text-black dark:text-white space-y-3 text-center'>
        <div>{formattedDate}</div>
        <div>{formattedTime}</div>
      </div>
    </div>
  )
}

const SuggestedAndRecent = ({
  setOpen,
  type,
  sport,
}: {
  setOpen: any;
  type: SearchType | null;
  sport: SPORT;
}) => {
  const i18n = useTrans();
  const router = useRouter();

  const { width } = useWindowSize();

  const saveSelectedSearch = (selectedItem: any) => {
    const deduped = recentSearchs.filter(
      (item: any) => item?.entity?.id !== selectedItem?.entity?.id
    );
    setRecentSearchs([selectedItem, ...deduped.slice(0, 10)]);
  };

  const [recentSearchs, setRecentSearchs] = useLocalStorage<any[]>(
    'recent_search_results',
    []
  );

  return (
    <>
      <div className='space-y-1' test-id='search-result'>
        {recentSearchs?.length > 0 && (
          <div className='text-csm' test-id='recent-titles'>
            {i18n.titles.recent}
          </div>
        )}

        <ul test-id='search-recent-list'>
          {recentSearchs.map((item: any, idx: number) => {
            const {
              name,
              logoUrl,
              logoUrl2nd,
              region,
              regionUrl,
              sportType,
              sportTypeIcon,
              searchType,
              href,
            } = parseAttributes(item);

            return (
              <li
                key={idx}
                className='item-hover flex items-center rounded-md'
                test-id='search-item'
              >
                <div
                  onClick={() => {
                    setOpen(false);
                    saveSelectedSearch(item); // push to top of recent searchs
                    if (width < 1024) {
                      window.location.href = href;
                    } else {
                      router.push(href);
                    }
                  }}
                  className='flex flex-1 cursor-pointer items-center'
                >
                  <SearchRow
                    name={name}
                    logoUrl={logoUrl}
                    logoUrl2nd={logoUrl2nd}
                    region={region}
                    regionUrl={regionUrl}
                    sportType={sportType}
                    sportTypeIcon={sportTypeIcon}
                    isSearchResult={true}
                    entityId={item?.entity?.id}
                    type={searchType}
                  />
                </div>
                <div
                  onClick={() => {
                    const filtered = recentSearchs.filter(
                      (storageItem: any) => {
                        return (
                          `${item?.entity?.id}` !== `${storageItem?.entity?.id}`
                        );
                      }
                    );
                    setRecentSearchs(filtered);
                  }}
                  className=' flex w-1/12 cursor-pointer place-content-center items-center'
                  test-id='close-icon'
                >
                  <CloseX />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

const SearchRow = ({
  name,
  logoUrl,
  logoUrl2nd,
  region,
  regionUrl,
  sportType,
  sportTypeIcon,
  type,
}: {
  name: string;
  logoUrl: string;
  logoUrl2nd?: string;
  region?: string;
  regionUrl?: string;
  sportType?: string;
  sportTypeIcon?: React.ReactNode;
  isSearchResult?: boolean;
  entityId?: string;
  type?: string;
}) => {
  const [isError, setIsError] = useState<boolean>(false);

  const memoizedLogo = React.useMemo(() => {
    if (!logoUrl2nd) {
      return (
        <div
          className=' flex w-14 place-content-center items-center md:w-24 lg:w-1/6'
          test-id='logo-item'
        >
          <img
            src={logoUrl}
            alt='...'
            width={36}
            height={36}
            loading='lazy'
            className='size-9 rounded-full object-contain'
          />
        </div>
      );
    }

    return (
      <div
        className='relative w-14 place-content-center items-center md:w-24 lg:w-1/6'
        test-id='logo-item'
      >
        <img
          src={logoUrl}
          alt='...'
          loading='lazy'
          className='absolute left-2 size-8 rounded-full object-contain md:left-6 lg:left-5'
        />
        <img
          src={logoUrl2nd}
          alt='...'
          loading='lazy'
          className='absolute right-2 top-2 size-8 rounded-full object-contain md:right-6 lg:right-5'
        />
      </div>
    );
  }, [logoUrl, logoUrl2nd, type]);

  return (
    <div className='flex flex-1 rounded-md py-2'>
      {memoizedLogo}
      <div className=' flex-1 space-y-1 '>
        <div className='text-csm dark:text-dark-default' test-id='name-item'>
          {name}
        </div>
        <div className=' flex gap-4 text-csm text-dark-text'>
          <div
            className='flex items-center gap-1 truncate'
            test-id='sport-region'
          >
            <img
              loading='lazy'
              src={
                isError
                  ? 'https://api.sofascore.app/api/v1/team/241802/image'
                  : regionUrl
              }
              alt={region || 'England'}
              onError={() => {
                setIsError(true);
              }}
              width={18}
              height={18}
              className='inline-block object-cover'
            />
            <span>{region}</span>
          </div>
          <div className='flex items-center gap-1' test-id='sport-type'>
            <span className='h-4 w-4'>{sportTypeIcon}</span>
            <span>{sportType}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SearchSVG = () => {
  return (
    <svg
      width={24}
      height={24}
      viewBox='0 0 24 24'
      fill='currentColor'
      className='flex-shrink-0 align-top text-light-default dark:text-white'
    >
      <path
        fill='currentColor'
        d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'
        style={{ flexShrink: 0, listStyle: 'outside' }}
        className='flex-shrink-0'
      />
    </svg>
  );
};

const parseAttributes = (searchItem: any) => {
  const { type, entity = {}, sport: sportName = '' } = searchItem || {};
  const { country = {}, team = {}, sport = {}, category = {} } = entity || {};
  const { sport: cateSport = {} } = category || {};
  const formattedSportName = sportName?.toLocaleLowerCase() || 'football';

  let logoUrl = getImage(type, entity?.id, true, formattedSportName);
  let logoUrl2nd = '';
  let regionName = country.name;
  let name = entity.name;
  let regionLogoUrl = getImage(
    Images.country,
    country?.id,
    true,
    formattedSportName
  );
  const isSport = ['tennis', 'badminton'].includes(formattedSportName);

  let href = '';
  if (type === 'team') {
    href = `/${formattedSportName}/${
      !isSport ? 'competitor' : 'player'
    }/${getSlug(entity?.short_name || entity?.name || 'slug')}/${entity?.id}`;
  } else if (type === 'player') {
    regionName = team.name;
    regionLogoUrl = getImage(Images.team, team?.id, true, formattedSportName);
    href = `/${formattedSportName}/player/${getSlug(
      entity?.short_name || entity?.name || 'slug'
    )}/${entity?.id}`;
  } else if (type === 'manager') {
    href = `/${formattedSportName}/manager/${getSlug(
      entity?.short_name || entity?.name || 'slug'
    )}/${entity?.id}`;
  } else if (type === 'referee') {
    href = `/${formattedSportName}/referee/${getSlug(
      entity?.short_name || entity?.name || 'slug'
    )}/${entity?.id}`;
  } else if (type === 'competition') {
    href = `/${formattedSportName}/competition/${getSlug(
      entity?.short_name || entity?.name || 'slug'
    )}/${entity?.id}`;
  } else if (type === 'sport-event') {
    href = `/${formattedSportName}/match/${entity?.slug}/${entity?.id}`;
    const {
      home_team = {},
      away_team = {},
      homeScore = {},
      awayScore = {},
      tournament = {},
      competition = {},
    } = entity || {};

    const { uniqueTournament = {} } = tournament;

    // const score =
    //   homeScore.display && awayScore.display
    //     ? `(${homeScore.display} - ${awayScore.display})`
    //     : '';

    logoUrl = getImage(Images.team, home_team?.id, true, formattedSportName);
    logoUrl2nd = getImage(Images.team, away_team?.id, true, formattedSportName);
    regionName = formatTimestamp(entity.match_time, 'dd/MM/yyyy HH:mm');
    regionLogoUrl = competition?.id
      ? getImage(Images.competition, competition?.id, true, formattedSportName)
      : `${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/unique-tournament/${uniqueTournament?.id}/image`;
  }

  const sportIcons: { [key: string]: any } = {
    football: <FootballSVG className='h-4 w-4' />,
    basketball: <BasketballSVG className='h-4 w-4' />,
    tennis: <TennisSVG className='h-4 w-4' />,
    volleyball: <VolleyballSVG className='h-4 w-4' />,
    badminton: <BadmintonSVG className='h-4 w-4' />,
    baseball: <BaseballSVG className='h-4 w-4' />,
    // cricket: <CricketSVG className='h-4 w-4' />,
    'am-football': <AMFootballSVG className='h-4 w-4' />,
  };

  return {
    searchType: type,
    name,
    logoUrl,
    logoUrl2nd,
    region: regionName,
    regionUrl: regionLogoUrl,
    sportType: formattedSportName || sport.name || cateSport.name || 'Football',
    sportTypeIcon: sportIcons[formattedSportName] || (
      <FootballSVG className='h-4 w-4' />
    ),
    href,
  };
};

const SelectSport: React.FC<{
  size?: any;
  selectedOption?: any;
  handleChange?: any;
}> = ({ size, selectedOption, handleChange }) => {
  const SportIcon = selectedOption?.icon;
  return (
    <div className='rounded-full bg-white px-1.5 py-2 dark:bg-dark-head-tab'>
      <Listbox value={selectedOption} onChange={handleChange}>
        <div className='relative flex h-full items-center'>
          <Listbox.Button className='dev relative cursor-pointer rounded-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 '>
            <span>
              {selectedOption && (
                <div className='flex items-center gap-x-1 rounded-lg bg-transparent px-3 dark:bg-dark-head-tab'>
                  {selectedOption.icon && (
                    <SportIcon className='h-5 w-5 text-black dark:text-white' />
                  )}
                  <CaretDown />
                </div>
              )}
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options
              className='absolute top-0 z-20 mt-[50px] h-auto w-max overflow-auto rounded-md bg-white py-1 text-base shadow-2xl ring-1 ring-black ring-opacity-5 no-scrollbar focus:outline-none dark:bg-dark-head-tab sm:text-sm lg:max-h-[calc(100vh-70px)]'
              css={[
                size === 'sm' && tw`w-44`,
                size === 'md' && tw`w-48`,
                size === 'lg' && tw`w-64`,
                size === 'xl' && tw`w-80`,
                size === 'full' && tw`w-full`,
                size === 'max' && tw`w-max`,
              ]}
            >
              {menusMain.map((option: any, idx: number) => (
                <Listbox.Option
                  key={option?.id || idx}
                  className={({ active }) =>
                    `relative min-w-16 cursor-pointer select-none px-4 py-2 ${
                      active
                        ? ' text-logo-blue'
                        : 'text-gray-900 dark:text-white'
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => {
                    if (selected === false) {
                      if (option?.id === selectedOption?.id) {
                        selected = true;
                      }
                    }
                    return (
                      <>
                        <span
                          className={`block truncate  ${
                            selected
                              ? 'font-medium text-logo-blue'
                              : 'font-normal text-black dark:text-white'
                          }`}
                        >
                          <div className='flex items-center gap-2'>
                            <option.icon className='h-5 w-5' />
                            <span className='capitalize '>{option?.label}</span>
                          </div>
                        </span>
                        {/* {selected ? (
                          <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-logo-blue'>
                            <CheckIcon className='h-4 w-4' aria-hidden='true' />
                          </span>
                        ) : null} */}
                      </>
                    );
                  }}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
