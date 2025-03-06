import { MatchesSection } from '@/components/modules/table-tennis/quickviewColumn/quickviewMatchsTab/MatchesSection';
import { SportEventDtoWithStat } from '@/constant/interface';


export const QuickViewMatchesTab = ({
  matchData,
  type2nd,
  isDetail,
}: {
  matchData: SportEventDtoWithStat;
  type2nd?: boolean;
  isDetail?: boolean;
}) => {
  return <MatchesSection matchData={matchData} type2nd={type2nd} isDetail={isDetail} />;
};
