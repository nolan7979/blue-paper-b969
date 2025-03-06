import React from 'react';
import { Divider } from '@/components/modules/common/tw-components/TwPlayer';
import { LeagueRow } from '@/modules/am-football/competior/components';
import { SkeletonLeftSide } from '@/components/modules/basketball/skeletons';

export const AllLeague: React.FC<any> = ({ leagueData, idLeague, type }:any) => {

  if (leagueData && leagueData.length == 0) {
    return <SkeletonLeftSide />;
  }

  return (
    <div>
      {leagueData && leagueData?.map((league:any) => {
        if (league?.id != idLeague) return (
          <React.Fragment key={league?.id}>
            <Divider />
            <LeagueRow league={league} type={type} />
          </React.Fragment>
        );
      })}
    </div>
  );
};
