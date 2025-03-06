import Image from 'next/image';

import CustomLink from '@/components/common/CustomizeLink';

//  create LeageRowProps props
export interface LeageRowProps {
  alt: string;
  href: string;
  src: string;
}

export const TopLeaguesRow = ({ alt, href, src }: LeageRowProps) => {
  return (
    <div>
      <CustomLink href={href} className='cursor-pointer' target='_parent'>
        <div className=' item-hover flex cursor-pointer items-center px-4 py-2'>
          <Image
            unoptimized={true}
            src={src}
            loading='lazy'
            alt={alt}
            className='object-cover'
            width={28}
            height={28}
          />
          <span
            className='ml-4 min-w-0 truncate text-left text-sm font-normal leading-5'
            style={{ listStyle: 'outside' }}
          >
            {alt}
          </span>
        </div>
      </CustomLink>
    </div>
  );
};
