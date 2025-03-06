import Avatar from "@/components/common/Avatar";
import CustomLink from "@/components/common/CustomizeLink";
import { useFetchLeagueData } from "@/hooks/useCommon";
import { getSlug } from "@/utils";

const LeagueRowCommon = ({
  league
}: {
  league: any
}) => {
  // const { uniqueTournament } = match;
  const { data } = useFetchLeagueData(
    league?.id || '', league?.sport || ''
  );

  const tournamentInfo = data && data?.uniqueTournament ? data?.uniqueTournament?.uniqueTournament : data;
  const isCountry = tournamentInfo?.country && tournamentInfo?.country?.id != '';
  const isCategory = tournamentInfo?.category && tournamentInfo?.category?.id != '';

  if(!data) return <></>

  return (
    <div className='mt-1 flex items-center gap-x-1.5 py-1' test-id='match-row'>
      <div className='flex items-center gap-3'>
        <CustomLink
          href={`/${league?.sport}/competition/${tournamentInfo?.slug || getSlug(tournamentInfo?.name)}/${tournamentInfo?.id}`}
          target='_parent'
        >
          <Avatar
            id={tournamentInfo?.id}
            type='competition'
            width={32}
            height={32}
            rounded={false}
            isBackground={false}
            sport={league?.sport}
          />
        </CustomLink>
        <div>
          <h3 className='text-black dark:text-white text-[11px]'>{tournamentInfo?.name}</h3>
          { isCountry && isCategory &&(
            <div className='flex gap-1 items-center'>
              <Avatar
                id={tournamentInfo?.country?.id}
                type='country'
                width={16}
                height={10}
                rounded={false}
                isBackground={false}
                sport={league?.sport}
              />
              <span className='text-light-secondary uppercase text-[11px]'>{tournamentInfo?.country?.name ? tournamentInfo?.country?.name : '-'}</span>
            </div>
          )}
          { isCountry && !isCategory &&(
            <div className='flex gap-1 items-center'>
              <Avatar
                id={tournamentInfo?.country?.id}
                type='country'
                width={16}
                height={10}
                rounded={false}
                isBackground={false}
                sport={league?.sport}
              />
              <span className='text-light-secondary uppercase text-[11px]'>{tournamentInfo?.country?.name ? tournamentInfo?.country?.name : '-'}</span>
            </div>
          )}
          { isCategory && !isCountry && (
            <div className='flex gap-1 items-center'>
              <Avatar
                id={tournamentInfo?.category?.id}
                type='country'
                width={16}
                height={10}
                rounded={false}
                isBackground={false}
                sport={league?.sport}
              />
              <span className='text-light-secondary uppercase text-[9px]'>{tournamentInfo?.category?.name ? tournamentInfo?.category?.name : '-'}</span>
            </div>
          )}
        </div>
      </div>
      {/* <div className='flex w-5  items-center justify-end' test-id='star-icon'>
        <div onClick={changeFollow}>
          {isFollowedTour ? (
            <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />
          ) : (
            <StarBlank className='inline-block h-4 w-4 cursor-pointer' />
          )}
        </div>
      </div> */}
    </div>
  );
};

export default LeagueRowCommon;
