
import ConfrontationH from '@/components/common/skeleton/homePage/ConfrontationH';
import { InfoHomeAndAwayTeam } from '@/components/modules/snooker/quickviewColumn/QuickViewInfoHomeAndAwayTeam';
import { TwMbQuickViewWrapper } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import { TwQuickViewTitleV2 } from '@/components/modules/football/tw-components';
import { SportEventDtoWithStat } from '@/constant/interface';
import { SPORT } from '@/constant/common';
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
  } = useH2HData(id, homeTeam?.id, awayTeam?.id, startTimestamp, SPORT.SNOOKER);

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
      <TwQuickViewTitleV2>
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
        type='competitor'
      />
    </TwMbQuickViewWrapper>
  );
};
export default TeamH2HSection;
