import tw from 'twin.macro';

import { convertOdds, roundNum } from '@/utils';

import OddDownSVG from '/public/svg/odd-down.svg';
import OddUpSVG from '/public/svg/odd-up.svg';
import { useEffect, useRef, useState } from 'react';

export const TwCell = tw.td`border border-dark-text/20`;
export const TwBodyRow = tw.tr`h-8`;
export const TwBodySingleRow = tw.tr`h-9`;
export const TwHeaderRow = tw.tr`border border-dark-text/20`;
export const TWTable = tw.table`border-collapse border border-dark-text/20 text-center text-sm`;

export const RunOddsCells = ({
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
      <TwCell css={[]}>{homeOdds.v}</TwCell>
      <TwCell css={[]}>{drawOdds.v}</TwCell>
      <TwCell css={[]}>{awayOdds.v}</TwCell>
    </>
  );
};

export const RunOddsCellsV2 = ({
  odd1,
  odd2,
  odd3,
}: {
  odd1: any;
  odd2: any;
  odd3: any;
}) => {
  const prevOdd1Ref = useRef(parseFloat(odd1));
  const prevOdd2Ref = useRef(parseFloat(odd2));
  const prevOdd3Ref = useRef(parseFloat(odd3));

  const [color1, setColor1] = useState('inherit');
  const [color2, setColor2] = useState('inherit');
  const [color3, setColor3] = useState('inherit');

  useEffect(() => {
    const newOdd1 = parseFloat(odd1);
    const newOdd2 = parseFloat(odd2);
    const newOdd3 = parseFloat(odd3);

    setColor1(
      newOdd1 > prevOdd1Ref.current
        ? '#AF2929'
        : newOdd1 < prevOdd1Ref.current
        ? '#01B243'
        : 'inherit'
    );
    setColor2(
      newOdd2 > prevOdd2Ref.current
        ? '#AF2929'
        : newOdd2 < prevOdd2Ref.current
        ? '#01B243'
        : 'inherit'
    );
    setColor3(
      newOdd3 > prevOdd3Ref.current
        ? '#AF2929'
        : newOdd3 < prevOdd3Ref.current
        ? '#01B243'
        : 'inherit'
    );

    // Update previous odds references
    prevOdd1Ref.current = newOdd1;
    prevOdd2Ref.current = newOdd2;
    prevOdd3Ref.current = newOdd3;

    // Clear color after 0.5 seconds
    const timeoutId = setTimeout(() => {
      setColor1('inherit');
      setColor2('inherit');
      setColor3('inherit');
    }, 2000);

    // Cleanup timeout
    return () => clearTimeout(timeoutId);
  }, [odd1, odd2, odd3]);

  return (
    <>
      <td
        className={`border border-dark-text/20 ${
          color1 !== 'inherit' ? 'fade-out' : ''
        }`}
        style={{ background: color1 }}
      >
        {odd1}
      </td>
      <td
        className={`border border-dark-text/20 ${
          color2 !== 'inherit' ? 'fade-out' : ''
        }`}
        style={{ background: color2 }}
      >
        {odd2}
      </td>
      <td
        className={`border border-dark-text/20 ${
          color3 !== 'inherit' ? 'fade-out' : ''
        }`}
        style={{ background: color3 }}
      >
        {odd3}
      </td>
    </>
  );
};

export const LiveOddsCells = ({
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
        {/* {convertOdds(homeOdds.lv, marketId, oddsType, 1)} */}
        <LiveOddsCellUpDown
          // val={convertOdds(first.lv, marketId, oddsType, 1)}
          val={first.lv}
          isUp={firstUp}
          isDown={firstDown}
        ></LiveOddsCellUpDown>
      </TwCell>
      <TwCell
        css={[secondUp && tw`text-dark-win`, secondDown && tw`text-dark-loss`]}
      >
        {/* {convertOdds(drawOdds.lv, marketId, oddsType, 2)} */}
        <LiveOddsCellUpDown
          val={convertOdds(second.lv, marketId, oddsType, 2)}
          isUp={secondUp}
          isDown={secondDown}
        ></LiveOddsCellUpDown>
      </TwCell>
      <TwCell
        css={[thirdUp && tw`text-dark-win`, thirdDown && tw`text-dark-loss`]}
      >
        {/* {convertOdds(awayOdds.lv, marketId, oddsType, 3)} */}
        <LiveOddsCellUpDown
          // val={convertOdds(third.lv, marketId, oddsType, 3)}
          val={third.lv}
          isUp={thirdUp}
          isDown={thirdDown}
        ></LiveOddsCellUpDown>
      </TwCell>
    </>
  );
};

