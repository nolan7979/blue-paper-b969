import Circle from '@/components/common/skeleton/Circle';
import Rectangle from '@/components/common/skeleton/Rectangle';
import { RatingBadge } from '@/components/modules/basketball/RatingBadge';
import { InfoHomeAndAwayTeam } from '@/components/modules/basketball/quickviewColumn/QuickViewInfoHomeAndAwayTeam';
import { TwBigBlueText } from '@/components/modules/football/quickviewColumn/quickviewDetailTab';
import { TwBorderLinearBox } from '@/components/modules/football/tw-components';
import { SportEventDtoWithStat, StatusDto } from '@/constant/interface';
import { useSelectedMatchBestPlayersData } from '@/hooks/useBasketball';
import useTrans from '@/hooks/useTrans';
import { DetailMatchTabs } from '@/stores';
import { isMatchLive, isValEmpty } from '@/utils';
import { useEffect } from 'react';

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

  const { homeTeam, awayTeam } = matchData;
  const status: StatusDto = matchData?.status;
  const shouldRefetch = isMatchLive(status?.code) && matchData?.lineup;
  const { data, isLoading, refetch } = useSelectedMatchBestPlayersData(
    matchData?.id,
    homeTeam?.id,
    awayTeam?.id,
    status?.code
  );

  useEffect(() => {
    if (shouldRefetch) {
      const timer = setInterval(() => {
        refetch();
      }, 10000);

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
    bestHomeTeamPlayer as any;
  const { player: awayPlayer = {}, value: awayPlayerRating } =
    bestAwayTeamPlayer as any;

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
            // onClick={() => {
            //   setActiveTab(DetailMatchTabs.squad);
            // }}
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
