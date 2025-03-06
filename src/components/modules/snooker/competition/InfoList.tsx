import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { Images, getSlug, isValEmpty } from '@/utils';
import { cn } from '@/utils/tailwindUtils';

const InfoList: React.FC<{
  newComers: any[];
  type: string;
  title?: string;
  className?: string; 
}> = ({ newComers, type = 'team', title = '', className }) => {
  if (isValEmpty(newComers)) return <></>;

  return (
    <div className='space-y-4 w-full'>
      <div className='pb-1 text-sm font-bold dark:text-white'>{title}</div>
      <div className={cn('rounded-md bg-light p-4 px-5 dark:bg-[#020C20] flex  justify-between items-center', className)}>
        {newComers.map((comer: any, idx: number) => {
          if (!comer) return <></>;
          return (
            <div key={idx} className=''>
              <CustomLink
                href={
                  type === 'team'
                    ? `/football/competitor/${getSlug(comer?.name)}/${comer?.id}`
                    : `/football/competition/${comer?.id}`
                }
                className='cursor-pointer bg-transparent no-underline'
                target='_parent'
              >
                <div className='flex items-center gap-2'>
                  <Avatar
                    id={comer?.id}
                    type={type as keyof typeof Images}
                    width={36}
                    height={36}
                    isBackground={false}
                    rounded={false}
                    isSmall
                  />
                  <span className='text-center text-csm font-semibold dark:text-white'>
                    {comer.name}
                  </span>
                </div>
              </CustomLink>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InfoList;
