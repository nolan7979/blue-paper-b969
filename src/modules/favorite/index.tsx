import clsx from 'clsx';

import {
  TwDataSection,
  TwFilterTitle,
  TwQuickViewCol,
} from '@/components/modules/football/tw-components';

import {
  TwColumnWrapperMiddle,
  TwColumWrapperLeft,
} from '@/components/modules/common/tw-components/TwHome';
import React, { useEffect, useMemo, useState } from 'react';
import { FavoriteFilter } from '@/modules/favorite/components/FavoriteFilter';

import MatchFavoriteTab from '@/modules/favorite/components/MatchFavoriteTab';
import TeamFavoriteTab from '@/modules/favorite/components/TeamFavoriteTab';
import LeagueFavoriteTab from '@/modules/favorite/components/LeagueFavoriteTab';
import PlayerFavoriteTab from '@/modules/favorite/components/PlayerFavoriteTab';
import QuickViewColumnFavorite from '@/modules/favorite/components/QuickViewColumnFavorite';
import { ISelectedFavorite, useMatchStore } from '@/stores/match-store';
import useTrans from '@/hooks/useTrans';
import AddIcon from '/public/svg/add.svg';
import SearchFavoriteModal from '@/components/search-favorite/SearchFavoriteModal';
import { useFollowStore } from '@/stores/follow-store';
import { flatDataSport } from '@/utils/common-utils';
import { useSession } from 'next-auth/react';
import { useDetectDeviceClient } from '@/hooks';
import { EmptyEvent } from '@/components/common/empty';


