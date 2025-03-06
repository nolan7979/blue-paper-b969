import { useState } from 'react';

import useTrans from '@/hooks/useTrans';

import { H2HFilter } from '@/components/modules/table-tennis/quickviewColumn/quickviewMatchsTab';
import { TeamH2HEachTeamEvents } from '@/components/modules/table-tennis/teams';
import { SportEventDtoWithStat } from '@/constant/interface';
import { isValEmpty } from '@/utils';

// const TennisTeamH2HEachTeamEvents = dynamic(() =>
//   import('@/components/modules/tennis').then((mod) => mod.TeamH2HEachTeamEvents)
// );

export const MatchesSection = ({
  matchData,
  type2nd,
  isDetail,
}: {
  matchData: SportEventDtoWithStat;
  type2nd?: boolean;
  isDetail?: boolean;
}) => {
  const i18n = useTrans();
  const [h2HFilter, setH2HFilter] = useState<string>('home');
  if (isValEmpty(matchData)) return <>{i18n.common.nodata}</>;

  return (
    <div
      className='space-y-4 bg-light px-2.5 pb-5 dark:bg-transparent lg:bg-transparent lg:px-0'
      test-id='tab-recent-poise'
    >
      <H2HFilter
        h2HFilter={h2HFilter}
        setH2HFilter={setH2HFilter}
        matchData={matchData}
        i18n={i18n}
      />
      {h2HFilter === 'home' && (
        <TeamH2HEachTeamEvents
          h2HFilter={h2HFilter}
          matchData={matchData}
          i18n={i18n}
          isDetail={isDetail}
        />
      )}
      {h2HFilter === 'away' && (
        <TeamH2HEachTeamEvents
          h2HFilter={h2HFilter}
          matchData={matchData}
          i18n={i18n}
          isDetail={isDetail}
        />
      )}
    </div>
  );
};
