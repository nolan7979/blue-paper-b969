// /* eslint-disable @next/next/no-img-element */
// // pages/index.js

// import { useRouter } from 'next/router';
// import tw from 'twin.macro';

// import CustomLink from '@/components/common/CustomizeLink';
// import { TwDataSection, TwMainCol } from '@/components/modules/football/tw-components';
// import { MainLayout } from '@/components/layout';
// import Seo from '@/components/Seo';
// import ButtonPagination from '@/components/user/profile/ButtonPagination';
// import Info from '@/components/user/profile/Info';
// import RowHeaderStanding from '@/components/user/profile/RowHeaderStanding';
// import RowStanding from '@/components/user/profile/RowStanding';

// import WarningIcon from '/public/svg/warning-icon.svg';
// import { useAuthStore } from '@/stores/auth-store';

// export const TwTitleFa = tw.div`
//   text-base font-bold uppercase
// `;
// export const TwFilterColFa = tw.div`
//   shrink
//   gap-y-3
//   lg:flex-[3]
// `;
// export const TwButtonFa = tw.button`
// rounded-lg px-3 py-1.5 lg:px-0 lg:text-csm
// `;
// export const TwButtonFa2 = tw.button`
// rounded-lg px-3 py-1.5 lg:text-csm
// `;
// export const TwSportTitleFa = tw.div``;
// export const TwCardFa = tw.div`space-y-6 border-b border-solid border-[#555] p-4`;
// export const TwQuickViewCol = tw.div`
//   w-full
//   lg:w-350
// `;

// const ProfilePage = () => {
//   const { userInfo: session } = useAuthStore();
//   if (session) {
//     return (
//       <>
//         <Seo templateTitle='Favorite' />
//         <TwDataSection className='layout flex-col lg:flex-row'>
//           <TwFilterColFa className='flex-shrink-1 rounded-lg border border-solid border-light-line-stroke-cd bg-white dark:border-dark-stroke dark:bg-light-black'>
//             <Info data={session} />
//             <div className='space-y-2.5 bg-white px-3 py-4 text-csm dark:bg-light-black'>
//               <div className='flex justify-between'>
//                 <p>Join at</p>
//                 <p>20/03/2023</p>
//               </div>
//               <div className='flex justify-between'>
//                 <p>Contribute</p>
//                 <p>0</p>
//               </div>
//               <div className='flex gap-2 text-[11px] lg:justify-between'>
//                 <button className='rounded-lg border border-solid border-logo-blue px-2.5 py-1.5 text-logo-blue'>
//                   <p>Cancle register</p>
//                 </button>
//                 <button className='rounded-lg border border-solid border-logo-blue px-2.5 py-1.5 text-logo-blue'>
//                   <p>Remove your account</p>
//                 </button>
//               </div>
//             </div>
//             <div className='space-y-2 text-csm'>
//               <div>
//                 <div className='flex justify-center bg-[#ECF1F5] py-3 dark:bg-dark-stroke'>
//                   <p className='text-sm font-bold text-logo-blue'>Your love</p>
//                 </div>
//                 <div className='flex flex-col bg-white p-3 dark:bg-light-black'>
//                   <div className='flex justify-between'>
//                     <p>Player</p>
//                     <p>0</p>
//                   </div>
//                   <div className='flex justify-between'>
//                     <p>Team</p>
//                     <p>0</p>
//                   </div>
//                   <div className='flex justify-between'>
//                     <p>Season</p>
//                     <p>0</p>
//                   </div>
//                   <div className='flex justify-end pt-2'>
//                     <CustomLink href='/user/favorite' prefetch='false'>
//                       <button className='flex items-center gap-2 rounded-lg bg-logo-blue px-2.5 py-1 text-white'>
//                         <p className='text-[11px]'>Edit</p>
//                         <svg
//                           xmlns='http://www.w3.org/2000/svg'
//                           width='12'
//                           height='12'
//                           viewBox='0 0 12 12'
//                           fill='none'
//                         >
//                           <path
//                             d='M8.25002 6.00002C8.25002 5.90412 8.21337 5.80812 8.14015 5.7349L4.39015 1.9849C4.24362 1.83837 4.00634 1.83837 3.8599 1.9849C3.71346 2.13143 3.71337 2.36871 3.8599 2.51515L7.34477 6.00002L3.8599 9.4849C3.71337 9.63143 3.71337 9.86871 3.8599 10.0151C4.00643 10.1616 4.24371 10.1617 4.39015 10.0151L8.14015 6.26515C8.21337 6.19193 8.25002 6.09593 8.25002 6.00002Z'
//                             fill='white'
//                           />
//                         </svg>
//                       </button>
//                     </CustomLink>
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 <div className='flex justify-center bg-[#ECF1F5] py-3 dark:bg-dark-stroke'>
//                   <p className='text-sm font-bold text-logo-blue'>Your love</p>
//                 </div>
//                 <div className='flex flex-col bg-white p-3 dark:bg-light-black'>
//                   <div className='flex justify-between'>
//                     <p>Player</p>
//                     <p>0</p>
//                   </div>
//                   <div className='flex justify-between'>
//                     <p>Team</p>
//                     <p>0</p>
//                   </div>
//                   <div className='flex justify-between'>
//                     <p>Season</p>
//                     <p>0</p>
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 <div className='flex justify-center bg-[#ECF1F5] py-3 dark:bg-dark-stroke'>
//                   <p className='text-sm font-bold text-logo-blue'>Your love</p>
//                 </div>
//                 <div className='flex flex-col rounded-b-lg bg-white p-3 dark:bg-light-black'>
//                   <div className='flex gap-2 pb-2'>
//                     <button className='flex items-center gap-2 rounded-lg bg-logo-blue px-2.5 py-1 text-white'>
//                       <p className='text-[11px]'>Now</p>
//                     </button>
//                     <button className='flex items-center gap-2 rounded-lg border border-solid border-logo-blue px-2.5 py-1 text-logo-blue '>
//                       <p className='text-[11px]'>All</p>
//                     </button>
//                   </div>
//                   <div className='flex justify-between'>
//                     <p>Player</p>
//                     <p>0</p>
//                   </div>
//                   <div className='flex justify-between'>
//                     <p>Team</p>
//                     <p>0</p>
//                   </div>
//                   <div className='flex justify-between'>
//                     <p>Season</p>
//                     <p>0</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </TwFilterColFa>

