/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import { GetStaticPaths, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { HiPlus } from 'react-icons/hi';
import tw from 'twin.macro';

import { useRefereeEventsData } from '@/hooks/useFootball';

import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/common';
import { ArrowDownIcon, ArrowUpIcon, CurrenyIcon } from '@/components/icons';
import { MainLeftMenu } from '@/components/menus';
import {
  Divider,
} from '@/components/modules/football/quickviewColumn/QuickViewColumn';
import {
  TwCard,
  TwDetailPageSmallCol,
  TwFilterButton,
  TwMainColDetailPage,
  TwMobileView,
  TwQuickViewSection,
  TwTitle,
} from '@/components/modules/football/tw-components';

import { useMatchStore } from '@/stores';

import { LeagueQuickViewSection } from '@/modules/football/competition/components';
import { TeamMatchRow } from '@/modules/football/competitor/components';
import { formatTimestamp, getAgeFromTimestamp } from '@/utils';


import { SPORT } from '@/constant/common';
import vi from '~/lang/vi';
import BirthSVG from '/public/svg/birth.svg';
import HeightSVG from '/public/svg/height.svg';
import MarketValueSVG from '/public/svg/market-value.svg';
import MessageBoxSVG from '/public/svg/message-box.svg';
import NationalitySVG from '/public/svg/nationality.svg';
import OneSVG from '/public/svg/one.svg';
import PositionSVG from '/public/svg/position.svg';
import RwSVG from '/public/svg/rw.svg';
import ShirtNoSVG from '/public/svg/shirt-no.svg';
import StSVG from '/public/svg/st.svg';
import StrongFootSVG from '/public/svg/strong-foot.svg';
import WhistleStatsSVG from '/public/svg/whistle-stats.svg';

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps = async (context: any) => {
  const { params = {}, locale = vi } = context;
  const { refereeId = [] } = params;
  const referee_Id = refereeId[refereeId.length - 1];

  const url = `https://apisf.p2pcdn.xyz/api/v1/referee/${referee_Id}`;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {},
  };

  const refereeData = await axios
    .request(config)
    .then((response) => {
      return response.data || {};
    })
    .catch((error) => {
      return -1;
    });

  const urlStatistic = `https://apisf.p2pcdn.xyz/api/v1/referee/71289/statistics`;
  const configStatistic = {
    method: 'get',
    maxBodyLength: Infinity,
    url: urlStatistic,
    headers: {},
  };
  const refereeStatisticData = await axios
    .request(configStatistic)
    .then((response) => {
      return response.data || {};
    })
    .catch((error) => {
      return -1;
    });

  if (refereeData === -1) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {
      refereeDetails: refereeData,
      statistic: refereeStatisticData,
    },
    revalidate: 1800,
  };
};

interface Props {
  refereeDetails: any;
  statistic: any;
}

const RefereeDetailedPage: NextPage<Props> = ({
  refereeDetails,
  statistic,
}: Props) => {
  const { t } = useTranslation();
  const { referee = {} } = refereeDetails || {};
  const {
    // id,
    name,
    // slug,
  } = referee || {};
  return (
    <>
      <MainLeftMenu sport={SPORT.FOOTBALL} />

      <div className='layout'>
        <BreadCrumb className='no-scrollbar overflow-scroll py-2.5'>
          <BreadCumbLink
            href='/'
            name={t('football:common.football')}
          ></BreadCumbLink>
          <BreadCrumbSep></BreadCrumbSep>
          <BreadCumbLink href='/' name='Referee' isEnd></BreadCumbLink>
          <BreadCrumbSep></BreadCrumbSep>
          <BreadCumbLink href='/' name={name} isEnd></BreadCumbLink>
        </BreadCrumb>
      </div>

      <TwMobileView className='space-y-4'></TwMobileView>

      <div>
        <div className='layout flex flex-col gap-3 lg:flex-row '>
          <TwDetailPageSmallCol className='w-full space-y-4 lg:w-2/3'>
            <ManagerImageSection manager={referee}></ManagerImageSection>
            <TwTitle className='pl-2.5 pt-2.5'>Trận đấu</TwTitle>
            <ManagerMatchesSection manager={referee} />
          </TwDetailPageSmallCol>

          <TwMainColDetailPage className='flex-1 space-y-4'>
            <div className=''>
              <TwCard className=''>
                <TwTitle className='py-2.5 text-center'>
                  Referee career statistic
                </TwTitle>
                <Divider />
                <TwMainColContainer className=''>
                  <StatisticHistorySection statistic={statistic} />
                </TwMainColContainer>
              </TwCard>
            </div>
          </TwMainColDetailPage>
        </div>
      </div>
    </>
  );
};

