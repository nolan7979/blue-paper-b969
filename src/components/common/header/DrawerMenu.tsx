/* eslint-disable @next/next/no-img-element */
import { LanguageIcon } from '@heroicons/react/20/solid';
import { Modal } from 'flowbite-react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter as useNavigation } from 'next/navigation';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import useTrans from '@/hooks/useTrans';

import CustomLink from '@/components/common/CustomizeLink';
import MobileDownload from '@/components/common/download/MobileDownload';
import Drawer from '@/components/exp/drawer/exp-drawer';

import { optionsLanguage } from '@/constant/languages';
import { getUserAgent } from '@/utils/userAgent';

import { ThemeSwitch } from '@/components/common/header/ThemeSwitch';
import { IMAGE_CDN_PATH, LOCAL_STORAGE } from '@/constant/common';
import { useWindowSize } from '@/hooks';
import { useDrawerStore } from '@/stores';
import { updateHtmlDir } from '@/utils';
import { setItem } from '@/utils/localStorageUtils';
import React from 'react';
import AppearanceSVG from '/public/svg/appearance.svg';
import LeftArrowSVG from '/public/svg/left-arrow.svg';
import LogoutIcon from '/public/svg/logout.svg';
import RightArrowSVG from '/public/svg/right-arrow.svg';
import FeedbackSVG from '/public/svg/feedback/chat-dots.svg';

interface DrawerMenuProps {
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
  openTopLeaguesPopup?: () => void;
}

export function DrawerSecond({
  children,
  isOpen,
  setIsOpen,
}: {
  children: any;
  isOpen: boolean;
  setIsOpen: any;
}) {
  return (
    <main
      className={
        ' fixed inset-0 z-20 transform overflow-hidden bg-gray-900 bg-opacity-0 ease-in-out ' +
        (isOpen
          ? ' translate-x-0 opacity-100 transition-opacity duration-500  '
          : ' translate-x-full opacity-0 transition-all delay-500  ')
      }
    >
      <section
        className={
          ' dark:bg-dark absolute right-0 h-full w-full max-w-lg transform bg-white shadow-xl transition-all delay-200 duration-500 ease-in-out dark:bg-[#333333]  ' +
          (isOpen ? ' translate-x-0 ' : ' translate-x-full ')
        }
      >
        <article className='relative flex h-full w-full max-w-lg flex-col overflow-y-scroll pb-10 scrollbar'>
          {children}
        </article>
      </section>
      <section
        className=' h-full w-screen cursor-pointer '
        onClick={() => {
          setIsOpen(false);
        }}
      ></section>
    </main>
  );
}

