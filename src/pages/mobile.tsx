import { GetStaticPropsContext } from 'next';
import Image from 'next/image';

import { BasicLayout } from '@/components/layout';

import Seo from '@/components/Seo';
import { CONTENT_SLUG } from '@/constant/contentStatic';
import useTrans from '@/hooks/useTrans';
import { getContentStaticPage } from '@/lib/getContentStatic';
import { getMetaContent } from '@/utils';
import AppStoreSVG from '~/svg/app-store.svg';
import GoogleStoreSVG from '~/svg/google-store.svg';
import React from 'react';
const IMAGE_CDN_PATH =
  process.env.NEXT_PUBLIC_CDN_URL || 'https://cdn.uniscore.com';
function Mobile({ data }: { data: any }) {
  const i18n = useTrans();
  

  return (
    <React.Fragment>
      <Seo {...getMetaContent(data)} />
      <div className='bg-dark-blue h-full'>
        <div className=' layout flex min-h-full flex-col-reverse items-center justify-center overflow-hidden pt-3 lg:flex-row lg:gap-14'>
          <div className='relative top-12  w-full   '>
            <img loading='lazy' src={`${IMAGE_CDN_PATH}/public/images/mobile-download/bg-mobile.png`} alt='Picture of the author'/>
          </div>
          <div className='flex w-full flex-col gap-9 px-2.5 py-6 lg:gap-10'>
            <div className='relative h-[123px] w-[123px]'>
              <Image
                fill
                src='/images/mobile-download/logo-mobile.png'
                alt='logo'
              />
            </div>
            <div>
              <h1 className='bg-title-gradient'>
                LIVE SCORE <br /> REAL TIME
              </h1>
            </div>
            {/* <Logo /> */}
            <div className='flex gap-4'>
              <div className='h-16 w-full max-w-[234px]'>
                <a
                  className='h-auto'
                  href='https://play.google.com/store/apps/details?id=com.unity.uniscore'
                >
                  <GoogleStoreSVG className='h-full w-full' />
                </a>
              </div>
              <div className='h-16 w-full max-w-[234px]'>
                <a
                  className='h-auto'
                  href='https://apps.apple.com/us/app/uniscore/id6475382945'
                >
                  <AppStoreSVG className='h-full w-full' />
                </a>
              </div>
            </div>
            <div>
              <h6 className='text-lg text-white'>
                {i18n.mobileDownload.haveApp}
              </h6>
              <a
                href='https://play.google.com/store/apps/details?id=com.unity.uniscore'
                className='text-white underline'
              >
                {i18n.mobileDownload.downloadHere}
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* <div className='hidden bg-white dark:bg-[#222] lg:block'>
        <div className='layout py-10'>
          <div className='text-black dark:text-white'>
            <h6 className='text-3xl font-bold'>Match Live</h6>
            <p className='text-lg'>
              No network letency with live animation like on the scene of the
              match
            </p>
          </div>
          <div className='flex w-full justify-center'>
            <Image
              unoptimized={true}
              src='/images/mobile-download/session1.png'
              width={900}
              height={500}
              alt='Picture of the author'
            />
          </div>
        </div>
      </div>
      <div className='hidden bg-[#ECEFF2] dark:bg-[#121212] lg:block'>
        <div className='layout py-10'>
          <div className='text-black dark:text-white'>
            <h6 className='text-3xl font-bold'>Live Scores</h6>
            <p className='text-lg'>
              You can get live scores about all the football matches for all the
              leagues and competitions
            </p>
          </div>
          <div className='flex w-full justify-center'>
            <Image
              unoptimized={true}
              src='/images/mobile-download/session2.png'
              width={700}
              height={500}
              alt='Picture of the author'
            />
          </div>
        </div>
      </div> */}
    </React.Fragment>
  );
}
Mobile.Layout = BasicLayout;
Mobile.getInitialProps = async (context: GetStaticPropsContext) => {
  const { locale } = context;
  const data = await getContentStaticPage(
    CONTENT_SLUG[locale as 'vi' | 'en'].DOWNLOAD,
    locale
  );
  try {
    return {
      data: data || {},
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
export default Mobile;
