
import { BreadCrumb } from '@/components/breadcumbs/BreadCrumb';
import { BreadCumbLink } from '@/components/breadcumbs/BreadCrumbLink';
import { BreadCrumbSep } from '@/components/breadcumbs/BreadCrumbSep';

import { SportEventDto } from '@/constant/interface';
import useTrans from '@/hooks/useTrans';
import {
  extractCompetitionId,
  getSlug,
  isValEmpty
} from '@/utils';
import React from 'react';
import { HiOutlineChevronRight } from 'react-icons/hi';

interface IBreadCumbMain {
  matchData: SportEventDto;
  sport?: string
}

const BreadCrumbMain: React.FC<IBreadCumbMain> = React.memo(({ matchData, sport }) => {
  const { tournament, roundInfo, homeTeam, awayTeam , uniqueTournament} = matchData;
  const tournamentSport =  tournament || uniqueTournament;
  const i18n = useTrans()
  let round = '';
  if (roundInfo && !isValEmpty(roundInfo.round) && roundInfo.name) {
    round = `, ${roundInfo.name}`;
  } else if (
    roundInfo &&
    !isValEmpty(roundInfo.round) &&
    roundInfo.round !== 0
  ) {
    round = `, ${i18n.football.round} ${roundInfo.round}`;
  }
  if (!matchData) return <></>;

  return (
    <BreadCrumb className=''>
      <div className=' flex items-center gap-2 truncate text-xs font-extralight'>
        {/* <BreadCumbLink href='/snooker' name={i18n.header.snooker} />
        <BreadCrumbSep></BreadCrumbSep> */}
        <BreadCumbLink
          href={`/${sport}/competition/${tournamentSport?.slug || getSlug(tournamentSport?.name)
            }/${extractCompetitionId(tournamentSport?.id)}`}
          name={`${tournamentSport?.name}${roundInfo?.round && roundInfo.round > -1 ? round : ''}`}
        />
      </div>
      <HiOutlineChevronRight></HiOutlineChevronRight>
      <BreadCumbLink
        href={`/${sport}/match/${matchData?.slug}/${matchData?.id}`}
        name={`${awayTeam.name} vs ${homeTeam.name}`}
        isEnd={true}
      ></BreadCumbLink>
    </BreadCrumb>
  );
}, (prevProps, nextProps) => {
  return prevProps.matchData.id === nextProps.matchData.id && prevProps.sport === nextProps.sport && prevProps.matchData.slug === nextProps.matchData.slug;
});

export default BreadCrumbMain;
