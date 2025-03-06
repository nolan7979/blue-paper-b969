import Transition from '@/components/common/Transition';
import { CupTreeMobile } from '@/components/modules/basketball/competition/CupTreeMobile';
import { RoundOf32 } from '@/components/modules/basketball/competition/rounds/RoundOf32';
import { CupTreeDto, SeasonDto } from '@/constant/interface';
import { Option, SelectTeam } from '@/components/modules/tennis/selects';
import { useMemo, useState } from 'react';
import { useCupTree } from '@/hooks/useBasketball';
import { useDetectDeviceClient } from '@/hooks/useWindowSize';
import clsx from 'clsx';

type ViewData = {
  round?: {
    description: string;
  };
  left?: ViewData;
  right?: ViewData;
  order?: number;
};

type CupTreeProps = {
  cupTree: CupTreeDto;
  selectedSeason: SeasonDto;
};

const getRoundStages = (obj: ViewData, stages: string[] = []): string[] => {
  if (obj.round?.description) {
    stages.push(obj.round.description);
  }

  if (obj.left) {
    getRoundStages(obj.left, stages);
  }

  if (obj.right) {
    getRoundStages(obj.right, stages);
  }

  const uniqueStages = Array.from(new Set(stages)).reverse();

  const hasR32or16 = uniqueStages.some(
    (stage) => stage === 'R32' || stage === 'R16'
  );

  if (hasR32or16) {
    return ['All', ...uniqueStages];
  }

  return ['All', ...uniqueStages];
};

const QuickViewFilterTabRounds = ({
  cupTree,
  selectedSeason,
}: Partial<CupTreeProps>) => {
  const [activeTab, setActiveTab] = useState('All');
  const [filterName, setFilterName] = useState<Option>({ id: '', name: '' });
  const { data, isLoading } = useCupTree(selectedSeason?.id || '');
  const { isMobile } = useDetectDeviceClient();

  const filters = useMemo(
    () =>
      data?.map((item) => ({
        id: item.name.replace(/\s+/g, ''),
        name: item.name,
      })) || [{ id: 'loading', name: 'loading' }],
    [data]
  );
  const roundNameMapping: { [key: string]: string } = {
    R32: '1/16',
    R16: '1/8',
    Quarterfinals: '1/4',
    'Semi Finals': 'Semifinals',
    Final: 'Final',
  };

  const roundDescriptions = cupTree?.views
    ? getRoundStages(cupTree.views[0][0])
    : ['All'];

  const activeIndex = roundDescriptions.indexOf(activeTab);

  const handleTabChange = (newIndex: number) => {
    setActiveTab(roundDescriptions[newIndex]);
  };

  return (
    <Transition duration={0.5}>
      {/* <div className='p-4 pb-0 pt-0'>
        <SelectTeam
          options={filters}
          valueGetter={setFilterName}
          size='full'
          isDisplayLogo={false}
        />
      </div> */}
      <div className='flex flex-col'>
        <div
          className={clsx(
            'flex w-full gap-[8px] overflow-x-scroll lg:px-4 pb-0 no-scrollbar dark:bg-dark-main',
            { 'pt-4': !isMobile }
          )}
        >
          {roundDescriptions.map((round, index) => (
            <button
              key={index}
              className={`min-w-fit overflow-x-scroll rounded-full px-4 py-2 text-sm font-medium transition-all no-scrollbar
                  ${activeTab === round
                  ? 'dark:bg-button-gradient cursor-default bg-dark-button text-white'
                  : 'dark:bg-dark-head-tab text-gray-400'
                }`}
              onClick={() => handleTabChange(index)}
            >
              {roundNameMapping[round] || round}
            </button>
          ))}
        </div>

        {activeTab === 'All' && <CupTreeMobile cupTree={cupTree} />}
        {roundDescriptions.includes(activeTab) && activeTab !== 'All' && (
          <RoundOf32
            activeTab={activeTab}
            activeIndex={activeIndex}
            totalTabs={roundDescriptions.length}
            handleTabChange={handleTabChange}
            cupTree={cupTree}
          />
        )}

        {roundDescriptions.map((round) =>
          activeTab === round ? <div key={round}></div> : null
        )}
      </div>
    </Transition>
  );
};

export default QuickViewFilterTabRounds;
