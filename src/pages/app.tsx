// pages/redirect.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';

const RedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    const domain = 'https://api.uniscore.vn';
    const downloadUrl = `${domain}/app-download`; // Replace with your actual URL
    window.location.href = downloadUrl;
  }, [router]);

  return <div></div>;
};

export default RedirectPage;
