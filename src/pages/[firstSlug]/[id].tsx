/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';

import {
  TwDataSection,
  TwMainCol,
} from '@/components/modules/football/tw-components';
import Seo from '@/components/Seo';

import SubcategoryPage from '@/modules/article/pages/SubCategory';
import { getMetaContent, isNumber } from '@/utils';

const DetailPage = ({
  data,
  page = 1,
  typePage = 'category',
  categoryData,
  totalPages,
}: {
  data: any;
  page: any;
  typePage: string;
  categoryData: any;
  totalPages?: number;
}) => {
  const title = data[0]?.title?.rendered || '';
  if (typePage === 'static-page') {
    return (
      <>
        <Seo {...getMetaContent(data[0])} />
        {/* <MenuLeftSide sport={SPORT.FOOTBALL} /> */}
        <TwDataSection className='layout pb-6'>
          <div className='flex flex-col justify-center'>
            <div className='w-full py-4 text-center'>
              <h1 className='text-3xl dark:text-white'>{title}</h1>
            </div>
            <TwMainCol className='px-2.5 lg:px-0 '>
              <div
                dangerouslySetInnerHTML={{ __html: data[0]?.content?.rendered }}
              ></div>
            </TwMainCol>
          </div>
        </TwDataSection>
      </>
    );
  }
  return (
    <>
      <Seo {...getMetaContent(categoryData)} />
      {/* <MenuLeftSide sport={SPORT.FOOTBALL} /> */}
      <SubcategoryPage data={data} page={page} totalPages={totalPages} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { params, locale, query } = context;
    const { page } = query;

    const { firstSlug, id } = params as ParsedUrlQuery & {
      firstSlug: string;
      pageType: string;
      id: string;
    };

    const currentPage = parseInt(page as string) || 1;
    const paramId = parseInt(id);
    const dataPerPage = 10;

    let postByCategoryData: any;
    // let categoryData: any = await redis.get(cacheCategoryKey);
    let categoryData: any = null;
    let totalPages = 1;

    // static page under the footer
    if (isNumber(paramId)) {
      // let dataPage: any = await redis.get(cacheStaticKey);
      let dataPage: any = null;
      if (!dataPage || dataPage == null) {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_CMS_URL}/pages`,
          {
            params: { lang: locale, slug: firstSlug },
          }
        );
        dataPage = response?.data;
      } else {
        dataPage = JSON.parse(dataPage);
      }

      return {
        props: {
          data: dataPage,
          typePage: 'static-page',
        },
      };
    }

    if (categoryData == null) {
      const responseCategory = await axios.get(
        `${process.env.NEXT_PUBLIC_API_CMS_URL}/categories?lang=${locale}&slug=${id}`
      );

      categoryData = responseCategory?.data;

      // await redis.set(cacheCategoryKey, JSON.stringify(categoryData));
    } else {
      categoryData = JSON.parse(categoryData);
    }

    if (Array.isArray(categoryData) && categoryData.length > 0) {
      const cateId = categoryData[0]?.id;
      const url = `${process.env.NEXT_PUBLIC_API_CMS_URL}/posts-by-subcategory/${cateId}?lang=${locale}&slug=${id}&page=${currentPage}&perPage=${dataPerPage}`;

      // cachePostBySubCategoryKey = `postByCat-${firstSlug}-${cateId}-${locale}`;
      // postByCategoryData = await redis.get(cachePostBySubCategoryKey);
      postByCategoryData = null;

      if (postByCategoryData == null) {
        const response = await axios.get(url);

        postByCategoryData = response?.data;
        totalPages = postByCategoryData?.totalPage;
        if (postByCategoryData.length > 0) {
          // await redis.set(
          //   cachePostBySubCategoryKey,
          //   JSON.stringify(postByCategoryData)
          // );
        } else {
          return {
            notFound: true,
          };
        }
      } else {
        postByCategoryData = JSON.parse(postByCategoryData);
      }

      if (postByCategoryData) {
        const { category_parent } = postByCategoryData;

        const isSlugMismatch = category_parent?.slug !== firstSlug;
        if (isSlugMismatch && category_parent?.slug) {
          const destination = `/${category_parent?.slug}/${id}`;

          return {
            redirect: {
              destination,
              permanent: false,
            },
          };
        }
      }
    }

    return {
      props: {
        data: postByCategoryData || [],
        page: currentPage,
        categoryData: postByCategoryData[0] || {},
        totalPages: totalPages,
      },
      revalidate: 1800,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default DetailPage;
