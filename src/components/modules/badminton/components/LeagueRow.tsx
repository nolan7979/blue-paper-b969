import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { StarBlank } from '@/components/icons/StarBlank';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { SPORT } from '@/constant/common';
import { SportEventDtoWithStat, TournamentDto } from '@/constant/interface';
import useDeviceOrientation from '@/hooks/useDeviceOrientation';
import { useSubsFavoriteById } from '@/hooks/useFavorite';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';
import { useFollowStore } from '@/stores/follow-store';
import { useScrollStore } from '@/stores/scroll-progess';
import { useScrollVisible } from '@/stores/scroll-visible';
import { checkStickyOfMainScreen } from '@/utils';
import { getFavoriteType, getSportType } from '@/utils/matchFilter';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

const LeagueRow = ({ match }: { match: SportEventDtoWithStat }) => {
  const { data: session = {} } = useSession();
  const { mutate } = useSubsFavoriteById();
  const sportType = SPORT.BADMINTON;
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
    tournament: TournamentDto,
    followedTournaments: any
  ) => {
    const tournamentSport = followedTournaments[sportType] || [];
    return tournamentSport.some((item: any) => item?.id === tournament?.id);
  };
  const [isFollowedTour, setIsFollowedTour] = useState(
    () =>
      uniqueTournament &&
      isTournamentFollowed(uniqueTournament, tournamentFollowed)
  );

  useEffect(() => {
    if (uniqueTournament)
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
      {' '}
      <div className='flex items-center gap-3'>
        <CustomLink
          href={`/badminton/competition/${uniqueTournament?.slug}/${uniqueTournament?.id}`}
          target='_parent'
        >
          <Avatar
            id={uniqueTournament?.id}
            type='competition'
            width={32}
            height={32}
            rounded={false}
            isBackground={false}
            isSmall
          />
        </CustomLink>
        <div>
          <CustomLink
            href={`/badminton/competition/${uniqueTournament?.slug}/${uniqueTournament?.id}`}
            target='_parent'
          >
            <h3 className='text-[11px] text-black dark:text-white'>
              {uniqueTournament?.name}
            </h3>
          </CustomLink>
          {uniqueTournament?.category ? (
            <div className='flex gap-1'>
              {/* <Avatar
                id={uniqueTournament?.category?.id}
                type='country'
                width={16}
                height={10}
                rounded={false}
                isBackground={false}
              /> */}
              <span className='text-[11px] text-light-secondary'>
                {uniqueTournament?.category?.name
                  ? uniqueTournament?.category?.name
                  : null}
              </span>
            </div>
          ) : null}
        </div>
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

export default LeagueRow;
