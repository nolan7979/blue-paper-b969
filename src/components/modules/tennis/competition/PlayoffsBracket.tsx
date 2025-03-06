import { useState } from 'react';
import { useRouter } from 'next/router';
import { isValEmpty } from '@/utils';
import Avatar from '@/components/common/Avatar';
import BracketPopOver from '@/components/common/pop-over/BracketPopOver';
import MatchScoreColumn from '@/modules/football/liveScore/components/MatchScoreColumn';
import {
  Tw3rdPlaceBlockContainer,
  TwBlockContainer,
  TwBracketMatchBadge,
  TwCard,
  TwStageTitle,
} from '@/components/modules/common';
import { useLeagueStore } from '@/stores/league-store';
import {
  HiChevronLeft,
  HiOutlineChevronRight,
  HiPlusCircle,
} from 'react-icons/hi';
import tw from 'twin.macro';
import UnknownTeamSVG from '/public/svg/unknown-team.svg';
import ChampionSVG from '/public/svg/champion.svg';
import { CupTreeDto, ViewDto } from '@/constant/interface';
import React from 'react';

type CupTreeProps = {
  cupTree: CupTreeDto;
};

export const PlayoffsBracket = ({ cupTree }: Partial<CupTreeProps>) => {
  if (!cupTree) return <></>;

  const { views } = cupTree || {};

  return <BracketPages pages={views} maxView={0} />;
};

const BracketPages = ({
  pages,
  maxView,
  thirdPlaceCupBlock,
}: {
  pages: Array<ViewDto[]>;
  maxView: number;
  thirdPlaceCupBlock?: any;
}) => {
  const { selectedOrder, selectedView } = useLeagueStore();
  let selectedPage = pages.find((page: any) => page.order === selectedOrder);
  if (isValEmpty(selectedPage)) selectedPage = pages[0] || {};

  const firstOrder = selectedOrder || 1;

  return (
    <>
      <div className='flex place-content-center rounded-md p-4'>
        {selectedPage?.map((items: any, index: number) => (
          <Rounds
            key={index}
            roundData={items}
            firstOrder={firstOrder}
            maxView={maxView}
            parentOrder={firstOrder}
            root={true}
            thirdPlaceCupBlock={thirdPlaceCupBlock}
          />
        ))}
      </div>
    </>
  );
};

const getClosestDivisibleByFour = (num: number) => {
  if (num % 4 === 0) {
    return num;
  }

  const lower = num - (num % 4);

  return lower;
};

const getParentOrder = (order: number) => {
  return Math.round(getClosestDivisibleByFour(order) / 4);
};

