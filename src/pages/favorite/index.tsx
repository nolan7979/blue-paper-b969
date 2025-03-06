import Seo from '@/components/Seo';
import FavoritePageComponent from '@/modules/favorite';
import { GetServerSidePropsContext } from 'next';

const FavoritePage = () => {
  return (
    <>
      <Seo
        templateTitle={'Uniscore | Favorite'}
        description={'Favorite match, team, player, tournament,...'}
      />
      <FavoritePageComponent />
    </>
  );
};

export default FavoritePage;

FavoritePage.getInitialProps = async (context: GetServerSidePropsContext) => {
  const { res } = context;
  let isDesktop = true;
  const userAgent = context.req?.headers['user-agent'] || '';
  isDesktop = !/mobile|android|iphone|ipad/i.test(userAgent);

  try {
    const result = {
      isDesktop,
    };
    return result;
  } catch (error) {
    console.error('Error fetching static content:', error);
    return { isDesktop }; // Handle the case where fetching fails
  }
};
