import axiosClient from './axiosClient';

/**
 * Match API — maps to MatchController (/api/v1/matches).
 *
 * GET /matches                     -> List<MatchScoreDto>
 * GET /matches/with/{targetUserId} -> MatchScoreDto
 */

export function getMatches() {
  return axiosClient.get('/matches');
}

export function getMatchWith(targetUserId) {
  return axiosClient.get(`/matches/with/${targetUserId}`);
}

export default {
  getMatches,
  getMatchWith,
};