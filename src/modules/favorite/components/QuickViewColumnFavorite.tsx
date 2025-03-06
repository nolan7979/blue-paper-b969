import QuickViewSummaryCommon from '@/modules/favorite/components/QuickViewSummaryCommon';
import QuickViewSummaryLeague from '@/modules/favorite/components/QuickViewSummaryLeague';
import QuickViewSummaryPlayer from '@/modules/favorite/components/QuickViewSummaryPlayer';
import QuickViewSummaryTeam from '@/modules/favorite/components/QuickViewSummaryTeam';
import { useMatchStore } from '@/stores/match-store';

const QuickViewColumnFavorite = () => {
  const { selectedFavorite } = useMatchStore();
  if(!selectedFavorite) return <></>
  return (
    <>
      {selectedFavorite?.type == 'match' && <QuickViewSummaryCommon />}
      {selectedFavorite?.type == 'team' && <QuickViewSummaryTeam />}
      {selectedFavorite?.type == 'league' && <QuickViewSummaryLeague />}
      {selectedFavorite?.type == 'player' && <QuickViewSummaryPlayer />}
    </>
  );
};
export default QuickViewColumnFavorite;
