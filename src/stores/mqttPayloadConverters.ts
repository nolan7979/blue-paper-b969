import { IPayload, IPayloadV2 } from '@/constant/interface';
import { convertBmtStatusCode, convertStatusCode, convertStatusCodeBasketBall, convertStatusCodeHockey } from '@/utils';
import { convertStatusCodeAMFootball } from '@/utils/americanFootballUtils';
import { convertStatusCode as convertStatusCodeBaseball } from '@/utils/baseballUtils';
import { convertStatusCodeCricket } from '@/utils/cricketUtils';
import { convertStatusCodeTableTennis } from '@/utils/tableTennisUtils';

export const convertPayload = (data: string): IPayload => {
  const tmp = data.split(',');
  if (tmp.length < 18) throw new Error('Invalid data format');

  return {
    id: tmp[0],
    payload: {
      sport_event_status: {
        status_id: tmp[1],
        home_score: {
          regular_score: Number(tmp[2]),
          half_time_score: Number(tmp[3]),
          red_card: Number(tmp[4]),
          yellow_card: Number(tmp[5]),
          corners: Number(tmp[6]),
          overTime_score: Number(tmp[7]),
          penalty_score: Number(tmp[8]),
        },
        away_score: {
          regular_score: Number(tmp[9]),
          half_time_score: Number(tmp[10]),
          red_card: Number(tmp[11]),
          yellow_card: Number(tmp[12]),
          corners: Number(tmp[13]),
          overTime_score: Number(tmp[14]),
          penalty_score: Number(tmp[15]),
        },
        kick_of_timestamp: Number(tmp[16]),
      },
    },
    metadata: {
      sport_event_id: tmp[0],
      match_living_amount: Number(tmp[17]),
    },
  };
};

export const convertTennisPayload = (dataArray: string): IPayloadV2 => {
  const values = JSON.parse(dataArray);
  let jsonData: any[] = [];

  if (values?.matches?.length) {
    jsonData = values?.matches.map((item: { id: any; score: any[] }) => {
      return {
        id: item.id,
        scores: item.score?.[3],
        status: convertStatusCode(Number(item.score?.[1])),
        serve: item.score?.[2]
      };
    });
  }

  return {
    metadata: jsonData,
  };
};
export const convertBasketballPayload = (dataArray: string): IPayloadV2 => {
  const values = JSON.parse(dataArray);

  let jsonData: any[] = [];

  if (values?.matches?.length > 0) {
    jsonData = values?.matches.map((item: { id: any; score: any[], timer: any[], total_scores: any[] }) => {

      return {
        id: item.id,
        homeScore: {
          display: Number(item.total_scores?.[0]),
          period1: Number(item.score?.[3]?.[0]),
          period2: Number(item.score?.[3]?.[1]),
          period3: Number(item.score?.[3]?.[2]),
          period4: Number(item.score?.[3]?.[3]),
          overtime: Number(item.score?.[3]?.[4]),
        },
        awayScore: {
          display: Number(item.total_scores?.[1]),
          period1: Number(item.score?.[4]?.[0]),
          period2: Number(item.score?.[4]?.[1]),
          period3: Number(item.score?.[4]?.[2]),
          period4: Number(item.score?.[4]?.[3]),
          overtime: Number(item.score?.[4]?.[4]),
        },
        time: {
          remainTime: Number(item.timer?.[3]),
          countDown: Number(item.timer?.[1]),
          runSeconds: Number(item.timer?.[0]),
          currentPeriodStartTimestamp: Number(item.timer?.[2]),
          status: convertStatusCodeBasketBall(Number(item.score?.[1])),
        },
      };
    });
  }

  return {
    metadata: jsonData,
  };
};
export const convertBaseballPayload = (dataArray: string): IPayloadV2 => {
  const values = JSON.parse(dataArray);

  let jsonData: any[] = [];

  if (values?.matches?.length > 0) {
    jsonData = values?.matches.map((item: { id: any; score: any[] }) => {
      return {
        id: item.id,
        scores: item.score?.[3],
        status: convertStatusCodeBaseball(Number(item.score?.[1])),
        serve: item.score?.[2]
      };
    });
  }

  return {
    metadata: jsonData,
  };
};


export const convertBadmintonPayload = (message: string | Buffer) => {
  try {
    const values = JSON.parse(message?.toString());
    let jsonData: any[] = [];
    if (values?.matches?.length) {
      jsonData = values?.matches.map((item: { id: any; score: any[] }) => {
        return {
          id: item.id,
          scores: item.score?.[3],
          status: convertBmtStatusCode(item.score?.[1]),
          serve: item.score?.[2]
        };
      });
    }
    return { metadata: jsonData };
  } catch (error) {
    console.error(error);
    return { metadata: [] };
  }
};

