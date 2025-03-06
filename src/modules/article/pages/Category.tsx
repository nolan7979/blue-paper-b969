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
import { useSportName } from '@/hooks';
import ArticleItem from '@/modules/article/components/ArticleItem';
import EmptyData from '@/modules/article/components/EmptyData';
import { useRouter } from 'next/router';

interface ICategoryPageProps {
  data: Record<string, any>;
  category: any;
  totalPages: any;
  page: any;
}

const CategoryPage: React.FC<ICategoryPageProps> = ({
  data,
  category,
  totalPages,
  page,
}) => {
  const router = useRouter();
  const sport = useSportName();
  const { slug } = router.query;
  const pageComingSoon =
    slug &&
    ['indemnity', 'online-support', 'questions'].includes(
      slug[0]
    );
  const titleSlug = slug && slug[0].split('-').join(' ');
  const handleChange = (value: number) => {
    router.push({
      pathname: `/${slug && slug[0]}`,
      search: `page=${value}`,
    });
  };

  if (pageComingSoon) {
    return (
      <TwDataSection className='layout'>
        <TwSmallColOddsPred className='flex-shrink-1'>
          <Subcategory category={category} data={data[0]?.categories}  sport={'football'}/>
        </TwSmallColOddsPred>
        <TwMainCol>
          <TwCard className='rounded-md p-4 text-center'>
            <h1 className='capitalize text-2xl pb-6 font-semibold'>{titleSlug}</h1>
            <h2 className='text-xl'>Coming soon...</h2>
          </TwCard>
        </TwMainCol>
      </TwDataSection>
    );
  }

  return (
    <TwDataSection className='layout'>
      <TwSmallColOddsPred className='flex-shrink-1'>
        <Subcategory category={category} data={data[0]?.categories}  sport={'football'}/>
      </TwSmallColOddsPred>
      {(data.length > 0 && (
        <TwMainCol>
          <TwCard className='h-full rounded-md'>
            <div className='divide-list'>
              <div className='grid grid-cols-1 rounded-md  md:grid-cols-2 md:flex-row'>
                {data &&
                  data.slice(0, 2).map((item: any, idx: number) => {
                    return (
                      <ArticleItem item={item} key={`article-${idx}`} isHead />
                    );
                  })}
              </div>
              <div className='h-full p-2.5'>
                <TwNewsGrid>
                  {data &&
                    data
                      .slice(2)
                      .map((item: any, index: number) => (
                        <ArticleItem item={item} key={`article-${index}`} />
                      ))}
                </TwNewsGrid>
                <Divider height='0.5' />
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
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
export default CategoryPage;
