import { MatchesSection } from '@/components/modules/badminton/quickViewColumn/quickViewMatchesTab';
import { SportEventDtoWithStat } from '@/constant/interface';


export const QuickViewMatchesTab = ({
  matchData,
  type2nd,
}: {
  matchData: SportEventDtoWithStat;
  type2nd?: boolean;
}) => {
  return <MatchesSection matchData={matchData} type2nd={type2nd} />;
};
