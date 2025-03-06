import { firebaseApp } from '@/service/firebase';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { useCallback, useEffect, useState } from 'react';

const useFcmToken = () => {
  const [token, setToken] = useState('');
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState('');

  const retrieveToken = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        // Check if permission is already granted
        const permission = await Notification.requestPermission();
        setNotificationPermissionStatus(permission);

        if (permission !== 'granted') {
          console.log('Notification permission not granted');
          return;
        }

        const messaging = getMessaging(firebaseApp);

        // Retrieve current FCM token
        const currentToken = await getToken(messaging, {
          vapidKey: 'BOLOwNap9cXAQrT1UcJoNJ73z7nMV1IZ17X_mcAdKKBdYYe185rTzikQy5wf4qsOpTZMRig3niG14B9mtVYAeoA',
        });

        if (currentToken) {
          setToken(currentToken);
          localStorage.setItem('fcmToken', currentToken);
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      } else {
        console.log('Service workers are not supported in this browser.');
      }
    } catch (error) {
      console.error('An error occurred while retrieving the FCM token:', error);
    }
  }, []);

  const listenForMessages = useCallback(() => {
    if (typeof window !== 'undefined') {
      const messaging = getMessaging(firebaseApp);

      onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        // Handle foreground messages here
      });
    }
  }, []);


  useEffect(() => {
    retrieveToken();
    listenForMessages()
  }, [retrieveToken, listenForMessages]);

  return { fcmToken: token, notificationPermissionStatus };
};

export default useFcmToken;
