import { useEffect, useRef } from 'react';

export const useRerenderCount = (componentName: string): number => {
  const renderCountRef = useRef<number>(0);

  useEffect(() => {
    renderCountRef.current = renderCountRef.current + 1;
    console.log(`${componentName} rerender count: ${renderCountRef.current}`);
  });

  return renderCountRef.current;
};
