import Avatar from "@/components/common/Avatar";
import CustomLink from "@/components/common/CustomizeLink";
import { StarBlank } from "@/components/icons/StarBlank";
import { StarYellowNew } from "@/components/icons/StarYellowNew";
import { SPORT } from "@/constant/common";
import { SportEventDtoWithStat, TournamentDto } from "@/constant/interface";
import { useSubsFavoriteById } from "@/hooks/useFavorite";
import { useFollowStore } from "@/stores/follow-store";
import { getFavoriteType, getSportType } from "@/utils/matchFilter";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";

const LeagueRow = ({
  match,
}: {
  match: SportEventDtoWithStat;
}) => {
  const { data: session = {} } = useSession();
  const { mutate } = useSubsFavoriteById();
  const { uniqueTournament = {} as any } = match;
  // const { category } = uniqueTournament;
  const sportType = SPORT.BASEBALL;
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
    setIsFollowedTour(isTournamentFollowed(uniqueTournament, tournamentFollowed));
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

  // const buildCompetitionLink = useCallback(
  //   () =>
  //     `/competition/${tournament?.slug}/${tournament?.id?.split('_')[0] || ''}`,
  //   [tournament]
  // );

  return (
    <div className='flex items-center gap-x-1.5 justify-between' test-id='match-row'>
      <div className='flex items-center gap-3'>
        <CustomLink
          href={`/baseball/competition/${uniqueTournament?.slug}/${uniqueTournament?.id}`}
          target='_parent'
        >
          <Avatar
            id={uniqueTournament?.id}
            type='competition'
            width={32}
            height={32}
            rounded={false}
            isBackground={false}
          />
        </CustomLink>
        <div>
          <h3 className='text-black dark:text-white text-[11px]'>{uniqueTournament?.name}</h3>
          { uniqueTournament?.country ? (
            <div className='flex gap-1'>
              <Avatar
                id={uniqueTournament?.country?.id}
                type='country'
                width={16}
                height={10}
                rounded={false}
                isBackground={false}
              />
              <span className='text-light-secondary uppercase text-[11px]'>{uniqueTournament?.country?.name ? uniqueTournament?.country?.name : '-'}</span>
            </div>
          ) : '--'}
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
