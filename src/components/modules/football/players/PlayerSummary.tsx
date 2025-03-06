import CustomLink from '@/components/common/CustomizeLink';

import Avatar from '@/components/common/Avatar';
import { formatTimestamp, getAgeFromTimestamp } from '@/utils';
import { SPORT } from '@/constant/common';
import useTrans from '@/hooks/useTrans';

// icon
import StarBlank from '/public/svg/star-blank.svg';
import CalendarFill from '/public/svg/calendar-fill.svg';
import PHeight from '/public/svg/p-height.svg';
import FootPrints from '/public/svg/foot-prints.svg';
import TShirt from '/public/svg/t-shirt.svg';
import PositionSVG from '/public/svg/field.svg';
import { useFollowStore } from '@/stores/follow-store';
import { useEffect, useState } from 'react';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { useSession } from 'next-auth/react';
import { useSubsFavoriteById } from '@/hooks/useFavorite';
// import { getFavoriteType, getSportType } from '@/utils/matchFilter';
// import exp from 'constants';

const PlayerSummary = ({
  playerDetail,
  isDesktop
}: {
  playerDetail: any;
  isDesktop?: boolean;
}) => {
  const i18n = useTrans();
  const sportType = SPORT.FOOTBALL;
  const { data: session = {} } = useSession();
  const { mutate } = useSubsFavoriteById();

  const { playerFollowed } = useFollowStore((state) => ({
    playerFollowed: state.followed.players,
  })); // get player follow from state

  const { addPlayer, removePlayer } = useFollowStore();
  const [isFollowedPlayer, setIsFollowedPlayer] = useState(false);
  useEffect(() => {
    const playerSport = playerFollowed[sportType]
      ? playerFollowed[sportType]
      : [];
    const isFollowed = playerSport.some((item) => item?.id === playerDetail?.id);
    setIsFollowedPlayer(isFollowed);
  }, [playerDetail, playerFollowed, sportType]);
  const changeFollow = () => {
    const newPlayer = { id: playerDetail?.id, name: playerDetail.name, slug: playerDetail.slug };
    if (!isFollowedPlayer) {
      addPlayer(sportType, newPlayer);
    } else {
      removePlayer(sportType, newPlayer);
    }
    // if(session && Object.keys(session).length > 0) {
    //   const dataFavoriteId = {
    //     id: playerDetail?.id,
    //     sportType: getSportType(SPORT.FOOTBALL),
    //     type: getFavoriteType('player'),
    //     isFavorite: !isFollowedPlayer,
    //   }
    //   mutate({session, dataFavoriteId})
    // }
  };
  
  return (
    <div className='block lg:flex w-full flex-wrap overflow-hidden lg:rounded-lg'>
      <div className='relative flex justify-center lg:justify-start w-full items-center lg:custom-bg-white lg:dark:bg-dark-card dark-away-score px-4 py-6 lg:w-1/2 lg:py-3'>
        <div className='absolute right-4 top-3' onClick={changeFollow}>
          {isFollowedPlayer ? <StarYellowNew className='h-6 w-6' /> :<StarBlank className='h-6 w-6' />}
        </div>
        <div className='flex flex-col lg:flex-row items-center gap-3'>
          <Avatar id={playerDetail?.id} type='player' width={90} height={90} sport={SPORT.FOOTBALL} />
          <div>
            <h3 className='mb-2 font-oswald text-2xl font-semibold capitalize text-white lg:text-black lg:dark:text-white'>
              {playerDetail?.name}
            </h3>
            {
              playerDetail?.team && isDesktop && (
                <PlayerClubInfo playerDetail={playerDetail} />
              )
            }
          </div>
        </div>
      </div>
      {isDesktop && <PlayerSummaryDetail playerDetail={playerDetail} />}
    </div>
  );
};

export default PlayerSummary;

export const PlayerClubInfo = ({playerDetail}: any) => {
  const i18n = useTrans();
  return (
    <div className='flex gap-3 pl-4 lg:pl-0'>
      <CustomLink
        href={`/${SPORT.FOOTBALL}/competitor/${playerDetail?.team?.slug}/${playerDetail?.team?.id}`}
        target='_parent'
      >
        <Avatar
          id={playerDetail?.team?.id}
          type='team'
          width={40}
          height={40}
          rounded={false}
          isBackground={false}
        />
      </CustomLink>
      <div>
        <h4 className='text-[13px] font-medium capitalize text-black dark:text-white'>
          {playerDetail?.team?.name}
        </h4>
        <p className=' text-[11px] text-light-secondary'>
          {i18n && i18n.player.contractExpiration} {' '}
          {(playerDetail?.contractUntilTimestamp > 0 &&
            `${formatTimestamp(playerDetail?.contractUntilTimestamp, 'yyyy-MM-dd')}`) ||
            '- -'}
        </p>
      </div>
    </div>
  )
};