export default RefereeDetailedPage;

export const ManagerMatchesSection = ({ manager }: { manager: any }) => {
  const [page, setPage] = useState<number>(0);

  const { teams = [], id: managerId } = manager || {};
  let team: any = {};
  if (teams.length) {
    team = teams[0];
  }

  const {
    data: nextEventsData,
    isLoading,
    isFetching,
    isError: isErrorNext,
  } = useRefereeEventsData(managerId, 'next', page);

  const {
    data: lastEventsData,
    isLoading: isLoadingLastEvents,
    isFetching: isFetchingLastEvents,
    isError: isErrorLast,
  } = useRefereeEventsData(managerId, 'last', page);

  const { setSelectedMatch, setShowSelectedMatch } = useMatchStore();

  useEffect(() => {
    const { events: nextEvents } = nextEventsData || [];
    const { events: lastEvents } = lastEventsData || [];

    let shownMatch = null;
    if (lastEvents && lastEvents.length > 0) {
      shownMatch = lastEvents[lastEvents.length - 1];
    } else if (nextEvents && nextEvents.length > 0) {
      shownMatch = nextEvents[0];
    }
    if (shownMatch) {
      setSelectedMatch(shownMatch?.id || shownMatch.customId);
      setShowSelectedMatch(true);
    }
  }, [setSelectedMatch, setShowSelectedMatch, nextEventsData, lastEventsData]);

  if (isFetching || isLoading || isFetchingLastEvents || isLoadingLastEvents) {
    return <></>;
  }

  const allEvents = [
    ...(lastEventsData?.events || []),
    ...(nextEventsData?.events || []),
  ].reverse();

  return (
    <>
      <div className='mb-2.5 flex w-full justify-between px-2 lg:w-1/2'>
        {(!isErrorLast || page > 0) && (
          <TwFilterButton onClick={() => setPage(page - 1)}>
            Previous
          </TwFilterButton>
        )}
        {/* <span>{page}</span> */}
        {(!isErrorNext || page < 0) && (
          <TwFilterButton onClick={() => setPage(page + 1)}>
            Next
          </TwFilterButton>
        )}
      </div>
      <div className='flex max-h-[75vh]'>
        <div className='w-1/2 flex-1 overflow-y-auto scrollbar xl:pl-2'>
          <ul className='space-y-1.5 '>
            {allEvents.map((match: any, idx: number) => {
              return (
                <TeamMatchRow
                  key={idx}
                  matchData={match}
                  teamId={team?.id}
                ></TeamMatchRow>
              );
            })}
          </ul>
        </div>
        {/* TODO add quick view here */}
        <div className='hidden flex-1 overflow-auto' css={[tw`lg:block`]}>
          <LeagueQuickViewSection></LeagueQuickViewSection>
        </div>
      </div>
    </>
  );
};

export const TwTransferFeeText = tw.div`text-xs font-normal not-italic leading-5 dark:text-dark-text`;
export const TwTransferValueText = tw.div`text-xs font-normal leading-5 text-dark-text`;
export const TwSectionContainer = tw.div`flex flex-col gap-3 lg:flex-row`;
export const TwMainColContainer = tw.div`flex flex-col lg:flex-row`;

