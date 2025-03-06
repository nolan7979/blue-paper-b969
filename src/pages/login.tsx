import { LOCAL_STORAGE } from '@/constant/common';
import { getItem, removeItem } from '@/utils/localStorageUtils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import NewWindow from 'react-new-window';

import { BasicLayout } from '@/components/layout';

import Seo from '@/components/Seo';
import { useWindowSize } from '@/hooks';
import useTrans from '@/hooks/useTrans';
import GoogleSVG from '/public/images/social-media/google.svg';

const SignInPage = () => {
  const router = useRouter();
  const [popupGoogle, setPopUpGoogle] = useState(false);
  const [popupFB, setPopUpFB] = useState(false);
  const { data: session, status } = useSession();
  const i18n = useTrans();
  const { width } = useWindowSize();
  // use router

  if (session) {
    const callbackUrl = getItem(LOCAL_STORAGE.callbackParams) || '/';
    setTimeout(() => removeItem(LOCAL_STORAGE.callbackParams), 500);
    if (width < 1024) {
      window.location.href = callbackUrl;
    } else {
      router.push(callbackUrl);
    }
  }

  return (
    <div className=''>
      <Seo templateTitle={i18n.user.login} description={i18n.user.login} />
      {status === 'loading' ? (
        <p>loading session...</p>
      ) : session ? (
        <div className='bddev flex flex-col items-center gap-2 p-2'>
          {/* <button
            className='bddev hover:bg-primary-300 p-2'
            onClick={() => signOut()}
          >
            Logout
          </button>
          <Image
            src={session.user?.image || '/images/avatars/default.webp'}
            alt='Avatar'
            width={50}
            height={50}
          />
          <span>{session.user?.name}</span> */}
        </div>
      ) : (
        // <div className=' my-auto flex flex-col items-center justify-between gap-2'>
        //   <button
        //     className=' hover:bg-primary-300 p-2'
        //     onClick={async () => {
        //       await setPopUpGoogle(false); // looks like some bug of new-react-window -> need this trick
        //       setPopUpGoogle(true);
        //     }}
        //   >
        //     Login with Google
        //   </button>
        //   <button
        //     className='bddev hover:bg-primary-300 p-2'
        //     onClick={async () => {
        //       await setPopUpFB(false); // looks like some bug of new-react-window -> need this trick
        //       setPopUpFB(true);
        //     }}
        //   >
        //     Login with Facebook
        //   </button>
        // </div>

        <div className=' layout my-10 flex place-content-center items-center'>
          <div className=' mx-auto w-9/12 rounded-xl bg-white  p-4 dark:bg-dark-match lg:w-5/12 '>
            <div className=' space-y-1 py-6 text-center'>
              <div className=' text-xl font-bold uppercase text-logo-blue'>
                {/* {t('common:user.login_to')} UNISCORE */}
                {i18n.user.login_to} UNISCORE
              </div>
              {/* <div className='text-sm'>{t('common:user.signup_or_signin')}</div> */}
            </div>

            <div className=''>
              <div className=' mx-auto w-11/12 space-y-2 text-sm sm:w-8/12'>
                <div
                  className=' border-dl item-hover flex cursor-pointer items-center gap-2 px-4 py-2 dark:bg-dark-hl-1'
                  onClick={async () => {
                    await setPopUpGoogle(false); // looks like some bug of new-react-window -> need this trick
                    setPopUpGoogle(true);
                  }}
                >
                  <GoogleSVG className='h-5 w-5' />
                  <span className='flex-1 text-center'>
                    {/* <span>{t('common:user.login_with')} Google</span> */}
                    <span>{i18n.user.login_with} Google</span>
                  </span>
                </div>
                {/* <div
                  className=' border-dl item-hover flex cursor-pointer items-center gap-2 px-4 py-2 dark:bg-dark-hl-1'
                  onClick={async () => {
                    await setPopUpFB(false); // looks like some bug of new-react-window -> need this trick
                    setPopUpFB(true);
                  }}
                >
                  <FacebookSVG className='h-5 w-5' />
                  <span className='flex-1 text-center'>
                    <span>{t('common:user.login_to')} Facebook</span>
                  </span>
                </div> */}

                {/* <div
                  className=' border-dl item-hover flex cursor-pointer items-center gap-2 px-4 py-2 dark:bg-dark-hl-1'
                  onClick={async () => {
                    await setPopUpGoogle(false); // looks like some bug of new-react-window -> need this trick
                    setPopUpGoogle(true);
                  }}
                >
                  <AppleSVG className='h-5 w-5' />
                  <span className='flex-1 text-center'>
                    <span>{t('common:user.login_to')} Apple</span>
                  </span>
                </div> */}
              </div>
            </div>
            <div className='py-6 '>
              <div className='text-center text-sm'>
                <div
                  dangerouslySetInnerHTML={{
                    __html: i18n.signIn.terms,
                  }}
                ></div>
              </div>
            </div>

            {/* <div className='flex flex-col items-center gap-2 p-2'>
              <button
                className='bddev hover:bg-primary-300 p-2'
                onClick={() => signOut()}
              >
                Logout
              </button>
              
            </div> */}
          </div>
        </div>
      )}

      {!session && popupGoogle ? (
        <NewWindow
          url='/auth/google-signin-popup'
        // onUnload={() => setPopUp(false)}  // doens't work
        />
      ) : null}

      {!session && popupFB ? (
        <NewWindow url='/auth/facebook-signin-popup' />
      ) : null}
    </div>
  );
};

SignInPage.Layout = BasicLayout;
export default SignInPage;
