import React, { useEffect, useState } from 'react';


import BottomSheetComponent from '@/components/modules/tennis/selects/BottomSheetComponent';
// import ArrowDownSVG from 'public/svg/arrow-down-mobile.svg';
import Avatar from '@/components/common/Avatar';
import { useSeasonData, useTopLeagues } from '@/hooks/useBasketball';

export const SelectStandingSection = (
  {
    dataInfo
  }: any
) => {


  const [showLeagueSheet, setShowLeagueSheet] = useState(false);

  const { data: topLeagues, isError } = useTopLeagues();
  const firstLeague = topLeagues && topLeagues.length > 0 ? topLeagues[0] : { id: '', name: '' }
  
  const [leagueId, getLeagueId] = useState(firstLeague || { id: '', name: '' });
  const { data: seasonData = {} as any, refetch } = useSeasonData(leagueId?.id);

  useEffect(() => {
    if(topLeagues && topLeagues.length > 0) {
      getLeagueId(topLeagues[0]);
      refetch();
    }
  }, [topLeagues])

  useEffect(() => {
    if(seasonData && seasonData?.seasons) {
      dataInfo({
        tournamentId: leagueId?.id,
        seasonId: seasonData?.seasons[0]?.id
      })
    }
  }, [leagueId, seasonData])

  return (
    <>
      <div className='lg:p-4 pt-0 flex lg:hidden justify-start gap-2'>
        <div
          className='flex cursor-pointer items-center rounded-md bg-primary-gradient px-3 gap-1 py-2 w-full'
          onClick={() => setShowLeagueSheet(true)}
        >
          <span className='font-primary text-sm font-bold text-white'>
            <Avatar
              id={leagueId?.id}
              type='competition'
              width={24}
              height={24}
              rounded={false}
              isBackground={false}
            />
          </span>
          <span className='font-primary text-sm font-bold text-white truncate max-w-32 w-full'>
            {leagueId?.name}
          </span>
        </div>

        <BottomSheetComponent
          open={showLeagueSheet}
          onClose={() => setShowLeagueSheet(false)}
        >
          <div className='flex flex-col p-4'>
            <div className='max-h-[250px] overflow-y-scroll space-y-3'>
              {topLeagues && topLeagues.map((league: any) => (
                <div
                  key={league?.id}
                  className='flex items-center justify-start gap-2'
                  onClick={() => {
                    getLeagueId(league);
                    setShowLeagueSheet(false)
                  }}
                >
                  <Avatar
                    id={league?.id}
                    type='competition'
                    width={24}
                    height={24}
                    rounded={false}
                    isBackground={false}
                    sport='basketball'
                  />
                  <span className='text-white text-left text-sm'>{league?.name}</span>
                </div>
              ))}
            </div>
          </div>
        </BottomSheetComponent>

      </div>
    </>
  );
};
