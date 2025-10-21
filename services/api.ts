
import { Player, Role, Match, MatchStatus, Availability, Rating } from '../types';

// MOCK DATABASE
let players: Player[] = [
  { id: 1, firstName: 'Leo', lastName: 'Messi', email: 'manager@weplay.com', dob: '1987-06-24', favoriteFoot: 'left', favoritePosition: 'Forward', role: Role.MANAGER, averageRating: 9.8 },
  { id: 2, firstName: 'Cristiano', lastName: 'Ronaldo', email: 'player@weplay.com', dob: '1985-02-05', favoriteFoot: 'right', favoritePosition: 'Forward', role: Role.PLAYER, averageRating: 9.5 },
  { id: 3, firstName: 'Neymar', lastName: 'Jr', email: 'player2@weplay.com', dob: '1992-02-05', favoriteFoot: 'both', favoritePosition: 'Winger', role: Role.PLAYER, averageRating: 9.2 },
  { id: 4, firstName: 'Kylian', lastName: 'Mbappe', email: 'player3@weplay.com', dob: '1998-12-20', favoriteFoot: 'right', favoritePosition: 'Forward', role: Role.PLAYER, averageRating: 9.4 },
  { id: 5, firstName: 'Kevin', lastName: 'De Bruyne', email: 'player4@weplay.com', dob: '1991-06-28', favoriteFoot: 'right', favoritePosition: 'Midfielder', role: Role.PLAYER, averageRating: 9.6 },
  { id: 6, firstName: 'Virgil', lastName: 'van Dijk', email: 'player5@weplay.com', dob: '1991-07-08', favoriteFoot: 'right', favoritePosition: 'Defender', role: Role.PLAYER, averageRating: 9.1 },
  { id: 7, firstName: 'Sadio', lastName: 'Mané', email: 'player6@weplay.com', dob: '1992-04-10', favoriteFoot: 'right', favoritePosition: 'Forward', role: Role.PLAYER, averageRating: 8.9 },
  { id: 8, firstName: 'Mohamed', lastName: 'Salah', email: 'player7@weplay.com', dob: '1992-06-15', favoriteFoot: 'left', favoritePosition: 'Forward', role: Role.PLAYER, averageRating: 9.0 },
];

let matches: Match[] = [
  { id: 1, date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), location: 'City Arena', teamA: [], teamB: [], managerId: 1, status: MatchStatus.UPCOMING, availablePlayers: [players[1], players[2], players[3], players[4]], allPlayers: [players[1], players[2], players[3], players[4], players[5]] },
  { id: 2, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), location: 'Grand Park', teamA: [players[1], players[3]], teamB: [players[2], players[4]], managerId: 1, result: '3-2', status: MatchStatus.COMPLETED, availablePlayers: [], allPlayers: [players[1], players[2], players[3], players[4]] },
];

let availabilities: Availability[] = [
    {id: 1, playerId: 2, matchId: 1, available: true},
    {id: 2, playerId: 3, matchId: 1, available: true},
    {id: 3, playerId: 4, matchId: 1, available: true},
    {id: 4, playerId: 5, matchId: 1, available: true},
    {id: 5, playerId: 6, matchId: 1, available: false},
];

