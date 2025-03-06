import { ITeamStreaksItem } from '@/constant/interface';

import CheckSVG from '/public/svg/check-green.svg';
import Avatar from '@/components/common/Avatar';

const TeamStreakRow = ({
  team1 = {},
  item,
  team2 = {},
}: {
  team1?: any;
  item?: ITeamStreaksItem;
  team2?: any;
}) => {
  
  const { name: streakName, value = '', continued, fields } = item || {};

  // const teamStreakLocale = getItem(LOCAL_STORAGE.statsLocaleDetail);
  // const team_streak = JSON.parse(teamStreakLocale!);

  return (
    <li className='dev2 grid grid-cols-5 items-center px-4 py-2 lg:p-2'>
      <div className=''>
        <Avatar id={team1?.id} type='team' width={20} height={20} isBackground={false} rounded={false} />
      </div>
      
      <div className='dev2 col-span-3 text-center'>
        {fields}
      </div>

      <div className='dev2 flex items-center justify-end space-x-2'>
        <span>{value}</span>
        <span className='stroke-dark-green'>
          <CheckSVG></CheckSVG>
        </span>
      </div>
    </li>
  );
};
export default TeamStreakRow;
