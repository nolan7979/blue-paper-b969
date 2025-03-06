import axios from 'axios';
import { NextPage, NextPageContext } from 'next';
import { useEffect, useMemo, useState } from 'react';

import { FootballLiveMatchesLoaderSection } from '@/components/modules/football/loaderData/FootballLiveMatchesLoaderSection';
import Seo from '@/components/Seo';

import { SportEventDtoWithStat } from '@/constant/interface';
import MatchDetails from '@/modules/hockey/matchDetails/pages';
import { formatTimestamp } from '@/utils';

import { SPORT } from '@/constant/common';
import { LiveMatchesLoaderSection } from '@/components/modules/basketball/loaderData';
import useTrans from '@/hooks/useTrans';

export interface IMatchDetail {
  matchData: SportEventDtoWithStat | undefined;
  // i18n: any;
  matchId?: string;
  isDesktop?: boolean;
  redirect?: {
    destination: string;
    permanent: boolean;
  };
}

const MatchDetailedPage: NextPage<IMatchDetail> = ({
  matchData,
  // i18n = vi,
  matchId,
  isDesktop = true,
}: IMatchDetail) => {

  const [isDesktopClient, setIsDesktopClient] = useState<boolean | undefined>(
    isDesktop
  );
  const i18n = useTrans();
  
  const contentSEO: { title: string; description: string } = useMemo(() => {
    if (!matchData) {
      return {
        title: '',
        description: '',
      };
    }

    const title = i18n.seo.matchDetails.title
      .replaceAll('{homeTeam}', matchData?.homeTeam?.name ?? '')
      .replaceAll('{awayTeam}', matchData?.awayTeam?.name ?? '')
      .replaceAll(
        '{date}',
        formatTimestamp(matchData?.startTimestamp, 'dd/mm/yyyy')?.toString() ??
        ''
      )
      .replaceAll(
        '{time}',
        formatTimestamp(matchData?.startTimestamp, 'HH:mm')?.toString() ?? ''
      );
    const description = i18n.seo.matchDetails.description
      .replaceAll('{homeTeam}', matchData?.homeTeam?.name ?? '')
      .replaceAll('{awayTeam}', matchData?.awayTeam?.name ?? '')
      .replaceAll(
        '{date}',
        formatTimestamp(matchData?.startTimestamp, 'dd/mm/yyyy')?.toString() ??
        ''
      )
      .replaceAll(
        '{time}',
        formatTimestamp(matchData?.startTimestamp, 'HH:mm')?.toString() ?? ''
      );
    return {
      title,
      description,
    };
  }, [matchData]);

  useEffect(() => {
    // Function to update isDesktop based on current window width
    const handleResize = () => {
      setIsDesktopClient(window.innerWidth >= 768);
    };

    // Check on initial render if on client
    handleResize();

    // Add event listener for resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='layout'>
      <Seo
        templateTitle={contentSEO.title}
        description={contentSEO.description}
      />
      <MatchDetails
        matchId={matchId as string}
        matchData={matchData as SportEventDtoWithStat}
        isDesktop={isDesktopClient || isDesktop}
      />
      {/* <LiveMatchesLoaderSection sport={SPORT.ICE_HOCKEY} /> */}
    </div>
  );
};
MatchDetailedPage.getInitialProps = async (
  context: NextPageContext
): Promise<IMatchDetail> => {
  const { query } = context;

  const matchParams = query.matchParams || [];
  const sportEventId = matchParams.at(-1);
  let isDesktop = true;
  const userAgent = context.req?.headers['user-agent'] || '';
  if (!/mobile|android|iphone|ipad/i.test(userAgent)) {
    isDesktop = true;
  }
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/hockey/event/${sportEventId}`;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {},
  };

  try {
    const response = await axios.request(config);
    const matchData = response.data.data.event;


    if (matchData) {
      return {
        matchData,
        matchId: sportEventId,
        isDesktop
        // i18n: i18nData,
      };
    }
  } catch (error) {
    return {
      matchData: undefined,
      matchId: sportEventId,
      isDesktop,
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    matchData: undefined,
    matchId: sportEventId,
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

export default MatchDetailedPage;

// export const MatchDetailSummarySectionV2: React.FC<{
//   matchData?: SportEventDto;
//   i18n?: any;
// }> = memo(({ matchData }) => {
//   return <></>;
// });
