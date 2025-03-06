import tw from 'twin.macro';

export const TwPenTeamContainer = tw.div`flex h-6 items-center justify-between gap-4 rounded-full`;
export const TwPenScore = tw.div`p-1.5 px-2 text-csm dark:text-white font-medium`;
export const TwPenTakerContainer = tw.div`flex leading-4`;
export const TwPenDotContainer = tw.div`flex flex-1 space-x-3`;
export const TwPenDotUl = tw.ul`flex gap-1.5 p-1.5`;
export const TwPenDotScore = tw.li`h-2 w-2 rounded-full bg-dark-win`;
export const TwPenDotMiss = tw.li`h-2 w-2 rounded-full bg-dark-loss`;
export const TwPenDotEmpty = tw.li`h-2 w-2 rounded-full`;
export const TwPenTakerScore = tw.div`mr-1 text-left  text-xs font-normal text-green-500`;
export const TwPenTakerMiss = tw.div`mr-1 text-left  text-xs font-normal text-dark-loss`;

export const TwMbMenuButton = tw.div`text-csm py-3 px-1 uppercase whitespace-nowrap cursor-pointer`;
