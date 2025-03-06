import useTrans from '@/hooks/useTrans';
import Avatar from '@/components/common/Avatar';

//icon summary
import StarBlank from '/public/svg/star-blank.svg';
import CalendarFill from '/public/svg/calendar-fill.svg';
import PlayerSVG from '/public/svg/player.svg';
import ForeignSVG from '/public/svg/foreign.svg';
import NationalSVG from '/public/svg/national.svg';
import { calTeamAvgAge } from '@/utils';
import { Player, TeamDetails } from '@/models/interface';
import { SPORT } from '@/constant/common';
import { useFollowStore } from '@/stores/follow-store';
import { useEffect, useState } from 'react';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { getFavoriteType, getSportType } from '@/utils/matchFilter';
import { useSubsFavoriteById } from '@/hooks/useFavorite';
import { useSession } from 'next-auth/react';

type SummaryProps = {
  id: string;
  teamDetails: Partial<TeamDetails>;
  teamPlayers:{
    players: Player[];
    foreignPlayers: number;
    nationalPlayers: number;
  };
};

export const Summary: React.FC<SummaryProps> = ({
  id,
  teamDetails,
  teamPlayers,
}) => {
  const i18n = useTrans();
  const { players } = teamPlayers || {};
  const avgAge = calTeamAvgAge(players);

  const sportType = SPORT.CRICKET;
  const { data: session = {} } = useSession();
  const { mutate: mutateFavorite } = useSubsFavoriteById();

  const { teamFollowed } = useFollowStore((state) => ({
    teamFollowed: state.followed.teams,
  })); // get player follow from state

  const { addTeam, removeTeam } = useFollowStore();
  const [isFollowedTeam, setIsFollowedTeam] = useState(false);
  useEffect(() => {
    const playerSport = teamFollowed[sportType]
      ? teamFollowed[sportType]
      : [];
    const isFollowed = playerSport.some((item:any) => item?.id === teamDetails?.id);
    setIsFollowedTeam(isFollowed);
  }, [teamDetails, teamFollowed, sportType]);
  const changeFollow = () => {
    const newTeam:any = { id: teamDetails?.id, name: teamDetails.name, slug: teamDetails.slug };
    if (!isFollowedTeam) {
      addTeam(sportType, newTeam);
    } else {
      removeTeam(sportType, newTeam);
    }
    // if(session && Object.keys(session).length > 0) {
    //   const dataFavoriteId = {
    //     id: teamDetails?.id,
    //     sportType: getSportType(sportType),
    //     type: getFavoriteType('competitor'),
    //     isFavorite: !isFollowedTeam,
    //   }
    //   mutateFavorite({session, dataFavoriteId})
    // }
  };

  return (
    <div className='mb-6 flex w-full flex-wrap overflow-hidden lg:rounded-lg dark-away-score lg:bg-transparent'>
      <div className='relative flex w-full items-center bg-transparent lg:bg-white lg:dark:bg-dark-stadium px-4 py-6 lg:w-1/2 lg:py-3'>
        <div className='absolute right-4 top-3' onClick={changeFollow}>
          {isFollowedTeam ? <StarYellowNew className='h-6 w-6' /> :<StarBlank className='h-6 w-6' />}
        </div>
        <div className='flex items-center gap-3'>
          <Avatar
            isBackground={false}
            id={id}
            type='team'
            width={90}
            height={90}
          />
          <h3 className='mb-2 font-oswald text-2xl font-semibold capitalize text-white lg:text-black lg:dark:text-white'>
            {teamDetails?.name}
          </h3>
        </div>
      </div>
      <div className='grid w-full grid-cols-2 grid-rows-3 bg-transparent lg:bg-white lg:dark:bg-dark-summary lg:w-1/2'>
        <div className='col-span-2 row-start-1 h-[68px] border-b border-player-summary px-4 py-3'>
          <h4 className='mb-[6px] text-[11px] text-light-secondary'>
            {i18n.competitor.country}
          </h4>
          {teamDetails?.country ? (
            <div className='flex items-center gap-2'>
              <Avatar
                id={teamDetails?.country?.id}
                type='country'
                width={24}
                height={24}
                rounded={false}
                isBackground={false}
              />
              <div className='flex flex-col items-start'>
                <b className='text-[13px] font-semibold text-white lg:text-black lg:dark:text-white'>
                  {teamDetails?.country?.name}
                </b>
              </div>
            </div>
          ) : (
            <div className='font-semibold text-white'>--</div>
          )}
        </div>
        <div className='h-[68px] border-b border-player-summary px-4 py-3 lg:border-l'>
          <h4 className='mb-[6px] text-[11px] text-light-secondary'>
            {i18n.titles.players}
          </h4>
          <div className='flex items-center gap-2'>
            <PlayerSVG className='h-6 w-6' />
            <b className='text-[13px] font-semibold text-white lg:text-black lg:dark:text-white'>
              {!!players?.length ? players.length : '--'}
            </b>
          </div>
        </div>
        <div className='h-[68px] border-b border-l border-player-summary px-4 py-2'>
          <h4 className='mb-[6px] text-[11px] text-light-secondary'>
            {i18n.competitor.avgAge}
          </h4>
          <div className='flex items-center gap-2'>
            <CalendarFill className='h-6 w-6' />
            <b className='text-[13px] font-semibold text-white lg:text-black lg:dark:text-white'>
              {avgAge ? avgAge : '--'}
            </b>
          </div>
        </div>
        <div className='h-[68px] border-b border-player-summary px-4 py-3 lg:border-l'>
          <h4 className='mb-[6px] text-[11px] text-light-secondary'>
            {i18n.competitor.foreignPlayer}
          </h4>
          <div className='flex items-center gap-2'>
            <ForeignSVG className='h-6 w-6' />
            <b className='text-[13px] font-semibold text-white lg:text-black lg:dark:text-white'>
              {teamDetails?.foreignPlayers ? teamDetails?.foreignPlayers : '--'}
            </b>
          </div>
        </div>
        <div className='h-[68px] border-l border-player-summary px-4 py-3'>
          <h4 className='mb-[6px] text-[11px] text-light-secondary'>
            {i18n.competitor.nationPlayer}
          </h4>
          <div className='flex items-center gap-2'>
            <NationalSVG className='h-6 w-6' />
            <b className='text-[13px] font-semibold text-white lg:text-black lg:dark:text-white'>
              {teamDetails?.nationalPlayers
                ? teamDetails?.nationalPlayers
                : '--'}
            </b>
          </div>
        </div>
      </div>
    </div>
  );
};
