import { TwFilterButton } from '@/components/modules/cricket/tw-components';

interface MatchFilterProps {
  h2HFilter: string;
  setH2HFilter: (filter: string) => void;
  matchData: any;
}
const MatchFilter: React.FC<MatchFilterProps> = ({
  h2HFilter,
  setH2HFilter,
  matchData,
}) => {
  const { homeTeam = {}, awayTeam = {} } = matchData || {};

  return (
    <>
      <div className='flex gap-x-4 px-2 lg:px-0'>
        <TwFilterButton
          isActive={h2HFilter === 'home'}
          className='!min-w-[7rem] px-4'
          onClick={() => setH2HFilter('home')}
        >
          {homeTeam.name}
        </TwFilterButton>
        <TwFilterButton
          isActive={h2HFilter === 'away'}
          className='!min-w-[7rem] px-4'
          onClick={() => setH2HFilter('away')}
        >
          {awayTeam.name}
        </TwFilterButton>
      </div>
    </>
  );
};
export default MatchFilter;
