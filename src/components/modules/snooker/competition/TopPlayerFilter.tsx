import { Select } from '@/components/common';
import { useLeagueStore } from '@/stores/league-store';
import { isNumber, isValEmpty } from '@/utils';

const TopPlayerFilter: React.FC<{
  uniqueTournament: any;
  selectedSeason: any;
  roundGetter?: any;
  selectedRound?: any;
  i18n?: any;
  data: any;
}> = ({ i18n, data }) => {
  const { selectedXIRound, setSelectedXIRound } = useLeagueStore();

  const { rounds = [] } = data || {};

  const formattedRounds = rounds.map((round: any) => {
    const roundName = isNumber(round.roundName)
      ? `${i18n.football.round} ${round.roundName}`
      : round.roundName;
    return {
      ...round,
      roundName,
    };
  });
  return (
    <>
      {!isValEmpty(formattedRounds) && (
        <Select
          options={formattedRounds}
          label='roundName'
          valueGetter={setSelectedXIRound}
          shownValue={selectedXIRound?.roundName}
          classes='w-36 lg:w-64'
        ></Select>
      )}
    </>
  );
};
export default TopPlayerFilter;
