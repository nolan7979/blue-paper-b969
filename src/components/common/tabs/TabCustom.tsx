'use client';
import React, {
  Children,
  forwardRef,
  useId,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

import { TabItem, TabItemProps } from '@/components/common/tabs/TabItem';
import { TabNumber } from '@/components/common/tabs/TabNumber';
import clsx from 'clsx';

export interface TabsRef {
  setStep: ({ target }: { target: number }) => void;
}

export interface TabsProps {
  onChangeStep?: (active: number) => void;
  children?: React.ReactNode;
  className?: string;
  isSticky?: boolean;
}
const TabsComponent = forwardRef<TabsRef, TabsProps>(
  ({ children, className, onChangeStep, isSticky }, ref) => {
    const id = useId();
    const steps = useMemo(
      () =>
        Children.map(
          Children.toArray(children) as React.ReactElement<TabItemProps>[],
          ({ props }) => props
        ),
      [children]
    );

    const isLogo = useMemo(() => steps.some((item) => !!item.logo), [steps]);

    const [activeStep, setActiveStep] = useState(() => {
      const initialStep = steps.findIndex((step) => step.active);
      return initialStep >= 0 ? initialStep : 0;
    });

    const handleOnChangeStep = ({ target }: { target: number }) => {
      setActiveStep(target);
      onChangeStep?.(target);
    };

    useImperativeHandle(ref, () => ({ setStep: handleOnChangeStep }));

    const renderStep = (stepNumber: number) => {
      const stepProps = steps[stepNumber];
      return stepProps ? <div {...stepProps} /> : null;
    };

    return (
      <>
        <div
          className={clsx(
            className,
            'no-scrollbar flex items-center gap-x-4 overflow-x-auto border-y border-light-line-stroke-cd bg-light px-4 dark:border-dark-stroke dark:bg-dark-sub-bg-main lg:mb-4',
            isLogo ? 'justify-center' : 'justify-start',
            { 'sticky top-14 z-10': isSticky }
          )}
        >
          {steps.map((step, index) => (
            <TabNumber
              {...step}
              active={activeStep === index}
              key={`${id}-step-${index}`}
              index={index + 1}
              onClick={() => handleOnChangeStep({ target: index })}
            />
          ))}
        </div>
        {/* {!isLogo && <Divider height='2' />} */}
        <div className='w-full pt-3'>{renderStep(activeStep)}</div>
      </>
    );
  }
);

TabsComponent.displayName = 'Tabs';

const TabsCustom: React.ForwardRefExoticComponent<
  Omit<TabsProps, 'ref'> & React.RefAttributes<TabsRef>
> & {
  Item: React.FC<TabItemProps>;
} = TabsComponent as any;

TabsCustom.Item = TabItem;

export { TabItem, TabsCustom };
