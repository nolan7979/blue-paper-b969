import { useCallback, useEffect, useMemo, useState } from 'react';
import { StarBlank } from '@/components/icons';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { SeasonDto, TournamentDto } from '@/constant/interface';
import { useFollowStore } from '@/stores/follow-store';
import Avatar from '@/components/common/Avatar';
import { SPORT } from '@/constant/common';
import {
  CountrySeason,
  ProgressBar, // Todo: refactor to common component
} from '@/components/modules/snooker/competition';
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
  const sportType = SPORT.SNOOKER;
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
  }, [isFollowedTour, addTournament, removeTournament, newTournament]);

  return (
    <div className='flex flex-col lg:flex-row dark-away-score lg:bg-transparent lg:rounded-xl'>
      <div className='flex-1 lg:bg-white lg:dark:bg-dark-stadium px-3 py-4 lg:rounded-l-lg'>
        <div className='flex justify-end'>
          <div
            onClick={changeFollow}
            test-id='star-follow'
            className='min-h-fit'
          >
            {isFollowedTour ? (
              <StarYellowNew className='h-4 w-4 cursor-pointer' />
            ) : (
              <StarBlank id='blank-start' className='h-4 w-4 cursor-pointer' />
            )}
          </div>
        </div>
        <div>
          <div className='flex flex-col lg:flex-row items-center justify-center gap-3'>
            <div className='w-[90px]'>
              <Avatar
                id={uniqueTournament?.id}
                type='competition'
                width={90}
                height={90}
                isBackground={false}
                rounded={false}
                sport={SPORT.SNOOKER}
              />
            </div>
            <h1 className='break-words font-oswald text-xl text-white lg:text-black lg:dark:text-white lg:text-4xl'>
              {uniqueTournament.short_name || uniqueTournament.name}
            </h1>
          </div>
        </div>
      </div>
      <div className='flex flex-1 flex-col items-center justify-center gap-4 lg:bg-white lg:dark:bg-[#091550] px-3 py-4 lg:items-start lg:rounded-r-lg'>
        <CountrySeason
          uniqueTournament={uniqueTournament}
          seasons={seasons}
          setSelectedSeason={setSelectedSeason}
          selectedSeason={selectedSeason}
          isMobile={isMobile}
        />
        {/* //* mock progress bar */}
        {isDesktop && <ProgressBar uniqueTournament={uniqueTournament} selectedSeason={selectedSeason} isDesktop={isDesktop} />}
      </div>
    </div>
  );
};
