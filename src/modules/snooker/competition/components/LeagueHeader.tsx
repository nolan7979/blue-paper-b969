import { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { HiPlus } from 'react-icons/hi';

import { useMessage } from '@/hooks/useFootball/useMessage';
import useTrans from '@/hooks/useTrans';

import { Select } from '@/components/common';
import Avatar from '@/components/common/Avatar';
import { TwCard } from '@/components/modules/football/tw-components';

import { useFollowStore } from '@/stores/follow-store';

import { NOTICE_TYPE } from '@/constant/common';
import { isValEmpty } from '@/utils';

import MessageBoxSVG from '/public/svg/message-box.svg';
import OneSVG from '/public/svg/one.svg';

const LeagueHeader = ({
  uniqueTournament,
  seasons,
  seasonGetter,
  selectedSeason,
  useLayout = true,
}: {
  uniqueTournament: any;
  seasons: any;
  seasonGetter: any;
  selectedSeason?: any;
  useLayout?: boolean;
}) => {
  const i18n = useTrans();
  const sportType = 'football';

  const { mutate } = useMessage();
  const { tournamentFollowed } = useFollowStore((state) => ({
    tournamentFollowed: state.followed.tournament,
  })); // get player follow from state

  const { addTournament, removeTournament } = useFollowStore();
  const [isFollowedTour, setIsFollowedTour] = useState(false);

  useEffect(() => {
    const tournamentSport = tournamentFollowed[sportType]
      ? tournamentFollowed[sportType]
      : [];
    const isFollowed = tournamentSport.some(
      (item) => item?.id === uniqueTournament?.id
    );
    setIsFollowedTour(isFollowed);
  }, [sportType, tournamentFollowed, uniqueTournament]);
  const changeFollow = () => {
    const newTournament = {
      id: uniqueTournament?.id,
      name: uniqueTournament.name,
      slug: `${uniqueTournament.slug}`,
    };
    if (!isFollowedTour) {
      mutate({
        matchId: uniqueTournament?.id,
        isSubscribe: true,
        locale: i18n ? i18n.language : 'en',
        type: NOTICE_TYPE.competition,
      });
      addTournament(sportType, newTournament);
    } else {
      mutate({
        matchId: uniqueTournament?.id,
        isSubscribe: false,
        locale: i18n ? i18n.language : 'en',
        type: NOTICE_TYPE.competition,
      });
      removeTournament(sportType, newTournament);
    }
  };
  if (!uniqueTournament) return <></>; // TODO: skeletons

  const { name, category = {} } = uniqueTournament || {};

  return (
    <TwCard
      className={`${useLayout && 'layout'
        } hidden lg:flex flex-col gap-4 py-3 md:flex-row`}
    >
      <div className='flex flex-1 items-center gap-4 pl-4'>
        <Avatar
          id={uniqueTournament?.id}
          type='competition'
          width={80}
          height={80}
          isBackground={false}
          rounded={false}
        />

        <div className=' flex flex-col place-content-center gap-1' test-id='club-name'>
          <h1 className='text-xl font-bold not-italic lg:text-xl lg:font-black'>
            {name}
          </h1>
          <div className=' flex items-center gap-4'>
            <div className='lg:text-md overflow-hidden text-xs uppercase '>
              {category.name}
            </div>
            <div className='pr-3 lg:pr-0'>
              {!isValEmpty(seasons) && (
                <Select
                  options={seasons}
                  label='year'
                  classes='!w-32'
                  valueGetter={seasonGetter}
                  isTime
                ></Select>
              )}
            </div>
            {/* TODO */}
            <div className=' hidden text-sm md:inline'>{i18n.time.time}</div>
          </div>
        </div>
      </div>
      <div className='min-w-1/3 flex place-content-center px-2 lg:px-4'>
        <div className='flex place-content-center items-center gap-x-4 rounded-full bg-light-match px-4 py-3 dark:bg-dark-match lg:px-8'>
          <div className='relative'>
            <MessageBoxSVG className='h-10 w-10'></MessageBoxSVG>
            <FaBell className='absolute right-0 top-0 h-5 w-5 text-logo-yellow'></FaBell>
            <OneSVG className='absolute right-0 top-0 h-3 w-3 text-red-600'></OneSVG>
          </div>
          <div className='space-y-1.5'>
            <div className='text-sm font-semibold not-italic leading-5'>
              {i18n.activity.receive_notifications}
            </div>
            <div className='flex items-center gap-3'>
              <button
                className={`flex items-center gap-1 rounded-full ${isFollowedTour ? 'bg-light-black' : 'bg-dark-win'
                  } px-3 py-2 text-csm font-medium not-italic leading-4 text-white`}
                onClick={() => changeFollow()}
              >
                {isFollowedTour ? (
                  <span>{i18n.activity.following}</span>
                ) : (
                  <span className='flex items-center gap-1'>
                    {i18n.activity.follow} <HiPlus />
                  </span>
                )}
              </button>
              <span className='flex items-center gap-1 text-csm'>
                <span className=' text-dark-win'>2.9k</span>
                <span className=' '>{i18n.activity.following_users}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </TwCard>
  );
};

export default LeagueHeader;
