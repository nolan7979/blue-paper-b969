const updateObject = (currentObject: any, key: string, val = 1) => {
  if (!currentObject[key]) {
    currentObject[key] = val;
  } else {
    currentObject[key] += val;
  }
  return currentObject;
};

export const genPlayerData = (timelineData: any) => {
  const playerData: Map<string, object> = new Map();

  for (const event of timelineData || []) {
    if ('card' === event.incidentType) {
      const player = event.player || {};

      if (!playerData.has(player?.id)) {
        playerData.set(player?.id, {});
      }

      const currentData: any = playerData.get(player?.id) || {};
      if (event.incidentClass === 'red') {
        playerData.set(player?.id, {
          ...currentData,
          redCard: 1,
        });
      } else if (event.incidentClass === 'yellowRed') {
        playerData.set(player?.id, {
          ...currentData,
          yellowRed: 1,
        });
      } else {
        playerData.set(player?.id, {
          ...currentData,
          yellow: 1,
        });
      }
    } else if ('substitution' === event.incidentType) {
      const { playerIn = {}, playerOut = {} } = event;

      if (
        typeof playerIn === 'object' &&
        playerIn !== null &&
        Object.keys(playerIn).length > 0 &&
        typeof playerOut === 'object' &&
        playerOut !== null &&
        Object.keys(playerOut).length > 0
      ) {
        if (!playerData.has(playerIn?.id)) {
          playerData.set(playerIn?.id, {});
        }
        if (!playerData.has(playerOut?.id)) {
          playerData.set(playerOut?.id, {});
        }

        playerData.set(playerIn?.id, {
          ...playerData.get(playerIn?.id),
          subIn: true,
          subEvent: event,
        });
        playerData.set(playerOut?.id, {
          ...playerData.get(playerOut?.id),
          subOut: true,
        });
      }
    } else if ('goal' === event.incidentType) {
      const { player = {}, assist1 = {}, incidentClass = '' } = event;

      if (!playerData.has(player?.id)) {
        playerData.set(player?.id, {});
      }

      if (assist1?.id && !playerData.has(assist1?.id)) {
        playerData.set(assist1?.id, {});
      }

      if (incidentClass === 'regular') {
        const newData = updateObject(
          playerData.get(player?.id),
          'regularGoals'
        );
        playerData.set(player?.id, newData);

        if (assist1?.id) {
          const newDataAssist = updateObject(
            playerData.get(assist1?.id),
            'numAssists'
          );
          playerData.set(assist1?.id, newDataAssist);
        }
      } else if (incidentClass === 'penalty') {
        const newData = updateObject(playerData.get(player?.id), 'penGoals');
        playerData.set(player?.id, newData);

        if (assist1?.id) {
          const newDataAssist = updateObject(
            playerData.get(assist1?.id),
            'numAssists'
          );
          playerData.set(assist1?.id, newDataAssist);
        }
      } else if (incidentClass === 'ownGoal') {
        const newData = updateObject(playerData.get(player?.id), 'ownGoals');
        playerData.set(player?.id, newData);
      } else if (incidentClass === 'missPen') {
        const newData = updateObject(playerData.get(player?.id), 'missedPens');
        playerData.set(player?.id, newData);
      }
    } else if (
      event.incidentType === 'inGamePenalty' &&
      event.incidentClass === 'missed'
    ) {
      const { player = {} } = event;

      if (!playerData.has(player?.id)) {
        playerData.set(player?.id, {});
      }

      const newData = updateObject(playerData.get(player?.id), 'missedPens');
      playerData.set(player?.id, newData);
    }
  }
  return new Map(playerData) || new Map();
};