export const PlayerSummaryDetail = ({playerDetail}: any) => {
  const i18n = useTrans();
  return (
    <div className='grid w-full grid-cols-2 grid-rows-3 bg-white dark:bg-dark-card lg:w-1/2'>
      <div className='h-[68px] border-b border-line-default dark:border-dark-time-tennis px-4 py-3 lg:border-l'>
        <h4 className='mb-[6px] text-[11px] text-light-secondary'>
          {i18n && i18n.player.nationality}
        </h4>
        {playerDetail?.nationality ? (
          <div className='flex items-center gap-2'>
            <Avatar
              id={playerDetail?.nationality?.id}
              type='country'
              width={24}
              height={24}
              rounded={false}
              isBackground={false}
            />
            <div className='flex flex-col items-start'>
              <b className='text-[13px] font-semibold text-black dark:text-white whitespace-nowrap truncate max-w-36 lg:max-w-26'>
                {playerDetail?.nationality?.name}
              </b>
            </div>
          </div>
        ) : (
          <div className='font-semibold text-black dark:text-white'>--</div>
        )}
      </div>
      <div className='h-[68px] border-b border-l border-line-default dark:border-dark-time-tennis px-4 py-2'>
        <h4 className='mb-[6px] text-[11px] text-light-secondary'>
          {i18n.player.birthday}
        </h4>
        <div className='flex items-start gap-2'>
          <CalendarFill className='h-6 w-6' />
          <div className='flex flex-col items-start'>
            <b className='text-[13px] font-semibold text-black dark:text-white'>
              {playerDetail?.dateOfBirthTimestamp
                ? formatTimestamp(playerDetail?.dateOfBirthTimestamp, 'yyyy-MM-dd')
                : '--'}
            </b>
            {playerDetail?.dateOfBirthTimestamp && (
              <p className='text-[11px] text-light-secondary'>
                {getAgeFromTimestamp(playerDetail?.dateOfBirthTimestamp)} {i18n.qv.age_unit}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className='h-[68px] border-b border-line-default dark:border-dark-time-tennis px-4 py-3 lg:border-l'>
        <h4 className='mb-[6px] text-[11px] text-light-secondary'>
          {i18n.player.height}
        </h4>
        <div className='flex items-center gap-2'>
          <PHeight className='h-6 w-6' />
          <div className='flex flex-col items-start'>
            <b className='text-[13px] font-semibold text-black dark:text-white'>
              {playerDetail?.height ? playerDetail?.height : '--'} cm
            </b>
          </div>
        </div>
      </div>
      <div className='h-[68px] border-b border-l border-line-default dark:border-dark-time-tennis px-4 py-3'>
        <h4 className='mb-[6px] text-[11px] text-light-secondary'>
          {i18n.player.preferFoot}
        </h4>
        <div className='flex items-center gap-2'>
          <FootPrints className='h-6 w-6' />
          <div className='flex flex-col items-start'>
            <b className='text-[13px] font-semibold text-black dark:text-white'>
              {playerDetail?.preferredFoot ? playerDetail?.preferredFoot : '--'}
            </b>
          </div>
        </div>
      </div>
      <div className='h-[68px] border-l border-line-default dark:border-dark-time-tennis px-4 py-3'>
        <h4 className='mb-[6px] text-[11px] text-light-secondary'>
          {i18n.player.shirtNo}
        </h4>
        <div className='flex items-center gap-2'>
          <TShirt className='h-6 w-6' />
          <div className='flex flex-col items-start'>
            <b className='text-[13px] font-semibold text-black dark:text-white'>
              {playerDetail?.jerseyNumber ? playerDetail?.jerseyNumber : '--'}
            </b>
          </div>
        </div>
      </div>
      <div className='h-[68px] border-l border-line-default dark:border-dark-time-tennis px-4 py-3'>
        <h4 className='mb-[6px] text-[11px] text-light-secondary'>
          {i18n.player.position}
        </h4>
        <div className='flex items-center gap-2'>
          <PositionSVG className='h-6 w-6' />
          <div className='flex flex-col items-start'>
            <b className='text-[13px] font-semibold text-black dark:text-white'>
              {playerDetail?.position ? playerDetail?.position : '--'}
            </b>
          </div>
        </div>
      </div>
    </div>
  )
};