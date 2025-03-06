import { SoccerTeam } from '@/components/modules/football/quickviewColumn/QuickViewComponents';

import { LOCAL_STORAGE } from '@/constant/common';
import { ITeamStreaksItem } from '@/constant/interface';
import { Images, getImage, isValEmpty } from '@/utils';
import { getItem } from '@/utils/localStorageUtils';

import CheckSVG from '/public/svg/check.svg';
import CloseSVG from '/public/svg/close.svg';

const TeamStreakRow = ({
  team1 = {},
  item,
  team2 = {},
}: {
  team1: any;
  item: ITeamStreaksItem;
  team2?: any;
}) => {
  const { name: streakName, value = '', continued, fields } = item || {};

  const teamStreakLocale = getItem(LOCAL_STORAGE.statsLocaleDetail);
  const team_streak = JSON.parse(teamStreakLocale!);

  return (
    <li className='dev2 grid grid-cols-5 items-center px-4 py-2 lg:p-2'>
      <div className='dev2 col-span-3'>
        {fields && team_streak ? team_streak[fields] : streakName}
      </div>

      {isValEmpty(team2) && (
        <div className=''>
          <SoccerTeam
            logoUrl={`${getImage(Images.team, team1?.id)}`}
            name={team1.name}
            team={team1}
            showName={false}
          ></SoccerTeam>
        </div>
      )}
      {!isValEmpty(team2) && (
        <div className='flex  items-center gap-1'>
          <SoccerTeam
            logoUrl={`${getImage(Images.team, team1?.id)}`}
            name={team1.name}
            team={team1}
            showName={false}
          ></SoccerTeam>
          <SoccerTeam
            logoUrl={`${getImage(Images.team, team2?.id)}`}
            name={team2.name}
            team={team2}
            showName={false}
          ></SoccerTeam>
        </div>
      )}

      <div className='dev2 flex items-center justify-end space-x-2'>
        <span>{value}</span>
        <span>
          {continued == 1 && <CheckSVG></CheckSVG>}
          {continued == 0 && <CloseSVG></CloseSVG>}
        </span>
      </div>
    </li>
  );
};
export default TeamStreakRow;
