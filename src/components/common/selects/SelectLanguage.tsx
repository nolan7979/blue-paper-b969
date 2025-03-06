/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';
import CaretDown from 'public/svg/caret-down.svg';
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import tw from 'twin.macro';

import { IMAGE_CDN_PATH, LOCAL_STORAGE } from '@/constant/common';
import { optionsLanguage } from '@/constant/languages';
import { updateHtmlDir } from '@/utils';
import { getItem, setItem } from '@/utils/localStorageUtils';

// only mobile
export function SelectLanguage({
  label = 'name',
  size = 'sm',
}: {
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'max';
  shownValue?: any;
  classes?: string;
  classText?: any;
}) {
  const selectedKeyRef = useRef<string | null>(null);
  const router = useRouter();
  const [selectedOption, setSelected] = useState<any>();

  useEffect(() => {
    const savedLocale = getItem(LOCAL_STORAGE.currentLocale);
    const currentLocale = savedLocale ? JSON.parse(savedLocale) : 'en';
    const filteredOptions = optionsLanguage.find(
      (option) => savedLocale && option.alt === currentLocale || option.alt === router.locale
    );

    if (selectedKeyRef.current !== filteredOptions?.alt) {
      setSelected(filteredOptions);
      selectedKeyRef.current = filteredOptions?.alt ?? null;
    }
  }, [router.asPath, router.locale]);

  const handleChange = useCallback(
    (option: any) => {
      setSelected(option);
      const { pathname, asPath, query } = router;
      const locale = option.alt;
      router.push({ pathname, query }, asPath, { locale });
      setItem(LOCAL_STORAGE.currentLocale, JSON.stringify(locale));
      if (locale === 'ar-XA') {
        updateHtmlDir('rtl');
      } else {
        updateHtmlDir('ltr');
      }
    },
    [router]
  );

  return (
    <div className='h-9 rounded-full bg-neutral-alpha-04 px-1.5'>
      <Listbox value={selectedOption} onChange={handleChange}>
        <div className='relative flex h-full items-center'>
          <Listbox.Button className='dev relative cursor-pointer rounded-lg shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300'>
            {selectedOption && (
              <div className='flex h-full w-full flex-row items-center justify-between gap-2'>
                {selectedOption['link'] && (
                  <img
                    src={`${IMAGE_CDN_PATH}/public${selectedOption['link']}`}
                    width={24}
                    height={24}
                    loading='lazy'
                    className='h-6 w-6 rounded-full object-cover'
                    alt={selectedOption['alt']}
                  />
                )}
                <CaretDown />
              </div>
            )}
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options
              className='absolute -right-1 top-0 z-20 mt-[50px] h-auto w-max overflow-auto rounded-md bg-white py-1 text-base shadow-2xl ring-1 ring-black ring-opacity-5 no-scrollbar focus:outline-none dark:bg-dark-gray sm:text-sm lg:max-h-[calc(100vh-70px)]'
              css={[
                size === 'sm' && tw`w-44`,
                size === 'md' && tw`w-48`,
                size === 'lg' && tw`w-64`,
                size === 'xl' && tw`w-80`,
                size === 'full' && tw`w-full`,
                size === 'max' && tw`w-max`,
              ]}
            >
              {optionsLanguage.map((option: any, idx: number) => (
                <Listbox.Option
                  key={option?.id || idx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active
                        ? ' text-logo-blue'
                        : 'text-gray-900 dark:text-white'
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => {
                    if (selected === false) {
                      if (option?.id === selectedOption?.id) {
                        selected = true;
                      }
                    }
                    return (
                      <>
                        <span
                          className={`block truncate ${
                            selected
                              ? 'font-medium text-logo-blue'
                              : 'font-normal'
                          }`}
                        >
                          <div className='flex items-center gap-2 capitalize'>
                            <img
                              src={`${IMAGE_CDN_PATH}/public${option['link']}`}
                              width={24}
                              height={24}
                              loading='lazy'
                              className='h-6 w-6 rounded-full object-cover'
                              alt={option['alt']}
                            />
                            {option[label]}
                          </div>
                        </span>
                        {selected ? (
                          <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-logo-blue'>
                            <CheckIcon className='h-4 w-4' aria-hidden='true' />
                          </span>
                        ) : null}
                      </>
                    );
                  }}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
