/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import { GetStaticPaths, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { HiArrowTopRightOnSquare } from 'react-icons/hi2';
import tw from 'twin.macro';

import { getContentStaticPage } from '@/lib/getContentStatic';

import CustomLink from '@/components/common/CustomizeLink';
import Tabs from '@/components/common/Tabs';
import { H2HIcon } from '@/components/icons/H2hIcon';
import { LineupsIcon } from '@/components/icons/LineupsIcon';
import { OddsIcon } from '@/components/icons/OddsIcon';
import { StatsIcon } from '@/components/icons/StatsIcon';
import { MainLeftMenu } from '@/components/menus';
import { MatchDetailSummarySection } from '@/components/modules/football/match/MatchDetailSummarySection';
import { LiveOddsAnalysisSection } from '@/components/modules/football/odds/LiveOddsAnalysisSection';
import { LiveOddsCompareTableSection } from '@/components/modules/football/odds/LiveOddsCompareTableSection';
import {
  TwCard,
  TwDesktopView,
  TwMatchTab,
  TwMobileView,
  TwSideTab,
  TwTitle,
} from '@/components/modules/football/tw-components';
import Seo from '@/components/Seo';

import { useFilterStore, useMatchSectionStore } from '@/stores';

import { CONTENT_ID } from '@/constant/contentStatic';
import { getMetaContent, scrollWithOffset } from '@/utils';

import i18nConfig from '../../../../i18n.config';

import FootballIcon from '/public/svg/football.svg';
import { SPORT } from '@/constant/common';

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

// get static props
export const getStaticProps = async (context: any) => {
  const { params = {} } = context;
  const { matchParams = [] } = params;
  const sportEventId = matchParams[matchParams.length - 1];
  const { locale } = context;

  const data = await getContentStaticPage(String(CONTENT_ID.ODDS));

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/event/${sportEventId}`;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {},
  };

  const matchData = await axios
    .request(config)
    .then((response) => {
      return response.data.data.event;
    })
    .catch((error) => {
      console.log(error);
      return -1;
    });

  const urlMappingMatch = `${process.env.NEXT_PUBLIC_API_BASE_URL}/event/${sportEventId}/mapping`;
  const configMappingMatch = {
    method: 'get',
    maxBodyLength: Infinity,
    url: urlMappingMatch,
    headers: {},
  };

  const matchMapping = await axios
    .request(configMappingMatch)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return -1;
    });

  if (matchData === -1) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      content: data,
      matchData,
      matchMapping,
      ...(await serverSideTranslations(
        locale || 'en',
        ['common', 'football'],
        i18nConfig as never
      )),
    },
    revalidate: 1800,
  };
};

interface Props {
  matchData: any;
  matchMapping: string;
  content: Record<string, any>;
}

const MatchDetailedPage: NextPage<Props> = ({
  matchData,
  matchMapping,
  content,
}: Props) => {
  const { mbDetailMatchTab } = useFilterStore();

  if (!matchData) return <></>;

  return (
    <div className=''>
      <Seo {...getMetaContent(content)} />
      <MainLeftMenu sport={SPORT.FOOTBALL} />

      <MatchDetailSummarySection
        matchData={matchData}
      ></MatchDetailSummarySection>

      <TwMobileView className='space-y-4'>
        <MbDetailMenu />
        <div className='px-2'>
          {mbDetailMatchTab === 'details' && <div className='space-y-4'></div>}
          {mbDetailMatchTab === 'squad' && <div className='space-y-4'></div>}
          {mbDetailMatchTab === 'stats' && <div className='space-y-4'></div>}
          {mbDetailMatchTab === 'matches' && (
            <TwCard className='space-y-4 p-2.5'></TwCard>
          )}
          {mbDetailMatchTab === 'standings' && (
            <div className='space-y-4'></div>
          )}
        </div>
      </TwMobileView>

      <TwDesktopView>
        <OddsDetailTabSection matchId={matchData?.id} />
        <MatchOddsPageContent
          matchData={matchData}
          matchMapping={matchMapping}
        />

        <OddsDetailStickyTabs matchId={matchData?.id} />
      </TwDesktopView>
      <Tabs data={content} />

      {/* <PlayerStatsPopUpContentContainer></PlayerStatsPopUpContentContainer> */}
    </div>
  );
};

const MatchOddsPageContent = ({
  matchData,
  matchMapping,
}: {
  matchData: any;
  matchMapping: string;
}) => {
  const { t } = useTranslation();
  const { selectedOddsSection } = useMatchSectionStore();

  if (selectedOddsSection === 'details') {
    return (
      <div className='layout'>
        <TwCard className='space-y-2.5 p-2.5'>
          <TwTitle className=''>
            {t('football:odds.onlineBettingAnalysis')}
          </TwTitle>
          <LiveOddsAnalysisSection matchData={matchData} />
        </TwCard>
      </div>
    );
  } else if (selectedOddsSection === 'compare-odds') {
    return (
      <div className='layout'>
        <TwCard className='space-y-2.5 p-2.5'>
          <TwTitle className=''>{t('football:menu.odds')}</TwTitle>

          <LiveOddsCompareTableSection
            matchId={matchData?.id}
            matchMapping={matchMapping}
          ></LiveOddsCompareTableSection>
        </TwCard>
      </div>
    );
  }

  return <></>;
};

export const OddsDetailStickyTabs = ({ matchId }: { matchId: string }) => {
  const router = useRouter();
  const { selectedSection, setSelectedSection } = useMatchSectionStore();

  return (
    <div className='fixed right-1 top-[50%] z-10 xl:right-8 '>
      <div className='space-y-5'>
        <TwSideTab
          css={[selectedSection === 'timeline' && tw`text-logo-blue`]}
          onClick={() => {
            setSelectedSection('timeline');
            scrollWithOffset('timeline', 75);
          }}
        >
          <FootballIcon />
        </TwSideTab>
        <TwSideTab
          css={[selectedSection === 'lineups' && tw`text-logo-blue`]}
          onClick={() => {
            setSelectedSection('lineups');
            scrollWithOffset('lineups', 75);
          }}
        >
          <LineupsIcon />
        </TwSideTab>

        <TwSideTab
          css={[selectedSection === 'h2h' && tw`text-logo-blue`]}
          onClick={() => {
            setSelectedSection('h2h');
            scrollWithOffset('h2h', 75);
          }}
        >
          <H2HIcon />
        </TwSideTab>

        <TwSideTab
          css={[selectedSection === 'stats' && tw`text-logo-blue`]}
          onClick={() => {
            setSelectedSection('stats');
            scrollWithOffset('stats', 75);
          }}
        >
          <StatsIcon />
        </TwSideTab>

        <TwSideTab
          css={[selectedSection === 'standings' && tw`text-logo-blue`]}
          onClick={() => {
            setSelectedSection('standings');
            scrollWithOffset('standings', 75);
          }}
        >
          <StatsIcon></StatsIcon>
        </TwSideTab>

        <TwSideTab
          css={[selectedSection === 'odds' && tw`text-logo-blue`]}
          onClick={() => {
            router.push(`/odds/match/${matchId}`);
          }}
        >
          <OddsIcon></OddsIcon>
        </TwSideTab>
      </div>
    </div>
  );
};

export const OddsDetailTabSection = ({ matchId }: { matchId: string }) => {
  const { t } = useTranslation();
  const { selectedOddsSection, setSelectedOddsSection } =
    useMatchSectionStore();

  return (
    <TwCard className='layout mb-4 px-4 lg:-mt-5 '>
      <div className='divide-menu-x flex h-10 justify-center'>
        <TwMatchTab
          className='item-hover '
          onClick={() => {
            setSelectedOddsSection('compare-odds');
            // scrollWithOffset('timeline', 75);
          }}
          css={[
            selectedOddsSection === 'compare-odds' &&
            tw`bg-logo-blue text-white`,
          ]}
        >
          <FootballIcon></FootballIcon>
          <span>{t('football:odds.compareOdds')}</span>
        </TwMatchTab>

        {/* <TwMatchTab
          className='item-hover'
          onClick={() => {
            setSelectedOddsSection('details');
            // scrollWithOffset('lineups', 75);
          }}
          css={[
            selectedOddsSection === 'details' && tw`bg-logo-blue text-white`,
          ]}
        >
          <FootballIcon></FootballIcon>
          <span>Chi tiết</span>
        </TwMatchTab> */}

        {/* <TwMatchTab
          className='item-hover'
          onClick={() => {
            setSelectedOddsSection('h2h');
            // scrollWithOffset('h2h', 75);
          }}
          css={[selectedOddsSection === 'h2h' && tw`bg-logo-blue text-white`]}
        >
          <H2HIcon></H2HIcon>
          <span>Tab 3</span>
        </TwMatchTab>

        <TwMatchTab
          className='item-hover'
          onClick={() => {
            setSelectedOddsSection('standings');
            // scrollWithOffset('standings', 75);
          }}
          css={[
            selectedOddsSection === 'standings' && tw`bg-logo-blue text-white`,
          ]}
        >
          <StatsIcon></StatsIcon>
          <span>Tab 4</span>
        </TwMatchTab> */}

        <CustomLink href={`/match/${matchId}`} target='_blank'>
          <TwMatchTab
            className='item-hover h-full'
            onClick={() => {
              // setSelectedOddsSection('odds');
              // scrollWithOffset('odds', 75);
              // router.push(`/odds/match/${matchId}`);
            }}
            css={[
              selectedOddsSection === 'odds' && tw`bg-logo-blue text-white`,
            ]}
          >
            <span>{t('football:match.matchInfo')}</span>
            <HiArrowTopRightOnSquare></HiArrowTopRightOnSquare>
          </TwMatchTab>
        </CustomLink>
      </div>
    </TwCard>
  );
};

export const MbDetailMenu = () => {
  const { t } = useTranslation();
  const { mbDetailMatchTab, setMbDetailMatchTab } = useFilterStore();

  return (
    <div className='no-scrollbar flex items-center gap-3 overflow-scroll bg-white px-3 dark:bg-dark-match lg:hidden'>
      <TwMbMenuButton
        className=''
        onClick={() => setMbDetailMatchTab('details')}
        css={[
          mbDetailMatchTab === 'details' &&
          tw`text-logo-blue border-b-2 border-logo-blue font-semibold `,
        ]}
      >
        {t('football:tab.timeline_plus')}
      </TwMbMenuButton>
      <TwMbMenuButton
        onClick={() => setMbDetailMatchTab('squad')}
        css={[
          mbDetailMatchTab === 'squad' &&
          tw`text-logo-blue border-b-2 border-logo-blue font-semibold`,
        ]}
        className=''
      >
        {t('football:tab.squad')}
      </TwMbMenuButton>
      <TwMbMenuButton
        onClick={() => setMbDetailMatchTab('matches')}
        css={[
          mbDetailMatchTab === 'matches' &&
          tw`text-logo-blue border-b-2 border-logo-blue font-semibold`,
        ]}
        className=''
      >
        {t('football:tab.matches')}
      </TwMbMenuButton>
      <TwMbMenuButton
        onClick={() => setMbDetailMatchTab('stats')}
        css={[
          mbDetailMatchTab === 'stats' &&
          tw`text-logo-blue border-b-2 border-logo-blue font-semibold`,
        ]}
        className=''
      >
        {t('football:tab.statistics')}111
      </TwMbMenuButton>
      <TwMbMenuButton
        onClick={() => setMbDetailMatchTab('standings')}
        css={[
          mbDetailMatchTab === 'standings' &&
          tw`text-logo-blue border-b-2 border-logo-blue font-semibold`,
        ]}
        className=''
      >
        {t('football:tab.standings')}
      </TwMbMenuButton>
    </div>
  );
};

export const TwMbMenuButton = tw.div`text-csm py-3 px-1 uppercase whitespace-nowrap cursor-pointer`;

export default MatchDetailedPage;
