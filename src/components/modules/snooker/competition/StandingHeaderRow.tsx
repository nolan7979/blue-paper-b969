import useTrans from '@/hooks/useTrans';

export const StandingHeaderRow = () => {
  const i18n = useTrans();
  return (
    <li className='flex h-[2.375rem] w-full items-center justify-between bg-[#171B2E] py-2.5 font-primary text-xss font-normal'>
      <div className='flex bg-head-tab dark:bg-dark-gray pl-1.5'>
        {/* Rank */}
        <div className='flex w-4 place-content-center text-center'>#</div>

        {/* Team name */}
        <div className='w-10 bg-head-tab dark:bg-dark-gray text-center lg:w-16'>
          {i18n.menu.team}
        </div>
      </div>
      <div className='flex'>
        <div className='w-10 text-center uppercase lg:w-12'>M</div>
        <div className='w-10 text-center uppercase lg:w-12'>DG</div>
        <div className='w-10 text-center uppercase lg:w-12'>PTS</div>
        <div className='text-center uppercase w-24'>Form</div>
      </div>
    </li>
  );
};
