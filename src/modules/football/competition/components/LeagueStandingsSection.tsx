import React, { useEffect, useMemo, useState } from 'react';

import { useLeagueTopPlayersData, useSeasonStandingsData } from '@/hooks/useFootball';

import StandingSkeleton from '@/components/common/skeleton/competition/StandingSkeleton';
import {
  TwCard,
  TwDesktopView,
  TwTitle,
} from '@/components/modules/football/tw-components';
import { Divider } from '@/components/modules/football/tw-components/TwPlayer';

import { useFilterStore } from '@/stores';

import { EmptyEvent } from '@/components/common/empty';
import Raking from '@/components/common/skeleton/competition/Raking';
import { FilterButton } from '@/components/modules/football/competitor';
import { PlayerStats } from '@/components/modules/football/players';
import { SPORT } from '@/constant/common';
import useTrans from '@/hooks/useTrans';
import { ILeagueStandingsSectionProps } from '@/models/competition';
import { StandingTypeFilterGroup } from '@/modules/football/competition/components';
import GroupStandingsSection from '@/modules/football/competition/components/GroupStandingsSection';
import { getImage, Images, isValEmpty, roundNumber } from '@/utils';
import clsx from 'clsx';
import BoxScore from 'public/svg/box-score.svg';

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
  showRecentMatch = false,
}: ILeagueStandingsSectionProps) => {
  const i18n = useTrans();
  const { bxhData, setBxhData, showRecentMatchMobile, toggleRecentMatch, setToggleRecentMatch } = useFilterStore();

  const { data, isLoading } = useSeasonStandingsData(
    tournamentId,
    seasonId,
    '',
    type || bxhData,
    uniqueTournament
  );

  if (!data || !data.standings || !data.stage) {
    return (
      <div className='space-y-4'>
        <StandingTypeFilterGroup
          bxhData={bxhData}
          setBxhData={setBxhData}
          wide={wide}
          showRecentMatch={showRecentMatch}
        />
        {showRecentMatchMobile ? <TopPlayerSectionStanding tournamentId={tournamentId} seasonId={seasonId} i18n={i18n} /> : <EmptyEvent title={i18n.common.nodata} content='' />}
        
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
            showRecentMatch={showRecentMatch}
          />
        </TwCard>
        <StandingSkeleton />
      </>
    );
  }

  const { standings: groups, stage } = data as ISeasonStanding;
  return (
    <>
      <div className='flex items-center justify-between'>
        {groups && groups.length !== 0 && (
          <StandingTypeFilterGroup
            bxhData={bxhData}
            setBxhData={setBxhData}
            wide={wide}
            showRecentMatch={showRecentMatch}
          />
        )}

        {showRecentMatch && !showRecentMatchMobile && <button
          className={clsx(
            'flex h-full items-center justify-center rounded-full px-4 py-1.5 hover:cursor-pointer hover:brightness-110 ',
            {
              'dark:bg-button-gradient cursor-default bg-dark-button text-white border-linear-form': toggleRecentMatch,
            }
          )}
          onClick={() => setToggleRecentMatch(!toggleRecentMatch)}
        >
          <BoxScore className='h-4 w-4' />
        </button>}
      </div>
      {stage.length >= 1 ? (
        <>{
          showRecentMatchMobile ? 
          <TopPlayerSectionStanding tournamentId={tournamentId} seasonId={seasonId} i18n={i18n} /> : 
          <GroupStandingWithMulStage
            groups={groups}
            stageIds={stage}
            tournamentId={tournamentId}
            seasonId={seasonId}
            uniqueTournament={uniqueTournament}
            forTeam={forTeam}
          />
        }</>
      ) : (
        groups.map((groupData: any, idx: number) => {
          const isLastGroup = idx === groups.length - 1;

          return (
            <div key={`${groupData?.id}-${idx}`}>
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
                isStandingTabSport
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
  const [defaultValue, setDefaultValue] = useState('');

  const handleClick = (id: string) => {
    setDefaultValue(id);
  };
  const stageFilter =   useMemo(
    () => stageIds.filter(({ id, name }) => id && name),
    [stageIds]
  );
  useEffect(() => {
    const stageFilters = stageIds.filter(({ id, name }) => id && name);
    if (stageFilters.length > 0) {
      setDefaultValue(stageFilters[stageFilters.length - 1]?.id);
    }
  }, [stageIds]);
  return (
    <div>
      {stageFilter && stageFilter.length > 1 && 
        <div className='flex items-center gap-x-3 p-2.5 px-0'>
          {stageFilter.map(({ id, name }) => (
            <FilterButton
              isActive={id === defaultValue}
              key={id}
              onClick={() => handleClick(id)}
              label={name}
            />
          ))}
        </div>
      }

      {groups
        .filter((groupData: any) => groupData.stage_id === defaultValue)
        .map((groupData: any, idx: number) => {
          const isLastGroup = idx === groups.length - 1;
          return (
            <React.Fragment key={`${groupData?.id}-${idx}`}>
              <div className='space-y-4' key={`${groupData?.id}-${idx}`}>
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

const TopPlayerSectionStanding: React.FC<{
  tournamentId?: any;
  seasonId?: any;
  i18n: any;
}> = ({ tournamentId, seasonId, i18n }) => {
  const [statType, setStatsType] = useState({
    name: 'Goals',
    key: 'goals',
  });

  const { data , isLoading } = useLeagueTopPlayersData(
    tournamentId,
    seasonId
  );
  
  if(!data){
    return <><EmptyEvent title={i18n.common.nodata} content='' /></>
  }
  
  if (isLoading || !data) {
    const numbersArray2 = Array.from({ length: 9 }, (_, index) => index + 1);

    return (
      <TwCard className='bg-white dark:bg-dark-container'>
        <TwTitle className='p-4'>{i18n.titles.top_players}</TwTitle>
        <div className='flex h-fit w-full  flex-col gap-3 rounded-xl px-2 py-8'>
          {numbersArray2.map((number) => (
            <Raking key={number} />
          ))}
        </div>
      </TwCard>
    );
  }

  const { topPlayers = {} } = data || {};
  let players = topPlayers['goals'] || [];
  
  if (isValEmpty(topPlayers)) return <><EmptyEvent title={i18n.common.nodata} content='' /></>;

  return (
    <TwCard className='bg-white dark:bg-dark-container'>
      <div>
        <div className='flex h-[2.375rem] items-center justify-between bg-head-tab dark:bg-dark-head-tab p-4 dark:text-dark-text'>
          <div className='w-5 text-center text-csm font-normal leading-4'>
            #
          </div>
          <div className='flex-1 text-csm'>{i18n.titles.players}</div>
          <div className='text-center text-csm font-normal capitalize leading-4'>
            {i18n.stat.goals}
          </div>
        </div>
        <ul className='divide-list'>
          {players.map((playerData: any, index: number) => {
            const {
              player = {},
              statistics,
              team,
            } = playerData || {};

            const statValue = statistics?.[statType?.key] || 0;

            return (
              <li key={index} className='item-hover cursor-pointer px-4 py-2'>
                <PlayerStats
                  playerId={player?.id}
                  name={player?.name}
                  imgUrl={`${getImage(
                    Images.player,
                    player?.id,
                    true,
                    SPORT.FOOTBALL
                  )}`}
                  statType={statType?.key}
                  statValue={roundNumber(statValue)}
                  position={index + 1}
                  team={team}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </TwCard>
  );
};

