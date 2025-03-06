import Image from 'next/image';

import CustomLink from '@/components/common/CustomizeLink';

//  create LeageRowProps props
export interface LeageRowProps {
  alt: string;
  href: string;
  src: string;
}

export const BxhLeageRow = ({ alt, href, src }: LeageRowProps) => {
  return (
    // <CustomLink href={href} className='cursor-pointer bg-transparent ' shallow={true}>
    <CustomLink
      href={href}
      className='cursor-pointer bg-transparent '
      target='_parent'
    >
      <div className='flex cursor-pointer items-center pr-3 hover:bg-light-main dark:hover:bg-dark-hl-1 dark:hover:brightness-200 lg:py-1 lg:pl-3'>
        <Image
          unoptimized={true}
          src={src}
          alt={alt}
          className='object-cover'
          width={24}
          height={24}
        />
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
