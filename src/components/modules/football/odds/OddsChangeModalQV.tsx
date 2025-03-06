/* eslint-disable @next/next/no-img-element */
import { Dialog, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import React, { Fragment, useRef, useState } from 'react';
import tw from 'twin.macro';

import { useMatchOddsChangeData } from '@/hooks/useFootball/useOddsData';

import { CornerTxOddsChangesTable } from '@/components/modules/football/odds/OddsChangeModal';
import { PeriodSwitcher } from '@/components/modules/football/odds/PeriodSwitcher';
import { TwFilterBtn } from '@/components/modules/football/tw-components';

import { useOddsQvStore, useOddsStore } from '@/stores';

import { convertOdds, isValEmpty } from '@/utils';

import OddDownSVG from '/public/svg/odd-down.svg';
import OddUpSVG from '/public/svg/odd-up.svg';

export default function OddsChangesModalQV({
  open,
  setOpen,
  bookMaker,
  matchId,
  half = 0,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
  bookMaker?: any;
  matchId: string;
  half?: number;
}) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-50 lg:z-10'
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        {/* <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 transition-opacity' />
        </Transition.Child> */}

        <div className='fixed inset-0 z-50 overflow-y-auto scrollbar lg:z-10'>
          <div className='flex min-h-full items-end justify-end bg-slate-100 bg-opacity-40 text-center lg:items-center lg:justify-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative w-full transform overflow-hidden rounded-lg bg-white text-light-black  shadow-xl transition-all dark:bg-modal dark:text-dark-text sm:my-8 lg:w-[50vw]'>
                <OddsChangesComponentTable
                  setOpen={setOpen}
                  bookMaker={bookMaker}
                  matchId={matchId}
                  period={half}
                ></OddsChangesComponentTable>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

const OddsChangesComponentTable = ({
  setOpen,
  bookMaker,
  matchId,
  period = 0,
}: {
  setOpen: (open: any) => void;
  bookMaker: any;
  matchId: string;
  period?: number;
}) => {
  const { market, showDetailModalCornerOU, showDetailModalScore } =
    useOddsQvStore();
  let shownMarket = market;
  if (showDetailModalCornerOU) {
    shownMarket = 'cornerTx';
  } else if (showDetailModalScore) {
    shownMarket = 'score';
  }

  // const [market, setMarket] = useState<string>(() => {
  //   // TODO add more markets
  //   if (!['hdp', 'std1x2', 'tx', 'score', 'cornerTx'].includes(compareType)) {
  //     return 'hdp';
  //   }
  //   return compareType;
  // });
  const [half, setHalf] = useState<number>(period);

  return (
    <div className=' divide-list '>
      <div className=' flex place-content-center items-center rounded-t-lg py-3 font-extrabold text-black dark:text-white'>
        {bookMaker.name}: Odds changes
      </div>

      {/* Odds changes menu */}
      <div className='flex items-center justify-end p-2.5'>
        {/* <div className='flex gap-3'>
          <TwFilterBtn
            onClick={() => setMarket('hdp')}
            isActive={market === 'hdp'}
          >
            Tỷ lệ châu Á
          </TwFilterBtn>
          <TwFilterBtn
            onClick={() => setMarket('tx')}
            isActive={market === 'tx'}
          >
            Tỷ lệ tài xỉu
          </TwFilterBtn>
          <TwFilterBtn
            onClick={() => setMarket('std1x2')}
            isActive={market === 'std1x2'}
          >
            1x2
          </TwFilterBtn>

          <TwFilterBtn
            onClick={() => setMarket('cornerTx')}
            isActive={market === 'cornerTx'}
          >
            Phạt góc T/X
          </TwFilterBtn>

          <TwFilterBtn
            onClick={() => setMarket('score')}
            isActive={market === 'score'}
          >
            Tỷ số
          </TwFilterBtn>
        </div> */}

        <PeriodSwitcher
          options={[
            { name: 'FT', value: 0 },
            { name: 'HT', value: 1 },
          ]}
          valGetter={setHalf}
          half={half}
        ></PeriodSwitcher>
      </div>

      {/* Odds changes header section */}
      <HeaderSection market={shownMarket}></HeaderSection>

      {/* Odds changes data section */}
      {['3in1', 'hdp', 'tx', 'std1x2'].includes(shownMarket) && (
        <Odds3in1ChangesTable
          bookMaker={bookMaker}
          market={shownMarket}
          matchId={matchId}
          half={half}
        ></Odds3in1ChangesTable>
      )}
      {shownMarket === 'score' && (
        <ScoreOddsChangesTable
          bookMaker={bookMaker}
          market={shownMarket}
          matchId={matchId}
          half={half}
        ></ScoreOddsChangesTable>
      )}
      {shownMarket === 'cornerTx' && (
        <CornerTxOddsChangesTable
          bookMaker={bookMaker}
          market={shownMarket}
          matchId={matchId}
          half={half}
        ></CornerTxOddsChangesTable>
      )}

      <div className='flex justify-end p-2'>
        <TwFilterBtn
          onClick={() => {
            setOpen(false);
          }}
        >
          Close
        </TwFilterBtn>
      </div>
    </div>
  );
};

const HeaderSection = ({ market }: { market: any }) => {
  return (
    <table className='w-full text-center text-sm'>
      <thead className='border border-dark-text/20 bg-light-match dark:bg-dark-match'>
        {['3in1', 'hdp', 'tx', 'std1x2'].includes(market) && (
          <tr className='divide-list-x h-10 w-full'>
            <th className='w-[15%]'>Time</th>
            <th className='w-[15%]'>Tỷ số</th>
            <th className='w-[15%]'>{market === 'tx' ? 'Tài' : 'Chủ'}</th>
            <th className='w-[15%]'>{market === 'tx' ? 'Kèo' : 'Hòa'}</th>
            <th className='w-[15%]'>{market === 'tx' ? 'Xỉu' : 'Khách'}</th>
            <th className='w-1/4'>Cập nhật</th>
          </tr>
        )}
        {market === 'score' && (
          <tr className='divide-list-x h-10 w-full'>
            <th className='w-[8%]'>Time</th>
            <th className='w-[10%]'>Time</th>
            <th className='w-[70%]'>Odds</th>
            <th className=''>Cập nhật</th>
          </tr>
        )}
        {market === 'cornerTx' && (
          <tr className='divide-list-x h-10 w-full'>
            <th className='w-[20%]'>Time</th>
            <th className='w-[15%]'>Corner</th>
            <th className='w-[15%]'>Over</th>
            <th className='w-[15%]'>Goals</th>
            <th className='w-[20%]'>Under</th>
            <th className='w-[20%]'>Update</th>
          </tr>
        )}
      </thead>
    </table>
  );
};

const Odds3in1ChangesTable = ({
  bookMaker,
  market,
  matchId,
  half,
}: {
  bookMaker: any;
  market: string;
  matchId: string;
  half: number;
}) => {
  const { oddsType } = useOddsStore();
  const { data, isFetching } = useMatchOddsChangeData(
    matchId,
    bookMaker?.id,
    market,
    half
  );

  if (isFetching) {
    return <div className='h-[59vh]'>Loading...</div>;
  }

  const oddsList = data?.oddsList || [];

  return (
    <div className=''>
      {/* <table className='w-full text-center text-sm'>
        <thead className='border border-dark-text/20 bg-light-match dark:bg-dark-match'>
          <tr className='divide-list-x h-10 w-full'>
            <th className='w-[15%]'>Time</th>
            <th className='w-[15%]'>Tỷ số</th>
            <th className='w-[15%]'>{market === 'tx' ? 'Tài' : 'Chủ'}</th>
            <th className='w-[15%]'>{market === 'tx' ? 'Kèo' : 'Hòa'}</th>
            <th className='w-[15%]'>{market === 'tx' ? 'Xỉu' : 'Khách'}</th>
            <th className='w-1/4'>Cập nhật</th>
          </tr>
        </thead>
      </table> */}
      <div className='h-[55vh] overflow-y-auto text-sm scrollbar'>
        <table className='min-w-full  border-collapse text-center'>
          <tbody className='divide-list max-h-[45vh] w-full'>
            {oddsList.map((change: any, index: number) => {
              let matchTime = '';
              if (`${change.type}` === '2') {
                matchTime = 'Live';
              } else if (`${change.type}` === 'HT') {
                matchTime = 'HT';
              } else if (change.mt) {
                matchTime = `${change.mt}'`;
              }

              const scoreText = !isValEmpty(change.hs)
                ? `${change.hs} - ${change.as}`
                : '';

              // const isSkipped =
              //   (`${change.type}` === '3' && !change.mt) ||
              //   (`${change.type}` === '2' && change.close);

              // if (isSkipped) {
              //   return (
              //     // <tr key={index} className='h-8 w-full'>
              //     //   <td className='w-[15%]'></td>
              //     //   <td className='w-[15%]'></td>
              //     //   <td className='w-[15%]'></td>
              //     //   <td className='w-[15%]'></td>
              //     //   <td className='w-[15%]'></td>
              //     //   <td className='w-1/4'></td>
              //     // </tr>
              //     <></>
              //   );
              // }

              return (
                <tr
                  key={index}
                  className='divide-list-x h-8 w-full'
                  css={[
                    index % 2 === 1 && tw`bg-light-match dark:bg-dark-match`,
                  ]}
                >
                  <td className='w-[15%]'>{matchTime}</td>
                  <td
                    className='w-[15%]'
                    css={[change.sc && tw`bg-logo-blue/30`]}
                  >
                    {scoreText}
                  </td>
                  {change.close ? (
                    <td colSpan={3} className='text-dark-loss'>
                      Đóng
                    </td>
                  ) : (
                    <>
                      <td className='w-[15%]'>
                        <div
                          className='mx-auto flex w-24 place-content-center items-center  justify-center gap-1'
                          css={[
                            change.ft === 1 && tw`text-dark-win`,
                            change.ft === -1 && tw`text-dark-loss`,
                          ]}
                        >
                          <span>
                            {convertOdds(change.odds?.f, market, oddsType, 1)}
                          </span>
                          <span className='text-xxs'>
                            {change.ft === -1 && <OddDownSVG></OddDownSVG>}
                            {change.ft === 1 && <OddUpSVG></OddUpSVG>}
                          </span>
                        </div>
                      </td>
                      <td className='w-[15%]'>
                        <div
                          className='mx-auto flex w-24 items-center justify-center gap-1'
                          css={[
                            change.st === 1 && tw`text-dark-win`,
                            change.st === -1 && tw`text-dark-loss`,
                          ]}
                        >
                          <span>
                            {convertOdds(change.odds?.s, market, oddsType, 2)}
                          </span>
                          <span className='text-xxs'>
                            {change.st === -1 && <OddDownSVG></OddDownSVG>}
                            {change.st === 1 && <OddUpSVG></OddUpSVG>}
                          </span>
                        </div>
                      </td>
                      <td className='w-[15%]'>
                        <div
                          className='mx-auto flex w-24 items-center justify-center gap-1'
                          css={[
                            change.tt === 1 && tw`text-dark-win`,
                            change.tt === -1 && tw`text-dark-loss`,
                          ]}
                        >
                          <span>
                            {convertOdds(change.odds?.t, market, oddsType, 3)}
                          </span>
                          <span className='text-xxs'>
                            {change.tt === -1 && <OddDownSVG></OddDownSVG>}
                            {change.tt === 1 && <OddUpSVG></OddUpSVG>}
                          </span>
                        </div>
                      </td>
                    </>
                  )}
                  <td className='w-1/4'>
                    {format(new Date(change.ct * 1000), 'dd/MM HH:mm')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ScoreOddsChangesTable = ({
  bookMaker,
  market,
  matchId,
  half,
}: {
  bookMaker: any;
  market: string;
  matchId: string;
  half: number;
}) => {
  // const { oddsType } = useOddsStore();
  const { data, isFetching } = useMatchOddsChangeData(
    matchId,
    bookMaker?.id,
    market,
    half
  );

  if (isFetching) {
    return <div className='h-[59vh]'>Loading...</div>;
  }

  const oddsList = data?.oddsList || [];
  const shownList = oddsList
    .map((change: any, idx: number) => {
      const prevChange = oddsList[idx - 1] || {};
      const prev = prevChange?.odds || {};
      return {
        ...change,
        prev: prev,
      };
    })
    .reverse();

  return (
    <div className=''>
      {/* <table className='w-full text-center text-sm'>
        <thead className='border border-dark-text/20 bg-light-match dark:bg-dark-match'>
          <tr className='divide-list-x h-10 w-full'>
            <th className='w-[15%]'>Time</th>
            <th className='w-[70%]'></th>
            <th className='w-[15%]'>Cập nhật</th>
          </tr>
        </thead>
      </table> */}
      <div className='h-[55vh] overflow-y-auto text-sm scrollbar'>
        <table className='min-w-full  border-collapse text-center'>
          <tbody className='divide-list max-h-[45vh] w-full'>
            {shownList.map((change: any, idx: number) => {
              const odds = change.odds || {};
              const prev = change.prev || {};

              return (
                <>
                  <TwRowSc
                    key={`${idx}-a`}
                    className='divide-list-x h-11 w-full'
                    css={[
                      idx % 2 === 1 && tw`bg-light-match dark:bg-dark-match`,
                    ]}
                  >
                    <TwCellSc className='w-[8%]' rowSpan={3}>
                      Live
                    </TwCellSc>
                    <TwCellSc className='w-[10%] text-logo-blue'>Home</TwCellSc>

                    {change.close ? (
                      <>
                        <TwCellSc
                          className='w-[7%] text-dark-loss'
                          colSpan={10}
                        >
                          Đóng
                        </TwCellSc>
                      </>
                    ) : (
                      <>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='1:0'
                            odds={odds.h1}
                            prevOdds={prev.h1}
                            side={1}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='2:0'
                            odds={odds.h2}
                            side={1}
                            prevOdds={prev.h2}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='2:1'
                            odds={odds.h3}
                            side={1}
                            prevOdds={prev.h3}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='3:0'
                            odds={odds.h4}
                            side={1}
                            prevOdds={prev.h4}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='3:1'
                            odds={odds.h5}
                            side={1}
                            prevOdds={prev.h5}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='3:2'
                            odds={odds.h6}
                            side={1}
                            prevOdds={prev.h6}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='4:0'
                            odds={odds.h7}
                            side={1}
                            prevOdds={prev.h7}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='4:1'
                            odds={odds.h8}
                            side={1}
                            prevOdds={prev.h8}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='4:2'
                            odds={odds.h9}
                            side={1}
                            prevOdds={prev.h9}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='4:3'
                            odds={odds.h10}
                            side={1}
                            prevOdds={prev.h10}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                      </>
                    )}
                    <TwCellSc className='w-1/4' rowSpan={3}>
                      {format(new Date(change.ct * 1000), 'dd/MM HH:mm')}
                    </TwCellSc>
                  </TwRowSc>

                  <TwRowSc
                    key={`${idx}-b`}
                    className='divide-list-x h-10 w-full'
                    css={[
                      idx % 2 === 1 && tw`bg-light-match dark:bg-dark-match`,
                    ]}
                  >
                    {/* <td className='w-[5%]'>Live</td> */}
                    <TwCellSc className='w-[10%] text-dark-text'>Draw</TwCellSc>
                    {change.close ? (
                      <TwCellSc className='w-[75%] text-dark-loss'>
                        Đóng
                      </TwCellSc>
                    ) : (
                      <>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='0:0'
                            odds={odds.d1}
                            prevOdds={prev.d1}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='1:1'
                            odds={odds.d2}
                            prevOdds={prev.d2}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='2:2'
                            odds={odds.d3}
                            prevOdds={prev.d3}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='3:3'
                            odds={odds.d4}
                            prevOdds={prev.d4}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='4:4'
                            odds={odds.d5}
                            prevOdds={prev.d5}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='Other'
                            odds={odds.o}
                            prevOdds={prev.o}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'></TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'></TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'></TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'></TwOddsCellSc>
                      </>
                    )}
                  </TwRowSc>

                  <TwRowSc
                    key={`${idx}-c`}
                    className='divide-list-x h-10 w-full'
                    css={[
                      idx % 2 === 1 && tw`bg-light-match dark:bg-dark-match`,
                    ]}
                  >
                    {/* <td className='w-[5%]'>Live</td> */}
                    <TwCellSc className='w-[10%] text-logo-yellow'>
                      Away
                    </TwCellSc>
                    {change.close ? (
                      <TwCellSc className='w-[75%] text-dark-loss'>
                        Đóng
                      </TwCellSc>
                    ) : (
                      <>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='0:1'
                            odds={odds.a1}
                            side={2}
                            prevOdds={prev.a1}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='0:2'
                            odds={odds.a2}
                            side={2}
                            prevOdds={prev.a2}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='1:2'
                            odds={odds.a3}
                            side={2}
                            prevOdds={prev.a3}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='0:3'
                            odds={odds.a4}
                            side={2}
                            prevOdds={prev.a4}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='1:3'
                            odds={odds.a5}
                            side={2}
                            prevOdds={prev.a5}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='2:3'
                            odds={odds.a6}
                            side={2}
                            prevOdds={prev.a6}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='0:4'
                            odds={odds.a7}
                            side={2}
                            prevOdds={prev.a7}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='1:4'
                            odds={odds.a8}
                            side={2}
                            prevOdds={prev.a8}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='2:4'
                            odds={odds.a9}
                            side={2}
                            prevOdds={prev.a9}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                        <TwOddsCellSc className='w-[7%]'>
                          <OddsCellSc
                            score='3:4'
                            odds={odds.a10}
                            side={2}
                            prevOdds={prev.a10}
                          ></OddsCellSc>
                        </TwOddsCellSc>
                      </>
                    )}
                  </TwRowSc>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TwCellSc = tw.td``;
const TwOddsCellSc = tw.td`text-sm`;
const TwRowSc = tw.tr``;

const OddsCellSc = ({
  score,
  odds,
  side,
  prevOdds,
}: {
  score: string;
  odds: number;
  side?: number;
  prevOdds: number;
}) => {
  return (
    <div className='h-full py-0.5'>
      <div className='text-cxs text-dark-text'>{score}</div>
      <div className='dark:text-dark-default'>
        <span
          css={[
            prevOdds && prevOdds > odds && tw`text-red-600`,
            prevOdds && prevOdds < odds && tw`text-dark-win`,
          ]}
        >
          {odds}
        </span>
      </div>
    </div>
  );
};

const CornerTxRow = () => {
  return (
    <tr className='divide-list-x h-9 w-full'>
      <td className='w-[20%]'>Time</td>
      <td className='w-[15%]'>Corner</td>
      <td className='w-[15%]'>Over</td>
      <td className='w-[15%]'>Goals</td>
      <td className='w-[20%]'>Under</td>
      <td className='w-[20%]'>Update</td>
    </tr>
  );
};
