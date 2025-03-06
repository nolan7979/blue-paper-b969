import useTrans from '@/hooks/useTrans';
import Avatar from '@/components/common/Avatar';

//icon summary
import StarBlank from '/public/svg/star-blank.svg';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import CalendarFill from '/public/svg/calendar-fill.svg';
import PlayerSVG from '/public/svg/player.svg';
import ForeignSVG from '/public/svg/foreign.svg';
import NationalSVG from '/public/svg/national.svg';
import { calTeamAvgAge } from '@/utils';
import { Player, TeamDetails } from '@/models/interface';
import { useEffect, useState } from 'react';
import { useFollowStore } from '@/stores';
import { useMessage } from '@/hooks/useFootball/useMessage';
import { NOTICE_TYPE, SPORT } from '@/constant/common';

type SummaryProps = {
  id: string;
  teamDetails: Partial<TeamDetails>;
  teamPlayers:{
    players: Player[];
    foreignPlayers: number;
    nationalPlayers: number;
  };
  isDesktop?: boolean;
};

export const Summary: React.FC<SummaryProps> = ({
  id,
  teamDetails,
  teamPlayers,
  isDesktop,
}) => {
  const i18n = useTrans();
  const { players } = teamPlayers || {};
  const avgAge = calTeamAvgAge(players);

  const { teamFollowed } = useFollowStore((state) => ({
    teamFollowed: state.followed.teams,
  }));

  const { addTeam, removeTeam } = useFollowStore();
  const { mutate } = useMessage();

  const [isFollowedTeam, setIsFollowedTeam] = useState(false);
  useEffect(() => {
    const team = teamFollowed[SPORT.FOOTBALL] ? teamFollowed[SPORT.FOOTBALL] : [];

    const isFollowed = team.some(
      (teamMember:any) => teamMember?.id === teamDetails?.id
    );
    setIsFollowedTeam(isFollowed);
  }, [SPORT.FOOTBALL, teamDetails, teamFollowed]);
  const changeFollow = () => {
    const newTeam:any = { id: teamDetails?.id, name: teamDetails?.name, slug: teamDetails.slug };
    if (!isFollowedTeam) {
      mutate({
        matchId: id,
        isSubscribe: true,
        locale: i18n ? i18n.language : 'en',
        type: NOTICE_TYPE.competitor,
      });
      addTeam(SPORT.FOOTBALL, newTeam);
    } else {
      removeTeam(SPORT.FOOTBALL, newTeam);
      mutate({
        matchId: id,
        isSubscribe: false,
        locale: i18n ? i18n.language : 'en',
        type: NOTICE_TYPE.competitor,
      });
    }
  };

  return (
    <div className='lg:mb-6 flex w-full flex-wrap overflow-hidden lg:rounded-lg dark-away-score lg:bg-transparent'>
      <div className='relative flex w-full items-center bg-transparent lg:bg-white lg:dark:bg-dark-stadium px-4 py-6 lg:w-1/2 lg:py-3'>
        <div className='absolute right-4 top-3' onClick={changeFollow}>
          {isFollowedTeam ? <StarYellowNew className='h-6 w-6' /> :<StarBlank className='h-6 w-6' />}
        </div>
        <div className='flex flex-col lg:flex-row justify-center items-center gap-3 w-full'>
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
      {isDesktop && <DetailClub teamDetails={teamDetails} players={players} avgAge={avgAge} i18n={i18n} />}
    </div>
  );
};

export const DetailClub = ({teamDetails, players, avgAge, i18n}:any) => {
  return (
    <div className='grid w-full grid-cols-2 grid-rows-3 bg-transparent lg:bg-white lg:dark:bg-dark-summary lg:w-1/2'>
      <div className='col-span-2 row-start-1 h-[68px] border-b border-l border-player-summary px-4 py-3'>
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
              <b className='text-[13px] font-semibold text-black dark:text-white lg:text-black lg:dark:text-white'>
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
          <b className='text-[13px] font-semibold text-black dark:text-white lg:text-black lg:dark:text-white'>
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
          <b className='text-[13px] font-semibold text-black dark:text-white lg:text-black lg:dark:text-white'>
            {avgAge ? avgAge : '--'}
          </b>
        </div>
      </div>
      <div className='h-[68px] border-player-summary px-4 py-3 lg:border-l'>
        <h4 className='mb-[6px] text-[11px] text-light-secondary'>
          {i18n.competitor.foreignPlayer}
        </h4>
        <div className='flex items-center gap-2'>
          <ForeignSVG className='h-6 w-6' />
          <b className='text-[13px] font-semibold text-black dark:text-white lg:text-black lg:dark:text-white'>
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
          <b className='text-[13px] font-semibold text-black dark:text-white lg:text-black lg:dark:text-white'>
            {teamDetails?.nationalPlayers
              ? teamDetails?.nationalPlayers
              : '--'}
          </b>
        </div>
      </div>
    </div>
  )
}