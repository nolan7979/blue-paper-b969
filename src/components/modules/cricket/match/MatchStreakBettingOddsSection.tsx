import { useTeamStreaksBettingOddsData } from '@/hooks/useFootball/useOddsData';

import PredictFeatureMatch from '@/components/common/skeleton/competition/PredictFeatureMatch';
import {
  OddsCell,
  OddsTitle,
  TwOddsRow,
} from '@/components/modules/cricket/quickviewColumn/quickviewDetailTab';

import { convertOdds } from '@/utils';

export const MatchStreakBettingOddsSection = ({
  matchData,
}: {
  matchData: any;
}) => {
  const { data, isLoading } = useTeamStreaksBettingOddsData(matchData?.id);

  if (isLoading) {
    return <PredictFeatureMatch />;
  }
  if (!data) {
    return <></>;
  }

  const { general = [] } = data || {};
  if (!general || !general.length) return <></>;

  const { marketName, choices = [] } = general[0] || {};

  const [homeOdds = {}, drawOdds = {}, awayOdds = {}] = choices || [];

  return (
    <div className='p-1.5'>
      <OddsTitle>{marketName}</OddsTitle>
      <TwOddsRow className=''>
        <OddsCell
          label={homeOdds.name}
          isHome={true}
          rate={convertOdds(homeOdds.v)}
          isUp={homeOdds.change > 0}
        ></OddsCell>

        <OddsCell
          label={drawOdds.name}
          rate={convertOdds(drawOdds.v)}
          isUp={drawOdds.change > 0}
        ></OddsCell>

        <OddsCell
          label={awayOdds.name}
          rate={convertOdds(awayOdds.v)}
          isUp={awayOdds.change > 0}
          isHome={false}
        ></OddsCell>
      </TwOddsRow>
    </div>
  );
};
