// import { Menu, Transition } from '@headlessui/react';
// import { CheckIcon, LanguageIcon } from '@heroicons/react/20/solid';
// import Image from 'next/image';
// import { useRouter } from 'next/router';
// import { Fragment, useState } from 'react';
// import { HiOutlineLogout, HiOutlineUserCircle } from 'react-icons/hi';

// import useTrans from '@/hooks/useTrans';

// import CustomLink from '@/components/common/CustomizeLink';
// import { LoginButton } from '@/components/common/header/LoginButton';
// import { ArrowDownIcon, ArrowUpIcon } from '@/components/icons';

// import { optionsLanguage } from '@/constant/languages';

// import SettingsSVG from '/public/svg/settings.svg';

// import { useAuthStore } from '@/stores/auth-store';
// import Cookies from 'js-cookie';

// export default function ProfileDropdown() {
//   const i18n = useTrans();
//   const { userInfo: session, setUserInfo } = useAuthStore();
//   const [openLanguage, setOpenLanguage] = useState(false);
//   const router = useRouter();
//   const { locale } = router;

//   const onChangeLanguage = (language: string) => {
//     const { pathname, asPath, query } = router;
//     const locale = language;

//     router.push({ pathname, query }, asPath, { locale });
//   };

//   const signOut = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.stopPropagation();
//     Cookies.remove('user_info');
//     setUserInfo(null);
//     router.push('/');
//   };
//   return (
//     <Menu as='div' className='relative inline-block text-left'>
//       <div>
//         <Menu.Button className='my-1 inline-flex rounded-full'>
//           <LoginButton />
//         </Menu.Button>
//       </div>

//       {session && (
//         <Transition
//           as={Fragment}
//           enter='transition ease-out duration-100'
//           enterFrom='transform opacity-0 scale-95'
//           enterTo='transform opacity-100 screlative inline-block text-leftale-100'
//           leave='transition ease-in duration-75'
//           leaveFrom='transform opacity-100 scale-100'
//           leaveTo='transform opacity-0 scale-95'
//         >
//           <Menu.Items className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white text-sm text-light-default shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-dark-head-tab dark:text-dark-text'>
//             <div className='divide-list py-1'>
//               {/* <Menu.Item>
//               {({ active }) => (
//                 <CustomLink
//                   href='/user/profile'
//                   className='item-hover block px-4 py-3 text-sm'
//                   prefetch='false'
//                 >
//                   <div className='flex items-center gap-2'>
//                     <HiOutlineUserCircle className='h-5 w-5'></HiOutlineUserCircle>
//                     <span>{i18n.user.profile}</span>
//                   </div>
//                 </CustomLink>
//               )}
//             </Menu.Item> */}
//               {/* <Menu.Item>
//               {({ active }) => (
//                 <CustomLink
//                   href='/'
//                   className='item-hover block px-4 py-3 text-sm'
//                   prefetch='false'
//                 >
//                   <div className='flex items-center gap-2'>
//                     <SettingsSVG className='h-5 w-5'></SettingsSVG>
//                     <span>{i18n.user.settings}</span>
//                   </div>
//                 </CustomLink>
//               )}
//             </Menu.Item> */}
//               <div
//                 className='hover:cursor-pointer'
//                 onClick={() => setOpenLanguage(!openLanguage)}
//               >
//                 <div className='item-hover block px-4 py-3 text-sm'>
//                   <div className='flex items-center justify-between'>
//                     <div className='flex items-center gap-2'>
//                       <LanguageIcon className='h-5 w-5'></LanguageIcon>
//                       <span>{i18n.multiLanguage.choose}</span>
//                     </div>
//                     {openLanguage ? <ArrowUpIcon /> : <ArrowDownIcon />}
//                   </div>
//                 </div>
//               </div>
//               <div className={`${openLanguage ? 'block' : 'hidden'}`}>
//                 {optionsLanguage.map((item: any, index: number) => {
//                   return (
//                     <button
//                       key={index}
//                       className='w-full'
//                       onClick={() => onChangeLanguage(item.alt)}
//                     >
//                       <div className='flex items-center gap-10 px-4 py-3 text-sm'>
//                         {locale === item.alt ? (
//                           <CheckIcon
//                             className='h-4 w-4 text-logo-blue'
//                             aria-hidden='true'
//                           />
//                         ) : (
//                           <div className='h-4 w-4'></div>
//                         )}
//                         <div className='flex flex-1 items-center justify-between'>
//                           <span>
//                             {i18n.multiLanguage[item.alt as 'en' | 'vi']}
//                           </span>
//                           <Image
//                             unoptimized={true}
//                             src={item.link}
//                             alt={item.alt}
//                             width={24}
//                             height={24}
//                             className='h-6 w-6'
//                           />
//                         </div>
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//               <Menu.Item>
//                 {({ active }) =>
//                   session ? (
//                     <button
//                       type='submit'
//                       className='border-top item-hover block w-full border-dark-text px-4 py-3 text-left'
//                       onClick={(e) => signOut(e)}
//                     >
//                       <div className='flex items-center gap-2'>
//                         <HiOutlineLogout className='h-5 w-5'></HiOutlineLogout>
//                         <span>{i18n.user.logout}</span>
//                       </div>
//                     </button>
//                   ) : (
//                     <></>
//                   )
//                 }
//               </Menu.Item>
//             </div>
//           </Menu.Items>
//         </Transition>
//       )}
//     </Menu>
//   );
// }