let ratings: Rating[] = [
    {id: 1, matchId: 2, playerId: 2, raterId: 3, score: 8},
    {id: 2, matchId: 2, playerId: 3, raterId: 2, score: 9},
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  login: async (email: string, _: string): Promise<Player | null> => {
    await delay(500);
    const user = players.find(p => p.email === email);
    return user || null;
  },
  
  signup: async (userData: Omit<Player, 'id' | 'averageRating' | 'role'>): Promise<Player> => {
    await delay(500);
    const newUser: Player = {
        ...userData,
        id: players.length + 1,
        averageRating: 7.0, // Default rating
        role: Role.PLAYER, // All signups are players
    };
    players.push(newUser);
    return newUser;
  },

  getPlayers: async (): Promise<Player[]> => {
    await delay(300);
    return players;
  },

  getMatches: async (): Promise<Match[]> => {
    await delay(300);
    return matches;
  },

  getMatchById: async (id: number): Promise<Match | undefined> => {
    await delay(300);
    return matches.find(m => m.id === id);
  },

  createMatch: async (matchData: { date: string, location: string, managerId: number }): Promise<Match> => {
    await delay(500);
    const newMatch: Match = {
      ...matchData,
      id: matches.length + 1,
      teamA: [],
      teamB: [],
      status: MatchStatus.UPCOMING,
      availablePlayers: [],
      allPlayers: players.filter(p => p.role === Role.PLAYER), // Invite all players by default
    };
    matches.push(newMatch);
    return newMatch;
  },
  
  recordMatchResult: async (matchId: number, result: string): Promise<Match> => {
      await delay(500);
      const matchIndex = matches.findIndex(m => m.id === matchId);
      if (matchIndex === -1) throw new Error("Match not found");
      matches[matchIndex].result = result;
      matches[matchIndex].status = MatchStatus.COMPLETED;
      return matches[matchIndex];
  },
  
  setPlayerAvailability: async (playerId: number, matchId: number, available: boolean): Promise<Availability> => {
      await delay(300);
      let availability = availabilities.find(a => a.playerId === playerId && a.matchId === matchId);
      if(availability) {
          availability.available = available;
      } else {
          availability = { id: availabilities.length + 1, playerId, matchId, available };
          availabilities.push(availability);
      }
      
      const match = matches.find(m => m.id === matchId);
      const player = players.find(p => p.id === playerId);
      if(match && player) {
          if(available) {
              if(!match.availablePlayers.some(p => p.id === playerId)) {
                  match.availablePlayers.push(player);
              }
          } else {
              match.availablePlayers = match.availablePlayers.filter(p => p.id !== playerId);
          }
      }
      return availability;
  },

  getPlayerAvailabilityForMatch: async (playerId: number, matchId: number): Promise<boolean> => {
      await delay(100);
      const availability = availabilities.find(a => a.playerId === playerId && a.matchId === matchId);
      return availability ? availability.available : false;
  },

  balanceTeams: async (matchId: number): Promise<{ teamA: Player[], teamB: Player[] }> => {
    await delay(700);
    const match = matches.find(m => m.id === matchId);
    if (!match) throw new Error("Match not found");

    const available = [...match.availablePlayers].sort((a, b) => b.averageRating - a.averageRating);
    const teamA: Player[] = [];
    const teamB: Player[] = [];
    let ratingA = 0;
    let ratingB = 0;

    available.forEach(player => {
      if (ratingA <= ratingB) {
        teamA.push(player);
        ratingA += player.averageRating;
      } else {
        teamB.push(player);
        ratingB += player.averageRating;
      }
    });
    
    match.teamA = teamA;
    match.teamB = teamB;

    return { teamA, teamB };
  },

  submitRating: async (raterId: number, playerId: number, matchId: number, score: number): Promise<Rating> => {
      await delay(400);
      const match = matches.find(m => m.id === matchId);
      if(!match || match.status !== MatchStatus.COMPLETED) throw new Error("Match not rateable");

      const existingRating = ratings.find(r => r.raterId === raterId && r.playerId === playerId && r.matchId === matchId);
      if (existingRating) throw new Error("You have already rated this player for this match.");
      
      const newRating: Rating = {
          id: ratings.length + 1,
          raterId,
          playerId,
          matchId,
          score,
      };
      ratings.push(newRating);

      // Recalculate average rating for the rated player
      const playerRatings = ratings.filter(r => r.playerId === playerId);
      const totalScore = playerRatings.reduce((sum, r) => sum + r.score, 0);
      const player = players.find(p => p.id === playerId);
      if(player) {
          player.averageRating = parseFloat((totalScore / playerRatings.length).toFixed(1));
      }

      return newRating;
  },

  getRatingsForMatch: async (matchId: number): Promise<Rating[]> => {
    await delay(200);
    return ratings.filter(r => r.matchId === matchId);
  },
};
