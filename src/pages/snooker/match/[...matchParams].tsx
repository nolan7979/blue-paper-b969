import axios from 'axios';
import { NextPage, NextPageContext } from 'next';
import { useEffect, useMemo, useState } from 'react';

import Seo from '@/components/Seo';

import { SportEventDtoWithStat } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import MatchDetails from '@/modules/snooker/matchDetails/pages';
import { useMatchStore } from '@/stores';
import { formatTimestamp } from '@/utils';

export interface IMatchDetail {
  matchData: SportEventDtoWithStat | undefined;
  isDesktop?: boolean;
  matchId?: string;
  redirect?: {
    destination: string;
    permanent: boolean;
  };
}

const MatchDetailedPage: NextPage<IMatchDetail> = ({
  matchData,
  matchId,
}: IMatchDetail) => {
  const i18n = useTrans();
  const { setMatchDetails } = useMatchStore();
  const [isDesktopClient, setIsDesktopClient] = useState<boolean>(true);

  useEffect(() => {
    if (!matchData) {
      return;
    }

    setMatchDetails(matchData);
  }, [matchData]);

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
    const getUserAgent = window.navigator.userAgent;
    const isDesktop = !/mobile|android|iphone|ipad/i.test(getUserAgent);
    setIsDesktopClient(isDesktop);
    // Function to update isDesktop based on current window width
    const handleResize = () => {
      setIsDesktopClient(window.innerWidth >= 960);
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
        isDesktop={isDesktopClient}
      />
    </div>
  );
};
MatchDetailedPage.getInitialProps = async (
  context: NextPageContext
): Promise<IMatchDetail> => {
  const { query } = context;
  const currentDate = new Date();
  const timestamp = new Date().getTime();

  const matchParams = query.matchParams || [];
  const sportEventId = matchParams.at(-1);

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/snooker/event/${sportEventId}?timestamp=${timestamp}`;
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
        matchData: matchData || null,
        matchId: sportEventId,
      };
    }
  } catch (error) {
    return {
      matchData: undefined,
      matchId: sportEventId,
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
}

export default MatchDetailedPage;

// export const MatchDetailSummarySectionV2: React.FC<{
//   matchData?: SportEventDto;
//   i18n?: any;
// }> = memo(({ matchData }) => {
//   return <></>;
// });
