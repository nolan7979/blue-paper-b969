import { useBasketballCategoryLeaguesData } from '@/hooks/useBasketball';

import CustomLink from '@/components/common/CustomizeLink';

export const BkbCountryLeagueRows = ({
  cate = {},
  hrefPrefix,
}: {
  cate: any;
  hrefPrefix: string;
}) => {
  const {
    data = {},
    isFetching,
    isLoading,
  } = useBasketballCategoryLeaguesData(cate?.id);

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
