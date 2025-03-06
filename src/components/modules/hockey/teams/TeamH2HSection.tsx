

import ConfrontationH from '@/components/common/skeleton/homePage/ConfrontationH';
import { InfoHomeAndAwayTeam } from '@/components/modules/hockey/quickviewColumn/QuickViewInfoHomeAndAwayTeam';
import { TwMbQuickViewWrapper } from '@/components/modules/hockey/quickviewColumn/quickViewMatchesTab';
import { TwQuickViewTitleV2 } from '@/components/modules/hockey/tw-components';
import { SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { useH2HData } from '@/hooks/useCommon';

const TeamH2HSection = ({
  matchData,
  i18n,
}: {
  matchData: SportEventDtoWithStat;
  i18n: any;
}) => {
  const { id, homeTeam, awayTeam, startTimestamp } = matchData;

  const {
    data: h2hData,
    isLoading: isLoadingH2H,
    isFetching: isFetchingH2H,
  } = useH2HData(id, homeTeam?.id, awayTeam?.id, startTimestamp, SPORT.ICE_HOCKEY);

  if (isLoadingH2H || isFetchingH2H || !h2hData) {
    return <ConfrontationH />;
  }

  const { teamDuel = {} } = h2hData || {};
  const { homeWins = 0, awayWins = 0, draws = 0 } = teamDuel || {};

  if (homeWins <= 0 && awayWins <= 0 && draws <= 0) {
    return <></>;
  }

  return (
    <TwMbQuickViewWrapper>
      <TwQuickViewTitleV2 className='text-center'>
        {i18n.titles.team_h2h}
      </TwQuickViewTitleV2>
      <InfoHomeAndAwayTeam
        i18n={i18n}
        className=''
        isH2H
        infoAway={awayTeam}
        infoHome={homeTeam}
        content={{
          start: homeWins,
          middle: draws,
          end: awayWins,
        }}
        type='team'
      />
    </TwMbQuickViewWrapper>
  );
};
export default TeamH2HSection;
