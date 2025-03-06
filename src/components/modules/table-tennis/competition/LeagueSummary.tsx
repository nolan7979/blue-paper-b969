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
} from '@/components/modules/table-tennis/competition';
import { useTennisTournamentSeasonsData } from '@/hooks/useTennis';
import { unset } from 'lodash';
import { getFavoriteType, getSportType } from '@/utils/matchFilter';
import { useSession } from 'next-auth/react';
import { useSubsFavoriteById } from '@/hooks/useFavorite';

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
  const { data: session = {} } = useSession();
  const { mutate } = useSubsFavoriteById();
  const sportType = SPORT.TABLE_TENNIS;
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
  const isFlex = isMobile ? '' : 'flex';
  const isdarkAwayScore = isMobile ? 'dark-away-score lg:custom-bg-white lg:dark:dark-away-score' : 'dark-away-score lg:custom-bg-white lg:dark:bg-dark-stadium';
  const positionText = isMobile ? 'text-center' : 'text-left';

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
    <div className={`${isFlex}`}>
      <div className={`flex-1 ${isdarkAwayScore} px-3 py-4 lg:rounded-lg`}>
        <div className='flex justify-end'>
          {!isMobile && (
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
          )}
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className='flex items-center justify-center gap-3'>
            <Avatar
              id={uniqueTournament?.id}
              key={uniqueTournament?.id}
              type='competition'
              width={isMobile ? 80 : 90}
              height={isMobile ? 80 : 90}
              isBackground={false}
              rounded={false}
              sport={SPORT.TABLE_TENNIS}
              isMobile={isMobile}
            />
            <h3
              className={`${positionText} text-1xl font-oswald text-white lg:text-black lg:dark:text-white`}
            >
              {uniqueTournament.short_name || uniqueTournament.name}
            </h3>
          </div>
          <CountrySeason
            isMobile={isMobile}
            uniqueTournament={uniqueTournament}
            seasons={seasons}
            setSelectedSeason={setSelectedSeason}
            selectedSeason={selectedSeason}
          />
        </div>
      </div>
      {/* <div className={`${classCountrySeason}`}>
        <CountrySeason
          isMobile={isMobile}
          uniqueTournament={uniqueTournament}
          seasons={seasons}
          setSelectedSeason={setSelectedSeason}
          selectedSeason={selectedSeason}
        />
      </div> */}
    </div>
  );
};
