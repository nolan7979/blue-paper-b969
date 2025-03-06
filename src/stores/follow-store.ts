import { initialFollowed } from '@/constant/common';
import { UniqueTournament } from '@/models/interface';
import { create } from 'zustand';

interface TeamMember {
  id: number;
  name: string;
  slug: string;
}

interface Player {
  id: number;
  name: string;
  slug: string;
}
export interface Tournament {
  id: string;
  name: string;
  slug: string;
}

export interface IFollow {
  followed: {
    teams: Record<string, TeamMember[]>;
    players: Record<string, Player[]>;
    tournament: Record<string, Tournament[]>;
    uniqueTournament: Record<string, UniqueTournament[]>;
    match: any;
  };
  addTeam: (sport: string, newTeam: TeamMember) => void;
  removeTeam: (sport: string, oldTeam: TeamMember) => void;
  addPlayer: (sport: string, newPlayer: Player) => void;
  removePlayer: (sport: string, oldPlayer: Player) => void;
  addTournament: (sport: string, newTournament: Tournament) => void;
  removeTournament: (sport: string, oldTournament: Tournament) => void;
  addMatches: (
    id: string,
    formatTime: string,
    formatDate: string,
    tournamentId: string,
    categoryName: string,
    tournamentName: string,
    uniqueTournament?: string,
    sport?: string,
  ) => void;
  removeMatches: (id: string) => void;
  updateFollow: (dataFollow: any) => void;
}

if (typeof window !== 'undefined') {
  const initialFollowedJSON = localStorage.getItem('followed');
  if (initialFollowedJSON) {
    Object.assign(initialFollowed, JSON.parse(initialFollowedJSON));
  }
}

export const useFollowStore = create<IFollow>((set) => ({
  followed: initialFollowed,
  addTeam: (sport: string, newTeam: TeamMember) => {
    set((state) => {
      // const currentDate = new Date();
      // const today = currentDate.toISOString().split('T')[0];

      const updatedTeams = { ...state.followed.teams };
      if (!updatedTeams[sport]) {
        updatedTeams[sport] = [newTeam];
      } else if (Array.isArray(updatedTeams[sport])) {
        updatedTeams[sport] = [...updatedTeams[sport], newTeam];
      } else {
        console.error('updatedTeams[sport] is not an array');
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'followed',
          JSON.stringify({ ...state.followed, teams: updatedTeams })
        );
      }
      return { followed: { ...state.followed, teams: updatedTeams } };
    });
  },
  removeTeam: (sport: string, oldTeam: TeamMember) => {
    set((state) => {
      const updatedTeams = { ...state.followed.teams };

      if (updatedTeams[sport] !== undefined) {
        updatedTeams[sport] = updatedTeams[sport].filter(
          (member) => member?.id !== oldTeam?.id
        );

        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'followed',
            JSON.stringify({ ...state.followed, teams: updatedTeams })
          );
        }
      }

      return { followed: { ...state.followed, teams: updatedTeams } };
    });
  },

  addPlayer: (sport: string, newPlayer: Player) => {
    set((state) => {
      const updatedPlayers = { ...state.followed.players };
      if (!updatedPlayers[sport]) {
        updatedPlayers[sport] = [newPlayer];
      } else if (Array.isArray(updatedPlayers[sport])) {
        updatedPlayers[sport] = [...updatedPlayers[sport], newPlayer];
      } else {
        console.error('updatedPlayers[sport] is not an array');
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'followed',
          JSON.stringify({ ...state.followed, players: updatedPlayers })
        );
      }
      return { followed: { ...state.followed, players: updatedPlayers } };
    });
  },
  removePlayer: (sport: string, oldPlayer: Player) => {
    set((state) => {
      const updatedPlayers = { ...state.followed.players };
      if (updatedPlayers[sport] !== undefined) {
        updatedPlayers[sport] = updatedPlayers[sport].filter(
          (player) => player?.id !== oldPlayer?.id
        );
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'followed',
            JSON.stringify({ ...state.followed, players: updatedPlayers })
          );
        }
      }

      return { followed: { ...state.followed, players: updatedPlayers } };
    });
  },
  addTournament: (sport: string, newTournament: Tournament) => {
    set((state) => {
      const updatedTournaments = { ...state.followed.tournament };
      // const uniqueTournaments = { ...state.followed.uniqueTournament };
      if (!updatedTournaments[sport]) {
        updatedTournaments[sport] = [newTournament];
        // uniqueTournaments[sport] = [newTournament];
      } else if (Array.isArray(updatedTournaments[sport])) {
        updatedTournaments[sport] = [
          ...updatedTournaments[sport],
          // ...uniqueTournaments[sport],
          newTournament,
        ];
      } else {
        console.error('updatedTournaments[sport] is not an array');
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'followed',
          JSON.stringify({ ...state.followed, tournament: updatedTournaments })
        );
      }
      return {
        followed: { ...state.followed, tournament: updatedTournaments },
      };
    });
  },
  removeTournament: (sport: string, oldTournament: Tournament) => {
    set((state) => {
      const updatedTournaments = { ...state.followed.tournament };
      const   updatedUniqueTournaments = { ...state.followed.uniqueTournament };
      if (updatedTournaments[sport] !== undefined || updatedUniqueTournaments[sport] !== undefined) {
        if (updatedTournaments[sport] !== undefined) {
          updatedTournaments[sport] = updatedTournaments[sport].filter(
            (tournament) => tournament?.id !== oldTournament?.id
          );
        }
        updatedTournaments[sport] = updatedTournaments[sport].filter(
          (tournament) => tournament?.id !== oldTournament?.id
        );
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'followed',
            JSON.stringify({
              ...state.followed,
              tournament: updatedTournaments,
              uniqueTournament: updatedUniqueTournaments,
            })
          );
        }
      }

      return {
        followed: { ...state.followed, tournament: updatedTournaments, uniqueTournament: updatedUniqueTournaments },
      };
    });
  },
  addMatches: (
    matchId: string,
    formatTime: string,
    formatDate: string,
    tournamentId: string,
    categoryName: string,
    tournamentName: string,
    uniqueTournament?: string,
    sport?: string
  ) => {
    set((state) => {
      const updatedMatches = [
        ...state.followed.match,
        {
          matchId,
          formatTime,
          formatDate,
          tournamentId,
          categoryName,
          tournamentName,
          uniqueTournament,
          sport,
        },
      ];
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'followed',
          JSON.stringify({ ...state.followed, match: updatedMatches })
        );
      }
      return { followed: { ...state.followed, match: updatedMatches } };
    });
  },
  removeMatches: (id: string) => {
    set((state) => {
      const updatedMatches = state.followed.match.filter(
        (match: any) => id !== match.matchId
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'followed',
          JSON.stringify({ ...state.followed, match: updatedMatches })
        );
      }
      return { followed: { ...state.followed, match: updatedMatches } };
    });
  },
  updateFollow: (dataFollow: any) => {
    set((state) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('followed', JSON.stringify(dataFollow));
      }
      return { followed: dataFollow };
    });
  }
}));

