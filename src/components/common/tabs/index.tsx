import {
  TwCard,
  TwFilterBtn,
  TwTitle,
} from '@/components/modules/football/tw-components';
import { Divider } from '@/components/modules/football/tw-components/TwPlayer';
import clsx from 'clsx';
import { useState } from 'react';

export interface TabProps {
  tabs: { title: string | React.ReactNode; content: React.ReactNode }[];
  typeTitle?: 'button' | 'text';
  isSticky?: boolean;
  type?: 'button' | 'default';
  isDivider?: boolean;
}
const Tabs: React.FC<TabProps> = ({
  tabs,
  typeTitle = 'button',
  isSticky,
  isDivider,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <div
        className={clsx(
          'flex gap-x-8',
          typeTitle == 'button'
            ? 'justify-center'
            : 'justify-start border-b border-dark-card dark:bg-dark-sub-bg-main',
          isSticky ? 'sticky top-14 z-10' : ''
        )}
      >
        <div className='layout no-scrollbar flex w-full gap-x-4 overflow-scroll px-[15px]'>
          {tabs.map(
            (tab, index) =>
              (typeTitle == 'button' && (
                <TwFilterBtn
                  key={index}
                  className={clsx(
                    'w-1/3 !rounded-[100px] border ',
                    activeTab !== index ? 'border-[#3D3D3D]' : 'border-all-blue'
                  )}
                  onClick={() => setActiveTab(index)}
                  isActive={activeTab === index}
                >
                  {tab.title}
                </TwFilterBtn>
              )) || (
                <TwTitleTab
                  key={index}
                  className='text-xs'
                  onClick={() => setActiveTab(index)}
                  isActive={activeTab === index}
                >
                  {tab.title}
                </TwTitleTab>
              )
          )}
        </div>
      </div>
      {isDivider && <Divider height='3' />}
      <div className=''>{tabs[activeTab].content}</div>
    </>
  );
};

export default Tabs;

export const TwTitleTab = ({
  children,
  onClick,
  className,
  isActive,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
}) => {
  return (
    <span
      className={clsx(
        className,
        'py-[15px] font-medium uppercase transition-all',
        isActive
          ? 'border-b border-b-all-blue text-all-blue'
          : 'text-light-default dark:text-dark-text'
      )}
      onClick={onClick}
    >
      {children}
    </span>
  );
};
