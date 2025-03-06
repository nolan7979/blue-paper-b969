import { SportEventDtoWithStat } from '@/constant/interface';

import MatchTimeScore from '@/components/modules/volleyball/match/MatchTimeScore';
import { isValEmpty } from '@/utils';
import useTrans from '@/hooks/useTrans';
import { EmptyEvent } from '@/components/common/empty';
import { SPORT } from '@/constant/common';
import QuickViewSummaryCommon from '@/components/common/QuickViewSummaryCommon';

export const FeaturedMatch = ({ match }: { match: SportEventDtoWithStat }) => {
  const i18n = useTrans();
  const { scores = {} } = match || {};

  const isScoreNotAvailable = isValEmpty(scores);

  if (isValEmpty(match)) {
    return <div className='bg-white dark:bg-dark-card rounded-md py-8'><EmptyEvent title={i18n.common.nodata} content={''} /></div>;
  }

  return (
    <QuickViewSummaryCommon match={match} sport={SPORT.VOLLEYBALL} isSubPage>
      <MatchTimeScore
        match={match}
        status={match.status}
        isScoreNotAvailable={isScoreNotAvailable}
        i18n={i18n}
        isClub
      />
    </QuickViewSummaryCommon>
  );
};
