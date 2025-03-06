import React, { useCallback, useEffect, useRef, useState } from 'react';

import { convertTime } from '@/models/common';
import { TimeBarProps } from '@/models/interface';
import { MatchState } from '@/constant/interface';

const TimeBar: React.FC<TimeBarProps> = ({
  startTime,
  duration,
  status,
  currentPeriodTime,
  breakTime,
}) => {
  const [state, setState] = useState({
    progress: 0,
    elapsedSeconds: 0,
    displayTime: true,
  });
  const [is2nd, setIs2nd] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatElapsedTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }, []);

  const clearCurrentInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleNotStarted = useCallback(() => {
    setState({ progress: 0, elapsedSeconds: 0, displayTime: false });
    clearCurrentInterval();
  }, [clearCurrentInterval]);

  const handleInProgress = useCallback(() => {
    clearCurrentInterval();
    intervalRef.current = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      let elapsed = now - (currentPeriodTime || startTime);
      let currentTime = now - startTime;
      const isHaltTime = status.code === MatchState.HalfTime
      const isSecondHalf = status.code === MatchState.SecondHalf
      let durationOver =  duration;
      let isDisplay = true

   
      if (currentTime >= 60 * 60 || isSecondHalf) {
        elapsed += 45 * 60;
      }

      let newProgress = ((elapsed / 60)/durationOver)*100;

      if(newProgress > 100) {
        isDisplay = false
        if(status.description == '2nd_half' && !is2nd) {
          setIs2nd(true)
        }
        if(status.description == '1st_half') {
          newProgress = 50
        } else {
          newProgress = 100
        }
      }

      if(elapsed >= duration * 60 && isSecondHalf){
        durationOver = 90;
        newProgress=100;
      }

      if (isHaltTime) {
        newProgress = 50;
        elapsed = 45 * 60;
      }
      
      setState({ progress: newProgress, elapsedSeconds: elapsed, displayTime: isDisplay });
    }, 1000);
  }, [clearCurrentInterval, currentPeriodTime, duration, startTime,status]);

  const handleFinished = useCallback(() => {
    setState({ progress: 100, elapsedSeconds: duration * 60, displayTime: false });
    clearCurrentInterval();
  }, [clearCurrentInterval, duration]);

  const handleMatchTime = useCallback(() => {
    switch (status.type) {
      case 'not_started':
        handleNotStarted();
        break;
      case 'inprogress':
        handleInProgress();
        break;
      case 'finished':
        handleFinished();
        break;
      default:
        break;
    }
  }, [handleFinished, handleInProgress, handleNotStarted, status]);

  useEffect(() => {
    handleMatchTime();
    return clearCurrentInterval;
  }, [handleMatchTime, startTime, duration, currentPeriodTime, clearCurrentInterval]);

  useEffect(() => {
    const shouldDisplayTime = !['HT', 'FT', 'AP', 'AET'].includes(breakTime);
    setState((prevState) => ({
      ...prevState,
      displayTime: shouldDisplayTime,
      progress: breakTime === 'HT' ? 50 : breakTime === 'FT' || breakTime === 'AP' || breakTime === 'AET' ? 100 : prevState.progress,
    }));

    if (['HT', 'FT', 'AP', 'AET'].includes(breakTime)) {
      clearCurrentInterval();
    } else {
      handleMatchTime();
    }
  }, [breakTime, clearCurrentInterval, handleMatchTime]);

  const isActive = useCallback((position: number) => state.progress >= position, [state.progress]);

  return (
    <div className='timebar-container'>
      <div className='timebar-background'>
        <div className='timebar-progress' style={{ width: `${state.progress}%` }} />
        <div className='timebar-current-time' style={{ left: `${state.progress}%` }}>
          {state.displayTime && formatElapsedTime(state.elapsedSeconds)}
        </div>
      </div>
      <div className={`timebar-marker timebar-marker-left ${isActive(0) ? 'active' : ''}`}>
        <div className='timebar-marker-icon'></div>
        {convertTime(startTime)}
      </div>
      <div className={`timebar-marker timebar-marker-middle ${isActive(50) ? 'active' : ''}`}>
        <div className='timebar-marker-icon'></div>
        HT
      </div>
      <div className={`timebar-marker timebar-marker-right ${isActive(100) ? 'active' : ''}`}>
        <div className='timebar-marker-icon'></div>
        {['FT', 'AP', 'AET'].includes(breakTime) ? breakTime : `${is2nd ? '2nd' : 'FT'}`}
      </div>
    </div>
  );
};

export default TimeBar;
