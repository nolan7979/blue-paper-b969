import WeekView from '@/components/filters/WeekFilter';
import { MainMatchFilter } from '@/components/modules/tennis/filters';
import { useMounted } from '@/hooks';
import React from 'react';

export const MainColHeader: React.FC<{ inputId?: string }> = ({ inputId }) => {
  const { isMounted } = useMounted();

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <div className='flex justify-between sticky lg:relative lg:top-0 top-[104px] z-[5]'>
        <div className='flex w-full items-center p-2.5 dark:bg-dark-score md:pb-0 lg:hidden'>
          <WeekView />
        </div>
        <div className='hidden w-full lg:inline-block'>
          <MainMatchFilter />
        </div>
      </div>
    </>
  );
};