//           <TwMainCol className='h-fit rounded-lg border border-solid border-light-line-stroke-cd dark:border-dark-stroke'>
//             <div>
//               <div className=' flex justify-center rounded-t-lg bg-white dark:bg-light-black'>
//                 <p className='py-4 uppercase text-logo-blue'>Predict match</p>
//               </div>
//               <div className=''>
//                 <div className=' flex justify-between px-3 py-4 text-csm'>
//                   <p>Today is 21-3-2023</p>
//                   <p>4 events</p>
//                 </div>
//                 <div className='border-b border-solid  bg-white px-3 py-4 dark:border-black dark:bg-light-black'>
//                   <div className='flex flex-col gap-y-2'>
//                     {/* <RowMatch /> */}
//                     {/* <RowMatch /> */}
//                     {/* <RowMatch /> */}
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <div className='flex justify-between px-3 py-4 text-csm'>
//                   <p>Tommorow is 22-3-2023</p>
//                   <p>4 events</p>
//                 </div>
//                 <div className='rounded-b-lg border-b  border-solid bg-white px-3 py-4 dark:border-black dark:bg-light-black'>
//                   <div className='flex flex-col gap-y-2 '>
//                     {/* <RowMatch /> */}
//                     {/* <RowMatch /> */}
//                     {/* <RowMatch /> */}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </TwMainCol>

//           <TwQuickViewCol className=' h-fit rounded-lg border border-solid border-light-line-stroke-cd dark:border-dark-stroke'>
//             <div className='space-y-3 rounded-t-lg bg-white px-3 py-4 dark:bg-light-black'>
//               <div className='flex justify-center'>
//                 <p className='uppercase text-logo-blue'>Top prediction</p>
//               </div>
//               <div className=''>
//                 <div className='flex items-start justify-start gap-3 bg-[#F2F6F9] px-3 py-4 dark:bg-dark-hl-3'>
//                   <div>
//                     <WarningIcon />
//                   </div>
//                   <p className='text-ccsm dark:text-dark-text'>
//                     Để được xếp hạng, bạn cần có ít nhất 30 lượt bình chọn và dự
//                     đoán đúng 50%. Người dùng được sắp xếp theo lợi tức đầu tư
//                     ảo trong 30 ngày qua. Cập nhật mỗi ngày một lần.
//                   </p>
//                 </div>
//               </div>

//               <div className='flex items-center justify-between'>
//                 <ButtonPagination previous={true} />
//                 <div>
//                   <p className='text-csm font-bold dark:text-white'>1-10</p>
//                 </div>
//                 <ButtonPagination previous={false} />
//               </div>
//             </div>
//             <div className='relative overflow-x-auto rounded-b-lg'>
//               <table className='w-full  text-left text-ccsm text-gray-500 dark:text-dark-text'>
//                 <thead className='bg-gray-50 text-ccsm text-gray-700 dark:bg-dark-hl-3 dark:text-gray-400'>
//                   <RowHeaderStanding />
//                 </thead>
//                 <tbody>
//                   <RowStanding />
//                   <RowStanding />
//                   <RowStanding />
//                   <RowStanding border={true} />
//                 </tbody>
//               </table>
//             </div>
//           </TwQuickViewCol>
//         </TwDataSection>
//       </>
//     );
//   }
// };

