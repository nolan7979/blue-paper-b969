import Avatar from '@/components/common/Avatar';
import { SportEventDtoWithStat } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import { isValEmpty } from '@/utils';
import { handleObjectScoreBaseball } from '@/utils/baseballUtils';
import clsx from 'clsx';
import { useMemo } from 'react';
import tw from 'twin.macro';

const RoundOfMatchSection = ({
  matchData,
}: {
  matchData: SportEventDtoWithStat;
}) => {
  const i18n = useTrans();
  const {
    homeTeam,
    awayTeam,
    scores = {},
    homeScore = {},
    awayScore = {},
    extraScores = {},
  } = matchData || {};

  const {
    formattedHomeScore,
    formattedAwayScore,
    isAwayWinning,
    isHomeWinning,
  } = useMemo(() => {
    const scoreHomeOld =
      homeScore?.display === 0 ? 0 : homeScore?.display || homeScore?.current; // add
    const scoreAwayOld =
      awayScore?.display === 0 ? 0 : awayScore?.display || awayScore?.current; // add

    const { ft } = scores || {};
    const scoreHome = ft?.length > 1 ? ft[0] : scoreHomeOld || 0;
    const scoreAway = ft?.length > 1 ? ft[1] : scoreAwayOld || 0;

    const filterScores = (teamId: number) => {
      return (
        extraScores?.innings?.filter((x: number[]) => x[0] === teamId) || []
      );
    };

    const formatScore = (
      scores: number[][],
      primaryIndex: number,
      secondaryIndex: number
    ) => {
      return scores?.length
        ? `${scores[0]?.[primaryIndex]}/${scores[0]?.[secondaryIndex]} ${
            scores[0]?.[2]
              ? `(${
                  Number.isInteger(scores[0][2])
                    ? `${scores[0][2]}.0`
                    : scores[0][2]
                })`
              : ''
          }`
        : '-';
    };

    const formatScoreOv = (scores: number[][], index: number) => {
      return scores?.length > 1
        ? `${scores[0]?.[index]} & ${scores[1]?.[index]} ${
            scores[0]?.[2]
              ? `(${
                  Number.isInteger(scores[0][2])
                    ? `${scores[0][2]}.0`
                    : scores[0][2]
                })`
              : ''
          }`
        : null;
    };

    const exHomeScore = filterScores(1);
    const exAwayScore = filterScores(2);

    const _homeScore = formatScore(exHomeScore, 1, 3);
    const _awayScore = formatScore(exAwayScore, 1, 3);

    const _homeScoreOv = formatScoreOv(exHomeScore, 1);
    const _awayScoreOv = formatScoreOv(exAwayScore, 1);

    const isDraw = homeScore === awayScore;
    const isHomeWinning = scoreHome > scoreAway;
    const isAwayWinning = scoreAway > scoreHome;
    return {
      formattedHomeScore: _homeScoreOv || _homeScore,
      formattedAwayScore: _awayScoreOv || _awayScore,
      isHomeWinning,
      isAwayWinning,
      isDraw,
    };
  }, [scores, homeScore, awayScore, extraScores]);

  if (isValEmpty(homeTeam) || isValEmpty(awayTeam)) {
    return null;
  }

  return (
    <TwQWRoundOfMatchContainer className='dark:border-linear-box bg-white dark:bg-primary-gradient'>
      <TwQWRoundOfMatchRow>
        <div className=''>{i18n.qv.team}</div>
      </TwQWRoundOfMatchRow>
      <div className='mb-2 h-[1px] w-full bg-bkg-border-gradient'></div>
      {/* bottom */}
      <RoundOfMatchRow
        team={homeTeam}
        score={formattedHomeScore}
        isWinning={isHomeWinning}
      />
      <RoundOfMatchRow
        team={awayTeam}
        score={formattedAwayScore}
        isWinning={isAwayWinning}
      />
    </TwQWRoundOfMatchContainer>
  );
};
export default RoundOfMatchSection;

export const TwQWRoundOfMatchContainer = tw.div`rounded-md px-4 py-2 pt-0 mb-4`;
export const TwQWRoundOfMatchRow = tw.div`flex justify-between items-center py-2 text-csm`;

// Round Of Match Row component
export const RoundOfMatchRow = ({
  team,
  score = '',
  isWinning = false,
}: any) => {
  return (
    <TwQWRoundOfMatchRow>
      <div className='flex items-center gap-[6px]'>
        <Avatar
          id={team?.id}
          type='team'
          width={24}
          height={24}
          className='shrink-0 grow-0 basis-6'
          isBackground={false}
          isSmall
          rounded={false}
        />
        <strong className='hidden text-black dark:text-white lg:block'>{team?.name}</strong>
      </div>
      <div className={clsx({ 'text-all-blue': isWinning })}>
        {score || '-'}
      </div>
    </TwQWRoundOfMatchRow>
  );
};
