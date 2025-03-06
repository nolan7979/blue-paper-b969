import Avatar from '@/components/common/Avatar';
import CustomizeLink from '@/components/common/CustomizeLink';
import { getSlug } from '@/utils/common-utils';

const ScoreHomeAndAwayTeam = ({
  isFirst,  
  homeScore,
  awayScore,
  homeId,
  awayId,
  homeName,
  awayName,
  matchId,
}: {
  isFirst: boolean;
  homeScore: number;
  awayScore: number;
  homeId: string;
  homeName: string;
  awayId: string;
  awayName: string;
  matchId: string;
}) => {
  return (
    <CustomizeLink className='w-full' href={`/football/match/${getSlug(homeName)}-${getSlug(awayName)}/${matchId}`}>
    <div
      className={`flex h-[2.188rem] w-full items-center justify-center gap-1 lg:gap-3 rounded-full bg-white ${
        isFirst ? 'dark:bg-active dark:border-linear-form' : 'dark:bg-dark-head-tab '
      } py-2`}
      test-id='score-team'
    >
      <Avatar
        id={homeId}
        type='team'
        width={24}
        height={24}
        rounded={false}
        isBackground={false}
        isSmall
      />
      <div className='text-csm font-medium text-black dark:text-white' test-id='score-firsh-leg'>
        {homeScore} - {awayScore}
      </div>
      <Avatar
        id={awayId}
        type='team'
        width={24}
        height={24}
        rounded={false}
        isSmall
        isBackground={false}
      />
    </div>
    </CustomizeLink>
  );
};

export default ScoreHomeAndAwayTeam;
