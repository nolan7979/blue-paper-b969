import { useState } from 'react';

import { useLeagueTopPlayersData } from '@/hooks/useFootball';

import { Select } from '@/components/common';
import Raking from '@/components/common/skeleton/competition/Raking';
import { PlayerStats } from '@/components/modules/football/players';
import { TwCard, TwTitle } from '@/components/modules/football/tw-components';

import { TwShowButton } from '@/modules/football/competition/components';
import {
  getImage,
  getStatsLabel,
  Images,
  isValEmpty,
  roundNumber,
  StatsLabel,
} from '@/utils';
import { SPORT } from '@/constant/common';

const TopPlayerSection: React.FC<{
  uniqueTournament?: any;
  selectedSeason?: any;
  i18n: any;
}> = ({ uniqueTournament, selectedSeason, i18n }) => {
  const [showAll, setShowAll] = useState(false);
  const [statType, setStatsType] = useState({
    name: 'Goals',
    key: 'goals',
  });

  const { data , isLoading } = useLeagueTopPlayersData(
    uniqueTournament?.id,
    selectedSeason?.id
  );
  
  if(!data){
    return <></>
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
  let players = topPlayers[statType?.key] || [];
  if (!showAll) {
    players = players.slice(0, 10);
  }
  
  if (isValEmpty(topPlayers)) return <></>;

  const statsTypes = Object.keys(topPlayers).map((key) => {
    const typedKey = key as StatsLabel;

    return {
      name: getStatsLabel(typedKey, i18n),
      key: key,
    };
  });

  return (
    <TwCard className='bg-white dark:bg-dark-container'>
      <h3 className='p-4 font-primary font-bold uppercase text-black dark:text-white'>
        {i18n.titles.top_players}
      </h3>
      {/* Dropdown */}
      <div className='mb-4 px-2'>
        <Select
          options={statsTypes}
          label='name'
          valueGetter={setStatsType}
          size='full'
        />
      </div>

      {/* Players list */}
      <div>
        <div className='flex h-[2.375rem] items-center justify-between bg-head-tab dark:bg-dark-head-tab p-4 dark:text-dark-text'>
          <div className='w-5 text-center text-csm font-normal leading-4'>
            #
          </div>
          <div className='flex-1'></div>
          <div className='text-center text-csm font-normal capitalize leading-4'>
            {statType?.name}
          </div>
        </div>
        <ul className='divide-list'>
          {players.map((playerData: any, index: number) => {
            // return <li key={index}>{player.player?.name}</li>;
            const {
              player = {},
              statistics,
              playedEnough,
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
      <div className='flex justify-end p-2.5'>
        <TwShowButton
          onClick={() => setShowAll(!showAll)}
          className='cursor-pointer text-left text-sm leading-4 text-logo-blue'
        >
          {showAll ? i18n.common.show_less : i18n.common.show_more}
        </TwShowButton>
      </div>
    </TwCard>
  );
};

export default TopPlayerSection;
