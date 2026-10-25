import React, { useState, useEffect } from 'react';
import * as profileApi from '../../api/profileApi';
import * as skillApi from '../../api/skillApi';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  PROFICIENCY_LEVEL,
  PROFICIENCY_LABELS,
  PRIORITY,
  PRIORITY_LABELS,
} from '../../utils/constants';
import { BookOpen, Sparkles, Plus, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function MySkillsPage() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [masterSkills, setMasterSkills] = useState([]);

  // Add Teach Skill Modal State
  const [teachModalOpen, setTeachModalOpen] = useState(false);
  const [teachSkillId, setTeachSkillId] = useState('');
  const [proficiencyLevel, setProficiencyLevel] = useState(PROFICIENCY_LEVEL.INTERMEDIATE);
  const [experienceMonths, setExperienceMonths] = useState(6);
  const [proofDescription, setProofDescription] = useState('');
  const [submittingTeach, setSubmittingTeach] = useState(false);

  // Add Learn Skill Modal State
  const [learnModalOpen, setLearnModalOpen] = useState(false);
  const [learnSkillId, setLearnSkillId] = useState('');
  const [targetProficiencyLevel, setTargetProficiencyLevel] = useState(PROFICIENCY_LEVEL.ADVANCED);
  const [priority, setPriority] = useState(PRIORITY.HIGH);
  const [learningGoalNotes, setLearningGoalNotes] = useState('');
  const [submittingLearn, setSubmittingLearn] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [profRes, skillsRes] = await Promise.all([
        profileApi.getMyProfile(),
        skillApi.getSkills(),
      ]);
      setProfile(profRes?.data);
      const allSkills = skillsRes?.data || [];
      setMasterSkills(allSkills);
      if (allSkills.length > 0) {
        setTeachSkillId(allSkills[0].id);
        setLearnSkillId(allSkills[0].id);
      }
    } catch (err) {
      toast.error('Failed to load skills inventory');
    } finally {
      setLoading(false);
    }
  }

  // Add Teach Skill
  async function handleAddTeach(e) {
    e.preventDefault();
    if (!teachSkillId) return;

    setSubmittingTeach(true);
    try {
      await profileApi.addTeachSkill({
        skillId: Number(teachSkillId),
        proficiencyLevel,
        experienceMonths: Number(experienceMonths),
        proofDescription: proofDescription.trim(),
      });
      toast.success('Skill added to your teaching repertoire!');
      setTeachModalOpen(false);
      setProofDescription('');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to add taught skill');
    } finally {
      setSubmittingTeach(false);
    }
  }

  // Delete Teach Skill
  async function handleDeleteTeach(skillId) {
    if (!window.confirm('Are you sure you want to remove this skill from what you teach?')) return;
    try {
      await profileApi.deleteTeachSkill(skillId);
      toast.info('Taught skill removed');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to remove skill');
    }
  }

  // Add Learn Skill
  async function handleAddLearn(e) {
    e.preventDefault();
    if (!learnSkillId) return;

    setSubmittingLearn(true);
    try {
      await profileApi.addLearnSkill({
        skillId: Number(learnSkillId),
        targetProficiencyLevel,
        priority,
        learningGoalNotes: learningGoalNotes.trim(),
      });
      toast.success('Skill added to your learning goals!');
      setLearnModalOpen(false);
      setLearningGoalNotes('');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to add learning goal');
    } finally {
      setSubmittingLearn(false);
    }
  }

  // Delete Learn Skill
  async function handleDeleteLearn(skillId) {
    if (!window.confirm('Are you sure you want to remove this skill from your learning goals?')) return;
    try {
      await profileApi.deleteLearnSkill(skillId);
      toast.info('Learning goal removed');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to remove learning goal');
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading your skills..." className="min-h-[50vh]" />;
  }

  const teachCount = profile?.teachSkills?.length || 0;
  const learnCount = profile?.learnSkills?.length || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Skills Inventory</h1>
        <p className="mt-1 text-xs text-slate-500">
          Configure what you are ready to teach peers and what topics you are eager to master.
        </p>
      </div>

      {/* Grid: Teach vs Learn */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Teach Column */}
        <div className="space-y-4">
          <div className="card p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Skills I Can Teach</h3>
                  <p className="text-[11px] text-slate-500">{teachCount}/10 max skills</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTeachModalOpen(true)}
                disabled={teachCount >= 10}
                className="btn btn-primary btn-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Skill</span>
              </button>
            </div>

            {teachCount === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                You haven't added any skills to teach yet. Add at least 1 skill to unlock peer matches!
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {profile.teachSkills.map((ts) => (
                  <div key={ts.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">{ts.skillName}</span>
                        <span className="badge badge-green text-[10px]">
                          {PROFICIENCY_LABELS[ts.proficiencyLevel] || ts.proficiencyLevel}
                        </span>
                      </div>
                      {ts.experienceMonths > 0 && (
                        <p className="mt-1 text-xs text-slate-500">
                          {ts.experienceMonths} months experience
                        </p>
                      )}
                      {ts.proofDescription && (
                        <p className="mt-1.5 text-xs text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100">
                          &ldquo;{ts.proofDescription}&rdquo;
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteTeach(ts.skillId || ts.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Remove taught skill"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Learn Column */}
        <div className="space-y-4">
          <div className="card p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Skills I Want to Learn</h3>
                  <p className="text-[11px] text-slate-500">{learnCount}/10 max goals</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLearnModalOpen(true)}
                disabled={learnCount >= 10}
                className="btn btn-secondary btn-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Goal</span>
              </button>
            </div>

            {learnCount === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                You haven't set any learning goals. Add what you want to learn to get matched!
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {profile.learnSkills.map((ls) => (
                  <div key={ls.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">{ls.skillName}</span>
                        <span className="badge badge-indigo text-[10px]">
                          {PRIORITY_LABELS[ls.priority] || ls.priority} Priority
                        </span>
                      </div>
                      {ls.learningGoalNotes && (
                        <p className="mt-1.5 text-xs text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100">
                          &ldquo;{ls.learningGoalNotes}&rdquo;
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteLearn(ls.skillId || ls.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Remove learning goal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Add Teach Skill */}
      <Modal
        isOpen={teachModalOpen}
        onClose={() => setTeachModalOpen(false)}
        title="Add Skill You Can Teach"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddTeach} className="space-y-4">
          <div>
            <label className="label">Select Master Skill</label>
            <select
              value={teachSkillId}
              onChange={(e) => setTeachSkillId(e.target.value)}
              className="input"
              required
            >
              {masterSkills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category?.name || 'Skill'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Your Proficiency Level</label>
            <select
              value={proficiencyLevel}
              onChange={(e) => setProficiencyLevel(e.target.value)}
              className="input"
            >
              {Object.entries(PROFICIENCY_LEVEL).map(([k, v]) => (
                <option key={k} value={v}>
                  {PROFICIENCY_LABELS[k] || v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Months of Practical Experience</label>
            <input
              type="number"
              value={experienceMonths}
              onChange={(e) => setExperienceMonths(e.target.value)}
              min={1}
              max={120}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Evidence / Proof of Skill</label>
            <textarea
              value={proofDescription}
              onChange={(e) => setProofDescription(e.target.value)}
              placeholder="e.g. Built 3 full-stack React projects, certified in Spring Boot, course grade A+"
              className="input"
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setTeachModalOpen(false)}
              className="btn btn-secondary btn-sm"
              disabled={submittingTeach}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={submittingTeach}
            >
              <span>{submittingTeach ? 'Saving...' : 'Add to Teach Repertoire'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Learn Skill */}
      <Modal
        isOpen={learnModalOpen}
        onClose={() => setLearnModalOpen(false)}
        title="Add Learning Goal"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddLearn} className="space-y-4">
          <div>
            <label className="label">Select Master Skill</label>
            <select
              value={learnSkillId}
              onChange={(e) => setLearnSkillId(e.target.value)}
              className="input"
              required
            >
              {masterSkills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category?.name || 'Skill'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Target Proficiency Level</label>
            <select
              value={targetProficiencyLevel}
              onChange={(e) => setTargetProficiencyLevel(e.target.value)}
              className="input"
            >
              {Object.entries(PROFICIENCY_LEVEL).map(([k, v]) => (
                <option key={k} value={v}>
                  {PROFICIENCY_LABELS[k] || v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Learning Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="input"
            >
              {Object.entries(PRIORITY).map(([k, v]) => (
                <option key={k} value={v}>
                  {PRIORITY_LABELS[k] || v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Learning Goal Notes</label>
            <textarea
              value={learningGoalNotes}
              onChange={(e) => setLearningGoalNotes(e.target.value)}
              placeholder="e.g. Preparing for summer internship technical interview, need DSA guidance..."
              className="input"
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setLearnModalOpen(false)}
              className="btn btn-secondary btn-sm"
              disabled={submittingLearn}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={submittingLearn}
            >
              <span>{submittingLearn ? 'Saving...' : 'Add Learning Goal'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default MySkillsPage;
