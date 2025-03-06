import axios from 'axios';
import { NextPage, NextPageContext } from 'next';
import { useMemo } from 'react';

import { FootballLiveMatchesLoaderSection } from '@/components/modules/football/loaderData/FootballLiveMatchesLoaderSection';
import Seo from '@/components/Seo';

import { SportEventDtoWithStat } from '@/constant/interface';
import MatchDetails from '@/modules/am-football/matchDetails/pages';
import { formatTimestamp } from '@/utils';

import { SPORT } from '@/constant/common';

export interface IMatchDetail {
  matchData: SportEventDtoWithStat | undefined;
  // i18n: any;
  matchId?: string;
  redirect?: {
    destination: string;
    permanent: boolean;
  };
}

const MatchDetailedPage: NextPage<IMatchDetail> = ({
  matchData,
  // i18n = vi,
  matchId,
}: IMatchDetail) => {

  const contentSEO: { title: string; description: string } = useMemo(() => {
    if (!matchData) {
      return {
        title: '',
        description: '',
      };
    }
    const title = `Trực Tiếp Kết Quả ${matchData.homeTeam.name} vs ${
      matchData.awayTeam.name
    } ${formatTimestamp(
      matchData?.startTimestamp,
      'dd/mm/yyyy'
    )} Vào Lúc ${formatTimestamp(matchData?.startTimestamp, 'HH:mm')} giờ`;
    const description = `Trực Tiếp Kết Quả ${matchData.homeTeam.name} vs ${
      matchData.awayTeam.name
    } ${formatTimestamp(
      matchData?.startTimestamp,
      'dd/mm/yyyy'
    )} Vào Lúc ${formatTimestamp(matchData?.startTimestamp, 'HH:mm')} giờ, ${
      matchData.venue?.city?.name
        ? `tại sân ${matchData.venue?.city?.name}`
        : ''
    } ${
      matchData.referee?.name
        ? `, trọng tài điều khiển trận đấu là ${matchData.referee.name}`
        : ''
    }`;
    return {
      title,
      description,
    };
  }, [matchData]);

  return (
    <div className='layout'>
      <Seo
        templateTitle={contentSEO.title}
        description={contentSEO.description}
      />
      <MatchDetails
        matchId={matchId as string}
        matchData={matchData as SportEventDtoWithStat}
      />
      {/* <FootballLiveMatchesLoaderSection sport={SPORT.AMERICAN_FOOTBALL} /> */}
    </div>
  );
};
MatchDetailedPage.getInitialProps = async (
  context: NextPageContext
): Promise<IMatchDetail> => {
  const { locale, query } = context;
  const matchParams = query.matchParams || [];
  const sportEventId = matchParams.at(-1);

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/am-football/sport-event/${sportEventId}`;
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
        // i18n: i18nData,
      };
    }
  } catch (error) {
    return {
      matchData: undefined,
      // i18n: i18nData,
      matchId: sportEventId,
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    matchData: undefined,
    // i18n: i18nData,
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
