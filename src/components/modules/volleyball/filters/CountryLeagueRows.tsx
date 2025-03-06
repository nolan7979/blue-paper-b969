
import CustomLink from '@/components/common/CustomizeLink';
import { useCategoryLeaguesData } from '@/hooks/useCommon';

export const CountryLeagueRows = ({
  cate = {},
  hrefPrefix,
  sport
}: {
  cate: any;
  hrefPrefix: string;
  sport: string
}) => {
  const {
    data,
    isFetching,
    isLoading,
  } = useCategoryLeaguesData(cate?.id, sport);

  if (isLoading || isFetching || !data || data.length === 0) {
    return <></>;
  }
  const leagues = data[0]?.uniqueTournaments || [];

  return (
    <>
      <ul className='py-1'>
        {leagues.map((league: any) => (
          <li
            key={league?.id}
            className='flex cursor-pointer items-center gap-2 py-0.5 pl-12 pr-4 text-sm hover:bg-light-main dark:hover:bg-dark-hl-1 dark:hover:brightness-150 xl:py-1'
          >
            <CustomLink
              href={`${hrefPrefix}/${cate?.slug}/${league?.slug}/${league?.id}`}
              target='_parent'
              className=''
              // TODO: remote when competition basketball page is implemented
              disabled
            >
              <span className='inline-block w-40 truncate'>{league.name}</span>
            </CustomLink>
            <span className='text-xs'>
              {league.totalEvents && league.totalEvents !== 0
                ? league.totalEvents
                : ''}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};
