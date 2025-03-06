import { PlayerLineUp } from '@/components/modules/football/quickviewColumn/QuickViewSquadTab';
import { TwLineupVerticalLineAway } from '@/components/modules/football/tw-components';

import {
  getImage,
  Images,
  isStringNumeric,
  isValEmpty,
  roundNum,
  splitSquad,
} from '@/utils';

export const HorizontalHomeTeamLineUp = ({
  lineups,
  mapPlayerEvents,
  matchData,
}: {
  lineups: any;
  mapPlayerEvents: any;
  matchData: any;
}) => {
  const { players = [], formation = '' } = lineups;
  if (isValEmpty(players) || isValEmpty(formation)) {
    return <></>;
  }
  const linePlayers = splitSquad(formation, players.slice(0, 11));

  return (
    <div className=' aspect-h-1 aspect-w-1 rounded-l-md bg-contain bg-no-repeat '>
      <div className='flex justify-evenly px-2'>
        {linePlayers.map((lineup: any, index: number) => {
          return (
            <TwLineupVerticalLineAway className='' key={`line-${index}`}>
              {lineup.map((playerLineupData: any, index: number) => {
                const {
                  player = {},
                  shirtNumber,
                  statistics = {},
                  rating = 0,
                  captain = false,
                } = playerLineupData;
                const playerData =
                  mapPlayerEvents?.get(playerLineupData.player?.id) || {};

                const playerRating = roundNum(
                  statistics?.rating || rating || 0,
                  1
                );

                return (
                  <PlayerLineUp
                    key={`player-${index}`}
                    src={
                      isStringNumeric(player?.id)
                        ? `${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/player/${player?.id}/image`
                        : `${getImage(Images.player, player?.id)}`
                    }
                    name={`${player?.name}`}
                    shirtNo={shirtNumber}
                    isSub={playerData.subOut || false}
                    yellowCard={playerData.yellow || 0}
                    yellowRed={playerData.yellowRed || 0}
                    redCard={playerData.redCard || 0}
                    numGoals={playerData.regularGoals || 0}
                    penGoals={playerData.penGoals || 0}
                    ownGoals={playerData.ownGoals || 0}
                    missedPens={playerData.missedPens || 0}
                    numAssists={playerData.numAssists || 0}
                    player={player}
                    matchData={matchData}
                    rating={playerRating}
                    captain={captain}
                  />
                );
              })}
            </TwLineupVerticalLineAway>
          );
        })}
      </div>
    </div>
  );
};
