import { MatchState, StatusDto } from '@/constant/interface';
import { useMinuteMatchLiveStore } from '@/stores/minute-match-live';
import { calculateTime, genDisplayedTime } from '@/utils';
import { useEffect, useState } from 'react';
import vi from '~/lang/vi';

export const useFootballTimeScore = (
  id: string,
  startTimestamp: number,
  status: StatusDto,
  i18n: any = vi,
  startTime?: number
) => {
  const [first, setFirst] = useState<string | number>(() =>
    calculateTime(status ? status.code : -1, startTime!)
  );
  const [second, setSecond] = useState<string>('');
  const [third, setThird] = useState<string>('');
  const { idAndMinutes } = useMinuteMatchLiveStore();

  useEffect(() => {
    function updateDisplayedTime() {
      const matchStatus = Object.values(MatchState).filter(
        (value) => typeof value === 'number'
      );
      const newValues =
        genDisplayedTime(startTimestamp, status, i18n, startTime) || [];

      if (matchStatus.includes(status && status.code)) {
        switch (status.code) {
          case MatchState.FirstHalf:
          case MatchState.NotStarted:
            setThird(newValues[2] || '');
          case MatchState.Cancel:
          case MatchState.Postponed:
          case MatchState.SecondHalf:
          case MatchState.CutInHalf:
            setFirst(newValues[0] || '');
            setSecond(newValues[1] || '');
            break;

          case MatchState.HalfTime:
            setFirst('HT');
            setSecond('') //reset second
            break;
          case MatchState.AET:
            setFirst('AET');
            setSecond('') //reset second
            break;
          case MatchState.AP:
            setFirst('AP');
            setSecond('') //reset second
            break;
          case MatchState.End:
            setFirst(i18n.status.finished);
            setSecond('');
            break;
          default:
            const m = idAndMinutes.find((i) => i?.id === id);
            setFirst(m?.minute);
            break;
        }
      }
    }
    updateDisplayedTime();
    const intervalId = setInterval(updateDisplayedTime, 6000);

    return () => clearInterval(intervalId);
  }, [i18n, id, idAndMinutes, startTime, startTimestamp, status, status.code]);

  return {
    first,
    second,
    third,
  };
};
