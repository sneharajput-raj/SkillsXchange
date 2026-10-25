import axiosClient from './axiosClient';

/**
 * Profile API — maps to ProfileController (/api/v1/profiles).
 *
 * GET    /profiles/me                       -> StudentProfileDto
 * PUT    /profiles/me                       -> UpdateProfileRequest -> StudentProfileDto
 * GET    /profiles/{userId}                 -> StudentProfileDto
 * GET    /profiles?query=&categoryId=       -> Page<StudentSummaryDto>
 * POST   /profiles/me/skills/teach          -> AddTeachSkillRequest
 * DELETE /profiles/me/skills/teach/{skillId}
 * POST   /profiles/me/skills/learn          -> AddLearnSkillRequest
 * DELETE /profiles/me/skills/learn/{skillId}
 * PUT    /profiles/me/availability          -> SetAvailabilityRequest
 */

export function getMyProfile() {
  return axiosClient.get('/profiles/me');
}

export function updateMyProfile(payload) {
  // { bio, avatarUrl, portfolioUrl, preferredLearningMode, graduationYear }
  return axiosClient.put('/profiles/me', payload);
}

export function getStudentProfile(userId) {
  return axiosClient.get(`/profiles/${userId}`);
}

export function searchStudents(params = {}) {
  // params: { query, categoryId, page, size, sort }
  return axiosClient.get('/profiles', { params });
}

export function addTeachSkill(payload) {
  // { skillId, proficiencyLevel, experienceMonths, proofDescription }
  return axiosClient.post('/profiles/me/skills/teach', payload);
}

export function deleteTeachSkill(skillId) {
  return axiosClient.delete(`/profiles/me/skills/teach/${skillId}`);
}

export function addLearnSkill(payload) {
  // { skillId, targetProficiencyLevel, priority, learningGoalNotes }
  return axiosClient.post('/profiles/me/skills/learn', payload);
}

export function deleteLearnSkill(skillId) {
  return axiosClient.delete(`/profiles/me/skills/learn/${skillId}`);
}

export function setAvailability(slots) {
  // slots: [{ dayOfWeek, startTime, endTime }]
  return axiosClient.put('/profiles/me/availability', { slots });
}

export default {
  getMyProfile,
  updateMyProfile,
  getStudentProfile,
  searchStudents,
  addTeachSkill,
  deleteTeachSkill,
  addLearnSkill,
  deleteLearnSkill,
  setAvailability,
};
