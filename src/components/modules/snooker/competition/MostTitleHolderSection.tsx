import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { isValEmpty } from '@/utils';
import vi from '~/lang/vi';

const MostTitleHolderSection: React.FC<{
  mostTitlesTeams: any;
  i18n: any;
  mostTitles: number;
}> = ({ mostTitlesTeams, mostTitles, i18n = vi }) => {
  const shownTeams = mostTitlesTeams.filter((team: any) => !isValEmpty(team));
  if (isValEmpty(shownTeams)) return <></>;

  return (
    <div className='space-y-2'>
      <div className='rounded-2xl  leading-4'>
        <div className='flex flex-wrap items-start justify-around '>
          {shownTeams.map((team: any, idx: number) => {
            if (!team) return <div key={idx}></div>;
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
                    <span className='px-2 text-center text-csm font-semibold dark:text-white'>
                      {team.name}
                    </span>
                    <div className='px-2 text-center  text-xs font-normal text-dark-text'>
                      {/* {i18n.competition.numberOfTitle} ({mostTitles}) */}
                      {i18n.competition.mostTitlesWon} ({mostTitles})
                    </div>
                  </div>
                </CustomLink>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MostTitleHolderSection;
