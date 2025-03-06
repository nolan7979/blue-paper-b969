import { produce } from 'immer';
import { create } from 'zustand';

import { calcChangesWithKelly } from '@/components/modules/football/odds/shared-components';

import { IOddsCompany } from '@/models/football/common';
import { roundNum } from '@/utils';
import { getItem, setItem } from '@/utils/localStorageUtils';

export interface ISelectBookMaker {
  id?: number | string;
  value?: string;
  name: string;
}

interface OddsStore {
  showOdds: boolean;
  market: any;
  selectedBookMaker: IOddsCompany;
  selectedBookMakerQV: any;
  oddsType: string;
  setMarket: (market: string) => void;
  setSelectedBookMaker: (bookMaker: any) => void;
  setSelectedBookMakerQV: (bookMaker: any) => void;
  setOddsType: (oddsType: string) => void;
  setShowOdds: () => void;
}

export const useOddsStore = create<OddsStore>((set) => {
  const initialShowOdds = Boolean(getItem('isOdds'));

  return {
    showOdds: initialShowOdds,
    setShowOdds: () => {
      set((state) => ({ showOdds: !state.showOdds }));
      setItem('isOdds', JSON.stringify(!initialShowOdds));
    },

    market: process.env.NEXT_PUBLIC_DEFAULT_MARKET,
    setMarket: (market: string) => set(() => ({ market })),
    selectedBookMaker: {
      id: parseInt(
        process.env.NEXT_PUBLIC_DEFAULT_BOOKMAKER?.toString() || '8'
      ),
      name: 'Bet365',
    },
    setSelectedBookMaker: (selectedBookMaker: IOddsCompany) =>
      set(() => ({ selectedBookMaker })),

    selectedBookMakerQV: {
      id: process.env.NEXT_PUBLIC_DEFAULT_BOOKMAKER,
      name: 'Bet365',
    },
    setSelectedBookMakerQV: (selectedBookMakerQV: any) =>
      set(() => ({ selectedBookMakerQV })),

    oddsType: '5',
    setOddsType: (oddsType: string) => set(() => ({ oddsType })),
  };
});

// export const useOddsStore = create<OddsStore>((set) => ({
//   showOdds: false,
//   market: process.env.NEXT_PUBLIC_DEFAULT_MARKET, // TODO fetch DB
//   selectedBookMaker: {
//     id: parseInt(process.env.NEXT_PUBLIC_DEFAULT_BOOKMAKER?.toString() || '8'),
//     name: 'Bet365',
//   },
//   selectedBookMakerQV: {
//     id: process.env.NEXT_PUBLIC_DEFAULT_BOOKMAKER,
//     name: 'Bet365',
//   },
//   oddsType: '5',
//   setShowOdds: (showOdds: boolean) => set(() => ({ showOdds: showOdds })),
//   toggleOdds: () => set((state) => ({ showOdds: !state.showOdds })),
//   setMarket: (market: string) => set(() => ({ market })),
//   setSelectedBookMaker: (selectedBookMaker: IOddsCompany) =>
//     set(() => ({ selectedBookMaker })),
//   setSelectedBookMakerQV: (selectedBookMakerQV: any) =>
//     set(() => ({ selectedBookMakerQV })),
//   setOddsType: (oddsType: string) => set(() => ({ oddsType })),
// }));

// useOddsLeagueStore
interface OddsLeagueStore {
  selectedLeagues: any[];
  setSelectedLeagues: (selectedLeagues: any[]) => void;
}

export const useOddsLeagueStore = create<OddsLeagueStore>((set) => ({
  selectedLeagues: [],
  setSelectedLeagues: (selectedLeagues: any[]) =>
    set(() => ({ selectedLeagues })),
}));

interface OddsDetailsStore {
  half: number;
  compareType: string;
  setHalf: (half: number) => void;
  setCompareType: (compareType: string) => void;

  oddsDetailsData: any;
  oddsDetailsData3in1HT: any;
  setOddsDetailsData: (oddsDetailsData: any) => void;
  addOddsDetailsData: (newOddsDetailsData: any) => void;
  addOddsDetailsData3in1HT: (newOddsDetailsData: any) => void;

  oddsHdpCompareData: any;
  oddsHdpCompareDataHT: any;
  addOddsHdpCompareData: (newOddsData: any) => void;
  addOddsHdpCompareDataHT: (newOddsData: any) => void;

  oddsTXCompareData: any;
  oddsTXCompareDataHT: any;
  addOddsTXCompareData: (newOddsData: any) => void;
  addOddsTXCompareDataHT: (newOddsData: any) => void;

