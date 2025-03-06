import Avatar from "@/components/common/Avatar";
import CustomLink from "@/components/common/CustomizeLink";
import { SPORT } from "@/constant/common";
// import { StarBlank } from "@/components/icons";
// import { StarYellowNew } from "@/components/icons/StarYellowNew";
import { SportEventDtoWithStat, TournamentDto } from "@/constant/interface";
// import { useFollowStore } from "@/stores";
// import { extractCompetitionId, getSlug, isCountryName } from "@/utils";
// import Link from "next/link";
// import { useCallback, useEffect, useMemo, useState } from "react";

const LeagueRow = ({
  match,
}: {
  match: SportEventDtoWithStat;
}) => {
  const { uniqueTournament } = match;

  return (
    <div className='flex items-center gap-x-1.5' test-id='match-row'>
      <div className='flex items-center gap-3'>
        <CustomLink
          href={`/am-football/competition/${uniqueTournament?.slug}/${uniqueTournament?.id}`}
          target='_parent'
        >
          <Avatar
            id={uniqueTournament?.id}
            type='competition'
            width={32}
            height={32}
            rounded={false}
            isBackground={false}
            sport={SPORT.AMERICAN_FOOTBALL}
          />
        </CustomLink>
        <div>
          <h3 className='text-black dark:text-white text-[11px]'>{uniqueTournament?.name}</h3>
          { uniqueTournament?.country ? (
            <div className='flex gap-1'>
              <Avatar
                id={uniqueTournament?.country?.id}
                type='country'
                width={16}
                height={10}
                rounded={false}
                isBackground={false}
                sport={SPORT.AMERICAN_FOOTBALL}
              />
              <span className='text-light-secondary uppercase text-[11px]'>{uniqueTournament?.country?.name ? uniqueTournament?.country?.name : '-'}</span>
            </div>
          ) : '--'}
        </div>
      </div>
      {/* <div className='flex w-5  items-center justify-end' test-id='star-icon'>
        <div onClick={changeFollow}>
          {isFollowedTour ? (
            <StarYellowNew className='inline-block h-4 w-4 cursor-pointer' />
          ) : (
            <StarBlank className='inline-block h-4 w-4 cursor-pointer' />
          )}
        </div>
      </div> */}
    </div>
  );
};

export default LeagueRow;
