import React from 'react';
import { Divider } from '@/components/modules/common/tw-components/TwPlayer';
import { LeagueRow } from '@/modules/volleyball/competior/components';
import { SkeletonLeftSide } from '@/components/modules/basketball/skeletons';

export const AllLeague: React.FC<any> = ({ leagueData }:any) => {

  if (leagueData && leagueData.length == 0) {
    return <SkeletonLeftSide />;
  }

  return (
    <div>
      {leagueData && leagueData?.map((league:any) => {
        return (
          <React.Fragment key={league?.id}>
            <Divider />
            <LeagueRow league={league} />
          </React.Fragment>
        );
      })}
    </div>
  );
};
