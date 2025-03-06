import { SOCKET_TOPIC, SPORT } from '@/constant/common';
import { useConnectionStore } from '@/stores/connection-store';
import { useEventCountStore } from '@/stores/event-count';
import {
  handleAmericanFootballMessage,
  handleBadmintonMessage,
  handleBaseballMessage,
  handleBasketballMessage,
  handleCricketMessage,
  handleFootballMessage,
  handleHockeyMessage,
  handleOddsMessage,
  handleTableTennisMessage,
  handleTennisMessage,
  handleVolleyballMessage,
} from '@/stores/mqttMessageHandlers';
import { useTestStore } from '@/stores/test-store';
import mqtt from 'mqtt';
import { useCallback, useEffect, useRef, useState } from 'react';

const useMqttClient = (
  ns: SPORT,
  enableSocket: boolean
) => {
  const nsRef = useRef<string | null>(null);
  const clientRef = useRef<mqtt.MqttClient | null>(null);
  const { setIsConnected, isConnected, setTopicSocket, topicSocket } = useConnectionStore();
  const { setEventNumber } = useEventCountStore();
  const { setOddAsianHandicap, setOddEuropeanHandicap } = useTestStore();
  const [matchLiveSocket, setMatchLiveSocket] = useState<Record<string, any> | null>(null);
  const hasConnectedOnce = useRef(false);

  const disconnectIfConnected = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (clientRef.current?.connected || clientRef.current && isConnected) {
        console.log('Disconnecting from MQTT...');
        clientRef.current.end(true, (err) => {
          if (err) {
            console.error('Error disconnecting MQTT:', err);
            reject(err);
          } else {
            console.log('Disconnected from MQTT');
            setIsConnected(false);
            resolve(null);
          }
        });
      } else {
        console.log('No MQTT connection to disconnect from');
        resolve(null);  // Không có kết nối nào
        setTopicSocket(null);
        setIsConnected(false);
      }
    });
  }, [setIsConnected, setTopicSocket, isConnected]);

  const handleMqttMessage = useCallback(async (topic: string, message: any) => {
    try {
      switch (topic) {
        case SOCKET_TOPIC[SPORT.FOOTBALL]:
          await handleFootballMessage(message, setMatchLiveSocket, setEventNumber);
          break;
        case SOCKET_TOPIC[SPORT.BASKETBALL]:
          await handleBasketballMessage(message, setMatchLiveSocket, setEventNumber);
          break;
        case SOCKET_TOPIC[SPORT.TENNIS]:
          await handleTennisMessage(message, setMatchLiveSocket, setEventNumber);
          break;
        case SOCKET_TOPIC[SPORT.VOLLEYBALL]:
          await handleVolleyballMessage(message, setMatchLiveSocket, setEventNumber);
          break;
        case SOCKET_TOPIC[SPORT.BASEBALL]:
          await handleBaseballMessage(message, setMatchLiveSocket, setEventNumber);
          break;
        case SOCKET_TOPIC[SPORT.BADMINTON]:
          await handleBadmintonMessage(message, setMatchLiveSocket, setEventNumber);
          break;
        case SOCKET_TOPIC[SPORT.AMERICAN_FOOTBALL]:
          await handleAmericanFootballMessage(message, setMatchLiveSocket, setEventNumber);
          break;
        case SOCKET_TOPIC[SPORT.ICE_HOCKEY]:
          await handleHockeyMessage(message, setMatchLiveSocket, setEventNumber);
          break;
        case SOCKET_TOPIC[SPORT.CRICKET]:
          await handleCricketMessage(message, setMatchLiveSocket, setEventNumber);
          break;
        case SOCKET_TOPIC[SPORT.TABLE_TENNIS]:
          await handleTableTennisMessage(message, setMatchLiveSocket, setEventNumber);
          break;
        default:
          await handleOddsMessage(message, setOddAsianHandicap, setOddEuropeanHandicap);
      }
    } catch (error) {
      console.error('Error handling MQTT message:', error);
    }
  }, [setMatchLiveSocket, setEventNumber, setOddAsianHandicap, setOddEuropeanHandicap]);

  const initializeMQTT = useCallback(
    async (topic: string) => {
      if (isConnected && topicSocket === topic) {
        console.log(`Already connected to MQTT: ${topic}, skipping reconnection.`);
        return;
      } else {
        const host = process.env.NEXT_PUBLIC_SOCKET_ENDPOINT || '';
        const clientId = `emqx_${Math.random().toString(16).substr(2, 8)}`;

        const options = {
          clientId,
          clean: false,
          reconnectPeriod: 5000,
          connectTimeout: 4000,
          keepalive: 60,
          username: process.env.NEXT_PUBLIC_USERNAME_SOCKET,
          password: process.env.NEXT_PUBLIC_PASSWORD_SOCKET,
        };

        clientRef.current = mqtt.connect(host, options);

        clientRef.current.on('connect', async () => {
          setTopicSocket(topic);
          setIsConnected(true);
          console.log(`Connected to MQTT: ${topic}`);
          clientRef.current?.subscribe(topic, { qos: 1 });
        });

        clientRef.current.on('reconnect', () => {
          console.log('Reconnecting to MQTT...');
          setIsConnected(false);
        });

        clientRef.current.on('message', handleMqttMessage);

        clientRef.current.on('offline', () => {
          setIsConnected(false);
        });

        clientRef.current.on('close', () => {
          setIsConnected(false);
          console.log('Closed from MQTT');
        });

        clientRef.current.on('disconnect', () => {
          setIsConnected(false);
          console.log('Disconnected from MQTT');
          hasConnectedOnce.current = false;
        });
      }
    },
    [handleMqttMessage, setIsConnected, isConnected, setTopicSocket, topicSocket]);

  useEffect(() => {
    setEventNumber(-1);
  }, [ns]);

  useEffect(() => {
    const manageConnection = async () => {
      if (!ns || ns === nsRef.current) return;

      nsRef.current = ns;

      await disconnectIfConnected();

      const topic = SOCKET_TOPIC[ns];
      if (topic && topicSocket !== topic) {
        console.log(`Initializing MQTT connection to: ${topic}`);
        initializeMQTT(topic);
      }
    };
    if (!!enableSocket) {
      manageConnection();
    }
    return () => {
      if (clientRef.current?.connected && topicSocket && topicSocket === SOCKET_TOPIC[ns] && isConnected) {
        console.log(`Unsubscribing and disconnecting from MQTT: ${topicSocket}`);
        clientRef.current?.end(true, () => {
          console.log('MQTT connection ended');
        });
        setIsConnected(false);
        setTopicSocket(null);
      }
    };
  }, [ns, initializeMQTT, disconnectIfConnected, isConnected, topicSocket, enableSocket]);

  return {
    matchLiveSocket,
  };
};

export default useMqttClient;
