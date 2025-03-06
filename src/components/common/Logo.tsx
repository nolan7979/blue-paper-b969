import CustomLink from '@/components/common/CustomizeLink';
import Image from 'next/image';
import React, { useMemo } from 'react';
import LogoPNG from '/public/images/logo.png';
import { IMAGE_CDN_PATH } from '@/constant/common';

export const Logo = React.memo(() => {
  const memoizedImage = useMemo(
    () => (
      <img src={`${IMAGE_CDN_PATH}/public/images/logo.png`} alt='uni_score' loading='lazy' />
    ),
    []
  );

  return (
    <CustomLink href='/' aria-label='Home' target='_parent'>
      <div className='flex h-3.5 w-24 xl:h-[100%] xl:w-32'>{memoizedImage}</div>
    </CustomLink>
  );
});
