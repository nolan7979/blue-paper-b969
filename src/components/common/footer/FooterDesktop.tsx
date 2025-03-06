import { Logo } from '@/components/common';
import CustomLink from '@/components/common/CustomizeLink';
import UnstyledLink from '@/components/links/UnstyledLink';
import useTrans from '@/hooks/useTrans';
import FacebookLogoSVG from '/public/svg/facebook-logo.svg';
import IconAddress from '/public/svg/footer-address.svg';
import IconClock from '/public/svg/footer-clock.svg';
import IconEmail from '/public/svg/footer-email.svg';
import InstagramLogoSVG from '/public/svg/instagram-logo.svg';
import TikTokLogoSVG from '/public/svg/tiktok-logo.svg';
import XLogoSvg from '/public/svg/x-logo.svg';
import { memo } from 'react';

export const FooterComponent: React.FC = () => {
  const i18n = useTrans();

  return (
    // change bg because it is same color with sticky footer mobile
    <footer className='overflow-hidden font-primary lg:text-dark-default relative lg:z-50'>
      <div className='border-b border-line-default bg-white pb-10 pt-10 dark:border-0 dark:bg-[#001338]'>
        <div className='layout grid grid-cols-1 justify-between gap-10 lg:grid-cols-5'>
          <div className='flex flex-col items-center justify-center gap-6 lg:col-span-2 lg:items-start lg:justify-start'>
            <LogoSection />
            <ContactSection i18n={i18n} />
            {/*<a*/}
            {/*  href='//www.dmca.com/Protection/Status.aspx?ID=6ab93c91-86ab-46d9-b8e7-cd2154648514'*/}
            {/*  title='DMCA.com Protection Status'*/}
            {/*>*/}
            {/*  <img*/}
            {/*    src='https://images.dmca.com/Badges/_dmca_premi_badge_5.png?ID=6ab93c91-86ab-46d9-b8e7-cd2154648514'*/}
            {/*    alt='DMCA.com Protection Status'*/}
            {/*  />*/}
            {/*</a>*/}
            {/* <script src='https://images.dmca.com/Badges/DMCABadgeHelper.min.js'></script> */}
          </div>
          <div className='flex w-full flex-col items-center justify-center pt-2 lg:col-span-3 lg:items-start lg:justify-start'>
            <InfoSection i18n={i18n} />
          </div>
        </div>
      </div>
      <div className='bg-white pb-8 pt-8 dark:bg-dark-main'>
        <div className='layout flex flex-col items-center justify-between gap-4 lg:flex-row'>
          <p className='flex items-center text-xss text-black dark:text-[#8D8E92]'>
            {i18n.info.copyright}
          </p>
          <div className='flex flex-col items-center gap-2'>
            <SocialMedia />
            <a
              className='hidden'
              href='//www.dmca.com/Protection/Status.aspx?ID=6ab93c91-86ab-46d9-b8e7-cd2154648514'
              title='DMCA.com Protection Status'
            >
              <img
                loading='lazy'
                src='https://images.dmca.com/Badges/_dmca_premi_badge_5.png?ID=6ab93c91-86ab-46d9-b8e7-cd2154648514'
                alt='DMCA.com Protection Status'
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(FooterComponent);

export const Footer = memo(FooterComponent);

export const LogoSection = () => (
  <div className='flex items-center justify-center'>
    <Logo />
  </div>
);

export const ContactSection = ({ i18n }: { i18n?: any }) => (
  <div className='flex flex-col place-content-center justify-center space-y-2.5 text-xss font-normal leading-5 lg:items-start lg:justify-start'>
    {/* <p>{i18n.info.quick_intro}</p> */}
    {/*<p>{i18n.info.openning_hours}</p>*/}
    {/*<p>{i18n.info.pic}</p>*/}
    {/* <div className='flex justify-center gap-2 lg:justify-start items-start '>
      <IconAddress />
      <p className='text-black dark:text-white'>{i18n.info.address}</p>
    </div> */}
    <div className='flex items-center justify-center gap-2 lg:justify-start '>
      <IconEmail className="text-dark-stroke dark:text-white"/>
      <p className='text-black dark:text-white'>Email: info@uniscore.com</p>
    </div>

    {/* <div className='flex items-center justify-center gap-2 lg:justify-start'>
      <IconAddress className="text-dark-stroke dark:text-white"/>
      <p className='text-black dark:text-white'>
        277 Vo Nguyen Giap Street, Quarter 4, An Phu Ward, Thu Duc City, Ho Chi
        Minh City, Vietnam
      </p>
    </div> */}

    <div className='flex items-center justify-center gap-2 lg:justify-start'>
      <p className='pl-4 text-black dark:text-white'>
        Uniscore is considered a live score website top in the World at the
        present time. Because we help people watch Live soccer scores extremely
        quickly and accurately in any match. In addition, it also provides many
        other useful features, to easily find the football information you need.
      </p>
    </div>
    {/*<p>{i18n.info.contact}</p>*/}
    {/*<p>{i18n.info.copyright}</p>*/}
  </div>
);

export const InfoSection = ({ i18n }: { i18n?: any }) => {
  return (
    <>
      <div className='grid w-full grid-cols-6 place-content-center justify-between gap-4 text-xss font-normal text-black dark:text-white md:grid-cols-5'>
        <div className='col-span-2 flex flex-col gap-2.5 md:col-span-1'>
          <p className='mb-1 text-center font-bold text-black dark:text-[#8D8E92] md:text-left'>
            {i18n.footer.sidemap}
          </p>
          <CustomLink className='text-center md:text-left' href='/'>
            {i18n.footer.home_page}
          </CustomLink>
          <CustomLink className='text-center md:text-left' href='/'>
            {i18n.footer.live_scores}
          </CustomLink>
          <CustomLink
            className='text-center md:text-left'
            href='/football/fixtures'
          >
            {i18n.footer.schedule}
          </CustomLink>
          <CustomLink
            className='text-center md:text-left'
            href='/football/results'
          >
            {i18n.footer.result}
          </CustomLink>
          <CustomLink
            className='text-center md:text-left'
            href='/football/competition/premier-league/mfiws1aoh0uztg4'
          >
            {i18n.footer.standings}
          </CustomLink>
          <CustomLink className='text-center md:text-left' href={`/news`}>
            {i18n.footer.news}
          </CustomLink>
        </div>
        <div className='col-span-2 flex flex-col gap-2.5 md:col-span-1'>
          <p className='mb-1 text-center font-bold text-black dark:text-[#8D8E92] md:text-left'>
            {i18n.footer.sport}
          </p>
          <CustomLink className='text-center md:text-left' href={`/`}>
            {i18n.footer.football}
          </CustomLink>
          <CustomLink className='text-center md:text-left' href={`/tennis`}>
            {i18n.footer.tennis}
          </CustomLink>
          <CustomLink className='text-center md:text-left' href={`/basketball`}>
            {i18n.footer.basketball}
          </CustomLink>
          {/* <CustomLink className='text-center md:text-left' href={`/volleyball`}>
            {i18n.footer.volleyball}
          </CustomLink> */}
          <CustomLink className='text-center md:text-left' href={`/badminton`}>
            {i18n.footer.badminton}
          </CustomLink>
          {/* <CustomLink className='text-center md:text-left' href={`#`}>
            {i18n.footer.other_sports}
          </CustomLink> */}
        </div>
        <div className='col-span-2 flex flex-col gap-2.5 md:col-span-1'>
          <p className='mb-1 text-center font-bold text-black dark:text-[#8D8E92] md:text-left'>
            {i18n.footer.about_us}
          </p>
          <CustomLink
            className='text-center md:text-left'
            href={`/about-us/358`}
          >
            {i18n.footer.introduce}
          </CustomLink>
          <CustomLink className='text-center md:text-left' href={`/contact`}>
            {i18n.footer.contact}
          </CustomLink>
          <CustomLink
            className='text-center md:text-left'
            href={`/recruitment/354`}
          >
            {i18n.footer.recruitment}
          </CustomLink>
          {/* <CustomLink
            className='text-center md:text-left'
            href={`/feedback`}
          >
            {i18n.feedback.feedback}
          </CustomLink> */}
        </div>
        <div className='col-span-2 col-start-2 flex flex-col gap-2.5 md:col-span-1'>
          <p className='mb-1 text-center font-bold text-black dark:text-[#8D8E92] md:text-left'>
            {i18n.footer.policy}
          </p>
          <CustomLink
            className='text-center md:text-left'
            href={`/terms-of-service/261`}
          >
            {i18n.footer.terms_of_service}
          </CustomLink>
          <CustomLink
            className='text-center md:text-left'
            href={`/privacy-policy/344`}
          >
            {i18n.footer.privacy_policy}
          </CustomLink>
          <CustomLink
            className='text-center md:text-left'
            href={`/cookie-policy/2301`}
          >
            {i18n.footer.cookie_policy}
          </CustomLink>
          {/* <CustomLink className='text-center md:text-left' href={`/indemnity`}>
            {i18n.footer.indemnity}
          </CustomLink> */}
        </div>
        {/* <div className='col-span-2 col-start-4 flex flex-col gap-2.5 md:col-span-1'>
          <p className='mb-1 text-center font-bold text-black dark:text-[#8D8E92] md:text-left'>
            {i18n.footer.support}
          </p>
          <CustomLink className='text-center md:text-left' href={`/online-support`}>
            {i18n.footer.online_support}
          </CustomLink>
          <CustomLink className='text-center md:text-left' href={`/questions`}>
            {i18n.footer.frequently_asked_questions}
          </CustomLink>
        </div> */}
      </div>
    </>
  );
};

const imagePaths = [
  {
    icon: <FacebookLogoSVG className='h-5 w-5 text-dark-stroke dark:text-white' />,
    url: 'https://www.facebook.com/Uniscore.Official',
  },
  {
    icon: <TikTokLogoSVG className='h-5 w-5 text-dark-stroke dark:text-white' />,
    url: 'https://www.tiktok.com/@uniscore.global',
  },
  {
    icon: <InstagramLogoSVG className='h-5 w-5 text-dark-stroke dark:text-white' />,
    url: 'https://www.instagram.com/uniscore.official',
  },
  {
    icon: <XLogoSvg className='h-5 w-5 text-dark-stroke dark:text-white' />,
    url: 'https://x.com/uniscore_app',
  },
];

export const SocialMedia = () => (
  <div className='flex flex-wrap place-content-center gap-3'>
    {imagePaths.map((item, index) => (
      <UnstyledLink href={item.url} key={index}>
        {item.icon}
      </UnstyledLink>
    ))}
  </div>
);
