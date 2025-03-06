/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react';

import {
  useCompetitionInfoData,
  useCompetitionSeasonData,
} from '@/hooks/useFootball';

import LeagueHeader from '@/modules/football/competition/components/LeagueHeader';
import { useLeagueStore } from '@/stores/league-store';

export const BxhMainColHeader = () => {
  const {
    selectedLeague,
    selectedSeason: selectedSeasonId,
    setSelectedSeason: setSelectedSeasonId,
  } = useLeagueStore();

  const {
    data: tournament = [],
    isLoading,
    isFetching,
  } = useCompetitionInfoData(selectedLeague);

  // TODO use league info data + season data for dropdown
  const {
    data: seasons = [],
    isLoading: isLoadingSeasons,
    isFetching: isFetchingSeasons,
  } = useCompetitionSeasonData(selectedLeague);

  const [selectedSeason, setSelectedSeason] = useState<any>(
    seasons ? seasons[0] : {}
  );

  useEffect(() => {
    setSelectedSeason(seasons && seasons.length ? seasons[0] : {});
  }, [seasons]);

  useEffect(() => {
    setSelectedSeasonId(selectedSeason?.id);
  }, [selectedSeason, setSelectedSeasonId]);

  if (
    isLoading ||
    isFetching ||
    !seasons ||
    isLoadingSeasons ||
    isFetchingSeasons ||
    !tournament
  ) {
    return <></>; // TODO loading
  }

  const { uniqueTournament = {} } = tournament || {};

  return (
    <LeagueHeader
      uniqueTournament={uniqueTournament}
      seasons={seasons}
      seasonGetter={setSelectedSeason}
      useLayout={false}
    ></LeagueHeader>
  );
};
