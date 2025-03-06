import React, { useMemo } from 'react';
import { TwScrollBtn } from '@/components/modules/football/quickviewColumn/QuickViewStandingsTab';
import { TwDesktopView } from '@/components/modules/football/tw-components';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import ArrowRight from '/public/svg/arrow-right.svg';
import LeftArrowSVG from '/public/svg/left-arrow.svg';
import { generateUniqueId } from '@/utils';

interface ITabsSlider {
  children?: React.ReactNode;
  id?: string;
  ref?: any;
  center?: boolean;
 
}

const TabsSlider: React.FC<ITabsSlider> = ({ children, id, center }) => {
  
  const uniqueIdRef = useRef(id || generateUniqueId('scroll-container'));
  const containerRef = useRef<HTMLDivElement>(null);

  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [isScrollBar, setIsScrollBar] = useState<boolean>(false);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(uniqueIdRef.current);
    if (!container) return;

    const scrollStep = container.clientWidth / 2; // Scroll half container width
    const newScrollLeft =
      direction === 'left'
        ? container.scrollLeft - scrollStep
        : container.scrollLeft + scrollStep;

    // Smooth scroll animation
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });

    // Only update scrollLeft after animation completes
    container.addEventListener('scrollend', () => {
      setScrollLeft(container.scrollLeft);
    }, { once: true });
  };

  const canScrollRight = containerRef.current
    ? scrollLeft <
      containerRef.current.scrollWidth - containerRef.current.clientWidth - 1
    : false;

  const canScrollLeft = useMemo(() => scrollLeft > 0, [scrollLeft]);

  return (
    <div
      className='relative h-full w-full  overflow-hidden whitespace-nowrap scrollbar lg:max-w-[100vw] bg-transparent'
      test-id='match-form'
    >
      <TwDesktopView>
        {canScrollLeft && (
          <TwScrollBtn
            className={clsx('hover:!flex left-0', {
              '!hidden': !isScrollBar,
              flex: isScrollBar,
              'top-[calc(50%-0.625rem)]': center,
            })}
          >
            <button
              test-id='btn-draw-left'
              onClick={() => handleScroll('left')}
              className='p-1 text-dark-draw'
            >
              <LeftArrowSVG className="text-dark-text dark:text-white" />
            </button>
          </TwScrollBtn>
        )}
      </TwDesktopView>
      <div
        className={`flex h-full w-full gap-x-3 overflow-x-auto no-scrollbar `}
        onMouseEnter={() => setIsScrollBar(true)}
        onMouseLeave={() => setIsScrollBar(false)}
        ref={containerRef}
        id={uniqueIdRef.current}
      >
        {children}
      </div>
      <TwDesktopView>
        {canScrollRight && (
          <TwScrollBtn
            className={clsx('right-0 hover:!flex', {
              '!hidden': !isScrollBar,
              flex: isScrollBar,
              'top-[calc(50%-0.625rem)]': center,
            })}
          >
            <button
              className='p-1 text-dark-draw'
              onClick={() => handleScroll('right')}
            >
              <ArrowRight className="text-dark-text dark:text-white" />
            </button>
          </TwScrollBtn>
        )}
      </TwDesktopView>
    </div>
  );
};

export default React.memo(TabsSlider, (prevProps, nextProps) => {
  return (
    prevProps?.id === nextProps.id && prevProps?.children === nextProps.children
  );
});
