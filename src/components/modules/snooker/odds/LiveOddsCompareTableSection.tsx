import { ValueSwitcher } from '@/components/common/ValueSwitcher';
import {
  LiveOddsCompareTableLoader,
  LiveOddsCompareTableLoaderCornerTx,
  LiveOddsCompareTableLoaderEu1x2,
  LiveOddsCompareTableLoaderEu1x2Changes,
  LiveOddsCompareTableLoaderScore,
} from '@/components/modules/football/odds/LiveCompareOddsDataLoader';
import { LiveOddsCompareTableRepr1x2 } from '@/components/modules/football/odds/LiveOddsCompareTableRepr1x2';
import { LiveOddsCompareTableRepr3in1 } from '@/components/modules/football/odds/LiveOddsCompareTableRepr3in1';
import { LiveOddsCompareTableReprCornerTx } from '@/components/modules/football/odds/LiveOddsCompareTableReprCornerTX';
import {
  Eu1x2OddsChangesStats,
  LiveOddsCompareTableReprEu1x2,
} from '@/components/modules/football/odds/LiveOddsCompareTableReprEu1x2';
import { LiveOddsCompareTableReprHDP } from '@/components/modules/football/odds/LiveOddsCompareTableReprHDP';
import { LiveOddsCompareTableReprScore } from '@/components/modules/football/odds/LiveOddsCompareTableReprScore';
import { LiveOddsCompareTableReprTX } from '@/components/modules/football/odds/LiveOddsCompareTableReprTX';
import { TwFilterButton } from '@/components/modules/football/tw-components';
import useTrans from '@/hooks/useTrans';

import { useOddsDetailsStore } from '@/stores';

export const LiveOddsCompareTableSection = ({
  matchId,
  matchMapping,
}: {
  matchId: any;
  matchMapping: string;
}) => {
  const { half, setHalf, compareType, setCompareType } = useOddsDetailsStore();
  const i18n = useTrans();
  return (
    <>
      <div className='flex justify-between border-b border-dashed border-[#272a31] pb-1 pt-2'>
        <div className='flex gap-3'>
          <TwFilterButton
            isActive={compareType === '3in1'}
            onClick={() => setCompareType('3in1')}
          >
            {i18n.odds.odds3in1}
          </TwFilterButton>
          <TwFilterButton
            isActive={compareType === 'hdp'}
            onClick={() => setCompareType('hdp')}
          >
            {i18n.odds.asianOdds}
          </TwFilterButton>
          <TwFilterButton
            isActive={compareType === 'tx'}
            onClick={() => setCompareType('tx')}
          >
            {i18n.odds.overUnderBettingOdds}
          </TwFilterButton>
          {/* <TwFilterButton
            isActive={compareType === 'std1x2'}
            onClick={() => setCompareType('std1x2')}
          >
            1x2 main markets
          </TwFilterButton> */}

          {/* <TwFilterButton
            isActive={compareType === 'cornerTx'}
            onClick={() => setCompareType('cornerTx')}
          >
            Kèo phạt góc T/X
          </TwFilterButton> */}
          {/* 
          <TwFilterButton
            isActive={compareType === 'score'}
            onClick={() => setCompareType('score')}
          >
            Tỷ số
          </TwFilterButton> */}

          {/* <TwFilterButton
            isActive={compareType === 'eu1x2'}
            onClick={() => setCompareType('eu1x2')}
            className='ml-8'
          >
            EU 1x2
          </TwFilterButton> */}

          {/* <TwFilterButton
            isActive={compareType === 'eu-hdp'}
            onClick={() => setCompareType('eu-hdp')}
          >
            Euro Handicap
          </TwFilterButton> */}
          {/* <TwFilterButton
            isActive={compareType === 'double-chance'}
            onClick={() => setCompareType('double-chance')}
          >
            Cơ hội kép
          </TwFilterButton> */}
        </div>

        {['3in1', 'hdp', 'tx', 'std1x2'].includes(compareType) && (
          <ValueSwitcher
            options={[
              { name: 'FT', value: 0 },
              { name: 'HT', value: 1 },
            ]}
            valGetter={setHalf}
          ></ValueSwitcher>
        )}
      </div>

      {['3in1', 'hdp', 'tx', 'std1x2'].includes(compareType) && (
        <LiveOddsCompareTableLoader
          matchId={matchId}
          half={half}
          compareType={compareType}
        ></LiveOddsCompareTableLoader>
      )}

      {['cornerTx'].includes(compareType) && (
        <LiveOddsCompareTableLoaderCornerTx
          matchId={matchId}
          half={half}
          compareType={compareType}
        ></LiveOddsCompareTableLoaderCornerTx>
      )}

      {['score'].includes(compareType) && (
        <LiveOddsCompareTableLoaderScore
          matchId={matchId}
          half={half}
          compareType={compareType}
        ></LiveOddsCompareTableLoaderScore>
      )}

      {['eu1x2'].includes(compareType) && (
        <LiveOddsCompareTableLoaderEu1x2
          matchId={matchId}
          half={half}
          compareType={compareType}
        ></LiveOddsCompareTableLoaderEu1x2>
      )}
      {compareType === 'eu1x2' && (
        <LiveOddsCompareTableLoaderEu1x2Changes
          matchId={matchId}
          half={half}
          compareType={compareType}
        ></LiveOddsCompareTableLoaderEu1x2Changes>
      )}

      {compareType === '3in1' && (
        <LiveOddsCompareTableRepr3in1
          matchId={matchId}
          half={half}
          matchMapping={matchMapping}
        ></LiveOddsCompareTableRepr3in1>
      )}

      {compareType === 'hdp' && (
        <LiveOddsCompareTableReprHDP
          matchId={matchId}
          half={half}
        ></LiveOddsCompareTableReprHDP>
      )}

      {compareType === 'tx' && (
        <LiveOddsCompareTableReprTX
          matchId={matchId}
          half={half}
        ></LiveOddsCompareTableReprTX>
      )}

      {compareType === 'std1x2' && (
        <LiveOddsCompareTableRepr1x2
          matchId={matchId}
          half={half}
        ></LiveOddsCompareTableRepr1x2>
      )}

      {compareType === 'eu1x2' && (
        <>
          <LiveOddsCompareTableReprEu1x2
            matchId={matchId}
          ></LiveOddsCompareTableReprEu1x2>
          <Eu1x2OddsChangesStats></Eu1x2OddsChangesStats>
        </>
      )}

      {compareType === 'score' && (
        <LiveOddsCompareTableReprScore
          matchId={matchId}
          half={half}
        ></LiveOddsCompareTableReprScore>
      )}

      {compareType === 'cornerTx' && (
        <LiveOddsCompareTableReprCornerTx
          matchId={matchId}
          half={half}
        ></LiveOddsCompareTableReprCornerTx>
      )}
    </>
  );
};