const Rounds = ({
  roundData,
  firstOrder,
  maxView,
  parentOrder = 1,
  thirdPlaceCupBlock,
  root = false,
}: {
  roundData: any;
  firstOrder: number;
  maxView: number;
  parentOrder?: number;
  thirdPlaceCupBlock?: any;
  root?: boolean;
}) => {
  const {
    order,
    left,
    right,
    participants,
    events = [],
    height,
    depth,
    parent_order,
  } = roundData || {};
  const leftParticipant = participants ? participants[0] : null;
  const rightParticipant = participants ? participants[1] : null;
  let usedParentOrder = parent_order;
  if (!usedParentOrder) {
    usedParentOrder = getParentOrder(order);
  }
  const {
    team: leftTeam = {},
    score: leftScore,
    winner: leftWin,
  } = leftParticipant || {};
  const {
    team: rightTeam = {},
    score: rightScore,
    winner: rightWin,
  } = rightParticipant || {};
  return (
    <div className='no-scrollbar flex overflow-y-scroll'>
      <div className='relative flex flex-1 flex-col'>
        {left && (
          <Rounds
            roundData={left}
            firstOrder={firstOrder}
            maxView={maxView}
            parentOrder={usedParentOrder || parentOrder}
          />
        )}
        {right && (
          <Rounds
            roundData={right}
            firstOrder={firstOrder}
            maxView={maxView}
            parentOrder={usedParentOrder || parentOrder}
          />
        )}
        {left && (
          <span className='absolute right-0 top-[25%] h-[50%] w-[1.5px] bg-logo-blue/50' />
        )}
      </div>
      <div className='flex w-52 flex-col place-content-center items-center text-dark-text'>
        <div className='relative flex w-full place-content-center items-center'>
          {left && <span className='h-[1.5px] flex-1 bg-logo-blue/50' />}
          <TwBlockContainer
            className='relative my-1.5 !w-[10.25rem] cursor-pointer !border-none bg-gradient-to-br '
            // onClick={() => {
            //   if (events && events.length > 0) {
            //     window.location.href = `basketball/match/${events[0]}`;
            //   }
            // }}
          >
            <div className='flex gap-2 p-2'>
              <div className='flex flex-col items-center justify-center gap-2'>
                {leftTeam?.id ? (
                  <Avatar
                    id={leftTeam?.id}
                    width={25}
                    height={25}
                    type='team'
                    isBackground={false}
                    rounded={false}
                    isSmall
                  />
                ) : (
                  <UnknownTeamSVG className='h-5 w-5'></UnknownTeamSVG>
                )}
                {rightTeam?.id ? (
                  <Avatar
                    id={rightTeam?.id}
                    width={25}
                    height={25}
                    type='team'
                    isBackground={false}
                    rounded={false}
                    isSmall
                  />
                ) : (
                  <UnknownTeamSVG className='h-5 w-5'></UnknownTeamSVG>
                )}
              </div>
              <div className='flex w-20 flex-col text-white'>
                <p className='flex-1 truncate leading-6'>
                  {leftTeam.name || 'N/A'}
                </p>
                <p className='flex-1 truncate leading-6'>
                  {rightTeam.name || 'N/A'}
                </p>
              </div>
              <div className='flex w-[1.374rem] items-center'>
                <MatchScoreColumn
                  code={100}
                  homeScore={leftScore}
                  awayScore={rightScore}
                />
              </div>
            </div>
          </TwBlockContainer>
          {!root ? (
            <span className=' h-[1.5px] flex-1 bg-logo-blue/50' />
          ) : (
            <span className=' h-[1.5px] w-4 flex-1 bg-logo-blue/0' />
          )}
          {order === 1 && (
            <div className='absolute top-[-2rem]'>
              <ChampionSVG className='h-6 w-6' />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ThirdPlaceBlock = ({
  thirdPlaceCupBlock,
}: {
  thirdPlaceCupBlock: any;
}) => {
  const router = useRouter();

  const {
    participants = [],
    events: eventIds = [],
    homeTeamScore: leftScore,
    awayTeamScore: rightScore, // TODO
  } = thirdPlaceCupBlock || {};

  const [leftTeamData = {}, rightTeamData = {}] = participants || [];
  const { team: leftTeam, winner: leftWin } = leftTeamData || {};
  const { team: rightTeam, winner: rightWin } = rightTeamData || {};

  return (
    <Tw3rdPlaceBlockContainer
      className=' border-gradient-to-r absolute left-0 top-[130%] my-1.5 h-[100%] w-full cursor-pointer border-logo-blue from-blue-500 via-blue-200 to-blue-500'
      onClick={() => {
        if (eventIds && eventIds.length > 0) {
          if (eventIds.length > 1) {
            return;
          } else {
            // router.push(`/match/${eventIds[0]}`);
            window.location.href = `/match/${eventIds[0]}`;
          }
        }
      }}
    >
      {eventIds && eventIds.length > 1 && (
        <div className='absolute -right-2.5 top-[52%] -translate-y-1/2 transform'>
          {/* TODO no need for last match */}
          <BracketPopOver matches={eventIds}>
            <button className=''>
              <HiPlusCircle className='h-5 w-5'></HiPlusCircle>
            </button>
          </BracketPopOver>
        </div>
      )}
      <div
        className='flex gap-2 border-b border-dark-text/10 p-3'
        css={[leftWin && tw`text-black dark:text-white`]}
      >
        {leftTeam?.id ? (
          <Avatar
            width={20}
            id={leftTeam?.id}
            height={20}
            type='team'
            isSmall
          />
        ) : (
          <UnknownTeamSVG className='h-5 w-5'></UnknownTeamSVG>
        )}
        <span className='flex-1 truncate'>{leftTeam.name || 'N/A'}</span>
        <span>{leftScore}</span>
      </div>
      <div
        className='flex items-center gap-2 p-3'
        css={[rightWin && tw`text-black dark:text-white`]}
      >
        {rightTeam?.id ? (
          <Avatar
            width={20}
            id={rightTeam?.id}
            height={20}
            type='team'
            isSmall
          />
        ) : (
          <UnknownTeamSVG className='h-5 w-5'></UnknownTeamSVG>
        )}
        <span className='flex-1 truncate'>{rightTeam.name || 'N/A'}</span>
        <span>{rightScore}</span>
        <TwBracketMatchBadge className=' bg-[#666666]'>
          3rd place
        </TwBracketMatchBadge>
      </div>
    </Tw3rdPlaceBlockContainer>
  );
};
