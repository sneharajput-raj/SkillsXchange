import axiosClient from './axiosClient';

/**
 * Skill API — maps to SkillController (/api/v1/skills).
 * GET /skills/categories -> List<SkillCategory>
 * GET /skills?categoryId=&search= -> List<Skill>
 * NOTE: These GET endpoints are public (no auth required per SecurityConfig).
 */
export function getCategories() {
  return axiosClient.get('/skills/categories');
}

export function getSkills(params = {}) {
  // params: { categoryId, search }
  return axiosClient.get('/skills', { params });
}

export function searchSkills(search) {
  return axiosClient.get('/skills', { params: { search } });
}

export default {
  getCategories,
  getSkills,
  searchSkills,
};
