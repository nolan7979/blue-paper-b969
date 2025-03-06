import useTrans from '@/hooks/useTrans';
import { AddFavorite, AddFavoriteTab } from '@/modules/favorite';
import RowFavoriteCommon from '@/modules/favorite/components/RowFavoriteCommon';
import { ISelectedFavorite, useMatchStore } from '@/stores/match-store';
import { Images } from '@/utils';
import { useEffect } from 'react';

const PlayerFavoriteTab: React.FC<{
  favoritePlayerData: any;
  type: keyof typeof Images;
  setOpen: () => void;
}> = ({ favoritePlayerData, type, setOpen }) => {
  const i18n = useTrans();
  const { selectedFavorite, setSelectedFavorite } = useMatchStore();

  const HandleCompareId = (id: string) => {
    if(selectedFavorite?.id == id) {
      if(favoritePlayerData.length > 0) {
        const selectedData: ISelectedFavorite = {
          id: favoritePlayerData[0].id,
          sport: favoritePlayerData[0].sport,
          type: 'player',
        }
        setSelectedFavorite(selectedData)
      } else {
        const selectedData: ISelectedFavorite = {
          id: '',
          sport: '',
          type: 'player',
        }
        setSelectedFavorite(selectedData)
      }
    }
  }

  useEffect(() => {
    if(favoritePlayerData.length == 0 && selectedFavorite?.id != '') {
      const selectedData: ISelectedFavorite = {
        id: '',
        sport: '',
        type: 'player',
      }
      setSelectedFavorite(selectedData)
    }
    if(favoritePlayerData.length > 0 && selectedFavorite?.id == '') {
      const selectedData: ISelectedFavorite = {
        id: favoritePlayerData[0].id,
        sport: favoritePlayerData[0].sport,
        type: 'player',
      }
      setSelectedFavorite(selectedData)
    }
  }, [favoritePlayerData])

  if(favoritePlayerData.length == 0) return <AddFavorite setOpen={setOpen} type='player' textTitle={i18n.favorite.titlePlayer} textDesc='Events of your favourite teams and competitions will show up here.' />

  return (
    <div className='grid grid-cols-3 lg:grid-cols-4 gap-4'>
      {favoritePlayerData.length > 0 && favoritePlayerData.map((team:any, index:any) => (
        <RowFavoriteCommon key={team?.id} inputData={team} type={type} tab='player' getRecentId={HandleCompareId} />
      ))}
      <AddFavoriteTab setOpen={setOpen} />
    </div>
  );
};
export default PlayerFavoriteTab;
