
export enum Role {
  PLAYER = "player",
  MANAGER = "manager",
}

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  favoriteFoot: 'left' | 'right' | 'both';
  favoritePosition: string;
  role: Role;
  averageRating: number;
}

export enum MatchStatus {
  UPCOMING = "upcoming",
  COMPLETED = "completed",
}

export interface Match {
  id: number;
  date: string;
  location: string;
  teamA: Player[];
  teamB: Player[];
  managerId: number;
  result?: string;
  status: MatchStatus;
  availablePlayers: Player[];
  allPlayers: Player[]; // All players invited/part of the match
}

export interface Rating {
  id: number;
  playerId: number;
  matchId: number;
  raterId: number;
  score: number;
}

export interface Availability {
    id: number;
    playerId: number;
    matchId: number;
    available: boolean;
}
