/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import { Tooltip } from 'flowbite-react';
import { useTranslation } from 'next-i18next';
import tw from 'twin.macro';

import useTrans from '@/hooks/useTrans';

// import AggregateScoreSection from '@/components/modules/baseketball/quickviewColumn/quickviewDetailTab/AggregateScoreSection';
import { TwMbQuickViewWrapper } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import RefereeSection from '@/components/modules/football/quickviewColumn/quickviewDetailTab/RefereeSection';
import {
  TwQuickViewSection,
  TwQuickViewTitleV2,
} from '@/components/modules/football/tw-components';
import { TwQVDetailTabContainer } from '@/components/modules/football/tw-components/TwQuickview.module';

import { SportEventDto, SportEventDtoWithStat } from '@/constant/interface';

import MatchPerfomanceSection from '@/components/modules/hockey/quickviewColumn/quickviewDetailTab/MatchPerfomanceSection';
import RoundOfMatchSection from '@/components/modules/hockey/quickviewColumn/quickviewDetailTab/RoundOfMatchSection';
import { format } from 'date-fns';
import { useMemo } from 'react';
import vi from '~/lang/vi';
import OddDownSVG from '/public/svg/odd-down.svg';
import OddUpSVG from '/public/svg/odd-up.svg';
import { isMatchNotStartedHockey } from '@/utils';
import { useMatchScores } from '@/hooks/useHockey/useMatchScores';

const QuickViewDetailTab = ({
  matchData,
  setActiveTab,
  sport = 'football',
  isDetail,
}: {
  matchData: SportEventDtoWithStat;
  managerData?: any;
  setActiveTab?: (e: string) => void;
  sport?: string;
  setTabActive?: (e: string) => void;
  isDetail?: boolean;
}) => {
  const i18n = useTrans();
  const matchScores = useMatchScores(matchData);

  return (
    <div className='space-y-8 px-2 lg:px-0'>
      <RoundOfMatchSection matchScores={matchScores} homeTeam={matchData?.homeTeam} awayTeam={matchData?.awayTeam} />

      {/* match performance */}

      <MatchPerfomanceSection matchData={matchData} />

      <TwQVDetailTabContainer className='space-y-8 pb-8'>
        {/* TIMELINE */}
        {/* <MatchEventSection matchData={matchData} /> */}
        <div className='space-y-8 px-2.5 lg:px-0'>
          {/*  TY LE CHIEN THANG */}
          {/* <WinRateSection
            i18n={i18n}
            matchId={matchData?.id}
            statusCode={matchData?.status?.code}
            homeTeam={matchData?.homeTeam?.name as string}
            awayTeam={matchData?.awayTeam?.name as string}
          /> */}

          {/* PHONG DO */}
          {/* <QuickViewForm
            homeData={homeData}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            awayData={awayData}
          /> */}

          {/* TRƯỚC TRẬN ĐẤU */}
          {/* <PrematchStandingSection
            matchData={matchData}
            i18n={i18n}
            setActiveTab={setActiveTab}
          /> */}
          {/* ODDS  */}
          {/* only show on domain '.com' */}
          {/* {isShowOdds(path) && showOdds && (
            <MatchWinningOddsSection i18n={i18n} matchData={matchData} />
          )} */}
          {/* TRỌNG TÀI */}
          <RefereeSection i18n={i18n} matchData={matchData} />
          {/* H2H */}
          {/* <ManagerH2HSection
          matchData={matchData}
          i18n={i18n}
        ></ManagerH2HSection> */}
          {/* <TeamH2HSection matchData={matchData} i18n={i18n} /> */}
          {/* SÂN VẬN ĐỘNG */}
          {matchData?.venue && Object.keys(matchData?.venue).length > 0 && (
            <VenueSection i18n={i18n} matchData={matchData} />
          )}
        </div>
      </TwQVDetailTabContainer>
    </div>
  );
};

export default QuickViewDetailTab;

export const buildTimeDisplay = (time: any, addedTime: any) => {
  if (addedTime && Number(addedTime) > 0 && Number(addedTime) < 30) {
    return (
      <span className='text-csm dark:text-white'>
        {time}' <sup>+{addedTime}</sup>
      </span>
    );
  }

  return time > 0 && <span>{time}'</span>;
};

