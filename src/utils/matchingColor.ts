import { INITIAL_CLASS_TEAM, INITIAL_COLORS } from '@/constant/colors';

// Utility function to determine the background color based on the odds comparison
export const determineColor = (
  current: number,
  previous: number,
  colors: typeof INITIAL_COLORS,
  theme: string
): string => {
  if (current > previous)
    return theme === 'light' ? colors.bgColor1 : colors?.bgColorDark1;
  if (current < previous)
    return theme === 'light' ? colors.bgColor2 : colors?.bgColorDark2;
  return 'inherit';
};

export const determineScoreColor = (homeScore: number, awayScore: number) => {
  if (homeScore > awayScore) return INITIAL_CLASS_TEAM.home;
  if (homeScore < awayScore) return INITIAL_CLASS_TEAM.away;
  return INITIAL_CLASS_TEAM.draw;
};
