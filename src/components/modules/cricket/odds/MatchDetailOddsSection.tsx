import PredictFeatureMatch from '@/components/common/skeleton/homePage/PredictFeatureMatch';
import { FootballOddsLoader } from '@/components/modules/football/loaderData/FootballOddsLoader';
import TwOddsRowMain from '@/components/modules/football/quickviewColumn/quickviewDetailTab/TwOddsRowMain';
import { TwQuickViewSection } from '@/components/modules/football/tw-components';
import { TwBorderLinearBox } from '@/components/modules/football/tw-components/TwCommon.module';
import { useMatchOddsData } from '@/hooks/useFootball/useOddsData';
import { useHomeStore, useOddsStore } from '@/stores';
import { useTestStore } from '@/stores/test-store';
import { mappingOddsTestStore } from '@/utils/matchFilter';
import { useMemo } from 'react';

const MatchDetailOddsSection = ({ matchData }: { matchData?: any }) => {
  const { selectedBookMaker, market, oddsType = '5' } = useOddsStore();
  const { OddAsianHandicap, OddOverUnder, OddEuropean } = useTestStore();
  const { matchesOdds } = useHomeStore();
  const matchOddsMapping = matchesOdds[matchData.id];

  const { data, isLoading } = useMatchOddsData(
    matchData?.id || '',
    selectedBookMaker?.id
  );

  // const matchOddsStore = mappingOddsTestStore({
  //   OddAsianHandicap: OddAsianHandicap,
  //   OddOverUnder: OddOverUnder,
  //   matchMapping: data?.encode_is_id,
  //   bookMakerId: selectedBookMaker?.id.toString(),
  //   OddEuropean: OddEuropean,
  // });

  const matchOddsStore = mappingOddsTestStore({
    OddAsianHandicap: OddAsianHandicap,
    OddOverUnder: OddOverUnder,
    matchMapping: data?.encode_is_id,
    bookMakerId: selectedBookMaker?.id?.toString(),
    OddEuropean: OddEuropean,
  });

  const asianHdpOdds = useMemo(
    () => ({
      odd1: matchOddsStore?.asian_hdp_home || matchOddsMapping?.asian_hdp_home,
      odd2: matchOddsStore?.asian_hdp || matchOddsMapping?.asian_hdp,
      odd3: matchOddsStore?.asian_hdp_away || matchOddsMapping?.asian_hdp_away,
    }),
    [matchOddsStore, matchOddsMapping, OddAsianHandicap, OddOverUnder]
  );

  const overUnderOdds = useMemo(
    () => ({
      odd1: matchOddsStore?.over || matchOddsMapping?.over,
      odd2: matchOddsStore?.over_under_hdp || matchOddsMapping?.over_under_hdp,
      odd3: matchOddsStore?.under || matchOddsMapping?.under,
    }),
    [matchOddsStore, matchOddsMapping, OddAsianHandicap, OddOverUnder]
  );

  const fullTimeOdds = useMemo(
    () => ({
      odd1: matchOddsStore?.european_home || matchOddsMapping?.european_home,
      odd2: matchOddsStore?.european_draw || matchOddsMapping?.european_draw,
      odd3: matchOddsStore?.european_away || matchOddsMapping?.european_away,
    }),
    [matchOddsStore, matchOddsMapping, OddAsianHandicap, OddOverUnder]
  );

  if (isLoading || !data) {
    return <PredictFeatureMatch />;
  }

  return (
    <TwBorderLinearBox className='dark:border-linear-box'>
      <TwQuickViewSection className='p-2.5'>
        {!matchOddsMapping && <FootballOddsLoader />}
        <TwOddsRowMain
          name='Asian HDP'
          marketId='hdp'
          odd1={asianHdpOdds.odd1}
          odd2={asianHdpOdds.odd2}
          odd3={asianHdpOdds.odd3}
          oddsType={oddsType}
          label={{ label1: 'Home', label2: 'HDP', label3: 'Away' }}
        />
        <TwOddsRowMain
          name='Over/Under'
          marketId='tx'
          odd1={overUnderOdds.odd1}
          odd2={overUnderOdds.odd2}
          odd3={overUnderOdds.odd3}
          oddsType={oddsType}
          label={{ label1: 'Over', label2: 'HDP', label3: 'Under' }}
        />
        <TwOddsRowMain
          name='Full time'
          marketId='std1x2'
          odd1={fullTimeOdds.odd1}
          odd2={fullTimeOdds.odd2}
          odd3={fullTimeOdds.odd3}
          oddsType={oddsType}
          label={{ label1: '1', label2: 'X', label3: '2' }}
        />

        <div className='flex items-end justify-between pt-2'>
          <div className='text-cxs text-dark-text'>Gamble responsibly 18+</div>
          {/* <button
          className='text-csm text-logo-blue hover:underline'
          onClick={() => setShowAll(!showAll)}
          css={[markets?.length > 3 ? tw`` : tw`hidden`]}
        >
          {showAll ? 'See less' : 'See more'}
        </button> */}
        </div>
      </TwQuickViewSection>
    </TwBorderLinearBox>
  );
};

export default MatchDetailOddsSection;
