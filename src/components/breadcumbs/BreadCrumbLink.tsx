'use client';
import tw from 'twin.macro';

import CustomLink from '@/components/common/CustomizeLink';
import { cn } from '@/utils/tailwindUtils';

export const BreadCumbLink = ({
  href,
  name,
  classes,
  isEnd = false,
  disabled = false,
}: {
  href?: string;
  name?: string;
  classes?: string;
  isEnd?: boolean;
  disabled?: boolean;
}) => {
  if (disabled) {
    return (
      <span
        className={cn(
          'max-w-[13rem] cursor-not-allowed truncate text-csm lg:max-w-fit',
          classes
        )}
      >
        {name}
      </span>
    );
  }

  return isEnd ? (
    <span
      className={cn(
        'max-w-[13rem] cursor-pointer truncate text-csm lg:max-w-fit',
        classes
      )}
    >
      {name}
    </span>
  ) : (
    <span className='max-w-[13rem] truncate sm:max-w-fit lg:max-w-fit'>
      <CustomLink
        href={href ? href : ''}
        className={cn('text-csm text-logo-blue font-medium hover:underline', classes)}
        target='_parent'
      >
        {name}
      </CustomLink>
    </span>
  );
};
