'use client';

import TabsSlider from '@/components/common/tabsSlider';
import { TimeLineTennisChartProps } from '@/models';
import clsx from 'clsx';
import React from 'react';

const BarChart: React.FC<TimeLineTennisChartProps> = React.memo(
  ({ labels = [], data = [], isLive }) => {
    if (data.length <= 0) {
      return <></>;
    }

    return (
      <div className='flex gap-x-1'>
        {data.map((item, index) => {
          const largestHome = item.data.home.reduce((prev, current) => {
            return prev.y > current.y ? prev : current;
          });
          const largestAway = item.data.away.reduce((prev, current) => {
            return prev.y > current.y ? prev : current;
          });
          const largest = Math.max(largestHome.y, Math.abs(largestAway.y));

          return (
            <div
              key={index}
              className={clsx('relative flex flex-col gap-x-1', {
                ' after:absolute after:right-0 after:top-0 after:h-[calc(100%)] after:w-[1px] after:bg-red-600':
                  isLive && index === data.length - 1,
              })}
            >
              <div>
                <p
                  className={clsx(
                    'absolute -top-5 right-0 text-right text-xs',
                    {
                      '!-right-3':
                        index === data.length - 1 && item.data.home.length <= 3,
                      'text-red-600': isLive && index === data.length - 1,
                      ' text-white':
                        !isLive &&
                        item.label.score.home > item.label.score.away,
                      'text-accent-secondary':
                        !isLive &&
                        item.label.score.home < item.label.score.away,
                    }
                  )}
                >
                  {item.label.score.home}
                  {isLive &&
                    index === data.length - 1 &&
                    item.label.score.home > item.label.score.away && (
                      <span className='absolute -right-1.5 top-1.5 h-1 w-1 rounded-full bg-red-600'></span>
                    )}
                </p>

                <div
                  className={clsx(
                    'relative flex items-end gap-x-1 bg-primary-mask',
                    {
                      'before:absolute before:-top-0.5 before:right-0 before:h-1 before:w-0.5 before:bg-white after:absolute after:right-0 after:top-0 after:h-0.5 after:w-[calc(100%-1px)] after:bg-white':
                        item.label.score.home > item.label.score.away,
                    }
                  )}
                  style={{
                    height: largest > 39 ? `${largest + 10}px` : '39px',
                  }}
                >
                  {item.data.home.map((dataItem, dataIndex) => {
                    return (
                      <React.Fragment key={dataIndex}>
                        <div
                          className='w-1 bg-[#2187E5]'
                          style={{ height: `${dataItem.y}px` }}
                        />
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
              <div>
                <div
                  className={clsx(
                    'relative flex h-9 items-start gap-x-1 bg-accent-secondary-alpha-02',
                    {
                      'before:absolute before:-bottom-0.5 before:right-0 before:h-1 before:w-0.5 before:bg-white after:absolute after:bottom-0 after:right-0 after:h-0.5 after:w-[calc(100%-1px)] after:bg-white':
                        item.label.score.home < item.label.score.away,
                    }
                  )}
                  style={{
                    height: largest > 39 ? `${largest + 10}px` : '39px',
                  }}
                >
                  {item.data.away.map((dataItem, dataIndex) => {
                    return (
                      <React.Fragment key={dataIndex}>
                        <div
                          className='w-1 bg-[#F6B500]'
                          style={{ height: `${Math.abs(dataItem.y)}px` }}
                        />
                      </React.Fragment>
                    );
                  })}
                </div>
                <p
                  className={clsx(
                    'absolute -bottom-5 right-0 text-right text-xs',
                    {
                      '!-right-2':
                        index === data.length - 1 && item.data.away.length <= 3,
                      'text-red-600': isLive && index === data.length - 1,
                      'text-white':
                        !isLive &&
                        item.label.score.home < item.label.score.away,
                      'text-accent-secondary':
                        !isLive &&
                        item.label.score.home > item.label.score.away,
                    }
                  )}
                >
                  {item.label.score.away}
                  {isLive &&
                    index === data.length - 1 &&
                    item.label.score.home < item.label.score.away && (
                      <span className='absolute -right-1.5 top-1.5 h-1 w-1 rounded-full bg-red-600'></span>
                    )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps?.labels === nextProps?.labels &&
      prevProps?.data === nextProps?.data
    );
  }
);

BarChart.displayName = 'BarChart';

export default BarChart;
