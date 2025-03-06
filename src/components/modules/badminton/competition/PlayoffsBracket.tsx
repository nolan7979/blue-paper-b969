import HandleGroupAvatar from '@/components/modules/badminton/components/HandleGroupAvatar';
import {
  TwBlockContainer
} from '@/components/modules/common';
import { SPORT } from '@/constant/common';
import { CupTreeDto, ViewDto } from '@/constant/interface';
import MatchScoreColumn from '@/modules/football/liveScore/components/MatchScoreColumn';
import { useLeagueStore } from '@/stores/league-store';
import { isValEmpty } from '@/utils';
import ChampionSVG from '/public/svg/champion.svg';

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
  if (isValEmpty(selectedPage)) selectedPage = pages[0] || [];

  let arrRound:any = []
  const getRound = (obj:any) => {
    const round = obj.round.description
    arrRound = [...arrRound, round]
    if(obj.left) getRound(obj.left)
  }
  if(selectedPage && selectedPage.length > 0){
    getRound(selectedPage[0])
  }

  const firstOrder = selectedOrder || 1;

  return (
    <div className='relative w-full lg:pt-10'>
      {/* <div className='hidden lg:flex w-full px-4 absolute top-0 left-0 h-full'>
        {
          arrRound.reverse().map((it:any) => (
            <div key={it} className='flex-1 even:bg-dark-main text-center text-base font-bold text-light-secondary pt-2'>{it}</div>
          ))
        }
      </div> */}
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
    </div>
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
                <HandleGroupAvatar team={leftTeam} size={20} sport={SPORT.BADMINTON} />
                <HandleGroupAvatar team={rightTeam} size={20} sport={SPORT.BADMINTON} />
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
