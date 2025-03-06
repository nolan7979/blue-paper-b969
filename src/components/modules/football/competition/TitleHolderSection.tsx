import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { isValEmpty } from '@/utils';

const TitleHolderSection = ({
  titleHolder,
  titleHolderTitles,
  i18n,
}: {
  titleHolder: any;
  titleHolderTitles: number;
  i18n: any;
}) => {
  if (isValEmpty(titleHolder)) return <></>;

  return (
    <div className='space-y-2'>
      <div className='rounded-2xl leading-4 '>
        <div className='flex flex-col items-center justify-around '>
          <CustomLink
            href={`/football/competitor/${titleHolder?.id}`}
            className='cursor-pointer bg-transparent'
            target='_parent'
          >
            <div className='flex flex-col items-center gap-2'>
              <Avatar
                id={titleHolder?.id}
                type='team'
                isBackground={false}
                rounded={false}
                width={40}
                height={40}
              />
              <span className='px-2 text-center  text-csm font-bold dark:text-white'>
                {titleHolder.name}
              </span>
              <div className='px-2 text-center  text-xs font-normal text-dark-text'>
                {/* {i18n.competition.titleHolder} ({titleHolderTitles}) */}
                {i18n.competition.defendingChampion} ({titleHolderTitles})
              </div>
            </div>
          </CustomLink>
        </div>
      </div>
    </div>
  );
};

export default TitleHolderSection;
