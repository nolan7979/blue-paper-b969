import { useWinningOddsData } from '@/hooks/useFootball/useOddsData';

import TeamWinningOddsSection from '@/components/modules/football/quickviewColumn/quickviewDetailTab/TeamWinningOddsSection';
import { TwMbQuickViewWrapper } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import {
  TwBorderLinearBox,
  TwQuickViewSection,
  TwQuickViewTitleV2,
} from '@/components/modules/football/tw-components';
import { isValEmpty } from '@/utils';

const MatchWinningOddsSection = ({
  matchData,
  i18n,
}: {
  matchData?: any;
  i18n?: any;
}) => {
  const { homeTeam, awayTeam } = matchData || {};
  const { data, isLoading } = useWinningOddsData(matchData?.id);
  if (isLoading || isValEmpty(data)) {
    return <></>;
  }
  const { home, away } = data || {};

  return (
    <TwMbQuickViewWrapper>
      <TwQuickViewTitleV2>
        {i18n?.odds.odds}
      </TwQuickViewTitleV2>
      <TwBorderLinearBox className='border dark:border-0 border-line-default dark:border-linear-box bg-white dark:bg-primary-gradient'>
        <TwQuickViewSection className='text-light-defaul space-y-4 p-4 dark:text-white'>
          <TeamWinningOddsSection
            key='team-1'
            team={homeTeam}
            teamWinningOdds={home}
            isHome={true}
            i18n={i18n}
          ></TeamWinningOddsSection>

          <TeamWinningOddsSection
            key='team-2'
            team={awayTeam}
            teamWinningOdds={away}
            isHome={false}
            i18n={i18n}
          ></TeamWinningOddsSection>
        </TwQuickViewSection>
      </TwBorderLinearBox>
    </TwMbQuickViewWrapper>
  );
};
export default MatchWinningOddsSection;
