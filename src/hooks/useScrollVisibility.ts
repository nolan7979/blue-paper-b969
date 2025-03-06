import { useState, useEffect } from 'react';
import { debounce } from '@/utils/deounce';

interface UseScrollVisibilityProps {
  isLandscape: boolean;
}

export  const useScrollVisibility = ({ isLandscape }: UseScrollVisibilityProps) => {
  const [visible, setVisible] = useState(true);
  const [lastOffset, setLastOffset] = useState(0);

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
  
      if (Math.abs(scrolled - lastOffset) < 100) return;

      if (scrolled >= lastOffset && visible) {
        setVisible(false);
      } else if (scrolled < lastOffset && !visible) {
        setVisible(true);
      }

      setLastOffset(scrolled);
    };

    if (typeof window !== 'undefined' && (window.innerWidth <= 1023 || isLandscape)) {
      const handleScroll = debounce(toggleVisible, 100);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [lastOffset, visible, isLandscape]);

  return visible;
};

export const useScrollVisibilityForRef = ({
  isLandscape,
  targetRef,
}: {
  targetRef: React.RefObject<HTMLElement>;
  isLandscape: boolean;
}) => {
  const [visible, setVisible] = useState(true);
  const [lastOffset, setLastOffset] = useState(0);

  useEffect(() => {
    const toggleVisible = () => {
      if (!targetRef.current) return;

      const scrolled = document.documentElement.scrollTop;
      const targetOffset = targetRef.current.offsetTop ?? 0;


      // Chỉ cập nhật nếu scrolled thực sự thay đổi đáng kể
      if (Math.abs(scrolled - lastOffset) < 100) return;

      if (scrolled >= targetOffset && visible) {
        setVisible(false);
      } else if (scrolled < targetOffset && !visible) {
        setVisible(true);
      }

      setLastOffset(scrolled);
    };

    if (typeof window !== "undefined" && (window.innerWidth <= 1023 || isLandscape)) {
      const handleScroll = debounce(toggleVisible, 150);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [visible, isLandscape, targetRef]); 

  return visible;
};

// export default useScrollVisibility;
