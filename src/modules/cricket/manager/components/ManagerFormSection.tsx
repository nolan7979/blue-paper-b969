import { TwQuickViewSection } from '@/components/modules/football/tw-components';
import {
  TwManagerFormPctText,
  TwManagerFormText,
} from '@/components/modules/football/tw-components';
import { calcPercent } from '@/utils';

const ManagerFormSection = ({ manager }: { manager: any }) => {
  const { performance = {} } = manager || {};
  const { total = 0, wins = 0, draws = 0, losses = 0 } = performance;

  return (
    <TwQuickViewSection className='space-y-2 p-2.5'>
      <div className='text-xs font-medium uppercase not-italic leading-4.5'>
        Phong độ
      </div>
      <div className='flex justify-between'>
        <div
          className='text-left'
          css={{ width: `${calcPercent(wins, total)}%` }}
        >
          <TwManagerFormText>{wins}</TwManagerFormText>
          <TwManagerFormPctText className='rounded-l-md bg-dark-win'>
            {calcPercent(wins, total)}%
          </TwManagerFormPctText>
        </div>
        <div
          className='text-center'
          css={{ width: `${calcPercent(draws, total)}%` }}
        >
          <TwManagerFormText>{draws}</TwManagerFormText>
          <TwManagerFormPctText className='place-content-center bg-dark-draw'>
            {calcPercent(draws, total)}%
          </TwManagerFormPctText>
        </div>
        <div
          className='text-right'
          css={{ width: `${calcPercent(losses, total)}%` }}
        >
          <TwManagerFormText>{losses}</TwManagerFormText>
          <TwManagerFormPctText className='place-content-end rounded-r-md bg-dark-loss'>
            {calcPercent(losses, total)}%
          </TwManagerFormPctText>
        </div>
      </div>
      <div></div>
    </TwQuickViewSection>
  );
};
export default ManagerFormSection;
