import { SPORT } from '@/constant/common';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import useDeviceOrientation from '@/hooks/useDeviceOrientation';
import { useDetectDeviceClient } from '@/hooks';
import BottomSheetComponent from '@/components/modules/tennis/selects/BottomSheetComponent';
import { useSeasonCommonData, useTopLeagues } from '@/hooks/useCommon';
import useTrans from '@/hooks/useTrans';
import Avatar from '@/components/common/Avatar';
import ArrowDownIcon from '/public/svg/arrow-down-line.svg';
import dynamic from 'next/dynamic';
import StandingStableCommon from '@/modules/standings/table-standing/StandingStableCommon';
import { getSlug } from '@/utils';
import { EmptyEvent } from '@/components/common/empty/EmptyEvent';

const StandingStableBkb = dynamic(
  () =>
    import('@/components/modules/basketball/competition').then(
      (mod) => mod.StandingStable
    ),
  { ssr: false }
);

const StandingPageComponent: React.FC<{
  sport: SPORT;
}> = ({ sport }) => {
  const router = useRouter();
  const { query } = router;
  const i18n = useTrans();
  const getFilter: any = query?.qFilter || 'all';

  const isSportNoStandings = [SPORT.TENNIS, SPORT.BADMINTON].includes(sport);

  const [selectedLeague, setSelectedLeague] = useState<any>(null);
  const [selectedSeason, setSelectedSeason] = useState<any>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const { data: topLeagues, refetch: refetchLeague } = useTopLeagues(sport);
  const { data: seasonData, refetch } = useSeasonCommonData(sport, selectedLeague?.id || topLeagues?.[0]?.id || '');

  useEffect(() => {
    refetchLeague()
  }, [sport]);

  useEffect(() => {
    if (!selectedLeague && topLeagues && topLeagues.length > 0) {
      setSelectedLeague(topLeagues[0]);
    }
    refetch();
  }, [topLeagues, selectedLeague]);

  useEffect(() => {
    if (seasonData && seasonData?.seasons && seasonData?.seasons?.length > 0) {
      setSelectedSeason(seasonData?.seasons[0]);
    }
  }, [seasonData]);

  if (topLeagues && isSportNoStandings) return (
    <div className='space-y-2 px-4 py-3'>
      {topLeagues && topLeagues.length > 0 && topLeagues.map((league: any) => (
        <div
          key={league.id}
          className='flex cursor-pointer items-center gap-2 bg-white dark:bg-primary-gradient p-2 rounded-md'
          onClick={() => router.push(`/${sport}/competition/${getSlug(league?.name)}/${league.id}`)}
        >
          <Avatar
            id={league?.id}
            type='competition'
            width={24}
            height={24}
            rounded={false}
            isBackground={false}
          />
          <span className='font-primary text-sm text-black dark:text-white'>
            {league?.name}
          </span>
        </div>
      ))}
    </div>
  )

  return (
    <div className='relative overflow-scroll h-[50vh] top-0'>
      {/* select league */}
      <div className='sticky top-0 z-10 bg-dark-main'>
        <div
          className='flex cursor-pointer items-center justify-between bg-white dark:bg-primary-gradient p-2'
          onClick={() => setShowBottomSheet(true)}
        >
          <div className='flex items-center gap-2'>
            {selectedLeague && (
              <Avatar
                id={selectedLeague?.id || ''}
                type='competition'
                width={24}
                height={24}
                rounded={false}
                isBackground={false}
              />
            )}
            <span className='font-primary text-sm font-bold text-black dark:text-white'>
              {selectedLeague?.name}
            </span>
          </div>
          <ArrowDownIcon />
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
              {topLeagues && topLeagues.length > 0 && topLeagues.map((option: any) => (
                <div
                  key={option.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-md p-3 text-left ${option.id === selectedLeague?.id
                      ? 'bg-head-tab dark:bg-[#333]'
                      : ''
                    }`}
                  onClick={() => {
                    setSelectedLeague(option);
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
                    className={`${option.id === selectedLeague?.id
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
      </div>

      {/* <StandingStableCommon uniqueTournament={selectedLeague} selectedSeason={selectedSeason} sport={sport} /> */}
      {seasonData && seasonData?.seasons && seasonData?.seasons?.length == 0 ? <EmptyEvent title={i18n.common.nodata} content='' /> : <div className='p-2 lg:p-4'>
        <StandingStableBkb
          uniqueTournament={selectedLeague}
          selectedSeason={selectedSeason}
          isTabStandings
        />
      </div>}
    </div>
  );
};
export default StandingPageComponent;