export const StatisticHistorySection = ({ statistic }: { statistic: any }) => {
  return (
    <>
      <div className='w-full p-2'>
        <div className='grid grid-cols-3 text-sm'>
          <div className='col-span-2'>Competitions</div>
          <div className='col-span-1 grid grid-cols-4'>
            <div className='text-center'>App</div>
            <div className='text-center'>Y/G</div>
            <div className='text-center'>Red</div>
            <div className='text-center'>Pen</div>
          </div>
        </div>
        {statistic?.statistics.map((item: any, index: number) => (
          <div className='grid grid-cols-3 text-csm' key={index}>
            <div className='col-span-2 flex w-full max-w-[80%] items-center gap-2 truncate'>
              <img
                src={`https://api.sofascore.app/api/v1/unique-tournament/${item.uniqueTournament?.id}/image/dark`}
                alt=''
                className='h-10 w-10'
              />
              <p>{item.uniqueTournament.name}</p>
            </div>
            <div className='col-span-1 grid grid-cols-4 items-center'>
              <div className='text-center'>{item.appearances}</div>
              <div className='text-center'>{item.yellowCards}</div>
              <div className='text-center'>{item.redCards}</div>
              <div className='text-center'>{item.penalty}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export const ManagerImageSection = ({ manager }: { manager: any }) => {
  const { id, name } = manager || {};
  const [isErrorManager, setIsErrorManager] = useState<boolean>(false);

  return (
    <TwCard className='space-y-4 p-2.5'>
      <div className=' dark:text-dark-text'>
        <div className='rounded-md bg-gradient-to-t from-[#17354D] to-[#FF9081] py-8 text-center'>
          <img
            src={`${
              isErrorManager
                ? '/images/football/players/unknown1.webp'
                : `${process.env.NEXT_PUBLIC_CDN_DOMAIN_URL}/referee/${id}/image`
            }`}
            width={196}
            height={196}
            alt='...'
            className='inline-block rounded-full'
            onError={() => setIsErrorManager(true)}
          ></img>
        </div>
        <h1 className='py-3 text-center text-xl font-bold text-black dark:text-white'>
          {name}
        </h1>
        <div className=' flex place-content-center items-center gap-x-4 rounded-full bg-light-match py-3 dark:bg-dark-match'>
          <div className='relative'>
            <MessageBoxSVG className='h-10 w-10'></MessageBoxSVG>
            <FaBell className='absolute right-0 top-0 h-5 w-5 text-logo-yellow'></FaBell>
            <OneSVG className='absolute right-0 top-0 h-3 w-3 text-red-600'></OneSVG>
          </div>
          <div className='space-y-1.5'>
            <div className='text-sm font-semibold not-italic leading-5'>
              Nhận thông tin từ trọng tài này
            </div>
            <div className='flex items-center gap-3'>
              <button className='flex items-center gap-1 rounded-full bg-dark-win px-3 py-2 text-csm font-medium not-italic leading-4 text-white'>
                Theo dõi <HiPlus></HiPlus>
              </button>
              <span className='flex items-center gap-1 text-csm'>
                <span className=' text-dark-win'>2.9k</span>
                <span className=' '>người theo dõi</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <TwQuickViewSection className='p-2.5'>
        <ManagerGeneralInfoSection
          manager={manager}
        ></ManagerGeneralInfoSection>
      </TwQuickViewSection>
    </TwCard>
  );
};

export const GeneralInfoSection = () => {
  const { t } = useTranslation();
  return (
    <div className=' flex-1 space-y-2.5'>
      <div className=''>
        <div className=' py-2'>
          <div className='dev2 plae flex items-center gap-4'>
            <Image
              unoptimized={true}
              src='/images/football/teams/ars.png'
              alt='man-utd'
              width={48}
              height={48}
            ></Image>
            <div>
              <div className='truncate text-base font-bold leading-5'>
                Manchester United
              </div>
              <div className='truncate text-xs font-normal leading-4 dark:text-dark-text'>
                Hợp đồng đến 30 tháng 06 năm 2025
              </div>
            </div>
          </div>
        </div>
        <div className=' flex py-2'>
          <GeneralInfo
            label='Quốc tịch'
            icon={
              <NationalitySVG className='inline-block h-5 w-5'></NationalitySVG>
            }
            subLabel='ENG'
            subLabelImgUrl='/images/countries/england.png'
          ></GeneralInfo>

          <GeneralInfo
            label='Ngày sinh'
            icon={<BirthSVG className='inline-block h-5 w-5'></BirthSVG>}
            subLabel='31/10/1997 (25 tuổi)'
          ></GeneralInfo>
        </div>
        <div className=' flex py-2'>
          <GeneralInfo
            label='Chiều cao'
            icon={<HeightSVG className='inline-block h-5 w-5'></HeightSVG>}
            subLabel='186cm'
          ></GeneralInfo>
          <GeneralInfo
            label='Thuận chân'
            icon={
              <StrongFootSVG className='inline-block h-5 w-5'></StrongFootSVG>
            }
            subLabel='Phải'
          ></GeneralInfo>
        </div>
        <div className=' flex py-2'>
          <GeneralInfo
            label='Vị trí'
            icon={<PositionSVG className='inline-block h-5 w-5'></PositionSVG>}
            subLabel='ST'
          ></GeneralInfo>
          <GeneralInfo
            label='Số áo'
            icon={<ShirtNoSVG className='inline-block h-5 w-5'></ShirtNoSVG>}
            subLabel='3'
          ></GeneralInfo>
        </div>
      </div>
      <TwQuickViewSection className=''>
        <div className='flex place-content-center items-center gap-x-4 p-2.5'>
          <div>
            <MarketValueSVG className='h-10 w-10'></MarketValueSVG>
          </div>
          <div>
            <span className='text-sm uppercase dark:text-dark-text'>
              Giá trị
            </span>{' '}
            <span className=' font-bold text-logo-blue'>63M €</span>
          </div>
        </div>
        <Divider></Divider>
        <div className='flex justify-between p-2.5 text-sm'>
          <div>{t('football:player.isCrease')}</div>
          <div className='flex space-x-2'>
            <button className=' rounded-md bg-white p-2 text-center'>
              <ArrowUpIcon className='mx-auto text-dark-win'></ArrowUpIcon>
              <CurrenyIcon className='w-6'></CurrenyIcon>
            </button>
            <button className=' rounded-md bg-white p-2'>
              <CurrenyIcon className='w-6 '></CurrenyIcon>
              <ArrowDownIcon className=' mx-auto text-dark-loss'></ArrowDownIcon>
            </button>
          </div>
        </div>
      </TwQuickViewSection>
      <div className=' flex justify-between rounded-md bg-[#3D9F53] p-2'>
        <div className='flex w-1/2 flex-col place-content-center gap-3 text-csm leading-4'>
          <div>
            <p className='text-strength'>Điểm mạnh</p>
            <p>Passing Anchor play</p>
          </div>
          <div>
            <p className='text-csm text-weekness'>Điểm yếu</p>
            <p>No outstanding weekness</p>
          </div>
        </div>
        <div className=' relative'>
          <RwSVG className='absolute left-10 top-5 h-6 w-5'></RwSVG>
          <StSVG className='absolute left-5 top-11 h-6 w-5'></StSVG>
          <Image
            unoptimized={true}
            src='/images/football/general/stadium-small.png'
            height={28}
            width={196}
            alt='stadium'
            className=' '
          ></Image>
        </div>
      </div>
    </div>
  );
};

const GeneralInfo = ({
  label,
  icon,
  subLabel,
  subLabelImgUrl,
}: {
  label: string;
  icon: React.ReactNode;
  subLabel: string;
  subLabelImgUrl?: string;
}) => {
  return (
    <div className=' flex-1 space-y-1'>
      <div className=' flex items-center'>
        <span className='w-12 text-center dark:text-dark-text'>
          {/* <NationalitySVG className='inline-block h-5 w-5'></NationalitySVG> */}
          {icon}
        </span>
        <span className='border-l-2 border-logo-blue px-2 text-csm font-normal leading-5 text-logo-blue'>
          {label}
        </span>
      </div>
      <div className=' flex items-center'>
        <span className='w-12'></span>
        <span className='flex items-center gap-2 px-2'>
          {subLabelImgUrl && (
            <img
              src={subLabelImgUrl || ''}
              alt={subLabel}
              width={16}
              height={16}
              className='rounded-full'
            ></img>
          )}
          <span className='text-xs font-normal leading-4 dark:text-dark-text'>
            {subLabel}
          </span>
        </span>
      </div>
    </div>
  );
};

export const ManagerGeneralInfoSection = ({ manager }: { manager: any }) => {
  const { country = {}, games, dateOfBirthTimestamp } = manager || {};

  const { name: countryName, alpha2 = '' } = country;

  return (
    <>
      <div className=' flex-1 space-y-2.5'>
        <div className=''>
          <div className=' flex py-2'>
            <GeneralInfo
              label='Quốc tịch'
              icon={
                <NationalitySVG className='inline-block h-5 w-5'></NationalitySVG>
              }
              subLabel={countryName}
              subLabelImgUrl={`${
                process.env.NEXT_PUBLIC_API_DOMAIN_IMAGE_URL_2
              }/${alpha2.toLowerCase()}.png`}
            ></GeneralInfo>
            <GeneralInfo
              label='Ngày sinh'
              icon={<BirthSVG className='inline-block h-5 w-5'></BirthSVG>}
              subLabel={`${formatTimestamp(
                dateOfBirthTimestamp,
                'yyyy-MM-dd'
              )} (${getAgeFromTimestamp(dateOfBirthTimestamp)} tuổi)`}
            ></GeneralInfo>
            <GeneralInfo
              label='Số trận'
              icon={
                <WhistleStatsSVG className='inline-block h-5 w-5'></WhistleStatsSVG>
              }
              subLabel={games}
            ></GeneralInfo>
          </div>
        </div>
      </div>
    </>
  );
};
