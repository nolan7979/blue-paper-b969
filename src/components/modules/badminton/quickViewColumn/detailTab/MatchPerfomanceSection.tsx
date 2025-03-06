// import Avatar from '@/components/common/Avatar';
import { SportEventDtoWithStat, StatusDto } from '@/constant/interface';
import { formatSecondToHourView, isValEmpty } from '@/utils';
import { Fragment, useEffect, useState } from 'react';
import tw from 'twin.macro';

import ArrowDown from '/public/svg/arrow-down.svg';
import { useFetchEventIncidents } from '@/hooks/useTennis';

import TennisBall from '/public/svg/tennis-ball.svg';

const MatchPerfomanceSection = ({
  matchData,
}: {
  matchData: SportEventDtoWithStat;
}) => {
  const { id } = matchData || {};
  const status: StatusDto = matchData?.status;
  const { data } = useFetchEventIncidents(id, status?.code);

  const [keyOpen, setKeyOpen] = useState<number>(0);

  useEffect(() => {
    setKeyOpen(0);
    if (!isValEmpty(data) && data?.length > 0) {
      setKeyOpen(data[0].set);
    }
  }, [data]);

  if (isValEmpty(data)) {
    return <></>;
  }
  return (
    <div>
      {data?.length > 0 &&
        data.map((game: any, idx: any) => (
          <div key={`set${game?.set}-${idx}`}>
            <HeadAccordion
              className='dark:bg-primary-gradient cursor-pointer'
              onClick={() => setKeyOpen(game?.set)}
            >
              <span className='mr-2 inline-block'>{`S${game?.set}`}</span>
              <ArrowDown
                className={`h-[10px] w-[10px] transform ${
                  keyOpen === game?.set ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </HeadAccordion>
            {game?.games.length > 0 &&
              game?.games.map((point: any, pIdx: any) => (
                <Fragment key={pIdx}>
                  {keyOpen === game?.set && (
                    <BodyAccordion className='border-b border-dark-time-tennis last:border-b-0'>
                      <ScorePerSet score={point?.score} />
                      <PointPerSet list={point?.points} />
                    </BodyAccordion>
                  )}
                </Fragment>
              ))}
          </div>
        ))}
    </div>
  );
};
export default MatchPerfomanceSection;

const HeadAccordion = tw.div`flex items-center justify-center text-csm uppercase text-white w-full h-[32px] rounded-md mb-2`;
const BodyAccordion = tw.div`w-full py-2`;

const ScorePerSet = ({ score }: any) => {
  return (
    <div className='mb-2 flex justify-center' test-id='score-box'>
      <div className='relative'>
        <div
          className={`absolute top-2 ${
            score?.homeScore > score?.awayScore
              ? 'left-[-30px]'
              : 'right-[-30px]'
          }`}
        >
          {score?.homeScore !== score?.awayScore && (
            <TennisBall className='h-[14px] w-[14px]' />
          )}
        </div>
        <div className='flex justify-center gap-2 font-oswald text-xl font-bold'>
          <span
            className={
              score?.homeScore > score?.awayScore
                ? `text-dark-hl`
                : `text-white`
            }
          >
            {score?.homeScore}
          </span>
          <span className={`text-white`}>-</span>
          <span
            className={
              score?.homeScore < score?.awayScore
                ? `text-dark-hl`
                : `text-white`
            }
          >
            {score?.awayScore}
          </span>
        </div>
      </div>
    </div>
  );
};

const PointPerSet = ({ list }: any) => (
  <ul className='flex justify-center gap-1'>
    {list.length > 0 &&
      list.map((it: any, index: any) => (
        <li
          key={`${it?.homePoint}-${index}-${it?.awayPoint}`}
          className='flex cursor-default gap-1 rounded-sm border border-dark-time-tennis p-1 text-[8px] font-bold text-white'
        >
          <span>{`${it?.homePoint}:${it?.awayPoint}`}</span>
          {/* <span className={`${it === 2 ? 'bg-dark-hl' : 'bg-dark-stadium-line'} rounded-sm px-[2px]`}>SP</span> */}
        </li>
      ))}
  </ul>
);
