import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { SPORT } from '@/constant/common';
import { getSlug } from '@/utils';
import React, { useCallback } from 'react';

interface IAvatarCommon {
  league: any;
  sport: string | any;
  size: number;
  disabled?: boolean;
  onlyImage?: boolean;
}

const AvatarLeagueCommon = ({
  league,
  sport,
  size,
  disabled,
  onlyImage,
}: IAvatarCommon) => {

  const memoizedAvatar = useCallback(
    (id: string) => {
      return (
        <Avatar
          id={id}
          type='competition'
          sport={sport}
          width={size}
          height={size}
          isSmall={size < 40}
          rounded={false}
          isBackground={false}
        />
      );
    },
    [sport, size]
  );

  return (
    <>
      {onlyImage ? (
        memoizedAvatar(league?.id)
      ) : (
        <CustomLink
          className='event-none'
          href={`/${sport}/competition/${league?.slug || getSlug(league?.name)}/${league?.id}`}
          target='_parent'
          disabled={disabled}
        >
          {memoizedAvatar(league?.id)}
        </CustomLink>
      )}
    </>
  );
};

export default AvatarLeagueCommon;
