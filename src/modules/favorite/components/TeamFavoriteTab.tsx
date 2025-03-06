import useTrans from '@/hooks/useTrans';
import { AddFavorite, AddFavoriteTab } from '@/modules/favorite';
import RowFavoriteCommon from '@/modules/favorite/components/RowFavoriteCommon';
import { ISelectedFavorite, useMatchStore } from '@/stores/match-store';
import { Images } from '@/utils';
import { useEffect } from 'react';

const TeamFavoriteTab: React.FC<{
  favoriteTeamData: any;
  type: keyof typeof Images;
  setOpen: () => void;
}> = ({ favoriteTeamData, type, setOpen }) => {
  const i18n = useTrans();
  const { selectedFavorite, setSelectedFavorite } = useMatchStore();

  const HandleCompareId = (id: string) => {
    if(selectedFavorite?.id == id) {
      if(favoriteTeamData.length > 0) {
        const selectedData: ISelectedFavorite = {
          id: favoriteTeamData[0].id,
          sport: favoriteTeamData[0].sport,
          type: 'team',
        }
        setSelectedFavorite(selectedData)
      } else {
        const selectedData: ISelectedFavorite = {
          id: '',
          sport: '',
          type: 'team',
        }
        setSelectedFavorite(selectedData)
      }
    }
  }

  useEffect(() => {
    if(favoriteTeamData.length == 0 && selectedFavorite?.id != '') {
      const selectedData: ISelectedFavorite = {
        id: '',
        sport: '',
        type: 'team',
      }
      setSelectedFavorite(selectedData)
    }
    if(favoriteTeamData.length > 0 && selectedFavorite?.id == '') {
      const selectedData: ISelectedFavorite = {
        id: favoriteTeamData[0].id,
        sport: favoriteTeamData[0].sport,
        type: 'team',
      }
      setSelectedFavorite(selectedData)
    }
  }, [favoriteTeamData])

  if(favoriteTeamData.length == 0) return <AddFavorite setOpen={setOpen} type='team' textTitle={i18n.favorite.titleTeam} textDesc='Events of your favourite teams and competitions will show up here.' />

  return (
    <div className='grid grid-cols-3 lg:grid-cols-4 gap-4'>
      {favoriteTeamData.length > 0 && favoriteTeamData.map((team:any, index:any) => (
        <RowFavoriteCommon key={team?.id} inputData={team} type={type} tab='team' getRecentId={HandleCompareId} />
      ))}
      <AddFavoriteTab setOpen={setOpen} />
    </div>
  );
};
export default TeamFavoriteTab;