  odds1x2CompareData: any;
  odds1x2CompareDataHT: any;
  addOdds1x2CompareData: (newOddsData: any) => void;
  addOdds1x2CompareDataHT: (newOddsData: any) => void;

  oddsScoreCompareData: any;
  oddsScoreCompareDataHT: any;
  addOddsScoreCompareData: (newOddsData: any) => void;
  addOddsScoreCompareDataHT: (newOddsData: any) => void;

  oddsCornerTxCompareData: any;
  oddsCornerTxCompareDataHT: any;
  addOddsCornerTxCompareData: (newOddsData: any) => void;
  addOddsCornerTxCompareDataHT: (newOddsData: any) => void;

  oddsEu1x2CompareData: any;
  addOddsEu1x2CompareData: (newOddsData: any) => void;

  oddsEu1x2ChangeData: any;
  oddsEu1x2ChangeDataKelly: any;
  addOddsEu1x2ChangeData: (newOddsData: any) => void;

  oddsStats: any;
}

export const useOddsDetailsStore = create<OddsDetailsStore>((set) => ({
  half: 0,
  compareType: '3in1',
  setHalf: (half: number) => set(() => ({ half })),
  setCompareType: (compareType: string) => set(() => ({ compareType })),

  oddsDetailsData: {},
  oddsDetailsData3in1HT: {},
  setOddsDetailsData: (oddsDetailsData: any) =>
    set(() => ({ oddsDetailsData })),
  addOddsDetailsData: (newOddsDetails: any) => {
    Object.keys(newOddsDetails).forEach((bookId: string) => {
      const bookData = newOddsDetails[bookId];
      set(
        produce((state: any) => {
          state.oddsDetailsData[bookId] = bookData;
        })
      );
    });
  },
  addOddsDetailsData3in1HT: (newOddsDetails: any) => {
    Object.keys(newOddsDetails).forEach((bookId: string) => {
      const bookData = newOddsDetails[bookId];
      set(
        produce((state: any) => {
          state.oddsDetailsData3in1HT[bookId] = bookData;
        })
      );
    });
  },

  oddsHdpCompareData: {},
  oddsHdpCompareDataHT: {},
  addOddsHdpCompareData: (newOddsData: any) => {
    Object.keys(newOddsData).forEach((bookId: string) => {
      const bookData = newOddsData[bookId];
      set(
        produce((state: any) => {
          state.oddsHdpCompareData[bookId] = bookData;
        })
      );
    });
  },
  addOddsHdpCompareDataHT: (newOddsData: any) => {
    Object.keys(newOddsData).forEach((bookId: string) => {
      const bookData = newOddsData[bookId];
      set(
        produce((state: any) => {
          state.oddsHdpCompareDataHT[bookId] = bookData;
        })
      );
    });
  },

  oddsTXCompareData: {},
  oddsTXCompareDataHT: {},
  addOddsTXCompareData: (newOddsData: any) => {
    Object.keys(newOddsData).forEach((bookId: string) => {
      const bookData = newOddsData[bookId];
      set(
        produce((state: any) => {
          state.oddsTXCompareData[bookId] = bookData;
        })
      );
    });
  },
  addOddsTXCompareDataHT: (newOddsData: any) => {
    Object.keys(newOddsData).forEach((bookId: string) => {
      const bookData = newOddsData[bookId];
      set(
        produce((state: any) => {
          state.oddsTXCompareDataHT[bookId] = bookData;
        })
      );
    });
  },

  odds1x2CompareData: {},
  odds1x2CompareDataHT: {},
  addOdds1x2CompareData: (newOddsData: any) => {
    Object.keys(newOddsData).forEach((bookId: string) => {
      const bookData = newOddsData[bookId];
      set(
        produce((state: any) => {
          state.odds1x2CompareData[bookId] = bookData;
        })
      );
    });
  },
  addOdds1x2CompareDataHT: (newOddsData: any) => {
    Object.keys(newOddsData).forEach((bookId: string) => {
      const bookData = newOddsData[bookId];
      set(
        produce((state: any) => {
          state.odds1x2CompareDataHT[bookId] = bookData;
        })
      );
    });
  },

  oddsScoreCompareData: {},
  oddsScoreCompareDataHT: {},
  addOddsScoreCompareData: (newOddsData: any) => {
    set(
      produce((state: any) => {
        Object.keys(state.oddsScoreCompareData).forEach(
          (existingBookId: string) => {
            if (!newOddsData[existingBookId]) {
              delete state.oddsScoreCompareData[existingBookId];
            }
          }
        );
      })
    );

    Object.keys(newOddsData).forEach((bookId: string) => {
      const bookData = newOddsData[bookId];
      set(
        produce((state: any) => {
          state.oddsScoreCompareData[bookId] = bookData;
        })
      );
    });
  },
  addOddsScoreCompareDataHT: (newOddsData: any) => {
    Object.keys(newOddsData).forEach((bookId: string) => {
      const bookData = newOddsData[bookId];
      set(
        produce((state: any) => {
          state.oddsScoreCompareDataHT[bookId] = bookData;
        })
      );
    });
  },

  oddsCornerTxCompareData: {},
  oddsCornerTxCompareDataHT: {},
  addOddsCornerTxCompareData: (newOddsData: any) => {
    Object.keys(newOddsData).forEach((bookId: string) => {
      const bookData = newOddsData[bookId];
      set(
        produce((state: any) => {
          state.oddsCornerTxCompareData[bookId] = bookData;
        })
      );
    });
  },
  addOddsCornerTxCompareDataHT: (newOddsData: any) => {
    Object.keys(newOddsData).forEach((bookId: string) => {
      const bookData = newOddsData[bookId];
      set(
        produce((state: any) => {
          state.oddsCornerTxCompareDataHT[bookId] = bookData;
        })
      );
    });
  },

  oddsEu1x2CompareData: {},
  addOddsEu1x2CompareData: (newOddsData: any) => {
    Object.keys(newOddsData).forEach((bookId: string) => {
      const bookData = newOddsData[bookId];
      set(
        produce((state: any) => {
          state.oddsEu1x2CompareData[bookId] = bookData;
        })
      );
    });
  },

  oddsEu1x2ChangeData: {},
  oddsEu1x2ChangeDataKelly: {},
  oddsStats: {},
  addOddsEu1x2ChangeData: (newOddsData: any) => {
    const oddsDict = newOddsData?.oddsDict || {};

    Object.keys(newOddsData?.oddsDict).forEach((bookId: string) => {
      const bookData = oddsDict[bookId];
      const bookKellyScores = calcChangesWithKelly(bookData);
      set(
        produce((state: any) => {
          state.oddsEu1x2ChangeData[bookId] = bookData;
          state.oddsEu1x2ChangeDataKelly[bookId] = bookKellyScores;
        })
      );
    });

    set((state: any) => {
      return {
        oddsStats: calcOddsChangesStats(state.oddsEu1x2ChangeDataKelly),
      };
    });
  },
}));

