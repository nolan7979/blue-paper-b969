/* eslint-disable @next/next/no-img-element */
import { useSearchData } from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';
import { Dialog, Listbox, Transition } from '@headlessui/react';
import React, { Fragment, useMemo, useRef, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import SearchSkeleton from '@/components/common/skeleton/SearchSkeleton';
import { TwSearchInput } from '@/components/common/TwSearchInput';

import { formatTimestamp, getImage, getSlug, Images } from '@/utils';

import CaretDown from 'public/svg/caret-down.svg';
import CloseX from '/public/svg/close-x.svg';
import { TwButtonIcon } from '@/components/buttons/IconButton';
import { menusMain } from '@/components/common/header';
import { useWindowSize } from '@/hooks';
import useDebounce from '@/hooks/useDebounce';
import { encodeLinkForPro } from '@/utils/hash.id';
import tw from 'twin.macro';
import { SPORT } from '@/constant/common';
import {
  TwBorderLinearBox,
  TwSectionWrapper,
} from '@/components/modules/common';
import { EmptyEvent } from '@/components/common/empty';
import CheckIcon from '@heroicons/react/20/solid/CheckIcon';

// icon sport
import BadmintonSVG from '/public/svg/sport/badminton.svg';
import BasketballSVG from '/public/svg/sport/basketball.svg';
import FootballSVG from '/public/svg/sport/football.svg';
import BaseballSVG from '/public/svg/sport/baseball.svg';
import TennisSVG from '/public/svg/sport/tennis.svg';
import VolleyballSVG from '/public/svg/sport/volleyball.svg';
import CricketSVG from '/public/svg/sport/cricket.svg';
import TableTennisSVG from '/public/svg/sport/table-tennis.svg';
import HockeySVG from '/public/svg/sport/ice-hockey.svg';
import AMFootballSVG from '/public/svg/sport/am-football.svg';
import { useRouter } from 'next/router';

export enum SearchType {
  teams = 'team',
  players = 'player',
  tounaments = 'tournament',
  matches = 'match',
}

const SUGGESTED_SEARCH = [
  {
    type: 'team',
    entity: {
      id: `${encodeLinkForPro('l965mkyh98gr1ge')}`,
      name: 'Manchester United',
      short_name: 'Manchester United',
      logo: 'https://img.thesports.com/football/team/3d7cc3c41c8531284a6426c47ae66b91.png',
      country: {
        id: `${encodeLinkForPro('kp3glrw7hwqdyjv')}`,
        name: 'England',
        logo: 'https://img.thesports.com/football/country/916957927a5ee63e040631bd442ada34.png',
      },
      priority: true,
    },
  },
  {
    type: 'team',
    entity: {
      id: `${encodeLinkForPro('p4jwq2ghd57m0ve')}`,
      name: 'Manchester City',
      short_name: 'Manchester City',
      logo: 'https://img.thesports.com/football/team/c4a6528a2ee147b99c9885ef24385a4e.png',
      country: {
        id: `${encodeLinkForPro('kp3glrw7hwqdyjv')}`,
        name: 'England',
        logo: 'https://img.thesports.com/football/country/916957927a5ee63e040631bd442ada34.png',
      },
      priority: true,
    },
  },
  {
    type: 'team',
    entity: {
      id: `${encodeLinkForPro('e4wyrn4h111q86p')}`,
      name: 'Real Madrid',
      short_name: 'Real Madrid',
      logo: 'https://img.thesports.com/football/team/47ba2fe5caa3770cfa2e99dc4b7e72cd.png',
      country: {
        id: `${encodeLinkForPro('0gx7lm7ph0m2wdk')}`,
        name: 'Spain',
        logo: 'https://img.thesports.com/football/country/ad7318c3ee868ab198d5a21fb370393e.png',
      },
      priority: true,
    },
  },
  {
    type: 'team',
    entity: {
      id: `${encodeLinkForPro('e4wyrn4h127q86p')}`,
      name: 'FC Barcelona',
      short_name: 'FC Barcelona',
      logo: 'https://img.thesports.com/football/team/f378eb1ea04e53999b89051aa3244de6.png',
      country: {
        id: `${encodeLinkForPro('0gx7lm7ph0m2wdk')}`,
        name: 'Spain',
        logo: 'https://img.thesports.com/football/country/ad7318c3ee868ab198d5a21fb370393e.png',
      },
      priority: true,
    },
  },
  {
    type: 'team',
    entity: {
      id: `${encodeLinkForPro('yl5ergphjy2r8k0')}`,
      name: 'Bayern Munich',
      short_name: 'Bayern Munich',
      logo: 'https://img.thesports.com/football/team/4c7e35b5134ebf4d92bdf0e88519e077.png',
      country: {
        id: `${encodeLinkForPro('ngy0or5jh3qwzv3')}`,
        name: 'Germany',
        logo: 'https://img.thesports.com/football/country/ce409783958293f9246ae796a06c2bc0.png',
      },
      priority: true,
    },
  },
  {
    type: 'competition',
    entity: {
      id: `${encodeLinkForPro('z8yomo4h7wq0j6l')}`,
      name: 'UEFA Champions League',
      short_name: '',
      logo: 'https://img.thesports.com/football/team/402eea58bc73ad21c13bf41ef54eeafb.png',
      country: {
        name: '',
      },
    },
  },
  {
    type: 'competition',
    entity: {
      id: `${encodeLinkForPro('jednm9whz0ryox8')}`,
      name: 'English Premier League',
      short_name: '',
      logo: 'https://img.thesports.com/football/team/402eea58bc73ad21c13bf41ef54eeafb.png',
      country: {
        id: `${encodeLinkForPro('kp3glrw7hwqdyjv')}`,
        name: 'England',
        logo: 'https://img.thesports.com/football/country/916957927a5ee63e040631bd442ada34.png',
      },
    },
  },
];

export default function SearchModal({
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
        className='relative z-30'
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

        <div className='fixed inset-0 z-30 overflow-y-auto scrollbar'>
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
          i18n={i18n}
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
                className={`w-full min-w-[6.25rem] rounded-3xl px-4 py-2 !pb-2 capitalize ${
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
  const [recentSearchs, setRecentSearchs] = useLocalStorage<any[]>(
    'recent_search_results',
    []
  );
  const saveSelectedSearch = (selectedItem: any) => {
    const deduped = recentSearchs.filter(
      (item: any) => item?.entity?.id !== selectedItem.entity?.id
    );
    setRecentSearchs([selectedItem, ...deduped.slice(0, 10)]);
  };

  const router = useRouter();

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
        <EmptyEvent title={i18n.common.nodata} content={''} />
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
                  setOpen(false);
                  saveSelectedSearch(item);
                  router.push(href);
                }}
                className={`${
                  (item.type === 'team' && sport === SPORT.TENNIS) ||
                  (sport === SPORT.AMERICAN_FOOTBALL && item.type === 'player')
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
                test-id='search-item'
              >
                <SearchRow
                  name={name}
                  logoUrl={logoUrl}
                  logoUrl2nd={logoUrl2nd}
                  region={region}
                  regionUrl={regionUrl}
                  sportType={sportType}
                  sportTypeIcon={sportTypeIcon}
                  entityId={item?.entity?.id}
                  type={searchType}
                />
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

  const sportHasSuggestions = [SPORT.FOOTBALL].includes(sport);

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

      {sportHasSuggestions && (
        <SuggestedSearches setOpen={setOpen} type={type} />
      )}
    </>
  );
};

const SuggestedSearches = ({
  setOpen,
  type,
}: {
  setOpen: any;
  type: SearchType | null;
}) => {
  const i18n = useTrans();
  const router = useRouter();

  const { width } = useWindowSize();
  const [recentSearchs, setRecentSearchs] = useLocalStorage<any[]>(
    'recent_search_results',
    []
  );

  const saveSelectedSearch = (selectedItem: any) => {
    const deduped = recentSearchs.filter(
      (item: any) => item.entity?.id !== selectedItem.entity?.id
    );
    setRecentSearchs([selectedItem, ...deduped.slice(0, 10)]);
  };

  const data = useMemo(
    () =>
      SUGGESTED_SEARCH.filter((item) => {
        if (!type) {
          return true;
        }

        return (
          (type === 'tournament' && item.type === 'competition') ||
          item.type === type
        );
      }),
    [type]
  );

  if (!data.length) {
    return <></>;
  }

  return (
    <div className='space-y-2'>
      <div className='text-csm' test-id='search-suggested-list'>
        {i18n.titles.suggested}
      </div>
      <ul>
        {data.slice(0, 20).map((item: any, idx: number) => {
          const {
            name,
            logoUrl,
            region,
            regionUrl,
            sportType,
            sportTypeIcon,
            href,
          } = parseAttributes(item);

          return (
            <li
              key={idx}
              onClick={() => {
                setOpen(false);
                saveSelectedSearch(item);
                if (width < 1024) {
                  window.location.href = href;
                } else {
                  router.push(href);
                }
              }}
              className='flex cursor-pointer items-center'
              test-id='search'
            >
              <SearchRow
                name={name}
                logoUrl={logoUrl}
                region={region}
                regionUrl={regionUrl}
                sportType={sportType}
                sportTypeIcon={sportTypeIcon}
                entityId={item.entity?.id}
              />
            </li>
          );
        })}
      </ul>
    </div>
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
          {region && (
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
          )}
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
  const formattedSportName =
    sportName?.toLocaleLowerCase()?.replace(' ', '-') || 'football';

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
  const isSport = ['tennis', 'badminton', 'table-tennis'].includes(
    formattedSportName
  );

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
    cricket: <CricketSVG className='h-4 w-4' />,
    'am-football': <AMFootballSVG className='h-4 w-4' />,
    hockey: <HockeySVG className='h-4 w-4' />,
    'table-tennis': <TableTennisSVG className='h-4 w-4' />,
  };

  return {
    searchType: type,
    name,
    logoUrl,
    logoUrl2nd,
    region: regionName,
    regionUrl: regionLogoUrl,
    sportType:
      formattedSportName.replace('-', ' ') ||
      sport.name ||
      cateSport.name ||
      'Football',
    sportTypeIcon: sportIcons[formattedSportName.toLocaleLowerCase()] || (
      <FootballSVG className='h-4 w-4' />
    ),
    href,
  };
};

const SelectSport: React.FC<{
  size?: any;
  selectedOption?: any;
  handleChange?: any;
  i18n?: any;
}> = ({ size, selectedOption, handleChange, i18n }) => {
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
              className='absolute top-0 z-20 mt-[50px] h-auto max-h-[calc(50vh-70px)] w-max overflow-auto rounded-md bg-white py-1 text-base shadow-2xl ring-1 ring-black ring-opacity-5 no-scrollbar focus:outline-none dark:bg-dark-head-tab sm:text-sm lg:max-h-[calc(100vh-70px)]'
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
                            <span className='capitalize '>{i18n?.header?.[option.label.replace(' ', '_').replace('-', '_') as keyof typeof i18n.header] || option?.label}</span>
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
