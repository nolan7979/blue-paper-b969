import React, { useMemo, useState } from 'react';

import { useSeasonStandingsData } from '@/hooks/useFootball';

import StandingSkeleton from '@/components/common/skeleton/competition/StandingSkeleton';
import {
  TwCard,
  TwDesktopView,
  TwTitle
} from '@/components/modules/football/tw-components';
import { Divider } from '@/components/modules/football/tw-components/TwPlayer';

import { useFilterStore } from '@/stores';

import { EmptyEvent } from '@/components/common/empty';
import { FilterButton } from '@/components/modules/football/competitor';
import useTrans from '@/hooks/useTrans';
import { ILeagueStandingsSectionProps } from '@/models/competition';
import { StandingTypeFilterGroup } from '@/modules/football/competition/components';
import GroupStandingsSection from '@/modules/cricket/competition/components/GroupStandingsSection';

interface ISeasonStanding {
  stage: Record<string, string>[];
  standings: Record<string, string>[];
}

export const LeagueStandingsSection = ({
  wide = false,
  tournamentId = '',
  seasonId = '',
  type = '',
  uniqueTournament = true,
  forTeam = false,
}: ILeagueStandingsSectionProps) => {
  const i18n = useTrans();
  const { bxhData, setBxhData } = useFilterStore();

  const { data, isLoading } = useSeasonStandingsData(
    tournamentId,
    seasonId,
    '',
    type || bxhData,
    uniqueTournament
  );

  if (!data || !data.standings || !data.stage) {
    return (
      <div className='flex flex-col gap-4 lg:rounded-lg bg-white dark:bg-dark-container px-4 py-3'>
        <EmptyEvent title={i18n.common.nodata} content='' />
      </div>
    );
  }

  if (isLoading) {
    return (
      <>
        <TwCard className='pointer-events-none !bg-transparent p-2.5'>
          <StandingTypeFilterGroup
            bxhData={bxhData}
            setBxhData={setBxhData}
            wide={wide}
          />
        </TwCard>
        <StandingSkeleton />
      </>
    );
  }

  const { standings: groups, stage } = data as ISeasonStanding;

  return (
    <>
      {groups && groups.length !== 0 && (
        <div className='!bg-transparent px-2.5'>
          <StandingTypeFilterGroup
            bxhData={bxhData}
            setBxhData={setBxhData}
            wide={wide}
          />
        </div>
      )}
      {stage.length > 1 ? (
        <GroupStandingWithMulStage
          groups={groups}
          stageIds={stage}
          tournamentId={tournamentId}
          seasonId={seasonId}
          uniqueTournament={uniqueTournament}
          forTeam={forTeam}
        />
      ) : (
        groups.map((groupData: any, idx: number) => {
          const isLastGroup = idx === groups.length - 1;

          return (
            <div
              className='!bg-transparent lg:p-2.5'
              key={`${groupData?.id}-${idx}`}
            >
              <TwTitle className='hidden lg:block'>
                {groupData.name.split('_')[0]}
              </TwTitle>

              <GroupStandingsSection
                key={`${groupData?.id}-${idx}`}
                stageId={groupData.stage_id}
                groupName={groupData.name}
                tournamentId={tournamentId}
                seasonId={seasonId}
                uniqueTournament={uniqueTournament}
                forTeam={forTeam}
                isLastGroup={isLastGroup}
              />
            </div>
          );
        })
      )}
    </>
  );
};

const GroupStandingWithMulStage = ({
  groups,
  stageIds,
  tournamentId,
  seasonId,
  uniqueTournament,
  forTeam,
}: {
  groups: any;
  stageIds: Record<string, string>[];
  tournamentId: string;
  seasonId: string;
  uniqueTournament: any;
  forTeam: any;
}) => {
  const [defaultValue, setDefaultValue] = useState(
    () => {
      const stageFilters = stageIds.filter(({ id, name }) => id && name);
      return stageFilters[stageFilters.length - 1]?.id
    }
  );

  const handleClick = (id: string) => {
    setDefaultValue(id);
  };
  const stageFilter = useMemo(
    () => stageIds.filter(({ id, name }) => id && name),
    [stageIds]
  );
  return (
    <div>
      <div className='flex items-center gap-x-3 p-2.5'>
        {stageFilter.map(({ id, name }) => (
          <FilterButton
            isActive={id === defaultValue}
            key={id}
            onClick={() => handleClick(id)}
            label={name}
          />
        ))}
      </div>

      {groups
        .filter((groupData: any) => groupData.stage_id === defaultValue)
        .map((groupData: any, idx: number) => {
          const isLastGroup = idx === groups.length - 1;
          return (
            <React.Fragment key={`${groupData?.id}-${idx}`}>
              <div className='space-y-4 p-2.5' key={`${groupData?.id}-${idx}`}>
                <TwDesktopView>
                  <TwTitle>{groupData.name.split('_')[0]}</TwTitle>
                </TwDesktopView>

                <GroupStandingsSection
                  stageId={groupData.stage_id}
                  groupName={groupData.name}
                  tournamentId={tournamentId}
                  seasonId={seasonId}
                  uniqueTournament={uniqueTournament}
                  forTeam={forTeam}
                  isLastGroup={isLastGroup}
                />
              </div>
              {idx < groups.length - 1 && (
                <Divider className='mt-4' height='2' />
              )}
            </React.Fragment>
          );
        })}
    </div>
  );
};
1;
