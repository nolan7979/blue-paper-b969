import { useIsConnectSocketStore } from '@/stores/is-connect-socket';
import { convertMessageString } from '@/utils/chatUtils';
import {  Message } from '@/utils/useChat';
import mqtt from 'mqtt';
import pako from 'pako';
import { useEffect, useRef } from 'react';

const useSocketChatMqtt = (
  topic: string,
  onNewMessage: (message: Message) => void
) => {
  const { setIsConnectSocket } = useIsConnectSocketStore();
  const isConnected = useRef<boolean>(false);
  const currentTopicRef = useRef<string | null>(null);
  const clientRef = useRef<mqtt.MqttClient | null>(null);

  const handleConvertDataChat = async (data: string) => {
    const message = convertMessageString(data);
    onNewMessage(message);
  };

  const handleMessage = async (receivedPayload: Buffer | any) => {
    try {
      const inflatedData = pako.inflate(receivedPayload, { to: 'string' });
      await handleConvertDataChat(inflatedData);
    } catch (error) {
      console.error('Error parsing JSON payload:', error);
    }
  };

  const initializeMQTT = async (topic: string) => {
    const host = process.env.NEXT_PUBLIC_SOCKET_CHAT_ENDPOINT || '';
    const clientId = `emqx_${Math.random().toString(16).substr(2, 8)}`;
    const options = {
      clientId,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 4000,
      keepalive: 60,
      username: process.env.NEXT_PUBLIC_USERNAME_SOCKET,
      password: process.env.NEXT_PUBLIC_PASSWORD_SOCKET,
    };
    clientRef.current = mqtt.connect(host, options);

    clientRef.current.on('connect', async () => {
      console.log('MQTT connected Socket chat');
      currentTopicRef.current = topic;
      await subscribeToTopic(topic);
      isConnected.current = true;
    });

    clientRef.current.on('message', async (receivedTopic, message) => {
      if (receivedTopic === topic) {
        await handleMessage(message);
      }
    });

    await registerEventHandlers();
  };

  const subscribeToTopic = async (topic: string) => {
    clientRef.current?.subscribe(topic, { qos: 1 }, (err, granted) => {
      if (err) {
        console.error('Subscription error:', err);
      } else {
        currentTopicRef.current = topic;
      }
    });
  };

  const registerEventHandlers = async () => {
    const events = ['offline', 'reconnect', 'close', 'end', 'disconnect'];
    events.forEach((event) => {
      clientRef.current?.on(
        event as keyof mqtt.MqttClientEventCallbacks,
        (error: any) => {
          setIsConnectSocket(false);
          isConnected.current = false;
          console.error(`MQTT ${event} event:`, event);
        }
      );
    });
  };

  useEffect(() => {
    if (
      topic &&
      currentTopicRef.current !== topic &&
      !clientRef.current?.connected
    ) {
      initializeMQTT(topic);
      currentTopicRef.current = topic;
    }

    return () => {
      if (clientRef.current?.connected && currentTopicRef.current === topic) {
        console.log('MQTT connection ending');
        clientRef.current?.end(true, () => {
          console.log('MQTT connection ended');
        });
        isConnected.current = false;
        currentTopicRef.current = null;
      }
    };
  }, [topic, currentTopicRef.current]);

  return null;
};

export default useSocketChatMqtt;