export const convertHockeyPayload = (data: string): IPayloadV2 => {
  try {
    const values = JSON.parse(data);
    let jsonData: any[] = [];
    if (values?.matches?.length) {
      jsonData = values?.matches.map((item: { id: any; score: any[]; timer: any[] }) => {
        return {
          id: item.id,
          scores: item.score?.[3],
          status: convertStatusCodeHockey(item.score?.[1]),
          timer: {
            runSeconds: Number(item.timer?.[0]),
            countDown: Number(item.timer?.[1]),
            remainTime: Number(item.timer?.[3]),
            updateTime: Number(item.timer?.[2]),
          }
        };
      });
    }
    return { metadata: jsonData, match_living_amount: values?.live_count };
  } catch (error) {
    console.error(error);
    return { metadata: [] };
  }
}

export const convertCricketPayload = (data: string): IPayloadV2 => {
  try {
    const values = JSON.parse(data);
    let jsonData: any[] = [];
    if (values?.matches?.length) {
      jsonData = values?.matches.map((item: { id: any; score: any[] }) => {
        return { id: item.id, scores: item.score?.[3], status: convertStatusCodeCricket(item.score?.[1]), serve: item.score?.[2], extraScores: item.score?.[4] };
      });
    }
    return { metadata: jsonData, match_living_amount: values?.live_count };
  } catch (error) {
    console.error(error);
    return { metadata: [] };
  }
}

export const convertTableTennisPayload = (dataArray: string): IPayloadV2 => {
  try {
    const values = JSON.parse(dataArray);
    let jsonData: any[] = [];
    if (values?.matches?.length) {
      jsonData = values?.matches.map((item: { id: any; score: any[] }) => {
        return { id: item.id, scores: item.score?.[3], status: convertStatusCodeTableTennis(item.score?.[1]), serve: item.score?.[2] };
      });
    }
    return { metadata: jsonData, match_living_amount: values?.live_count };
  } catch (error) {
    console.error(error);
    return { metadata: [] };
  }
}


export const convertVolleyballPayload = (dataArray: string[]): IPayload => {
  const toNumberOrDefault = (value: string, defaultValue: number = 0) => {
    const number = Number(value);
    return isNaN(number) ? defaultValue : number;
  };

  return {
    id: dataArray[0],
    payload: {
      sport_event_status: {
        status_id: dataArray[1],
        home_score: {
          regular_score: toNumberOrDefault(dataArray[2]),
          set2_score: toNumberOrDefault(dataArray[4]),
          current_point: toNumberOrDefault(dataArray[6]),
        },
        away_score: {
          regular_score: toNumberOrDefault(dataArray[3]),
          set2_score: toNumberOrDefault(dataArray[5]),
          current_point: toNumberOrDefault(dataArray[7]),
        },
        final_score: [
          toNumberOrDefault(dataArray[8]),
          toNumberOrDefault(dataArray[9]),
        ],
      },
    },
    metadata: {
      sport_event_id: dataArray[0],
      match_living_amount: toNumberOrDefault(dataArray[17]),
    },
  };
};

export const convertAmericanFootballPayload = (message: string): IPayloadV2 => {
  const values = JSON.parse(message);

  let jsonData: any[] = [];

  if (values?.matches?.length > 0) {
    jsonData = values?.matches.map((item: { id: any; score: any[] }) => {
      return {
        id: item.id,
        scores: item.score?.[3],
        status: convertStatusCodeAMFootball(Number(item.score?.[1])),
        serve: item.score?.[2]
      };
    });
  }

  return {
    metadata: jsonData,
  };
};

export const hasSignificantChanges = (prevPayload: any, newPayload: any) => {
  return (
    prevPayload.payload.sport_event_status.status_id !== newPayload.payload.sport_event_status.status_id ||
    prevPayload.payload.sport_event_status.home_score.regular_score !== newPayload.payload.sport_event_status.home_score.regular_score ||
    prevPayload.payload.sport_event_status.home_score.set2_score !== newPayload.payload.sport_event_status.home_score.set2_score ||
    prevPayload.payload.sport_event_status.home_score.current_point !== newPayload.payload.sport_event_status.home_score.current_point ||
    prevPayload.payload.sport_event_status.away_score.regular_score !== newPayload.payload.sport_event_status.away_score.regular_score ||
    prevPayload.payload.sport_event_status.away_score.set2_score !== newPayload.payload.sport_event_status.away_score.set2_score ||
    prevPayload.payload.sport_event_status.away_score.current_point !== newPayload.payload.sport_event_status.away_score.current_point
  );
};


