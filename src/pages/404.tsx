import * as React from 'react';
import { RxDoubleArrowLeft } from 'react-icons/rx';

import CustomLink from '@/components/common/CustomizeLink';
import Seo from '@/components/Seo';
import useTrans from '@/hooks/useTrans';

export default function NotFoundPage() {
  // console.log("⚠️ RENDERING 404.tsx - Not Found Page")
  const i18n = useTrans()
  return (
    <div className='layout'>
      <Seo templateTitle='Not Found' />
      <aside className=''>
        <div className='flex flex-col items-center justify-center text-center'>
          <h1 className='mt-8 text-2xl md:text-2xl'>
            {i18n.page404.pageNotFound}
          </h1>
          <CustomLink
            className='mt-4 rounded-md bg-dark-dark-blue px-4 py-2 md:text-lg'
            href='/'
            target='_parent'
          >
            <button className='space-x-2 text-logo-yellow'>
              <RxDoubleArrowLeft className='inline-block'></RxDoubleArrowLeft>
              <span className=''>{i18n.page404.backUniscore}</span>
            </button>
          </CustomLink>
        </div>
      </aside>
    </div>
  );
}
