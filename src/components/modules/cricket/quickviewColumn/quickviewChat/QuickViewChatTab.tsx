import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  InputMessage,
  Message,
} from '@/components/modules/common/quickviewChat';
import {
  SendMessagePayload,
  useGetAllMessageOfMatch,
  useSendMessage,
} from '@/hooks/useChat';
import { parseMessage } from '@/utils/chatUtils';
import { Message as IMessage } from '@/models/interface';
import { LOCAL_STORAGE, SPORT } from '@/constant/common';
import useSocketChatMqtt from '@/hooks/useChat/useSocketChat';
import { setItem } from '@/utils/localStorageUtils';

export const QuickViewChatTab = () => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<string>('');
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [disableTimer, setDisableTimer] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [replyName, setReplyName] = useState<string>('');
  const { locale, asPath } = useRouter();

  const [allMessages, setAllMessages] = useState<IMessage[]>([]);
  const { data: session } = useSession();
  const accessToken =
    (session as unknown as { accessToken: string })?.accessToken || '';
  const sendMessageMutation = useSendMessage(accessToken);
  const { data } = useGetAllMessageOfMatch('football-global');

  useEffect(() => {
    if (data) {
      const messages = parseMessage(data)?.reverse();
      setAllMessages(messages);
    }
  }, [data]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [allMessages]);

  useEffect(() => {
    if (disableButton) {
      setTimeout(() => {
        setDisableButton(false);
      }, 5000);
    }
    const intervalId = setInterval(() => {
      if (disableTimer > 0) {
        setDisableTimer((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [disableButton]);

  if (!session) {
    const callbackParams = locale === 'en' ? asPath : `/${locale}${asPath}`;
    setItem(LOCAL_STORAGE.callbackParams, callbackParams);
  }

  const sendMessage = useCallback(async () => {
    if (!value || disableButton || isLoading) return;
    const newMsg: SendMessagePayload = {
      matchId: 'global',
      msg: value.trim(),
      sport: SPORT.FOOTBALL,
    };
    setIsLoading(true);
    try {
      const code = await sendMessageMutation.mutateAsync(newMsg);

      if (code === 1) {
        handleSuccessfulMessageSend();
      } else if (code === 190) {
        setItem(LOCAL_STORAGE.callbackParams, `/${locale}${asPath}`);
        await signOut({ callbackUrl: `/${locale}/login` });
      } else {
        console.error('Error sending message:', code);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  },[value, disableButton, isLoading]);

  const handleSuccessfulMessageSend = () => {
    setValue('');
    setDisableButton(true);
    setDisableTimer(5);
  };

  const onKeyDown = useCallback(
    (e: any) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  useEffect(() => {
    if (replyName) {
      setValue(`@${replyName} : `);
    }
  }, [replyName]);
  
  useSocketChatMqtt('global', (newMessage) => {
    setAllMessages((prevMessages) => {
      return [...prevMessages, newMessage];
    });
  });
  const replyNameEvent = useCallback((fullname:string) => setReplyName(fullname),[replyName])
  return (
    <div className=''>
      <div
        className='flex h-96 flex-col gap-2 overflow-scroll px-2'
        ref={messagesContainerRef}
      >
        {/* message */}
        {allMessages.map((message, index) => (
          <Message
            level={message?.user?.level}
            version={message?.version || 'v1'}
            key={index}
            fullName={message?.user?.displayName}
            message={message.msg}
            onReply={replyNameEvent}
          />
        ))}
        <span ref={bottomRef} />
      </div>
      <InputMessage
        isNavigatedToLogin={!session}
        value={value}
        disableButton={disableButton}
        disableTimer={disableTimer}
        setValue={setValue}
        onKeyDown={onKeyDown}
        sendMessage={sendMessage}
      />
    </div>
  );
}


