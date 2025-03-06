import { TournamentRow } from '@/components/modules/tennis';

export interface ITournamentItem {
  id: string;
  name: string;
}

export const TournamentList = ({
  tournaments,
}: {
  tournaments: ITournamentItem[];
}) => (
  <div className='mt-4 flex flex-col gap-3 px-3 lg:mt-0 lg:gap-0 lg:space-y-0 lg:px-0'>
    {tournaments?.length > 0 &&
      tournaments?.map((tournament) => (
        <TournamentRow
          key={tournament.id}
          id={tournament.id}
          alt={tournament.name}
          disabled
        />
      ))}
  </div>
);
