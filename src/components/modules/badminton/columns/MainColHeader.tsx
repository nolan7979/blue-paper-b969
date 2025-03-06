import WeekView from '@/components/filters/WeekFilter';
import { MainMatchFilter as BmtMainMatchFilter } from '@/components/modules/badminton/filters';

export const MainColHeader: React.FC<{ page?: string }> = ({ page }) => {
  return (
    <div className='sticky top-[104px] z-[2] flex justify-between lg:static'>
      <div className='flex w-full items-center p-2.5 dark:bg-dark-score md:pb-0 lg:hidden bg-light-main'>
        <WeekView />
      </div>
      <div className='hidden w-full lg:inline-block'>
        <BmtMainMatchFilter page={page} />
      </div>
    </div>
  );
};
