/* eslint-disable @next/next/no-img-element */
import { useTheme } from 'next-themes';
import tw from 'twin.macro';
import CustomLink from '@/components/common/CustomizeLink';
import { TwDataSection } from '@/components/modules/football/tw-components';
import { BasicLayout } from '@/components/layout';
import { PredictionBreakCrumb } from '@/modules/article/components/PredictionBreakCrumb';
import useTrans from '@/hooks/useTrans';
import { useRouter } from 'next/router';

export const TwMainColPercent = tw.section`
  w-[100%] lg:w-[60%] xl:w-[70%]
`;
export const TwSmallColOddsPer = tw.div`
  w-full
  flex flex-col
  gap-y-3
`;
export const TwCard = tw.div`
  rounded-sm
  md:rounded-xl
  border
  dark:shadow-dark-stroke
  dark:border-dark-stroke
  dark:bg-dark-sub-bg-main
  bg-light
  border-light-line-stroke-cd
  text-[#555]
  dark:text-[#aaa]
`;
const ArticlePage = ({
  data,
  dataRelated,
}: {
  data: any;
  dataRelated?: any;
}) => {
  const i18n = useTrans();
  const router = useRouter();
  const { locale } = router;
  const categories = [
    { id: 1, slug: 'tin-tuc' },
    { id: 2, slug: 'nhan-dinh' },
    { id: 3, slug: 'soi-keo' },
    { id: 4, slug: 'tips' },
  ];
  if (dataRelated?.length > 5) {
    dataRelated = dataRelated.slice(0, 5);
  }
  const { resolvedTheme } = useTheme();

  return (
    <div className=''>
      {/*<FootBallMenu />*/}
      <PredictionBreakCrumb data={data} />
      <TwDataSection className='layout !mt-0 flex-col gap-y-4 lg:flex-row lg:leading-7'>
        <TwMainColPercent
          className={`${resolvedTheme === 'dark' ? 'cssFromWpDark' : 'cssFromWp'
            } space-y-2`}
        >
          <TwCard className='rounded-md'>
            <div className='flex flex-col p-4 md:px-20'>
              <div className=''>
                <h1
                  className='text-xl !font-bold leading-normal text-black dark:text-white'
                  dangerouslySetInnerHTML={{
                    __html: data?.title?.rendered,
                  }}
                ></h1>
                <div className='mb-2 flex items-center gap-2 py-1.5'>
                  <div className='h-10 w-10 rounded-full'>
                    <img
                      src={data?.author?.avatar}
                      alt=''
                      className='h-10 w-10 rounded-full object-cover'
                    />
                  </div>
                  <div className='capitalize'>{data?.author?.name}</div>
                </div>
              </div>
              <div className=' flex-1'>
                <div
                  className='space-y-3 font-normal'
                  dangerouslySetInnerHTML={{
                    __html: data?.content?.rendered,
                  }}
                ></div>
              </div>
            </div>
          </TwCard>
          {/* <TwCard className='px-3 py-4'>
            <div className='flex items-center justify-between'>
              <p className='text-logo-blue'>1 bình luận</p>
              <div className='flex items-center gap-2'>
                <p>Sắp xếp theo:</p>
                <Select
                  options={[
                    { id: 1, name: 'Cũ nhất' },
                    { id: 2, name: 'Mới nhất' },
                  ]}
                />
              </div>
            </div>
            <div className='flex gap-3 py-5'>
              <div className='h-12 w-12 rounded-full'>
                <img
                  src='https://api.uni-tech.xyz/wp-content/uploads/2023/08/Rectangle-284.png'
                  alt=''
                  className='h-12 w-12 rounded-full'
                />
              </div>
              <textarea
                placeholder='Thêm bình luận'
                className=' h-16 flex-1 rounded-lg border-none bg-light-match dark:bg-dark-match lg:border-[1px] lg:border-solid lg:border-logo-blue'
              />
            </div>
            <div className='flex gap-3'>
              <div className='h-12 w-12 rounded-full'>
                <img
                  src='https://api.uni-tech.xyz/wp-content/uploads/2023/08/Rectangle-285.png'
                  alt=''
                  className='h-12 w-12 rounded-full'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-col'>
                  <p className='font-bold'>Trang JR</p>
                  <p>Kèo này chắc thắng rồi MU của tôi hay quá!</p>
                </div>
                <div className='flex gap-3'>
                  <button className='text-logo-blue'>Like</button>
                  <button className='text-logo-blue'>Comment</button>
                  <p className='text-[#aaa]'>2 hours</p>
                </div>
              </div>
            </div>
          </TwCard> */}
        </TwMainColPercent>

        <TwSmallColOddsPer className='w-full lg:flex-1'>
          <TwCard className='h-fit px-4 py-2'>
            <div className='mb-1'>
              <h4>{i18n.article.relatedArticles}</h4>
            </div>
            <div className='flex flex-col gap-4'>
              {dataRelated?.map((item: any, index: number) => {
                const keysFromItem = parseInt(
                  Object.keys(item.categories)[0],
                  10
                );
                const category_slug = categories.find(
                  (cat) => cat?.id === keysFromItem
                );
                return (
                  <div className='flex items-center gap-3' key={index}>
                    <div className='w-[40%] rounded-md'>
                      <CustomLink
                        href={`/${category_slug?.slug}/${item.slug}-i${item?.id}`}
                        target='_parent'
                      >
                        <img
                          src={item.featured_image_url}
                          alt=''
                          className='h-full w-full rounded-md object-cover'
                        />
                      </CustomLink>
                    </div>
                    <div className='flex-1'>
                      <CustomLink
                        href={`/${category_slug?.slug}/${item.slug}-i${item?.id}`}
                        target='_parent'
                      >
                        <p className='line-clamp-3 hover:text-logo-blue'>
                          {item.title}
                        </p>
                      </CustomLink>
                    </div>
                  </div>
                );
              })}
            </div>
          </TwCard>
          <TwCard className='h-fit p-4'>
            <div className='flex flex-col items-center justify-center gap-y-2'>
              <div className='h-16 w-16 rounded-full object-cover'>
                <img
                  src={data?.author?.avatar}
                  alt=''
                  className='h-16 w-16 rounded-full object-cover'
                />
              </div>
              <p className='font-bold capitalize leading-5'>
                {data?.author?.name}
              </p>
              <p className=''>{i18n.article.author}</p>
              <p className='text-center'>{data?.author?.description}</p>
            </div>
            <div className='mt-7 flex items-center justify-between'>
              <div className='flex gap-x-1'>
                <p>{data?.author?.count}</p>
                <p className='text-[#aaa]'>
                  {i18n.article.posts}
                  {locale == 'en' && data?.author?.count > 1 && 's'}
                </p>
              </div>
              {/* <div className='flex items-center'>
                <button className='flex items-center gap-2 text-logo-blue hover:cursor-pointer'>
                  <p>{i18n.filter.following}</p>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='4'
                    height='6'
                    viewBox='0 0 4 6'
                    fill='none'
                  >
                    <g clipPath='url(#clip0_413_80622)'>
                      <path
                        d='M3.70527 2.44285L0.74678 0.161247C0.610151 0.0558051 0.472488 -2.06531e-08 0.358063 -1.56514e-08C0.136844 -5.98163e-09 8.74249e-09 0.200005 2.33763e-08 0.534787L2.38926e-07 5.46599C2.53543e-07 5.80038 0.136675 6 0.357376 6C0.471973 6 0.607439 5.94415 0.74437 5.83841L3.70424 3.55686C3.89459 3.40989 4 3.21212 4 2.99973C4.00004 2.78749 3.89583 2.58977 3.70527 2.44285Z'
                        fill='#2187E5'
                      />
                    </g>
                    <defs>
                      <clipPath id='clip0_413_80622'>
                        <rect
                          width='6'
                          height='4'
                          fill='white'
                          transform='translate(0 6) rotate(-90)'
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div> */}
            </div>
          </TwCard>
        </TwSmallColOddsPer>
      </TwDataSection>
    </div>
  );
};

// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//     paths: [],
//     fallback: 'blocking',
//   };
// };

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   try {
//     let id;
//     if (params && params.slug) {
//       id = params.slug[0]
//         .split('-')
//         [params.slug[0].split('-').length - 1].substring(1);
//       // Tiếp tục xử lý với biến id ở đây
//     } else {
//       id = null;
//     }
//     const response = await axios.get(
//       `https://api.uni-tech.xyz/wp-json/wp/v2/posts/${id}`
//     );

//     const data = response.data;

//     if (params && params.slug) {
//       if (params.slug[0] !== `${data.slug}-i${data?.id}`) {
//         return {
//           redirect: {
//             destination: '/',
//             permanent: false,
//           },
//         };
//       }
//     }
//     const responseRelated = await axios.get(
//       `https://api.uni-tech.xyz/wp-json/wp/v2/posts/${id}/related`
//     );
//     const dataRelated = responseRelated.data;

//     return {
//       props: {
//         key: id,
//         data,
//         dataRelated,
//         revalidate: 1800,
//       },
//     };
//   } catch (error) {
//     return {
//       notFound: true,
//     };
//   }
// };
ArticlePage.Layout = BasicLayout;
export default ArticlePage;
