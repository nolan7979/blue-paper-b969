import { WrapperBorderLinearBox } from '@/components/modules/common/tw-components/TwWrapper';

const Average = ({
  title,
  titleValue,
  leagueAverage,
  icon,
  isShowedPercent = true,
}: {
  title: string;
  titleValue: number;
  leagueAverage: string;
  icon?: JSX.Element;
  isShowedPercent?: boolean;
}) => {
  return (
    <WrapperBorderLinearBox className='flex flex-col items-center justify-center gap-1.5 px-3 py-4'>
      <div className='flex items-center justify-center gap-1'>
        <span className='flex items-center gap-1 text-csm dark:text-white'>
          <span className='text-xl font-bold'>{`${titleValue}${
            isShowedPercent ? '%' : ''
          }`}</span>
          {`${title}`}
        </span>
        {icon && icon}
      </div>
      {leagueAverage && <span className='text-csm'>{leagueAverage}</span>}
    </WrapperBorderLinearBox>
  );
};

export default Average;
