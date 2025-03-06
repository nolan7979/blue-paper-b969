import Avatar from '@/components/common/Avatar';

const ScoreHomeAndAwayTeam = ({
  isFirst,
  homeScore,
  awayScore,
  homeId,
  awayId,
}: {
  isFirst: boolean;
  homeScore: number;
  awayScore: number;
  homeId: string;
  awayId: string;
}) => {
  return (
    <div
      className={`flex h-[2.188rem] w-full items-center justify-center gap-1 rounded-full ${
        isFirst ? 'bg-active border-linear-form ' : 'bg-dark-head-tab'
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
      <div className='text-csm font-medium text-white' test-id='score-firsh-leg'>
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
  );
};

export default ScoreHomeAndAwayTeam;
