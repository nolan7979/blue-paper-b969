import axios from 'axios';
import { NextPageContext } from 'next';

import useTrans from '@/hooks/useTrans';

import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/common';
import Avatar from '@/components/common/Avatar';
import Seo from '@/components/Seo';

import { Player } from '@/models';

import { EmptyEvent } from '@/components/common/empty';
import {
  TwFilterCol,
  TwFilterTitle,
  TwSectionWrapper,
} from '@/components/modules/common';
import QuickViewSummary from '@/components/modules/table-tennis/quickviewColumn/QuickViewSummary';
import { SportEventDtoWithStat, TeamDto } from '@/constant/interface';
import { useFeatureMatchPlayerData } from '@/hooks/useTableTennis';
import { AllTeam } from '@/modules/table-tennis/competition/components';
import { MatchCard } from '@/modules/table-tennis/competitor/components';
import StarBlank from '/public/svg/star-blank.svg';
import { SPORT } from '@/constant/common';
import { useFollowStore } from '@/stores/follow-store';
import { useEffect, useState } from 'react';
import { StarYellowNew } from '@/components/icons/StarYellowNew';
import { getFavoriteType, getSportType } from '@/utils/matchFilter';
import { useSession } from 'next-auth/react';
import { useSubsFavoriteById } from '@/hooks/useFavorite';
import {
  FeaturedMatch,
} from '@/components/modules/table-tennis/competition';

interface Props {
  player: any;
  matchData: SportEventDtoWithStat[];
  listPlayers: TeamDto[];
}

const PlayerDetailedPage = ({ player, matchData, listPlayers }: Props) => {
  const i18n = useTrans();
  const { id: playerId, name: playerName } = player || {
    team: { id: '', name: '' },
  };
  const contentSEO = (playerName?: any) => {
    if (!playerName) {
      return {
        templateTitle: i18n.seo.player.title.replaceAll('{playerName}', ''),
        description: i18n.seo.player.description.replaceAll('{playerName}', ''),
      };
    }

    const templateTitle = i18n.seo.player.title.replaceAll(
      '{playerName}',
      playerName
    );
    const description = i18n.seo.player.description.replaceAll(
      '{playerName}',
      playerName
    );

    return {
      templateTitle,
      description,
    };
  };

  const { data } = useFeatureMatchPlayerData(playerId);

  return (
    <>
      <Seo {...contentSEO(playerName)} />
      <div className='layout hidden lg:block'>
        <BreadCrumb className='overflow-x-scroll py-2.5 no-scrollbar'>
          <BreadCumbLink href='/table-tennis' name={i18n.header.table_tennis} />
          <BreadCrumbSep />
          <BreadCumbLink
            href={`/table-tennis/player/${playerId}`}
            name={playerName}
            isEnd
          />
        </BreadCrumb>
      </div>

      <div className='pb-8'>
        <div className='layout flex flex-col gap-6 lg:flex-row'>
          <div className='sticky top-20 hidden w-[208px] no-scrollbar lg:block lg:h-[91vh] lg:overflow-y-scroll'>
            <TwFilterCol className='flex-shrink-1 sticky top-20 w-full max-w-[209px] no-scrollbar lg:h-[91vh] lg:overflow-y-scroll'>
              <TwFilterTitle className='font-oswald'>
                {i18n.clubs.youMayBe}
              </TwFilterTitle>
              <AllTeam teams={listPlayers} />
            </TwFilterCol>
          </div>
          <div className='flex-1'>
            <SummaryPlayerCard player={player} />
            <MatchCard
              playerId={playerId}
              matchData={matchData || []}
              showFormBadge
            />
          </div>
          <div className='sticky top-20 w-full no-scrollbar lg:h-[91vh] lg:w-[385px] lg:overflow-y-scroll'>
            {(!!data && (
              <FeaturedMatch match={data as SportEventDtoWithStat} />
            )) || (
              <TwSectionWrapper className='rounded-md dark:bg-primary-gradient'>
                <EmptyEvent content={i18n.notification.notiTitle} />
              </TwSectionWrapper>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerDetailedPage;

PlayerDetailedPage.getInitialProps = async (context: NextPageContext) => {
  const { query } = context;
  const { playerParams = [] } = query;
  const playerId = playerParams[playerParams.length - 1];

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/table-tennis/player/${playerId}`;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {},
  };

  const player = await axios
    .request(config)
    .then((response) => {
      return response.data.data || {};
    })
    .catch((error) => {
      return -1;
    });

  const configMatchEvent = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/table-tennis/player/${playerId}/events/last/0`,
    headers: {},
  };

  const matchData = await axios
    .request(configMatchEvent)
    .then((response) => {
      return response.data.data.events || [];
    })
    .catch((error) => {
      return [];
    });

  const configListPlayer = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/table-tennis/player/${playerId}/suggestion`,
    headers: {},
  };

  const listPlayersData = await axios
    .request(configListPlayer)
    .then((response) => {
      return response.data.data || [];
    })
    .catch((error) => {
      return [];
    });

  if (player === -1) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    player,
    matchData,
    listPlayers: Object.values(listPlayersData),
  };
};
const SummaryPlayerCard = ({ player }: any) => {
  const sportType = SPORT.TABLE_TENNIS;
  const { data: session = {} } = useSession();
  const { mutate } = useSubsFavoriteById();

  const { playerFollowed } = useFollowStore((state) => ({
    playerFollowed: state.followed.players,
  })); // get player follow from state

  const { addPlayer, removePlayer } = useFollowStore();
  const [isFollowedPlayer, setIsFollowedPlayer] = useState(false);
  useEffect(() => {
    const playerSport = playerFollowed[sportType]
      ? playerFollowed[sportType]
      : [];
    const isFollowed = playerSport.some((item) => item?.id === player?.id);
    setIsFollowedPlayer(isFollowed);
  }, [player, playerFollowed, sportType]);
  const changeFollow = () => {
    const newPlayer = { id: player?.id, name: player.name, slug: player.slug };
    if (!isFollowedPlayer) {
      addPlayer(sportType, newPlayer);
    } else {
      removePlayer(sportType, newPlayer);
    }
    // if(session && Object.keys(session).length > 0) {
    //   const dataFavoriteId = {
    //     id: player?.id,
    //     sportType: getSportType(sportType),
    //     type: getFavoriteType('player'),
    //     isFavorite: !isFollowedPlayer,
    //   }
    //   mutate({session, dataFavoriteId})
    // }
  };
  return (
    <div className='dark:dark-away-score mb-6 flex w-full flex-wrap overflow-hidden lg:rounded-lg lg:bg-transparent'>
      <div className='relative flex w-full items-center bg-line-default px-4 py-6 dark:bg-dark-stadium lg:py-3'>
        <div className='absolute right-4 top-3' onClick={changeFollow}>
          {isFollowedPlayer ? <StarYellowNew className='h-6 w-6' /> :<StarBlank className='h-6 w-6' />}
        </div>
        <div className='flex w-full items-center justify-center gap-3'>
          <Avatar id={player?.id} type='team' width={90} height={90} />
          <div>
            <h3 className='mb-2 font-oswald text-2xl font-semibold capitalize text-black dark:text-white'>
              {player?.name}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};
