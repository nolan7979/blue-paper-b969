import { TwQuickViewTeamH2H } from '@/components/modules/football/tw-components/TwQuickview.module';

import EmptyInboxSVG from '/public/svg/emptyInbox.svg';

interface IEmptySection {
  content: string;
}

const EmptySection: React.FC<IEmptySection> = ({ content }) => {
  return (
    <TwQuickViewTeamH2H>
      <div className='flex flex-col items-center justify-center text-center'>
        <EmptyInboxSVG className='h-26 w-26  dark:fill-light-black' />
        <span className='text-csm'>{content}</span>
      </div>
    </TwQuickViewTeamH2H>
  );
};
export default EmptySection;
export * from './EmptyEvent';
