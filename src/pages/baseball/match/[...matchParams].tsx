import axios from 'axios';
import { NextPage, NextPageContext } from 'next';
import { useMemo } from 'react';

import Seo from '@/components/Seo';
import { LiveMatchesLoaderSection as BBLiveMatchesLoaderSection } from '@/components/modules/baseball/loaderData';

import { SportEventDtoWithStat } from '@/constant/interface';
import BBMatchDetails from '@/modules/baseball/matchDetails/pages';
import { formatTimestamp } from '@/utils';
import useTrans from '@/hooks/useTrans';
import { SPORT } from '@/constant/common';

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
  // Khi disconnect socket thì getinitialProps không refetch được => cần refetch như thế này => sẽ tối ưu sau
  // Về bản chất thì chỉ nên initial những thông tin từ admin => còn lại nên fetch ở phía client sẽ đỡ gây nên những case ẩn :D

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
      <BBMatchDetails
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

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/baseball/sport-event/${sportEventId}`;
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
      };
    }
  } catch (error) {
    return {
      matchData: undefined,
      locale: locale,
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
    matchId: sportEventId,
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

export default MatchDetailedPage;
