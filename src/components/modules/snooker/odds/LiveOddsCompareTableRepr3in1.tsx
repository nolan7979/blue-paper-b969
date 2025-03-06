import { useMemo, useState } from 'react';
import { HiTrendingUp } from 'react-icons/hi';
import tw from 'twin.macro';

import { useBookmakersData } from '@/hooks/useFootball/useOddsData';

import OddsChangesModal from '@/components/modules/football/odds/OddsChangeModal';
import {
  EarlyOddsCells,
  LiveOddsCells,
  RunOddsCells,
  RunOddsCellsV2,
  TwBodyRow,
  TwCell,
  TwHeaderRow,
  TWTable,
} from '@/components/modules/football/odds/shared-components';

import { useOddsDetailsStore, useOddsStore } from '@/stores';
import { useTestStore } from '@/stores/test-store';
import useTrans from '@/hooks/useTrans';

export const LiveOddsCompareTableRepr3in1 = ({
  matchId,
  half = 0,
  matchMapping,
}: {
  matchId: string;
  half: number;
  matchMapping: string;
}) => {
  const i18n = useTrans();
  const [openChangesModal, setOpenChangesModal] = useState<boolean>(false);
  const [bookMaker, setBookMaker] = useState<any>(null);

  const { oddsType } = useOddsStore();
  const { oddsDetailsData, oddsDetailsData3in1HT } = useOddsDetailsStore();
  const { data } = useBookmakersData();

  const mapBookMakers = useMemo(() => {
    return (
      data?.bookmakers?.reduce((acc: any, cur: any) => {
        acc[cur?.id] = cur.name;
        return acc;
      }, {}) || {}
    );
  }, [data]);

  const shownData = half === 0 ? oddsDetailsData : oddsDetailsData3in1HT;

  return (
    <>
      <TWTable
        width='100%'
        border={0}
        cellPadding={0}
        cellSpacing={0}
        className='border-collapse border border-dark-text/20 text-center text-sm dark:text-dark-text '
      >
        <OddsDetailHeader></OddsDetailHeader>
        <tbody className=''>
          {Object.keys(shownData || {})
            .slice(0, -1)
            .map((bookId: string, idx: number) => {
              const bookName = mapBookMakers[bookId] || bookId;
              return (
                <OddsDetailRow3in1
                  key={bookId}
                  i18n={i18n}
                  bookId={bookId}
                  bookName={bookName}
                  oddsType={oddsType}
                  setOpenChangesModal={setOpenChangesModal}
                  setBookMaker={setBookMaker}
                  idx={idx}
                  half={half}
                  matchMapping={matchMapping}
                ></OddsDetailRow3in1>
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

const OddsDetailRow3in1 = ({
  bookId,
  bookName,
  oddsType,
  setOpenChangesModal,
  setBookMaker,
  idx,
  half = 0,
  matchMapping,
  i18n,
}: {
  bookId: string;
  bookName: string;
  oddsType: string;
  setOpenChangesModal: (x: boolean) => void;
  setBookMaker: (x: any) => void;
  idx: number;
  half: number;
  matchMapping: string;
  i18n?: any;
}) => {
  const { oddsDetailsData, oddsDetailsData3in1HT } = useOddsDetailsStore();
  const bookData =
    (half === 0 ? oddsDetailsData[bookId] : oddsDetailsData3in1HT[bookId]) ||
    {};
  const { hdp, std1x2, tx } = bookData || {};
  const { OddAsianHandicap, OddEuropean, OddOverUnder } = useTestStore();

  const choicesHdp = hdp?.choices || {};
  const choicesStd1x2 = std1x2?.choices || {};
  const choicesTx = tx?.choices || {};

  const odds = OddAsianHandicap.get(`${matchMapping}_${bookId}`);
  const odds2 = OddOverUnder.get(`${matchMapping}_${bookId}`);
  const odds3 = OddEuropean.get(`${matchMapping}_${bookId}`);

  const extra1: string[] = (odds && odds.split('^')) || [];
  const extra2: string[] = (odds2 && odds2.split('^')) || [];
  const extra3: string[] = (odds3 && odds3.split('^')) || [];
  return (
    <>
      <TwBodyRow
        className=''
        css={[idx % 2 === 1 && tw`bg-light-match dark:bg-dark-match`]}
      >
        <TwCell className='border ' rowSpan={3}>
          <div className=' text-center font-bold text-black dark:text-dark-default'>
            {bookName}
          </div>
        </TwCell>

        <TwCell className='border'>
          <div className='text-center '>{i18n.odds.early}</div>
        </TwCell>

        <EarlyOddsCells
          marketData={hdp}
          oddsType={oddsType}
          market='hdp'
        ></EarlyOddsCells>
        <EarlyOddsCells
          marketData={tx}
          oddsType={oddsType}
          market='tx'
        ></EarlyOddsCells>
        <EarlyOddsCells
          marketData={std1x2}
          oddsType={oddsType}
          market='std1x2'
        ></EarlyOddsCells>

        {/* <TwCell className='border' rowSpan={3}>
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
        <TwCell rowSpan={3} style={{ cursor: 'pointer' }}>
          <div className='flex cursor-pointer place-content-center '>TBD</div>
        </TwCell> */}
      </TwBodyRow>

      <TwBodyRow
        className=''
        css={[idx % 2 === 1 && tw`bg-light-match dark:bg-dark-match`]}
      >
        <TwCell className='border '>
          <div className='text-center'>Live</div>
        </TwCell>

        <LiveOddsCells
          marketData={hdp}
          oddsType={oddsType}
          market='hdp'
        ></LiveOddsCells>
        <LiveOddsCells
          marketData={tx}
          oddsType={oddsType}
          market='tx'
        ></LiveOddsCells>
        <LiveOddsCells
          marketData={std1x2}
          oddsType={oddsType}
          market='std1x2'
        ></LiveOddsCells>
      </TwBodyRow>

      <TwBodyRow
        className=''
        css={[idx % 2 === 1 && tw`bg-light-match dark:bg-dark-match`]}
      >
        <TwCell className='border '>
          <div className='text-center text-dark-loss'>Run</div>
        </TwCell>
        <RunOddsCellsV2
          odd1={
            extra1.length > 0
              ? extra1[3]
              : choicesHdp[0] && choicesHdp[0].v
              ? choicesHdp[0].v
              : '-'
          }
          odd2={
            extra1.length > 0
              ? extra1[2]
              : choicesHdp[1] && choicesHdp[1].v
              ? choicesHdp[1].v
              : '-'
          }
          odd3={
            extra1.length > 0
              ? extra1[4]
              : choicesHdp[2] && choicesHdp[2].v
              ? choicesHdp[2].v
              : '-'
          }
        ></RunOddsCellsV2>

        <RunOddsCellsV2
          odd1={
            extra2.length > 0
              ? extra2[3]
              : choicesTx[0] && choicesTx[0].v
              ? choicesTx[0].v
              : '-'
          }
          odd2={
            extra2.length > 0
              ? extra2[2]
              : choicesTx[1] && choicesTx[1].v
              ? choicesTx[1].v
              : '-'
          }
          odd3={
            extra2.length > 0
              ? extra2[4]
              : choicesTx[2] && choicesTx[2].v
              ? choicesTx[2].v
              : '-'
          }
        ></RunOddsCellsV2>

        <RunOddsCellsV2
          odd1={
            extra3.length > 0
              ? extra3[2]
              : choicesStd1x2[0] && choicesStd1x2[0].v
              ? choicesStd1x2[0].v
              : '-'
          }
          odd2={
            extra3.length > 0
              ? extra3[3]
              : choicesStd1x2[1] && choicesStd1x2[1].v
              ? choicesStd1x2[1].v
              : '-'
          }
          odd3={
            extra3.length > 0
              ? extra3[4]
              : choicesStd1x2[2] && choicesStd1x2[2].v
              ? choicesStd1x2[2].v
              : '-'
          }
        ></RunOddsCellsV2>
        {/* <RunOddsCells
          marketData={tx}
          oddsType={oddsType}
          market='tx'
        ></RunOddsCells> */}
        {/* <RunOddsCells
          marketData={std1x2}
          oddsType={oddsType}
          market='std1x2'
        ></RunOddsCells> */}
      </TwBodyRow>
    </>
  );
};

const OddsDetailHeader = () => {
  return (
    <thead className='border font-bold text-black dark:text-dark-default '>
      <TwHeaderRow className='h-10 border bg-light-match dark:bg-dark-match'>
        <TwCell className='w-[8%] border' rowSpan={2}>
          <b>Nhà cái</b>
        </TwCell>
        <TwCell className='w-8 border' rowSpan={2} />
        <TwCell className='border' colSpan={3}>
          <b>Tỷ lệ châu Á </b>
        </TwCell>
        <TwCell className='border' colSpan={3}>
          <b>Tỷ lệ tài xỉu</b>
        </TwCell>
        <TwCell className='border' colSpan={3}>
          <b>Tỷ lệ châu Âu</b>
        </TwCell>
        {/* <TwCell className='w-4 border' rowSpan={2}>
          <b>Thay đổi</b>
        </TwCell>
        <TwCell rowSpan={2} className='w-6 cursor-pointer'>
          TBD
        </TwCell> */}
      </TwHeaderRow>
      <TwHeaderRow className='h-8 border bg-light-match dark:bg-dark-match'>
        <TwCell className='w-[8%] border'>Chủ</TwCell>
        <TwCell className='w-[8%] border'>HDP</TwCell>
        <TwCell className='w-[8%] border'>Khách</TwCell>
        <TwCell className='w-[8%] border'>Tài</TwCell>
        <TwCell className='w-[8%] border'>Kèo đầu</TwCell>
        <TwCell className='w-[8%] border'>Xỉu</TwCell>
        <TwCell className='w-[8%] border'>Chủ</TwCell>
        <TwCell className='w-[8%] border'>Hòa</TwCell>
        <TwCell className='w-[8%] border'>Khách</TwCell>
      </TwHeaderRow>
    </thead>
  );
};
