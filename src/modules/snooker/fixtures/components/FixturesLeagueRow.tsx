/* eslint-disable @next/next/no-img-element */

import CustomLink from '@/components/common/CustomizeLink';

//  create LeageRowProps props
export interface LeageRowProps {
  alt: string;
  href: string;
  src: string;
}

export const FixturesLeageRow = ({ alt, href, src }: LeageRowProps) => {
  return (
    <CustomLink
      href={href}
      className='cursor-pointer bg-transparent '
      target='_parent'
    >
      <div className='flex cursor-pointer items-center pr-3 hover:bg-light-main dark:hover:bg-dark-hl-1 dark:hover:brightness-200 lg:py-1 lg:pl-3'>
        {!src ? (
          <></>
        ) : (
          <img
            src={src}
            alt={alt}
            className='object-cover'
            width={24}
            height={24}
          />
        )}
        <span
          className='ml-3 min-w-0 truncate text-left text-sm font-normal leading-5'
          style={{ listStyle: 'outside' }}
        >
          {alt}
        </span>
      </div>
    </CustomLink>
  );
};
