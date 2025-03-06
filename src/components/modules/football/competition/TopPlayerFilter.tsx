import { Select } from '@/components/common';
import { useLeagueStore } from '@/stores/league-store';
import { isNumber, isValEmpty } from '@/utils';
import { useEffect, useMemo } from 'react';

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
  interface Option {
    id: number | string;
    roundName?: string;
    [key: string]: any;
  }
  // Use useMemo to recalculate when i18n.football.round changes
  const formattedRounds = useMemo(() => {
    return rounds.map((round: any) => ({
      ...round,
      roundName: isNumber(round.roundName)
        ? `${i18n.football.round} ${round.roundName}`
        : round.roundName,
    }));
  }, [i18n.football.round, data]);

  useEffect(()=>{
    if(!selectedXIRound && formattedRounds.length > 0){
      setSelectedXIRound(formattedRounds[0])
      return
    }
    
    const currentOption: Option | undefined = formattedRounds.find(
      (opt: Option) => opt.id === selectedXIRound?.id
    );
    
    setSelectedXIRound(currentOption)
  },[i18n.football.round, selectedXIRound])
  
  return (
    <>
      {!isValEmpty(formattedRounds) && (
        <Select
          options={formattedRounds}
          label='roundName'
          valueGetter={setSelectedXIRound}
          shownValue={selectedXIRound?.roundName}
          classes='w-36'
        ></Select>
      )}
    </>
  );
};
export default TopPlayerFilter;