// ProfilePage.Layout = MainLayout;
// // ProfilePage.Layout = MbMainLayout;

// export default ProfilePage;

/* eslint-disable @next/next/no-img-element */
// pages/index.js

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import tw from 'twin.macro';

import { MainLayout } from '@/components/layout';
import {
  TwDataSection,
  TwMainCol,
} from '@/components/modules/football/tw-components';
// import { MbMainLayout } from '@/components/layout';
import Seo from '@/components/Seo';
// import RowMatchFa from '@/components/user/favorite/RowMatchFa';
import ButtonPagination from '@/components/user/profile/ButtonPagination';
import Info from '@/components/user/profile/Info';
import RowHeaderStanding from '@/components/user/profile/RowHeaderStanding';
import RowStanding from '@/components/user/profile/RowStanding';

import WarningIcon from '/public/svg/warning-icon.svg';

export const TwTitleFa = tw.div`
  text-base font-bold uppercase
`;
export const TwFilterColFa = tw.div`
  shrink
  gap-y-3
  lg:flex-[3]
`;
export const TwButtonFa = tw.button`
rounded-lg px-3 py-1.5 lg:px-0 lg:text-csm
`;
export const TwButtonFa2 = tw.button`
rounded-lg px-3 py-1.5 lg:text-csm
`;
export const TwSportTitleFa = tw.div``;
export const TwCardFa = tw.div`space-y-6 border-b border-solid border-[#555] p-4`;
export const TwQuickViewCol = tw.div`
  w-full
  lg:w-350
`;

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status === 'unauthenticated') {
    router.push('/login');
  }
  if (status === 'loading') {
    return <></>;
  }

  if (session) {
    return (
      <>
        <Seo templateTitle='Favorite' />
        <TwDataSection className='layout flex-col lg:flex-row'>
          <TwFilterColFa className='flex-shrink-1 rounded-lg border border-solid border-light-line-stroke-cd bg-white dark:border-dark-stroke dark:bg-light-black'>
            <Info data={session} />
            <div className='space-y-2.5 bg-white px-3 py-4 text-csm dark:bg-light-black'>
              <div className='flex justify-between'>
                <p>Join at</p>
                <p>20/03/2023</p>
              </div>
              <div className='flex justify-between'>
                <p>Contribute</p>
                <p>0</p>
              </div>
              <div className='flex gap-2 text-msm lg:justify-between'>
                <button className='rounded-lg border border-solid border-logo-blue px-2.5 py-1.5 text-logo-blue'>
                  <p>Cancle register</p>
                </button>
                <button className='rounded-lg border border-solid border-logo-blue px-2.5 py-1.5 text-logo-blue'>
                  <p>Remove your account</p>
                </button>
              </div>
            </div>
            <div className='space-y-2 text-csm'>
              <div>
                <div className='flex justify-center bg-[#ECF1F5] py-3 dark:bg-dark-stroke'>
                  <p className='text-sm font-bold text-logo-blue'>Your love</p>
                </div>
                <div className='flex flex-col bg-white p-3 dark:bg-light-black'>
                  <div className='flex justify-between'>
                    <p>Player</p>
                    <p>0</p>
                  </div>
                  <div className='flex justify-between'>
                    <p>Team</p>
                    <p>0</p>
                  </div>
                  <div className='flex justify-between'>
                    <p>Season</p>
                    <p>0</p>
                  </div>
                  <div className='flex justify-end pt-2'>
                    <Link href='/user/favorite'>
                      <button className='flex items-center gap-2 rounded-lg bg-logo-blue px-2.5 py-1 text-white'>
                        <p className='text-msm'>Edit</p>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='12'
                          height='12'
                          viewBox='0 0 12 12'
                          fill='none'
                        >
                          <path
                            d='M8.25002 6.00002C8.25002 5.90412 8.21337 5.80812 8.14015 5.7349L4.39015 1.9849C4.24362 1.83837 4.00634 1.83837 3.8599 1.9849C3.71346 2.13143 3.71337 2.36871 3.8599 2.51515L7.34477 6.00002L3.8599 9.4849C3.71337 9.63143 3.71337 9.86871 3.8599 10.0151C4.00643 10.1616 4.24371 10.1617 4.39015 10.0151L8.14015 6.26515C8.21337 6.19193 8.25002 6.09593 8.25002 6.00002Z'
                            fill='white'
                          />
                        </svg>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div>
                <div className='flex justify-center bg-[#ECF1F5] py-3 dark:bg-dark-stroke'>
                  <p className='text-sm font-bold text-logo-blue'>Your love</p>
                </div>
                <div className='flex flex-col bg-white p-3 dark:bg-light-black'>
                  <div className='flex justify-between'>
                    <p>Player</p>
                    <p>0</p>
                  </div>
                  <div className='flex justify-between'>
                    <p>Team</p>
                    <p>0</p>
                  </div>
                  <div className='flex justify-between'>
                    <p>Season</p>
                    <p>0</p>
                  </div>
                </div>
              </div>
              <div>
                <div className='flex justify-center bg-[#ECF1F5] py-3 dark:bg-dark-stroke'>
                  <p className='text-sm font-bold text-logo-blue'>Your love</p>
                </div>
                <div className='flex flex-col rounded-b-lg bg-white p-3 dark:bg-light-black'>
                  <div className='flex gap-2 pb-2'>
                    <button className='flex items-center gap-2 rounded-lg bg-logo-blue px-2.5 py-1 text-white'>
                      <p className='text-msm'>Now</p>
                    </button>
                    <button className='flex items-center gap-2 rounded-lg border border-solid border-logo-blue px-2.5 py-1 text-logo-blue '>
                      <p className='text-msm'>All</p>
                    </button>
                  </div>
                  <div className='flex justify-between'>
                    <p>Player</p>
                    <p>0</p>
                  </div>
                  <div className='flex justify-between'>
                    <p>Team</p>
                    <p>0</p>
                  </div>
                  <div className='flex justify-between'>
                    <p>Season</p>
                    <p>0</p>
                  </div>
                </div>
              </div>
            </div>
          </TwFilterColFa>

          <TwMainCol className='h-fit rounded-lg border border-solid border-light-line-stroke-cd dark:border-dark-stroke'>
            <div>
              <div className=' flex justify-center rounded-t-lg bg-white dark:bg-light-black'>
                <p className='py-4 uppercase text-logo-blue'>Predict match</p>
              </div>
              <div className=''>
                <div className=' flex justify-between px-3 py-4 text-csm'>
                  <p>Today is 21-3-2023</p>
                  <p>4 events</p>
                </div>
                <div className='border-b border-solid  bg-white px-3 py-4 dark:border-black dark:bg-light-black'>
                  <div className='flex flex-col gap-y-2'>
                    {/* <RowMatch /> */}
                    {/* <RowMatch /> */}
                    {/* <RowMatch /> */}
                  </div>
                </div>
              </div>

              <div>
                <div className='flex justify-between px-3 py-4 text-csm'>
                  <p>Tommorow is 22-3-2023</p>
                  <p>4 events</p>
                </div>
                <div className='rounded-b-lg border-b  border-solid bg-white px-3 py-4 dark:border-black dark:bg-light-black'>
                  <div className='flex flex-col gap-y-2 '>
                    {/* <RowMatch /> */}
                    {/* <RowMatch /> */}
                    {/* <RowMatch /> */}
                  </div>
                </div>
              </div>
            </div>
          </TwMainCol>

          <TwQuickViewCol className=' h-fit rounded-lg border border-solid border-light-line-stroke-cd dark:border-dark-stroke'>
            <div className='space-y-3 rounded-t-lg bg-white px-3 py-4 dark:bg-light-black'>
              <div className='flex justify-center'>
                <p className='uppercase text-logo-blue'>Top prediction</p>
              </div>
              <div className=''>
                <div className='flex items-start justify-start gap-3 bg-[#F2F6F9] px-3 py-4 dark:bg-dark-hl-3'>
                  <div>
                    <WarningIcon />
                  </div>
                  <p className='text-ccsm dark:text-dark-text'>
                    Để được xếp hạng, bạn cần có ít nhất 30 lượt bình chọn và dự
                    đoán đúng 50%. Người dùng được sắp xếp theo lợi tức đầu tư
                    ảo trong 30 ngày qua. Cập nhật mỗi ngày một lần.
                  </p>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <ButtonPagination previous={true} />
                <div>
                  <p className='text-csm font-bold dark:text-white'>1-10</p>
                </div>
                <ButtonPagination previous={false} />
              </div>
            </div>
            <div className='relative overflow-x-auto rounded-b-lg'>
              <table className='w-full  text-left text-ccsm text-gray-500 dark:text-dark-text'>
                <thead className='bg-gray-50 text-ccsm text-gray-700 dark:bg-dark-hl-3 dark:text-gray-400'>
                  <RowHeaderStanding />
                </thead>
                <tbody>
                  <RowStanding />
                  <RowStanding />
                  <RowStanding />
                  <RowStanding border={true} />
                </tbody>
              </table>
            </div>
          </TwQuickViewCol>
        </TwDataSection>
      </>
    );
  }
};

ProfilePage.Layout = MainLayout;
// ProfilePage.Layout = MbMainLayout;

export default ProfilePage;
