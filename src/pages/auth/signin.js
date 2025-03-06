import { useEffect } from 'react';
import { useRouter } from 'next/router';

const SignIn = () => {
  const router = useRouter();
  const { error, callbackUrl } = router.query;

  useEffect(() => {
    // Nếu là popup window
    if (window.opener) {
      window.opener.postMessage({
        type: 'AUTH_ERROR',
        error: error || 'Authentication failed'
      }, window.location.origin);
      window.close();
      return;
    }

    // Nếu không phải popup window, redirect về trang chủ
    const redirectUrl = '/';
    router.replace(redirectUrl);
  }, [error, router]);

  // Render một loading state hoặc trang trống
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'white' 
    }}>
      Redirecting...
    </div>
  );
};

export default SignIn; 