import React, { useMemo, useState } from 'react';
import { useMatchShotmapData } from '@/hooks/useFootball';
import { getShotmapConst, isValEmpty } from '@/utils';
import clsx from 'clsx';
import {
  TwQuickViewSection,
  TwSkeletonRectangle,
} from '@/components/modules/football/tw-components';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import Avatar from '@/components/common/Avatar';
import { ShotmapGraphSection } from '@/components/modules/football/match/MatchShotmapComponents';

export const ShotMapSection = ({
  matchData,
  i18n,
  className = '',
}: {
  matchData: any;
  i18n: any;
  className?: string;
}) => {
  const [isHome, setIsHome] = useState<boolean>(true);
  const [currentShotIdx, setCurrentShotIdx] = useState<number>(0);

  const {
    id,
    homeTeam = {},
    awayTeam = {},
    // homeScore = {},
    // awayScore = {},
  } = matchData || {};

  const {
    data: shotmapData = {},
    isLoading,
    isFetching,
    isError,
  } = useMatchShotmapData(id);
  
  const { homeShotmap = [], awayShotmap = [] } = useMemo(() => {
    return {
      homeShotmap: shotmapData['shotmap']?.filter((item: any) => item.isHome),
      awayShotmap: shotmapData['shotmap']?.filter((item: any) => !item.isHome),
    };
  }, [shotmapData]);

  if (isError) {
    return <></>;
  }

  if (isLoading || isFetching) {
    return (
      <TwSkeletonRectangle className='dark:bg-primary-gradient !h-[10rem] shadow-md dark:shadow-none lg:shadow-none' />
    ); // TODO skeletons
  }

  let selectedShotDataHome: any = {};
  let selectedShotDataAway: any = {};
  if (isHome && homeShotmap.length > 0) {
    selectedShotDataHome = homeShotmap[currentShotIdx % homeShotmap.length];
  } else if (!isHome && awayShotmap.length > 0) {
    selectedShotDataAway = awayShotmap[currentShotIdx % awayShotmap.length];
  }

  const {
    player = {},
    shotType,
    // goalType,
    situation,
    bodyPart,
    goalMouthLocation,
    // draw = {},
    time,
    addedTime,
    xg = 0,
    xgot = 0,
  } = isHome ? selectedShotDataHome : selectedShotDataAway || {};

  return (
    <div className={clsx('space-y-2', className, player?.id ? '' : 'hidden')}>
      <div className='text-center text-xss font-bold text-white'>
        {i18n.titles.shotmap}
      </div>
      <TwQuickViewSection className='relative'>
        <div className='absolute -top-7 left-0 flex w-full scale-100 items-center justify-center xl:-top-0 xl:scale-125'>
          <div
            className='flex !h-[17.5rem] !w-[20.625rem] min-w-[20.625rem] rounded-md'
            style={{
              backgroundImage: "url('/svg/stadium-char.svg')",
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              width: '100%',
            }}
          >
            <div className='relative h-auto w-1/2 overflow-hidden'>
              <div className='absolute -right-[3.25rem] top-10 rotate-90'>
                <ShotmapGraphSection
                  isHome={true}
                  currentTab={isHome}
                  setCurrentTab={setIsHome}
                  homeShotmap={homeShotmap}
                  awayShotmap={awayShotmap}
                  selectedShotData={selectedShotDataHome}
                  i18n={i18n}
                  className='rotate-180'
                  setCurrentShotIdx={setCurrentShotIdx}
                />
              </div>
            </div>
            <div className='relative h-auto w-1/2 overflow-hidden'>
              <div className='absolute -left-[3.25rem] top-10'>
                <ShotmapGraphSection
                  isHome={false}
                  currentTab={isHome}
                  setCurrentTab={setIsHome}
                  homeShotmap={homeShotmap}
                  awayShotmap={awayShotmap}
                  selectedShotData={selectedShotDataAway}
                  i18n={i18n}
                  className='rotate-90'
                  plusHome={homeShotmap.length - 1}
                  setCurrentShotIdx={setCurrentShotIdx}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='!h-[15.625rem] xl:!h-[19rem]'></div>

        <div className='mt-!h-[17.5rem] flex h-10 w-full justify-between gap-4'>
          <div className='flex w-10 flex-col justify-center'>
            <button
              className='item-hover border-quick-view rounded-full bg-light-match p-2 dark:bg-dark-hl-1 dark:brightness-110'
              onClick={() => {
                if (isHome) {
                  setCurrentShotIdx(
                    currentShotIdx === 0
                      ? homeShotmap.length - 1
                      : currentShotIdx - 1
                  );
                } else {
                  setCurrentShotIdx(
                    currentShotIdx === 0
                      ? awayShotmap.length - 1
                      : currentShotIdx - 1
                  );
                }
              }}
            >
              <HiOutlineChevronLeft />
            </button>
          </div>
          <div className='flex w-full items-center justify-between'>
            <div className='flex place-content-center items-center gap-2'>
              <Avatar id={player?.id} type='player' width={36} height={36} />
              <div className='flex flex-col text-xss font-medium text-white'>
                <span>{player.shortName || player.name}</span>
                <span className='font-normal text-[#F6B500]'>
                  {getShotmapConst(situation)}
                </span>
              </div>
            </div>
            <p className='text-xss font-medium text-white'>
              {addedTime && addedTime > 0
                ? `${time}+${addedTime}'`
                : time && `${time}'`}
            </p>
          </div>
          <div className='flex w-10 flex-col justify-center'>
            <button
              className=' item-hover border-quick-view rounded-full bg-light-match p-2 dark:bg-dark-hl-1 dark:brightness-110'
              onClick={() => {
                if (isHome) {
                  setCurrentShotIdx(
                    currentShotIdx === homeShotmap.length - 1
                      ? 0
                      : currentShotIdx + 1
                  );
                } else {
                  setCurrentShotIdx(
                    currentShotIdx === awayShotmap.length - 1
                      ? 0
                      : currentShotIdx + 1
                  );
                }
              }}
            >
              <HiOutlineChevronRight />
            </button>
          </div>
        </div>

        <div className='p-3'>
          {/*<div className=' flex'>*/}
          {/*<div className='flex w-1/5 place-content-center items-center'>*/}
          {/*  <button*/}
          {/*    className=' item-hover border-quick-view rounded-md bg-light-match p-2 dark:bg-dark-hl-1 dark:brightness-110'*/}
          {/*    onClick={() => {*/}
          {/*      if (currentShotIdx === 0) {*/}
          {/*        if (isHome) {*/}
          {/*          setCurrentShotIdx(homeShotmap.length - 1);*/}
          {/*        } else {*/}
          {/*          setCurrentShotIdx(awayShotmap.length - 1);*/}
          {/*        }*/}
          {/*      } else {*/}
          {/*        setCurrentShotIdx(currentShotIdx - 1);*/}
          {/*      }*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <HiOutlineChevronLeft />*/}
          {/*  </button>*/}
          {/*</div>*/}
          {/*  <div className=' flex-1  '>*/}
          {/*    <div className=' divide-single flex place-content-center items-center pb-3 '>*/}
          {/*      <div className='flex items-center justify-center gap-2'>*/}
          {/*        <Avatar*/}
          {/*          id={player?.id}*/}
          {/*          type='player'*/}
          {/*          width={36}*/}
          {/*          height={36}*/}
          {/*        />*/}
          {/*        <div className='flex flex-col items-center justify-center'>*/}
          {/*          <span className=''>{player.shortName || player.name}</span>*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*    <div className='divide-list-x flex place-content-center items-center py-2 text-center'>*/}
          {/*      <div className=' my-auto flex-1'>*/}
          {/*        <p className=' text-xs'>xG</p>*/}
          {/*        <p className=''>{xg > 0 && roundNumber(xg, 3)}</p>*/}
          {/*      </div>*/}
          {/*      <div className=' my-auto flex-1'>*/}
          {/*        <p className=' text-xs'>xGot</p>*/}
          {/*        <p className=''>{xgot > 0 && roundNumber(xgot, 3)}</p>*/}
          {/*      </div>*/}
          {/*      <div className=' my-auto flex-1'>*/}
          {/*        <p className=' text-xs'>Time</p>*/}
          {/*        <p className=''>*/}
          {/*          {addedTime && addedTime > 0*/}
          {/*            ? `${time}+${addedTime}'`*/}
          {/*            : time && `${time}'`}*/}
          {/*        </p>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*  <div className='flex w-1/5 place-content-center items-center'>*/}
          {/*    <button*/}
          {/*      className=' item-hover border-quick-view rounded-md bg-light-match p-2 dark:bg-dark-hl-1 dark:brightness-110'*/}
          {/*      onClick={() => {*/}
          {/*        if (isHome) {*/}
          {/*          setCurrentShotIdx(*/}
          {/*            (currentShotIdx + 1) % homeShotmap.length*/}
          {/*          );*/}
          {/*        } else {*/}
          {/*          setCurrentShotIdx(*/}
          {/*            (currentShotIdx + 1) % awayShotmap.length*/}
          {/*          );*/}
          {/*        }*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      <HiOutlineChevronRight />*/}
          {/*    </button>*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/*<div className='divide-single divide-list-x flex'>*/}
          {/*  <div*/}
          {/*    className='flex h-12 flex-1 cursor-pointer place-content-center items-center gap-2 rounded-ss-md py-3'*/}
          {/*    onClick={() => setIsHome(true)}*/}
          {/*    css={[isHome && tw`border-b-2 border-logo-blue`]}*/}
          {/*  >*/}
          {/*    1*/}
          {/*  </div>*/}

          {/*  <div*/}
          {/*    className='flex h-12 flex-1 cursor-pointer place-content-center items-center gap-2 rounded-ss-md py-3'*/}
          {/*    onClick={() => setIsHome(false)}*/}
          {/*    css={[*/}
          {/*      !isHome && tw`border-b-2 border-amber-400 text-logo-yellow`,*/}
          {/*    ]}*/}
          {/*  >*/}
          {/*    2*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/*<div className='divide-single space-y-2 py-3'>*/}
          {/*  <div className='flex justify-between text-csm dark:text-dark-text'>*/}
          {/*    <span>Kết quả</span>*/}
          {/*    <span>Tình huống</span>*/}
          {/*  </div>*/}
          {/*  <div className='flex justify-between text-sm font-semibold'>*/}
          {/*    <span>{getShotmapConst(shotType)}</span>*/}
          {/*    <span>{getShotmapConst(situation)}</span>*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/*<div className='space-y-2 pt-3'>*/}
          {/*  <div className='flex justify-between text-csm dark:text-dark-text'>*/}
          {/*    <span>Loại sút</span>*/}
          {/*    <span>Mục tiêu sút</span>*/}
          {/*  </div>*/}
          {/*  <div className='flex justify-between text-sm font-semibold'>*/}
          {/*    <span>{getShotmapConst(bodyPart)}</span>*/}
          {/*    <span>{getShotmapConst(goalMouthLocation)}</span>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </TwQuickViewSection>
    </div>
  );
};
