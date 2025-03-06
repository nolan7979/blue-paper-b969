import tw from 'twin.macro';

export const TwBorderLinearBox = tw.div`rounded-md`;

export const TwTabHead = tw.div`flex h-[35px] w-full  items-center justify-center rounded-full bg-head-tab dark:bg-dark-head-tab`;

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

export const TwFullBlockContainer = tw.div` flex w-full flex-col place-content-center rounded-lg text-csm bg-white dark:bg-dark-match border border-solid`;
export const TwBlockContainer = tw.div` flex w-9/12 flex-col place-content-center rounded-lg text-csm bg-white dark:bg-dark-match border border-solid`;
export const Tw3rdPlaceBlockContainer = tw.div` flex flex-col place-content-center rounded-lg text-csm bg-white dark:bg-dark-match border border-solid`;
export const TwBracketMatchBadge = tw.div` absolute left-[50%] top-[100%] transform -translate-y-1/2 -translate-x-1/2 text-xxs rounded-full px-2 text-black`;

export const TwSkeletonRectangle = tw.div`rounded-lg bg-light-main px-4 py-2 my-4  h-36 w-full`;


export const TwMatchHeader = tw.div`md:px-2 flex rounded-md items-center`;
// const TwMatchRow = tw.div`flex rounded-md bg-light-match px-2 hover:border hover:border-all-blue dark:bg-dark-match`;
export const TwMatchRow = tw.div`flex rounded-md  md:px-2 hover:brightness-90 dark:hover:brightness-150 border border-solid border-light-match dark:border-dark-match`;

export const FirstCol = tw.div`flex flex-col-reverse items-center justify-evenly md:flex-row`;
export const FirstColByTime = tw.div`flex w-18 flex-col justify-between gap-2 items-center px-1 md:px-2`;
export const TwFavoriteCol = tw.div`flex w-10 place-content-center items-center`;
export const TwTimeCol = tw.div`flex w-12 md:w-10 flex-col place-content-center items-center text-xs`;
export const TwTimeColByTime = tw.div`flex w-full text-xs truncate text-center`;
export const TwTitleHeader = tw.div`flex w-auto flex-col place-content-center items-center text-black dark:text-white`;

export const TwTeamNameCol = tw.div`flex w-20 flex-1 flex-col justify-between gap-1.5`;
export const TwTeamNameColHeader = tw.div`flex w-1/3 flex-1 flex-col place-content-center gap-2 dark:text-dark-text`;
// export const TwTeamNameCol = tw.div`flex w-1/4 md:w-1/3 md:pl-2 flex-col dark:text-dark-text place-content-center gap-y-2`;
// export const TwTeamNameColHeader = tw.div`flex w-1/4 md:w-1/3 flex-col place-content-center gap-2`;

export const TwScoreCol = tw.div`flex w-4 lg:w-6 flex-col text-center text-white`;
export const TwScoreColHeader = tw.div`flex w-4 lg:w-5 flex-col place-content-center gap-1 lg:gap-2 text-center`;

export const TwCornerCol = tw.div`flex flex-col items-center justify-between gap-1 lg:gap-2 text-center`;
export const TwCornerColHeader = tw.div`flex w-4 lg:w-5 flex-col place-content-center gap-1 lg:gap-2 text-center`;

export const TwOddsCol = tw.div`flex w-min flex-col font-thin text-xs justify-between `;
export const TwOddsColHeader = tw.div`flex w-1/3 flex-col place-content-center gap-2 text-center`;

export const TwTeamScoreCol = tw.div`flex flex-1 gap-2 pl-2`;
// export const TwTeamScoreCol = tw.div`flex gap-1 xl:gap-2 pl-2 w-fit`;

export const TwBellCol = tw.div`flex w-8 flex-col items-center justify-between`;
export const TwBellColByTime = tw.div`flex w-8 flex-col items-center justify-between`;

export const TWDataMessage = tw.div`text-center text-xs py-4 text-dark-text bg-light-match dark:bg-dark-match rounded-lg`;

export const TwMatchTab = tw.div`px-5 py-2 cursor-pointer text-sm flex items-center gap-1.5`;
export const TwSideTab = tw.div`cursor-pointer`;



export const TwMobileView = tw.div`block lg:hidden`;
export const TwDesktopView = tw.div`hidden lg:block`;

export const TwDataSection = tw.div`block md:flex gap-x-6 mt-0 md:mt-3`;
export const TwMatchDetailDataSection = tw.div`flex gap-x-4`;
export const TwFilterTitle = tw.h3`text-justify px-3 py-1 text-left  text-sm font-[700] uppercase leading-5 dark:text-white`;

export const TwFilterCol = tw.div`
  shrink
  hidden
  gap-y-3
  lg:(flex flex-col)
`;

export const TwMainCol = tw.div`
  flex-[5]
  lg:col-span-1
  md:flex-[4]
  lg:flex-[5]
`;

export const TwMainColDetailPage = tw.div`
  flex-[8]
  lg:w-2/3
`;

export const TwQuickViewCol = tw.div`
  hidden
  // bg-[linear-gradient(90deg,#CBEAFD_0%,#F1DBED_100%)]
  lg:block
  // xl:flex-[4]
  col-span-1
`;

export const TwDetailPageSmallCol = tw.div`
  // hidden
  // bg-[linear-gradient(90deg,#CBEAFD_0%,#F1DBED_100%)]
  // lg:block

  flex-[4]
`;

export const TwCard = tw.div`
  rounded-sm
  md:rounded-xl
  border
  dark:shadow-dark-stroke
  dark:border-dark-stroke
  dark:bg-dark-gray
  bg-light
  border-none
  text-light-default
  dark:text-dark-default
  font-normal
`;

export const TwQuickViewTitle = tw.h5`font-bold text-sm mt-6 uppercase py-2 dark:text-white`;
export const TwQuickViewTitleV2 = tw.h5`pb-2 font-bold text-sm uppercase text-center dark:text-white pl-4 lg:pl-0`;
export const TwQuickViewCard = tw.div`
border
bg-light
space-y-3
border-light-line-stroke-cd
text-light-default
dark:text-dark-default
dark:shadow-dark-stroke
dark:border-dark-stroke
dark:bg-dark-match
font-normal`;
export const TwTitle = tw.h5`font-bold text-sm uppercase not-italic leading-5 text-light-default dark:text-dark-default pt-4 lg:pt-2`;
export const TwStageTitle = tw.h5`font-bold text-sm not-italic leading-5 text-light-default dark:text-dark-default`;
export const TwAboutText = tw.p`not-italic font-normal text-csm leading-6 text-light-default dark:text-dark-text`;

export const TwQuickViewSection = tw.div`
  lg:rounded-md
  bg-white
  dark:bg-transparent
  border
  border-white
  shadow-sm
  dark:border-none
`;

export const TwSection = tw.div`
  rounded-md
  bg-light-match
  dark:bg-dark-match
  border
  border-light-line-stroke-cd
  dark:border-none
`;

export const TwQuickViewTimeLine = tw.div`
  lg:rounded-md
  bg-white
  dark:bg-dark-match
  lg:dark:bg-dark-hl-3
  lg:border
  lg:border-light-line-stroke-cd
  dark:border-none
`;

export const TwSectionWrapper = tw.div`py-6 px-2.5`;