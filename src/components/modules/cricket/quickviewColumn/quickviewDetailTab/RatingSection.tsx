import { useEffect } from 'react';

import { useSelectedMatchBestPlayersData } from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';

import Circle from '@/components/common/skeleton/Circle';
import Rectangle from '@/components/common/skeleton/Rectangle';
import { TwBigBlueText } from '@/components/modules/football/quickviewColumn/quickviewDetailTab';
import { InfoHomeAndAwayTeam } from '@/components/modules/football/quickviewColumn/QuickViewInfoHomeAndAwayTeam';
import { RatingBadge } from '@/components/modules/football/RatingBadge';
import { TwBorderLinearBox } from '@/components/modules/football/tw-components';

import { DetailMatchTabs } from '@/stores';

import { SportEventDtoWithStat, StatusDto } from '@/constant/interface';
import { isMatchLive, isValEmpty } from '@/utils';

const RatingSection = ({
  matchData,
  setActiveTab,
  isDetail,
}: {
  matchData: SportEventDtoWithStat;
  setActiveTab?: (e: string) => void;
  isDetail?: boolean;
}) => {
  const i18n = useTrans();
  const status: StatusDto = matchData?.status;
  const shouldRefetch = isMatchLive(status?.code) && matchData?.lineup;
  const { data, isLoading, refetch } = useSelectedMatchBestPlayersData(
    matchData?.id,
    status?.code
  );

  useEffect(() => {
    if (shouldRefetch) {
      const timer = setInterval(() => {
        refetch();
      }, 30000);

      return () => clearInterval(timer);
    }
  }, [refetch, shouldRefetch]);

  if (isLoading) {
    return (
      <>
        <div className='flex items-center justify-between p-4 text-white'>
          <div className='flex items-center justify-center gap-1'>
            <Circle classes='w-[56px] h-[56px]' />
            <div className='space-y-1 text-center '>
              <Rectangle classes='h-5 w-6' />
              <Rectangle classes='h-4 w-32' />
            </div>
          </div>
          <div className='flex  items-center justify-center gap-1'>
            <div className='flex flex-col items-end justify-end gap-1 '>
              <Rectangle classes='h-5 w-6' />
              <Rectangle classes='h-4 w-32' />
            </div>
            <Circle classes='w-[56px] h-[56px]' />
          </div>
        </div>
      </>
    ); // TODO
  }

  if (isValEmpty(data)) {
    return <></>;
  }

  const { bestHomeTeamPlayer = {}, bestAwayTeamPlayer = {} } = data || {};
  const { player: homePlayer = {}, value: homePlayerRating } =
    bestHomeTeamPlayer;
  const { player: awayPlayer = {}, value: awayPlayerRating } =
    bestAwayTeamPlayer;

  return (
    <TwBorderLinearBox
      className={`${
        !isDetail ? 'dark:border-linear-box bg-white dark:bg-primary-gradient' : ''
      }`}
    >
      <InfoHomeAndAwayTeam
        infoHome={homePlayer}
        infoAway={awayPlayer}
        type='player'
        content={{
          start: <RatingBadge point={Number(homePlayerRating) || 0} />,
          middle: setActiveTab && (
            <button
              onClick={() => {
                setActiveTab(DetailMatchTabs.squad);
              }}
            >
              <TwBigBlueText className=''>
                {i18n.titles.see_ratings}
              </TwBigBlueText>
            </button>
          ),
          end: <RatingBadge point={Number(awayPlayerRating) || 0} />,
        }}
      />
    </TwBorderLinearBox>
  );
};
export default RatingSection;
