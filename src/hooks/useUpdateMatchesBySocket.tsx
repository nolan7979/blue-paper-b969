import { SportEventDtoWithStat } from '@/constant/interface';
import { compareFields } from '@/utils';

type Matches = { [key: string]: SportEventDtoWithStat };

interface Meta {
  [key: string]: any;
  id: string;
  scores: number[];
  serve: string;
  status: string;
  extraScores: { [key: string]: Record<string, any> };
}
type SetMatches = React.Dispatch<React.SetStateAction<Matches>>;
type MatchLiveIdRef = React.MutableRefObject<boolean | null>;

export const updateMatchesBySocket = (
  meta: Meta,
  matches: Matches,
  matchesLive: Matches,
  fieldsToCompare: string[],
  setMatches: SetMatches,
  setMatchesLive: SetMatches,
  matchLiveIdRef: MatchLiveIdRef,
  isDetail?: boolean,
  setMatchDetails?: (match: SportEventDtoWithStat) => void,
  matchDetails?: SportEventDtoWithStat | null
): void => {
  const { id } = meta;
  // Get current match based on whether we're in detail view
  const currentMatch = isDetail ? matchesLive[id] : (matchesLive[id] && matches[id]);

  if (!currentMatch) return;

  // Create updated match with new metadata
  const updatedMatch = {
    ...currentMatch,
    scores: meta.scores || currentMatch?.scores,
    serve: meta.serve || currentMatch?.serve,
    status: meta.status || currentMatch?.status,
    ...(meta.extraScores && { extraScores: meta.extraScores })
  } as unknown as SportEventDtoWithStat;

  // Compare and get changed fields
  const changedFields = compareFields(currentMatch, updatedMatch, fieldsToCompare);

  if (changedFields.length > 0) {
    const getUpdatedMatchData = (prevMatch: SportEventDtoWithStat) => {
      const updates = changedFields.reduce<Partial<SportEventDtoWithStat>>((acc, field) => {
        acc[field as keyof SportEventDtoWithStat] = updatedMatch[field as keyof SportEventDtoWithStat];
        return acc;
      }, {});
    
      return {
        ...prevMatch,
        ...updates
      };
    };
    // Update live matches
    setMatchesLive((prev) => ({
      ...prev,
      [id]: getUpdatedMatchData(prev[id])
    }));
   
    // Update regular matches
    setMatches((prev) => ({
      ...prev, 
      [id]: getUpdatedMatchData(prev[id])
    }));

    matchLiveIdRef.current = true;

    if (setMatchDetails && matchDetails && matchDetails.id === id) {
      setMatchDetails(updatedMatch);
    }
  }
};
