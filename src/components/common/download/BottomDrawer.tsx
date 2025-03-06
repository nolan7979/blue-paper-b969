// components/BottomDrawer.js
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

import { getUserAgent } from '@/utils/userAgent';
import MobileDownload from '@/components/common/download/MobileDownload';

// const MobileDownload = dynamic(() => import('../download/MobileDownload'), {
//   ssr: false,
// });

const BottomDrawer = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userAgent, setUserAgent] = useState<any>(null);

  useEffect(() => {
    setUserAgent(getUserAgent());

    const check = localStorage.getItem('showDrawer');
    if (!check) {
      const timer = setTimeout(() => {
        setShowDrawer(true);
        localStorage.setItem('showDrawer', 'true');
      }, 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, []);

  const isAndroid = userAgent && userAgent.name === 'Android';
  const isIos = userAgent && userAgent.name === 'iOS';

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-30 transform bg-[#333333] transition-transform duration-300 lg:hidden ${
        showDrawer ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {isAndroid ? (
        <MobileDownload
          type='android'
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
        />
      ) : isIos ? (
        <MobileDownload
          type='ios'
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default BottomDrawer;
