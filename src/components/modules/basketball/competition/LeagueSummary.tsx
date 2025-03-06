import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { SeasonDto, TournamentDto } from '@/constant/interface';
import { useFollowStore } from '@/stores/follow-store';
import Avatar from '@/components/common/Avatar';
import { SPORT } from '@/constant/common';
import {
  CountrySeason,
  ProgressBar,
} from '@/components/modules/basketball/competition';
import { useSession } from 'next-auth/react';
import { useSubsFavoriteById } from '@/hooks/useFavorite';
import { useDetectDeviceClient } from '@/hooks/useWindowSize';

type LeagueSummaryProps = {
  uniqueTournament: TournamentDto;
  seasons: SeasonDto[];
  setSelectedSeason: (season: SeasonDto) => void;
  selectedSeason: SeasonDto;
  isMobile?: boolean;
};

export const LeagueSummary: React.FC<LeagueSummaryProps> = ({
  uniqueTournament,
  seasons,
  setSelectedSeason,
  selectedSeason,
  isMobile,
}) => {
  const { isDesktop } = useDetectDeviceClient();
  const { data: session = {} } = useSession();
  const { mutate } = useSubsFavoriteById();
  const sportType = SPORT.BASKETBALL;
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
      name: uniqueTournament.name,
      slug: uniqueTournament.slug,
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

  return (
    <div
      className={clsx('dark-away-score flex lg:rounded-xl', {
        'flex-col': isMobile,
      })}
    >
      <div
        className={clsx(
          'flex-1 bg-transparent px-3 lg:rounded-l-lg lg:bg-white lg:dark:bg-dark-stadium',
          { 'py-4': !isMobile }
        )}
      >
        <div className='flex justify-end'>
          <div
            onClick={changeFollow}
            test-id='star-follow'
            className='min-h-fit'
          >
            {isFollowedTour ? (
              <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />
            ) : (
              <StarBlank className='inline-block h-4 w-4 cursor-pointer' />
            )}
          </div>
        </div>
        <div>
          <div
            className={clsx('flex items-center justify-center gap-3', {
              'flex-col': isMobile,
            })}
            test-id='tournament-basketball-detail'
          >
            <Avatar
              id={uniqueTournament?.id}
              type='competition'
              width={90}
              height={90}
              isBackground={false}
              rounded={false}
              sport={SPORT.BASKETBALL}
            />
            <h1
              className={clsx(
                'font-oswald text-3xl text-white lg:text-black lg:dark:text-white',
                { 'text-center !text-2xl': !isDesktop }
              )}
            >
              {uniqueTournament.name || uniqueTournament.short_name}
            </h1>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          'flex flex-1 flex-col justify-center gap-4 bg-transparent px-3 py-4 lg:rounded-r-lg lg:bg-white lg:dark:bg-[#091550]',
          {
            'items-center': isMobile,
          }
        )}
      >
        <CountrySeason
          uniqueTournament={uniqueTournament}
          seasons={seasons}
          setSelectedSeason={setSelectedSeason}
          selectedSeason={selectedSeason}
          isMobile={isMobile}
        />
        {/* //* mock progress bar */}
        {isDesktop && (
          <ProgressBar
            uniqueTournament={uniqueTournament}
            selectedSeason={selectedSeason}
            isDesktop={isDesktop}
          />
        )}
      </div>
    </div>
  );
};
