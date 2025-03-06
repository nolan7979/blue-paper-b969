import { styled } from 'twin.macro';

import BlankStarSVG from '/public/svg/star-blank.svg';

// export function StarBlank() {
//   return <BlankStarSVG className=' cursor-pointer'/>;
// }

export const StarBlank = styled(
  BlankStarSVG
)`cursor-pointer stroke-dark-text fill-slate-950`;
