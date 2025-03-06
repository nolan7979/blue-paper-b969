import { useEffect } from 'react';

const useIdleReload = (timeout = 1800000) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        window.location.reload();
      }, timeout);
    };
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        resetTimer();
      }
    });
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', resetTimer);
    };
  }, [timeout]);
};

export default useIdleReload;
