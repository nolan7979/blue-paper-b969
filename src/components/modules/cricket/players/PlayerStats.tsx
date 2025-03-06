/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';

import CustomLink from '@/components/common/CustomizeLink';
import { RatingBadge } from '@/components/modules/football/RatingBadge';

import Avatar from '@/components/common/Avatar';
import { getImage, getSlug, Images, isValEmpty } from '@/utils';
import { SPORT } from '@/constant/common';

export const PlayerStats = ({
  playerId,
  name,
  imgUrl,
  statType,
  statValue,
  rating = 0,
  shirtNo = 0,
  imgSize = 36,
  position = 0,
  team = {},
  category = '',
  playPosition = '',
}: {
  playerId: string;
  name: string;
  imgUrl: string;
  statType: string;
  statValue: any;
  rating?: number;
  shirtNo?: number;
  imgSize?: number;
  position?: number;
  team?: any;
  category?: string;
  playPosition?: string;
}) => {
  return (
    <CustomLink href={`/football/player/${playerId}`} target='blank'>
      <div id="player-list" className='  flex items-center gap-2 xl:gap-4'>
        <span
          className='w-5 text-center text-csm font-normal leading-4'
          test-id='position'
        >
          {position}
        </span>

        <Avatar
          id={playerId}
          type='player'
          width={`${imgSize}px`}
          height={`${imgSize}px`}
          isSmall
        />

        <div className=' flex flex-1 justify-between'>
          <div className='space-y-0.5'>
            <div
              className=' flex gap-x-2 text-csm font-medium'
              test-id='player-name'
            >
              {shirtNo > 0 ? `${shirtNo}`.padStart(2, '0') + ' - ' : ''}
              {name}
            </div>

            {!isValEmpty(team) && (
              <div className='flex items-center gap-1.5 text-xs text-dark-text'>
                <Avatar
                  id={team?.id}
                  type='team'
                  width={14}
                  height={14}
                  isBackground={false}
                  rounded={false}
                  isSmall
                />

                <span test-id='name-team'>{team?.name}</span>
              </div>
            )}
            {playPosition && (
              <div
                className='text-xs font-thin text-dark-text'
                test-id='play-position'
              >
                {playPosition}
              </div>
            )}
          </div>
          <div className='flex w-16 place-content-end items-center pr-1'>
            {statType === 'rating' && statValue > 0 && (
              <div className='' test-id='rating'>
                <RatingBadge point={statValue}></RatingBadge>
              </div>
            )}
            {statType !== 'rating' && (
              <span
                className='text-sm font-normal leading-4'
                test-id='stat-value'
              >
                {statValue}
              </span>
            )}
          </div>
        </div>
      </div>
    </CustomLink>
  );
};

export const PlayerStatsV2 = ({
  playerId,
  name,
  imgUrl,
  statType,
  statValue,
  rating = 0,
  shirtNo = 0,
  imgSize = 36,
  position = 0,
  team = {},
  category = '',
  playPosition = '',
}: {
  playerId: string;
  name: string;
  imgUrl: string;
  statType: string;
  statValue: any;
  rating?: number;
  shirtNo?: number;
  imgSize?: number;
  position?: number;
  team?: any;
  category?: string;
  playPosition?: string;
}) => {
  const [isError, setIsError] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);

  return (
    <CustomLink href={`/football/player/${playerId}`} target='blank' className='w-full'>
      <div  id="player-list"  className='  flex items-center gap-2 xl:gap-4'>
        <span test-id='position' className='w-5 text-center text-csm font-normal leading-4'>
          {position}
        </span>

        <img
          src={isError ? '/images/football/players/unknown1.webp' : imgUrl}
          onError={() => {
            setIsError(true);
          }}
          alt='...'
          width={imgSize}
          height={imgSize}
          className='rounded-full'
        ></img>

        <div className=' flex flex-1 justify-between'>
          <div className='space-y-0.5'>
            <div test-id='player-name' className=' flex gap-x-2 text-csm font-medium'>
              {shirtNo > 0 ? `${shirtNo}`.padStart(2, '0') + ' - ' : ''}
              {name}
            </div>

            {!isValEmpty(team) && (
              <div className='flex items-center gap-1.5 text-xs text-dark-text'>
                <Avatar
                  id={team?.id}
                  type='team'
                  isBackground={false}
                  rounded={false}
                  width={14}
                  height={14}
                  isSmall
                />
                <span test-id='name-team'>{team?.name}</span>
              </div>
            )}
            {playPosition && (
              <div className='text-xs font-thin text-dark-text'>
                {playPosition}
              </div>
            )}
          </div>
          <div className='flex w-16 place-content-end items-center pr-1'>
            {statType === 'rating' && statValue > 0 && (
              <div className=''>
                <RatingBadge point={statValue}></RatingBadge>
              </div>
            )}
            {statType !== 'rating' && (
              <span test-id='stat-value' className='text-sm font-normal leading-4'>{statValue}</span>
            )}
          </div>
        </div>
      </div>
    </CustomLink>
  );
};

