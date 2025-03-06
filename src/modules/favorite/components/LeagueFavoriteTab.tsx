import useTrans from '@/hooks/useTrans';
import { AddFavorite, AddFavoriteTab } from '@/modules/favorite';
import RowFavoriteCommon from '@/modules/favorite/components/RowFavoriteCommon';
import { ISelectedFavorite, useMatchStore } from '@/stores/match-store';
import { Images } from '@/utils';
import { useEffect } from 'react';

const LeagueFavoriteTab: React.FC<{
  favoriteLeagueData: any;
  type: keyof typeof Images;
  setOpen: () => void;
}> = ({ favoriteLeagueData, type, setOpen }) => {
  const i18n = useTrans();
  const { selectedFavorite, setSelectedFavorite } = useMatchStore();

  const HandleCompareId = (id: string) => {
    if(selectedFavorite?.id == id) {
      if(favoriteLeagueData.length > 0) {
        const selectedData: ISelectedFavorite = {
          id: favoriteLeagueData[0].id,
          sport: favoriteLeagueData[0].sport,
          type: 'league',
        }
        setSelectedFavorite(selectedData)
      } else {
        const selectedData: ISelectedFavorite = {
          id: '',
          sport: '',
          type: 'league',
        }
        setSelectedFavorite(selectedData)
      }
    }
  }

  useEffect(() => {
    if(favoriteLeagueData.length == 0 && selectedFavorite?.id != '') {
      const selectedData: ISelectedFavorite = {
        id: '',
        sport: '',
        type: 'league',
      }
      setSelectedFavorite(selectedData)
    }
    if(favoriteLeagueData.length > 0 && selectedFavorite?.id == '') {
      const selectedData: ISelectedFavorite = {
        id: favoriteLeagueData[0].id,
        sport: favoriteLeagueData[0].sport,
        type: 'league',
      }
      setSelectedFavorite(selectedData)
    }
  }, [favoriteLeagueData])

  if(favoriteLeagueData.length == 0) return <AddFavorite setOpen={setOpen} type='league' textTitle={i18n.favorite.titleLeague} textDesc='Events of your favourite teams and competitions will show up here.' />

  return (
    <div className='grid grid-cols-3 lg:grid-cols-4 gap-4'>
      {favoriteLeagueData.length > 0 && favoriteLeagueData.map((team:any, index:any) => (
        <RowFavoriteCommon key={team?.id} inputData={team} type={type} tab='league' getRecentId={HandleCompareId} />
      ))}
      <AddFavoriteTab setOpen={setOpen} />
    </div>
  );
};
export default LeagueFavoriteTab;
