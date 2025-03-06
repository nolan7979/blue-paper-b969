import useTrans from '@/hooks/useTrans';

type RankingHeaderRowProps = {
  mailLabel?: string;
  statLabel?: string;
};

export const RankingHeaderRow: React.FC<RankingHeaderRowProps> = ({
  mailLabel = '',
  statLabel = '',
}) => {
  const i18n = useTrans();
  return (
    <li className='flex h-[2.375rem] w-full items-center justify-between bg-line-default dark:bg-dark-gray py-2.5 font-primary text-xss font-normal rounded-tr-md rounded-tl-md lg:rounded-none'>
      <div className='flex bg-line-default dark:bg-dark-gray pl-1.5'>
        {/* Rank */}
        <div className='flex w-4 place-content-center text-center'>#</div>

        {/* Team name */}
        <div className='w-10 bg-line-default dark:bg-dark-gray text-center lg:w-16'>
          {mailLabel || i18n.menu.team}
        </div>
      </div>

      <div className='w-fit text-center uppercase pr-2.5'>{statLabel || 'P'}</div>
    </li>
  );
};
