import React, { memo } from 'react';
import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { BellIcon } from '@/components/modules/football/match/BellIcon';
import { getSlug } from '@/utils';
import { CompetitorDto } from '@/constant/interface';

interface TeamSectionProps {
  team: CompetitorDto;
  isBellOn?: boolean;
  changeBellOn?: (e: React.MouseEvent<HTMLDivElement>) => void;
  showBell?: boolean;
  isHome?: boolean;
}

const TeamSection = memo(({ team, isBellOn, changeBellOn, showBell, isHome }: TeamSectionProps) => {
  const testId = isHome ? 'home-detail' : 'away-detail';
  const nameTestId = isHome ? 'home-name' : 'name';

  return (
    <div className='flex flex-1 justify-center'>
      <div className='flex flex-1 flex-col place-content-center items-center justify-start gap-2' test-id={testId}>
        <div className='relative'>
          {showBell && (
            <div className={`absolute top-6 ${isHome ? '-left-8 ' : '-right-8'}`}>
              <BellIcon isBellOn={isBellOn || false} changeBellOn={changeBellOn || (() => {})} />
            </div>
          )}
          <CustomLink
            href={team.id ? `/football/competitor/${getSlug(team.name)}/${team.id}` : '/'}
            target='_parent'
          >
            <Avatar
              id={team.id}
              type='team'
              width={50}
              height={50}
              isBackground={false}
              rounded={false}
            />
          </CustomLink>
        </div>
        <CustomLink href={`/football/competitor/${getSlug(team.name)}/${team.id}`} target='_parent'>
          <div className='text-center text-csm font-bold text-dark-dark-blue dark:text-white' test-id={nameTestId}>
            {team.shortName || team.name}
          </div>
        </CustomLink>
      </div>
    </div>
  );
});

TeamSection.displayName = 'TeamSection';

export default TeamSection;