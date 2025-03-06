import tw from "twin.macro";

//Timeline
export const TwQuickViewTeamH2H = tw.div`space-y-2  lg:border-light-line-stroke-cd dark:border-none  py-4  lg:rounded-md`;
export const TWQuickViewTimeLine = tw.div`bg-white dark:bg-dark-match lg:bg-transparent lg:dark:bg-transparent`;
export const TwQVDetailTabContainer = tw.div`space-y-8`;
export const TwTimeLineEvent = tw.div`flex w-1/2 border-l-2 border-light-line-stroke-cd dark:border-dark-stroke`;
export const TwTimeLineEventHome = tw.div`flex w-1/2 `;
export const TwTimeLineEventContent = tw.div`px-1 py-2 h-full w-full flex-1 border-t-2 border-logo-yellow bg-line-default dark:bg-dark-brand-box relative`;
export const TwTimeLineEventContentHome = tw.div`flex px-1 py-2 h-full w-full flex-1 place-content-end border-t-2 border-logo-blue bg-line-default dark:bg-dark-brand-box relative`;
export const TwTimeLineArrow = tw.div`absolute -left-1 top-2 h-2 w-2 rotate-45 bg-line-default dark:bg-dark-brand-box `;
export const TwTimeLineArrowHome = tw.div`absolute -right-1 top-2 h-2 w-2 rotate-45 bg-line-default dark:bg-dark-brand-box `;
export const TwTimeLineScore = tw.div`ml-1 text-xs font-semibold tracking-[0.15rem]`;
export const TwTimeLineOtherSideHome = tw.div`w-1/2 border-l-2 border-light-line-stroke-cd text-csm pl-4 pt-2 text-start dark:border-dark-stroke dark:text-white`;
export const TwTimeLineOtherSide = tw.div`h-fit w-1/2 pr-4 pt-2 text-end dark:text-white text-csm`;
export const TwTimeLineIconCol = tw.div`w-2/25`;
export const TwTimeLineIconContainer = tw.div` mt-1 dark:bg-dark-main py-1`;
export const TwTimeLineIconContainerHome = tw.div`dark:bg-dark-main py-1`;