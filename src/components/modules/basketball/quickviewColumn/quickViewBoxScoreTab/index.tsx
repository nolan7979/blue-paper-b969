/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { memo, useMemo, useState } from 'react';
import CustomLink from '@/components/common/CustomizeLink';

import useTrans from '@/hooks/useTrans';

import {
  TwBorderLinearBox,
  TwTabHead,
} from '@/components/modules/football/tw-components/TwCommon.module';

import { SPORT } from '@/constant/common';
import { SportEventDtoWithStat } from '@/constant/interface';
import { Images, getImage, getSlug, isValEmpty } from '@/utils';
import Avatar from '@/components/common/Avatar';
import { SwitcherButton } from '@/components/common/odds/SwitcherButton';
import { BsInfoCircleFill } from 'react-icons/bs';
import { useBoxScoreData } from '@/hooks/useBasketball';
import CustomModal from '@/components/modal/CustomModal';
import CloseX from '/public/svg/close-x.svg';
import BottomSheetComponent from '@/components/modules/tennis/selects/BottomSheetComponent';
import { useWindowSize } from '@/hooks/useWindowSize';

const QuickViewBoxScoreTab = ({
  matchData,
}: {
  matchData: SportEventDtoWithStat;
}) => {
  const i18n = useTrans();
  const {id, homeTeam, awayTeam} = matchData;
  const { data } = useBoxScoreData(id, homeTeam?.id, awayTeam?.id);
  const [boxScoreFilter, setBoxScoreFilter] = useState<string>('home');
  const [showFullScore, setShowFullScore] = useState<boolean>(false);

  if (isValEmpty(matchData)) return <>{i18n.common.nodata}</>;

  if(!data) return <></>

  return (
    <div className='space-y-4 lg:bg-light px-2.5 pb-5 dark:bg-dark-card lg:px-0 rounded-lg'>
      <div className='flex justify-between items-center px-4 pt-4'>
        <div>
          <h2 className='text-csm text-black dark:text-white'>{i18n.box_score.box_appearance}</h2>
          <span className='text-[11px] gap-1 text-light-secondary'>{i18n.box_score.detail_view}</span>
        </div>
        <SwitcherButton
          value={showFullScore}
          handleChange={setShowFullScore}
        />
      </div>

      <div className='lg:px-4'>
        <BoxScoreFilter
          boxScoreFilter={boxScoreFilter}
          setBoxScoreFilter={setBoxScoreFilter}
          matchData={matchData}
          i18n={i18n}
        />
      </div>

      {boxScoreFilter === 'home' && (
        <div className='w-full overflow-x-auto'>
          <HeadBoxScore showFullScore={showFullScore} i18n={i18n} />
          {
            data && data?.home.length > 0 ? data?.home.map((it:any, idx:number) => <RowBoxScore key={it?.id} dataRow={it} showFullScore={showFullScore} index={idx} />) : <div className='text-center pt-3'>{i18n.common.nodata}</div>
          }
        </div>
      )}
      {boxScoreFilter === 'away' && (
        <div className='w-full overflow-x-auto'>
          <HeadBoxScore showFullScore={showFullScore} i18n={i18n} />
          {
            data && data?.away.length > 0 ? data?.away.map((it:any, idx:number) => <RowBoxScore key={it?.id} dataRow={it} showFullScore={showFullScore} index={idx} />) : <div className='text-center pt-3'>{i18n.common.nodata}</div>
          }
        </div>
      )}
    </div>
  );
};

export default QuickViewBoxScoreTab;

