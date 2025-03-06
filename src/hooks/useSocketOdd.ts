import mqtt from 'mqtt';
import { useEffect, useRef } from 'react';

import { useIsConnectSocketStore } from '@/stores/is-connect-socket';
import { useTestStore } from '@/stores/test-store';
import pako from 'pako';
import { useOddsStore } from '@/stores';

enum IOddType {
  AsianHandicap = '1',
  AsianHandicapHalf = '2',
  European = '3',
  EuropeanHalf = '4',
  OverUnder = '5',
  OverUnderHalf = '6',
}

const useSocketOdd = () => {
  const { setIsConnectSocket } = useIsConnectSocketStore();
  const { selectedBookMaker } = useOddsStore();
  const {
    setOddAsianHandicap,
    setOddAsianHandicapHalf,
    setOddEuropeanHandicap,
    setOddEuropeanHandicapHalf,
    setOddOverUnder,
    setOddOverUnderHalf,
  } = useTestStore();

  const clientRef = useRef<mqtt.MqttClient | null>(null);
  const selectBookMarketRef = useRef<number | null>(null);

  const handleDataStringOdd = (dataString: string): void => {
    const dataSplit: string[] = dataString.split('!');
    dataSplit.forEach((value: string) => {
      const extra: string[] = value.split('^');
      // match_id, companyid, odd1, odd2, odd3, oddtype, inplay, close
      if (extra[5] === IOddType.AsianHandicap) {
        setOddAsianHandicap(`${extra[0]}_${extra[1]}`, value);
      } else if (extra[5] === IOddType.European) {
        setOddEuropeanHandicap(`${extra[0]}_${extra[1]}`, value);
      } else if (extra[5] === IOddType.AsianHandicapHalf) {
        setOddAsianHandicapHalf(`${extra[0]}_${extra[1]}`, value);
      } else if (extra[5] === IOddType.EuropeanHalf) {
        setOddEuropeanHandicapHalf(`${extra[0]}_${extra[1]}`, value);
      } else if (extra[5] === IOddType.OverUnder) {
        setOddOverUnder(`${extra[0]}_${extra[1]}`, value);
      } else if (extra[5] === IOddType.OverUnderHalf) {
        setOddOverUnderHalf(`${extra[0]}_${extra[1]}`, value);
      }
    });
  };

  const handleMessage = (topic: string, receivedPayload: Buffer) => {
    try {
      const inflatedData = pako.inflate(receivedPayload, { to: 'string' });
      // const inflatedData = receivedPayload.toString();

      handleDataStringOdd(inflatedData);
    } catch (error) {
      console.error('Error parsing JSON payload:', error);
    }
  };

  useEffect(() => {
    const initializeMQTT = () => {
      const host = process.env.NEXT_PUBLIC_SOCKET_ENDPOINT || '';
      const clientId = `emqx_${Math.random().toString(16).substr(2, 8)}`;
      const topic = `live-odds-change/${selectedBookMaker?.id}`;

      if (selectBookMarketRef.current !== selectedBookMaker?.id) {
        clientRef.current?.unsubscribe(
          `live-odds-change/${selectBookMarketRef.current}`
        );
      }

      const options = {
        clientId,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 4000,
        username: process.env.NEXT_PUBLIC_USERNAME_SOCKET,
        password: process.env.NEXT_PUBLIC_PASSWORD_SOCKET,
      };
      clientRef.current = mqtt.connect(host, options);
      subscribeToTopics(topic);
    };

    const subscribeToTopics = (topic: string) => {
      clientRef.current?.on('connect', () => {
        console.log('Connected to MQTT odd test');
        setIsConnectSocket(true);
        clientRef.current?.subscribe(topic, { qos: 2 });
      });
      registerEventHandlers();
    };

    const registerEventHandlers = () => {
      const events = ['offline', 'reconnect', 'close', 'end', 'disconnect'];
      events.forEach((event) => {
        if (
          process.env.NEXT_PUBLIC_NODE_ENVIROMENT === 'development' ||
          event === 'error'
        ) {
          clientRef.current?.on(
            event as keyof mqtt.MqttClientEventCallbacks,
            (error: any) => {
              setIsConnectSocket(false);
            }
          );
        }
      });
      clientRef.current?.on('message', handleMessage);
    };

    initializeMQTT();
    selectBookMarketRef.current = selectedBookMaker?.id;
    return () => {
      clientRef.current?.end();
    };
  }, [selectedBookMaker?.id]);
  return null;
};

export default useSocketOdd;
