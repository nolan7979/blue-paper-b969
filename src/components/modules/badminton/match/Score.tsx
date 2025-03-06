// import { ScoreRow } from '@/components/modules/badminton/match/ScoreRow';
import { baseClassesScores } from '@/components/modules/common/tw-components/TwWrapper';
import { InProgressStatesTennis, StatusDto } from '@/constant/interface';
// import { useMemo } from 'react';

interface IScore {
  scores: { [key: string]: number[] };
  status?: StatusDto;
}

const separateScore = (score: { [key: string]: number[] }) => {
  const pScore: { [key: string]: number[] } = {};
  const xScore: { [key: string]: number[] } = {};

  Object.keys(score).forEach((key) => {
    if (key.startsWith('p')) {
      pScore[key] = score[key];
    } else if (key.startsWith('x')) {
      xScore[key] = score[key];
    }
  });

  return { pScore, xScore };
};

export const Score: React.FC<IScore> = ({ scores, status }) => {
  const { pt, ...otherScore } = scores;
  const { pScore, xScore } = separateScore(otherScore);
  const lastPScore = Object.keys(pScore).length > 0 ? Object.keys(pScore).length : 0

  // const orderedPKeys = useMemo(() => ['p5', 'p4', 'p3', 'p2', 'p1'], []);
  const baseClasses = 'flex h-full min-w-[1.375rem] items-center justify-center rounded-t-[4px] py-[2px] text-xs text-light-green dark:text-dark-green font-semibold';
  return (
    <>
      {InProgressStatesTennis.includes(status?.code || -1) && (
        <div
          className='flex flex-col place-content-center items-center justify-center'
          test-id='score-info'
        >
          <div className='flex w-full flex-col justify-between text-center text-white lg:w-6'>
            <div
              className={baseClassesScores}
              test-id='home-conner'
            >
              {lastPScore > 0 ? pScore[`p${lastPScore}`][0] : 0}
            </div>
            <div
              className={baseClassesScores}
              test-id='home-conner'
            >
              {lastPScore > 0 ? pScore[`p${lastPScore}`][1] : 0}
            </div>
          </div>
        </div>
      )}
      {/* {orderedPKeys.map((orderedKey, index) => {
        if (!pScore[orderedKey]) {
          return null;
        }

        return (
          <div
            className='flex flex-col place-content-center items-center justify-center'
            test-id='score-info'
            key={orderedKey}
          >
            <ScoreRow
              pScore={pScore[orderedKey]}
              xScore={xScore[`x${5 - index}`]}
            />
          </div>
        );
      })} */}
    </>
  );
};
