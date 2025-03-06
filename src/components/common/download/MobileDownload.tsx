import CustomLink from '@/components/common/CustomizeLink';
import { Logo } from '@/components/common/Logo';
import useTrans from '@/hooks/useTrans';

interface MobileDownloadProps {
  type: 'ios' | 'android'; // Define the type explicitly
  showDrawer?: boolean;
  setShowDrawer?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Urls {
  ios: string;
  android: string;
}

const url: Urls = {
  ios: 'https://apps.apple.com/us/app/uniscore/id6475382945',
  android: 'https://play.google.com/store/apps/details?id=com.unity.uniscore',
};

// mobile download have 2 position : in drawer mobile notifications and in the drawer mobile
function MobileDownload({ type, setShowDrawer }: MobileDownloadProps) {
  const i18n = useTrans();

  return (
    <div className='px-4 py-4'>
      <div
        className={`flex flex-col items-center justify-center gap-4 ${
          setShowDrawer ? 'text-white' : 'text-gray-600'
        }`}
      >
        <Logo />
        <div className='flex flex-col items-center justify-center gap-1 px-4'>
          <p className='text-sm dark:text-white'>
            {i18n.mobileDownload.get_more_from_favourites}
          </p>
          <p className='text-center text-xs text-gray-300'>
            {i18n.mobileDownload.setup_push_notifications}
          </p>
        </div>
      </div>
      {setShowDrawer ? (
        <div className='mt-4 grid grid-cols-2 gap-4 text-sm'>
          <button
            className='rounded-md border border-solid border-white py-2 text-white'
            onClick={() => {
              setShowDrawer(false);
              localStorage.setItem('showDrawer', 'true');
            }}
          >
            {i18n.mobileDownload.not_now}
          </button>
          <CustomLink href={url[type]} target='_parent'>
            <button className='w-full rounded-md bg-[#95C6F3] py-2 text-black'>
              {i18n.mobileDownload.download}
            </button>
          </CustomLink>
        </div>
      ) : (
        <div className='flex justify-center'>
          <CustomLink href={url[type]} target='_parent'>
            <button className='mt-2 rounded-md bg-[#95C6F3] px-4 py-2 text-black'>
              {i18n.mobileDownload.download}
            </button>
          </CustomLink>
        </div>
      )}
    </div>
  );
}

export default MobileDownload;
