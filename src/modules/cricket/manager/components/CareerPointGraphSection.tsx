import { TwTransferFeeText } from '@/components/modules/football/tw-components';
import {
  Images,
  formatTimestamp,
  getImage,
  isValEmpty,
  roundNumber,
} from '@/utils';
import { useMemo, useState } from 'react';

const CareerPointGraphSection = ({
  managerDetails,
  managerCareerHistory,
}: {
  managerDetails: any;
  managerCareerHistory: any;
}) => {
  const [isErrorTeam, setIsErrorTeam] = useState<boolean>(false);
  const { performance = {} } = managerDetails?.manager || {};
  const { total, totalPoints } = performance || {};
  const avgPoints = roundNumber((totalPoints || 0) / (total || 1), 2);

  const { careerHistory = [] } = managerCareerHistory || {};

  const results: any = useMemo(() => {
    if (isValEmpty(careerHistory) || isValEmpty(managerCareerHistory))
      return null;

    const sortedCareerHistory = careerHistory.slice().reverse();
    // .sort((a: any, b: any) => a.startTimestamp - (b.endTimestamp));

    const firstClub: any = sortedCareerHistory[0];
    const lastClub: any = sortedCareerHistory[sortedCareerHistory.length - 1];
    let endTimestamp = new Date().getTime();

    if (!lastClub.endTimestamp) {
      if (lastClub.startTimestamp.toString().length < 13) {
        endTimestamp = Math.round(endTimestamp / 1000);
      }

      lastClub.endTimestamp = endTimestamp;
      sortedCareerHistory[sortedCareerHistory.length - 1] = { ...lastClub };
    }
    const totalLength = lastClub.endTimestamp - firstClub.startTimestamp || 1;
    const periods: any[] = [];
    for (let i = 0; i < sortedCareerHistory.length; i++) {
      const club = sortedCareerHistory[i];
      const start = club.startTimestamp;
      const end = club.endTimestamp;
      const length = end - start;
      const percentage = (length / totalLength) * 100;
      const performance = club.performance || {};
      const { total, totalPoints } = performance || {};
      const averagePoints = (totalPoints || 0) / (total || 1);

      periods.push({
        ...club,
        percentage,
        averagePoints,
      });

      const emptyStart = end;
      const emptyEnd = sortedCareerHistory[i + 1]?.startTimestamp;
      const emptyLength = emptyEnd - emptyStart;

      if (emptyEnd) {
        const emptyBin = {
          startTimestamp: emptyStart,
          endTimestamp: sortedCareerHistory[i + 1]?.startTimestamp,
          percentage: (emptyLength / totalLength) * 100,
        };

        periods.push(emptyBin);
      }
    }

    return { periods, firstClub, lastClub };
  }, [careerHistory, managerCareerHistory]);

  if (!careerHistory || careerHistory.length === 0) {
    return <></>;
  }

  const { periods, firstClub, lastClub } = results || {};

  if (!periods) return <></>;
  return (
    <div className=' flex flex-1 flex-col space-y-2 p-2.5'>
      <div className='flex rounded-md bg-gradient-to-b from-[#BAE9EC] to-[#EBF4F7] pb-2 text-black'>
        {/* Scale */}
        <div className=' flex w-5 flex-col py-4'>
          <div className=' h-10 pt-2 text-center'></div>
          <div className='  flex flex-1 flex-col items-center justify-between text-xs text-dark-text'>
            <span>3</span>
            <span>2</span>
            <span>1</span>
          </div>
        </div>

        {/* Bars + time */}
        <div className='relative flex-1'>
          {/* Bars */}
          <ul className=' flex flex-1 px-1 pt-4'>
            {periods.map((period: any, idx: number) => {
              const team = period?.team || {};
              const over2Team =
                periods[idx - 1] !== undefined &&
                periods[idx - 1].percentage < 0
                  ? periods[idx - 1].percentage
                  : 0;
              return (
                <li
                  key={idx}
                  css={{
                    width: `${period.percentage}%`,
                    backgroundColor: !isValEmpty(team?.id) ? '#B7E3ED' : 'none',
                  }}
                  className='rounded-md'
                >
                  <div className=' flex h-52 flex-col '>
                    <div className=' h-10 pt-2 text-center'>
                      {team?.id && period.percentage > 5 ? (
                        <img
                          src={`${
                            isErrorTeam
                              ? '/images/football/teams/unknown-team.png'
                              : `${getImage(Images.team, team?.id)}`
                          }`}
                          alt='...'
                          width={28}
                          height={28}
                          className='mr-1 inline-block rounded-md'
                          onError={() => setIsErrorTeam(true)}
                        ></img>
                      ) : (
                        ''
                      )}
                    </div>
                    <div
                      className={`flex flex-1 flex-col ${
                        over2Team !== 0 ? 'relative' : ''
                      }`}
                    >
                      <div className='flex-1'></div>
                      <div
                        css={{
                          height: `${(period.averagePoints / 3) * 100}%`,
                          backgroundColor:
                            period.averagePoints &&
                            parseFloat(period.averagePoints) > 0
                              ? '#2187E5'
                              : 'none',
                        }}
                        className={`${
                          over2Team !== 0 ? 'rounded-e-md' : 'rounded-md'
                        }`}
                      ></div>
                      {over2Team !== 0 ? (
                        <div
                          css={{
                            width: `${Math.abs(over2Team)}%`,
                            height: `${(period.averagePoints / 3) * 100}%`,
                            backgroundColor:
                              period.averagePoints &&
                              parseFloat(period.averagePoints) > 0
                                ? '#2187E5'
                                : 'none',
                          }}
                          className=' absolute bottom-0 z-10 -translate-x-full rounded-s-md'
                        ></div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          {/* base line */}
          <div
            className=' absolute left-0 h-[1px] w-full border border-dashed border-dark-orange'
            css={{
              bottom: `${(avgPoints / 3) * (13 - 2.5)}rem`,
            }}
          ></div>
          {/* time row */}
          <div className=' flex '>
            <div className='flex flex-1 justify-between px-1 text-xs'>
              <span>
                {formatTimestamp(firstClub.startTimestamp, 'yyyy/MM')}
              </span>
              <span>{formatTimestamp(lastClub.endTimestamp, 'yyyy/MM')}</span>
            </div>
          </div>
        </div>
      </div>
      <div className=' space-y-1'>
        <div className='flex items-center gap-2 '>
          <span className='h-2 w-2 rounded-full bg-logo-blue'></span>
          <TwTransferFeeText>Điểm trung bình mỗi trận</TwTransferFeeText>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='h-2 w-2 rounded-full bg-dark-orange'></span>

            <TwTransferFeeText>
              Tổng số điểm trung bình mỗi trận đấu:
            </TwTransferFeeText>
          </div>
          <span className='text-sm font-bold text-dark-orange'>
            {avgPoints}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CareerPointGraphSection;
