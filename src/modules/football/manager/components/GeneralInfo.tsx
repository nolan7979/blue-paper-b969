const GeneralInfo = ({
  label,
  icon,
  subLabel,
  subLabelImgUrl,
}: {
  label: string;
  icon: React.ReactNode;
  subLabel: string;
  subLabelImgUrl?: string;
}) => {
  return (
    <div className=' flex-1 space-y-1'>
      <div className=' flex items-center'>
        <span className='w-12 text-center dark:text-dark-text'>
          {/* <NationalitySVG className='inline-block h-5 w-5'></NationalitySVG> */}
          {icon}
        </span>
        <span className='border-l-2 border-logo-blue px-2 text-csm font-normal leading-5 text-logo-blue'>
          {label}
        </span>
      </div>
      <div className=' flex items-center'>
        <span className='w-12'></span>
        <span className='flex items-center gap-2 px-2'>
          {subLabelImgUrl && (
            <img
              src={subLabelImgUrl || ''}
              alt={subLabel}
              width={16}
              height={16}
              className='rounded-full'
            ></img>
          )}
          <span className='text-xs font-normal leading-4 dark:text-dark-text'>
            {subLabel}
          </span>
        </span>
      </div>
    </div>
  );
};
export default GeneralInfo;
