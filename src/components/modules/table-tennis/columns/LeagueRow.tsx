import { useCallback, useEffect, useMemo, useState } from 'react';

import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';

import { useFollowStore } from '@/stores/follow-store';

import { SPORT } from '@/constant/common';
import { SportEventDtoWithStat, TournamentDto } from '@/constant/interface';
import { extractCompetitionId, getSlug, isCountryName, checkStickyOfMainScreen } from '@/utils';
import { getFavoriteType, getSportType } from '@/utils/matchFilter';
import { useSession } from 'next-auth/react';
import { useSubsFavoriteById } from '@/hooks/useFavorite';
import { useScrollStore } from '@/stores/scroll-progess';
import useDeviceOrientation from '@/hooks/useDeviceOrientation';
import { useScrollVisible } from '@/stores/scroll-visible';
import { useRouter } from 'next/router';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';

export const LeagueRow = ({
  match,
  isLink,
}: {
  match: SportEventDtoWithStat;
  isLink: boolean;
}) => {
  const { data: session = {} } = useSession();
  const { mutate } = useSubsFavoriteById();
  const sportType = SPORT.TABLE_TENNIS;
  const { uniqueTournament } = match;
  const { category } = uniqueTournament || {};
  const isLandscape = useDeviceOrientation();
  const isVisible = useScrollVisibility({ isLandscape });
  const router = useRouter();
  const { query } = router;
  const getFilter = (query?.qFilter as string) || 'all';
  const isSticky= checkStickyOfMainScreen()

  const { tournamentFollowed, addTournament, removeTournament } =
    useFollowStore((state) => ({
      tournamentFollowed: state.followed.tournament,
      addTournament: state.addTournament,
      removeTournament: state.removeTournament,
    }));

  const isTournamentFollowed = (
    uniqueTournament?: TournamentDto,
    followedTournaments?: any
  ) => {
    const tournamentSport = followedTournaments[sportType] || [];
    return tournamentSport.some(
      (item: any) => item?.id === uniqueTournament?.id
    );
  };
  const [isFollowedTour, setIsFollowedTour] = useState(() =>
    isTournamentFollowed(uniqueTournament, tournamentFollowed)
  );

  useEffect(() => {
    setIsFollowedTour(
      isTournamentFollowed(uniqueTournament, tournamentFollowed)
    );
  }, [uniqueTournament, tournamentFollowed]);

  const newTournament: any = useMemo(
    () => ({
      id: uniqueTournament?.id,
      name: uniqueTournament?.name,
      slug: uniqueTournament?.slug,
    }),
    [uniqueTournament]
  );

  const changeFollow = useCallback(() => {
    if (!isFollowedTour) {
      addTournament(sportType, newTournament);
    } else {
      removeTournament(sportType, newTournament);
    }
    // if(session && Object.keys(session).length > 0) {
    //   const dataFavoriteId = {
    //     id: uniqueTournament?.id,
    //     sportType: getSportType(sportType),
    //     type: getFavoriteType('competition'),
    //     isFavorite: !isFollowedTour,
    //   }
    //   mutate({session, dataFavoriteId})
    // }
  }, [isFollowedTour, addTournament, removeTournament, newTournament]);

  const buildCompetitionLink = useCallback(
    () =>
      `/table-tennis/competition/${
        uniqueTournament?.slug || getSlug(uniqueTournament?.name)
      }/${uniqueTournament?.id?.split('_')[0] || ''}`,
    [uniqueTournament]
  );

  //Custom className components
  const topPosition = !isVisible
  ? getFilter === 'live'
    ? 'md:top-[90px] top-[80px]'
    : 'top-[135px]'
  : getFilter === 'live'
  ? 'top-[155px]'
  : 'top-[209px]';

  const stickyClass =  isSticky? 'stickyMobiCustom' : 'static';
  const checkBgMain = isSticky ? 'dark:bg-dark-main' : 'dark:bg-dark-wrap-match';
  const containerClass = `flex items-center gap-x-1.5 
    ${isLandscape ? 'static' : stickyClass} 
    ${topPosition} 
    z-[4] 
    bg-dark-main bg-light-main lg:bg-transparent ${checkBgMain}
    h-[2.375rem]`;
  //
  return (
    <div className={containerClass} test-id='match-row'>
      <div className='flex w-12 items-center justify-end'>
        <CustomLink
          disabled={!isLink}
          href={buildCompetitionLink()}
          className='hover:text-logo-blue'
          target='_parent'
        >
          <Avatar
            id={extractCompetitionId(uniqueTournament?.id)}
            type='competition'
            height={24}
            width={24}
            rounded={false}
            isBackground={false}
            isSmall={true}
            sport={SPORT.TABLE_TENNIS}
          />
        </CustomLink>
      </div>
      <div
        className='flex w-80 flex-col items-start truncate leading-normal  md:w-full md:flex-1'
        test-id='match-category'
      >
        {category?.name && (
          <div className='cursor-default text-msm dark:text-dark-text'>
            {
              isCountryName(category?.name) && category?.name
              // (
              //   <Link
              //     href={`/tennis/country/${getSlug(category?.name)}/${
              //       category?.id
              //     }`}
              //     className='hover:text-logo-blue'
              //   >
              //     {category?.name}
              //   </Link>
              // )
            }
          </div>
        )}
        <CustomLink
          href={buildCompetitionLink()}
          className='text-csm font-normal text-black hover:text-logo-blue dark:text-white'
          target='_parent'
          disabled={!isLink}
          test-id='tourname-name'
        >
          {uniqueTournament?.name}
        </CustomLink>
      </div>
      <div className='flex w-5  items-center justify-end' test-id='star-icon'>
        <div onClick={changeFollow}>
          {isFollowedTour ? (
            <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />
          ) : (
            <StarBlank className='inline-block h-4 w-4 cursor-pointer' />
          )}
        </div>
      </div>
    </div>
  );
};
