import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/common';

export const PredictionBreakCrumb = ({ data }: { data: any }) => {
  return (
    <div className='hidden py-3 dark:bg-none lg:block'>
      <BreadCrumb className='layout'>
        <BreadCumbLink
          href={`/${data?.categories[0]?.slug}`}
          name={data?.categories[0]?.name}
        ></BreadCumbLink>
        <BreadCrumbSep></BreadCrumbSep>
        {data?.categories.length > 1 ? (
          <>
            <BreadCumbLink
              name={data?.categories[1]?.name}
              isEnd={true}
            ></BreadCumbLink>
            <BreadCrumbSep></BreadCrumbSep>
          </>
        ) : (
          <></>
        )}
        <div className=' flex items-center gap-2 truncate text-xs font-extralight'>
          <BreadCumbLink name={data?.title.rendered} isEnd={true} />
        </div>
      </BreadCrumb>
    </div>
  );
};