const FavoritePageComponent = () => {
  const i18n = useTrans();
  const { isDesktop } = useDetectDeviceClient();
  const { selectedFavorite, setSelectedFavorite } = useMatchStore();
  const { followed, updateFollow } = useFollowStore();

  const { data: session = {} } = useSession();
  // useFetchFavoriteData
  // const { data: fetchDataFavorite, isLoading, refetch } = useFetchFavoriteData( session );
  // const { data: dataSubsFavorite, mutate } = useSubsFavoriteByList();

  const [open, setOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('match');
  const [favoriteMatchData, setFavoriteMatchData] = useState<any>([]);
  const [favoriteTeamData, setFavoriteTeamData] = useState<any>({});
  const [favoriteLeagueData, setFavoriteLeagueData] = useState<any>({});
  const [favoritePlayerData, setFavoritePlayerData] = useState<any>({});

  // const HandleSubmitData = (inputData:any) => {
  //   const convertData = {
  //     // sports: [] bổ sung khi api cung cấp
  //     competitions: flatDataSport(inputData.tournament).map((item:any) => {
  //       return {
  //         id: item.id,
  //         name: item.name,
  //         shortName: item.shortName || item.name,
  //         sportType: getSportType(item.sport),
  //         isFavorite: true
  //       }
  //     }),
  //     teams: flatDataSport(inputData.teams).map((item:any) => {
  //       return {
  //         id: item.id,
  //         name: item.name,
  //         shortName: item.shortName || item.name,
  //         sportType: getSportType(item.sport),
  //         isFavorite: true
  //       }
  //     }),
  //     players: flatDataSport(inputData.players).map((item:any) => {
  //       return {
  //         id: item.id,
  //         name: item.name,
  //         shortName: item.shortName || item.name,
  //         sportType: getSportType(item.sport),
  //         isFavorite: true
  //       }
  //     })
  //   }
  //   return convertData;
  // }

  // const SetDataFavoriteToServer = () => {
  //   const dataFavorite = HandleSubmitData(followed) as any
  //   if(session && Object.keys(session).length > 0) {
  //     mutate({session, dataFavorite})
  //   }
  // }

  // useEffect(() => {
  //   if(session && Object.keys(session).length > 0 && dataSubsFavorite) {
  //     refetch(session)
  //   }
  // }, [session, dataSubsFavorite]);
  
  // useEffect(() => {
  //   if(session && Object.keys(session).length > 0) {
  //     SetDataFavoriteToServer();
  //   }
  // }, [session])

  useEffect(() => {
    const matchF = followed?.match && followed?.match.length > 0 ? followed?.match : []
    const teamF = followed?.teams ? followed?.teams : {}
    const leagueF = followed?.tournament ? followed?.tournament : {}
    const playerF = followed?.players ? followed?.players : {}

    setFavoriteMatchData(matchF)
    setFavoriteTeamData(teamF)
    setFavoriteLeagueData(leagueF)
    setFavoritePlayerData(playerF)
  }, [open, followed])

  useEffect(() => {
    if(favoriteMatchData.length > 0 && selectedFavorite?.id == '' && selectedFavorite?.type == 'match') {
      const selectedData: ISelectedFavorite = {
        id: followed?.match[0]?.matchId,
        sport: followed?.match[0]?.sport,
        type: 'match',
      }
      setSelectedFavorite(selectedData)
    }
  }, [favoriteMatchData])

  // useEffect(() => {
  //   if(fetchDataFavorite) {
  //     const mapData = {
  //       ...followed,
  //       tournament: GroupBySportServerData(fetchDataFavorite?.competitions),
  //       teams: GroupBySportServerData(fetchDataFavorite?.teams),
  //       players: GroupBySportServerData(fetchDataFavorite?.players)
  //     }
  //     // console.log(mapData, fetchDataFavorite)
  //     updateFollow(mapData)
  //   }
  // }, [fetchDataFavorite])


  useEffect(() => {
    let flatData = []
    if(activeTab == 'team') {
      flatData = flatDataSport(favoriteTeamData)
    }
    if(activeTab == 'player') {
      flatData = flatDataSport(favoritePlayerData)
    }
    if(activeTab == 'league') {
      flatData = flatDataSport(favoriteLeagueData)
    }
    if(flatData.length > 0) {
      const selectedData: ISelectedFavorite = {
        id: flatData[0]?.id,
        sport: flatData[0]?.sport,
        type: activeTab,
      }
      setSelectedFavorite(selectedData)
    }
    if(activeTab == 'match' && favoriteMatchData.length > 0) {
      const selectedData: ISelectedFavorite = {
        id: favoriteMatchData[0]?.matchId,
        sport: favoriteMatchData[0]?.sport,
        type: activeTab,
      }
      setSelectedFavorite(selectedData)
    }
    if((activeTab != 'match' && flatData.length == 0) || (activeTab == 'match' && favoriteMatchData.length == 0)) {
      const selectedData: ISelectedFavorite = {
        id: '',
        sport: '',
        type: activeTab,
      }
      setSelectedFavorite(selectedData)
    }
  }, [activeTab])
  
  return (
    <TwDataSection className='layout flex transition-all duration-150 lg:flex-row pt-2'>
      {isDesktop && (
        <TwColumWrapperLeft
          className={clsx('no-scrollbar mt-0')}
        >
          <TwFilterTitle className='font-oswald'>
            {i18n.clubs.youMayBe}
          </TwFilterTitle>
          <div>
            <EmptyEvent title={i18n.common.nodata} content={''} />
          </div>
        </TwColumWrapperLeft>
      )}

      <TwColumnWrapperMiddle
        className={'lg:w-[calc(100%-209px)]'}
      >
        <div className='flex-[5] md:flex-[4] lg:col-span-1 lg:flex-[5] space-y-4 bg-white dark:bg-dark-card rounded-lg p-4 pt-0'>
          <div className='sticky top-[54px] lg:top-[62px] bg-white dark:bg-dark-card z-10'>
            <FavoriteFilter
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          <div className='pb-10'>
            {activeTab == 'match' && <div className='space-y-3'>
              <MatchFavoriteTab favoriteMatchData={favoriteMatchData} setOpen={() => setOpen(true)} />
            </div>}

            {activeTab == 'team' && <div>
              <TeamFavoriteTab favoriteTeamData={flatDataSport(favoriteTeamData)} type="competitor" setOpen={() => setOpen(true)} />  
            </div>}

            {activeTab == 'league' && <div>
              <LeagueFavoriteTab favoriteLeagueData={flatDataSport(favoriteLeagueData)} type="competition" setOpen={() => setOpen(true)} />   
            </div>}

            {activeTab == 'player' && <div>
              <PlayerFavoriteTab favoritePlayerData={flatDataSport(favoritePlayerData)} type="player" setOpen={() => setOpen(true)} />  
            </div>}
          </div>
        </div>
        {isDesktop && (
          <TwQuickViewCol className='col-span-1 !w-full'>
            <div className='h-full space-y-4'>
              <QuickViewColumnFavorite />
            </div>
          </TwQuickViewCol>
        )}
      </TwColumnWrapperMiddle>
      <SearchFavoriteModal open={open} setOpen={setOpen}></SearchFavoriteModal>
    </TwDataSection>
  );
};
export default FavoritePageComponent;

interface IAddFavorite {
  setOpen: () => void;
  type: string;
  textTitle: string;
  textDesc: string;
}

export const AddFavorite = ({setOpen, type, textTitle, textDesc}:IAddFavorite) => {
  return(
    <div className='text-center py-6'>
      <button className='w-10 h-10 rounded-full bg-add-button inline-flex items-center justify-center text-black dark:text-white mb-3' onClick={setOpen}>
        <AddIcon className="w-5 h-5" />
      </button>
      <h3 className='text-black dark:text-white text-[12px] font-bold'>{textTitle || `Add your favourite ${type}`}</h3>
      {/* <p  className='text-light-secondary text-[11px]'>{textDesc || `Events of your favourite ${type} and competitions will show up here.`}</p> */}
    </div>
  )
}


export const AddFavoriteTab = ({setOpen}:{setOpen: () => void}) => {
  const i18n = useTrans();
  return(
    <div className='bg-head-tab dark:bg-add-button-tab flex flex-col justify-center items-center rounded-md py-4 cursor-pointer' onClick={setOpen}>
      <button className='w-10 h-10 rounded-full bg-dark-text dark:bg-add-button inline-flex items-center justify-center text-black dark:text-white mb-3'>
        <AddIcon className="w-5 h-5" />
      </button>
      <h3 className='text-black dark:text-white text-[12px]'>{i18n.favorite.add}</h3>
    </div>
  )
}
