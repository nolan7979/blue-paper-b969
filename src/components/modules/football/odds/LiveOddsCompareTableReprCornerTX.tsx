import { useMemo, useState } from 'react';
import { HiTrendingUp } from 'react-icons/hi';
import tw from 'twin.macro';

import { useBookmakersData } from '@/hooks/useFootball/useOddsData';

import OddsChangesModal from '@/components/modules/football/odds/OddsChangeModal';
import {
  LiveOddsCellUpDown,
  TwBodySingleRow,
  TwCell,
  TwHeaderRow,
  TWTable,
} from '@/components/modules/football/odds/shared-components';

import { useOddsDetailsStore, useOddsStore } from '@/stores';

import { convertOdds } from '@/utils';

export const LiveOddsCompareTableReprCornerTx = ({
  matchId,
  half = 0,
}: {
  matchId: string;
  half: number;
}) => {
  const [openChangesModal, setOpenChangesModal] = useState<boolean>(false);
  const [bookMaker, setBookMaker] = useState<any>(null);

  const { oddsType } = useOddsStore();
  const { oddsCornerTxCompareData, oddsCornerTxCompareDataHT } =
    useOddsDetailsStore(); // TODO cornerTx
  const { data: bookMakerData, isFetching } = useBookmakersData();

  const mapBookMakers = useMemo(() => {
    return (
      bookMakerData?.bookmakers?.reduce((acc: any, cur: any) => {
        acc[cur?.id] = cur.name;
        return acc;
      }, {}) || {}
    );
  }, [bookMakerData]);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  const shownData =
    half === 0 ? oddsCornerTxCompareData : oddsCornerTxCompareDataHT; // TODO cornerTx

  return (
    <>
      <TWTable
        width='100%'
        border={0}
        cellPadding={0}
        cellSpacing={0}
        className='border-collapse border border-dark-text/20 text-center text-sm dark:text-dark-text '
      >
        <OddsDetailHeaderCornerTx></OddsDetailHeaderCornerTx>
        <tbody className=''>
          {Object.keys(shownData || {}).map((bookId: string, idx: number) => {
            const bookName = mapBookMakers[bookId] || bookId;
            return (
              <OddsDetailRowCornerTx
                key={bookId}
                bookId={bookId}
                bookName={bookName}
                oddsType={oddsType}
                setOpenChangesModal={setOpenChangesModal}
                setBookMaker={setBookMaker}
                idx={idx}
                half={half}
              ></OddsDetailRowCornerTx>
            );
          })}
        </tbody>
      </TWTable>

      <OddsChangesModal
        open={openChangesModal}
        setOpen={setOpenChangesModal}
        bookMaker={bookMaker}
        matchId={matchId}
        half={half}
      ></OddsChangesModal>
    </>
  );
};

const OddsDetailRowCornerTx = ({
  bookId,
  bookName,
  oddsType,
  setOpenChangesModal,
  setBookMaker,
  idx,
  half = 0,
}: {
  bookId: string;
  bookName: string;
  oddsType: string;
  setOpenChangesModal: (x: boolean) => void;
  setBookMaker: (x: any) => void;
  idx: number;
  half: number;
}) => {
  const { oddsCornerTxCompareData, oddsCornerTxCompareDataHT } =
    useOddsDetailsStore(); // TODO cornerTx
  const bookData =
    (half === 0
      ? oddsCornerTxCompareData[bookId]
      : oddsCornerTxCompareDataHT[bookId]) || {};
  const { cornerTx } = bookData || {}; // TODO cornerTx

  return (
    <>
      <TwBodySingleRow
        className=''
        css={[idx % 2 === 1 && tw`bg-light-match dark:bg-dark-match`]}
      >
        <TwCell className='border ' rowSpan={1}>
          <div className=' text-center font-bold text-black dark:text-dark-default'>
            {bookName}
          </div>
        </TwCell>

        <OddsCellsCorner
          marketData={cornerTx}
          oddsType={oddsType}
          market='cornerTx'
        ></OddsCellsCorner>
        <LiveOddsCellsCorner
          marketData={cornerTx}
          oddsType={oddsType}
          market='cornerTx'
        ></LiveOddsCellsCorner>
        <RunOddsCellsCorner
          marketData={cornerTx}
          oddsType={oddsType}
          market='cornerTx'
        ></RunOddsCellsCorner>

        {/* <TwCell className='border' rowSpan={1}>
          <div className='flex cursor-pointer place-content-center text-center'>
            <button
              onClick={() => {
                setBookMaker({
                  id: bookId,
                  name: bookName,
                });
                setOpenChangesModal(true);
              }}
            >
              <HiTrendingUp className='item-hover h-7 w-7 rounded-md border border-gray-light p-1 text-dark-text'></HiTrendingUp>
            </button>
          </div>
        </TwCell>
        <TwCell rowSpan={1} style={{ cursor: 'pointer' }}>
          <div className='flex cursor-pointer place-content-center '>
            TBD
          </div>
        </TwCell> */}
      </TwBodySingleRow>
    </>
  );
};

