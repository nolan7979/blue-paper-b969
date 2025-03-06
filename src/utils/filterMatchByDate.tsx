const filterMatchByDate = (matchList: any): any => {
  const currentDate = new Date(); // Get the current date

  type CategorizedMatches = {
    previousDay: Record<string, any[]>;
    today: Record<string, any[]>;
    upcomingDay: Record<string, any[]>;
  };

  const groupedAndCategorizedMatches: CategorizedMatches = {
    previousDay: {},
    today: {},
    upcomingDay: {},
  };

  matchList.forEach((match: any) => {
    // Determine whether the match is for previous day, today, or upcoming day
    const matchDate = new Date(match.formatDate.split('/').reverse().join('/'));

    const formattedMatchDate = match.formatDate;

    // Compare the match date with the current date
    if (
      matchDate.getFullYear() < currentDate.getFullYear() ||
      (matchDate.getMonth() < currentDate.getMonth() &&
        matchDate.getFullYear() === currentDate.getFullYear()) ||
      (matchDate.getDate() < currentDate.getDate() &&
        matchDate.getMonth() === currentDate.getMonth() &&
        matchDate.getFullYear() === currentDate.getFullYear())
    ) {
      const formattedMatchDateForPrev = `${matchDate.getDate()}/${(
        matchDate.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${matchDate.getFullYear()}`;

      if (
        !groupedAndCategorizedMatches.previousDay[formattedMatchDateForPrev]
      ) {
        groupedAndCategorizedMatches.previousDay[formattedMatchDateForPrev] =
          [];
      }
      groupedAndCategorizedMatches.previousDay[formattedMatchDateForPrev].push(
        match
      );
    } else if (
      matchDate.getDate() === currentDate.getDate() &&
      matchDate.getMonth() === currentDate.getMonth() &&
      matchDate.getFullYear() === currentDate.getFullYear()
    ) {
      if (!groupedAndCategorizedMatches.today[formattedMatchDate]) {
        groupedAndCategorizedMatches.today[formattedMatchDate] = [];
      }
      groupedAndCategorizedMatches.today[formattedMatchDate].push(match);
    } else {
      const formattedMatchDateForUpcoming = `${matchDate.getDate()}/${(
        matchDate.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${matchDate.getFullYear()}`;

      if (
        !groupedAndCategorizedMatches.upcomingDay[formattedMatchDateForUpcoming]
      ) {
        groupedAndCategorizedMatches.upcomingDay[
          formattedMatchDateForUpcoming
        ] = [];
      }
      groupedAndCategorizedMatches.upcomingDay[
        formattedMatchDateForUpcoming
      ].push(match);
    }
  });

  // Convert categorized matches to arrays of { day: [match] }
  const previousDayMatchesArray = Object.entries(
    groupedAndCategorizedMatches.previousDay
  ).map(([day, matches]) => ({
    day,
    matches: matches.sort((matchA, matchB) =>
      matchA.formatTime.localeCompare(matchB.formatTime)
    ),
  }));
  const todayMatchesArray = Object.entries(
    groupedAndCategorizedMatches.today
  ).map(([day, matches]) => ({
    day,
    matches: matches.sort((matchA, matchB) =>
      matchA.formatTime.localeCompare(matchB.formatTime)
    ),
  }));
  const upcomingDayMatchesArray = Object.entries(
    groupedAndCategorizedMatches.upcomingDay
  ).map(([day, matches]) => ({
    day,
    matches: matches.sort((matchA, matchB) =>
      matchA.formatTime.localeCompare(matchB.formatTime)
    ),
  }));

  // Sort the arrays by day
  previousDayMatchesArray.sort((a, b) => {
    const dateA = new Date(a.day.split('/').reverse().join('/'));
    const dateB = new Date(b.day.split('/').reverse().join('/'));
    return dateB.getTime() - dateA.getTime();
  });
  todayMatchesArray.sort((a, b) => {
    const dateA = new Date(a.day.split('/').reverse().join('/'));
    const dateB = new Date(b.day.split('/').reverse().join('/'));
    return dateB.getTime() - dateA.getTime();
  });
  upcomingDayMatchesArray.sort((a, b) => {
    const dateA = new Date(a.day.split('/').reverse().join('/'));
    const dateB = new Date(b.day.split('/').reverse().join('/'));
    return dateB.getTime() - dateA.getTime();
  });
  return {
    previousDayMatches: previousDayMatchesArray,
    todayMatches: todayMatchesArray,
    upcomingDayMatches: upcomingDayMatchesArray,
  };
};

export default filterMatchByDate;
