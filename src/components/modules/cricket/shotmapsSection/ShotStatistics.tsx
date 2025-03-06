import React from 'react';
import clsx from 'clsx';

interface ShotStatisticsProps {
  team1Shots: number;
  team2Shots: number;
  team1OnTarget: number;
  team2OnTarget: number;
  team1OffTarget: number;
  team2OffTarget: number;
  className?: string;
  i18n?: any;
}

const ShotStatistics: React.FC<ShotStatisticsProps> = ({
  team1Shots,
  team2Shots,
  team1OnTarget,
  team2OnTarget,
  team1OffTarget,
  team2OffTarget,
  className,
  i18n,
}) => {
  if (team1Shots < 0) team1Shots = 0;
  if (team2Shots < 0) team2Shots = 0;
  if (team1OnTarget < 0) team1OnTarget = 0;
  if (team2OnTarget < 0) team2OnTarget = 0;
  if (team1OffTarget < 0) team1OffTarget = 0;
  if (team2OffTarget < 0) team2OffTarget = 0;
  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      <div className='flex justify-between text-xss font-bold text-white'>
        <span test-id='team1shot'>{team1Shots}</span>
        <span className='uppercase'>{i18n?.qv.total_shots}</span>
        <span test-id='team2shot'>{team2Shots}</span>
      </div>

      <div className='relative h-56 w-full'>
        <div
          className='absolute left-0 top-0 z-0 h-full bg-semantic-info-blue-700'
          style={{
            width: `${
              team1OffTarget == 0 && team2OffTarget == 0
                ? 50
                : (team1OffTarget / (team1OffTarget + team2OffTarget)) * 100
            }%`,
          }}
        />
        <div
          className='absolute right-0 top-0 z-0 h-full bg-semantic-error-red-700'
          style={{
            width: `${
              team1OffTarget == 0 && team2OffTarget == 0
                ? 50
                : (team2OffTarget / (team1OffTarget + team2OffTarget)) * 100
            }%`,
          }}
        />

        <div className='absolute left-0 top-0 z-10 flex h-full w-full items-end justify-center'>
          <div
            className='relative bg-light-match dark:bg-dark-main'
            style={{
              width: '310px',
              height: '117px',
              minWidth: '310px',
              minHeight: '117px',
              maxWidth: '310px',
              maxHeight: '117px',
            }}
          >
            <div
              className='absolute left-0 top-0 z-10'
              style={{
                width: '310px',
                height: '117px',
                minWidth: '310px',
                minHeight: '117px',
                maxWidth: '310px',
                maxHeight: '117px',
                backgroundImage: "url('/svg/goal-soccer.svg')",
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'bottom',
              }}
            />
            <div
              className='absolute left-0 top-0 z-0 h-full bg-semantic-info-blue-700'
              style={{
                width: `${
                  team1OnTarget == 0 && team2OnTarget == 0
                    ? 50
                    : (team1OnTarget / (team1OnTarget + team2OnTarget)) * 100
                }%`,
              }}
            />
            <div
              className='absolute right-0 top-0 z-0 h-full bg-semantic-error-red-700'
              style={{
                width: `${
                  team1OnTarget == 0 && team2OnTarget == 0
                    ? 50
                    : (team2OnTarget / (team1OnTarget + team2OnTarget)) * 100
                }%`,
              }}
            />
          </div>
        </div>
        <div
          className={
            'absolute left-0 top-0 z-20 flex h-60 w-full flex-col items-center justify-between py-10'
          }
        >
          <div className='mt-2 flex h-8 items-center justify-between gap-3 rounded-full bg-neutral-alpha-04 text-xss font-normal text-white xl:gap-8 2xl:gap-10'>
            <span className='flex h-8 w-8 items-center justify-center rounded-full bg-neutral-alpha-06' id="shots-outside1">
              {team1OffTarget}
            </span>
            <span className=''>
              {i18n?.qv.number_of_shots_outside_the_goal}
            </span>
            <span className='flex h-8 w-8 items-center justify-center rounded-full bg-neutral-alpha-06' id="shots-outside2">
              {team2OffTarget}
            </span>
          </div>
          <div className='mt-2 flex h-8 items-center justify-between gap-2 rounded-full bg-neutral-alpha-04 text-xss font-normal text-white'>
            <span className='flex h-8 w-8 items-center justify-center rounded-full bg-neutral-alpha-06' id="shots-on-goal1">
              {team1OnTarget}
            </span>
            <span className=''>{i18n?.qv.number_of_shots_on_goal}</span>
            <span className='flex h-8 w-8 items-center justify-center rounded-full bg-neutral-alpha-06' id="shots-on-goal2">
              {team2OnTarget}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShotStatistics;
