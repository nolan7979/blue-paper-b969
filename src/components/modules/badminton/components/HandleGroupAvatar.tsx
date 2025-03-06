import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { SPORT } from '@/constant/common';
import React, { useCallback } from 'react';

interface ICoupleAvatar {
  team: any;
  sport: string | any;
  size: number;
  disabled?: boolean;
  onlyImage?: boolean;
}

const HandleGroupAvatar = ({
  team,
  sport,
  size,
  disabled,
  onlyImage,
}: ICoupleAvatar) => {
  let subIdsArray: string[] = [];

  if (team?.sub_ids && team?.sub_ids.length > 0) {
    if (Array.isArray(team?.sub_ids)) {
      subIdsArray = team.sub_ids as string[];
    } else if (typeof team?.sub_ids === 'string') {
      if (team.sub_ids.includes('~')) {
        subIdsArray = team.sub_ids.split('~');
      } else if (team.sub_ids !== '') {
        subIdsArray = [team.id];
      }
    }
  } else {
    subIdsArray = [team?.id];
  }

  const ml = () => {
    const sizeSpace = size / 4;
    switch (sizeSpace) {
      case 5:
        return '-ml-1';
      case 6:
        return '-ml-2';
      case 10:
      case 12:
        return '-ml-3';
      case 16:
        return '-ml-4';
      default:
        return '-ml-2';
    }
  };

  const memoizedAvatar = useCallback(
    (id: string) => {
      return (
        <Avatar
          id={id}
          type='team'
          sport={sport}
          width={size}
          height={size}
          isSmall={size < 40}
          rounded={[SPORT.TABLE_TENNIS, SPORT.TENNIS, SPORT.BADMINTON].includes(sport)}
          isBackground={[SPORT.TABLE_TENNIS, SPORT.TENNIS, SPORT.BADMINTON].includes(sport)}
        />
      );
    },
    [sport, size]
  );

  return (
    <>
      {subIdsArray && subIdsArray.length > 0 && (
        <div className='flex gap-1'>
          {subIdsArray.map((it: string, idx: number) => (
            <div key={it} className={`${idx > 0 && ml()}`}>
              {onlyImage ? (
                memoizedAvatar(it)
              ) : (
                <CustomLink
                  className='event-none'
                  href={`/${sport}/player/${team?.slug || team?.name}/${it}`}
                  target='_parent'
                  disabled={
                    disabled ||
                    ![SPORT.FOOTBALL, SPORT.BADMINTON].includes(sport)
                  }
                >
                  {memoizedAvatar(it)}
                </CustomLink>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default HandleGroupAvatar;
