import tw from 'twin.macro';

export const TwBorderLinearBox = tw.div`rounded-md`;

export const TwTabHead = tw.div`flex h-[35px] w-full  items-center justify-center rounded-full bg-white dark:bg-dark-head-tab`;

export const TwLineupVerticalLine = tw.div`flex flex-col-reverse justify-evenly`;
export const TwLineupVerticalLineAway = tw.div`flex flex-col justify-evenly`;

//manager
export const TwTransferFeeText = tw.div`text-xs font-normal not-italic leading-5 dark:text-dark-text`;
export const TwTransferValueText = tw.div`text-xs font-normal leading-5 text-dark-text`;
export const TwSectionContainer = tw.div`flex flex-col gap-3 lg:flex-row`;
export const TwMainColContainer = tw.div`flex flex-col lg:flex-row`;
export const TwStatsUl = tw.ul`space-y-1.5`;
export const TwStatsLi = tw.li`flex justify-between`;

export const TwPlayerDetailTitle = tw.div`not-italic font-medium text-sm py-2.5 leading-4.5 text-logo-blue`;
export const TwManagerFormText = tw.div`not-italic font-medium text-xs leading-4.5`;
export const TwManagerFormPctText = tw.div`px-2 h-6 w-full not-italic font-medium text-xs leading-4 flex items-center text-white`;
export const TwCareerText = tw.div`not-italic font-normal text-csm leading-5`;


export const TwBlockContainer = tw.div` flex w-9/12 flex-col place-content-center rounded-lg text-csm bg-white dark:bg-dark-match border border-solid`;
export const Tw3rdPlaceBlockContainer = tw.div` flex flex-col place-content-center rounded-lg text-csm bg-white dark:bg-dark-match border border-solid`;
export const TwBracketMatchBadge = tw.div` absolute left-[50%] top-[100%] transform -translate-y-1/2 -translate-x-1/2 text-xxs rounded-full px-2 text-black`;

export const TwSkeletonRectangle = tw.div`rounded-lg bg-light-main px-4 py-2 my-4  h-36 w-full`;
