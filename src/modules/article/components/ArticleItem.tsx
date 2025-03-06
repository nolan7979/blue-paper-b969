import CustomLink from '@/components/common/CustomizeLink';

interface ArticleItem {
  item: Record<string, any>;
  isHead?: boolean;
  isSubCategory?: boolean;
}
const ArticleItem: React.FC<ArticleItem> = ({
  item,
  isHead,
  isSubCategory,
}) => {
  return (
    <div
      className={`flex flex-col gap-y-3  p-4 ${
        !isHead &&
        'lg:after:absolute lg:after:left-0 lg:after:mt-[245px] lg:after:h-[1px] lg:after:w-full lg:after:bg-slate-300'
      }`}
    >
      <div
        className={` w-full overflow-hidden rounded-none md:rounded-md ${
          (isHead && 'h-[250px]') || 'h-[170px]'
        }`}
      >
        <CustomLink
          href={`/${item.categories[0].slug}/${item.slug}/${item?.id}`}
          target='_parent'
        >
          <img
            src={item.featured_image_url}
            alt={item?.yoast_head_json?.og_description}
            className='w-full rounded-none object-cover object-center md:rounded-md'
          />
        </CustomLink>
      </div>
      <div className='flex w-full flex-col place-content-center gap-y-2'>
        <CustomLink
          href={`/${item.categories[0].slug}/${item.slug}/${item?.id}`}
          target='_parent'
        >
          {(isSubCategory && (
            <h4
              className={`line-clamp-2 tracking-normal hover:text-logo-blue ${
                isHead ? 'text-xl font-bold' : 'text-[15px] font-semibold'
              } `}
            >
              {isSubCategory && item?.title}
            </h4>
          )) || (
            <h4
              className={`line-clamp-2 tracking-normal hover:text-logo-blue ${
                isHead
                  ? 'text-xl font-bold'
                  : 'line-clamp-2 text-[15px] font-semibold'
              } `}
              dangerouslySetInnerHTML={{
                __html: item?.title.rendered,
              }}
            ></h4>
          )}
        </CustomLink>
        {isHead && isSubCategory && (
          <div className='line-clamp-3 text-sm leading-5 tracking-normal'>
            {item?.excerpt}
          </div>
        )}
        {isHead && (
          <div
            className='line-clamp-3 text-sm leading-5 tracking-normal'
            dangerouslySetInnerHTML={{
              __html: item?.excerpt.rendered,
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default ArticleItem;
