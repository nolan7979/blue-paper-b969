import { TwButtonIcon } from '@/components/buttons/IconButton';
import MatchSimulationIframe from '@/components/modules/football/match/MatchSimulationIframe';
import { useMatchStore, useSitulations } from '@/stores';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CloseSVG from '~/svg/close-x.svg';
import ZoomOutSVG from '~/svg/zoom-out.svg';

const SimulationColumn: React.FC<{ sport?: string }> = ({ sport }) => {
  const { situlations, clearSitulations, deleteSitulations } = useSitulations();
  const { selectedMatch, setShowSelectedMatch, setSelectedMatch } =
    useMatchStore();
  const router = useRouter();
  
  const handleClickShowDetail = (id: string) => {
    const isCurrentMatchSelected = `${id}` === `${selectedMatch}`;
    if (!isCurrentMatchSelected) {
      setShowSelectedMatch(true);
      setSelectedMatch(`${id}`);
    }
  };

  useEffect(() => {
    if (situlations.length > 0) {
      clearSitulations()
    }
  }, [router.asPath]);


  if (situlations.length === 0) {
    return <></>;
  }
  return (
    <div className='no-scrollbar sticky top-20 max-w-[279px] lg:h-[calc(100vh-70px)] lg:overflow-y-scroll'>
      <div className='space-y-4'>
        {situlations.map((id, index) => (
          <div key={`match-live-${id}-${index}`}>
            <div className='flex items-center justify-between rounded-t-lg px-1.5 py-1  dark:bg-dark-gray'>
              <div onClick={() => handleClickShowDetail(id)}>
                <TwButtonIcon icon={<ZoomOutSVG />} className='h-3 w-3 !pb-0' />
              </div>
              <TwButtonIcon
                onClick={() => deleteSitulations(id)}
                icon={<CloseSVG />}
                className='h-3 w-3 !pb-0'
              />
            </div>
            <MatchSimulationIframe
              id={id}
              mode='2d'
              className='bg-dark-main lg:rounded-b-lg'
              height='190px'
              sport={sport}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default SimulationColumn;
