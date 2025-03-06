import { useRouter } from 'next/router';
import * as Sentry from '@sentry/nextjs';

function Error({ statusCode }) {
  const router = useRouter();
  const isProd = process.env.NEXT_PUBLIC_NODE_ENVIRONMENT === 'production';
  
  // Redirect to the homepage if statusCode indicates a client-side error
  if (!statusCode || statusCode >= 400) {
    if (isProd) Sentry.captureException(statusCode);
    router.push('/');
    return null; // Return null to avoid rendering the error message
  }

  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client'}
    </p>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
