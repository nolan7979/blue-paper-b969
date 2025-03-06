import { useState } from 'react';

const useToggle = () => {
  const [isDisplayed, setIsDisplayed] = useState(false);

  const toggleDisplay = (e: boolean) => {
    setIsDisplayed(e || !isDisplayed);
  };

  return { isDisplayed, toggleDisplay };
};

export default useToggle;
