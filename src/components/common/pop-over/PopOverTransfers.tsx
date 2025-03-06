/* eslint-disable @next/next/no-img-element */
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import tw from 'twin.macro';

import CustomLink from '@/components/common/CustomizeLink';

import {
  formatTimestamp,
  genTransferTexts,
  getImage,
  Images,
  isValEmpty,
} from '@/utils';
import vi from '~/lang/vi';

export default function PopoverTransfers({
  transfers = [],
  isIn = true,
  i18n = vi,
}: {
  transfers: any[];
  isIn: boolean;
  i18n?: any;
}) {
  const [err, setErr] = useState(false);
  return (
    <Menu as='div' className='relative inline-block text-left'>
      <div>
        <Menu.Button
          className=' my-auto flex w-full items-center justify-center gap-1 rounded-md'
          css={[isIn && tw`text-dark-win`, !isIn && tw`text-dark-loss`]}
        >
          <span className='font-medium'>{i18n.common.seeAll}</span>
          <HiInformationCircle className='inline-block h-5 w-5'></HiInformationCircle>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items
          className='absolute z-10 mt-2 w-80 origin-top-right rounded-md shadow-lg'
          css={[isIn && tw`left-0`, !isIn && tw`-right-20`]}
        >
          <div className=' divide-list h-96 overflow-scroll rounded-lg bg-light-match py-3 dark:bg-dark-match'>
            <div
              className='px-4 pb-3 text-sm font-bold'
              css={[isIn && tw`text-dark-win`, !isIn && tw`text-dark-loss`]}
            >
              {/* TODO i18n */}
              {isIn ? i18n.titles.latestArrivals : i18n.titles.latestDepartures}
            </div>
            {transfers &&
              transfers.map((transfer, idx: number) => {
                const {
                  player = {},
                  transferFrom = {},
                  transferTo = {},
                  transferDateTimestamp,
                  type,
                  transferFeeDescription,
                } = transfer;

                // let transferDesc = '';
                // let transferFeeText = '';
                // if (type === 0) {
                //   transferDesc = '';
                // } else if (type === 1) {
                //   transferDesc = 'Loan'; // TODO i18n
                // } else if (type === 2) {
                //   transferDesc = 'End of loan'; // TODO i18n
                // } else if (type === 3) {
                //   transferDesc = `Transfer`; // TODO i18n
                //   transferFeeText =
                //     transferFeeDescription !== '-'
                //       ? transferFeeDescription
                //       : 'Free';
                // } else if (type === 4) {
                //   transferDesc = 'Retired'; // TODO i18n
                // }
                const [transferDesc, transferFeeText] = genTransferTexts(
                  type,
                  transferFeeDescription
                );

                return (
                  <Menu.Item key={idx}>
                    {({ active }) => (
                      <CustomLink
                        href={`/football/player/${player?.id}`}
                        target='blank'
                        // css={[
                        //   active
                        //     ? 'bg-gray-100 text-gray-900'
                        //     : 'text-gray-700',
                        //   'block px-4 py-2 text-sm',
                        // ]}
                        className={`item-hover block px-3 py-2 text-sm ${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        <div className='flex'>
                          <div className='w-1/5'>
                            <img
                              src={`${
                                err
                                  ? '/images/football/players/unknown1.webp'
                                  : `${getImage(Images.player, player?.id)}`
                              }`}
                              width={36}
                              height={36}
                              alt=''
                              className='rounded-full'
                              onError={() => setErr(true)}
                            ></img>
                            {/* </CustomLink> */}
                          </div>
                          <div className='flex flex-1 justify-between font-medium'>
                            <div>
                              <div className=''>{player.name}</div>
                              <div className='flex items-center gap-1.5 text-xs text-dark-text'>
                                {transferDesc}
                                <span className='text-xs font-normal leading-4 text-dark-win'>
                                  {transferFeeText}
                                </span>
                              </div>
                            </div>
                            <div className='flex flex-col items-end justify-end gap-0.5'>
                              <div>
                                {!isValEmpty(transferFrom) &&
                                  !isValEmpty(transferTo) && (
                                    <img
                                      // src={`${
                                      //   process.env.NEXT_PUBLIC_CDN_DOMAIN_URL
                                      // }/team/${
                                      //   isIn ? transferFrom?.id : transferTo?.id
                                      // }/image`}
                                      src={getImage(
                                        Images.team,
                                        isIn ? transferFrom?.id : transferTo?.id
                                      )}
                                      width={18}
                                      height={18}
                                      alt=''
                                      className='rounded-full'
                                    ></img>
                                  )}
                              </div>
                              <div className='truncate text-xs leading-4 text-dark-text'>
                                {formatTimestamp(
                                  transferDateTimestamp,
                                  'yyyy-MM-dd'
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CustomLink>
                    )}
                  </Menu.Item>
                );
              })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
