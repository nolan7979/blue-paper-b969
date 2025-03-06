import { useEffect, useRef } from 'react';

export const AdHorizontalComponent: React.FC = () => {
  const adInitialized = useRef(false);

  useEffect(() => {
    if (!adInitialized.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adInitialized.current = true;
      } catch (err) {
        console.error('Error loading AdSense:', err);
      }
    }
  }, []);

  // useEffect(() => {
  //   const observer = new MutationObserver((mutations) => {
  //     mutations.forEach((mutation) => {
  //       if (
  //         mutation.type === 'attributes' &&
  //         mutation.attributeName === 'style'
  //       ) {
  //         const adHorizontalComponent = document.getElementById(
  //           'ad-horizontal-component'
  //         );
  //         if (adHorizontalComponent) {
  //           adHorizontalComponent.style.setProperty(
  //             'height',
  //             '90px',
  //             'important'
  //           );
  //         }
  //       }
  //     });
  //   });

  //   const adHorizontalComponent = document.getElementById(
  //     'ad-horizontal-component'
  //   );
  //   if (adHorizontalComponent) {
  //     observer.observe(adHorizontalComponent, {
  //       attributes: true,
  //       attributeFilter: ['style'],
  //     });
  //     adHorizontalComponent.style.setProperty('height', '90px', 'important');
  //   }

  //   return () => observer.disconnect();
  // }, []);

  return (
    <div
      className=''
      id='ad-horizontal-component'
      suppressHydrationWarning
    >
      {/* <script
        async
        src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8028766040172456'
        crossOrigin='anonymous'
        suppressHydrationWarning
      /> */}
      <ins
        className='adsbygoogle'
        style={{
          display: 'inline-block',
          width: '100%',
          maxWidth: '728px',
          height: 'auto',
          minHeight: '50px',
          aspectRatio: '728/50',
        }}
        data-ad-client='ca-pub-8028766040172456'
        data-ad-slot='2263669472'
        suppressHydrationWarning
      />
    </div>
  );
};

export default AdHorizontalComponent;
