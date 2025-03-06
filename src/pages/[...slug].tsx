/* eslint-disable unused-imports/no-unused-vars */
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';

import Seo from '@/components/Seo';

import CategoryPage from '@/modules/article/pages/Category';
import { getMetaContent } from '@/utils';
import { getCache, setCache } from '@/lib/memoryCache';

interface ICategroySlug {
  data: Record<string, any>[];
  page: any;
  typePage: string;
  categoryData: any;
  totalPages?: number;
}

const CategorySlug = ({
  data,
  page,
  categoryData,
  totalPages,
}: ICategroySlug) => {
  return (
    <>
      <Seo {...getMetaContent(categoryData)} />
      {/* <FootBallMenu /> */}
      <CategoryPage
        data={data}
        category={categoryData}
        totalPages={totalPages}
        page={page}
      />
    </>
  );
};

interface GetInitialPropsContext {
  query: ParsedUrlQuery;
  req?: any;
  res?: any;
  pathname: string;
  asPath: string;
}

interface InitialProps {
  data: Record<string, any>[];
  page: number;
  categoryData: Record<string, any>;
  totalPages: number;
  notFound?: boolean;
}

CategorySlug.getInitialProps = async (context: GetInitialPropsContext): Promise<InitialProps> => {
  try {
    const { query } = context;
    const locale = 'en'
    let totalPages = 1;
    const { page, slug } = query;
    
    if (!slug) {
      return {
        data: [],
        page: 0,
        categoryData: {},
        totalPages: 0,
        notFound: true
      };
    }

    const slugArray = Array.isArray(slug) ? slug : [slug];

    const currentPage = parseInt(page as string) || 1;
    const dataPerPage = 10;

    const cacheCategoryKey = `category-${slugArray}-${locale}`;
    const cacheTotalPagesKey = `totalPages-${slugArray}-${locale}`;
    let cachePostByCategoryKey: string;
    
    let categoryData = getCache(cacheCategoryKey);
    let postByCategoryData: any = '';

    if (!categoryData) {
      const responseCategory = await axios.get(
        `${process.env.NEXT_PUBLIC_API_CMS_URL}/categories?lang=${locale}&slug=${slugArray[0]}`
      );

      categoryData = responseCategory.data;
      setCache(cacheCategoryKey, categoryData, 60 * 60 * 1000 * 12);
    } else {
      categoryData = typeof categoryData === 'string' ? JSON.parse(categoryData) : categoryData || [];
    }

    if (Array.isArray(categoryData) && categoryData?.length > 0) {
      const cateId = categoryData[0]?.id;

      cachePostByCategoryKey = `postByCat-${slugArray}-${cateId}-${locale}`;
      postByCategoryData = getCache(cachePostByCategoryKey);
      totalPages = getCache(cacheTotalPagesKey) || 1
      if (!postByCategoryData) {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_CMS_URL}/posts?per_page=${dataPerPage}&page=${currentPage}&orderby=date&order=desc&categories=${cateId}&lang=${locale}`
        );
        totalPages = parseInt(response.headers['x-wp-totalpages'] as string) || 1;
        postByCategoryData = response.data;
        setCache(cachePostByCategoryKey, response.data, 60 * 60 * 1000 * 12);
        setCache(cacheTotalPagesKey, totalPages, 60 * 60 * 1000 * 12)

      } else {
        postByCategoryData = typeof postByCategoryData === 'string' ? JSON.parse(postByCategoryData) : postByCategoryData
        totalPages = typeof totalPages === 'string' ? JSON.parse(totalPages) : totalPages
      }
    }
    

    return {
      data: postByCategoryData,
      page: currentPage,
      categoryData: categoryData[0] || {},
      totalPages: totalPages,
    };
  } catch (error) {
    return {
      data: [],
      page: 0,
      categoryData: {},
      totalPages: 0,
      notFound: true
    };
  }
};

export default CategorySlug;
