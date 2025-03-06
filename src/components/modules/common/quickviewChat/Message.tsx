import { pickChartColorOfAvatar } from '@/utils';
import { getChatLevel } from '@/utils/chatUtils';
import { memo, useMemo } from 'react';

type MessageProps = {
  fullName: string;
  message: string;
  level: number;
  version: string;
  onReply: (fullname: string) => void;
  // onReply: (event:  React.MouseEvent<HTMLDivElement, MouseEvent> ) => void;
};

export const Message: React.FC<MessageProps> = memo(
  ({ fullName, message, level, version, onReply }) => {
    const { chart, color } = pickChartColorOfAvatar(fullName);
    const levelUrl = useMemo(
      () => getChatLevel(level, version),
      [level, version]
    );

    return (
      <div
        className='cursor-pointer break-words '
        test-id='chatName'
        onClick={() => onReply(fullName)}
      >
        <div
          test-id='icon-avatar'
          style={{ background: color }}
          className='inline-block h-5 w-5 rounded-full text-center text-mxs font-semibold leading-5 text-black/50 dark:text-white'
        >
          {chart}
        </div>
        <span
          className='ml-2 w-fit whitespace-nowrap font-primary font-medium leading-5 text-black/50 dark:text-white'
          test-id='fullNameLbl'
        >
          {fullName}
        </span>
        <span className='mx-1'>
          <img
            src={levelUrl}
            alt='level'
            loading='lazy'
            className='inline w-8'
          />
        </span>
        {message}
      </div>
    );
  }
);
