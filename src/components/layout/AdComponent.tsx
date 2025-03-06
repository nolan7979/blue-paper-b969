import { useEffect, useRef } from 'react';

export const AdComponent: React.FC = () => {
  const adRef = useRef<any>(null);

  useEffect(() => {
    try {
      if (adRef.current && !adRef.current.hasAttribute('data-ad-rendered')) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adRef.current.setAttribute('data-ad-rendered', 'true');
      }
    } catch (err) {
      console.error('Error loading AdSense:', err);
    }
  }, []);

  return (
    <>
      {/* <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8028766040172456"
        crossOrigin="anonymous"
        suppressHydrationWarning
      /> */}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'inline-block', width: '160px', height: '600px' }}
        data-ad-client="ca-pub-8028766040172456"
        data-ad-slot="5105455236"
        suppressHydrationWarning
      />
    </>
  );
};

export default AdComponent;