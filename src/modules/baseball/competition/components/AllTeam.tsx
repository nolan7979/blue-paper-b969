import React, { useMemo } from 'react';
import { Divider } from '@/components/modules/common/tw-components/TwPlayer';
import { useTeamData } from '@/hooks/useBasketball';
import { TeamRow } from '@/modules/basketball/competition/components';
import { SkeletonLeftSide } from '@/components/modules/basketball/skeletons';
import { TeamDto } from '@/constant/interface';

type AllTeamProps = {
  isLoading?: boolean;
  teams: TeamDto[];
};

export const AllTeam: React.FC<AllTeamProps> = ({ isLoading, teams }) => {
  const teamIds = useMemo(() => teams.map((team) => team?.id || ''), [teams]);
  const { data: teamData = [], isLoading: isTeamLoading } =
    useTeamData(teamIds);

  if (isLoading && isTeamLoading) {
    return <SkeletonLeftSide />;
  }

  return (
    <div>
      {teamData.map((team) => {
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
