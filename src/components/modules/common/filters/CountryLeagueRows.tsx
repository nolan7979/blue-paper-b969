import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { useCategoryLeaguesData } from '@/hooks/useCommon';
import { extractCompetitionId, getSlug } from '@/utils';
import { useMemo } from 'react';

export const CountryLeagueRows = ({
  cate = {},
  hrefPrefix,
  sport,
}: {
  cate: any;
  hrefPrefix: string;
  sport: string;
}) => {
  const { data, isFetching, isLoading } = useCategoryLeaguesData(
    cate?.id,
    sport
  );

  const leaguesData = useMemo(() => {
    if (!data) {
      return [];
    }

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.groups)) {
      return data.groups[0]?.uniqueTournaments || [];
    }

    return data?.uniqueTournaments || [];
  }, [data]);

  if (isLoading || isFetching) {
    return <></>;
  }

  return (
    <>
      <ul className='py-1'>
        {leaguesData.map((league: any) => (
          <li
            key={league?.id}
            className='flex cursor-pointer items-center gap-2 py-0.5 pl-8 pr-4 text-sm hover:bg-light-main dark:hover:bg-dark-hl-1 dark:hover:brightness-150 xl:py-1'
          >
            <CustomLink
              href={`${hrefPrefix}/${cate?.slug || getSlug(cate?.name)}/${
                league?.slug || getSlug(league?.name)
              }/${league?.id}`}
              target='_parent'
              className='flex gap-x-1'
            >
              <Avatar id={extractCompetitionId(league.id)} type='competition' height={20} width={20} isBackground={false} rounded={false}/>
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
