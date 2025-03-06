import { TwBorderLinearBox } from '@/components/modules/common';
import { SPORT } from '@/constant/common';
import Avatar from "@/components/common/Avatar";
import CustomLink from "@/components/common/CustomizeLink";
import { BellOff, BellOn, StarBlank } from '@/components/icons';
import { getSlug, Images } from '@/utils';
import CheckIconSport from '@/modules/favorite/components/CheckIconSport';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { ISelectedFavorite, useMatchStore } from '@/stores/match-store';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { useFollowStore } from '@/stores/follow-store';
import { getFavoriteType, getSportType } from '@/utils/matchFilter';
import { useSubsFavoriteById } from '@/hooks/useFavorite';
import { useSession } from 'next-auth/react';
import { get } from 'lodash';

const RowFavoriteCommon: React.FC<{
  inputData: any;
  type: keyof typeof Images;
  tab: string;
  getRecentId: (id: string) => void;
}> = ({ inputData, type, tab, getRecentId }) => {
  // console.log(favoriteTeamData)
  const { data: session = {} } = useSession();
  const { width } = useWindowSize();
  const isMobile = useMemo(() => width < 768, [width]);
  const router = useRouter();
  const { setSelectedFavorite } = useMatchStore();
  const { followed, addTeam, removeTeam, addPlayer, removePlayer, addTournament, removeTournament } = useFollowStore();
  const { data: dataSubsFavorite, mutate } = useSubsFavoriteById();

  const [isFollow, setIsFollow] = useState<boolean>(false)
  
  const handleQuickViewFavorite = () => {
    const selectedData: ISelectedFavorite = {
      id: inputData?.id,
      sport: inputData?.sport,
      type: tab,
    }
    if(isMobile) {
      router.push(`/${inputData?.sport}/${type}/${inputData?.slug || getSlug(inputData?.name)}/${inputData?.id}`);
    } else {
      setSelectedFavorite(selectedData)
    }
  }

  const CheckIsFollowAllCate = (row:any, followed:any) => {
    let isFollow = false;
    if(type == 'competitor') {
      isFollow = followed.teams[row?.sport.toLocaleLowerCase()].some((item: any) => item.id == row?.id);
    }
    if(type == 'player') {
      isFollow = followed.players[row?.sport.toLocaleLowerCase()].some((item: any) => item.id == row?.id);
    }
    if(type == 'competition') {
      isFollow = followed.tournament[row?.sport.toLocaleLowerCase()].some((item: any) => item.id == row?.id);
    }
    return isFollow;
  }

  const changeFollowLeague = (row:any) => {
    const newLeague:any = { id: row?.id, name: row?.name, slug: getSlug(row?.name) };
    if (!CheckIsFollowAllCate(row, followed)) {
      addTournament(row?.sport.toLocaleLowerCase(), newLeague);
    } else {
      removeTournament(row?.sport.toLocaleLowerCase(), newLeague);
    }
  };

  const changeFollowTeam = (row:any) => {
    const newTeam:any = { id: row?.id, name: row?.name, slug: getSlug(row?.name) };
    if (!CheckIsFollowAllCate(row, followed)) {
      addTeam(row?.sport.toLocaleLowerCase(), newTeam);
    } else {
      removeTeam(row?.sport.toLocaleLowerCase(), newTeam);
    }
  };

  const changeFollowPlayer = (row:any) => {
    const newPlayer:any = { id: row?.id, name: row?.name, slug: getSlug(row?.name) };
    if (!CheckIsFollowAllCate(row, followed)) {
      addPlayer(row?.sport.toLocaleLowerCase(), newPlayer);
    } else {
      removePlayer(row?.sport.toLocaleLowerCase(), newPlayer);
    }
  };

  const HandleChangeFollow = (favItem:any) => {
    if(type == 'competitor') {
      changeFollowTeam(favItem)
    }
    if(type == 'player') {
      changeFollowPlayer(favItem)
    }
    if(type == 'competition') {
      changeFollowLeague(favItem)
    }
    
    // if(session && Object.keys(session).length > 0) {
    //   const dataFavoriteId = {
    //     id: favItem?.id,
    //     sportType: getSportType(favItem?.sport),
    //     type: getFavoriteType(type),
    //     isFavorite: false
    //   }
    //   mutate({session, dataFavoriteId})
    // }
    
    // get id compare with recent id
    getRecentId(favItem?.id)
  }

  useEffect(() => {
    setIsFollow(CheckIsFollowAllCate(inputData, followed))
  }, [followed])

  return (
    <TwBorderLinearBox className='border dark:border-0 border-line-default dark:border-linear-box bg-white dark:bg-primary-gradient' onClick={handleQuickViewFavorite}>
      <div className='flex flex-col justify-between cursor-pointer gap-2 rounded-md  bg-white p-1.5 text-sm dark:bg-transparent lg:!border-all-blue'>
        <div className='flex justify-between text-white mb-2'>
          <CheckIconSport sport={inputData?.sport} />
          <div onClick={(e) => {
            e.stopPropagation();
            HandleChangeFollow(inputData);
          }}>
            {isFollow ? (
              <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />
            ) : (
              <StarBlank className='inline-block h-4 w-4 cursor-pointer' />
            )}
          </div>
        </div>
        <div className='flex flex-col justify-between items-center space-y-3 text-center'>
          <Avatar
            id={inputData?.id}
            type={type == 'player' && [SPORT.BADMINTON, SPORT.TABLE_TENNIS, SPORT.TENNIS].includes(inputData?.sport as any) ? 'team' : type}
            width={32}
            height={32}
            rounded={type == 'player'}
            isBackground={type == 'player'}
            sport={inputData?.sport}
          />
          <div>
            <h3 className='text-black dark:text-white text-[11px]'>{inputData?.name}</h3>
            {/* <div className='text-[11px]'><span className='text-light-primary'>2000</span> Follow</div> */}
          </div>
        </div>
      </div>
    </TwBorderLinearBox>
  );
};
export default RowFavoriteCommon;