interface OddsQvStore {
  market: string;
  showPrematch: boolean;
  half: number;
  showDetailModal: boolean;
  showDetailModalCornerOU: boolean;
  showDetailModalScore: boolean;
  selectedBookMaker: any;

  showPrematchCornerOU: boolean;
  halfCornerOU: number;
  halfScore: number;

  correctScoreBookMaker: number;

  setMarket: (market: string) => void;
  setShowPrematch: (showPrematch: boolean) => void;
  setHalf: (half: number) => void;
  setShowDetailModal: (showDetailModal: boolean) => void;
  setShowDetailModalCornerOU: (showDetailModal: boolean) => void;
  setShowDetailModalScore: (showDetailModal: boolean) => void;
  setSelectedBookMaker: (selectedBookMaker: any) => void;

  setShowPrematchCornerOU: (showPrematch: boolean) => void;
  setHalfCornerOU: (half: number) => void;
  setHalfScore: (half: number) => void;
  setCorrectScoreBookMaker: (correctScoreBookMaker: number) => void;
}

export const useOddsQvStore = create<OddsQvStore>((set) => ({
  market: 'hdp',
  showPrematch: true,
  half: 0,
  showDetailModal: false,
  showDetailModalCornerOU: false,
  showDetailModalScore: false,
  selectedBookMaker: {},
  showPrematchCornerOU: true,
  halfCornerOU: 0,
  halfScore: 0,

  correctScoreBookMaker: 31,

  setMarket: (market: string) => set(() => ({ market })),
  setShowPrematch: (showPrematch: boolean) => set(() => ({ showPrematch })),
  setHalf: (half: number) => set(() => ({ half })),
  setShowDetailModal: (showDetailModal: boolean) =>
    set(() => ({ showDetailModal })),
  setShowDetailModalCornerOU: (showDetailModalCornerOU: boolean) =>
    set(() => ({ showDetailModalCornerOU })),
  setShowDetailModalScore: (showDetailModalScore: boolean) =>
    set(() => ({ showDetailModalScore })),
  setSelectedBookMaker: (selectedBookMaker: any) =>
    set(() => ({ selectedBookMaker })),

  setShowPrematchCornerOU: (showPrematchCornerOU: boolean) =>
    set(() => ({ showPrematchCornerOU })),
  setHalfCornerOU: (halfCornerOU: number) => set(() => ({ halfCornerOU })),
  setHalfScore: (halfScore: number) => set(() => ({ halfScore })),
  setCorrectScoreBookMaker: (correctScoreBookMaker: number) =>
    set(() => ({ correctScoreBookMaker })),
}));

