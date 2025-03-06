import Avatar from '@/components/common/Avatar';
import CustomLink from '@/components/common/CustomizeLink';
import { getSlug } from '@/utils';

export interface TournamentRowProps {
  alt: string;
  id: string;
  disabled?: boolean;
}

export const TournamentRow = ({ alt, id, disabled }: TournamentRowProps) => {
  const slug = getSlug(alt);
  return (
    <CustomLink
      href={`/competition/${slug}/${id}`}
      className='cursor-pointer bg-transparent '
      target='_parent'
      disabled={disabled}
    >
      <div className='item-hover flex cursor-pointer items-center pr-3  lg:py-1 lg:pl-3'>
        <Avatar
          id={id}
          type='competition'
          width={24}
          height={24}
          isBackground={false}
          rounded={false}
          isSmall
        />
        <span
          className='mx-3 min-w-0 truncate text-left text-sm font-normal leading-5'
          style={{ listStyle: 'outside' }}
        >
          {alt}
        </span>
      </div>
    </CustomLink>
  );
};
