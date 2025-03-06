import { Images, getImage } from '@/utils';
import { useState } from 'react';
import OneSVG from '~/svg/one.svg';
import { FaBell } from 'react-icons/fa';
import MessageBoxSVG from '~/svg/message-box.svg';
import { HiPlus } from 'react-icons/hi2';
import {
  TwCard,
  TwQuickViewSection,
} from '@/components/modules/football/tw-components';
import { ManagerGeneralInfoSection } from '@/pages/football/referee/[...refereeId]';

const ManagerImageSection = ({ manager }: { manager: any }) => {
  const { id, name, logo } = manager || {};
  const [isErrorManager, setIsErrorManager] = useState<boolean>(false);

  return (
    <TwCard className='space-y-4 p-2.5'>
      <div className=' dark:text-dark-text'>
        <div className='rounded-md bg-gradient-to-t from-[#17354D] to-[#FF9081] py-8 text-center'>
          <img
            src={`${
              isErrorManager
                ? '/images/football/players/unknown1.webp'
                : `${getImage(Images.player, id)}`
            }`}
            width={196}
            height={196}
            alt='...'
            className='inline-block rounded-full'
            onError={() => setIsErrorManager(true)}
          ></img>
        </div>
        <h1 className='py-3 text-center text-xl font-bold text-black dark:text-white'>
          {name}
        </h1>
        <div className=' flex place-content-center items-center gap-x-4 rounded-full bg-light-match py-3 dark:bg-dark-match'>
          <div className='relative'>
            <MessageBoxSVG className='h-10 w-10'></MessageBoxSVG>
            <FaBell className='absolute right-0 top-0 h-5 w-5 text-logo-yellow'></FaBell>
            <OneSVG className='absolute right-0 top-0 h-3 w-3 text-red-600'></OneSVG>
          </div>
          <div className='space-y-1.5'>
            <div className='text-sm font-semibold not-italic leading-5'>
              Nhận thông tin từ HLV này
            </div>
            <div className='flex items-center gap-3'>
              <button className='flex items-center gap-1 rounded-full bg-dark-win px-3 py-2 text-csm font-medium not-italic leading-4 text-white'>
                Theo dõi <HiPlus></HiPlus>
              </button>
              <span className='flex items-center gap-1 text-csm'>
                <span className=' text-dark-win'>2.9k</span>
                <span className=' '>người theo dõi</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <TwQuickViewSection className='p-2.5'>
        <ManagerGeneralInfoSection
          manager={manager}
        ></ManagerGeneralInfoSection>
      </TwQuickViewSection>

      {/* <ManagerFormSection manager={manager}></ManagerFormSection> */}
    </TwCard>
  );
};

export default ManagerImageSection;