// const LiveOddsCompareTableLoader = ({
//   matchId,
//   half,
//   compareType,
// }: {
//   matchId: string;
//   half: number;
//   compareType: string;
// }) => {
//   const { data, isFetching } = useMatchCompareMarketsOddsData(
//     matchId || '',
//     half || 0,
//     compareType
//   );
//   const { addOddsDetailsData } = useOddsDetailsStore();

//   useEffect(() => {
//     if (data) {
//       addOddsDetailsData(data);
//     }
//   }, [data, addOddsDetailsData]);

//   if (isFetching) {
//     return <div>Loading...</div>;
//   }

//   return <></>;
// };

// const LiveOddsCompareTableRepr = ({ matchId }: { matchId: string }) => {
//   const [openChangesModal, setOpenChangesModal] = useState<boolean>(false);
//   const [bookMaker, setBookMaker] = useState<any>(null);

//   const { oddsType } = useOddsStore();
//   const { oddsDetailsData } = useOddsDetailsStore();
//   const { data, isFetching } = useBookmakersData();

//   const mapBookMakers = useMemo(() => {
//     return (
//       data?.bookmakers?.reduce((acc: any, cur: any) => {
//         acc[cur?.id] = cur.name;
//         return acc;
//       }, {}) || {}
//     );
//   }, [data]);

//   if (isFetching) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <TWTable
//         width='100%'
//         border={0}
//         cellPadding={0}
//         cellSpacing={0}
//         className='border-collapse border border-dark-text/20 text-center text-sm dark:text-dark-text '
//       >
//         <OddsDetailHeader></OddsDetailHeader>
//         <tbody className=''>
//           {Object.keys(oddsDetailsData || {}).map(
//             (bookId: string, idx: number) => {
//               const bookName = mapBookMakers[bookId] || bookId;
//               return (
//                 <OddsDetailRow
//                   key={bookId}
//                   bookId={bookId}
//                   bookName={bookName}
//                   oddsType={oddsType}
//                   setOpenChangesModal={setOpenChangesModal}
//                   setBookMaker={setBookMaker}
//                   idx={idx}
//                 ></OddsDetailRow>
//               );
//             }
//           )}
//         </tbody>
//       </TWTable>

