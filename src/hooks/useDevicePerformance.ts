import { useState, useEffect } from 'react';

export const useDevicePerformance = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    const checkPerformance = () => {
      const start = performance.now();
      requestAnimationFrame(() => {
        const duration = performance.now() - start;
        // Nếu FPS < 60 (duration > 16ms) => thiết bị yếu
        setIsLowPerformance(duration > 16);
      });
    };

    checkPerformance();
  }, []);

  return isLowPerformance;
};