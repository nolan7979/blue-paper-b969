import { useState, useEffect, useRef } from 'react';

interface ScrollProgressOptions {
  /**
   * Callback function to be called when scroll progress changes
   */
  onProgressChange?: (progress: number) => void;
  /**
   * Enable/disable console logging
   */
  enableLogging?: boolean;
  /**
   * Throttle delay in milliseconds
   */
  throttleDelay?: number;
}

export const useScrollProgress = (options: ScrollProgressOptions = {}) => {
  const { onProgressChange, enableLogging = false, throttleDelay = 100 } = options;
  const lastProgress = useRef(0);
  const [progress, setProgress] = useState(0);
 
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const calculateProgress = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      const roundedProgress = Math.round(currentProgress);

      // Only update if progress changed by at least 1
      if (Math.abs(lastProgress.current - roundedProgress) >= 1) {
        lastProgress.current = roundedProgress;
        setProgress(roundedProgress);

        // if (enableLogging) {
        //   console.log(`Scroll Progress: ${roundedProgress}%`);
        // }

        if (onProgressChange) {
          onProgressChange(roundedProgress);
        }
      }
    };

    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(calculateProgress, throttleDelay);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial calculation
    calculateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [onProgressChange, enableLogging, throttleDelay]);

  return progress;
};