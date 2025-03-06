import React, { useMemo } from 'react';
import { Divider } from '@/components/modules/common/tw-components/TwPlayer';
import { TeamRow } from '@/modules/volleyball/competior/components';
import { SkeletonLeftSide } from '@/components/modules/basketball/skeletons';
import { TeamDto } from '@/constant/interface';
import { useVlbListClubData } from '@/hooks/useVolleyball';

// type AllTeamProps = {
//   isLoading?: boolean;
//   teams: TeamDto[];
// };

export const AllTeam: React.FC<any> = ({ tournamentId }:any) => {
  const { data: teamData = [], isLoading: isTeamLoading } =
  useVlbListClubData(tournamentId);

  if (isTeamLoading) {
    return <SkeletonLeftSide />;
  }

  return (
    <div>
      {teamData && teamData?.clubs.map((team:any) => {
        return (
          <React.Fragment key={team?.id}>
            <Divider />
            <TeamRow team={team} />
          </React.Fragment>
        );
      })}
    </div>
  );
};
