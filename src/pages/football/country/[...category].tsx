import clsx from 'clsx';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

import { MatchListHeader } from '@/components/modules/football';
import { FootballMatchCountryLoaderSection } from '@/components/modules/football/loaderData/FootballMatchCountryLoaderSection';
import SimulationColumn from '@/components/modules/football/SimulationColumn';
import { SportMatchListByCountrySectionIsolated } from '@/components/modules/football/SportMatchListByCountrySectionIsolated';
import {
  TwDataSection,
  TwQuickViewCol
} from '@/components/modules/football/tw-components';
import Seo from '@/components/Seo';

import { useHomeStore, useSitulations } from '@/stores';

import { NextPageWithLayout } from '@/models';

import WeekView from '@/components/filters/WeekFilter';
import { FilterColumn } from '@/components/modules/common/filters/FilterColumn';
import { MatchFilterCountry } from '@/components/modules/common/filters/MatchFilterCountry';
import { TwColumnWrapperMiddle, TwColumWrapperLeft } from '@/components/modules/common/tw-components/TwHome';
import { QuickViewColumn } from '@/components/modules/football/quickviewColumn/QuickViewColumn';
import { PAGE, SPORT } from '@/constant/common';
import { MatchState } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';

interface Props {
  seoTitle: string;
  description: string;
}

const CountryDetailedPage: NextPageWithLayout<Props> = ({
  seoTitle = '',
  description = '',
}) => {
  const router = useRouter();
  const { category } = router.query;
  const { situlations } = useSitulations();
  const i18n = useTrans();
  const isShowSimulation = situlations.length > 0;
  const countryId: string = category ? category[category.length - 1] : '';
  const countryName = category ? (category[category.length - 2] as string) : '';
  
  useEffect(() => {
    if (!countryId) {
      router.push('/');
    }
  }, [countryId, router]);

  const { matches } = useHomeStore();

  const firstMatchItem: any = useMemo(() => {
    if (matches) {
      const notStartedMatches = Object.values(matches).filter((match: any) => match?.status?.code === MatchState.NotStarted);
      if (notStartedMatches.length > 0) {
        return notStartedMatches[0];
      }
      return Object.values(matches)[0];
    }
    return {};
  }, [matches]);

  const seoMeta = useMemo(() => {
    const title = router.locale === 'en' ? seoTitle : i18n.match.match_schedule.replace('{national}', countryName);
    return {
      templateTitle: title,
      description: description,
    };
  }, [seoTitle, description, router.locale, countryName]);


  if (!countryId) {
    return null; // Or any loading indicator or message you prefer
  }

  return (
    <>
      <Seo {...seoMeta} />

      {/*<FootBallMenu />*/}
      <TwDataSection className='layout flex transition-all duration-150 lg:flex-row'>
        <TwColumWrapperLeft
          className={clsx('no-scrollbar', { 'lg:!hidden': isShowSimulation })}
        >
          <FilterColumn sport={SPORT.FOOTBALL} />
        </TwColumWrapperLeft>
        <TwColumnWrapperMiddle
          className={clsx({
            'lg:w-[calc(100%-209px)]': !isShowSimulation,
            'lg:w-[calc(100%-279px)]': isShowSimulation,
          })}
        >
          <div className='flex-[5] md:flex-[4] lg:col-span-1 lg:flex-[5]'>

            <div className='h-full rounded-md pb-6'>
              <div className='sticky top-[112px] z-[5] flex flex-col justify-between lg:relative lg:top-0'>
                <div className='flex w-full items-center dark:bg-dark-score lg:hidden bg-white border-b-[0.5px] dark:border-primary-mask'>
                  <WeekView />
                </div>
                <div className='hidden w-full lg:inline-block'>
                  <MatchFilterCountry sport={SPORT.FOOTBALL} page={PAGE.liveScore} />
                </div>
                <div className='w-full bg-white shadow-sm lg:shadow-none lg:bg-transparent dark:bg-dark-match-header dark:lg:bg-dark-match-header-transparent'>
                  <MatchListHeader />
                </div>
              </div>

              <FootballMatchCountryLoaderSection countryId={countryId} />

              <SportMatchListByCountrySectionIsolated />
            </div>
          </div>

          <TwQuickViewCol className='col-span-1 !w-full'>
            <div className='h-full space-y-4'>
              <QuickViewColumn top={true} sticky={true} matchData={firstMatchItem} />
            </div>
          </TwQuickViewCol>
        </TwColumnWrapperMiddle>

        <SimulationColumn />
      </TwDataSection>
    </>
  );
};

CountryDetailedPage.getInitialProps = async (context: NextPageContext) => {
  const { category } = context.query;
  const name = category ? (category[category.length - 2] as string) : '';

  return {
    seoTitle: `Match schedule of ${name.toLowerCase()}`,
    description: `Match schedule of ${name.toLowerCase()}`,
  };
};

export default CountryDetailedPage;
