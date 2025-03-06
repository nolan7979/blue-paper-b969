import { IPayload } from '@/constant/interface';
import { convertAmericanFootballPayload, convertBadmintonPayload, convertBaseballPayload, convertBasketballPayload, convertCricketPayload, convertHockeyPayload, convertPayload, convertTableTennisPayload, convertTennisPayload, convertVolleyballPayload, hasSignificantChanges } from '@/stores/mqttPayloadConverters';
import pako from 'pako';

const previousPayload = { current: null as IPayload | null };

export const handleFootballMessage = async (message: Buffer, setLivescoreSocket: Function, setEventNumber: Function) => {
  const data = message.toString();
  const payload = convertPayload(data);

  if (payload.metadata.sport_event_id && Object.keys(payload.payload.sport_event_status).length > 0) {
    setLivescoreSocket(payload);
    setEventNumber(payload.metadata.match_living_amount);
  }
};

export const handleBasketballMessage = async (message: Buffer, setLivescoreSocket: Function, setEventNumber: Function) => {
  const data = message.toString();
  if (!data) {
    return
  }
  const payload = convertBasketballPayload(data);

  if (payload.metadata && Object.keys(payload.metadata).length > 0) {
    setLivescoreSocket(payload);
    // setEventNumber(payload.metadata.match_living_amount);
  }
};

export const handleTennisMessage = async (receivedPayload: Buffer, setLivescoreSocket: Function, setEventNumber: Function) => {
  const data = receivedPayload.toString();
  if (!data) {
    return
  }

  const payload = convertTennisPayload(data);

  if (payload.metadata && Object.keys(payload.metadata).length > 0) {
    setLivescoreSocket(payload);
    setEventNumber(payload.metadata.match_living_amount);
  }
};

export const handleBaseballMessage = async (receivedPayload: Buffer, setLivescoreSocket: Function, setEventNumber: Function) => {
  const data = receivedPayload.toString();
  if (!data) {
    return
  }
  const payload = convertBaseballPayload(data);
  if (payload.metadata && Object.keys(payload.metadata).length > 0) {
    setLivescoreSocket(payload);
    // setEventNumber(payload.metadata.match_living_amount);
  }
};
export const handleBadmintonMessage = async (receivedPayload: Buffer, setLivescoreSocket: Function, setEventNumber: Function) => {
  const data = receivedPayload.toString();
  if (!data) {
    return
  }
  const payload = convertBadmintonPayload(data);
  if (payload.metadata && Object.keys(payload.metadata).length > 0) {
    setLivescoreSocket(payload);
  }
};

export const handleAmericanFootballMessage = async (receivedPayload: Buffer, setLivescoreSocket: Function, setEventNumber: Function) => {
  const data = receivedPayload.toString();
  if (!data) {
    return
  }
  const payload = convertAmericanFootballPayload(data);
  if (payload.metadata && Object.keys(payload.metadata).length > 0) {
    setLivescoreSocket(payload);
  }
};

export const handleVolleyballMessage = async (receivedPayload: Buffer, setLivescoreSocket: Function, setEventNumber: Function) => {
  const data = receivedPayload.toString();
  const dataArray = data.split(',');
  const payload = convertVolleyballPayload(dataArray);

  if (payload.metadata.sport_event_id && Object.keys(payload.payload.sport_event_status).length > 0) {
    if (!previousPayload.current || hasSignificantChanges(previousPayload.current, payload)) {
      // console.log('check-payload', payload);

      setLivescoreSocket(payload);
      setEventNumber(payload.metadata.match_living_amount);
      previousPayload.current = payload;
    }
  }
};

export const handleHockeyMessage = async (receivedPayload: Buffer, setLivescoreSocket: Function, setEventNumber: Function) => {
  const data = receivedPayload.toString();
  if (!data) {
    return
  }
  const payload = convertHockeyPayload(data);
  if (payload.metadata && Object.keys(payload.metadata).length > 0) {
    setLivescoreSocket(payload);
    setEventNumber(payload.match_living_amount);
  }
}
export const handleCricketMessage = async (receivedPayload: Buffer, setLivescoreSocket: Function, setEventNumber: Function) => {
  const data = receivedPayload.toString();
  if (!data) {
    return
  }
  const payload = convertCricketPayload(data);
  if (payload.metadata && Object.keys(payload.metadata).length > 0) {
    setLivescoreSocket(payload);
    setEventNumber(payload.match_living_amount);
  }
}

export const handleTableTennisMessage = async (receivedPayload: Buffer, setLivescoreSocket: Function, setEventNumber: Function) => {
  const data = receivedPayload.toString();
  if (!data) {
    return
  }
  const payload = convertTableTennisPayload(data);
  if (payload.metadata && Object.keys(payload.metadata).length > 0) {
    setLivescoreSocket(payload);
    setEventNumber(payload.match_living_amount);
  }
}

export const handleOddsMessage = async (receivedPayload: Buffer, setOddAsianHandicap: Function, setOddEuropeanHandicap: Function) => {
  let inflatedData: string;
  if (receivedPayload[0] === 0x1f && receivedPayload[1] === 0x8b) {
    inflatedData = pako.inflate(receivedPayload, { to: 'string' });
  } else {
    inflatedData = receivedPayload.toString();
  }

  const dataSplit = inflatedData.split('!');
  await Promise.all(
    dataSplit.map(async (value: string) => {
      const extra = value.split('^');
      if (extra[5] === '1') {
        await setOddAsianHandicap(`${extra[0]}_${extra[1]}`, value);
      } else if (extra[5] === '3') {
        await setOddEuropeanHandicap(`${extra[0]}_${extra[1]}`, value);
      }
    })
  );
};
