import useTrans from '@/hooks/useTrans';

import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/common';

import { getSlug, isCountryName } from '@/utils';

const LeagueBreadcrumb = ({ tournament }: { tournament: any }) => {
  const i18n = useTrans();
  const { category = {}, name, id, slug } = tournament || {};

  return (
    <div className='hidden py-3 dark:bg-none lg:block'>
      <BreadCrumb className='layout'>
        <BreadCumbLink href='/' name={i18n.common.football}></BreadCumbLink>
        <BreadCrumbSep></BreadCrumbSep>
        <div className=' flex items-center gap-2 truncate text-xs font-extralight'>
          {category && category?.id && isCountryName(category.name) && (
            <BreadCumbLink
              href={`/football/country/${getSlug(category.name)}/${category?.id
                }`}
              name={category ? category.name : ''}
            />
          )}
          {category && category?.id && isCountryName(category.name) && (
            <BreadCrumbSep></BreadCrumbSep>
          )}
          <BreadCumbLink
            href={`/football/competition/${slug}/${id}`}
            name={`${tournament.name}`}
            isEnd={true}
          />
        </div>
      </BreadCrumb>
    </div>
  );
};
export default LeagueBreadcrumb;
