import { useScrollVisible } from '@/stores/scroll-visible';
import { Tab } from '@headlessui/react';
import parse from 'html-react-parser';
import { useTheme } from 'next-themes';
import React, { useEffect, useState, memo, useRef } from 'react';

const Tabs = memo(function Tabs({ data }: { data: any }) {
  const [categories, setCategories] = useState<any>({});
  const targetRef = useRef<HTMLDivElement>(null);
  const setTargetRef = useScrollVisible((state) => state.setTargetRef);
  useEffect(() => {
    if (data?.content?.rendered?.length > 0) {
      const parsedData = parse(data?.content?.rendered || '');

      // Function to filter elements before, inside, and after 'toc_container'
      const filterContent = (element: any) => {
        if (element.props && element.props?.id === 'toc_container') {
          return 'insideTocContainer';
        } else {
          return 'outSideTocContainer';
        }
      };

      // Separate content based on the structure
      const contentSections = React.Children.toArray(parsedData).reduce(
        (acc: any, child) => {
          const section = filterContent(child);
          acc[section].push(child);
          return acc;
        },
        { insideTocContainer: [], outSideTocContainer: [] }
      );

      const contentInsideTocContainer = contentSections.insideTocContainer[0];

      if (contentInsideTocContainer !== undefined) {
        React.Children.forEach(
          contentInsideTocContainer.props.children[1].props.children,
          (child: any) => {
            if (child.type === 'li') {
              const childrenArray = Array.isArray(child.props.children)
                ? child.props.children
                : [child.props.children];

              const linkElement = childrenArray.find(
                (c: any) => c.type === 'a'
              );
              if (linkElement) {
                const linkText = linkElement.props.children[1];
                const linkId = linkElement.props.href;
                setCategories((prevCategories: any) => ({
                  ...prevCategories,
                  [linkId]: linkText,
                }));
              }
            }
          }
        );
      }
    }
  }, [data]);

  useEffect(() => {
    if (targetRef.current) {
      setTargetRef(targetRef);
    }
  }, [targetRef, setTargetRef]);

  if (data?.content?.rendered?.length > 0) {
    const parsedData = parse(data?.content?.rendered || '');

    const filterContent = (element: any) => {
      if (element.props && element.props?.id === 'toc_container') {
        return 'insideTocContainer';
      } else {
        return 'outSideTocContainer';
      }
    };

    const contentSections = React.Children.toArray(parsedData).reduce(
      (acc: any, child) => {
        const section = filterContent(child);
        acc[section].push(child);
        return acc;
      },
      { insideTocContainer: [], outSideTocContainer: [] }
    );

    const contentOutSideTocContainer = contentSections.outSideTocContainer;
    return (
      <div ref={targetRef} className='layout dark:bg-primary-gradient mt-4 block w-full rounded-md bg-white'>
        
        <Tab.Group>
          <Tab.List className='no-scrollbar flex space-x-1 overflow-scroll rounded-t-xl bg-light-match dark:bg-dark-match'>
            {Object.entries(categories).length > 0 &&
              Object.entries(categories).map(([linkId, linkText]) => (
                <li
                  key={linkId}
                  className='list-none whitespace-nowrap p-4 px-8 !no-underline'
                >
                  <a href={`${linkId}`}>{linkText as React.ReactNode}</a>
                </li>
              ))}
          </Tab.List>
          <div
            className={`overflow-y-scroll scrollbar ${contentOutSideTocContainer.length > 0 ? 'h-[25rem] p-4' : 'h-fit'
              }`}
          >
            <div className='space-y-2 text-sm leading-7'>
              {contentOutSideTocContainer}
            </div>
          </div>
        </Tab.Group>
      </div>
    );
  } else {
    return null;
  }
}, (prevProps, nextProps) => {
  return prevProps?.data === nextProps.data;
});

export default Tabs;