interface OddsEu1x2FilterStore {
  showFilter: boolean;
  setShowFilter: (showFilter: boolean) => void;

  inputValues: any;
  setInputValues: (inputValues: any) => void;

  applyFilter: boolean;
  setApplyFilter: (applyFilter: boolean) => void;

  eu1x2OddsType: string;
  setEu1x2OddsType: (eu1x2OddsType: string) => void;

  selectedBookMakers: any;
  setSelectedBookMakers: (selectedBookMakers: any) => void;

  bookMakerType: string;
  setBookMakerType: (bookMakerType: string) => void;

  sortBy: number;
  setSortBy: (sortBy: number) => void;
}

export const useOddsEu1x2FilterStore = create<OddsEu1x2FilterStore>((set) => ({
  showFilter: false,
  setShowFilter: (showFilter: boolean) => set(() => ({ showFilter })),

  inputValues: {},
  setInputValues: (inputValues: any) => set(() => ({ inputValues })),

  applyFilter: false,
  setApplyFilter: (applyFilter: boolean) => set(() => ({ applyFilter })),

  eu1x2OddsType: 'all',
  setEu1x2OddsType: (eu1x2OddsType: string) => set(() => ({ eu1x2OddsType })),

  selectedBookMakers: {},
  setSelectedBookMakers: (selectedBookMakers: any) =>
    set(() => ({ selectedBookMakers })),

  bookMakerType: 'all',
  setBookMakerType: (bookMakerType: string) => set(() => ({ bookMakerType })),

  sortBy: 0,
  setSortBy: (sortBy: number) => set(() => ({ sortBy })),
}));

