import { useRouter } from 'next/router';

import { useMatchStatsData } from '@/hooks/useFootball';
import useTrans from '@/hooks/useTrans';

import Avatar from '@/components/common/Avatar';
import PossessionRateSkeleton from '@/components/common/skeleton/match/PossessionRateSkeleton';
import Transition from '@/components/common/Transition';
import { TwQuickViewTitleV2 } from '@/components/modules/football/tw-components';
import { TwBorderLinearBox } from '@/components/modules/football/tw-components/TwCommon.module';

import { SportEventDtoWithStat, StatusDto } from '@/constant/interface';
import { isMatchLive, isMatchNotStarted } from '@/utils';

import BallSVG from '/public/svg/ball.svg';
import CornerSVG from '/public/svg/corner.svg';
import YellowCardSVG from '/public/svg/yellow-card.svg';
import React, { memo, useEffect } from 'react';

interface IQuickViewPossessionRate {
  matchData: SportEventDtoWithStat;
  i18n?: any;
  isDetail?: boolean;
}

const QuickViewPossessionRate: React.FC<IQuickViewPossessionRate> = ({
  matchData,
  // i18n,
  isDetail,
}) => {
  const { homeScore, awayScore, id, homeTeam, awayTeam } = matchData || {};
  const { locale } = useRouter();
  const i18n = useTrans();

  const status: StatusDto = matchData
    ? matchData.status
    : { code: 100, description: '', type: '' };
  const shouldRefetching = isMatchLive(status?.code);

  const {
    data: statistics,
    isLoading,
    isError,
    refetch: refetchMatchStat,
  } = useMatchStatsData(id, homeTeam?.id, awayTeam?.id, locale);

  const all =
    statistics?.[0]?.groups?.[0]?.groupName === 'Possession'
      ? statistics?.[0]?.groups?.[0]?.statisticsItems?.[0] || null
      : null;

  const shotsStats =
    statistics?.[0]?.groups?.[1]?.groupName === 'Shots'
      ? statistics?.[0]?.groups?.[1]?.statisticsItems
      : null;

  const shots =
    shotsStats &&
    shotsStats.find((item: any) => item.fields === 'shots_on_target');

  const corner_card = statistics?.[0]?.groups.find((it: any) => it.groupName == 'Other')?.statisticsItems || [];
  const corner = corner_card.find((it: any) => it.fields == 'corner_kicks');
  const card = corner_card.find((it: any) => it.fields == 'yellow_cards');

  useEffect(() => {
    if (shouldRefetching) {
      const timer = setInterval(() => {
        refetchMatchStat();
      }, 2000);

      return () => clearInterval(timer);
    }
  }, [shouldRefetching, refetchMatchStat]);

  if (isMatchNotStarted(matchData?.status?.code)) {
    return <></>;
  }

  if (isLoading || !matchData) {
    return <PossessionRateSkeleton />;
  }

  if (isError) {
    return <></>;
  }

  return (
    <div className='space-y-2.5 '>
      <TwQuickViewTitleV2>{i18n.qv.possession_rate}</TwQuickViewTitleV2>
      <TwBorderLinearBox
        className={
          (!isDetail && 'bg-white dark:border-linear-box dark:bg-primary-gradient') || ''
        }
      >
        {matchData && (
          <Transition>
            <div className='space-y-2.5 p-2.5 py-4' test-id='possession-rate'>
              {all !== null && (
                <div className='flex h-5 items-center justify-between gap-1'>
                  <div
                    test-id="possession-rate1"
                    className='flex h-full items-center justify-between bg-line-dark-blue px-1'
                    style={{ width: all?.home }}
                  >
                    <Avatar
                      id={matchData?.homeTeam?.id}
                      type='team'
                      height={16}
                      width={16}
                      rounded={false}
                      isBackground={false}
                      isSmall
                    />
                    <span className='text-ccsm font-bold text-white' test-id='home-possession-rate'>
                      {all?.home}
                    </span>
                  </div>
                  <div
                    test-id="possession-rate2"
                    className='flex h-full items-center justify-between   bg-light-detail-away px-1'
                    style={{ width: all?.away }}
                  >
                    <span className='text-ccsm font-bold text-white' test-id='away-possession-rate'>
                      {all?.away}
                    </span>
                    <Avatar
                      id={matchData?.awayTeam?.id}
                      type='team'
                      rounded={false}
                      height={16}
                      width={16}
                      isBackground={false}
                      isSmall
                    />
                  </div>
                </div>
              )}
              <div className='flex justify-center gap-x-2'>
                <PossessionItem home={shots?.home} away={shots?.away} testId='shots' icon={<BallSVG />} />
                <PossessionItem home={homeScore?.corner || corner?.home} away={awayScore?.corner || corner?.away} testId='corner' icon={<CornerSVG />} />
                <PossessionItem home={homeScore?.yellow_card || card?.home} away={awayScore?.yellow_card || card?.away} testId='yellow-card' icon={<YellowCardSVG />} />
              </div>
            </div>
          </Transition>
        )}
      </TwBorderLinearBox>
    </div>
  );
};

export default memo(QuickViewPossessionRate, (prevProps, nextProps) => {
  return (
    prevProps.matchData?.id === nextProps.matchData?.id &&
    prevProps.isDetail === nextProps.isDetail
  );
});



interface PossessionItemProps {
  home: number;
  away: number;
  testId?: string;
  icon: React.ReactNode;
}

export const PossessionItem: React.FC<PossessionItemProps> = ({ away, home, testId, icon }) => {
  return <TwBorderLinearBox className='border-linear-form'>
    <div className='flex items-center justify-between gap-x-2.5 px-5 h-7'>
      <span className='text-csm font-medium dark:text-white' test-id={`home-${testId}`}>
        {home || 0}
      </span>
      {icon}
      <span className='text-csm font-medium dark:text-white' test-id={`away-${testId}`}>
        {away || 0}
      </span>
    </div>
  </TwBorderLinearBox>
}

