import Avatar from '@/components/common/Avatar';
import { LINEUPS_TAB } from '@/constant/common';
import { useCallback, useMemo } from 'react';
import EmptySVG from '/public/svg/empty.svg';

interface RenderOptionalProps {
  activeTab: string;
  birthday?: number;
  height?: number;
  country?: string;
  teamId?: string;
  isNationality?: boolean;
  getAgeFromTimestamp: (timestamp: number) => number; // Assuming getAgeFromTimestamp is a function
}

const useRenderOptional = ({
  activeTab,
  birthday,
  height,
  country,
  teamId,
  isNationality,
  getAgeFromTimestamp,
}: RenderOptionalProps) => {
  const renderOptional = useCallback(() => {
    switch (activeTab) {
      case LINEUPS_TAB.age:
        return birthday === 0 ? (
          <div className='h-6 w-6' test-id='no-data-birthday'>
            <EmptySVG className='h-full w-full dark:text-white' />
          </div>
        ) : (
          <OptionTags testId='line-up-birthday'>{getAgeFromTimestamp(birthday as number)}</OptionTags>
        );
      case LINEUPS_TAB.height:
        return height === 0 ? (
          <div className='h-6 w-6' test-id='no-data-height' >
            <EmptySVG className='h-full w-full dark:text-white' />
          </div>
        ) : (
          <OptionTags testId='line-up-height'>{height}</OptionTags>
        );
      case LINEUPS_TAB.nationality:
        if (!country || !teamId) {
          return (
            <div className='h-6 w-6' test-id='no-data-nationality'>
              <EmptySVG className='h-full w-full dark:text-white' />
            </div>
          );
        }
        return (
          <div test-id='line-up-nationality'>
          <Avatar
            id={isNationality ? teamId : country}
            type={isNationality ? 'team' : 'country'}
            height={24}
            width={24}
            rounded={false}
            isBackground={false}
          />
          </div>
        );
      default:
        return null;
    }
  }, [
    activeTab,
    birthday,
    height,
    country,
    teamId,
    isNationality,
    getAgeFromTimestamp,
  ]);

  return useMemo(() => renderOptional(), [renderOptional]);
};

export default useRenderOptional;

export const OptionTags: React.FC<{ children?: React.ReactNode, testId?: string }> = ({
  children,testId
}) => {
  return (
    <div className='flex items-center justify-between rounded-md bg-white px-0.5'>
      <span className='min-w-[20px] text-center text-csm font-medium dark:text-black' test-id={testId}>
        {children}
      </span>
    </div>
  );
};
