import MatchFilter from '@/components/modules/football/filters/FilterMatch';
import TeamH2HEachTeamEvents from '@/components/modules/football/teams/TeamH2HEachTeamEvents';
import { isValEmpty } from '@/utils';
import { useState } from 'react';
import vi from '~/lang/vi';

const MatchesSectionEachTeam = ({
  matchData,
  i18n = vi,
  type2nd = false,
}: {
  matchData: any;
  i18n: any;
  type2nd?: boolean;
}) => {
  const [h2HFilter, setH2HFilter] = useState<string>('home');
  if (isValEmpty(matchData)) return <>{i18n.common.nodata}</>;

  return (
    <>
      <MatchFilter
        h2HFilter={h2HFilter}
        setH2HFilter={setH2HFilter}
        matchData={matchData}
      />

      {h2HFilter === 'home' && (
        <TeamH2HEachTeamEvents
          h2HFilter={h2HFilter}
          matchData={matchData}
          showQuickView={true}
          i18n={i18n}
          type2nd={type2nd}
        />
      )}
      {h2HFilter === 'away' && (
        <TeamH2HEachTeamEvents
          h2HFilter={h2HFilter}
          matchData={matchData}
          showQuickView={true}
          type2nd={type2nd}
          i18n={i18n}
        />
      )}
    </>
  );
};
export default MatchesSectionEachTeam;
