import { TwSearchInput } from '@/components/common/TwSearchInput';
import { TennisCategoryLeagues } from '@/components/modules/tennis/filters/TennisCategoryLeagues';
import useTrans from '@/hooks/useTrans';

const SearchIcon = () => {
  return (
    <svg
      width='16'
      height='17'
      viewBox='0 0 16 17'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M14.3538 14.6288L11.2244 11.5001C12.1314 10.4111 12.5837 9.01443 12.4872 7.60052C12.3906 6.18661 11.7527 4.86435 10.7061 3.9088C9.65951 2.95324 8.2848 2.43797 6.86796 2.47017C5.45113 2.50237 4.10125 3.07956 3.09913 4.08168C2.09702 5.08379 1.51983 6.43367 1.48763 7.85051C1.45543 9.26734 1.9707 10.642 2.92625 11.6887C3.88181 12.7353 5.20407 13.3732 6.61798 13.4697C8.03189 13.5662 9.42859 13.114 10.5175 12.2069L13.6463 15.3363C13.6927 15.3828 13.7479 15.4196 13.8086 15.4448C13.8693 15.4699 13.9343 15.4828 14 15.4828C14.0657 15.4828 14.1308 15.4699 14.1915 15.4448C14.2522 15.4196 14.3073 15.3828 14.3538 15.3363C14.4002 15.2899 14.4371 15.2347 14.4622 15.174C14.4874 15.1133 14.5003 15.0483 14.5003 14.9826C14.5003 14.9169 14.4874 14.8518 14.4622 14.7911C14.4371 14.7304 14.4002 14.6753 14.3538 14.6288ZM2.50002 7.98256C2.50002 7.09255 2.76394 6.22252 3.25841 5.4825C3.75287 4.74248 4.45568 4.1657 5.27795 3.82511C6.10021 3.48451 7.00501 3.3954 7.87793 3.56903C8.75084 3.74266 9.55266 4.17125 10.182 4.80058C10.8113 5.42992 11.2399 6.23174 11.4136 7.10466C11.5872 7.97757 11.4981 8.88237 11.1575 9.70464C10.8169 10.5269 10.2401 11.2297 9.50009 11.7242C8.76007 12.2186 7.89004 12.4826 7.00002 12.4826C5.80695 12.4812 4.66313 12.0067 3.8195 11.1631C2.97587 10.3195 2.50134 9.17563 2.50002 7.98256Z'
        fill='currentColor'
      />
    </svg>
  );
};

export const AllLeaguesRep = ({
  category,
  setCategory,
  allCates = [],
  hrefPrefix = '/competition',
}: {
  category: any;
  setCategory: any;
  allCates?: any;
  hrefPrefix?: string;
}) => {
  const i18n = useTrans();
  return (
    <div className=''>
      <div>
        <form className='m-3 mt-1 flex gap-2.5 rounded-md border bg-primary-alpha-01 p-2.5 leading-4 text-[#8D8E92] dark:border-transparent dark:bg-[#151820]'>
          <SearchIcon />
          <TwSearchInput
            onChange={(e) => setCategory(e.target.value)}
            placeholder={`${i18n.home.search}...`}
            className='m-auto block w-full'
            defaultValue=''
            style={{ outline: 'none' }}
          />
        </form>
      </div>
      <div className='space-y-0.5'>
        {allCates.map((cate: any) => {
          if (cate.name.toLowerCase().includes(category.toLowerCase())) {
            return (
              <TennisCategoryLeagues
                key={cate?.id}
                cate={cate}
                hrefPrefix={hrefPrefix}
              />
            );
          }
        })}
      </div>
    </div>
  );
};