export const PlayerPerGameStats = ({
  playerId,
  name,
  imgUrl,
  statType,
  statValue,
  // rating = 0,
  shirtNo = 0,
  imgSize = 36,
  position = 0,
  event = {},
}: {
  playerId: string;
  name: string;
  imgUrl: string;
  statType: string;
  statValue: any;
  shirtNo?: number;
  imgSize?: number;
  position?: number;
  event?: any;
}) => {
  const [isError, setIsError] = useState<boolean>(false);
  const [err1, setErr1] = useState<boolean>(false);
  const [err2, setErr2] = useState<boolean>(false);

  const {
    homeTeam = {},
    awayTeam = {},
    homeScore = {},
    awayScore = {},
  } = event || {};

  return (
    <div  id="player-list"  className='  flex items-center gap-2 xl:gap-4'>
      <span  test-id='position'  className='w-5 text-center text-csm font-normal leading-4'>
        {position}
      </span>

      <CustomLink href={`/football/player/${playerId}`} target='blank'>
        <img
          src={isError ? '/images/football/players/unknown1.webp' : imgUrl}
          onError={() => {
            setIsError(true);
          }}
          alt='...'
          width={imgSize}
          height={imgSize}
          className='rounded-full'
        ></img>
      </CustomLink>

      <div className=' flex flex-1 justify-between'>
        <div className='space-y-0.5'>
          <div className=' flex gap-x-2 text-csm'>
            {shirtNo > 0 ? `${shirtNo}`.padStart(2, '0') + ' - ' : ''}
            {name}
          </div>
          <div className='flex w-24 items-center rounded-full bg-light-match p-1 dark:bg-dark-head-tab'>
            <img
              src={`${
                err1
                  ? '/images/football/teams/unknown-team.png'
                  : `${getImage(
                      Images.team,
                      homeTeam?.id,
                      true,
                      SPORT.FOOTBALL
                    )}`
              }`}
              alt='...'
              width={18}
              height={18}
              onError={() => setErr1(true)}
            ></img>
            {/* Score */}
            <div className='flex-1 text-center text-xs font-bold leading-3'>
              {homeScore.display} - {awayScore.display}
            </div>

            <img
              src={`${
                err2
                  ? '/images/football/teams/unknown-team.png'
                  : `${getImage(
                      Images.team,
                      awayTeam?.id,
                      true,
                      SPORT.FOOTBALL
                    )}`
              }`}
              alt='...'
              width={18}
              height={18}
              onError={() => setErr2(true)}
            ></img>
          </div>
        </div>
        <div className='flex w-16  place-content-end items-center pr-1'>
          {statType === 'rating' && statValue > 0 && (
            <div className='flex items-center justify-end'>
              <RatingBadge point={statValue}></RatingBadge>
            </div>
          )}
          {statType !== 'rating' && (
            <span test-id='stat-value' className='text-sm font-normal leading-4'>{statValue}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export const TeamStats = ({
  teamId,
  name,
  imgUrl,
  statType,
  statValue,
  // rating = 0,
  shirtNo = 0,
  imgSize = 36,
  position = 0,
}: {
  teamId: string;
  name: string;
  imgUrl: string;
  statType: string;
  statValue: any;
  shirtNo?: number;
  imgSize?: number;
  position?: number;
}) => {
  const [isError, setIsError] = useState<boolean>(false);

  return (
    <div  id="player-list"  className='  flex items-center gap-2 xl:gap-4'>
      <span  test-id='position'  className='w-5 text-center text-csm font-normal leading-4'>
        {position}
      </span>

      <CustomLink
        href={`/football/competitor/${getSlug(name)}/${teamId}`}
        target='_parent'
      >
        <img
          src={isError ? '/images/football/players/unknown1.webp' : imgUrl}
          onError={() => {
            setIsError(true);
          }}
          alt='...'
          width={imgSize}
          height={imgSize}
          className='rounded-full'
        ></img>
      </CustomLink>

      <div className=' flex flex-1 justify-between'>
        <div className='space-y-0.5'>
          <div className=' flex gap-x-2 text-csm'>
            {shirtNo > 0 ? `${shirtNo}`.padStart(2, '0') + ' - ' : ''}
            {name}
          </div>
        </div>
        <div className='flex w-16  place-content-end items-center pr-1'>
          {(statType === 'rating' || statType === 'avgRating') &&
            statValue > 0 && (
              <div className=''>
                <RatingBadge point={statValue}></RatingBadge>
              </div>
            )}
          {!['rating', 'avgRating'].includes(statType) && (
            <span test-id='stat-value' className='text-sm font-normal leading-4'>{statValue}</span>
          )}
        </div>
      </div>
    </div>
  );
};
