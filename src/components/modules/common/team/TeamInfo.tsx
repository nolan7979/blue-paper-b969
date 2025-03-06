import AvatarTeamCommon from "@/components/common/AvatarTeamCommon";
import Circle from "@/components/common/skeleton/Circle";
import Rectangle from "@/components/common/skeleton/Rectangle";
import { TwQuickviewTeamName } from "@/components/modules/football/quickviewColumn/QuickViewColumn";
import { SPORT } from "@/constant/common";
import { cn } from "@/utils/tailwindUtils";
import { memo } from "react";

export const TeamInfo = memo(
  ({ team, isMobile = false, type = 'home', isSubPage = false }: { team: any; isMobile?: boolean; type: 'away' | 'home', isSubPage?: boolean }) => {
    if (!team)
      return (
        <div className='flex flex-1 place-content-center items-center justify-end gap-x-3 lg:flex-col-reverse lg:justify-center lg:gap-2'>
          <Rectangle classes='h-4 w-32' />
          <div className='relative'>
            <Circle classes='w-[56px] h-[56px]' />
          </div>
        </div>
      );

    return (
      <div className={`flex flex-1 place-content-center items-center justify-end gap-x-3 lg:flex-col-reverse lg:justify-center lg:gap-2 ${type === 'away' ? 'flex-row-reverse' : ''}`}>
        <TwQuickviewTeamName className={cn("text-white lg:text-black dark:lg:text-white", {
          'text-dark-dark-blue': isSubPage,
          'text-white': !isSubPage,
        })}>{team.shortName || team.name}</TwQuickviewTeamName>
        <div className='relative'>
          <AvatarTeamCommon team={team} sport={SPORT.FOOTBALL} size={isMobile ? 46 : 56} />
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.team?.id === nextProps.team?.id && prevProps.isMobile === nextProps.isMobile && prevProps.isSubPage === nextProps.isSubPage;
  }
);
