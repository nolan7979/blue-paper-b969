import CustomLink from '@/components/common/CustomizeLink';

export const TwBreadcrumbRaw = ({
  link,
  name,
}: {
  link: string;
  name: string;
}) => {
  return (
    <CustomLink href={link} target='_parent'>
      <span className='hover:text-logo-blue hover:underline'>{name}</span>
    </CustomLink>
  );
};
