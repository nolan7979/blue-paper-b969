import { SPORT } from '@/constant/common';
//icon
import AmericanFootballIcon from '/public/svg/sport/am-football.svg';
import BadmintonIcon from '/public/svg/sport/badminton.svg';
import BaseballIcon from '/public/svg/sport/baseball.svg';
import BasketballIcon from '/public/svg/sport/basketball.svg';
import CricketIcon from '/public/svg/sport/cricket.svg';
import FootballIcon from '/public/svg/sport/football.svg';
import IceHockeyIcon from '/public/svg/sport/ice-hockey.svg';
import TennisIcon from '/public/svg/sport/tennis.svg';
import VolleyballIcon from '/public/svg/sport/volleyball.svg';
import TableTennisIcon from '/public/svg/sport/table-tennis.svg';

const CheckIconSport: React.FC<{
  sport:string
}> = ({ sport }) => {
  switch (sport) {
    case SPORT.FOOTBALL:
      return <FootballIcon className="w-5 h-5 text-black dark:text-white" />;
    case SPORT.BADMINTON:
      return <BadmintonIcon className="w-5 h-5 text-black dark:text-white" />;
    case SPORT.BASEBALL:
      return <BaseballIcon className="w-5 h-5 text-black dark:text-white" />;
    case SPORT.BASKETBALL:
      return <BasketballIcon className="w-5 h-5 text-black dark:text-white" />;
    case SPORT.CRICKET:
      return <CricketIcon className="w-5 h-5 text-black dark:text-white" />;
    case SPORT.AMERICAN_FOOTBALL:
      return <AmericanFootballIcon className="w-5 h-5 text-black dark:text-white" />;
    case SPORT.ICE_HOCKEY:
      return <IceHockeyIcon className="w-5 h-5 text-black dark:text-white" />;
    case SPORT.TABLE_TENNIS:
      return <TableTennisIcon className="w-5 h-5 text-black dark:text-white" />;
    case SPORT.TENNIS:
      return <TennisIcon className="w-5 h-5 text-black dark:text-white" />;
    case SPORT.VOLLEYBALL:
      return <VolleyballIcon className="w-5 h-5 text-black dark:text-white" />;
    default:
      return <FootballIcon className="w-5 h-5 text-black dark:text-white" />;
  }
};
export default CheckIconSport;
