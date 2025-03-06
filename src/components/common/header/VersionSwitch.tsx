import CustomLink from '@/components/common/CustomizeLink';

import DownloadIcon from '/public/svg/download.svg';

export const VersionSwitch = ({
  href,
  label,
  isMobile,
}: // isMobile = true,
{
  href: string;
  label: string;
  isMobile?: boolean;
}) => {
  return (
    <CustomLink
      href={href}
      className='flex h-9 items-center justify-center gap-1 rounded-full bg-line-dark-blue p-2.5 hover:brightness-125'
      aria-label='Mobile Version'
      target='_parent'
    >
      {/* {isMobile ? <DesktopIcon /> : <DownloadIcon className='h-5 w-5' />} */}
      <DownloadIcon className='h-4 w-4' />

      <span className='font-sans text-[0.625rem] font-semibold text-white whitespace-nowrap'>
        {label}
      </span>
    </CustomLink>
  );
};
