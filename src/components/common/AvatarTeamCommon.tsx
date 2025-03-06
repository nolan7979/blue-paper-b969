import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { SPORT } from '@/constant/common';
import { CompetitorDto } from '@/constant/interface';
import { getSlug } from '@/utils';
import React, { useMemo } from 'react';

interface IAvatarCommon {
  team: CompetitorDto | undefined;
  sport: SPORT | string | undefined;
  size: number;
  disabled?: boolean;
  onlyImage?: boolean;
  maxAvatars?: number;
  className?: string;
}

const INDIVIDUAL_SPORTS = [SPORT.BADMINTON, SPORT.TABLE_TENNIS, SPORT.TENNIS, SPORT.SNOOKER];

const PLAYER_SPORTS = [SPORT.BADMINTON, SPORT.TABLE_TENNIS, SPORT.TENNIS];

const AvatarTeamCommon: React.FC<IAvatarCommon> = ({
  team,
  sport,
  size,
  disabled = false,
  onlyImage = false,
  maxAvatars,
  className = '',
}) => {
  const subIdsArray = useMemo(() => {
    if (!team) return [];
    
    if (team.sub_ids && team.sub_ids.length > 0) {
      if (Array.isArray(team.sub_ids)) {
        return team.sub_ids;
      }
      
      if (typeof team.sub_ids === 'string') {
        return team.sub_ids.includes('~') 
          ? team.sub_ids.split('~') 
          : team.sub_ids !== '' ? [team.sub_ids] : [team.id];
      }
    }
    
    return team.id ? [team.id] : [];
  }, [team]);
  
  const displayedIds = useMemo(() => {
    return maxAvatars ? subIdsArray.slice(0, maxAvatars) : subIdsArray;
  }, [subIdsArray, maxAvatars]);
  
  const isIndividualSport = useMemo(() => INDIVIDUAL_SPORTS.includes(sport as SPORT), [sport]);
  const isPlayerSport = useMemo(() => PLAYER_SPORTS.includes(sport as SPORT), [sport]);
  
  const getMarginClass = useMemo(() => {
    const sizeSpace = Math.floor(size / 4);
    
    const marginMap: Record<number, string> = {
      5: '-ml-1',
      6: '-ml-2',
      10: '-ml-3',
      12: '-ml-3',
      16: '-ml-4'
    };
    
    return marginMap[sizeSpace] || '-ml-2';
  }, [size]);
  
  const AvatarComponent = useMemo(() => {
    return (id: string) => (
      <Avatar
        id={id}
        type='team'
        sport={sport}
        width={size}
        height={size}
        isSmall={size < 40}
        rounded={isIndividualSport}
        isBackground={isIndividualSport}
      />
    );
  }, [sport, size, isIndividualSport]);

  const getTeamLink = useMemo(() => {
    return (id: string) => 
      `/${sport}/${isPlayerSport ? 'player' : 'competitor'}/${team?.slug || getSlug(team?.name)}/${id}`;
  }, [sport, isPlayerSport, team]);

  if (!displayedIds.length) return null;

  return (
    <div className={`flex items-center ${className}`}>
      {displayedIds.map((id, idx) => (
        <div 
          key={id} 
          className={`${idx > 0 ? getMarginClass : ''} transition-all`}
          style={{ zIndex: displayedIds.length - idx }}
        >
          {onlyImage ? (
            AvatarComponent(id)
          ) : (
            <CustomLink
              className='event-none hover:opacity-90 transition-opacity'
              href={getTeamLink(id)}
              target='_parent'
              disabled={disabled}
              aria-label={`View ${team?.name || 'team'} profile`}
            >
              {AvatarComponent(id)}
            </CustomLink>
          )}
        </div>
      ))}

      {maxAvatars && subIdsArray.length > maxAvatars && (
        <div className={`${getMarginClass} bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium`}
          style={{ width: size, height: size, zIndex: 0 }}>
          +{subIdsArray.length - maxAvatars}
        </div>
      )}
    </div>
  );
};

export default React.memo(AvatarTeamCommon);