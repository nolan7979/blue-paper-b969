import { Listbox, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import tw from 'twin.macro';

import { checkActivePath } from '@/components/common/header';
import useTrans from '@/hooks/useTrans';
import clsx from 'clsx';
import { IconType } from 'react-icons';
import ArrowDownSVG from '/public/svg/arrow-down.svg';

interface Option {
  id: string;
  label: string;
  path: string;
  icon: IconType;
}
const SingleSelectLink = ({
  options,
  setWidth = false,
  currentPath
}: {
  options: Option[]; // Use the defined type
  currentPath: string;
  setWidth?: boolean;
}) => {
  const router = useRouter();
  const i18n = useTrans();
  const [selectedOption, setSelected] = useState<Option | null>(null);
  const asPath = currentPath.split('/')[1];
  const isActiveDropdown = options.some((v) => checkActivePath(v.path, currentPath));

  const handleOptionSelect = (option: any) => {
    setSelected(option);
    router.push(option.path); // Navigate to the selected option's path
  };

  const IconSelected = ({icon}:any) => {
    const IconComponent = icon;
    if(!IconComponent) return <></>
    return <IconComponent className='h-5 w-5' />
  }

  const getLabel = (labelKey: string) => {
    return i18n?.header?.[labelKey.replace(' ', '_').replace('-', '_') as keyof typeof i18n.header] || labelKey;
  };

  useEffect(() => {
    const initialSelectedOption = options.find(
      (option) => option.path === `/${currentPath.split('/')[1]}`
    );
    if (initialSelectedOption) {
      setSelected(initialSelectedOption);
    } else {
      setSelected(null);
    }
  }, [options, router, currentPath]);

  return (
    <div className='block'>
      <Listbox
        value={selectedOption}
        onChange={(x) => {
          setSelected(x);
        }}
      >
        {({ open }) => (
          <div className=''>
            <div className='relative w-full'>
              <Listbox.Button className='focus:ring-none relative  w-full cursor-pointer rounded-md text-center text-csm'>
                <div
                  className={clsx(
                    'relative ml-[10px] flex items-center rounded-full border-[0.082rem] bg-[#001338] pl-2 pr-3 text-white hover:brightness-150',
                    {
                      'border-solid border-[#1456FF] bg-gradient-to-tl from-[#0C1A4C] via-[#0C3089] to-[#1553EF]':
                        isActiveDropdown,
                      'border-transparent': !isActiveDropdown,
                    }
                  )}
                >
                  <div
                    className={clsx(
                      'flex h-full max-w-full cursor-pointer items-center gap-1 overflow-hidden truncate overflow-ellipsis rounded-md p-2 font-oswald text-csm uppercase xl:gap-1.5',
                      {
                        'text-white': selectedOption,
                        'text-dark-text': !selectedOption,
                      }
                    )}
                  >
                    {selectedOption
                      ? (<>
                        <IconSelected icon={options.find(it => it.id == selectedOption?.id)?.icon} />
                        {getLabel(selectedOption.label)}
                      </>)
                      : i18n.common.more}
                  </div>
                  <ArrowDownSVG
                    className={`${
                      selectedOption ? 'text-white' : 'text-dark-text'
                    } `}
                  />
                </div>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave='transition ease-in duration-100'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <Listbox.Options
                  css={[setWidth && tw`w-32`]}
                  className='absolute right-3 z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-csm shadow-lg focus:outline-none dark:bg-dark-head-tab'
                >
                  {options.map(
                    ({
                      icon: MenuIcon,
                      ...option
                    }: {
                      id: string;
                      label: string;
                      path: string;
                      icon: IconType;
                    }) => (
                      <Listbox.Option key={option?.id} value={option}>
                        <div
                          className={`item-hover relative flex cursor-pointer select-none items-center gap-2 py-1.5 pl-3 pr-3 font-oswald uppercase hover:brightness-90 ${
                            (option.id == asPath &&
                              'bg-line-dark-blue text-white hover:text-light-black hover:brightness-125 dark:bg-dark-blue dark:text-white') ||
                            'text-black dark:text-white'
                          }`}
                          onClick={() => handleOptionSelect(option)}
                        >
                          <MenuIcon className='h-5 w-5' />{' '}
                          {getLabel(option.label)}
                        </div>
                      </Listbox.Option>
                    )
                  )}
                </Listbox.Options>
              </Transition>
            </div>
          </div>
        )}
      </Listbox>
    </div>
  );
};

export default SingleSelectLink;
