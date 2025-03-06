import { MainLayout } from '@/components/layout';
import { MainLeftMenu } from '@/components/menus';
import { BxhMainColContentSection } from '@/components/modules/common';
import { BxhFilterColumn } from '@/components/modules/football/standings';
import { BxhMainColHeader } from '@/components/modules/football/standings/BxhMainColumnComponents';
import {
  TwBxhFilterCol,
  TwDataSection,
  TwMainCol,
} from '@/components/modules/football/tw-components';
import { SPORT } from '@/constant/common';

import { NextPageWithLayout } from '@/models';

interface Props {
  seoTitle?: string;
  description?: string;
}

const FootballBxhSubPage: NextPageWithLayout<Props> = () => {
  return (
    <>
      <MainLeftMenu sport={SPORT.FOOTBALL} />
      {/* Sliding mobile menu */}
      {/* <BxhTopLeaugesMb></BxhTopLeaugesMb> */}

      <TwDataSection className='layout'>
        <TwBxhFilterCol className='flex-shrink-1 hidden lg:flex'>
          <BxhFilterColumn sport='football' />
        </TwBxhFilterCol>

        <TwMainCol>
          <div className='h-full space-y-4 rounded-md'>
            <BxhMainColHeader />
            <BxhMainColContentSection></BxhMainColContentSection>
          </div>
        </TwMainCol>
        {/* Data section end */}
      </TwDataSection>
    </>
  );
};

// FootballBxhSubPage.getInitialProps = async (context: NextPageContext) => {
//   const { leagueId } = context.query;
//   const competitionId = leagueId
//     ? (leagueId[leagueId.length - 1] as string)
//     : '';

//   const seoTitles = (name: string): string => {
//     return `Bảng xếp hạng ${name}`;
//   };

//   const description = (name: string): string => {
//     return `Xem Bảng xếp hạng ${name}`;
//   };

//   const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/unique-tournament/${competitionId}`;
//   const config = {
//     method: 'get',
//     maxBodyLength: Infinity,
//     url: url,
//     headers: {},
//   };

//   const competitionData = await axios
//     .request(config)
//     .then((response) => {
//       return response.data.data;
//     })
//     .catch((error) => {
//       console.log(error);
//       return -1;
//     });

//   return {
//     seoTitle: seoTitles(competitionData.uniqueTournament.name),
//     description: description(competitionData.uniqueTournament.name),
//   };
// };

FootballBxhSubPage.Layout = MainLayout;

export default FootballBxhSubPage;
