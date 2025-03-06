import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ReloadAtMidnight = () => {
  const router = useRouter();

  useEffect(() => {
    const calculateTimeUntilMidnight = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // Set to the next midnight
      return midnight.getTime() - now.getTime();
    };

    const timeUntilMidnight = calculateTimeUntilMidnight();

    const timeoutId = setTimeout(() => {
      router.reload();
    }, timeUntilMidnight);

    // Clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [router]);

  return null;
};

export default ReloadAtMidnight;