export const calcOddsChangesStats = (allBookOddsChanges: any) => {
  let maxH = -1000000;
  let maxD = -1000000;
  let maxA = -1000000;
  let minH = 1000000;
  let minD = 1000000;
  let minA = 1000000;
  let maxHWrate = -1000000;
  let maxDWrate = -1000000;
  let maxAWrate = -1000000;
  let minHWrate = 1000000;
  let minDWrate = 1000000;
  let minAWrate = 1000000;
  let maxHKelly = -1000000;
  let maxDKelly = -1000000;
  let maxAKelly = -1000000;
  let minHKelly = 1000000;
  let minDKelly = 1000000;
  let minAKelly = 1000000;
  let maxHReturnRate = -1000000;
  let minHReturnRate = 1000000;

  let fMaxH = -1000000;
  let fMaxD = -1000000;
  let fMaxA = -1000000;
  let fMinH = 1000000;
  let fMinD = 1000000;
  let fMinA = 1000000;
  let fMaxHWrate = -1000000;
  let fMaxDWrate = -1000000;
  let fMaxAWrate = -1000000;
  let fMinHWrate = 1000000;
  let fMinDWrate = 1000000;
  let fMinAWrate = 1000000;
  // let fMaxHKelly = -1000000;
  // let fMaxDKelly = -1000000;
  // let fMaxAKelly = -1000000;
  // let fMinHKelly = 1000000;
  // let fMinDKelly = 1000000;
  // let fMinAKelly = 1000000;
  let fMaxHReturnRate = -1000000;
  let fMinHReturnRate = 1000000;
  let sumH = 0;
  let sumD = 0;
  let sumA = 0;
  let sumHWrate = 0;
  let sumDWrate = 0;
  let sumAWrate = 0;
  let sumHReturnRate = 0;
  let sumHKelly = 0;
  let sumDKelly = 0;
  let sumAKelly = 0;
  let fSumH = 0;
  let fSumD = 0;
  let fSumA = 0;
  let fSumHWrate = 0;
  let fSumDWrate = 0;
  let fSumAWrate = 0;
  let fSumHReturnRate = 0;

  for (const bookId in allBookOddsChanges) {
    const bookChanges = allBookOddsChanges[bookId];

    for (const idx in bookChanges) {
      const change = bookChanges[idx];

      const {
        h,
        d,
        a,
        hWrate,
        dWrate,
        aWrate,
        hKelly,
        dKelly,
        aKelly,
        hReturnRate,
      } = change;
      const home = parseFloat(h);
      const draw = parseFloat(d);
      const away = parseFloat(a);

      if (isNaN(home) || isNaN(draw) || isNaN(away)) continue;

      if (home > maxH) {
        maxH = home;
      }
      if (draw > maxD) {
        maxD = draw;
      }
      if (away > maxA) {
        maxA = away;
      }
      if (home < minH) {
        minH = home;
      }
      if (draw < minD) {
        minD = draw;
      }
      if (away < minA) {
        minA = away;
      }
      if (hWrate > maxHWrate) {
        maxHWrate = hWrate;
      }
      if (dWrate > maxDWrate) {
        maxDWrate = dWrate;
      }
      if (aWrate > maxAWrate) {
        maxAWrate = aWrate;
      }
      if (hWrate < minHWrate) {
        minHWrate = hWrate;
      }
      if (dWrate < minDWrate) {
        minDWrate = dWrate;
      }
      if (aWrate < minAWrate) {
        minAWrate = aWrate;
      }
      if (hKelly > maxHKelly) {
        maxHKelly = hKelly;
      }
      if (dKelly > maxDKelly) {
        maxDKelly = dKelly;
      }
      if (aKelly > maxAKelly) {
        maxAKelly = aKelly;
      }
      if (hKelly < minHKelly) {
        minHKelly = hKelly;
      }
      if (dKelly < minDKelly) {
        minDKelly = dKelly;
      }
      if (aKelly < minAKelly) {
        minAKelly = aKelly;
      }
      if (hReturnRate > maxHReturnRate) {
        maxHReturnRate = hReturnRate;
      }
      if (hReturnRate < minHReturnRate) {
        minHReturnRate = hReturnRate;
      }

      sumH += home || 0;
      sumD += draw || 0;
      sumA += away;
      sumHWrate += hWrate;
      sumDWrate += dWrate;
      sumAWrate += aWrate;
      sumHReturnRate += hReturnRate;
      sumHKelly += hKelly;
      sumDKelly += dKelly;
      sumAKelly += aKelly;

      break;
    }

    const firstChange = bookChanges[bookChanges.length - 1];
    const {
      h,
      d,
      a,
      hWrate,
      dWrate,
      aWrate,
      hKelly,
      dKelly,
      aKelly,
      hReturnRate,
    } = firstChange;
    const home = parseFloat(h);
    const draw = parseFloat(d);
    const away = parseFloat(a);

    if (isNaN(home) || isNaN(draw) || isNaN(away)) continue;

    if (home > fMaxH) {
      fMaxH = home;
    }
    if (draw > fMaxD) {
      fMaxD = draw;
    }
    if (away > fMaxA) {
      fMaxA = away;
    }
    if (home < fMinH) {
      fMinH = home;
    }
    if (draw < fMinD) {
      fMinD = draw;
    }
    if (away < fMinA) {
      fMinA = away;
    }
    if (hWrate > fMaxHWrate) {
      fMaxHWrate = hWrate;
    }
    if (dWrate > fMaxDWrate) {
      fMaxDWrate = dWrate;
    }
    if (aWrate > fMaxAWrate) {
      fMaxAWrate = aWrate;
    }
    if (hWrate < fMinHWrate) {
      fMinHWrate = hWrate;
    }
    if (dWrate < fMinDWrate) {
      fMinDWrate = dWrate;
    }
    if (aWrate < fMinAWrate) {
      fMinAWrate = aWrate;
    }
    // if (hKelly > maxHKelly) {
    //   maxHKelly = hKelly;
    // }
    // if (dKelly > maxDKelly) {
    //   maxDKelly = dKelly;
    // }
    // if (aKelly > maxAKelly) {
    //   maxAKelly = aKelly;
    // }
    // if (hKelly < minHKelly) {
    //   minHKelly = hKelly;
    // }
    // if (dKelly < minDKelly) {
    //   minDKelly = dKelly;
    // }
    // if (aKelly < minAKelly) {
    //   minAKelly = aKelly;
    // }
    if (hReturnRate > fMaxHReturnRate) {
      fMaxHReturnRate = hReturnRate;
    }
    if (hReturnRate < fMinHReturnRate) {
      fMinHReturnRate = hReturnRate;
    }

    fSumH += home;
    fSumD += draw;
    fSumA += away;
    fSumHWrate += hWrate;
    fSumDWrate += dWrate;
    fSumAWrate += aWrate;
    fSumHReturnRate += hReturnRate;
    // console.log('maxH:', maxH);
  }

  const numBooks = Object.keys(allBookOddsChanges).length;

  return {
    maxH: maxH === -1000000 ? null : maxH,
    maxD: maxD === -1000000 ? null : maxD,
    maxA: maxA === -1000000 ? null : maxA,
    minH: minH === 1000000 ? null : minH,
    minD: minD === 1000000 ? null : minD,
    minA: minA === 1000000 ? null : minA,
    maxHWrate: maxHWrate === -1000000 ? null : roundNum(maxHWrate),
    maxDWrate: maxDWrate === -1000000 ? null : roundNum(maxDWrate),
    maxAWrate: maxAWrate === -1000000 ? null : roundNum(maxAWrate),
    minHWrate: minHWrate === 1000000 ? null : roundNum(minHWrate),
    minDWrate: minDWrate === 1000000 ? null : roundNum(minDWrate),
    minAWrate: minAWrate === 1000000 ? null : roundNum(minAWrate),
    maxHReturnRate:
      maxHReturnRate === -1000000 ? null : roundNum(maxHReturnRate),
    minHReturnRate:
      minHReturnRate === 1000000 ? null : roundNum(minHReturnRate),
    maxHKelly: maxHKelly === -1000000 ? null : maxHKelly,
    maxDKelly: maxDKelly === -1000000 ? null : maxDKelly,
    maxAKelly: maxAKelly === -1000000 ? null : maxAKelly,
    minHKelly: minHKelly === 1000000 ? null : minHKelly,
    minDKelly: minDKelly === 1000000 ? null : minDKelly,
    minAKelly: minAKelly === 1000000 ? null : minAKelly,

    fMaxH: fMaxH === -1000000 ? null : fMaxH,
    fMaxD: fMaxD === -1000000 ? null : fMaxD,
    fMaxA: fMaxA === -1000000 ? null : fMaxA,
    fMinH: fMinH === 1000000 ? null : fMinH,
    fMinD: fMinD === 1000000 ? null : fMinD,
    fMinA: fMinA === 1000000 ? null : fMinA,
    fMaxHWrate: fMaxHWrate === -1000000 ? null : roundNum(fMaxHWrate),
    fMaxDWrate: fMaxDWrate === -1000000 ? null : roundNum(fMaxDWrate),
    fMaxAWrate: fMaxAWrate === -1000000 ? null : roundNum(fMaxAWrate),
    fMinHWrate: fMinHWrate === 1000000 ? null : roundNum(fMinHWrate),
    fMinDWrate: fMinDWrate === 1000000 ? null : roundNum(fMinDWrate),
    fMinAWrate: fMinAWrate === 1000000 ? null : roundNum(fMinAWrate),
    fMaxHReturnRate:
      fMaxHReturnRate === -1000000 ? null : roundNum(fMaxHReturnRate),
    fMinHReturnRate:
      fMinHReturnRate === 1000000 ? null : roundNum(fMinHReturnRate),

    avgH: roundNum(sumH / numBooks) || null,
    avgD: roundNum(sumD / numBooks) || null,
    avgA: roundNum(sumA / numBooks) || null,
    avgHWrate: roundNum(sumHWrate / numBooks) || null,
    avgDWrate: roundNum(sumDWrate / numBooks) || null,
    avgAWrate: roundNum(sumAWrate / numBooks) || null,
    avgHReturnRate: roundNum(sumHReturnRate / numBooks) || null,
    avgHKelly: roundNum(sumHKelly / numBooks) || null,
    avgDKelly: roundNum(sumDKelly / numBooks) || null,
    avgAKelly: roundNum(sumAKelly / numBooks) || null,

    fAvgH: roundNum(fSumH / numBooks) || null,
    fAvgD: roundNum(fSumD / numBooks) || null,
    fAvgA: roundNum(fSumA / numBooks) || null,
    fAvgHWrate: roundNum(fSumHWrate / numBooks) || null,
    fAvgDWrate: roundNum(fSumDWrate / numBooks) || null,
    fAvgAWrate: roundNum(fSumAWrate / numBooks) || null,
    fAvgHReturnRate: roundNum(fSumHReturnRate / numBooks) || null,
  };
};
