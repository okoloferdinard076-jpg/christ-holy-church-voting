import React, { useState } from 'react';
import { Candidate } from '../../types';
import { createCandidate, updateCandidate } from '../../services/api';
import {
  Users,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  MapPin,
  Vote,
  Save,
  X,
  AlertCircle,
} from 'lucide-react';

interface CandidateManagerProps {
  token: string;
  candidates: Candidate[];
  onRefresh: () => void;
}

export const CandidateManager: React.FC<CandidateManagerProps> = ({
  token,
  candidates,
  onRefresh,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [biography, setBiography] = useState('');
  const [image, setImage] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const openAddModal = () => {
    setName('');
    setState('Imo State');
    setBiography('');
    setImage('');
    setSortOrder(candidates.length + 1);
    setStatus('ACTIVE');
    setIsAddOpen(true);
    setEditingCandidate(null);
    setMessage(null);
  };

  const getInitials = (candName: string) => {
    return candName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  };

  const openEditModal = (c: Candidate) => {
    setEditingCandidate(c);
    setName(c.name);
    setState(c.state);
    setBiography(c.biography);
    setImage(c.image);
    setSortOrder(c.sortOrder || 1);
    setStatus(c.status);
    setIsAddOpen(false);
    setMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !state.trim()) {
      setMessage({ type: 'error', text: 'Candidate Name and State are required' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      if (editingCandidate) {
        await updateCandidate(token, editingCandidate.id, {
          name: name.trim(),
          state: state.trim(),
          biography: biography.trim(),
          image: image.trim(),
          sortOrder: Number(sortOrder),
          status,
        });
        setMessage({ type: 'success', text: `Candidate "${name}" updated successfully.` });
        setEditingCandidate(null);
      } else {
        await createCandidate(token, {
          name: name.trim(),
          state: state.trim(),
          biography: biography.trim(),
          image: image.trim(),
          sortOrder: Number(sortOrder),
        });
        setMessage({ type: 'success', text: `Candidate "${name}" added successfully.` });
        setIsAddOpen(false);
      }
      onRefresh();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Operation failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (cand: Candidate) => {
    const nextStatus = cand.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateCandidate(token, cand.id, { status: nextStatus });
      onRefresh();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6" id="admin-candidate-manager">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-blue-950">Candidate Management</h2>
          <p className="text-xs text-slate-500">
            Manage ambassadorial candidates, bios, photos, and active contest status.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Candidate</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)}>✕</button>
        </div>
      )}

      {/* Candidates List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map((cand) => (
          <div
            key={cand.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start gap-4">
              {cand.image && cand.image.trim() ? (
                <img
                  src={cand.image}
                  alt={cand.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-blue-900/10 border border-blue-950/15 flex items-center justify-center text-blue-950 font-black text-sm shrink-0">
                  {getInitials(cand.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-blue-950 truncate">
                    {cand.name}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cand.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cand.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-red-600 font-semibold mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{cand.state}</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {cand.biography}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950">
                <Vote className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{(cand.approvedVotes || 0).toLocaleString()} Verified Votes</span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => toggleStatus(cand)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-50 text-slate-600 cursor-pointer"
                >
                  {cand.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => openEditModal(cand)}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-900 hover:bg-blue-100 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {(isAddOpen || editingCandidate) && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-blue-950 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
              <h3 className="font-extrabold text-base">
                {editingCandidate ? `Edit ${editingCandidate.name}` : 'Add New Ambassador Candidate'}
              </h3>
              <button
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingCandidate(null);
                }}
                className="text-slate-300 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Candidate Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amarachi Akunne"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-blue-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    State Represented <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Imo State"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Photo Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-blue-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Biography / Profile</label>
                <textarea
                  rows={3}
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  placeholder="Brief candidate background in church service..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-blue-900"
                />
              </div>

              {editingCandidate && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingCandidate(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isLoading ? 'Saving...' : 'Save Candidate'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
