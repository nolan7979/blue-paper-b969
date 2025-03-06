import { useH2HData, useManagerData } from '@/hooks/useFootball';

import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import ConfrontationH from '@/components/common/skeleton/homePage/ConfrontationH';
import { H2HBadge } from '@/components/modules/football/H2HBadge';

import { SportEventDtoWithStat } from '@/constant/interface';
import { SPORT } from '@/constant/common';

const ManagerH2HSection = ({
  matchData,
  i18n,
}: {
  matchData: SportEventDtoWithStat;
  i18n: any;
}) => {
  const {
    data: managerData,
    isLoading: isLoadingManager,
    isFetching: isFetchingManager,
  } = useManagerData(matchData?.id || '');
  const { id, homeTeam, awayTeam, startTimestamp } = matchData;
  const {
    data: h2hData,
    isLoading: isLoadingH2H,
    isFetching: isFetchingH2H,
  } = useH2HData(id, homeTeam?.id, awayTeam?.id, startTimestamp,SPORT.FOOTBALL);

  if (isLoadingManager || isFetchingManager || !managerData) {
    return <ConfrontationH />;
  }
  if (isLoadingH2H || isFetchingH2H || !h2hData) {
    return <ConfrontationH />;
  }

  const { homeManager = {}, awayManager = {} } = managerData || {};
  const { managerDuel = {} } = h2hData || {};
  if (!homeManager || !awayManager || !managerDuel) {
    return <></>;
  }
  const { homeWins = 0, awayWins = 0, draws = 0 } = managerDuel;

  return (
    <div className=' space-y-3 p-4'>
      <div className='  text-center text-sm font-medium uppercase'>
        {i18n.titles.manager_h2h}
      </div>
      <div className=' flex'>
        <div className='flex w-1/6 place-content-center items-center p-1'>
          <CustomLink
            href={`/football/manager/${homeManager.slug}/${homeManager?.id}`}
            target='_parent'
          >
            <Avatar id={homeManager?.id} type='player' width={44} height={44} />
          </CustomLink>
        </div>
        <div className='flex-1'>
          <div className='flex justify-between'>
            <H2HBadge numMatch={homeWins} isHome />
            <H2HBadge numMatch={draws} isDraw />
            <H2HBadge numMatch={awayWins} isAway />
          </div>
          <div className='grid grid-cols-2 items-center'>
            <span>{homeManager.name}</span>
            <span className='text-right'>{awayManager.name}</span>
          </div>
        </div>
        <div className='flex w-1/6 place-content-center items-center p-1'>
          <CustomLink
            href={`/football/manager/${awayManager.slug}/${awayManager?.id}`}
            target='_parent'
          >
            <Avatar
              id={awayManager?.id}
              type='player'
              width={44}
              height={44}
              rounded={false}
            />
          </CustomLink>
        </div>
      </div>
    </div>
  );
};
export default ManagerH2HSection;