export function DrawerMenu({
  isOpen,
  setIsOpen,
  openTopLeaguesPopup,
}: DrawerMenuProps) {
  const router = useRouter();
  const navigate = useNavigation();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [userAgent, setUserAgent] = useState<any>(null);
  const [hydration, setHydration] = useState<boolean>(true);
  const { resolvedTheme } = useTheme();
  const [fill, setFill] = useState('');
  const i18n = useTrans();
  const { width } = useWindowSize();
  const { setShowDrawer, showDrawer } = useDrawerStore();

  useEffect(() => {
    setFill(resolvedTheme === 'dark' ? 'white' : 'black');
    setHydration(false);
  }, [resolvedTheme]);

  useEffect(() => {
    setIsOpen(false);
  }, [router.asPath]);

  useEffect(() => {
    setUserAgent(getUserAgent());
  }, []);

  const onClose = useCallback(() => {
    setOpenModal(false);
  }, []);

  const handleChange = (option: any) => {
    // Change the handleChange function
    const { asPath, pathname, query } = router;
    const locale = option.alt;
    setOpenModal(false);
    setIsOpen(false);

    router.push({ pathname, query }, asPath, { locale });
    setItem(LOCAL_STORAGE.currentLocale, JSON.stringify(locale));
    if (locale === 'ar-XA') {
      updateHtmlDir('rtl');
    } else {
      updateHtmlDir('ltr');
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isAndroid = userAgent && userAgent.name === 'Android';
  const isIos = userAgent && userAgent.name === 'iOS';
  const { data: session } = useSession();

  const filteredOptions = optionsLanguage.filter(
    (option) => option.alt === i18n.language
  );

  const navigateToLogin = () => {
    const loginPath =
      router.locale === 'en' ? '/login' : `/${router.locale}/login`;
    const callbackParams =
      router.locale === 'en'
        ? router.asPath
        : `/${router.locale}${router.asPath}`;
    setItem(LOCAL_STORAGE.callbackParams, callbackParams);
    if (width < 1024) {
      // window.location.href = loginPath;
      navigate.push(loginPath);
    }
  };

  const handleBackToPage = async () => {
    setIsOpen(false);
    setShowDrawer(false);
  };

  const initialSelected = filteredOptions[0];
  if (hydration) return <></>;

  return (
    <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className='h-[100vh] w-full bg-light-match  dark:bg-dark-main'>
        <div className='dark: h relative w-full'>
          {/* <img
            src='/images/menus/sidebar_bg.png'
            alt='bg-sidebar'
            loading='lazy'
            className='z-0'
          /> */}
          <div className='relative z-10 w-full bg-bkg-login pb-4 pt-11'>
            <div
              onClick={handleBackToPage}
              className='absolute left-1 top-1.5 p-2 text-white'
            >
              <LeftArrowSVG className='h-5 w-5' />
            </div>
            {/* <div className='flex items-center justify-end p-4'>
              {!session && <LoginButton />}
            </div> */}
            <div
              className='flex flex-col items-center justify-center gap-y-3'
              onClick={() => !session && navigateToLogin()}
            >
              {session && session.user?.image ? (
                <Image
                  className='rounded-full'
                  src={session.user?.image || ''}
                  alt='User Avatar'
                  width={84} // Set the desired width
                  height={84} // Set the desired height
                  aria-label='User Avatar'
                  priority={true}
                />
              ) : (
                <Image
                  unoptimized={true}
                  src='/images/football/players/unknown1.webp'
                  alt='unknown1'
                  width={84} // Set the desired width
                  height={84} // Set the desired height
                  className='rounded-full'
                  priority={true}
                />
              )}
              {session ? (
                <span className='font-bold text-white'>
                  {session?.user?.name}
                </span>
              ) : (
                <button
                  type='button'
                  className='rounded-md border-0 bg-dark-button px-6 py-3 text-[10px] uppercase leading-3 text-white'
                >
                  {i18n.user.login}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className=' p-4'>
          <div className=' flex flex-col gap-y-3 text-csm'>
            <div className='flex flex-col gap-y-2.5'>
              {/* <MenuMbItem
                key='profile'
                icon={<UserCircleSVG className='h-5 w-5' />}
                label={i18n.drawerMobile.profile}
                link={session ? '/' : '/login'}
              /> */}
              {/* <MenuMbItem
                key='tournaments'
                icon={<TrophyIcon className=' h-5 w-5' />}
                label={i18n.drawerMobile.tournaments}
                onClick={openTopLeaguesPopup}
              /> */}
              {/* <MenuMbItem
                key='favorites'
                icon={<StarIcon className='h-5 w-5' />}
                label={i18n.drawerMobile.favorites}
              /> */}
              <MenuMbItem
                key='theme'
                icon={
                  <AppearanceSVG className='h-5 w-5 text-black dark:text-white' />
                }
                label={i18n.drawerMobile.appearance}
              >
                <ThemeSwitch />
              </MenuMbItem>
              <MenuMbItem
                key='language'
                icon={
                  <LanguageIcon className='h-5 w-5 fill-all-blue text-black dark:text-white'></LanguageIcon>
                }
                label={i18n.drawerMobile.language}
              >
                <button onClick={() => setOpenModal(true)} className='h-5'>
                  <Image
                    unoptimized={true}
                    src={initialSelected['link']}
                    alt={initialSelected['alt']}
                    width={32}
                    height={24}
                    className='h-5 w-5 rounded-full object-cover'
                    priority={true}
                  />
                </button>
              </MenuMbItem>
              {/* <MenuMbItem
                key='feedback'
                icon={
                  <FeedbackSVG className='h-5 w-5 fill-all-blue text-black dark:text-white'></FeedbackSVG>
                }
                label={i18n.feedback.feedback}
                link='/feedback'
              /> */}

              {/* <div className='flex justify-between'>
              <div className='ml-1 flex items-center gap-2'>
                <BsMoon className='h-5 w-5 text-black dark:text-white'></BsMoon>
                <p>{i18n.drawerMobile.appearance}</p>
              </div>
              <div>
                <label className='relative inline-flex cursor-pointer items-center'>
                  <input
                    type='checkbox'
                    value=''
                    className='peer sr-only'
                    aria-label='switch dark mode'
                  />
                  <div className="peer h-4 w-7 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
                </label>
              </div>
            </div> */}
              {/* <div
              className='flex items-center justify-between'
              onClick={() => setOpenSettings(true)}
            >
              <div className='ml-1 flex items-center gap-2'>
                <FiSettings className='h-5 w-5 text-black dark:text-white'></FiSettings>

                <p>{i18n.drawerMobile.settings}</p>
              </div>
              <ArrowRightSVG />
            </div> */}
              {session ? (
                <MenuMbItem
                  key='logout'
                  icon={
                    <LogoutIcon className='h-5 w-5 text-black dark:text-all-blue'></LogoutIcon>
                  }
                  label={i18n.user.logout}
                  onClick={() => signOut({ redirect: false })}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        {/* <div className='space-y-4 border-b border-solid border-[#aaa] p-4'>
          {links.map(
            (
              { href, label, index } // TODO
            ) => (
              <button
                key={`${href}${label}`}
                className='bddev flex h-10 w-full items-center gap-6 uppercase'
                onClick={() => {
                  setIsOpen(!isOpen);
                  router.push(href);
                }}
              >
                {svgIcon[index]}
                {label}
              </button>
            )
          )}
        </div> */}

        {/* <Card /> */}
        {isAndroid ? (
          <MobileDownload type='android' />
        ) : isIos ? (
          <MobileDownload type='ios' />
        ) : (
          <></>
        )}
      </div>
      {/* //TODO custom modal hooks */}
      {openModal && (
        <Modal
          show={openModal}
          className='h-fit lg:hidden'
          onClose={onClose}
          position='bottom-center'
          size='sm'
          popup={true}
          // dismissible={true}
        >
          <Modal.Header className='!p-1.5' as='div' draggable={true}>
            <span className='pl-4 text-sm'>{i18n.drawerMobile.language}</span>
          </Modal.Header>
          <Modal.Body>
            <div className='w-full space-y-4'>
              {optionsLanguage.map((option, idx) => {
                return (
                  <div
                    key={`language-${idx}`}
                    onClick={() => handleChange(option)}
                    className={`flex w-full items-center gap-2 rounded-md p-1.5 ${
                      (initialSelected.id === option.id &&
                        'bg-dark-text-full') ||
                      ''
                    }`}
                  >
                    <img
                      src={`${IMAGE_CDN_PATH}/public${option['link']}`}
                      width={24}
                      height={24}
                      loading='lazy'
                      className='h-6 w-6 rounded-full object-cover'
                      alt={option['alt']}
                    />

                    <span className='text-xs capitalize'>{option.name}</span>
                  </div>
                );
              })}
            </div>
          </Modal.Body>
        </Modal>
      )}
      {/* <DrawerSecond isOpen={openSettings} setIsOpen={setOpenSettings}>
        <div className='px-4 pb-0 pt-4'>
          <div className='flex items-center gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              onClick={() => setOpenSettings(false)}
            >
              <path
                d='M1.293 11.2924L8.293 4.29243C8.4816 4.11027 8.7342 4.00948 8.9964 4.01176C9.2586 4.01403 9.50941 4.1192 9.69482 4.30461C9.88023 4.49002 9.9854 4.74083 9.98767 5.00303C9.98995 5.26523 9.88916 5.51783 9.707 5.70643L4.414 10.9994H22C22.2652 10.9994 22.5196 11.1048 22.7071 11.2923C22.8946 11.4799 23 11.7342 23 11.9994C23 12.2646 22.8946 12.519 22.7071 12.7065C22.5196 12.8941 22.2652 12.9994 22 12.9994H4.414L9.707 18.2924C9.80251 18.3847 9.87869 18.495 9.9311 18.617C9.98351 18.739 10.0111 18.8703 10.0123 19.003C10.0134 19.1358 9.9881 19.2675 9.93782 19.3904C9.88754 19.5133 9.81329 19.6249 9.71939 19.7188C9.6255 19.8127 9.51385 19.887 9.39095 19.9373C9.26806 19.9875 9.13638 20.0128 9.0036 20.0117C8.87082 20.0105 8.7396 19.9829 8.6176 19.9305C8.49559 19.8781 8.38525 19.8019 8.293 19.7064L1.293 12.7064C1.10553 12.5189 1.00021 12.2646 1.00021 11.9994C1.00021 11.7343 1.10553 11.48 1.293 11.2924Z'
                fill={fill}
              />
            </svg>
            <p className='text-base uppercase text-black dark:text-white'>
              Cài đăt
            </p>
          </div>
        </div>
        <div className='border-b border-solid border-[#aaa] p-4'>
          <div className='flex flex-col gap-y-2 py-2'>
            <div className='flex justify-between'>
              <p>Chế độ sáng tối</p>
              <div>
                <label className='relative inline-flex cursor-pointer items-center'>
                  <input
                    type='checkbox'
                    value=''
                    className='peer sr-only'
                    aria-label='switch dark mode'
                  />
                  <div className="peer h-4 w-7 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
                </label>
              </div>
            </div>
            <div className='flex justify-between'>
              <p>Chế độ sáng tối</p>
              <div>
                <label className='relative inline-flex cursor-pointer items-center'>
                  <input
                    type='checkbox'
                    value=''
                    className='peer sr-only'
                    aria-label='switch dark mode'
                  />
                  <div className="peer h-4 w-7 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
                </label>
              </div>
            </div>
            <div className='flex justify-between'>
              <p>Chế độ sáng tối</p>
              <div>
                <label className='relative inline-flex cursor-pointer items-center'>
                  <input
                    type='checkbox'
                    value=''
                    className='peer sr-only'
                    aria-label='switch dark mode'
                  />
                  <div className="peer h-4 w-7 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
                </label>
              </div>
            </div>
            <div className='flex justify-between'>
              <p>Chế độ sáng tối</p>
              <div>
                <label className='relative inline-flex cursor-pointer items-center'>
                  <input
                    type='checkbox'
                    value=''
                    className='peer sr-only'
                    aria-label='switch dark mode'
                  />
                  <div className="peer h-4 w-7 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
                </label>
              </div>
            </div>
            <div className='flex justify-between'>
              <p>Chế độ sáng tối</p>
              <div>
                <label className='relative inline-flex cursor-pointer items-center'>
                  <input
                    type='checkbox'
                    value=''
                    className='peer sr-only'
                    aria-label='switch dark mode'
                  />
                  <div className="peer h-4 w-7 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
                </label>
              </div>
            </div>
            <div className='flex justify-between'>
              <p>Chế độ sáng tối</p>
              <div>
                <label className='relative inline-flex cursor-pointer items-center'>
                  <input
                    type='checkbox'
                    value=''
                    className='peer sr-only'
                    aria-label='switch dark mode'
                  />
                  <div className="peer h-4 w-7 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-y-2 border-b border-solid border-[#aaa] px-4 py-2 pb-4'>
          <div className='flex- flex-col gap-y-2'>
            <p>Chủ</p>
            <Select
              options={[
                { id: 1, name: 'Âm thanh 1' },
                { id: 2, name: 'Âm thanh 2' },
              ]}
              size='full'
              classText='text-left pl-3'
            />
          </div>
          <div className='flex- flex-col gap-y-2'>
            <p>Khách</p>
            <Select
              options={[
                { id: 1, name: 'Âm thanh 1' },
                { id: 2, name: 'Âm thanh 2' },
              ]}
              size='full'
              classText='text-left pl-3'
            />
          </div>
        </div>
      </DrawerSecond> */}
    </Drawer>
  );
}

interface IMenuMbItem {
  link?: string;
  label: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
}

const MenuItemContent: React.FC<IMenuMbItem> = ({
  label,
  icon,
  link,
  children,
  onClick,
}) => (
  <div
    className='flex cursor-pointer items-center justify-between rounded-md bg-light px-5 py-4 dark:bg-dark-gray'
    onClick={onClick}
  >
    <div className='flex items-center gap-x-3.5'>
      {icon}
      <span className='font-normal text-light-default dark:text-dark-text'>
        {label}
      </span>
    </div>
    {((link || onClick) && (
      <div>
        <RightArrowSVG />
      </div>
    )) ||
      children}
  </div>
);

export const MenuMbItem: React.FC<IMenuMbItem> = (props) => {
  if (props?.link) {
    return (
      <CustomLink href={props.link} target='_parent'>
        <MenuItemContent {...props} />
      </CustomLink>
    );
  }
  return <MenuItemContent {...props} />;
};

// /* eslint-disable @next/next/no-img-element */
// import Link from 'next/link';

// import { Select } from '@/components/common/selects/Select';
// import { SelectLanguage } from '@/components/common/selects/SelectLanguage';

// import BadmintonIcon from '/public/svg/badminton.svg';
// import BasketballIcon from '/public/svg/basketball.svg';
// import TennisIcon from '/public/svg/tennis.svg';
// const links = [
//   { href: '/', label: 'BÓNG ĐÁ', index: 0 },
//   { href: '/volleyball', label: 'BÓNG CHUYỀN', index: 1 },
//   { href: '/basketball', label: 'BÓNG RỔ', index: 2 },
//   { href: '/index-old', label: 'TENNIS', index: 3 },
//   { href: '/404', label: 'CẦU LÔNG', index: 4 },
//   // { href: '/exp', label: 'EXP' },
//   // { href: '/login', label: 'Login' },
// ];
// const svgIcon = [
//   <FootballIcon key='1' />,
//   <BasketballIcon key='2' />,
//   <BasketballIcon key='3' />,

//   <TennisIcon key='4' />,
//   <BadmintonIcon key='5' />,
// ];
// interface DrawerMenuProps {
//   isOpen: boolean;
//   setIsOpen: (x: boolean) => void;
// }

// export function DrawerSecond({
//   children,
//   isOpen,
//   setIsOpen,
// }: {
//   children: any;
//   isOpen: boolean;
//   setIsOpen: any;
// }) {
//   return (
//     <main
//       className={
//         ' fixed inset-0 z-20 transform overflow-hidden bg-gray-900 bg-opacity-0 ease-in-out ' +
//         (isOpen
//           ? ' translate-x-0 opacity-100 transition-opacity duration-500  '
//           : ' translate-x-full opacity-0 transition-all delay-500  ')
//       }
//     >
//       <section
//         className={
//           ' dark:bg-dark absolute right-0 h-full w-full max-w-lg transform bg-white shadow-xl transition-all delay-200 duration-500 ease-in-out dark:bg-[#333333]  ' +
//           (isOpen ? ' translate-x-0 ' : ' translate-x-full ')
//         }
//       >
//         <article className='relative flex h-full w-full max-w-lg flex-col overflow-y-scroll pb-10'>
//           {children}
//         </article>
//       </section>
//       <section
//         className=' h-full w-screen cursor-pointer '
//         onClick={() => {
//           setIsOpen(false);
//         }}
//       ></section>
//     </main>
//   );
// }
// export function DrawerMenu({ isOpen, setIsOpen }: DrawerMenuProps) {
//   const router = useRouter();
//   const [userAgent, setUserAgent] = useState<any>(null);
//   const [openSettings, setOpenSettings] = useState<boolean>(false);
//   const { resolvedTheme } = useTheme();
//   const [fill, setFill] = useState('');

//   useEffect(() => {
//     // Update the fill color when resolvedTheme changes
//     setFill(resolvedTheme === 'dark' ? 'white' : 'black');
//   }, [resolvedTheme]);
//   useEffect(() => {
//     setUserAgent(getUserAgent());
//   }, []);
//   const isAndroid = userAgent && userAgent.name === 'Android';
//   const isIos = userAgent && userAgent.name === 'iOS';
//   return (
//     <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
//       <div className='border-b border-solid border-[#aaa] p-4'>
//         <div className='flex flex-col gap-y-3 text-csm'>
//           <div>
//             <Image
//               src='/images/football/players/unknown1.webp'
//               alt=''
//               width={48} // Set the desired width
//               height={48} // Set the desired height
//               className='rounded-full'
//             />
//           </div>
//           <div className='flex flex-col gap-y-2'>
//             <div className='flex flex-col'>
//               <p className='text-base leading-3 text-black dark:text-white'>
//                 Alejandro Garnacho
//               </p>
//               <p>garnacho_2004@gmail.com</p>
//             </div>
//             <div className='flex justify-between'>
//               <div className='flex items-center gap-1'>
//                 <svg
//                   xmlns='http://www.w3.org/2000/svg'
//                   width='24'
//                   height='24'
//                   viewBox='0 0 24 24'
//                   id='language'
//                 >
//                   <path fill='none' d='M0 0h24v24H0V0z'></path>
//                   <path
//                     d='M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z'
//                     fill={fill}
//                   ></path>
//                 </svg>
//                 <p>Ngôn ngữ</p>
//               </div>
//               <SelectLanguage />
//             </div>
//             <div className='flex justify-between'>
//               <div className='flex items-center gap-1'>
//                 <svg
//                   xmlns='http://www.w3.org/2000/svg'
//                   width='24'
//                   height='24'
//                   viewBox='0 0 24 24'
//                   fill='none'
//                 >
//                   <path
//                     d='M19.6857 12.804C19.5703 12.7058 19.4305 12.643 19.2821 12.6226C19.1337 12.6023 18.9827 12.6252 18.8464 12.6888C18.001 13.0868 17.082 13.2917 16.1523 13.2893C14.4327 13.2871 12.7836 12.5855 11.5646 11.3374C10.3456 10.0892 9.65567 8.39581 9.64512 6.62634C9.64876 6.07178 9.71584 5.51959 9.84497 4.98117C9.87237 4.83766 9.86209 4.68923 9.8152 4.55117C9.7683 4.4131 9.68648 4.29041 9.57816 4.19571C9.46984 4.10101 9.33895 4.03774 9.19896 4.01242C9.05898 3.9871 8.91496 4.00064 8.78175 4.05165C7.52853 4.6315 6.43913 5.52964 5.61588 6.6617C4.79264 7.79376 4.26258 9.12258 4.07549 10.5233C3.8884 11.9241 4.05043 13.3508 4.54636 14.6694C5.04229 15.988 5.85583 17.1552 6.91057 18.0615C7.9653 18.9677 9.22661 19.5832 10.576 19.8501C11.9254 20.1169 13.3185 20.0265 14.6246 19.5872C15.9307 19.1479 17.1068 18.3741 18.0425 17.3387C18.9781 16.3032 19.6426 15.04 19.9735 13.6677C20.0138 13.5105 20.008 13.3447 19.9568 13.191C19.9056 13.0372 19.8113 12.9026 19.6857 12.804ZM12.0913 18.307C10.7497 18.2973 9.44383 17.8611 8.35246 17.0581C7.2611 16.2552 6.43761 15.1247 5.99475 13.8216C5.55188 12.5184 5.5113 11.1063 5.87856 9.77849C6.24581 8.45069 7.00294 7.27215 8.04629 6.40424V6.62634C8.04841 8.83785 8.90311 10.9581 10.4228 12.5219C11.9426 14.0857 14.0031 14.9652 16.1523 14.9674C16.7166 14.9695 17.2795 14.9088 17.8311 14.7864C17.2794 15.8603 16.4533 16.7588 15.4418 17.385C14.4303 18.0113 13.2718 18.3415 12.0913 18.3399V18.307Z'
//                     fill={fill}
//                   />
//                 </svg>
//                 <p>Chế độ sáng tối</p>
//               </div>
//               <div>
//                 <label className='relative inline-flex cursor-pointer items-center'>
//                   <input
//                     type='checkbox'
//                     value=''
//                     className='peer sr-only'
//                     aria-label='switch dark mode'
//                   />
//                   <div className="peer h-4 w-7 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
//                 </label>
//               </div>
//             </div>
//             <div
//               className='flex items-center justify-between'
//               onClick={() => setOpenSettings(true)}
//             >
//               <div className='flex items-center gap-1'>
//                 <svg
//                   xmlns='http://www.w3.org/2000/svg'
//                   width='24'
//                   height='24'
//                   viewBox='0 0 24 24'
//                   fill='none'
//                 >
//                   <path
//                     d='M18.6927 12.5279C18.5622 12.382 18.4902 12.1943 18.4902 12C18.4902 11.8057 18.5622 11.618 18.6927 11.4721L19.735 10.3202C19.8499 10.1944 19.9212 10.036 19.9387 9.8679C19.9563 9.69976 19.9192 9.53049 19.8327 9.38436L18.2041 6.61673C18.1186 6.47077 17.9883 6.35507 17.8318 6.28613C17.6754 6.21718 17.5007 6.19852 17.3328 6.23278L15.802 6.53674C15.6072 6.57628 15.4044 6.54441 15.2319 6.44716C15.0594 6.3499 14.929 6.19398 14.8655 6.00882L14.3688 4.54501C14.3142 4.38614 14.2101 4.24815 14.0713 4.15054C13.9325 4.05294 13.7659 4.00065 13.5952 4.00109H10.338C10.1605 3.99198 9.98474 4.04022 9.8377 4.13844C9.69067 4.23666 9.5804 4.37945 9.52374 4.54501L9.06773 6.00882C9.00422 6.19398 8.87391 6.3499 8.70139 6.44716C8.52888 6.54441 8.32609 6.57628 8.13129 6.53674L6.5597 6.23278C6.40055 6.21069 6.2383 6.23536 6.09339 6.30369C5.94849 6.37201 5.82741 6.48093 5.7454 6.61673L4.11681 9.38436C4.02818 9.52886 3.98833 9.69718 4.00296 9.86527C4.01758 10.0334 4.08594 10.1926 4.19824 10.3202L5.2324 11.4721C5.36295 11.618 5.43494 11.8057 5.43494 12C5.43494 12.1943 5.36295 12.382 5.2324 12.5279L4.19824 13.6798C4.08594 13.8074 4.01758 13.9666 4.00296 14.1347C3.98833 14.3028 4.02818 14.4711 4.11681 14.6156L5.7454 17.3833C5.83099 17.5292 5.96129 17.6449 6.11774 17.7139C6.2742 17.7828 6.44881 17.8015 6.6167 17.7672L8.14758 17.4633C8.34237 17.4237 8.54516 17.4556 8.71768 17.5528C8.8902 17.6501 9.02051 17.806 9.08402 17.9912L9.58074 19.455C9.6374 19.6205 9.74767 19.7633 9.89471 19.8616C10.0417 19.9598 10.2175 20.008 10.395 19.9989H13.6522C13.8229 19.9993 13.9895 19.9471 14.1283 19.8495C14.2671 19.7519 14.3712 19.6139 14.4258 19.455L14.9225 17.9912C14.986 17.806 15.1164 17.6501 15.2889 17.5528C15.4614 17.4556 15.6642 17.4237 15.859 17.4633L17.3898 17.7672C17.5577 17.8015 17.7324 17.7828 17.8888 17.7139C18.0453 17.6449 18.1756 17.5292 18.2611 17.3833L19.8897 14.6156C19.9762 14.4695 20.0133 14.3002 19.9958 14.1321C19.9782 13.964 19.9069 13.8056 19.792 13.6798L18.6927 12.5279ZM17.4794 13.5998L18.1309 14.3197L17.0886 16.0954L16.1277 15.9035C15.5412 15.7857 14.9311 15.8836 14.4133 16.1785C13.8954 16.4734 13.5058 16.9448 13.3184 17.5033L13.0089 18.3991H10.9243L10.6312 17.4873C10.4438 16.9288 10.0542 16.4574 9.53628 16.1625C9.01841 15.8676 8.40833 15.7697 7.82186 15.8875L6.86099 16.0794L5.80241 14.3117L6.45384 13.5918C6.85444 13.1518 7.07591 12.5823 7.07591 11.992C7.07591 11.4017 6.85444 10.8322 6.45384 10.3922L5.80241 9.67232L6.8447 7.91256L7.80557 8.10453C8.39205 8.22229 9.00213 8.12443 9.52 7.82953C10.0379 7.53462 10.4275 7.0632 10.6149 6.50475L10.9243 5.60087H13.0089L13.3184 6.51275C13.5058 7.0712 13.8954 7.54262 14.4133 7.83752C14.9311 8.13243 15.5412 8.23029 16.1277 8.11253L17.0886 7.92055L18.1309 9.69631L17.4794 10.4162C17.0833 10.8552 16.8646 11.4214 16.8646 12.008C16.8646 12.5946 17.0833 13.1608 17.4794 13.5998ZM11.9666 8.80044C11.3224 8.80044 10.6927 8.98809 10.157 9.33966C9.62139 9.69123 9.20391 10.1909 8.95738 10.7756C8.71085 11.3602 8.64635 12.0035 8.77203 12.6242C8.89771 13.2449 9.20793 13.815 9.66345 14.2624C10.119 14.7099 10.6994 15.0146 11.3312 15.1381C11.963 15.2615 12.6179 15.1982 13.2131 14.956C13.8083 14.7138 14.317 14.3037 14.6749 13.7776C15.0328 13.2514 15.2238 12.6328 15.2238 12C15.2238 11.1514 14.8806 10.3376 14.2698 9.73757C13.659 9.13753 12.8305 8.80044 11.9666 8.80044ZM11.9666 13.5998C11.6445 13.5998 11.3297 13.506 11.0618 13.3302C10.794 13.1544 10.5853 12.9045 10.462 12.6122C10.3387 12.3199 10.3065 11.9982 10.3693 11.6879C10.4322 11.3776 10.5873 11.0925 10.815 10.8688C11.0428 10.6451 11.333 10.4927 11.6489 10.431C11.9648 10.3692 12.2923 10.4009 12.5899 10.522C12.8875 10.6431 13.1418 10.8481 13.3208 11.1112C13.4997 11.3743 13.5952 11.6836 13.5952 12C13.5952 12.4243 13.4236 12.8312 13.1182 13.1312C12.8128 13.4312 12.3986 13.5998 11.9666 13.5998Z'
//                     fill={fill}
//                   />
//                 </svg>
//                 <p>Cài đặt chi tiết</p>
//               </div>
//               <svg
//                 xmlns='http://www.w3.org/2000/svg'
//                 width='12'
//                 height='20'
//                 viewBox='0 0 12 20'
//                 fill='none'
//                 className='h-3 w-2'
//               >
//                 <path
//                   d='M-7.89428e-07 1.13922L1.3125 -0.000780163L12 9.59922L1.3125 19.1992L-4.9831e-08 18.0592L9.375 9.59922L-7.89428e-07 1.13922Z'
//                   fill='#AAAAAA'
//                 />
//               </svg>
//             </div>
//             <Link href='/user/favorite' onClick={() => setIsOpen(false)}>
//               <div className='flex justify-between'>
//                 <div className='flex items-center gap-1'>
//                   <svg
//                     xmlns='http://www.w3.org/2000/svg'
//                     width='24'
//                     height='24'
//                     viewBox='0 0 24 24'
//                     fill='none'
//                   >
//                     <path
//                       d='M19.6857 12.804C19.5703 12.7058 19.4305 12.643 19.2821 12.6226C19.1337 12.6023 18.9827 12.6252 18.8464 12.6888C18.001 13.0868 17.082 13.2917 16.1523 13.2893C14.4327 13.2871 12.7836 12.5855 11.5646 11.3374C10.3456 10.0892 9.65567 8.39581 9.64512 6.62634C9.64876 6.07178 9.71584 5.51959 9.84497 4.98117C9.87237 4.83766 9.86209 4.68923 9.8152 4.55117C9.7683 4.4131 9.68648 4.29041 9.57816 4.19571C9.46984 4.10101 9.33895 4.03774 9.19896 4.01242C9.05898 3.9871 8.91496 4.00064 8.78175 4.05165C7.52853 4.6315 6.43913 5.52964 5.61588 6.6617C4.79264 7.79376 4.26258 9.12258 4.07549 10.5233C3.8884 11.9241 4.05043 13.3508 4.54636 14.6694C5.04229 15.988 5.85583 17.1552 6.91057 18.0615C7.9653 18.9677 9.22661 19.5832 10.576 19.8501C11.9254 20.1169 13.3185 20.0265 14.6246 19.5872C15.9307 19.1479 17.1068 18.3741 18.0425 17.3387C18.9781 16.3032 19.6426 15.04 19.9735 13.6677C20.0138 13.5105 20.008 13.3447 19.9568 13.191C19.9056 13.0372 19.8113 12.9026 19.6857 12.804ZM12.0913 18.307C10.7497 18.2973 9.44383 17.8611 8.35246 17.0581C7.2611 16.2552 6.43761 15.1247 5.99475 13.8216C5.55188 12.5184 5.5113 11.1063 5.87856 9.77849C6.24581 8.45069 7.00294 7.27215 8.04629 6.40424V6.62634C8.04841 8.83785 8.90311 10.9581 10.4228 12.5219C11.9426 14.0857 14.0031 14.9652 16.1523 14.9674C16.7166 14.9695 17.2795 14.9088 17.8311 14.7864C17.2794 15.8603 16.4533 16.7588 15.4418 17.385C14.4303 18.0113 13.2718 18.3415 12.0913 18.3399V18.307Z'
//                       fill={fill}
//                     />
//                   </svg>
//                   <p>Your favorite</p>
//                 </div>
//               </div>
//             </Link>
//           </div>
//         </div>
//       </div>
//       <div className='space-y-4 border-b border-solid border-[#aaa] p-4'>
//         {links.map(
//           (
//             { href, label, index } // TODO
//           ) => (
//             <button
//               key={`${href}${label}`}
//               className='bddev flex h-10 w-full items-center gap-6 uppercase'
//               onClick={() => {
//                 setIsOpen(!isOpen);
//                 router.push(href);
//               }}
//             >
//               {svgIcon[index]}
//               {label}
//             </button>
//           )
//         )}
//       </div>
//       {/* <Card /> */}
//       {isAndroid ? (
//         <MobileDownload type='android' />
//       ) : isIos ? (
//         <MobileDownload type='ios' />
//       ) : (
//         <></>
//       )}
//       <DrawerSecond isOpen={openSettings} setIsOpen={setOpenSettings}>
//         <div className='px-4 pb-0 pt-4'>
//           <div className='flex items-center gap-2'>
//             <svg
//               xmlns='http://www.w3.org/2000/svg'
//               width='24'
//               height='24'
//               viewBox='0 0 24 24'
//               fill='none'
//               onClick={() => setOpenSettings(false)}
//             >
//               <path
//                 d='M1.293 11.2924L8.293 4.29243C8.4816 4.11027 8.7342 4.00948 8.9964 4.01176C9.2586 4.01403 9.50941 4.1192 9.69482 4.30461C9.88023 4.49002 9.9854 4.74083 9.98767 5.00303C9.98995 5.26523 9.88916 5.51783 9.707 5.70643L4.414 10.9994H22C22.2652 10.9994 22.5196 11.1048 22.7071 11.2923C22.8946 11.4799 23 11.7342 23 11.9994C23 12.2646 22.8946 12.519 22.7071 12.7065C22.5196 12.8941 22.2652 12.9994 22 12.9994H4.414L9.707 18.2924C9.80251 18.3847 9.87869 18.495 9.9311 18.617C9.98351 18.739 10.0111 18.8703 10.0123 19.003C10.0134 19.1358 9.9881 19.2675 9.93782 19.3904C9.88754 19.5133 9.81329 19.6249 9.71939 19.7188C9.6255 19.8127 9.51385 19.887 9.39095 19.9373C9.26806 19.9875 9.13638 20.0128 9.0036 20.0117C8.87082 20.0105 8.7396 19.9829 8.6176 19.9305C8.49559 19.8781 8.38525 19.8019 8.293 19.7064L1.293 12.7064C1.10553 12.5189 1.00021 12.2646 1.00021 11.9994C1.00021 11.7343 1.10553 11.48 1.293 11.2924Z'
//                 fill={fill}
//               />
//             </svg>
//             <p className='text-base uppercase text-black dark:text-white'>
//               Cài đăt
//             </p>
//           </div>
//         </div>
//         <div className='border-b border-solid border-[#aaa] p-4'>
//           <div className='flex flex-col gap-y-2 py-2'>
//             <div className='flex justify-between'>
//               <p>Chế độ sáng tối</p>
//               <div>
//                 <label className='relative inline-flex cursor-pointer items-center'>
//                   <input
//                     type='checkbox'
//                     value=''
//                     className='peer sr-only'
//                     aria-label='switch dark mode'
//                   />
//                   <div className="peer h-4 w-7 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
//                 </label>
//               </div>
//             </div>
//             <div className='flex justify-between'>
//               <p>Chế độ sáng tối</p>
//               <div>
//                 <label className='relative inline-flex cursor-pointer items-center'>
//                   <input
//                     type='checkbox'
//                     value=''
//                     className='peer sr-only'
//                     aria-label='switch dark mode'
//                   />
//                   <div className="peer h-4 w-7 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
//                 </label>
//               </div>
//             </div>
//             <div className='flex justify-between'>
//               <p>Chế độ sáng tối</p>
//               <div>
//                 <label className='relative inline-flex cursor-pointer items-center'>
//                   <input
//                     type='checkbox'
//                     value=''
//                     className='peer sr-only'
//                     aria-label='switch dark mode'
//                   />
//                   <div className="peer h-4 w-7 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
//                 </label>
//               </div>
//             </div>
//             <div className='flex justify-between'>
//               <p>Chế độ sáng tối</p>
//               <div>
//                 <label className='relative inline-flex cursor-pointer items-center'>
//                   <input
//                     type='checkbox'
//                     value=''
//                     className='peer sr-only'
//                     aria-label='switch dark mode'
//                   />
//                   <div className="peer h-4 w-7 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
//                 </label>
//               </div>
//             </div>
//             <div className='flex justify-between'>
//               <p>Chế độ sáng tối</p>
//               <div>
//                 <label className='relative inline-flex cursor-pointer items-center'>
//                   <input
//                     type='checkbox'
//                     value=''
//                     className='peer sr-only'
//                     aria-label='switch dark mode'
//                   />
//                   <div className="peer h-4 w-7 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
//                 </label>
//               </div>
//             </div>
//             <div className='flex justify-between'>
//               <p>Chế độ sáng tối</p>
//               <div>
//                 <label className='relative inline-flex cursor-pointer items-center'>
//                   <input
//                     type='checkbox'
//                     value=''
//                     className='peer sr-only'
//                     aria-label='switch dark mode'
//                   />
//                   <div className="peer h-4 w-7 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className='flex flex-col gap-y-2 border-b border-solid border-[#aaa] px-4 py-2 pb-4'>
//           <div className='flex- flex-col gap-y-2'>
//             <p>Chủ</p>
//             <Select
//               options={[
//                 { id: 1, name: 'Âm thanh 1' },
//                 { id: 2, name: 'Âm thanh 2' },
//               ]}
//               size='full'
//               classText='text-left pl-3'
//             />
//           </div>
//           <div className='flex- flex-col gap-y-2'>
//             <p>Khách</p>
//             <Select
//               options={[
//                 { id: 1, name: 'Âm thanh 1' },
//                 { id: 2, name: 'Âm thanh 2' },
//               ]}
//               size='full'
//               classText='text-left pl-3'
//             />
//           </div>
//         </div>
//       </DrawerSecond>
//     </Drawer>
//   );
// }