const BoxScoreFilter = ({
  boxScoreFilter,
  setBoxScoreFilter,
  matchData,
  i18n,
}: {
  boxScoreFilter?: string;
  setBoxScoreFilter?: any;
  matchData?: any;
  i18n?: any;
}) => {
  const { homeTeam = {}, awayTeam = {} } = matchData || {};
  return (
    <TwTabHead className='shadow-md'>
      <TwBorderLinearBox
        className={`h-full w-full !rounded-full ${
          boxScoreFilter === 'home' ? 'border-linear-form' : ''
        }`}
      >
        <button
          className={clsx(
            'flex h-full w-full items-center justify-center rounded-full',
            boxScoreFilter === 'home' ? 'dark:bg-button-gradient bg-dark-button' : ''
          )}
          onClick={() => setBoxScoreFilter('home')}
        >
          <Image
            unoptimized={true}
            src={`${getImage(
              Images.team,
              homeTeam?.id,
              true,
              SPORT.BASKETBALL
            )}`}
            alt='home team'
            width={24}
            height={24}
            className='h-5 w-5'
          />
        </button>
      </TwBorderLinearBox>
      <TwBorderLinearBox
        className={`h-full w-full !rounded-full ${
          boxScoreFilter === 'away' ? 'border-linear-form' : ''
        }`}
      >
        <button
          className={clsx(
            'flex h-full w-full items-center justify-center rounded-full',
            boxScoreFilter === 'away' ? 'dark:bg-button-gradient bg-dark-button' : ''
          )}
          onClick={() => setBoxScoreFilter('away')}
        >
          <Image
            unoptimized={true}
            src={`${getImage(
              Images.team,
              awayTeam?.id,
              true,
              SPORT.BASKETBALL
            )}`}
            alt='away team'
            width={24}
            height={24}
            className='h-5 w-5'
          />
        </button>
      </TwBorderLinearBox>
    </TwTabHead>
  );
};

export const BOX_SCORE_SHORT_TITLE_APPEARANCE = [
  { title: 'PTS', full_title: "PTS", key: 'score' },
  { title: 'REB', full_title: "REB", key: 'totalRebound' },
  { title: 'AST', full_title: "AST", key: 'assists' },
]
export const BOX_SCORE_TITLE_APPEARANCE = [
  {
    title: 'MIN',
    full_title: "MIN",
    key: 'timePresences'
  },
  { title: 'BLK', full_title: "BLK", key: 'blocks' },
  { title: 'STL', full_title: "STL", key: 'steals' },
  {
    title: 'FG',
    full_title: "FG_percent",
    key: 'hits',
    baseOnKey: 'shots'
  },

  {
    title: '3PT',
    full_title: "3P_percent",
    key: 'threePointsMades',
    baseOnKey: 'threePointsShots'
  },
  {
    title: 'FT',
    full_title: "FT_percent",
    key: 'throwsMades',
    baseOnKey: 'throwsShots'
  },
  {
    title: 'OREB',
    full_title: "OREB",
    key: 'offensiveRebounds'
  },
  {
    title: 'DREB',
    full_title: "DREB",
    key: 'defensiveRebounds'
  },
  { title: 'TOV', full_title: "TOV", key: 'numOfErrors' },
  {
    title: 'A/T',
    full_title: `A_T`,
    key: 'assists',
    baseOnKey: 'numOfErrors'
  },
  {
    title: 'PF',
    full_title: "PF",
    key: 'individualFouls'
  },
  { title: '+/-', full_title: "plus_minus", key: 'values' }
];

const safeDivide = (a: number, b: number): string => {
  if (b === 0 || isNaN(a) || isNaN(b)) {
    return '0';
  }
  return (a / b).toFixed(2);
};

const getValuePlayer = (
  statistics: { [key: string]: any },
  key: string,
  baseOnKey?: string
) => {
  if (key === 'assists' && baseOnKey === 'numOfErrors') {
    return safeDivide(statistics[key], statistics[baseOnKey]);
  }
  if (baseOnKey) {
    return `${statistics[key]} - ${statistics[baseOnKey]}`;
  }
  return statistics[key] || 0;
};