export const LiveOddsCellUpDown = ({
  val,
  isUp,
  isDown,
}: {
  val: any;
  isUp?: boolean;
  isDown?: boolean;
}) => {
  return (
    <div className='flex h-full w-full place-content-center items-center gap-1'>
      <span className='relative'>
        {val}
        <span className='tran absolute -right-2 translate-x-1/2 translate-y-1/2 text-xxs'>
          {isUp && <OddUpSVG></OddUpSVG>}
          {isDown && <OddDownSVG></OddDownSVG>}
        </span>
      </span>
    </div>
  );
};

export const EarlyOddsCells = ({
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
      <TwCell
        // className='bg-gray-400/10'
        css={
          [
            // market === 'hdp' && tw`text-hdp`,
            // market === 'tx' && tw`text-tx`,
            // market === 'std1x2' && tw`text-std1x2`,
          ]
        }
      >
        {/* {convertOdds(homeOdds.iv, marketId, oddsType, 1)} */}
        {homeOdds.iv}
      </TwCell>
      <TwCell
        // className='bg-gray-400/10'
        css={
          [
            // market === 'hdp' && tw`text-hdp`,
            // market === 'tx' && tw`text-tx`,
            // market === 'std1x2' && tw`text-std1x2`,
          ]
        }
      >
        {convertOdds(drawOdds.iv, marketId, oddsType, 2)}
      </TwCell>
      <TwCell
        // className='bg-gray-400/10'
        css={
          [
            // market === 'hdp' && tw`text-hdp`,
            // market === 'tx' && tw`text-tx`,
            // market === 'std1x2' && tw`text-std1x2`,
          ]
        }
      >
        {/* {convertOdds(awayOdds.iv, marketId, oddsType, 3)} */}
        {awayOdds.iv}
      </TwCell>
    </>
  );
};

export const calcChangeWithKelly = (changeRaw: any) => {
  const [h, d, a, type, changeTime] = changeRaw.split(',');
  const hWrate = 100 / (1 + h / (d || 1) + h / (a || 1));
  const dWrate = 100 / (1 + d / (h || 1) + d / (a || 1));
  const aWrate = 100 / (1 + a / (h || 1) + a / (d || 1));
  const hReturnRate = hWrate * h;

  return {
    h,
    d,
    a,
    hWrate,
    dWrate,
    aWrate,
    hReturnRate,
    changeTime,
  };
};

export const calcChangesWithKelly = (eu1x2Changes: any) => {
  const oddsChanges = eu1x2Changes || [];
  let sumHrate = 0;
  let sumDrate = 0;
  let sumArate = 0;
  let output: any[] = [];
  for (const change of oddsChanges) {
    // const [h, d, a, type, changeTime] = change.split(',');
    // const hWrate = 100 / (1 + h / (d || 1) + h / (a || 1));
    // const dWrate = 100 / (1 + d / (h || 1) + d / (a || 1));
    // const aWrate = 100 / (1 + a / (h || 1) + a / (d || 1));
    // const hReturnRate = hWrate * h;

    const { h, d, a, hWrate, dWrate, aWrate, hReturnRate, changeTime } =
      calcChangeWithKelly(change);

    sumHrate += hWrate;
    sumDrate += dWrate;
    sumArate += aWrate;

    output.push({
      h,
      d,
      a,
      hWrate,
      dWrate,
      aWrate,
      hReturnRate,
      changeTime,
    });
  }

  output = output.slice().sort((a: any, b: any) => b.changeTime - a.changeTime);
  const avgHrate = sumHrate / (oddsChanges.length || 1) / 100;
  const avgDrate = sumDrate / (oddsChanges.length || 1) / 100;
  const avgArate = sumArate / (oddsChanges.length || 1) / 100;

  for (const record of output) {
    record['hKelly'] = roundNum(record.h * avgHrate, 2);
    record['dKelly'] = roundNum(record.d * avgDrate, 2);
    record['aKelly'] = roundNum(record.a * avgArate, 2);
  }

  return output;
};

// export const calcOddsChangesStatsAll = (allKellyScores: any) => {
// };

// export const calcOddsChangesStats = (kellyScores: any[]) => {
//   let maxH = -1000000;
//   let maxD = -1000000;
//   let maxA = -1000000;
//   let minH = 1000000;
//   let minD = 1000000;
//   let minA = 1000000;
//   for (const score of kellyScores) {
//     const { h, d, a, hWrate, dWrate, aWrate, hKelly, dKelly, aKelly } = score;
//     if (h > maxH) {
//       maxH = h;
//     }
//     if (d > maxD) {
//       maxD = d;
//     }
//     if (a > maxA) {
//       maxA = a;
//     }
//     if (h < minH) {
//       minH = h;
//     }
//     if (d < minD) {
//       minD = d;
//     }
//     if (a < minA) {
//       minA = a;
//     }
//   }

//   return {
//     maxH,
//     maxD,
//     maxA,
//     minH,
//     minD,
//     minA,
//   };
// };