//       <OddsChangesModal
//         open={openChangesModal}
//         setOpen={setOpenChangesModal}
//         bookMaker={bookMaker}
//         matchId={matchId}
//       ></OddsChangesModal>
//     </>
//   );
// };

// const OddsDetailRow = ({
//   bookId,
//   bookName,
//   oddsType,
//   setOpenChangesModal,
//   setBookMaker,
//   idx,
// }: {
//   bookId: string;
//   bookName: string;
//   oddsType: string;
//   setOpenChangesModal: (x: boolean) => void;
//   setBookMaker: (x: any) => void;
//   idx: number;
// }) => {
//   const { oddsDetailsData } = useOddsDetailsStore();
//   const bookData = oddsDetailsData[bookId] || {};
//   const { hdp, std1x2, tx } = bookData || {};

//   return (
//     <>
//       <TwBodyRow
//         className=''
//         css={[idx % 2 === 1 && tw`bg-light-match dark:bg-dark-match`]}
//       >
//         <TwCell className='border ' rowSpan={2}>
//           <div className=' text-center font-bold text-black dark:text-dark-default'>
//             {bookName}
//           </div>
//         </TwCell>

//         <TwCell className='border'>
//           <div className='text-center '>Sớm</div>
//         </TwCell>
//         <EarlyOddsCells
//           marketData={hdp}
//           oddsType={oddsType}
//           market='hdp'
//         ></EarlyOddsCells>
//         <EarlyOddsCells
//           marketData={tx}
//           oddsType={oddsType}
//           market='tx'
//         ></EarlyOddsCells>
//         <EarlyOddsCells
//           marketData={std1x2}
//           oddsType={oddsType}
//           market='std1x2'
//         ></EarlyOddsCells>

//         <TwCell className='border' rowSpan={2}>
//           <div className='flex cursor-pointer place-content-center text-center'>
//             <button
//               onClick={() => {
//                 setBookMaker({
//                   id: bookId,
//                   name: bookName,
//                 });
//                 setOpenChangesModal(true);
//               }}
//             >
//               <HiTrendingUp className='item-hover h-7 w-7 rounded-md border border-gray-light p-1 text-dark-text'></HiTrendingUp>
//             </button>
//           </div>
//         </TwCell>
//         <TwCell rowSpan={2} style={{ cursor: 'pointer' }}>
//           <div className='flex cursor-pointer place-content-center '>
//             <HiOutlineMinusCircle className='item-hover h-7 w-7 text-dark-text/50'></HiOutlineMinusCircle>
//           </div>
//         </TwCell>
//       </TwBodyRow>

//       <TwBodyRow
//         className=''
//         css={[idx % 2 === 1 && tw`bg-light-match dark:bg-dark-match`]}
//       >
//         <TwCell className='border '>
//           <div className='text-center'>Live</div>
//         </TwCell>
//         <LiveOddsCells
//           marketData={hdp}
//           oddsType={oddsType}
//           market='hdp'
//         ></LiveOddsCells>
//         <LiveOddsCells
//           marketData={tx}
//           oddsType={oddsType}
//           market='tx'
//         ></LiveOddsCells>
//         <LiveOddsCells
//           marketData={std1x2}
//           oddsType={oddsType}
//           market='std1x2'
//         ></LiveOddsCells>
//       </TwBodyRow>
//     </>
//   );
// };

