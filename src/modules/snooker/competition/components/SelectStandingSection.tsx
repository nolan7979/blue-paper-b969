import React, { use, useEffect, useMemo, useState } from 'react';

import { useCompetitionSeasonData, useFootballCategoryData, useFootballCategoryLeaguesData } from '@/hooks/useFootball';

import BottomSheetComponent from '@/components/modules/tennis/selects/BottomSheetComponent';
import ArrowDownSVG from 'public/svg/arrow-down-mobile.svg';
import GlobeHemisphereWest from 'public/svg/GlobeHemisphereWest.svg';
import Avatar from '@/components/common/Avatar';
import { useCategoriesStore } from '@/stores/categories-store';
import { useSortedTopLeagues } from '@/hooks/useCommon';
import useTrans from '@/hooks/useTrans';
import { ILanguageKey } from '@/constant/leagues/hotLeaguesFootball';
export const SelectStandingSection = (
  {
    dataInfo
  }: any
) => {

  const [dataFetchStandings, setDataFetchStandings] = useState('{tournamentId, seasonId}');
  const i18n = useTrans();
  const [showCountrySheet, setShowCountrySheet] = useState(false);
  const [showLeagueSheet, setShowLeagueSheet] = useState(false);
  const [showSeasonSheet, setShowSeasonSheet] = useState(false);
  const [countryId, getCountryId] = useState<string>('');
  const [leagueId, getLeagueId] = useState({ id: '', name: '' });
  const [nSeasonId, getNSeasonId] = useState({ id: '', year: '' });
  const countryLocal: ILanguageKey = (i18n.language as ILanguageKey) ?? 'en';
  //call all category country
  const { categories } = useCategoriesStore();

  //call all league by country
  const { data: allLeague = {}, isLoading: leagueLoading, refetch } = useFootballCategoryLeaguesData(countryId || 'nq8prta4pwtedsb');

  //call all season by league
  const {
    data: allSeasons = [],
    isLoading: isLoadingSeasons,
    isFetching: isFetchingSeasons,
    refetch: refetchSeason
  } = useCompetitionSeasonData(leagueId.id || 'mfiws1aoh0uztg4');

  const sortedTopLeagues = useSortedTopLeagues(allLeague?.[0]?.uniqueTournaments, countryLocal);

  useEffect(() => {
    if (sortedTopLeagues && sortedTopLeagues.length > 0) {
      const firstLeagueId = sortedTopLeagues[0];
      getLeagueId(firstLeagueId);
      setDataFetchStandings((val: any) => ({ ...val, tournamentId: firstLeagueId?.id }))
      refetchSeason();
    }
  }, [sortedTopLeagues])

  useEffect(() => {
    if (allSeasons && allSeasons.length > 0) {
      const firstSeasonId = allSeasons[0];
      getNSeasonId(firstSeasonId);
      setDataFetchStandings((val: any) => ({ ...val, seasonId: firstSeasonId?.id }))
    }
  }, [allSeasons,countryLocal])

  useEffect(() => {
    setDataFetchStandings((val: any) => ({ ...val, tournamentId: leagueId?.id, seasonId: nSeasonId?.id }))
    dataInfo({ tournamentId: leagueId?.id, seasonId: nSeasonId?.id })
  }, [nSeasonId, leagueId])

  // add object all to first array of allCates

  const allCatesData = useMemo(() => {
    if (categories) {
      return [{ id: 'hot', name: 'Hot leagues' }, ...categories];
    }
    return [];
  }, [categories]);

  return (
    <>
      <div className='lg:p-4 pt-0 flex lg:hidden justify-start gap-2'>
        <div
          className='flex cursor-pointer items-center justify-between rounded-md bg-white dark:bg-primary-gradient px-3 gap-1'
          onClick={() => setShowCountrySheet(true)}
        >
          <span className='font-primary text-sm font-semibold dark:text-white'>
            {countryId && countryId !== 'nq8prta4pwtedsb' && <Avatar
              id={countryId}
              type='country'
              width={24}
              height={24}
              rounded={false}
              isBackground={false}
            /> || <GlobeHemisphereWest className="w-5 h-5 dark:text-white" />}
          </span>
          <div>
            <ArrowDownSVG className="h-4 w-4" />
          </div>
        </div>

        <BottomSheetComponent
          open={showCountrySheet}
          onClose={() => setShowCountrySheet(false)}
        >
          <div className='flex flex-col p-4'>
            <div className='max-h-[250px] overflow-y-scroll space-y-3'>
              {allCatesData && allCatesData.map((cate: any) => (
                <div
                  key={cate?.id}
                  className='flex items-center justify-start gap-2'
                  // className={`cursor-pointer rounded-md p-3 ${
                  //   cate?.id === selectedSeason?.id ? 'bg-[#333]' : ''
                  // }`}
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
              ))}
            </div>
          </div>
        </BottomSheetComponent>

        <div
          className='flex cursor-pointer items-center justify-between rounded-md bg-white dark:bg-primary-gradient p-2 px-3 gap-1 w-full'
          onClick={() => setShowLeagueSheet(true)}
        >
          <Avatar
            id={leagueId?.id || 'mfiws1aoh0uztg4'}
            type='competition'
            width={20}
            height={20}
            rounded={false}
            isBackground={false}
          />
          <span className='font-primary text-sm font-semibold dark:text-white truncate max-w-32 w-full'>
            {leagueId?.name}
          </span>

          <div>
            <ArrowDownSVG className="h-4 w-4" />
          </div>
        </div>

        <BottomSheetComponent
          open={showLeagueSheet}
          onClose={() => setShowLeagueSheet(false)}
        >
          <div className='flex flex-col p-4'>
            <div className='max-h-[250px] overflow-y-scroll space-y-3'>
              {sortedTopLeagues.map((league: any) => (
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
          className='flex cursor-pointer items-center justify-between rounded-md dark:bg-primary-gradient bg-white px-3 min-w-28'
          onClick={() => setShowSeasonSheet(true)}
        >
          <span className='font-primary text-sm font-semibold dark:text-white'>
            {nSeasonId?.year}
          </span>
        </div>

        <BottomSheetComponent
          open={showSeasonSheet}
          onClose={() => setShowSeasonSheet(false)}
        >
          <div className='flex flex-col p-4'>
            {/* <h3 className='py-2 uppercase'>Season</h3> */} 
            <div className='max-h-[250px] overflow-y-scroll space-y-3'>
              {allSeasons && allSeasons.map((season: any) => (
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
