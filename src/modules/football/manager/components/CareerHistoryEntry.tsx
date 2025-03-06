import { SoccerTeam } from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import { TwCareerText } from '@/components/modules/football/tw-components';
import { Images, formatTimestamp, getImage, roundNumber } from '@/utils';

const CareerHistoryEntry = ({ historyEntry }: { historyEntry?: any }) => {
  const {
    team = {},
    performance = {},
    startTimestamp,
    endTimestamp,
  } = historyEntry || {};

  const { total, wins, draws, losses, totalPoints = 0 } = performance || {};
  const period = `${formatTimestamp(
    startTimestamp,
    'yyyy/MM'
  )} - ${formatTimestamp(endTimestamp, 'yyyy/MM')}`;

  const avgPoints = roundNumber(totalPoints / (total || 1), 2);

  return (
    <li className=' flex items-center gap-4 py-1.5 '>
      <span className=' w-10'>
        <SoccerTeam
          showName={false}
          logoUrl={`${getImage(Images.team, team?.id)}`}
          name={team.name}
          logoSize={36}
          team={team}
        ></SoccerTeam>
      </span>
      <div className=' flex-1'>
        <div className='text-csm font-semibold not-italic leading-5 text-light-default dark:text-dark-default'>
          {team.name}
        </div>
        <div className='text-xs font-normal not-italic leading-4 text-dark-text'>
          {period}
        </div>
      </div>
      <div className=' flex w-2/5'>
        {/* <TwCareerText className='text-right'>{avgPoints}</TwCareerText> */}
        {/* <div className='flex justify-between'> */}
        <div className='w-1/5 text-right'>
          <TwCareerText className=''>{total}</TwCareerText>
        </div>
        <div className='w-1/5 text-right'>
          <TwCareerText className='text-dark-win'>{wins}</TwCareerText>
        </div>
        <div className='w-1/5 text-right'>
          <TwCareerText className='text-dark-draw'>{draws}</TwCareerText>
        </div>
        <div className='w-1/5 text-right'>
          <TwCareerText className='text-dark-loss'>{losses}</TwCareerText>
        </div>
        <div className='w-1/5 text-right'>
          <TwCareerText className='text-dark-orange'>{avgPoints}</TwCareerText>
        </div>
        {/* </div> */}
      </div>
    </li>
  );
};
export default CareerHistoryEntry;
