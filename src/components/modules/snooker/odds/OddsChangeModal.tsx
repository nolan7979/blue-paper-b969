/* eslint-disable @next/next/no-img-element */
import { Dialog, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import React, { Fragment, useRef, useState } from 'react';
import tw from 'twin.macro';

import { useMatchOddsChangeData } from '@/hooks/useFootball/useOddsData';

import { PeriodSwitcher } from '@/components/modules/football/odds/PeriodSwitcher';
import {
  TwCell,
  TwHeaderRow,
} from '@/components/modules/football/odds/shared-components';
import { TwFilterBtn } from '@/components/modules/football/tw-components';

import { useOddsDetailsStore, useOddsStore } from '@/stores';

import { convertOdds, isValEmpty, roundNum } from '@/utils';

import OddDownSVG from '/public/svg/odd-down.svg';
import OddUpSVG from '/public/svg/odd-up.svg';

export default function OddsChangesModal({
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
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <div className='fixed inset-0 z-10 overflow-y-auto scrollbar'>
          <div className='flex min-h-full items-center justify-center p-4 text-center sm:p-0 '>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative w-11/12 transform overflow-hidden rounded-lg bg-white  text-light-black shadow-xl transition-all dark:bg-modal dark:text-dark-text  sm:my-8 lg:w-[50vw]'>
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

export const OddsChangesComponentTable = ({
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
  const { compareType } = useOddsDetailsStore();
  const [market, setMarket] = useState<string>(() => {
    // TODO add more markets
    if (
      !['hdp', 'std1x2', 'tx', 'score', 'cornerTx', 'eu1x2'].includes(
        compareType
      )
    ) {
      return 'hdp';
    }
    return compareType;
  });
  const [half, setHalf] = useState<number>(period);

  return (
    <div className=' divide-list '>
      <div className=' flex place-content-center items-center rounded-t-lg py-3 font-extrabold text-black dark:text-white'>
        {bookMaker.name}: Odds changes
      </div>

      {/* Odds changes menu */}
      <div className='flex items-center justify-between p-2.5'>
        {market !== 'eu1x2' && (
          <div className='flex gap-3'>
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

            {/* <TwFilterBtn
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
            </TwFilterBtn> */}
          </div>
        )}

        {market === 'eu1x2' && (
          <TwFilterBtn
            onClick={() => setMarket('eu1x2')}
            isActive={market === 'eu1x2'}
          >
            EU 1x2
          </TwFilterBtn>
        )}

        {!['eu1x2', 'cornerTx'].includes(market) && (
          <PeriodSwitcher
            options={[
              { name: 'FT', value: 0 },
              { name: 'HT', value: 1 },
            ]}
            valGetter={setHalf}
            half={half}
          ></PeriodSwitcher>
        )}
      </div>

      {/* Odds changes header section */}
      <HeaderSection market={market}></HeaderSection>

      {/* Odds changes data section */}
      {['3in1', 'hdp', 'tx', 'std1x2'].includes(market) && (
        <Odds3in1ChangesTable
          bookMaker={bookMaker}
          market={market}
          matchId={matchId}
          half={half}
        ></Odds3in1ChangesTable>
      )}
      {market === 'score' && (
        <ScoreOddsChangesTable
          bookMaker={bookMaker}
          market={market}
          matchId={matchId}
          half={half}
        ></ScoreOddsChangesTable>
      )}
      {market === 'cornerTx' && (
        <CornerTxOddsChangesTable
          bookMaker={bookMaker}
          market={market}
          matchId={matchId}
          half={half}
        ></CornerTxOddsChangesTable>
      )}

      {market === 'eu1x2' && (
        <Eu1x2OddsChangesTable
          bookMaker={bookMaker}
          market={market}
          matchId={matchId}
          // half={half}
        ></Eu1x2OddsChangesTable>
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
            <th className='w-[10%]'>Time</th>
            {/* <th className='w-[10%]'>Corner</th> */}
            <th className='w-[10%]'>Over</th>
            <th className='w-[10%]'>Corners</th>
            <th className='w-[10%]'>Under</th>
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
  const { data, isLoading } = useMatchOddsChangeData(
    matchId,
    bookMaker?.id,
    market,
    half
  );

  if (isLoading) {
    return <div className='h-[58vh]'>Loading...</div>;
  }

  const oddsList = (data?.oddsList || []).sort((a: any, b: any) => a.ct - b.ct);

  return (
    <div className=''>
      <div className='h-[55vh] overflow-y-auto text-sm scrollbar'>
        <table className='min-w-full  border-collapse text-center'>
          <tbody className='divide-list max-h-[45vh] w-full'>
            {oddsList.map((change: any, index: number) => {
              let matchTime = '';
              if (`${change.type}` === '2') {
                matchTime = 'Live';
              } else if (change.type === 1) {
                matchTime = 'Initial';
              } else if (change.mt) {
                matchTime = `${change.mt}'`;
              }

              const scoreText = !isValEmpty(change.hs)
                ? `${change.hs} - ${change.as}`
                : '';

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

export const Eu1x2OddsChangesTable = ({
  bookMaker,
  market,
  matchId,
}: // half,
{
  bookMaker: any;
  market: string;
  matchId: string;
  // half: number;
}) => {
  const { oddsType } = useOddsStore();
  const { oddsEu1x2ChangeDataKelly } = useOddsDetailsStore();

  const oddsChanges = oddsEu1x2ChangeDataKelly[bookMaker?.id] || [];

  return (
    <>
      <table className='w-full text-center text-sm'>
        <OddsEu1x2ChangeHeader></OddsEu1x2ChangeHeader>
        <tbody className=''>
          {(oddsChanges || []).map((change: any, idx: number) => {
            const next = oddsChanges[idx + 1] || {};

            const hUp = !isValEmpty(next) && change.h > next.h;
            const hDown = !isValEmpty(next) && change.h < next.h;
            const dUp = !isValEmpty(next) && change.d > next.d;
            const dDown = !isValEmpty(next) && change.d < next.d;
            const aUp = !isValEmpty(next) && change.a > next.a;
            const aDown = !isValEmpty(next) && change.a < next.a;

            return (
              <tr
                key={idx}
                className='h-8 font-light'
                css={[idx % 2 === 1 && tw`bg-light-match dark:bg-dark-match`]}
              >
                {/* <TwCell className='w-[6%] border'>{ih}</TwCell> */}
                <TwCell
                  className='w-[6%] border'
                  css={[hUp && tw`text-dark-win`, hDown && tw`text-dark-loss`]}
                >
                  {convertOdds(change.h, 'eu1x2', oddsType, 1)}
                </TwCell>
                <TwCell
                  className='w-[6%] '
                  css={[dUp && tw`text-dark-win`, dDown && tw`text-dark-loss`]}
                >
                  {convertOdds(change.d, 'eu1x2', oddsType, 2)}
                </TwCell>
                <TwCell
                  className='w-[6%] border'
                  css={[aUp && tw`text-dark-win`, aDown && tw`text-dark-loss`]}
                >
                  {convertOdds(change.a, 'eu1x2', oddsType, 3)}
                </TwCell>
                <TwCell className='w-[6%] border'>
                  {roundNum(change.hWrate)}
                </TwCell>
                <TwCell className='w-[6%] border'>
                  {roundNum(change.dWrate)}
                </TwCell>
                <TwCell className='w-[6%] border'>
                  {roundNum(change.aWrate)}
                </TwCell>
                <TwCell className='w-[8%] border'>
                  {roundNum(change.hReturnRate)}
                </TwCell>
                <TwCell
                  className='w-[6%] border'
                  css={[change['hKelly'] >= 1 && tw`text-dark-loss`]}
                >
                  {change['hKelly']}
                </TwCell>
                <TwCell
                  className='w-[6%] border'
                  css={[change['dKelly'] >= 1 && tw`text-dark-loss`]}
                >
                  {change['dKelly']}
                </TwCell>
                <TwCell
                  className='w-[6%] border'
                  css={[change['aKelly'] >= 1 && tw`text-dark-loss`]}
                >
                  {change['aKelly']}
                </TwCell>
                <TwCell className='w-[10%] border'>
                  {format(new Date(change.changeTime * 1000), 'dd/MM HH:mm')}
                </TwCell>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

const OddsEu1x2ChangeHeader = () => {
  return (
    <thead>
      <TwHeaderRow className='h-10 border bg-light-match dark:bg-dark-match'>
        <TwCell className='w-[6%] border'>Chủ</TwCell>
        <TwCell className='w-[6%] '>Hoà</TwCell>
        <TwCell className='w-[6%] border'>Khách</TwCell>
        <TwCell className='w-[6%] border'>Chủ %</TwCell>
        <TwCell className='w-[6%] border'>Hoà %</TwCell>
        <TwCell className='w-[6%] border'>Khách %</TwCell>
        <TwCell className='w-[8%] border'>Hoàn vốn %</TwCell>
        <TwCell className='w-[18%] border' colSpan={3}>
          Tiêu chuẩn Kelly
        </TwCell>
        <TwCell className='w-[10%] border'>Cập nhật</TwCell>
      </TwHeaderRow>
    </thead>
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
      <div className='max-h-[55vh] overflow-y-auto text-sm scrollbar'>
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

export const CornerTxOddsChangesTable = ({
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
    return <div className='h-[55vh]'></div>; // TODO skeletons
  }
  const oddsList = data?.oddsList || [];

  return (
    <div className=''>
      <div className='max-h-[55vh] overflow-y-auto text-sm scrollbar'>
        <table className='min-w-full  border-collapse text-center'>
          <tbody className='divide-list max-h-[45vh] w-full'>
            {half !== 0 && (
              <tr>
                <td className='w-100%'>
                  <div className='py-1 text-csm'>Hiện chưa có dữ liệu</div>
                </td>
              </tr>
            )}
            {half === 0 &&
              oddsList
                .slice()
                .reverse()
                .map((change: any, idx: number) => {
                  return (
                    <CornerTxRow
                      key={idx}
                      change={change}
                      oddsType={oddsType}
                      market={market}
                      idx={idx}
                    ></CornerTxRow>
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
      <div className='text-xs font-extralight text-dark-text'>{score}</div>
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

const CornerTxRow = ({
  change,
  oddsType,
  market,
  idx,
}: {
  change: any;
  oddsType: string;
  market: string;
  idx: number;
}) => {
  const { close, ct, odds, type } = change || {};
  const { f, s, t } = odds || {};

  return (
    <tr
      className='divide-list-x h-9 w-full'
      css={[idx % 2 === 1 && tw`bg-light-match dark:bg-dark-match`]}
    >
      {/* <td className='w-[10%]'>Live - {type}</td> */}
      <td className='w-[10%]'>-</td>
      {close && (
        <>
          <td className='w-[30%] text-center text-csm' colSpan={3}>
            Closed
          </td>
        </>
      )}
      {!close && (
        <>
          <td className='w-[10%]'>{convertOdds(f, market, oddsType, 1)}</td>
          <td className='w-[10%]'>{s}</td>
          <td className='w-[10%]'>{convertOdds(t, market, oddsType, 3)}</td>
        </>
      )}
      <td className='w-[20%]'>
        {format(new Date(ct * 1000), 'yyyy/MM/dd HH:mm')}
      </td>
    </tr>
  );
};
