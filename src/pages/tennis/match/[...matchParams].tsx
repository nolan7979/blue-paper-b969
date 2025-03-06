/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { NextPage, NextPageContext } from 'next';
import { useMemo } from 'react';

import Seo from '@/components/Seo';

import { SportEventDtoWithStat } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import MatchDetails from '@/modules/tennis/matchDetails/pages';
import { formatTimestamp } from '@/utils';

export interface IMatchDetail {
  matchData: SportEventDtoWithStat | undefined;
  // i18n: any;
  locale?: string;
  matchId?: string;
  redirect?: {
    destination: string;
    permanent: boolean;
  };
}

const MatchDetailedPage: NextPage<IMatchDetail> = ({
  matchData,
  // i18n = vi,
  locale,
  matchId,
}: IMatchDetail) => {
  const i18n = useTrans();

  const contentSEO: { title: string; description: string } = useMemo(() => {
    if (!matchData) {
      return {
        title: '',
        description: '',
      };
    }

    const title = i18n.seo.matchDetails.title
      .replaceAll('{homeTeam}', matchData.homeTeam.name ?? '')
      .replaceAll('{awayTeam}', matchData.awayTeam.name ?? '')
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
      .replaceAll('{homeTeam}', matchData.homeTeam.name ?? '')
      .replaceAll('{awayTeam}', matchData.awayTeam.name ?? '')
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
    </div>
  );
};
MatchDetailedPage.getInitialProps = async (
  context: NextPageContext
): Promise<IMatchDetail> => {
  const { locale, query } = context;
  const matchParams = query.matchParams || [];
  const sportEventId = matchParams.at(-1);

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/tennis/event/${sportEventId}`;
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
      locale: locale,
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
    locale: locale,
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
