import { debounce } from '@/utils/deounce';
import { useEffect, useState } from 'react';

function getWindowDimensions() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : -1,
    height: typeof window !== 'undefined' ? window.innerHeight : -1,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize(getWindowDimensions());
    }

    handleResize();

    const resizeObserver = debounce(handleResize, 100);
    window.addEventListener('resize', resizeObserver);
    return () => window.removeEventListener('resize', resizeObserver);
  }, []);

  return windowSize;
}


export const useDetectDeviceClient = () => {
  const [deviceType, setDeviceType] = useState({
    isDesktop: true,
    isMobile: false,
    isTablet: false,
  });

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const width = window.innerWidth;

      const isMobileUA = /mobile|android|iphone/i.test(userAgent);
      const isTabletUA = /ipad|tablet/i.test(userAgent);

      const isTablet = isTabletUA || (width >= 768 && width < 1024);
      const isMobile = isMobileUA && width < 768 && !isTablet;
      const isDesktop = width >= 1024 && !isTablet;

      setDeviceType({
        isDesktop,
        isMobile,
        isTablet,
      });
    };

    detectDevice();

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(detectDevice, 150); // Throttle 150ms
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return deviceType;
};