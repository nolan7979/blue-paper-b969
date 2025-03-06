import React, { useMemo } from 'react';
import { Divider } from '@/components/modules/common/tw-components/TwPlayer';
import { useTeamData } from '@/hooks/useBasketball';
import { TeamRow } from '@/modules/table-tennis/competition/components';
import { SkeletonLeftSide } from '@/components/modules/basketball/skeletons';
import { TeamDto } from '@/constant/interface';

type AllTeamProps = {
  isLoading?: boolean;
  teams: TeamDto[];
};

export const AllTeam: React.FC<AllTeamProps> = ({ isLoading, teams }) => {
  if (isLoading) {
    return <SkeletonLeftSide />;
  }

  return (
    <div>
      {Array.isArray(teams) && teams.length > 0 && teams.map((team) => {
        return (
          <React.Fragment key={team.id}>
            <Divider />
            <TeamRow team={team} />
          </React.Fragment>
        );
      })}
    </div>
  );
};
