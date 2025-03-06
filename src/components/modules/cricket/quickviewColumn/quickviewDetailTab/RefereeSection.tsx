import Avatar from '@/components/common/Avatar';
import {
  TwBorderLinearBox,
  TwQuickViewSection,
  TwQuickViewTitleV2,
} from '@/components/modules/football/tw-components';

import { isValEmpty } from '@/utils';

import vi from '~/lang/vi';

const RefereeSection = ({
  matchData,
  i18n = vi,
}: {
  matchData?: any;
  i18n?: any;
}) => {
  const { referee = {} } = matchData || {};
  const { name = '', country = {} } = referee;
  const { alpha2 = '' } = country;

  if (isValEmpty(referee)) {
    return <></>;
  }

  return (
    <div className='space-y-2'>
      <TwQuickViewTitleV2 className=''>
        {i18n.titles.referee}
      </TwQuickViewTitleV2>
      <TwBorderLinearBox className='border dark:border-0 border-line-default dark:border-linear-box bg-white dark:bg-primary-gradient'>
        <TwQuickViewSection className='space-y-3 p-4 text-sm'>
          {/* <div className='flex justify-between  dark:text-dark-text'>
          <div>{i18n.qv.name}</div>
          <div>{i18n.qv.avg_cards}</div>
        </div> */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <div className='inline-block'>
                <Avatar
                  id={referee?.id}
                  width={20}
                  height={20}
                  type='player'
                  isSmall
                />
              </div>
              <span className='!mx-2 text-sm font-medium'>{name}</span>
            </div>
            {/* <div className='flex gap-8'>
            <div className='flex items-center gap-1'>
              <RedCard size='md' numCards={1} />
              <span>{Number(redCards / games).toFixed(1)}</span>
            </div>
            <div className='flex items-center gap-1'>
              <YellowCard size='md' numCards={1} />
              <span>{Number(yellowCards / games).toFixed(1)}</span>
            </div>
          </div> */}
          </div>
        </TwQuickViewSection>
      </TwBorderLinearBox>
    </div>
  );
};
export default RefereeSection;
