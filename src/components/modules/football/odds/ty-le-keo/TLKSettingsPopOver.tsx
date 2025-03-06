import { Popover, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import tw from 'twin.macro';
import { Alert, Toast } from 'flowbite-react';

import { SwitcherButton } from '@/components/common/odds/SwitcherButton';

import { useSettingsStore } from '@/stores';

import { audioArray } from '@/constant/audioArray';

import useTrans from '@/hooks/useTrans';
import SettingsSVG from '/public/svg/setting.svg';
import { HiCheck } from 'react-icons/hi';
import { useToast } from '@/components/toast/ToastProvider';
import { isShowOdds } from '@/utils';
import { useConvertPath } from '@/hooks/useConvertPath';

export function TLKSettingsPopOver() {
  return (
    <Popover className='relative'>
      {({ open }) => (
        <>
          <Popover.Button
            className={`
                ${open ? '' : 'text-opacity-90'}
                group inline-flex h-full items-center  rounded-md px-2 py-1 text-base font-medium focus:outline-none focus:ring-1 focus:ring-dark-text/30 dark:text-white`}
          >
            <div className='hover:brightness-125'>
              <SettingsSVG className='h-6 w-6'></SettingsSVG>
            </div>
          </Popover.Button>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-200'
            enterFrom='opacity-0 translate-y-1'
            enterTo='opacity-100 translate-y-0'
            leave='transition ease-in duration-150'
            leaveFrom='opacity-100 translate-y-0'
            leaveTo='opacity-0 translate-y-1'
          >
            <Popover.Panel className='absolute right-0 z-40 mt-2 w-72 px-4 sm:px-0 lg:left-0 lg:max-w-3xl'>
              <TLKSettingItems></TLKSettingItems>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

export const TLKSettingItems = () => {
  const {
    showHdp,
    setShowHdp,
    show1x2,
    setShow1x2,
    showTX,
    setShowTX,
    // showFavorite,
    // setShowFavorite,
    // homeSound,
    // setHomeSound,
    // awaySound,
    // setAwaySound,
    // goalPrompt,
    // setGoalPrompt,
    showYellowCard,
    setShowYellowCard,
    showRedCard,
    setShowRedCard,
  } = useSettingsStore();
  const path = useConvertPath();
  const i18n = useTrans();
  const { showToast } = useToast();
  const message = i18n.common.choose1in2;
  const handleChangeOdds = (type: string) => {
    switch (type) {
      case 'hdp':
        if (show1x2 && showTX) {
          showToast(message);
          return;
        }
        setShowHdp(!showHdp);
        break;
      case '1x2':
        if (showHdp && showTX) {
          showToast(message);
          return;
        }
        setShow1x2(!show1x2);
        break;

      default:
        if (show1x2 && showHdp) {
          showToast(message);
          return;
        }
        setShowTX(!showTX);
        break;
    }
  };

  return (
    <div className='overflow-hidden rounded-lg border border-light-match bg-white py-2.5 shadow-lg dark:border-none dark:bg-dark-main/95'>
      {isShowOdds(path) && (
        <TwSettingRow className='flex items-center gap-4 px-4 py-2 text-sm'>
          <span>{i18n.odds.odds}:</span>
          <div className='flex items-center gap-1.5'>
            <input
              type='checkbox'
              name='hdp'
              value='hdp'
              className=' cursor-pointer !text-logo-blue focus:!ring-transparent focus:!ring-offset-transparent'
              checked={showHdp}
              onChange={() => handleChangeOdds('hdp')}
            />

            <span>HDP</span>
          </div>
          <div className='flex items-center gap-1'>
            <input
              type='checkbox'
              name='1x2'
              value='std1x2'
              className=' cursor-pointer !text-logo-blue focus:!ring-transparent focus:!ring-offset-transparent'
              checked={show1x2}
              onChange={() => handleChangeOdds('1x2')}
            />
            <span>1x2</span>
          </div>

          <div className='flex items-center gap-1'>
            <input
              type='checkbox'
              name='tx'
              value='tx'
              className=' cursor-pointer !text-logo-blue focus:!ring-transparent focus:!ring-offset-transparent'
              checked={showTX}
              onChange={() => handleChangeOdds('tx')}
            />
            <span>T/X</span>
          </div>
        </TwSettingRow>
      )}
      {/* <div className='flex items-center px-4 py-2 text-sm'>
        <button
          className=' w-1/2 rounded-l-lg border border-dark-text/20 py-2'
          css={[
            showFavorite === false
              ? tw`bg-logo-blue text-white`
              : tw`dark:bg-dark-match`,
          ]}
          onClick={() => {
            setShowFavorite(false);
          }}
        >
          All
        </button>
        <button
          className=' flex-1 rounded-r-lg border border-dark-text/20 py-2'
          css={[
            showFavorite === true
              ? tw`bg-logo-blue text-white`
              : tw`dark:bg-dark-match`,
          ]}
          onClick={() => {
            setShowFavorite(true);
          }}
        >
          Favorite
        </button>
      </div> */}
      {/* <TwSettingRow className='justify-between'>
        <div>Goals prompt</div>
        <div>
          <SwitcherButton
            value={goalPrompt}
            handleChange={setGoalPrompt}
          ></SwitcherButton>
        </div>
      </TwSettingRow> */}
      <TwSettingRow className='justify-between'>
        <p className='text-csm'>{i18n.popover.redCard}</p>
        <div>
          <SwitcherButton
            value={showRedCard}
            handleChange={setShowRedCard}
          ></SwitcherButton>
        </div>
      </TwSettingRow>
      {/* <div className='space-y-1 px-4 py-2 text-sm'>
        <div>Home goal sound:</div>
        <TeamGoalSoundSection
          teamSound={homeSound}
          setTeamSound={setHomeSound}
        ></TeamGoalSoundSection>
      </div>

      <div className='space-y-1 px-4 py-2 text-sm'>
        <div>Away goal sound:</div>
        <TeamGoalSoundSection
          teamSound={awaySound}
          setTeamSound={setAwaySound}
        ></TeamGoalSoundSection>
      </div> */}

      <TwSettingRow className='justify-between'>
        <p className='text-csm'>{i18n.popover.yellowCard}</p>
        <div>
          <SwitcherButton
            value={showYellowCard}
            handleChange={setShowYellowCard}
          ></SwitcherButton>
        </div>
      </TwSettingRow>
    </div>
  );
};

export const TeamGoalSoundSection = ({
  teamSound,
  setTeamSound,
}: {
  teamSound: any;
  setTeamSound: (val: string) => void;
}) => {
  return (
    <>
      <div className='flex justify-center gap-1'>
        <SoundButton
          value={1}
          option={teamSound}
          setOption={setTeamSound}
          audioUrl={audioArray[0]}
        ></SoundButton>
        <SoundButton
          value={2}
          option={teamSound}
          setOption={setTeamSound}
          audioUrl={audioArray[1]}
        ></SoundButton>
        <SoundButton
          value={3}
          option={teamSound}
          setOption={setTeamSound}
          audioUrl={audioArray[2]}
        ></SoundButton>
        <SoundButton
          value={4}
          option={teamSound}
          setOption={setTeamSound}
          audioUrl={audioArray[3]}
        ></SoundButton>
        <SoundButton
          value='Off'
          option={teamSound}
          setOption={setTeamSound}
        ></SoundButton>
      </div>
    </>
  );
};

export const SoundButton = ({
  value,
  option,
  setOption,
  audioUrl,
}: {
  value: any;
  option: any;
  setOption: (val: string) => void;
  audioUrl?: string; // Make audioUrl optional
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  let audio: HTMLAudioElement | null = null;

  const handlePlay = () => {
    if (audioUrl) {
      if (!isPlaying) {
        audio = new Audio(audioUrl); // Create an Audio object if audioUrl is defined
        audio.play();
        setIsPlaying(true);

        audio.addEventListener('ended', () => {
          setIsPlaying(false);
        });
      } else if (audio) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
      }
    }

    if (setOption) {
      setOption(`${value}`);
    }
  };

  return (
    <TwSoundBtn
      css={[`${value}` === `${option}` && tw`bg-logo-blue text-white`]}
      onClick={() => {
        handlePlay();
      }}
    >
      {value}
    </TwSoundBtn>
  );
};

const TwSettingRow = tw.div`flex items-center gap-4 px-4 py-2 text-sm`;
const TwSoundBtn = tw.button`w-12 py-1.5 rounded-md border border-dark-text/30`;
