import { SendMessagePayload } from '@/hooks/useChat';
import { Message } from '@/models/interface';


export const convertSendedMsgToMessage = (msg: SendMessagePayload): Message => {
  // TODO: when user login => insert this data into function
  return {
    id: '',
    msg: msg.msg,
    msgType: '',
    createdAt: Date.now(),
    matchId: msg.matchId,
    user: {
      avatar: '',
      role: '',
      id: '',
      displayName: '',
      level: 1,
      ip: '',
    },
  };
};

export const parseMessage = (dataStr: string[]): Message[] => {
  return dataStr.map((msgString: string) => convertMessageString(msgString));
};

export const convertMessageString = (messageString: string): Message => {
  const dataArr = messageString.split('|');

  const message: Message = {
    id: dataArr[0],
    msg: dataArr[1],
    msgType: dataArr[2],
    createdAt: parseInt(dataArr[3], 10),
    matchId: dataArr[4],
    user: {
      avatar: '',
      role: '',
      id: dataArr[7],
      displayName: dataArr[8],
      level: dataArr[9] ? parseInt(dataArr[9], 10) : 1,
      ip: dataArr[10] || '',
    },
    version: dataArr[11] || 'v1',
  };

  return message;
};

export const getChatLevel = (level: number = 1, version: string = 'v1'): string => {
  const customLevel = level > 0 ? Math.min(level, 100).toString() : '1';
  return `${process.env.NEXT_PUBLIC_CDN_URL}/chat/lv_${customLevel}-${version}.png`;
};
