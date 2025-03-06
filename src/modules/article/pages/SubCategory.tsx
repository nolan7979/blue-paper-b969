import Pagination from '@/components/common/pagination';
import {
  TwNewsGrid,
  TwSmallColOddsPred,
} from '@/components/modules/football/odds/soi-keo';
import { Subcategory } from '@/components/modules/football/odds/soi-keo/Subcategory';
import {
  TwCard,
  TwDataSection,
  TwMainCol,
} from '@/components/modules/football/tw-components';
import { Divider } from '@/components/modules/football/tw-components/TwPlayer';
import ArticleItem from '@/modules/article/components/ArticleItem';
import EmptyData from '@/modules/article/components/EmptyData';
import { useRouter } from 'next/router';

interface ISubcategoryPageProps {
  data: Record<string, any>;
  category?: any;
  page: number;
  totalPages?: number;
}

const SubcategoryPage: React.FC<ISubcategoryPageProps> = ({
  data,
  category,
  page,
  totalPages,
}) => {
  const router = useRouter();
  const { firstSlug, id } = router.query;

  const handleChange = (value: number) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('page', value.toString());

    router.push({
      pathname: `/${firstSlug}/${id}`,
      search: queryParams.toString(),
    });
  };
  return (
    <TwDataSection className='layout'>
      <TwSmallColOddsPred className='flex-shrink-1'>
        <Subcategory
          category={data?.category_parent}
          data={data?.subcategories}
          sport={'football'}
        />
      </TwSmallColOddsPred>
      {(data?.posts && data.posts.length > 0 && (
        <TwMainCol>
          <TwCard className='h-full rounded-md'>
            <div className='divide-list'>
              <div className='grid grid-cols-1 rounded-md dark:bg-dark-match md:grid-cols-2 md:flex-row'>
                {data?.posts &&
                  data?.posts.slice(0, 2).map((item: any, idx: number) => {
                    return (
                      <ArticleItem
                        item={item}
                        key={`article-${idx}`}
                        isHead
                        isSubCategory
                      />
                    );
                  })}
              </div>
              <div className='h-full p-2.5'>
                <TwNewsGrid>
                  {data?.posts &&
                    data?.posts
                      .slice(2)
                      .map((item: any, index: number) => (
                        <ArticleItem
                          item={item}
                          key={`article-${index}`}
                          isSubCategory
                        />
                      ))}
                </TwNewsGrid>
                <Divider height='0.5' />
                <Pagination
                  currentPage={page}
                  totalPages={totalPages || 1}
                  onPageChange={handleChange}
                />
              </div>
            </div>
          </TwCard>
        </TwMainCol>
      )) || <EmptyData />}
    </TwDataSection>
  );
};

export default SubcategoryPage;
