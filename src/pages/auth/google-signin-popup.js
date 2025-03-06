import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getItem } from '@/utils/localStorageUtils';
import { LOCAL_STORAGE } from '@/constant/common';

const GoogleSignInPopup = () => {
  const { data: session, status, update } = useSession();
  const [verificationState, setVerificationState] = useState(null);
  const isProd = process.env.NEXT_PUBLIC_NODE_ENVIRONMENT === 'production';

  useEffect(() => {
    if (window.location.href.includes('closePopup=true')) {
      if (window.opener) {
        window.opener.postMessage({
          type: 'AUTH_CANCELLED',
          message: 'User cancelled authentication'
        }, window.location.origin);
      }
      window.close();
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    if (errorParam) {
      if (window.opener) {
        // Gửi thông báo lỗi về window chính
        window.opener.postMessage({
          type: 'AUTH_ERROR',
          error: errorParam
        }, window.location.origin);
        window.close();
      } else {
        // Nếu không có window.opener, chuyển về trang chủ
        window.location.href = '/';
      }
      return;
    }
    if (window.location.href.includes('closePopup=true')) {
      window.close();
      if (window.opener) {
        window.opener.postMessage('AUTH_CANCELLED', window.location.origin);
      }
    }
    const verifyToken = async () => {
      if (session && session.idToken && !verificationState) {
        try {
          await logToServer('Verifying token...'); // Log to server
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-access-token`,
            {
              accessToken: session.idToken,
              provider: 'google',
            }
          );
          const data = response.data;
          if (data.success) {
            setVerificationState({
              id: data.data.id,
              name: data.data.displayName,
              image: data.data.avatar,
              role: data.data.role,
              accessToken: data.data.accessToken,
            });
          } else {
            await logToServer('Token verification failed.');
            signOut(); // Sign out if verification fails
          }
        } catch (error) {
          signOut(); // Sign out if there's an error
        }
      } else if (status !== 'loading' && !session) {
        const currentDomain = window.location.hostname;
        const callbackParams = getItem(LOCAL_STORAGE.callbackUrl) || '';
        const callbackUrl = isProd
          ? currentDomain.includes('uniscore.com')
            ? `https://uniscore.com/auth/google-signin-popup${callbackParams}`
            : `https://uniscore.vn/auth/google-signin-popup${callbackParams}`
          : `${window.location.href}${callbackParams}`;

        signIn('google', { callbackUrl: callbackUrl });
      }
    };
    verifyToken();
  }, [session, status, verificationState]);

  useEffect(() => {
    if (verificationState) {
      update({
        ...session,
        user: verificationState,
      });
      window.close(); // Close the popup after verification and session update
    }
  }, [verificationState, update, session]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        left: 0,
        top: 0,
        background: 'white',
      }}
    ></div>
  );
};

export default GoogleSignInPopup;
