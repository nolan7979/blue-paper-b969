import clsx from 'clsx';
import { TwButtonIcon } from '@/components/buttons/IconButton';
import { useSuggestionsDownload } from '@/stores/menu-store';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useMemo } from 'react';
import CloseSVG from '/public/svg/close-x.svg';
import useTrans from '@/hooks/useTrans';
import { useArabicLayout } from '@/hooks';
import { getItem } from '@/utils/localStorageUtils';
import { IMAGE_CDN_PATH, LOCAL_STORAGE } from '@/constant/common';

interface Urls {
  ios: string;
  android: string;
}

const checkMobileOperatingSystem = (): string => {
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;
  let os = 'unknown';
  // iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    os = 'ios';
  }

  // Android detection
  if (/android/i.test(userAgent)) {
    os = 'android';
  }
  return os;
};

const SuggestionsDownload: React.FC = () => {
  const i18n = useTrans();
  const isArabicLayout = useArabicLayout();

  const { isDisplayed, handleClose } = useSuggestionsDownload();
  const os: 'ios' | 'android' =
    typeof window !== 'undefined'
      ? (checkMobileOperatingSystem() as 'ios' | 'android')
      : 'ios';

  const url: Urls = {
    ios: 'https://apps.apple.com/us/app/uniscore/id6475382945',
    android: 'https://play.google.com/store/apps/details?id=com.unity.uniscore',
  };

  const onDownload = () => {
    handleClose();
    window.open(url[os], '_blank');
  };

  const renderNotDisplayed = useMemo(() => {
    return isDisplayed ? (
      <motion.div
        initial={{ y: 0, height: 0, opacity: 0 }}
        animate={{ y: 0, height: '100%', opacity: 1 }}
        transition={{ ease: 'easeInOut', duration: 0.75 }}
        className='lg:hidden'
      >
        <div
          className={clsx(
            'sticky top-0 z-10 flex items-center justify-between',
            {
              'pr-2.5': !isArabicLayout,
              'pl-2.5': isArabicLayout,
            }
          )}
        >
          <div className='bg-primary flex items-center gap-4 p-2'>
            <TwButtonIcon onClick={handleClose} icon={<CloseSVG />} className="text-white" />
            <div className='relative h-16 w-16'>
              <img
                alt='logo'
                src={`${IMAGE_CDN_PATH}/public/images/mobile-download/appLogo.png`}
                width={64}
                height={64}
                loading='lazy'
                className='w-full h-auto'
              />
            </div>
            <div className='flex flex-col space-y-0'>
              <h1 className='m-0 p-0 text-sm font-medium text-white'>Uniscore</h1>
              <span className='text-msm ' style={{color: 'rgb(149, 153, 157)'}}>
                {i18n.topBanner.content}
              </span>
            </div>
          </div>
          <button
            onClick={onDownload}
            className='leading h-min rounded-full bg-dark-button text-white px-3.5 py-1.5 text-[0.938rem] font-semibold'
          >
            {i18n.topBanner.open}
          </button>
        </div>
      </motion.div>
    ) : null;
  }, [isDisplayed, i18n.language]);

  return renderNotDisplayed;
};
export default SuggestionsDownload;
