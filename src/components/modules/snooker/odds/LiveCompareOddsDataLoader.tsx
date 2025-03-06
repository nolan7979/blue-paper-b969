import { useEffect } from 'react';

import {
  useMatchCompareMarketsOddsData,
  useMatchOddsChangeData,
} from '@/hooks/useFootball/useOddsData';

import { useOddsDetailsStore } from '@/stores';

export const LiveOddsCompareTableLoader = ({
  matchId,
  half,
  compareType,
}: {
  matchId: string;
  half: number;
  compareType: string;
}) => {
  const { data, isFetching } = useMatchCompareMarketsOddsData(
    matchId || '',
    half || 0,
    compareType
  );

  const {
    addOddsDetailsData,
    addOddsDetailsData3in1HT,
    addOddsHdpCompareData,
    addOddsHdpCompareDataHT,
    addOddsTXCompareData,
    addOddsTXCompareDataHT,
    addOdds1x2CompareData,
    addOdds1x2CompareDataHT,
  } = useOddsDetailsStore();

  useEffect(() => {
    if (data) {
      if (compareType === '3in1') {
        if (half === 0) {
          addOddsDetailsData(data);
        } else if (half === 1) {
          addOddsDetailsData3in1HT(data);
        }
      } else if (compareType === 'hdp') {
        if (half === 0) {
          addOddsHdpCompareData(data);
        } else if (half === 1) {
          addOddsHdpCompareDataHT(data);
        }
      } else if (compareType === 'tx') {
        if (half === 0) {
          addOddsTXCompareData(data);
        } else if (half === 1) {
          addOddsTXCompareDataHT(data);
        }
      } else if (compareType === 'std1x2') {
        if (half === 0) {
          addOdds1x2CompareData(data);
        } else if (half === 1) {
          addOdds1x2CompareDataHT(data);
        }
      }

      // TODO set data 1x2
    }
  }, [
    data,
    addOddsDetailsData,
    compareType,
    addOddsHdpCompareData,
    half,
    addOddsDetailsData3in1HT,
    addOddsHdpCompareDataHT,
    addOddsTXCompareData,
    addOddsTXCompareDataHT,
    addOdds1x2CompareData,
    addOdds1x2CompareDataHT,
  ]);

  if (isFetching) {
    return <></>;
  }

  return <></>;
};

export const LiveOddsCompareTableLoaderCornerTx = ({
  matchId,
  half,
  compareType,
}: {
  matchId: string;
  half: number;
  compareType: string;
}) => {
  const { data, isFetching } = useMatchCompareMarketsOddsData(
    matchId || '',
    half || 0,
    'cornerTx'
  );
  const { addOddsCornerTxCompareData, addOddsCornerTxCompareDataHT } =
    useOddsDetailsStore();

  useEffect(() => {
    if (data) {
      if (compareType === 'cornerTx') {
        if (half === 0) {
          addOddsCornerTxCompareData(data);
        } else if (half === 1) {
          addOddsCornerTxCompareDataHT(data);
        }
      }
    }
  }, [
    data,
    compareType,
    half,
    addOddsCornerTxCompareData,
    addOddsCornerTxCompareDataHT,
  ]);

  if (isFetching) {
    return <></>;
  }

  return <></>;
};

export const LiveOddsCompareTableLoaderScore = ({
  matchId,
  half,
  compareType,
}: {
  matchId: string;
  half: number;
  compareType: string;
}) => {
  const { data, isFetching } = useMatchCompareMarketsOddsData(
    matchId || '',
    half || 0,
    'score'
  );
  const { addOddsScoreCompareData, addOddsScoreCompareDataHT } =
    useOddsDetailsStore();

  useEffect(() => {
    if (data) {
      if (compareType === 'score') {
        if (half === 0) {
          addOddsScoreCompareData(data);
        } else if (half === 1) {
          addOddsScoreCompareDataHT(data);
        }
      }
    }
  }, [
    data,
    compareType,
    half,
    addOddsScoreCompareData,
    addOddsScoreCompareDataHT,
  ]);

  if (isFetching) {
    return <></>;
  }

  return <></>;
};

export const LiveOddsCompareTableLoaderEu1x2 = ({
  matchId,
  half,
  compareType,
}: {
  matchId: string;
  half: number;
  compareType: string;
}) => {
  const { data, isFetching } = useMatchCompareMarketsOddsData(
    matchId || '',
    half || 0,
    'eu1x2'
  );
  const { addOddsEu1x2CompareData } = useOddsDetailsStore();

  useEffect(() => {
    if (data) {
      addOddsEu1x2CompareData(data);
    }
  }, [data, addOddsEu1x2CompareData]);

  if (isFetching) {
    return <></>;
  }

  return <></>;
};

export const LiveOddsCompareTableLoaderEu1x2Changes = ({
  matchId,
  half,
  compareType,
}: {
  matchId: string;
  half: number;
  compareType: string;
}) => {
  const { data, isFetching } = useMatchOddsChangeData(
    matchId || '',
    '31',
    'eu1x2',
    0
  );
  const { addOddsEu1x2ChangeData } = useOddsDetailsStore();

  useEffect(() => {
    if (data) {
      addOddsEu1x2ChangeData(data);
    }
  }, [data, addOddsEu1x2ChangeData]);

  if (isFetching) {
    return <></>;
  }

  return <></>;
};
