import { useRouter } from 'next/router';
import PaperPlanTiltSVG from 'public/svg/paper-plane-tilt.svg';
import { ChangeEvent, memo, useCallback } from 'react';
import useTrans from '@/hooks/useTrans';
import { useWindowSize } from '@/hooks';

type InputMessageProps = {
  value: string;
  disableButton: boolean;
  disableTimer: number;
  isNavigatedToLogin: boolean;
  setValue: (value: string) => void;
  onKeyDown: (e: any) => void;
  sendMessage: () => void;
};

export const InputMessage: React.FC<InputMessageProps> = memo(({
  value,
  disableButton,
  disableTimer,
  isNavigatedToLogin,
  setValue,
  sendMessage,
  onKeyDown,
}) => {
  const i18n = useTrans();
  const { push, locale } = useRouter();
  const { width } = useWindowSize();
  
  const checkSession = (e: React.FocusEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isNavigatedToLogin) {
      push('/login');
    }
  };

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isNavigatedToLogin) setValue(e.target.value);
  };
  return (
    <div
      className='sticky bottom-0 bg-white p-3 dark:bg-dark-gray'
      onFocus={checkSession}
    >
      <textarea
        placeholder={`${i18n.common.type_a_message}...`}
        className='h-11 w-full !rounded-md border !border-dark-time-tennis !bg-transparent p-2 !pr-8'
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        maxLength={127}
      />
      <button
        onClick={sendMessage}
        className='absolute bottom-3 right-3 top-3 w-fit bg-transparent p-2 text-white outline-none hover:opacity-70'
      >
        {!disableButton && <PaperPlanTiltSVG className='h-4 w-4' />}
        {disableButton && (
          <div className='h-5 w-5 rounded-full bg-red-600 text-center text-mxs font-semibold leading-5 text-white'>
            {disableTimer}
          </div>
        )}
      </button>
    </div>
  );
});
