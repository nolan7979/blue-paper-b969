
export interface Message {
  id: string;
  msg: string;
  msgType: string;
  createdAt: number;
  matchId: string;
  user: {
    avatar: string;
    role: string;
    id: string;
    displayName: string;
    level: number;
    ip: string;
  };
}


const parseMessage = (dataStr: string[]): Message[] => {
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
  };

  return message;
};