const OddsDetailHeaderCornerTx = () => {
  return (
    <thead className='border font-bold text-black dark:text-dark-default '>
      <TwHeaderRow className='h-10 border bg-light-match dark:bg-dark-match'>
        <TwCell className='w-[15%] border' rowSpan={2}>
          <b>Nhà cái</b>
        </TwCell>
        {/* <TwCell className='w-8 border' rowSpan={2} /> */}
        <TwCell className='border' colSpan={3}>
          <b>Sớm</b>
        </TwCell>
        <TwCell className='border' colSpan={3}>
          <b>Live</b>
        </TwCell>
        <TwCell className='border' colSpan={3}>
          <b>Run</b>
        </TwCell>
        {/* <TwCell className='w-4 border' rowSpan={2}>
          <b>Thay đổi</b>
        </TwCell>
        <TwCell rowSpan={2} className='w-6 cursor-pointer'>
          TBD
        </TwCell> */}
      </TwHeaderRow>
      <TwHeaderRow className='h-8 border bg-light-match dark:bg-dark-match'>
        <TwCell className='w-[8%] border'>Tài</TwCell>
        <TwCell className='w-[8%] border'>Kèo</TwCell>
        <TwCell className='w-[8%] border'>Xỉu</TwCell>
        <TwCell className='w-[8%] border'>Tài</TwCell>
        <TwCell className='w-[8%] border'>Kèo</TwCell>
        <TwCell className='w-[8%] border'>Xỉu</TwCell>
        <TwCell className='w-[8%] border'>Tài</TwCell>
        <TwCell className='w-[8%] border'>Kèo</TwCell>
        <TwCell className='w-[8%] border'>Xỉu</TwCell>
      </TwHeaderRow>
    </thead>
  );
};

const OddsCellsCorner = ({
  marketData,
  oddsType,
  market,
}: {
  marketData: any;
  oddsType: string;
  market: string;
}) => {
  const { marketId, choices = [] } = marketData || {};
  const [homeOdds = {}, drawOdds = {}, awayOdds = {}] = choices || [];

  return (
    <>
      <TwCell css={[]}>{convertOdds(homeOdds.iv, market, oddsType, 1)}</TwCell>
      <TwCell css={[]}>
        {/* {convertOdds(drawOdds.iv, marketId, oddsType, 2)} */}
        {drawOdds.iv}
      </TwCell>
      <TwCell css={[]}>{convertOdds(awayOdds.iv, market, oddsType, 3)}</TwCell>
    </>
  );
};

export const LiveOddsCellsCorner = ({
  marketData,
  oddsType,
  market,
}: {
  marketData: any;
  oddsType: string;
  market: string;
}) => {
  const { marketId, choices = [] } = marketData || {};
  const [first = {}, second = {}, third = {}] = choices || [];

  const firstUp = first.lv && first.iv && first.lv > first.iv;
  const firstDown = first.lv && first.iv && first.lv < first.iv;

  const secondUp = second.lv && second.iv && second.lv > second.iv;
  const secondDown = second.lv && second.iv && second.lv < second.iv;

  const thirdUp = third.lv && third.iv && third.lv > third.iv;
  const thirdDown = third.lv && third.iv && third.lv < third.iv;

  return (
    <>
      <TwCell
        css={[firstUp && tw`text-dark-win`, firstDown && tw`text-dark-loss`]}
        className=''
      >
        <LiveOddsCellUpDown
          val={convertOdds(first.lv, marketId, oddsType, 1)}
        ></LiveOddsCellUpDown>
      </TwCell>
      <TwCell
        css={[secondUp && tw`text-dark-win`, secondDown && tw`text-dark-loss`]}
      >
        <LiveOddsCellUpDown
          // val={convertOdds(second.lv, marketId, oddsType, 2)}
          val={second.lv}
        ></LiveOddsCellUpDown>
      </TwCell>
      <TwCell
        css={[thirdUp && tw`text-dark-win`, thirdDown && tw`text-dark-loss`]}
      >
        <LiveOddsCellUpDown
          val={convertOdds(third.lv, marketId, oddsType, 3)}
        ></LiveOddsCellUpDown>
      </TwCell>
    </>
  );
};

const RunOddsCellsCorner = ({
  marketData,
  oddsType,
  market,
}: {
  marketData: any;
  oddsType: string;
  market: string;
}) => {
  const { marketId, choices = [] } = marketData || {};
  const [homeOdds = {}, drawOdds = {}, awayOdds = {}] = choices || [];

  return (
    <>
      <TwCell css={[]}>{convertOdds(homeOdds.v, marketId, oddsType, 1)}</TwCell>
      <TwCell css={[]}>
        {/* {convertOdds(drawOdds.v, marketId, oddsType, 2)} */}
        {drawOdds.v}
      </TwCell>
      <TwCell css={[]}>{convertOdds(awayOdds.v, marketId, oddsType, 3)}</TwCell>
    </>
  );
};
