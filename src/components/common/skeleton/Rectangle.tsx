interface RectangleProps {
  classes: string; // should include width, height and something like mx my px py ...
  fullWidth?: boolean;
}
import { useEffect, useState } from 'react';

const Rectangle: React.FC<RectangleProps> = ({ classes, fullWidth }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <div
      className={`flex animate-pulse ${
        fullWidth ? 'w-full justify-center' : 'w-min'
      } ${classes}`}
    >
      {isHydrated ? (
        <div
          className={`dark:bg-primary-gradient dark:border-linear-box rounded-sm bg-[#ccc] ${classes}`}
        ></div>
      ) : null}
    </div>
  );
};

export default Rectangle;
