import {
  TwDesktopView,
  TwMobileView,
} from '@/components/modules/football/tw-components';
import useTrans from '@/hooks/useTrans';
import { FaBell } from 'react-icons/fa';
import MessageBoxSVG from '/public/svg/message-box.svg';
import NotificationSVG from '/public/svg/notification.svg';
import OneSVG from '/public/svg/one.svg';

interface NotificationCardProps {
  isFollowed: boolean;
  changeFollow?: () => void;
  title?: string | React.ReactNode;
}

const NotificationCard = ({
  isFollowed,
  changeFollow,
  title,
}: NotificationCardProps) => {
  const i18n = useTrans();
  return (
    <div className='mx-auto flex w-max place-content-center items-center gap-x-4 rounded-full bg-light-match px-[1.125rem] py-4 dark:bg-dark-match md:w-full lg:dark:bg-transparent'>
      <div className='relative'>
        <TwMobileView>
          <NotificationSVG className='h-8 w-8' />
        </TwMobileView>
        <TwDesktopView>
          <MessageBoxSVG className='h-10 w-10' />
          <FaBell className='absolute right-0 top-0 h-5 w-5 text-logo-yellow' />
          <OneSVG className='absolute right-0 top-0 h-3 w-3 text-red-600' />
        </TwDesktopView>
      </div>
      <div className=''>
        <div className='text-mxs font-semibold not-italic leading-5 dark:text-dark-text md:text-csm'>
          {title || i18n.player.receiveInfo}
        </div>
        <div className='flex items-center'>
          <TwDesktopView>
            <button
              test-id='follow-button'
              className={`mx-2 flex items-center gap-1 rounded-full ${
                isFollowed ? 'bg-light-black' : 'bg-dark-win'
              } px-3 py-2 text-csm font-medium not-italic leading-4 text-white`}
              onClick={changeFollow}
            >
              {isFollowed ? (
                <span>{i18n.activity.following}</span>
              ) : (
                <span className='flex items-center gap-1'>
                  {i18n.activity.follow}
                </span>
              )}
            </button>
          </TwDesktopView>
          <span className='flex items-center gap-1 text-mxs font-bold md:text-csm'>
            <span className='text-all-blue'>2.9k</span>
            <span className='dark:text-dark-text'>
              {i18n.activity.following_users}
            </span>
          </span>
        </div>
      </div>
      <TwMobileView>
        <button
          className={`flex items-center gap-1 rounded-full ${
            isFollowed ? 'bg-light-black' : 'bg-dark-win'
          } px-3 py-2 text-csm font-medium not-italic leading-4 text-white`}
          onClick={changeFollow}
        >
          {isFollowed ? (
            <span>{i18n.activity.following}</span>
          ) : (
            <span className='flex items-center gap-1'>
              {i18n.activity.follow}
            </span>
          )}
        </button>
      </TwMobileView>
    </div>
  );
};

export default NotificationCard;
