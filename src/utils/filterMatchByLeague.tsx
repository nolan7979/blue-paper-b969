const filterMatchByLeague = (matches: any[]): any[] => {
  // maybe dont sort depend on time.
  const matchesByTournament: Record<string, any[]> = {};

  // Iterate through the matches and organize them by tournamentId
  matches.forEach((match: any) => {
    const { tournamentId } = match;

    if (!matchesByTournament[tournamentId]) {
      matchesByTournament[tournamentId] = [];
    }

    matchesByTournament[tournamentId].push(match);
  });
  // Convert the matchesByTournament object into an array of objects
  const sortedMatches = Object.entries(matchesByTournament).map(
    ([tournamentId, matches]) => ({
      tournamentId,
      matches: matches.sort((match1, match2) => {
        // Compare dates first
        const date1 = new Date(
          match1.formatDate.split('/').reverse().join('/') +
            ' ' +
            match1.formatTime
        );
        const date2 = new Date(
          match2.formatDate.split('/').reverse().join('/') +
            ' ' +
            match2.formatTime
        );

        if (date1 < date2) {
          return -1;
        } else if (date1 > date2) {
          return 1;
        } else {
          // If dates are equal, compare times
          const time1 = match1.formatTime;
          const time2 = match2.formatTime;
          if (time1 < time2) {
            return -1;
          } else if (time1 > time2) {
            return 1;
          } else {
            return 0;
          }
        }
      }),
    })
  );
  return sortedMatches;
};

export default filterMatchByLeague;
