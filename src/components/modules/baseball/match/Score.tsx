import { baseClassesScores } from '@/components/modules/common/tw-components/TwWrapper';
import { StatusDto } from '@/constant/interface';
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
  const { ...otherScore } = scores;
  const { pScore } = separateScore(otherScore);

  const lastP = Object.keys(pScore).length || 0
  return (
    <>
      <div
        className='flex flex-col place-content-center items-center justify-center'
        test-id='score-info'
      >
        <div className='flex w-full flex-col justify-between text-center text-white lg:w-6'>
          <div
            className={baseClassesScores}
            test-id='home-conner'
          >
            {lastP > 0 && pScore?.[`p${lastP}`][0] || '0'}
          </div>
          <div
            className={baseClassesScores}
            test-id='home-conner'
          >
            {lastP > 0 && pScore?.[`p${lastP}`][1] || '0'}
          </div>
        </div>
      </div>
    </>
  );
};
