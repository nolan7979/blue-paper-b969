import { SoccerTeam } from '@/components/modules/football/quickviewColumn/QuickViewComponents';
import { RatingBadge } from '@/components/modules/football/RatingBadge';

const AppearanceEntry = ({
  league,
  logoUrl,
  appearance,
  rating,
}: {
  league: string;
  logoUrl: string;
  appearance?: string;
  rating?: number;
}) => {
  return (
    <li className=' flex items-center gap-4 py-2'>
      <span className=' w-10'>
        <SoccerTeam
          showName={false}
          logoUrl={logoUrl}
          name={league}
          logoSize={45}
        ></SoccerTeam>
      </span>
      <span className=' flex-1 text-csm font-semibold not-italic leading-5 dark:text-dark-text'>
        {league}
      </span>
      <span className=' text-xs font-normal not-italic leading-4'>
        {appearance}
      </span>
      {/* <span className=' w-14 text-xs font-semibold not-italic leading-5 text-logo-blue'>
        {rating}
      </span> */}
      <RatingBadge point={rating || 0} isSmall={false}></RatingBadge>
    </li>
  );
};
export default AppearanceEntry;
