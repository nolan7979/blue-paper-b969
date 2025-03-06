import {
  IScore,
  IStatusCode,
  ITSMatchScore,
  MatchState,
} from '@/constant/interface';

export const convertITSMatchScoreToIScore = (s: ITSMatchScore): IScore => {
  let tmp_ft: number = s.regular_score;
  if (s.overTime_score !== 0) {
    tmp_ft = s.overTime_score;
  }
  return {
    display: tmp_ft,
    period1: s.half_time_score,
    period2: s.regular_score - s.half_time_score,
  };
};

export const convertStatusCode = (statusCode: number): IStatusCode => {
  switch (statusCode) {
    case -1:
      return {
        code: -1,
        type: '',
        description: '',
      };

    case MatchState.NotStarted:
      return {
        code: 0,
        description: 'not_started',
        type: 'not_started',
      };
    case MatchState.FirstHalf:
      return {
        code: 5,
        description: '1st_half',
        type: 'inprogress',
      };

    case MatchState.HalfTime:
      return {
        code: 6,
        description: 'halftime',
        type: 'inprogress',
      };
    case MatchState.SecondHalf:
      return {
        code: 7,
        description: '2nd_half',
        type: 'inprogress',
      };
    case MatchState.OverTime:
      return {
        code: 14,
        description: 'overtime',
        type: 'inprogress',
      };
    case MatchState.PenaltyShootOut:
      return {
        code: 13,
        description: 'penalties',
        type: 'inprogress',
      };
    case MatchState.End:
      return {
        code: 100,
        description: 'ended',
        type: 'finished',
      };
    case MatchState.Postponed:
      return {
        code: 60,
        description: 'Postponed',
        type: 'postponed',
      };
    case MatchState.Interrupt:
      return {
        code: 15,
        description: 'interrupted',
        type: 'inprogress',
      };
    case MatchState.CutInHalf:
      return {
        code: 90,
        description: 'cut in half',
        type: 'cancelled',
      };
    case MatchState.Cancel:
      return {
        code: 70,
        description: 'cancelled',
        type: 'finished',
      };
    case MatchState.AET:
      return {
        code: 110,
        description: 'AET',
        type: 'finished',
      };
    case MatchState.AP:
      return {
        code: 120,
        description: 'AP',
        type: 'finished',
      };
    default:
      return {
        code: -1,
        type: '',
        description: '',
      };
  }
};
