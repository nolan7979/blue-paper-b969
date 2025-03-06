import React from 'react';
import clsx from 'clsx';
import { TwBorderLinearBox } from '@/components/modules/common';
import { useWindowSize } from '@/hooks';

interface PossessionStatsProps {
  team1Possession: number;
  team2Possession: number;
  className?: string;
  i18n?: any;
  isDetail?: boolean;
}

const PossessionStats: React.FC<PossessionStatsProps> = ({
  team1Possession,
  team2Possession,
  className,
  i18n,
  isDetail,
}) => {
  const {width} = useWindowSize();
  const memoizedHeight = React.useMemo(() => {
    if (width < 1024) {
      return '10.063rem';
    }
    if(!isDetail) {
      return '15.313rem';
    }
    return '13.25rem';
  }, [width]);
  return (
    <div className={clsx('bg-white rounded-md  dark:bg-dark-card p-4',className)}>
      <div className='mx-auto flex max-w-[528px] flex-col gap-2'>
        <div className='flex justify-between text-xss font-bold text-black dark:text-white'>
          <span test-id='team1Possession'>{team1Possession}%</span>
          <span className='uppercase'>{i18n?.qv.ball_possession}</span>
          <span test-id='team2Possession'>{team2Possession}%</span>
        </div>

        <div className='relative w-full overflow-hidden rounded-md border-2 border-white border-opacity-20'>
          <div
            className='absolute left-0 top-0 h-full border-r-2 border-white bg-semantic-info-blue-700'
            style={{ width: `${team1Possession}%` }}
          />
          <div
            className='absolute right-0 top-0 h-full bg-semantic-error-red-700'
            style={{ width: `${team2Possession}%` }}
          />
          <div className='relative'>
            <div style={{height: memoizedHeight}} className='flex'>
              <div style={{height: memoizedHeight}} className='flex w-1/2 items-center justify-start border-r border-white border-opacity-20'>
                <div className='flex h-3/5 w-14 items-center justify-start border-2 border-l-0 border-white border-opacity-20'>
                  <div className='h-3/5 w-7 border-2 border-l-0 border-white border-opacity-20' />
                </div>
                <div className='relative h-24 w-24 overflow-hidden'>
                  <div className='absolute -left-16 h-24 w-24 rounded-full border-2 border-white border-opacity-20' />
                </div>
              </div>
              <div style={{height: memoizedHeight}} className='flex  w-1/2 items-center justify-end border-l border-white border-opacity-20'>
                <div className='relative h-24 w-24 overflow-hidden'>
                  <div className='absolute -right-16 h-24 w-24 rounded-full border-2 border-white border-opacity-20' />
                </div>
                <div className='flex h-3/5 w-14 items-center justify-end border-2 border-r-0 border-white border-opacity-20'>
                  <div className='h-3/5 w-7 border-2 border-r-0 border-white border-opacity-20' />
                </div>
              </div>
            </div>
            <div className='absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-2 border-white border-opacity-20' />
            <div className='absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-opacity-20 bg-white' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PossessionStats;