const HeadBoxScore = ({showFullScore, i18n}:any) => {
  const { width } = useWindowSize();
  const isMobile = useMemo(() => width < 1024, [width]);
  const [openModal, setOpenModal] = useState(false)
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const handleClickBox = () => {
    if(isMobile) {
      setShowBottomSheet(true)
    } else {
      setOpenModal(true)
    }
  }
  return (
    <>
      <div className='flex justify-between items-center bg-line-default dark:bg-dark-gray'>
        <div className='flex items-center z-[2] grow-0 shrink-0 basis-48 lg:basis-60 sticky left-0 px-4 py-2 gap-2 bg-line-default dark:bg-dark-gray text-csm text-black dark:text-white'>
          <span>{i18n.box_score.player}</span>
          <span onClick={() => handleClickBox()}>
            <BsInfoCircleFill />
          </span>
        </div>
        {/* end sticky */}
        <div className='flex py-2 bg-line-default dark:bg-dark-gray'>
          {showFullScore && <div className='w-14 text-center text-csm text-black dark:text-light-secondary'>{BOX_SCORE_TITLE_APPEARANCE[0].title}</div>}
          {BOX_SCORE_SHORT_TITLE_APPEARANCE.map((it:any) => <div key={it.key} className='w-14 text-center text-csm text-black dark:text-light-secondary'>{it.title}</div>)}
          {showFullScore && BOX_SCORE_TITLE_APPEARANCE.filter((fil:any) => fil.key !== 'timePresences').map((it:any) => <div key={it.key} className='w-14 text-center text-csm text-black dark:text-light-secondary'>{it.title}</div>)}
        </div>
      </div>
      <CustomModal open={openModal} setOpen={() => setOpenModal(!openModal)}>
        <div className='w-full'>
          <div className='flex mb-3 justify-between items-center text-csm text-black dark:text-white'>
            <h3>{i18n.box_score.box_title}</h3>
            <span className='cursor-pointer' onClick={() => setOpenModal(!openModal)}>
              <CloseX />
            </span>
          </div>
          <div className='w-full flex flex-wrap'>
            {
              [...BOX_SCORE_SHORT_TITLE_APPEARANCE, ...BOX_SCORE_TITLE_APPEARANCE].map((it:any) => (
                <div key={it.key} className='w-1/2 text-csm py-2'>
                  <label className='block text-light-secondary'>{it.title}</label>
                  <span className='text-black dark:text-white'>{i18n.box_score[it.full_title]}</span>
                </div>
              ))
            }
          </div>
        </div>
      </CustomModal>
      <BottomSheetComponent
        open={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
      >
        <div className='flex flex-col p-4'>
          <h3 className='mb-4 text-center text-black dark:text-white'>{i18n.box_score.box_title}</h3>
          <div className='max-h-[300px] overflow-y-scroll'>
            {
              [...BOX_SCORE_SHORT_TITLE_APPEARANCE, ...BOX_SCORE_TITLE_APPEARANCE].map((it:any) => (
                <div key={it.key} className='w-full  flex gap-2 text-csm py-2'>
                  <label className='block w-12 text-left text-light-secondary'>{it.title}</label>
                  <span className='text-black dark:text-white'>{i18n.box_score[it.full_title]}</span>
                </div>
              ))
            }
          </div>
        </div>
      </BottomSheetComponent>
    </>
  )
}

const RowBoxScore = ({dataRow, showFullScore, index}:any) => {
  const {player, position, shirtNumber, statistics } = dataRow;
  
  return (
    <div className='flex justify-between'>
      <div className='flex items-center z-[2] grow-0 shrink-0 basis-48 lg:basis-60 sticky left-0 px-4 gap-2 bg-white dark:bg-dark-card border-b border-line-default dark:border-dark-gray py-2'>
        <div className='relative'>
          <CustomLink href={`/${SPORT.BASKETBALL}/player/${getSlug(player?.name)}/${player?.id}`} target='_parent'>
            <Avatar
              id={player?.id}
              type='player'
              width={36}
              height={36}
              isSmall
              sport={SPORT.BASKETBALL}
            />
          </CustomLink>
          {index < 5 && <div className='border-solid border-[#1456FF] bg-gradient-to-tl from-[#0C1A4C] via-[#0C3089] to-[#1553EF] text-white text-xxs px-1 rounded-full absolute bottom-0 w-full left-0'>starter</div>}
        </div>
        <div className='gap-1'>
          <h3 className='text-black dark:text-white text-csm'>{player?.name}</h3>
          <p className='text-[11px] gap-1 text-light-secondary'><span className='text-black dark:text-white'>{shirtNumber}</span> {position}</p>
        </div>
      </div>
      {/* end sticky */}
      <div className='flex flex-1 justify-end items-center border-b border-line-default dark:border-dark-gray py-2'>
        {showFullScore && <div className='w-14 text-center text-csm text-black dark:text-white'>
          {getValuePlayer(statistics, BOX_SCORE_TITLE_APPEARANCE[0].key, BOX_SCORE_TITLE_APPEARANCE[0]?.baseOnKey)}
        </div>}
        {BOX_SCORE_SHORT_TITLE_APPEARANCE.map((it:any) => <div key={it.key} className='w-14 text-center text-csm text-black dark:text-white'>
          {getValuePlayer(statistics, it.key, it?.baseOnKey)}
        </div>)}
        {showFullScore && BOX_SCORE_TITLE_APPEARANCE.filter((fil:any) => fil.key !== 'timePresences').map((it:any) => <div key={it.key} className='w-14 text-center text-csm text-black dark:text-white'>
          {getValuePlayer(statistics, it.key, it?.baseOnKey)}
        </div>)}
      </div>
    </div>
  )
}
