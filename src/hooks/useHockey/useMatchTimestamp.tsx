import { IStatusCode } from "@/constant/interface";
import { formatMatchTimestampHockey, isInProgessMatchHockey } from "@/utils/hockeyUtils";
import { useCallback, useEffect, useRef, useState } from "react";

const useMatchTimestampHockey = (
  startTimestamp: number,
  currentPeriodStartTimestamp: number,
  status: IStatusCode,
  id: string,
  addMore: (params: { id: string; minute: string }) => void
) => {
  const { date, time, timeSub } = formatMatchTimestampHockey(startTimestamp, status);

  const [dateTimeZone, setDateTimeZone] = useState<string>(date);
  const [timeTimeZone, setTimeTimeZone] = useState<string>(time);


  const updateTimestamps = useCallback(() => {
    const { date: newDateStr, time: newTimeStr } = formatMatchTimestampHockey(
      startTimestamp,
      status
    );

    setDateTimeZone(prevDate => (prevDate !== newDateStr ? newDateStr : prevDate));
    setTimeTimeZone(prevTime => prevTime !== newTimeStr ? newTimeStr : prevTime);

    if (newTimeStr !== timeTimeZone) {
      // Schedule the addMore call for the next tick
      setTimeout(() => {
        addMore({ id, minute: newTimeStr });
      }, 0);
    }
  }, [startTimestamp, status, currentPeriodStartTimestamp, id, addMore, timeTimeZone]);

  const intervalIdRef = useRef<NodeJS.Timeout>();


  useEffect(() => {
    const periodStartTimestamp = Number(currentPeriodStartTimestamp);
    if (periodStartTimestamp >= 0 && isInProgessMatchHockey(status.code)) {
      updateTimestamps();
      const intervalId = setInterval(updateTimestamps, 6000);
      intervalIdRef.current = intervalId;
      return () => clearInterval(intervalId);
    }
  }, [currentPeriodStartTimestamp, status.code, updateTimestamps]);


  return { dateTimeZone, timeTimeZone, timeSub };
};


// const renderTimeZone = (time: string, i18n: any): JSX.Element => {
//   const timeArr =
//     time && i18n && i18n.common[time as keyof typeof i18n.common]
//       ? i18n.common[time as keyof typeof i18n.common]
//       : time;

//   const isTimeFormat = (value: string): boolean => {
//     return /^\d{1,2}:\d{2}$/.test(value);
//   };

//   return (
//     <div className={`flex items-center justify-center`}>
//       {(isTimeFormat(timeArr) && remainTime > 0 && (
//         <span className={`items-center text-center`}>{timeArr}</span>
//       )) || <span className='max-w-16 truncate'>{timeArr}</span>}
//     </div>
//   );
// };

export { useMatchTimestampHockey };