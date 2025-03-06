import React, { use, useEffect, useMemo, useState } from 'react';

import { useCompetitionSeasonData, useFootballCategoryData, useFootballCategoryLeaguesData } from '@/hooks/useFootball';

import BottomSheetComponent from '@/components/modules/tennis/selects/BottomSheetComponent';
import ArrowDownSVG from 'public/svg/arrow-down-mobile.svg';
import GlobeHemisphereWest from 'public/svg/GlobeHemisphereWest.svg';
import Table from 'public/svg/Table.svg';
import Avatar from '@/components/common/Avatar';

export const SelectStandingSection = (
  {
    dataInfo
  }: any
) => {

  const [dataFetchStandings, setDataFetchStandings] = useState('{tournamentId, seasonId}');

  const [showCountrySheet, setShowCountrySheet] = useState(false);
  const [showLeagueSheet, setShowLeagueSheet] = useState(false);
  const [showSeasonSheet, setShowSeasonSheet] = useState(false);
  const [countryId, getCountryId] = useState<string>('');
  const [leagueId, getLeagueId] = useState({ id: '', name: '' });
  const [nSeasonId, getNSeasonId] = useState({ id: '', year: '' });

  //call all category country
  const { data: allCates, isLoading: categoryLoading } = useFootballCategoryData();

  //call all league by country
  const { data: allLeague = {}, isLoading: leagueLoading, refetch } = useFootballCategoryLeaguesData(countryId || 'nq8prta4pwtedsb');

  //call all season by league
  const {
    data: allSeasons = [],
    isLoading: isLoadingSeasons,
    isFetching: isFetchingSeasons,
    refetch: refetchSeason
  } = useCompetitionSeasonData(leagueId.id || 'mfiws1aoh0uztg4');

  useEffect(() => {
    if (allLeague && allLeague?.[0]?.uniqueTournaments && allLeague?.[0]?.uniqueTournaments.length > 0) {
      const firstLeagueId = allLeague?.[0]?.uniqueTournaments[0];
      getLeagueId(firstLeagueId);
      setDataFetchStandings((val: any) => ({ ...val, tournamentId: firstLeagueId?.id }))
      refetchSeason();
    }
  }, [allLeague])

  useEffect(() => {
    if (allSeasons && allSeasons.length > 0) {
      const firstSeasonId = allSeasons[0];
      getNSeasonId(firstSeasonId);
      setDataFetchStandings((val: any) => ({ ...val, seasonId: firstSeasonId?.id }))
    }
  }, [allSeasons])

  useEffect(() => {
    setDataFetchStandings((val: any) => ({ ...val, tournamentId: leagueId?.id, seasonId: nSeasonId?.id }))
    dataInfo({ tournamentId: leagueId?.id, seasonId: nSeasonId?.id })
  }, [nSeasonId, leagueId])

  // add object all to first array of allCates

  const allCatesData = useMemo(() => {
    if (allCates) {
      return [{ id: 'hot', name: 'Hot leagues' }, ...allCates];
    }
    return [];
  }, [allCates]);

  return (
    <>
      <div className='lg:p-4 pt-0 flex lg:hidden justify-start gap-2'>
        <div
          className='flex cursor-pointer items-center justify-between rounded-md bg-primary-gradient px-3 gap-1'
          onClick={() => setShowCountrySheet(true)}
        >
          <span className='font-primary text-sm font-bold text-white'>
            {countryId && countryId !== 'nq8prta4pwtedsb' && <Avatar
              id={countryId}
              type='country'
              width={24}
              height={24}
              rounded={false}
              isBackground={false}
            /> || <GlobeHemisphereWest className="w-5 h-5" />}
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
                  <span className='text-white text-left text-sm'>{cate?.name}</span>
                </div>
              ))}
            </div>
          </div>
        </BottomSheetComponent>

        <div
          className='flex cursor-pointer items-center justify-between rounded-md bg-primary-gradient p-2 px-3 gap-1 w-full'
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
          <span className='font-primary text-sm font-bold text-white truncate max-w-32 w-full'>
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
              {allLeague && allLeague?.[0]?.uniqueTournaments && allLeague?.[0]?.uniqueTournaments.map((league: any) => (
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
                  <span className='text-white text-left text-sm'>{league?.name}</span>
                </div>
              ))}
            </div>
          </div>
        </BottomSheetComponent>

        <div
          className='flex cursor-pointer items-center justify-between rounded-md bg-primary-gradient px-3 min-w-28'
          onClick={() => setShowSeasonSheet(true)}
        >
          <span className='font-primary text-sm font-bold text-white'>
            {nSeasonId?.year}
          </span>
        </div>

        <BottomSheetComponent
          open={showSeasonSheet}
          onClose={() => setShowSeasonSheet(false)}
        >
          <div className='flex flex-col p-4'>
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
                  <span className='text-white text-sm'>{season?.year}</span>
                </div>
              ))}
            </div>
          </div>
        </BottomSheetComponent>
      </div>
    </>
  );
};
