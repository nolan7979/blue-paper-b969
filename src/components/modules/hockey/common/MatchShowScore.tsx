import React from 'react';

import { TwScoreCol } from '@/components/modules/football/tw-components';

const MatchShowScorePeriod = ({
  homeScore,
  awayScore,
}: {
  homeScore: any;
  awayScore: any;
}) => {
  const isHomeSmall = homeScore < awayScore ? true : false;
  return (
    <TwScoreCol className=''>
      <div
        className={`${
          isHomeSmall && 'text-score-paler'
        } dark:text-score-dark rounded-sm`}
      >
        {homeScore}
      </div>
      <div
        className={`${
          !isHomeSmall && 'text-score-paler'
        } dark:text-score-dark rounded-sm`}
      >
        {awayScore}
      </div>
    </TwScoreCol>
  );
};

const MatchShowScore = ({
  homeScore,
  awayScore,
}: {
  homeScore: any;
  awayScore: any;
}) => {
  return (
    <div className='flex gap-2 px-4'>
      <MatchShowScorePeriod
        homeScore={homeScore.period1}
        awayScore={awayScore.period1}
      />
      <MatchShowScorePeriod
        homeScore={homeScore.period2}
        awayScore={awayScore.period2}
      />
      <MatchShowScorePeriod
        homeScore={homeScore.period3}
        awayScore={awayScore.period3}
      />
      <MatchShowScorePeriod
        homeScore={homeScore.period4}
        awayScore={awayScore.period4}
      />
    </div>
  );
};

export default MatchShowScore;
