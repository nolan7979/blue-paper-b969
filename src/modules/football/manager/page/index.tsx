import useTrans from '@/hooks/useTrans';

import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/common';
import {
  TwCard,
  TwDetailPageSmallCol,
  TwMainColContainer,
  TwMainColDetailPage,
  TwMobileView,
  TwTitle,
} from '@/components/modules/football/tw-components';
import { Divider } from '@/components/modules/football/tw-components/TwPlayer';

import AboutManagerSection from '@/modules/football/manager/components/AboutManagerSection';
import CareerHistorySection from '@/modules/football/manager/components/CareerHistorySection';
import { ManagerImageSection } from '@/pages/football/referee/[...refereeId]';

interface ManagerPageProps {
  manager: any;
  managerDetails: any;
  managerCareerHistory: any;
  name: string;
}

const ManagerPage: React.FC<ManagerPageProps> = ({
  name,
  manager,
  managerCareerHistory,
  managerDetails,
}) => {
  const i18n = useTrans();

  return (
    <>
      <div className='layout'>
        <BreadCrumb className='no-scrollbar overflow-scroll py-2.5'>
          <BreadCumbLink
            href='/'
            name={i18n.common.football}
          ></BreadCumbLink>
          <BreadCrumbSep></BreadCrumbSep>
          <BreadCumbLink href='/' name='Manager' isEnd></BreadCumbLink>
          <BreadCrumbSep></BreadCrumbSep>
          <BreadCumbLink href='/' name={name} isEnd></BreadCumbLink>
        </BreadCrumb>
      </div>

      <TwMobileView className='space-y-4'></TwMobileView>

      <div>
        <div className='layout flex flex-col gap-3 lg:flex-row '>
          {/* <TwSectionContainer className=''> */}
          <TwDetailPageSmallCol className='w-full space-y-4 lg:w-1/3'>
            <ManagerImageSection manager={manager}></ManagerImageSection>

            <AboutManagerSection></AboutManagerSection>
          </TwDetailPageSmallCol>

          <TwMainColDetailPage className='flex-1 space-y-4'>
            <div className=''>
              {/* <TwCard className='  flex flex-col gap-2.5 p-2.5 lg:flex-row'>
                <div className='h-36 w-full lg:w-1/2'>
                  Điểm trung bình mỗi trận
                </div>
                <div className='flex-1 rounded-md bg-[#2b3459] p-2'>
                  Skill Graph
                </div>
              </TwCard> */}
              <TwCard className=''>
                <TwTitle className='py-2.5 text-center'>
                  {/* {i18n.titles.startupHistory} */}
                </TwTitle>
                <Divider></Divider>
                <TwMainColContainer className=''>
                  <CareerHistorySection
                    managerDetails={managerDetails}
                    managerCareerHistory={managerCareerHistory}
                  ></CareerHistorySection>
                </TwMainColContainer>
              </TwCard>
            </div>

            {/* <TwCard className='space-y-2.5'>
              <TwTitle className='pl-2.5 pt-2.5'>Trận đấu</TwTitle>
              <ManagerMatchesSection
                manager={manager}
                i18n={i18n}
              ></ManagerMatchesSection>
            </TwCard> */}
          </TwMainColDetailPage>
          {/* </TwSectionContainer> */}
        </div>
      </div>
    </>
  );
};

export default ManagerPage;
