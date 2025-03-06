import clsx from 'clsx';
import React, { useMemo, useState } from 'react';

import { getImage, Images, ImagesError, isNumber } from '@/utils';
import { useSportName } from '@/hooks';
import { twMerge } from 'tailwind-merge';

interface AvatarProps {
  type: keyof typeof Images;
  id: string | null | undefined;
  height?: string | number;
  width?: string | number;
  className?: string;
  rounded?: boolean;
  isBackground?: boolean;
  isSmall?: boolean;
  sport?: string;
  isMobile?: boolean;
  isObjectCover?: boolean;
  [key: string]: any;
}

const Avatar: React.FC<AvatarProps> = ({
  type,
  id,
  className,
  width,
  height,
  rounded = true,
  isBackground = true,
  isSmall = false,
  isMobile = false,
  sport: sportType,
  isObjectCover = false,
}) => {
  const [isErrorAvt, setIsErrorAvt] = useState<boolean>(false);
  const typeImage = type === 'competitor' ? 'team' : type;
  const sport = sportType ? sportType : useSportName();
  const isSmallDefault = useMemo(() => Number(width) <= 36, [width]);

  const convertPath = (type: keyof typeof Images): string | undefined => {
    if (type === 'competition' || type === 'competitor') {
      return 'teams';
    } else {
      const typePath = ImagesError[type];
      return typePath;
    }
  };

  return (
    <div
      className={clsx(`${isMobile && 'mx-auto'}`, className, {
        'rounded-full': !!rounded,
        'bg-white': !!isBackground,
      })}
      style={{
        width: isNumber(width) ? `${width}px` : width || '64px',
        height: isNumber(height) ? `${height}px` : height || '64px',
      }}
    >
      <img
        loading='lazy'
        src={
          isErrorAvt
            ? `/images/football/${convertPath(type)}/unknown1.png`
            : `${getImage(typeImage, id,isSmall ?isSmallDefault  :false, sport)}`
        }
        alt={`image-${id}`}
        className={twMerge(
          clsx('h-full w-full ', {
            'rounded-full': rounded,
            'object-contain': !isObjectCover,
            'object-cover': isObjectCover,
          })
        )}
        onError={() => setIsErrorAvt(true)}
        style={{
          width: isNumber(width) ? `${width}px` : width || '64px',
          minWidth: isNumber(width) ? `${width}px` : width || '64px',
          height: isNumber(height) ? `${height}px` : height || '64px',
          minHeight: isNumber(height) ? `${height}px` : height || '64px',
        }}
      />
    </div>
  );
};
const areEqual = (prevProps: AvatarProps, nextProps: AvatarProps) => {
  return prevProps?.id === nextProps.id && prevProps?.width === nextProps.width;
};

export default React.memo(Avatar, areEqual);
