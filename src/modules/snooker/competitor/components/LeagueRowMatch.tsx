import Avatar from "@/components/common/Avatar";
import CustomLink from "@/components/common/CustomizeLink";
import { SPORT } from "@/constant/common";
import { SportEventDtoWithStat } from "@/constant/interface";
import { getSlug } from "@/utils";

const LeagueRowMatch = ({
  match,
}: {
  match: SportEventDtoWithStat;
}) => {
  const { uniqueTournament } = match;

  return (
    <div className='flex items-center gap-x-1.5' test-id='match-row'>
      <div className='flex items-center gap-3'>
        <CustomLink
          href={`/${SPORT.SNOOKER}/competition/${uniqueTournament?.slug || getSlug(uniqueTournament?.name)}/${uniqueTournament?.id}`}
          target='_parent'
          className="flex items-center gap-2"
        >
          <Avatar
            id={uniqueTournament?.id}
            type='competition'
            width={32}
            height={32}
            rounded={false}
            isBackground={false}
          />
          <div>
          <h3 className='text-black dark:text-white text-[11px]'>{uniqueTournament?.name}</h3>
            { uniqueTournament?.country && uniqueTournament?.country?.id != '' && (
              <div className='flex gap-1 items-center'>
                <Avatar
                  id={uniqueTournament?.country?.id}
                  type='country'
                  width={16}
                  height={10}
                  rounded={false}
                  isBackground={false}
                  sport={SPORT.SNOOKER}
                />
                <span className='text-light-secondary uppercase text-[11px]'>{uniqueTournament?.country?.name ? uniqueTournament?.country?.name : '-'}</span>
              </div>
            )}
          </div>
        </CustomLink>
      </div>
    </div>
  );
};

export default LeagueRowMatch;