// const OddsDetailHeader = () => {
//   return (
//     <thead className='border font-bold text-black dark:text-dark-default '>
//       <TwHeaderRow className='h-10 border bg-light-match dark:bg-dark-match'>
//         <TwCell className='w-[8%] border' rowSpan={2}>
//           <b>Nhà cái</b>
//         </TwCell>
//         <TwCell className='w-8 border' rowSpan={2} />
//         <TwCell className='border' colSpan={3}>
//           <b>Tỷ lệ châu Á </b>
//         </TwCell>
//         <TwCell className='border' colSpan={3}>
//           <b>Tỷ lệ tài xỉu</b>
//         </TwCell>
//         <TwCell className='border' colSpan={3}>
//           <b>Tỷ lệ châu Âu</b>
//         </TwCell>
//         <TwCell className='w-4 border' rowSpan={2}>
//           <b>Thay đổi</b>
//         </TwCell>
//         <TwCell rowSpan={2} className='w-6 cursor-pointer'>
//           TBD
//         </TwCell>
//       </TwHeaderRow>
//       <TwHeaderRow className='h-8 border bg-light-match dark:bg-dark-match'>
//         <TwCell className='w-[8%] border'>Chủ</TwCell>
//         <TwCell className='w-[8%] border'>HDP</TwCell>
//         <TwCell className='w-[8%] border'>Khách</TwCell>
//         <TwCell className='w-[8%] border'>Tài</TwCell>
//         <TwCell className='w-[8%] border'>Kèo đầu</TwCell>
//         <TwCell className='w-[8%] border'>Xỉu</TwCell>
//         <TwCell className='w-[8%] border'>Chủ</TwCell>
//         <TwCell className='w-[8%] border'>Hòa</TwCell>
//         <TwCell className='w-[8%] border'>Khách</TwCell>
//       </TwHeaderRow>
//     </thead>
//   );
// };

// const LiveOddsCells = ({
//   marketData,
//   oddsType,
//   market,
// }: {
//   marketData: any;
//   oddsType: string;
//   market: string;
// }) => {
//   const { marketId, choices = [] } = marketData || {};
//   const [homeOdds = {}, drawOdds = {}, awayOdds = {}] = choices || [];

//   return (
//     <>
//       <TwCell
//         // className='bg-logo-blue/10'
//         css={
//           [
//             // market === 'hdp' && tw`text-purple-500`,
//             // market === 'tx' && tw`text-tx`,
//             // market === 'std1x2' && tw`text-std1x2`,
//           ]
//         }
//       >
//         {convertOdds(homeOdds.v, marketId, oddsType, 1)}
//       </TwCell>
//       <TwCell
//         // className='bg-logo-blue/10'
//         css={
//           [
//             // market === 'hdp' && tw`text-hdp`,
//             // market === 'tx' && tw`text-tx`,
//             // market === 'std1x2' && tw`text-std1x2`,
//           ]
//         }
//       >
//         {convertOdds(drawOdds.v, marketId, oddsType, 2)}
//       </TwCell>
//       <TwCell
//         // className='bg-logo-blue/10'
//         css={
//           [
//             // market === 'hdp' && tw`text-hdp`,
//             // market === 'tx' && tw`text-tx`,
//             // market === 'std1x2' && tw`text-std1x2`,
//           ]
//         }
//       >
//         {convertOdds(awayOdds.v, marketId, oddsType, 3)}
//       </TwCell>
//     </>
//   );
// };

// const EarlyOddsCells = ({
//   marketData,
//   oddsType,
//   market,
// }: {
//   marketData: any;
//   oddsType: string;
//   market: string;
// }) => {
//   const { marketId, choices = [] } = marketData || {};
//   const [homeOdds = {}, drawOdds = {}, awayOdds = {}] = choices || [];

//   return (
//     <>
//       <TwCell
//         // className='bg-gray-400/10'
//         css={
//           [
//             // market === 'hdp' && tw`text-hdp`,
//             // market === 'tx' && tw`text-tx`,
//             // market === 'std1x2' && tw`text-std1x2`,
//           ]
//         }
//       >
//         {convertOdds(homeOdds.iv, marketId, oddsType, 1)}
//       </TwCell>
//       <TwCell
//         // className='bg-gray-400/10'
//         css={
//           [
//             // market === 'hdp' && tw`text-hdp`,
//             // market === 'tx' && tw`text-tx`,
//             // market === 'std1x2' && tw`text-std1x2`,
//           ]
//         }
//       >
//         {convertOdds(drawOdds.iv, marketId, oddsType, 2)}
//       </TwCell>
//       <TwCell
//         // className='bg-gray-400/10'
//         css={
//           [
//             // market === 'hdp' && tw`text-hdp`,
//             // market === 'tx' && tw`text-tx`,
//             // market === 'std1x2' && tw`text-std1x2`,
//           ]
//         }
//       >
//         {convertOdds(awayOdds.iv, marketId, oddsType, 3)}
//       </TwCell>
//     </>
//   );
// };

// const TwCell = tw.td`border border-dark-text/20`;
// const TwBodyRow = tw.tr`border h-7`;
// const TwHeaderRow = tw.tr`border border-dark-text/20`;
// const TWTable = tw.table`border-collapse border border-dark-text/20 text-center text-sm`;
