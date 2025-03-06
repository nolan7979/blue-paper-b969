import { isValEmpty } from '@/utils';
import vi from '~/lang/vi';

const HostSection: React.FC<{ host: any; i18n: any }> = ({
  host,
  i18n = vi,
}) => {
  if (isValEmpty(host) || isValEmpty(host.country)) return <></>;

  return (
    <>
      <div className='text-sm font-semibold leading-5'>
        {i18n.competition.hosts}
      </div>
      <div className='flex justify-between rounded-2xl bg-light-match p-4 text-sm leading-4 dark:bg-dark-match'>
        <span>Country</span>
        <span>{host.country}</span>
      </div>
    </>
  );
};
export default HostSection;
