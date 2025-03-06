import React, { use, useEffect, useMemo, useState } from 'react';

import { useCompetitionSeasonData, useFootballCategoryData, useFootballCategoryLeaguesData } from '@/hooks/useFootball';

import BottomSheetComponent from '@/components/modules/tennis/selects/BottomSheetComponent';
import ArrowDownSVG from 'public/svg/arrow-down-mobile.svg';
import GlobeHemisphereWest from 'public/svg/GlobeHemisphereWest.svg';
import Avatar from '@/components/common/Avatar';
import { useCategoriesStore } from '@/stores/categories-store';
import { useCategoryDataV2, useSortedTopLeagues } from '@/hooks/useCommon';
import useTrans from '@/hooks/useTrans';
import { ILanguageKey, hotLeaguesFootball } from '@/constant/leagues/hotLeaguesFootball';
import { SearchIcon } from '@/components/modules/common/filters/AllLeaguesRep';
import { TwSearchInput } from '@/components/common/TwSearchInput';
import { format } from 'date-fns';
import { useFilterStore } from '@/stores';
import { FILTER_COUNTRY_BY_KEY_LANG, SPORT } from '@/constant/common';
import { useRouter } from 'next/router';

export const SelectStandingSection = (
  {
    dataInfo
  }: any
) => {
  const router = useRouter();
  const { locale = 'en' } = router as { locale: keyof ILanguageKey } | any;
  const hotLeagueByLang = hotLeaguesFootball[locale] || hotLeaguesFootball['en'];
  const i18n = useTrans();
  const [showCountrySheet, setShowCountrySheet] = useState(false);
  const [showLeagueSheet, setShowLeagueSheet] = useState(false);
  const [showSeasonSheet, setShowSeasonSheet] = useState(false);
  const [countryId, getCountryId] = useState<string>('hot');
  const [leagueId, getLeagueId] = useState({ id: '', name: '' });
  const [nSeasonId, getNSeasonId] = useState({ id: '', year: '' });
  const [category, setCategory] = useState<string>('');
  const [sortLeague, setSortLeague] = useState<any>([]);
  const countryLocal: ILanguageKey = (i18n.language as ILanguageKey) ?? 'en';
  //call all category country
  // const { categories } = useCategoriesStore();
  const { dateFilter } = useFilterStore();
  
  const dateFilterString = useMemo(() => {
    //compare format date
    const dateFormat = format(dateFilter, 'yyyy-MM-dd');
    return dateFormat;
  }, [dateFilter]);

  //call all league by country
  const { data: allCates = [] } = useCategoryDataV2(SPORT.FOOTBALL, dateFilterString);
  const { data: allLeague = {}, isLoading: leagueLoading, refetch } = useFootballCategoryLeaguesData(countryId || 'nq8prta4pwtedsb');

  //call all season by league
  const {
    data: allSeasons = [],
    isLoading: isLoadingSeasons,
    isFetching: isFetchingSeasons,
    refetch: refetchSeason
  } = useCompetitionSeasonData(leagueId?.id || 'mfiws1aoh0uztg4');

  const sortedTopLeagues = useSortedTopLeagues(allLeague?.[0]?.uniqueTournaments, countryLocal);

  useEffect(() => {
    if(countryId === 'hot') {
      getLeagueId(hotLeagueByLang[0]);
      setSortLeague(hotLeagueByLang);
      refetchSeason();
    } else {
      if (allLeague && allLeague.length > 0) {
        const firstLeagueId = allLeague[0]?.uniqueTournaments[0];
        getLeagueId(firstLeagueId);
        setSortLeague(allLeague[0]?.uniqueTournaments)
        refetchSeason();
      }
    }
  }, [allLeague, locale])

  useEffect(() => {
    if (allSeasons && allSeasons.length > 0) {
      const firstSeasonId = allSeasons[0];
      getNSeasonId(firstSeasonId);
      // setDataFetchStandings((val: any) => ({ ...val, seasonId: firstSeasonId?.id }))
    }
  }, [allSeasons,countryLocal])

  useEffect(() => {
    // setDataFetchStandings((val: any) => ({ ...val, tournamentId: leagueId?.id, seasonId: nSeasonId?.id }))
    dataInfo({ tournamentId: leagueId?.id, seasonId: nSeasonId?.id })
  }, [nSeasonId, leagueId])

  // add object all to first array of allCates

  const currentCountry = useMemo(() => {
    const country = FILTER_COUNTRY_BY_KEY_LANG.find((item:any) => item.key === locale)
    return country || null;
  }, [locale]);

  return (
    <>
      <div className='lg:p-4 pt-2 flex lg:hidden justify-start gap-2 sticky top-0 p-[5px] z-10 bg-light-main dark:bg-dark-main'>
        <div
          className='flex cursor-pointer items-center justify-between rounded-md bg-white dark:bg-primary-gradient px-2 gap-1'
          onClick={() => setShowCountrySheet(true)}
        >
          <span className='font-primary text-xs dark:text-white'>
            {countryId && countryId == 'hot' ? <GlobeHemisphereWest className="w-5 h-5 text-black dark:text-white" /> : <Avatar
              id={countryId}
              type='country'
              width={24}
              height={24}
              rounded={false}
              isBackground={false}
            />}
          </span>
          <div>
            <ArrowDownSVG className="h-4 w-4" />
          </div>
        </div>

        <BottomSheetComponent
          open={showCountrySheet}
          onClose={() => setShowCountrySheet(false)}
        >
          <div className='flex flex-col'>
            <div className='pt-4'>
              <form className='flex gap-2.5 rounded-md border bg-primary-alpha-01 leading-4 text-[#8D8E92] dark:border-transparent dark:bg-[#151820] mb-4'>
                <SearchIcon />
                <TwSearchInput
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder={`${i18n.home.search}...`}
                  className='m-auto block w-full'
                  defaultValue=''
                  style={{ outline: 'none' }}
                />
              </form>
            </div>
            <div className='max-h-[370px] overflow-y-scroll space-y-3'>
              <div
                className={`flex items-center justify-start gap-2 ${
                  countryId === 'hot' ? 'bg-[#333]' : ''
                }`}
                onClick={() => {
                  getCountryId('hot');
                  setShowCountrySheet(false)
                }}
              >
                <Avatar
                  id={'hot'}
                  type='country'
                  width={24}
                  height={24}
                  rounded={false}
                  isBackground={false}
                />
                <span className='dark:text-white text-left text-sm'>{'Hot leagues'}</span>
              </div>
              {currentCountry && <div
                className={`flex items-center justify-start gap-2 ${
                  countryId === currentCountry?.id ? 'bg-[#333]' : ''
                }`}
                onClick={() => {
                  getCountryId(currentCountry?.id);
                  setShowCountrySheet(false)
                }}
              >
                <Avatar
                  id={currentCountry?.id}
                  type='country'
                  width={24}
                  height={24}
                  rounded={false}
                  isBackground={false}
                />
                <span className='dark:text-white text-left text-sm'>{currentCountry?.name}</span>
              </div>}
              {allCates && allCates.sort((a:any, b:any) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                return 0;
              }).filter((lang: any) => lang.id != currentCountry?.id).map((cate: any) => {
                if (cate.name.toLowerCase().includes(category.toLowerCase())) return (
                <div
                  key={cate?.id}
                  className={`flex items-center justify-start gap-2 ${
                    cate?.id === countryId ? 'bg-[#333]' : ''
                  }`}
                  onClick={() => {
                    getCountryId(cate?.id === 'hot' ? 'nq8prta4pwtedsb' : cate?.id);
                    setShowCountrySheet(false)
                  }}
                >
                  <Avatar
                    id={cate?.id}
                    type='country'
                    width={24}
                    height={24}
                    rounded={false}
                    isBackground={false}
                  />
                  <span className='dark:text-white text-left text-sm'>{cate?.name}</span>
                </div>
              )})}
            </div>
          </div>
        </BottomSheetComponent>

        <div
          className='flex cursor-pointer items-center justify-between rounded-md bg-white dark:bg-primary-gradient p-2 gap-1 w-full'
          onClick={() => setShowLeagueSheet(true)}
        >
          {leagueId && <Avatar
            id={leagueId?.id || 'mfiws1aoh0uztg4'}
            type='competition'
            width={20}
            height={20}
            rounded={false}
            isBackground={false}
          />}
          <span className='font-primary text-xs dark:text-white truncate max-w-28 w-full'>
            {leagueId?.name || 'N/A'}
          </span>

          <div>
            <ArrowDownSVG className="h-4 w-4" />
          </div>
        </div>

        <BottomSheetComponent
          open={showLeagueSheet}
          onClose={() => setShowLeagueSheet(false)}
        >
          <div className='flex flex-col'>
            <h3 className='mb-4 border-b border-line-default pb-2 text-center text-black dark:border-dark-stroke dark:text-white'>
              {i18n.filter.tournament}
            </h3>
            <div className='max-h-[370px] overflow-y-scroll space-y-3'>
              {sortLeague && sortLeague.length > 0 && sortLeague.map((league: any) => (
                <div
                  key={league?.id}
                  className='flex items-center justify-start gap-2'
                  onClick={() => {
                    getLeagueId(league);
                    setShowLeagueSheet(false);
                  }}
                >
                  <Avatar
                    id={league?.id}
                    type='competition'
                    width={24}
                    height={24}
                    rounded={false}
                    isBackground={false}
                  />
                  <span className='dark:text-white text-left text-sm'>{league?.name}</span>
                </div>
              ))}
            </div>
          </div>
        </BottomSheetComponent>

        <div
          className='flex cursor-pointer items-center justify-between rounded-md dark:bg-primary-gradient bg-white px-2 w-fit'
          onClick={() => setShowSeasonSheet(true)}
        >
          <span className='font-primary text-xs whitespace-nowrap dark:text-white'>
            {leagueId ? nSeasonId?.year : 'N/A'}
          </span>
          <div>
            <ArrowDownSVG className="h-4 w-4" />
          </div>
        </div>

        <BottomSheetComponent
          open={showSeasonSheet}
          onClose={() => setShowSeasonSheet(false)}
        >
          <div className='flex flex-col'>
            <h3 className='mb-4 border-b border-line-default pb-2 text-center text-black dark:border-dark-stroke dark:text-white'>
              {i18n.titles.season}
            </h3>
            <div className='max-h-[370px] overflow-y-scroll space-y-3'>
              {sortLeague && sortLeague.length > 0 && allSeasons && allSeasons.map((season: any) => (
                <div
                  key={season?.id}
                  className='text-center'
                  onClick={() => {
                    getNSeasonId(season);
                    setShowSeasonSheet(false)
                  }}
                >
                  <span className='dark:text-white text-sm'>{season?.year}</span>
                </div>
              ))}
            </div>
          </div>
        </BottomSheetComponent>
      </div>
    </>
  );
};