// export const TwTimeLineEventContentHome = tw.div`flex px-1 py-2 h-full w-full flex-1 place-content-end border-t-2 border-logo-blue bg-light-match dark:bg-dark-match relative`;

export const MileStone = ({
  content = '',
  className,
}: {
  content?: string;
  className?: string;
}) => {
  return (
    <li className='my-2 flex place-content-center p-2'>
      {/* <div className='w-1/2 rounded-full bg-light-match p-1 text-center text-xs font-semibold text-logo-blue dark:bg-dark-match'> */}
      <div
        className={clsx(
          'w-1/2 rounded-full p-1 text-center text-xs font-medium text-white dark:bg-dark-brand-box dark:brightness-125',
          className
        )}
      >
        {content}
      </div>
      {/* <div className='dev2 h-5'>HT</div> */}
      {/* <div className='dev2 h-5 w-1/2 border-l-2 border-light-line-stroke-cd dark:border-dark-stroke'></div> */}
    </li>
  );
};

export const InjuryTime = ({ content = '' }: { content?: string }) => {
  const { t } = useTranslation();

  return (
    <li className='my-2 flex place-content-center p-2'>
      <div className='w-1/2 rounded-full bg-light-match p-1 text-center text-xs dark:bg-dark-match'>
        {t('football:timeline.additional_time')}: {content && `${content}'`}
      </div>
    </li>
  );
};

export const varResult = (incidentClass: any, confirmed: any, i18n: any) => {
  const results: { [key: string]: { [key: string]: string } } = {
    goalAwarded: {
      true: i18n.qv.goalAwarded,
      false: i18n.qv.goalNotAwarded,
    },
    goalNotAwarded: {
      true: i18n.qv.goalNotAwarded,
      false: i18n.qv.goalAwarded,
    },
    penaltyNotAwarded: {
      true: i18n.qv.penaltyNotAwarded,
      false: i18n.qv.penaltyAwarded,
    },
    penaltyAwarded: {
      true: i18n.qv.penaltyAwarded,
      false: i18n.qv.penaltyNotAwarded,
    },
    redCardGiven: {
      true: i18n.qv.redCardGiven,
      false: i18n.qv.redCardNotGiven,
    },
    redCardNotGiven: {
      true: i18n.qv.redCardNotGiven,
      false: i18n.qv.redCardGiven,
    },
    cardUpgrade: {
      true: i18n.qv.redCardGiven,
      false: i18n.qv.redCardGiven,
    },
    penaltyCancelled: {
      true: i18n.qv.penaltyCancelled,
      false: i18n.qv.penaltyCancelled,
    },
  };

  if (results[incidentClass]) {
    return results[incidentClass][
      (confirmed && confirmed.toString()) || 'false'
    ];
  }

  return '';
};

export const OddsTitle = tw.div`text-csm text-black dark:text-dark-text`;
export const TwOddsRow = tw.div`flex justify-evenly gap-2 pt-0.5`;

