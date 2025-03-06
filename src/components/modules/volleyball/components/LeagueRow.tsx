import Avatar from "@/components/common/Avatar";
import CustomLink from "@/components/common/CustomizeLink";
import { StarBlank } from "@/components/icons";
import { StarYellowNew } from "@/components/icons/StarYellowNew";
import { SPORT } from "@/constant/common";
import { SportEventDtoWithStat, TournamentDto } from "@/constant/interface";
import { useFollowStore } from "@/stores";
import { extractCompetitionId, getSlug, isCountryName } from "@/utils";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const LeagueRow = ({
  match,
}: {
  match: SportEventDtoWithStat;
}) => {
  const { uniqueTournament } = match;
  // const { category } = tournament;
  // const { tournamentFollowed, addTournament, removeTournament } =
  //   useFollowStore((state) => ({
  //     tournamentFollowed: state.followed.tournament,
  //     addTournament: state.addTournament,
  //     removeTournament: state.removeTournament,
  //   }));

  // const isTournamentFollowed = (
  //   tournament: TournamentDto,
  //   followedTournaments: any
  // ) => {
  //   const tournamentSport = followedTournaments['football'] || [];
  //   return tournamentSport.some((item: any) => item?.id === tournament?.id);
  // };
  // const [isFollowedTour, setIsFollowedTour] = useState(() =>
  //   isTournamentFollowed(tournament, tournamentFollowed)
  // );

  // useEffect(() => {
  //   setIsFollowedTour(isTournamentFollowed(tournament, tournamentFollowed));
  // }, [tournament, tournamentFollowed]);

  // const newTournament: any = useMemo(
  //   () => ({
  //     id: tournament?.id,
  //     name: tournament.name,
  //     slug: tournament.slug,
  //   }),
  //   [tournament]
  // );

  // const changeFollow = useCallback(() => {
  //   if (!isFollowedTour) {
  //     addTournament('football', newTournament);
  //   } else {
  //     removeTournament('football', newTournament);
  //   }
  // }, [isFollowedTour, addTournament, removeTournament, newTournament]);

  // const buildCompetitionLink = useCallback(
  //   () =>
  //     `/competition/${tournament?.slug}/${tournament?.id?.split('_')[0] || ''}`,
  //   [tournament]
  // );

  return (
    <div className='flex items-center gap-x-1.5' test-id='match-row'>
      <div className='flex items-center gap-3'>
        <CustomLink
          href={`/${SPORT.VOLLEYBALL}/competition/${uniqueTournament?.slug}/${uniqueTournament?.id}`}
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
      {/* <div className='flex w-5  items-center justify-end' test-id='star-icon'>
        <div onClick={changeFollow}>
          {isFollowedTour ? (
            <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />
          ) : (
            <StarBlank className='inline-block h-4 w-4 cursor-pointer' />
          )}
        </div>
      </div> */}
    </div>
  );
};

export default LeagueRow;