import { TwPlayerDetailTitle } from '@/components/modules/football/tw-components';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

const StatsCollapse = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <>
          <Disclosure.Button className='flex w-full items-center justify-between rounded-lg text-left text-sm font-medium focus:outline-none'>
            <TwPlayerDetailTitle>{title}</TwPlayerDetailTitle>
            <ChevronUpIcon
              className={`${
                open ? 'rotate-180 transform' : ''
              } h-5 w-5 text-logo-blue`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className='text-sm dark:text-dark-text'>
            {children}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
export default StatsCollapse;