export const OddsCell = ({
  label,
  rate,
  isUp,
  isHome = true,
}: {
  label?: string;
  rate?: number;
  isUp?: boolean | null;
  isHome?: boolean;
}) => {
  return (
    <div
      className='flex-1 space-y-0.5 rounded-md border bg-white py-0.5 text-center text-xs dark:bg-dark-main'
      css={[
        // tw`flex-1 rounded-md border py-0.5 text-center text-csm bg-light-match dark:bg-dark-match`,
        isHome && tw`border border-logo-blue/50`,
        !isHome && tw`border border-[#C7ECBA]/70`,
      ]}
    >
      <div className=' text-dark-text'>
        {label}
        <div className='relative space-x-1'>
          <span className=' text-xs font-bold text-black dark:text-white'>
            {rate || '-'}
          </span>
          <div className='absolute left-[60%] top-0 translate-x-1/2'>
            {isUp === false && (
              <OddUpSVG className='inline text-dark-win'></OddUpSVG>
            )}

            {isUp === true && (
              <OddDownSVG className='inline text-dark-loss'></OddDownSVG>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TwBigBlueText = tw.span`text-xs font-medium text-all-blue underline uppercase px-2`;

export const TwCardItem = tw.div``;
export const TwYellowCard = tw.span`h-[0.6rem] rounded-sm w-1.5 bg-logo-yellow`;
export const TwRedCard = tw.span`h-[0.6rem] rounded-sm block w-1.5 bg-dark-loss`;
export const TwHomeEvent = tw.span`absolute left-0 top-6`;
export const TwAwayEvent = tw.span`absolute left-0`;

export const VenueSection = ({
  matchData,
  i18n = vi,
}: {
  matchData: SportEventDto;
  i18n?: any;
}) => {
  const { venue } = matchData;
  // const { city, stadium, country } = venue!;

  const formattedDate = useMemo(
    () =>
      format(
        new Date(matchData.startTimestamp * 1000),
        'dd/MM/yy • HH:mm'
      ),
    []
  );
  if (venue && Object.keys(venue).length <= 0) return <></>;

  return (
    <TwMbQuickViewWrapper>
      <TwQuickViewTitleV2 className='text-center'>
        {i18n.match.matchInfo}
      </TwQuickViewTitleV2>
      <div className='dark:border-linear-box rounded-md bg-white dark:bg-primary-gradient'>
        <TwQuickViewSection className='space-y-2 p-4'>

          {/* <div className='flex justify-between border-b border-dashed border-[#272a31] pb-1'>
            <div className='flex gap-x-2'>
              <StadiumSVG className='h-6 w-6' />
              <TwContentVenue>{i18n?.qv.name}</TwContentVenue>
            </div>
            <TwContentVenue className='text-black dark:!text-white'>
              {venue?.name}
            </TwContentVenue>
          </div> */}
          {/* <div className='flex justify-between border-b border-dashed border-[#272a31] pb-1'>
            <div className='flex gap-x-2'>
              <AddressSVG className='h-6 w-6' />
              <TwContentVenue>{i18n?.qv.location}</TwContentVenue>
            </div>
            <TwContentVenue className='text-black dark:!text-white'>
              {city?.name || ''}{' '}
              {city?.name && country?.name ? `, ${country.name}` : ''}
            </TwContentVenue>
          </div>
          <div className='flex justify-between '>
            <div className='flex gap-x-2'>
              <CapacitySVG className='h-6 w-6' />
              <TwContentVenue>{i18n?.competitor.capacity}</TwContentVenue>
            </div>
            <TwContentVenue className='text-black dark:!text-white'>
              {stadium?.capacity}
            </TwContentVenue>
          </div> */}
          <div className='flex flex-col justify-between gap-y-1'>
            <TwContentVenue className='text-black dark:!text-white'>
              <span>{matchData?.uniqueTournament?.name}</span>
            </TwContentVenue>
            <TwContentVenue>{formattedDate}</TwContentVenue>
          </div>
        </TwQuickViewSection>
      </div>
    </TwMbQuickViewWrapper>
  );
};

export const TwContentVenue = tw.span`text-csm dark:text-dark-text`;

export const TooltipDetailMatch = ({
  event,
  icon,
  iconTooltip,
  className,
}: {
  event: any;
  icon: React.ReactNode;
  iconTooltip?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={clsx(className, 'absolute left-0 top-6 z-10')}>
      <Tooltip
        className='relative'
        content={
          <div className='w-full text-xs'>
            <div className='flex items-center justify-start gap-x-1 whitespace-nowrap'>
              <div className='h-4 w-4'>{iconTooltip || icon}</div>
              <span className='leading-1 w-full'>{event?.player?.name}</span>
              <span className='leading-1 ml-1 rounded-cmd bg-all-blue p-1'>
                {event.time}'
              </span>
            </div>
          </div>
        }
      >
        <div className='absolute top-0 h-3 w-3.5 rounded-full bg-[#2196F3] opacity-0 shadow-[0px_0px_2px_1px_rgba(188,188,188,0.66)] hover:opacity-100'></div>
        <div className='flex h-3 w-3.5 justify-center'>{icon}</div>
      </Tooltip>
    </div>
  );
};
