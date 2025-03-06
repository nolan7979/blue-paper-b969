import { debounce } from '@/utils/deounce';
import React, { useState, useEffect } from 'react';
import { HiOutlineChevronUp } from 'react-icons/hi';

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = debounce(toggleVisible, 200);
      window.addEventListener('scroll', handleScroll);

      // Clean up event listener on unmount
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div>
      <button
        className='fixed bottom-16 right-6 z-20 rounded-full bg-logo-blue lg:bottom-10'
        aria-label='Scroll to Top'
        onClick={scrollToTop}
        style={{ display: visible ? 'inline' : 'none' }}
      >
        <HiOutlineChevronUp className='m-1 h-6 w-6 rounded-full text-white' />
      </button>
    </div>
  );
};

export default ScrollToTopButton;
