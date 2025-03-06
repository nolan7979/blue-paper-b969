import { useHomeStore } from "@/stores";
import { useLivescoreStore } from "@/stores/liveScore-store";
import { useEffect, useState } from "react";

type UseParsedMatchesProps = {
  parseMatchesData: (data: string) => void;
  dataAPI?: string;
};

export const useParsedMatches = ({ parseMatchesData, dataAPI }: UseParsedMatchesProps) => {
  const [isDesktopClient, setIsDesktopClient] = useState<boolean | undefined>(undefined);
  const { setMatches } = useHomeStore();
  const { removeAllLivescore } = useLivescoreStore();

  useEffect(() => {
    setMatches([]);
  }, []);

  useEffect(() => {
    if (dataAPI) {
      const parsedMatches = parseMatchesData(dataAPI);
      setMatches(parsedMatches);
      removeAllLivescore();
    }
  }, [dataAPI, parseMatchesData, setMatches, removeAllLivescore]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopClient(window.innerWidth >= 768);
    };

    handleResize(); // Check initial width

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isDesktopClient };
};