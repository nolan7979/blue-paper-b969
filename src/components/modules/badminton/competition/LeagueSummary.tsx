import { useCallback, useEffect, useMemo, useState } from 'react';
import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { SeasonDto, TournamentDto } from '@/constant/interface';
import { useFollowStore } from '@/stores/follow-store';
import Avatar from '@/components/common/Avatar';
import { SPORT } from '@/constant/common';
import {
  CountrySeason,
  ProgressBar,
} from '@/components/modules/badminton/competition';
import { getFavoriteType, getSportType } from '@/utils/matchFilter';
import { useSession } from 'next-auth/react';
import { useSubsFavoriteById } from '@/hooks/useFavorite';
import { useDetectDeviceClient } from '@/hooks/useWindowSize';

type LeagueSummaryProps = {
  uniqueTournament: TournamentDto;
  seasons: SeasonDto[];
  setSelectedSeason: (season: SeasonDto) => void;
  selectedSeason: SeasonDto;
};

export const LeagueSummary: React.FC<LeagueSummaryProps> = ({
  uniqueTournament,
  seasons,
  setSelectedSeason,
  selectedSeason,
}) => {
  const { isDesktop } = useDetectDeviceClient();
  const { data: session = {} } = useSession();
  const { mutate } = useSubsFavoriteById();
  const sportType = SPORT.BADMINTON;
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
    <div className='grid dark-away-score lg:bg-transparent grid-cols-1 lg:grid-cols-2 lg:rounded-xl'>
      <div className='bg-transparent lg:bg-white lg:dark:bg-dark-stadium px-3 py-4 lg:rounded-l-lg'>
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
          <div className='flex items-center justify-center gap-3' test-id='tournament-badminton-detail'>
            <Avatar
              id={uniqueTournament?.id}
              type='competition'
              width={90}
              height={90}
              isBackground={false}
              rounded={false}
              sport={SPORT.BADMINTON}
            />
            <h1 className='font-oswald text-4xl text-white lg:text-black lg:dark:text-white'>
              {uniqueTournament.short_name || uniqueTournament.name}
            </h1>
          </div>
        </div>
      </div>
      <div className='flex  flex-col justify-center gap-4 bg-transparent lg:bg-white lg:dark:bg-[#091550] px-3 py-4 lg:rounded-r-lg lg:border-l dark:border-0 border-line-default'>
        <CountrySeason
          uniqueTournament={uniqueTournament}
          seasons={seasons}
          setSelectedSeason={setSelectedSeason}
          selectedSeason={selectedSeason}
        />
        {/* //* mock progress bar */}
        {isDesktop && <ProgressBar uniqueTournament={uniqueTournament} selectedSeason={selectedSeason} isDesktop={isDesktop} />}
      </div>
    </div>
  );
};
