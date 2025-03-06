import Avatar from "@/components/common/Avatar";
import CustomLink from "@/components/common/CustomizeLink";
import { SportEventDtoWithStat } from "@/constant/interface";

const LeagueRow = ({
  match,
}: {
  match: SportEventDtoWithStat;
}) => {
  const { uniqueTournament } = match;

  return (
    <div className='flex items-center gap-x-1.5' test-id='match-row'>
      <div className='flex items-center gap-3'>
        <CustomLink
          href={`/cricket/competition/${uniqueTournament?.slug}/${uniqueTournament?.id}`}
          target='_parent'
        >
          <Avatar
            id={uniqueTournament?.id}
            type='competition'
            width={32}
            height={32}
            rounded={false}
            isBackground={false}
          />
        </CustomLink>
        <div>
          <h3 className='text-black dark:text-white text-[11px]'>{uniqueTournament?.name}</h3>
          { uniqueTournament?.country ? (
            <div className='flex gap-1'>
              <Avatar
                id={uniqueTournament?.country?.id}
                type='country'
                width={16}
                height={10}
                rounded={false}
                isBackground={false}
              />
              <span className='text-light-secondary uppercase text-[11px]'>{uniqueTournament?.country?.name ? uniqueTournament?.country?.name : '-'}</span>
            </div>
          ) : '--'}
        </div>
      </div>
    </div>
  );
};

export default LeagueRow;
