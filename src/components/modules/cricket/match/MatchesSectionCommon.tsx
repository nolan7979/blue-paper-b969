import TeamH2HCommonEvents from '@/components/modules/cricket/teams/TeamH2HCommonEvents';
import { useMatchStore, useMatchStore2nd } from '@/stores';
import { isValEmpty } from '@/utils';
import { useEffect, useState } from 'react';

interface MatchesSectionCommonProps {
  matchData: any;
  i18n: any;
  type2nd?: boolean;
}

const MatchesSectionCommon: React.FC<MatchesSectionCommonProps> = ({
  matchData,
  i18n,
  type2nd,
}) => {
  const {
    selectedMatch: selectedMatch2nd,
    setSelectedMatch: setSelectedMatch2nd,
    showSelectedMatch: showSelectedMatch2nd,
    setShowSelectedMatch: setShowSelectedMatch2nd,
  } = useMatchStore2nd();
  const {
    showSelectedMatch,
    selectedMatch,
    setShowSelectedMatch,
    setSelectedMatch,
  } = useMatchStore();
  const [showTabH2H, setShowTabH2H] = useState<boolean>(false);

  useEffect(() => {
    if (
      (!showSelectedMatch && !selectedMatch) ||
      (!showSelectedMatch2nd && !selectedMatch2nd)
    ) {
      setShowSelectedMatch2nd(true);
      setSelectedMatch2nd(matchData?.id);
      setSelectedMatch(matchData?.id);
      setShowSelectedMatch(true);
    }
  }, []);
  if (isValEmpty(matchData)) return <>{i18n.common.nodata}</>;

  return (
    <>
      {/* h2h */}
      <TeamH2HCommonEvents
        h2HFilter='h2h'
        matchData={matchData}
        showQuickView={true}
        i18n={i18n}
        type2nd={type2nd}
        setShowTabH2H={setShowTabH2H}
      />
    </>
  );
};
export default MatchesSectionCommon;
