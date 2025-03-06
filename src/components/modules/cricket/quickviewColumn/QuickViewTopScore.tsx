import { useLeagueTopPlayersData } from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';

import EmptySection from '@/components/common/empty';
import StandingRow from '@/components/common/skeleton/competition/StandingRow';
import { PlayerStatsV2 } from '@/components/modules/football/players';
import {
  TwQuickViewSection,
  TwSkeletonRectangle,
} from '@/components/modules/football/tw-components';
import { SportEventDto } from '@/constant/interface';
import { getImage, Images } from '@/utils';
import { SPORT } from '@/constant/common';

interface ITopPlayerItem {
  playedEnough: boolean;
  player: {
    id: string;
    name: string;
    slug: string;
    shortname: string;
  };
  team: {
    id: string;
    name: string;
    shortName: string;
    slug: string;
  };
  stat: number;
}

const QuickViewTopScore = ({ matchData }: { matchData: SportEventDto }) => {
  const { season, tournament } = matchData;

  const ArrayFromOnetoNine = Array.from(
    { length: 20 },
    (_, index) => index + 1
  );

  const seasonId = season?.id ?? '';
  const competitionId = tournament?.id;
  const i18n = useTrans();

  const { data, isLoading } = useLeagueTopPlayersData(competitionId, seasonId);

  if (!season || !season?.id || !tournament || !tournament?.id || !matchData) {
    return null;
  }
  if (isLoading)
    return (
      <TwSkeletonRectangle className='dark:bg-primary-gradient !h-fit'>
        {ArrayFromOnetoNine.map((number) => (
          <StandingRow key={number} />
        ))}
      </TwSkeletonRectangle>
    );

  if (!data || Object.keys(data).length <= 0 || !data.topPlayers) {
    return <EmptySection content={i18n.common.nodata} />;
  }

  if (data.topPlayers && data.topPlayers.goals) {
    return (
      <TwQuickViewSection className='dark:bg-dark-skeleton lg:rounded-lg'>
        <div className='flex justify-between p-2.5  dark:bg-dark-skeleton dark:text-dark-text lg:my-2 lg:dark:bg-transparent'>
          <div className='w-20 text-csm font-normal leading-4'>
            # {i18n.titles.players}
          </div>
          <div className='flex-1'></div>
          <div className='text-center text-csm font-normal capitalize leading-4'>
            {i18n.stat.goals}
          </div>
        </div>
        <ul className='divide-list'>
          {data.topPlayers.goals.map((d: ITopPlayerItem, index: number) => (
            <li key={index} className='item-hover cursor-pointer px-2.5 py-2'>
              <PlayerStatsV2
                playerId={d.player?.id}
                name={d.player.name}
                imgUrl={`${getImage(
                  Images.player,
                  d.player?.id,
                  true,
                  SPORT.FOOTBALL
                )}`}
                statType='goals'
                statValue={d.stat}
                position={index + 1}
                team={d.team}
              ></PlayerStatsV2>
            </li>
          ))}
        </ul>
      </TwQuickViewSection>
    );
  } else {
    return <EmptySection content={i18n.common.nodata} />;
  }
};

export default QuickViewTopScore;
