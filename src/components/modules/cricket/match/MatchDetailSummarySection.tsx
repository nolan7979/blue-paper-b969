import BreadCrumbMain from '@/components/breadcumbs/BreadCrumbMain';
import CardsMbSection from '@/components/modules/cricket/CardsMbSection';

import { SportEventDtoWithStat } from '@/constant/interface';
import MatchDetailSummary from '@/modules/cricket/matchDetails/components/MatchSumaryDetails';

export const MatchDetailSummarySection = ({
  matchData,
}: {
  matchData?: SportEventDtoWithStat;
}) => {
  if (!matchData) return <></>;

  return (
    <CardsMbSection rounded={false}>
      <div className='hidden py-2 dark:bg-none md:block'>
        <BreadCrumbMain matchData={matchData} />
      </div>
      <div className='flex place-content-center py-4 dark:bg-none lg:pb-14'>
        <div className='w-full lg:w-1/2'>
          <MatchDetailSummary matchData={matchData}></MatchDetailSummary>
        </div>
      </div>
    </CardsMbSection>
  );
};
