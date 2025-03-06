import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import UserIcon from '/public/svg/user.svg';
import { useRouter } from 'next/router';
import { setItem } from '@/utils/localStorageUtils';
import { LOCAL_STORAGE } from '@/constant/common';

export const LoginButton = () => {
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();

  const router = useRouter();
  const { locale, asPath } = router;
  

  const handleSaveUrl = () => {
    const callbackParams = locale === 'en' ? asPath : `/${locale}${asPath}`;
    setItem(LOCAL_STORAGE.callbackParams, callbackParams);
    router.push('/login');
  };

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        aria-label='skeleton login button'
        className='h-9 w-9 cursor-pointer rounded-full bg-dark-icon text-dark-default hover:brightness-125'
      >
        <div className='h-5 w-5'></div>
      </div>
    ); // TODO use skeleton if layout shift
  }

  return session ? (
    <div className='flex items-center w-9 h-9'>
      {session.user?.image ? (
        <Image
          className='rounded-full'
          src={session.user?.image || ''}
          alt='User Avatar'
          width={36}
          height={36}
          aria-label='User Avatar'
        />
      ) : (
        <Image
          unoptimized={true}
          src='/images/football/players/unknown1.webp'
          alt='unknown1'
          loading='lazy'
          width={36}
          height={36}
          className='rounded-full'
        />
      )}
    </div>
  ) : (
    <div
      onClick={handleSaveUrl}
      aria-label='Login'
      className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-high-light text-dark-default hover:brightness-125'
      style={{backgroundColor: "rgb(11, 86, 162)"}}
    >
      <UserIcon className='h-4 w-4' />
    </div>
  );
};
