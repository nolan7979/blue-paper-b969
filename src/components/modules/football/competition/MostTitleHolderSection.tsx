import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { isValEmpty } from '@/utils';
import { Fragment } from 'react';
import vi from '~/lang/vi';

const MostTitleHolderSection: React.FC<{
  mostTitlesTeams: any;
}> = ({ mostTitlesTeams }) => {
  const shownTeams = mostTitlesTeams.filter((team: any) => !isValEmpty(team));
  if (isValEmpty(shownTeams)) return <></>;

  return (
    <div className={`flex flex-wrap justify-center gap-4`}>
      {shownTeams.map((team: any, idx: number) => {
        if (!team) return <Fragment key={idx} />;
        return (
          <div className='flex-1' key={idx}>
            <CustomLink
              href={`/football/competitor/${team?.id}`}
              className='cursor-pointer bg-transparent no-underline'
              target='_parent'
            >
              <div className='flex flex-col items-center gap-2'>
                <Avatar
                  id={team?.id}
                  type='team'
                  width={40}
                  height={40}
                  isBackground={false}
                  rounded={false}
                />
                <span className='max-w-32 truncate px-2 text-center text-csm font-semibold dark:text-white'>
                  {team.name}
                </span>
                <div className='px-2 text-center text-xs font-normal text-dark-text'>
                  {team.title}
                </div>
              </div>
            </CustomLink>
          </div>
        );
      })}
    </div>
  );
};

export default MostTitleHolderSection;
