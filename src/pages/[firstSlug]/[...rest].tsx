import axios from 'axios';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';

import Seo from '@/components/Seo';

import ArticlePage from '@/modules/article/pages/Article';
import { getMetaContent } from '@/utils';
import { getCache, setCache } from '@/lib/memoryCache';

const DetailPage = ({ data }: { data: any }) => {
  return (
    <>
      <Seo {...getMetaContent(data)} />
      <ArticlePage data={data} />
    </>
  );
};

// add context and then redirect base on context. If dont match category return home.
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params, query } = context;
  const locale = 'en';
  const { firstSlug, rest } = params as ParsedUrlQuery & {
    firstSlug: string;
    rest: any;
  };
  const restSlugs = Array.isArray(rest) ? rest : [rest];

  const slug = restSlugs[0];
  const id = restSlugs[restSlugs.length - 1]; // Assuming the last segment is the ID

  if (slug === 'blocked-slug' && id === 'blocked-id') {
    return {
      notFound: true,
    };
  }
  try {

    // let data: any = await redis.get(cacheKey);
    // let relatedData: any = await redis.get(cacheRelatedKey);
    let data: any = null;
    let relatedData: any = null;
    const cacheKey = `post-${slug}-${locale}`;
    const cacheRelatedKey = `related-${slug}-${locale}`;
    const cacheData = getCache(cacheKey);
    const cacheRelatedData = getCache(cacheRelatedKey);
    if (data == null) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_CMS_URL}/posts?lang=${locale}&slug=${slug}`
      );
      data = response?.data;
      
      if (data.length > 0) {
        setCache(cacheKey, JSON.stringify(data), 60 * 60 * 1000 * 12)
      } else {
        return {
          notFound: true,
        };
      }
    } else {
      data = typeof cacheData === 'string' ? JSON.parse(cacheData) : cacheData
    }

    if (relatedData == null) {
      const responseRelated = await axios.get(  
        `${process.env.NEXT_PUBLIC_API_CMS_URL}/posts/${id}/related/?lang=${locale}`
      );
      relatedData = responseRelated?.data;
      setCache(cacheRelatedKey, JSON.stringify(relatedData), 60 * 60 * 1000 * 12) 
    } else {
      relatedData = typeof cacheRelatedData === 'string' ? JSON.parse(cacheRelatedData) : cacheRelatedData
    }

    return {
      props: {
        data: data[0],
        relatedData,
      }
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
export default DetailPage;
