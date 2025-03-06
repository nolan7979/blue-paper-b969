// checked={sortedByLeague}
// onChange={(e) => setSortedByLeague(e.target.checked)}
export const SwitcherButton = ({
  value,
  handleChange,
}: {
  value: boolean;
  handleChange: any;
}) => {
  return (
    <div className='flex gap-2'>
      {/* <span className=' my-auto text-csm'>Odds</span> */}
      <div className='mr-1 flex flex-1 items-center md:mr-0'>
        <label className='relative inline-flex cursor-pointer items-center'>
          <input
            type='checkbox'
            className='peer sr-only'
            checked={value}
            onChange={() => handleChange(!value)}
            aria-label='switchButton'
          />
          <div className="peer-focus:ring-none peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-logo-blue peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800" />
        </label>
      </div>
    </div>
  );
};
