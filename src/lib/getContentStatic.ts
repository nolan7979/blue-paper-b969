import axios from 'axios';
import { getCache, setCache } from '@/lib/memoryCache';

/**
 * Fetches static content from the CMS.
 *
 * @param {number} id - The ID of the page or post to fetch.
 * @param {string} [lang='vi'] - The language to fetch the content in.
 * @returns {Promise<object>} The fetched content data or a notFound object in case of an error.
 */

// `https://api.uni-tech.xyz/wp-json/wp/v2/pages/${id}`
export async function getContentStaticPage (
  slug: string,
  lang = 'vi'
): Promise<object> {
  try {
    const cacheKey = `page-${slug}-${lang}`;
    
    const cachedData = getCache(cacheKey);
    if (cachedData) {
      return cachedData;
    } else {
      const response = await axios.get(
        `https://cms.uniscore.com/wp-json/wp/v2/pages`,
        {
          params: { lang, slug },
        }
      );
      const data = response.data[0];
      setCache(cacheKey, data, 60 * 60 * 1000 * 12);

      return data;
    }
    // if (data == null) {
    //   const response = await axios.get(
    //     `https://cms.uniscore.com/wp-json/wp/v2/pages`,
    //     {
    //       params: { lang, slug },
    //     }
    //   );
    //   data = response.data[0];
    //   // await redis.set(cacheKey, JSON.stringify(data));
    // } else {
    //   data = JSON.parse(data);
    // }
  } catch (error) {
    return { data: null };
  }
}