import { Menu, Transition } from '@headlessui/react';
import { signOut, useSession } from 'next-auth/react';
import { Fragment } from 'react';
import { HiOutlineLogout } from 'react-icons/hi';


import { LoginButton } from '@/components/common/header/LoginButton';

import useTrans from '@/hooks/useTrans';

export default function ProfileDropdown() {
  const i18n = useTrans();
  const { data: session } = useSession();

  return (
    <Menu as='div' className='group relative inline-block text-left'>
      <div test-id='btnLogin' className='group-hover:cursor-pointer'>
        <Menu.Button
          className='my-1 inline-flex rounded-full'
          style={{ backgroundColor: 'rgb(11, 86, 162)' }}
        >
          <LoginButton />
        </Menu.Button>
      </div>

      {/* <div className='w-40 absolute right-0 top-11 bg-head-tab dark:bg-[#061228] opacity-0 invisible group-hover:visible group-hover:opacity-100 rounded-sm'>
        <Menu.Item>
          <CustomLink href={`/favorite`} target='_parent'>
            <div className='flex items-center gap-2 px-4 py-2 hover:bg-light-primary'>
              <StarYellowNew className='h-5 w-5' />
              <span className='text-black dark:text-white'>{i18n.drawerMobile.favorites}</span>
            </div>
          </CustomLink>
        </Menu.Item>
      </div> */}

      {session && (
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white text-sm text-light-default shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-dark-match dark:text-dark-text'>
            <div className='divide-list py-1' test-id='btnLogOut'>
              {/* <Menu.Item>
              {({ active }) => (
                <Link
                  href='/user/profile'
                  className='item-hover block px-4 py-3 text-sm'
                >
                  <div className='flex items-center gap-2'>
                    <HiOutlineUserCircle className='h-5 w-5'></HiOutlineUserCircle>
                    <span>{i18n.user.profile}</span>
                  </div>
                </Link>
              )}
            </Menu.Item> */}
              {/* <Menu.Item>
              {({ active }) => (
                <Link
                  href='/user/settings'
                  className='item-hover block px-4 py-3 text-sm'
                >
                  <div className='flex items-center gap-2'>
                    <SettingsSVG className='h-5 w-5'></SettingsSVG>
                    <span>{i18n.user.settings}</span>
                  </div>
                </Link>
              )}
            </Menu.Item> */}
              {/* <Menu.Item>
              <Link
                href='/favorite'
                className='item-hover block px-4 py-3 text-sm'
              >
                <div className='flex items-center gap-2'>
                  <StarYellowNew className='h-5 w-5' />
                  <span>{i18n.drawerMobile.favorites}</span>
                </div>
              </Link>
            </Menu.Item> */}
              <Menu.Item>
                {({ active }) =>
                  session ? (
                    <button
                      type='submit'
                      className='border-top item-hover block w-full border-dark-text px-4 py-3 text-left'
                      onClick={() => signOut({ redirect: false })}
                    >
                      <div className='flex items-center gap-2'>
                        <HiOutlineLogout className='h-5 w-5'></HiOutlineLogout>
                        <span>{i18n.user.logout}</span>
                      </div>
                    </button>
                  ) : (
                    <></>
                  )
                }
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      )}
    </Menu>
  );
}
