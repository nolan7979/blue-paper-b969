import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { useGetVoteOfMatchById, usePostNewVote } from '@/hooks/useFootball';

import { TwMbQuickViewWrapper } from '@/components/modules/football/quickviewColumn/quickViewMatchesTab';
import {
  TwBorderLinearBox,
  TwQuickViewTitleV2,
} from '@/components/modules/football/tw-components';

import useVoteStore from '@/stores/vote-store';

import { isMatchNotStarted } from '@/utils';

import vi from '~/lang/vi';
import React from 'react';

interface WinRateSectionProps {
  i18n: any;
  matchId: string;
  statusCode: number;
  homeTeam?: string;
  awayTeam?: string;
}

export const WinRateSection: React.FC<WinRateSectionProps> = ({
  i18n = vi,
  matchId,
  statusCode,
  homeTeam,
  awayTeam,
}) => {
  const [values, setValues] = useState<number[]>([]);
  const [selected, setSelected] = useState<boolean>(false);
  const [voted, setVoted] = useState<string | null>(null);
  const { data, isLoading } = useGetVoteOfMatchById(matchId);
  const { mutate } = usePostNewVote();
  const {  setVote, initializeVotes } = useVoteStore();

  useEffect(() => {
    initializeVotes();
  }, [initializeVotes]);

  useEffect(() => {
    if (data) {
      setValues([data.vote.home, data.vote.draw, data.vote.away]);
    }
  }, [data]);

  useEffect(() => {
    const storedVotes = localStorage.getItem('votes');

    if (!storedVotes) return;

    const parsedVotes = new Map<string, string>(JSON.parse(storedVotes));

    const vote = parsedVotes.get(matchId);

    if (!vote && !selected) {
      const totalValue = values.reduce((acc, val) => acc + val, 0);
      if (totalValue === 0) {
        setVoted(null);
        setSelected(false);
        return;
      }
    }
    if (vote) {
      setSelected(true);
      setVoted(vote);
    }
    if (!vote && selected) {
      setSelected(false);
      setVoted(null);
    }
  }, [matchId, values, selected, setVoted, setSelected]);

  const handleClick = useCallback(
    async (index: number) => {
      const voteSelect = (() => {
        switch (index) {
          case 0:
            return 'home';
          case 1:
            return 'draw';
          case 2:
            return 'away';
          default:
            return '';
        }
      })();
  
      if (voteSelect) {
        setVote(matchId, voteSelect);
        mutate({
          matchId: matchId,
          voteSelect: voteSelect,
        });
  
        const newValues = values.map((value, i) => (i === index ? value + 1 : value));
        setVoted(voteSelect);
        setValues(newValues);
        setSelected(true);
      }
    },
    [values, selected, matchId, setVote, mutate, setVoted, setValues, setSelected]
  );

  const renderVoteValues = useMemo(() => {
    const totalVotes = values.reduce((acc, val) => acc + val, 0);

    const getPercentage = (value: number) =>
      Math.round((value / totalVotes) * 100);

    return (
      <div className='grid w-full grid-cols-3 gap-x-6'>
        <div
          test-id='home-team-rate-info'
          className='col-span-1 flex flex-col items-center justify-center gap-y-2.5 rounded-l-md p-1 text-center text-csm text-white'
        >
          <span
            test-id='home-rate'
            className={clsx(
              'flex h-12 w-12 items-center justify-center p-1 text-clg',
              {
                'rounded-full border border-all-blue': voted === 'home',
              }
            )}
          >{`${(values[0] > 0 && getPercentage(values[0])) || '0'}%`}</span>
          <span className='w-32 truncate' test-id='home-name-rate'>
            {homeTeam}
          </span>
        </div>
        <div className='col-span-1 flex flex-col items-center justify-center gap-y-2.5 p-1 text-center text-csm text-white'>
          <span
            test-id='draw-rate'
            className={clsx(
              'flex h-12 w-12 items-center justify-center p-1 text-clg',
              {
                'rounded-full border border-all-blue': voted === 'draw',
              }
            )}
          >{`${(values[1] > 0 && getPercentage(values[1])) || '0'}%`}</span>
          <span>{i18n.qv.draw}</span>
        </div>
        <div className='col-span-1 flex flex-col items-center justify-center gap-y-2.5 rounded-r-md p-1 text-center text-csm text-white'>
          <span
            test-id='away-rate'
            className={clsx(
              'flex h-12 w-12 items-center justify-center p-1 text-clg',
              {
                'rounded-full border border-all-blue': voted === 'away',
              }
            )}
          >{`${(values[2] > 0 && getPercentage(values[2])) || '0'}%`}</span>
          <span className='w-32 truncate' test-id='away-name-rate'>
            {awayTeam}
          </span>
        </div>
      </div>
    );
  }, [values, awayTeam, homeTeam, voted]);

  if (isLoading) {
    return <></>;
  }
  return (
    <TwBorderLinearBox className='border dark:border-0 border-line-default dark:border-linear-box bg-white dark:bg-primary-gradient'>
      <TwMbQuickViewWrapper className='!border-none p-3'>
        <div
          className='flex flex-col items-center space-y-3 px-2.5 pb-3'
          test-id='win-rate-section'
        >
          <TwQuickViewTitleV2 className='!p-0 lg:!pt3'>{i18n.titles.winrate}</TwQuickViewTitleV2>
          {(isMatchNotStarted(statusCode) && !selected && (
            <div className='grid grid-cols-3 gap-x-6'>
              <SelectionButton
                className='col-span-1'
                title='1'
                name={homeTeam}
                onClick={() => handleClick(0)}
              />
              <SelectionButton
                className='col-span-1'
                title='X'
                name={i18n.qv.draw}
                onClick={() => handleClick(1)}
              />
              <SelectionButton
                className='col-span-1'
                title='2'
                name={awayTeam}
                onClick={() => handleClick(2)}
              />
            </div>
          )) || (
            <AnimatePresence>
              <motion.div
                key='buttons'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='w-full'
              >
                {renderVoteValues}
              </motion.div>
            </AnimatePresence>
          )}
          {/* <div className='relative h-9 w-full py-3'>
            <AnimatePresence>
              {!selected ? (
                <motion.div
                  key='buttons'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, position: 'absolute', top: 0 }}
                  exit={{ opacity: 0 }}
                  className='flex w-full'
                >
                  <div className='flex w-full items-center justify-center space-x-2  text-white '>
                    {buttonNames.map((name: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleClick(index)}
                        className={clsx(
                          `button h-7 w-full cursor-pointer select-none rounded-lg border-b-[1px] text-csm
                      font-semibold 
                      transition-all
                      duration-150 [box-shadow:0_5px_0_0_#1b6ff8,0_9px_0_0_#1b70f841] active:translate-y-2
                      active:border-b-[0px] active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]`,
                          renderColorButton(index)
                        )}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key='content'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, position: 'absolute', top: 0 }}
                  exit={{ opacity: 0 }}
                  className='w-full text-center'
                >
                  {renderVoteValues}
                </motion.div>
              )}
            </AnimatePresence>
          </div> */}
          {/* <AnimatePresence>
            <div
              className={`flex w-full items-center ${
                selected ? 'justify-between' : 'justify-end' 
              }`}
            >
              {selected && (
                <motion.div
                  key='content'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className='text-xs font-semibold'>
                    {i18n.qv.youSelected}: {selectedOption}
                  </div>
                </motion.div>
              )}
             
            </div>
          </AnimatePresence> */}
        </div>
      </TwMbQuickViewWrapper>
    </TwBorderLinearBox>
  );
};

type ISelectionButton = {
  children?: React.ReactNode;
  title: string;
  name?: string;
  onClick?: (e: any) => void;
  className?: string;
};

export const SelectionButton: React.FC<ISelectionButton> = ({
  children,
  title,
  name,
  onClick,
  className,
}) => {
  return (
    <div
      className={twMerge(
        'relative flex flex-col items-center justify-center gap-y-2.5',
        className
      )}
    >
      <div className='dark:border-linear-rating hover:cursor-pointer hover:brightness-150 rounded-md'>
        <div
          className='flex h-12 w-12 items-center justify-center  text-[1.188rem]'
          onClick={onClick}
          test-id='cover'
        >
          {title}
        </div>
      </div>
      {name && (
        <span
          className='w-32 truncate text-center text-msm dark:text-white'
          test-id='home-name-cover'
        >
          {name}
        </span>
      )}
      {children}
    </div>
  );
};
