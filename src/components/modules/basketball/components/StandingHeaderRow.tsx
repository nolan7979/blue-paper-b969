import useTrans from '@/hooks/useTrans';

export const StandingHeaderRow = () => {
  const i18n = useTrans();
  return (
    <li className='flex h-[2.375rem] w-full items-center justify-between bg-head-tab dark:bg-dark-head-tab font-primary text-xss font-normal'>
      <div className='flex bg-head-tab dark:bg-dark-head-tab pl-1.5 py-2.5 sticky left-0 z-[2] grow-0 shrink-0 basis-48 lg:basis-60'>
        {/* Rank */}
        <div className='flex w-4 place-content-center text-center'>#</div>

        {/* Team name */}
        <div className='w-10 text-center lg:w-16'>
          {i18n.menu.team}
        </div>
      </div>
      <div className='flex py-2.5 bg-head-tab dark:bg-dark-head-tab'>
        <div className='w-10 text-center lg:w-12'>M</div>
        <div className='w-10 text-center lg:w-12'>W</div>
        <div className='w-10 text-center lg:w-12'>L</div>
        <div className='w-10 text-center lg:w-12'>PTC</div>
      </div>
    </li>
  );
};
