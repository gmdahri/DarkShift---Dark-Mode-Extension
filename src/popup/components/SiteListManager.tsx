import { useState } from 'react';
import { useSiteList } from '../hooks/useSiteList';
import { SiteListEntry } from '../../utils/siteList';

interface SiteListManagerProps {
  onClose: () => void;
}

export function SiteListManager({ onClose }: SiteListManagerProps) {
  const { whitelist, blacklist, loading, addToWhite, removeFromWhite, addToBlack, removeFromBlack, clearWhite, clearBlack } = useSiteList();
  const [activeTab, setActiveTab] = useState<'whitelist' | 'blacklist'>('whitelist');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [newNote, setNewNote] = useState('');

  const handleAdd = async () => {
    if (!newDomain.trim()) return;
    
    const domain = newDomain.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
    
    if (activeTab === 'whitelist') {
      await addToWhite(domain, newNote.trim() || undefined);
    } else {
      await addToBlack(domain, newNote.trim() || undefined);
    }
    
    setNewDomain('');
    setNewNote('');
    setShowAddForm(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderList = (list: SiteListEntry[], onRemove: (domain: string) => void) => {
    if (list.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
            <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-white/40 font-medium">No sites yet</p>
          <p className="text-white/20 text-sm mt-1">
            Add sites to your {activeTab === 'whitelist' ? 'allow' : 'block'} list
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {list.map((entry, index) => (
          <div
            key={entry.domain}
            className="group flex items-center justify-between p-3 rounded-xl glass glass-hover
              animate-fade-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <img 
                  src={`https://www.google.com/s2/favicons?domain=${entry.domain}&sz=32`}
                  alt=""
                  className="w-4 h-4"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{entry.domain}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {entry.note && (
                    <p className="text-[10px] text-white/40 truncate max-w-[120px]">{entry.note}</p>
                  )}
                  <span className="text-[10px] text-white/20">{formatDate(entry.addedAt)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onRemove(entry.domain)}
              className="p-2 text-white/30 hover:text-rose-400 hover:bg-rose-500/10 
                rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Remove"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="absolute inset-0 bg-[#08080c]/98 backdrop-blur-xl z-30 flex flex-col animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Site Lists</h2>
          <p className="text-xs text-white/40 mt-1">Manage allowed and blocked sites</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 pb-4">
        <div className="flex gap-2 p-1 rounded-xl bg-white/5">
          <button
            onClick={() => setActiveTab('whitelist')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300
              ${activeTab === 'whitelist'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Allow ({whitelist.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('blacklist')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300
              ${activeTab === 'blacklist'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25'
                : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Block ({blacklist.length})
            </span>
          </button>
        </div>
      </div>

      {/* Add Form */}
      <div className="px-6 pb-4">
        {showAddForm ? (
          <div className="p-4 rounded-xl glass animate-scale-in">
            <input
              type="text"
              placeholder="Enter domain (e.g., example.com)"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="w-full mb-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                text-white placeholder-white/30 focus:outline-none focus:border-white/30
                font-medium text-sm transition-colors"
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
            <input
              type="text"
              placeholder="Note (optional)"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full mb-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                text-white placeholder-white/30 focus:outline-none focus:border-white/30
                text-sm transition-colors"
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all
                  ${activeTab === 'whitelist'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'}`}
              >
                Add to {activeTab === 'whitelist' ? 'Allow' : 'Block'} List
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewDomain('');
                  setNewNote('');
                }}
                className="py-2.5 px-4 rounded-xl font-semibold text-sm text-white/60 
                  bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all
              flex items-center justify-center gap-2
              ${activeTab === 'whitelist'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/25'
                : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-lg hover:shadow-rose-500/25'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Site
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
          </div>
        ) : (
          renderList(
            activeTab === 'whitelist' ? whitelist : blacklist,
            activeTab === 'whitelist' ? removeFromWhite : removeFromBlack
          )
        )}
      </div>

      {/* Footer Actions */}
      {((activeTab === 'whitelist' && whitelist.length > 0) || 
        (activeTab === 'blacklist' && blacklist.length > 0)) && (
        <div className="p-6 pt-4 border-t border-white/5">
          <button
            onClick={activeTab === 'whitelist' ? clearWhite : clearBlack}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-sm text-rose-400/80 
              bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 
              hover:border-rose-500/30 transition-all"
          >
            Clear {activeTab === 'whitelist' ? 'Allow' : 'Block'} List
          </button>
        </div>
      )}
    </div>
  );
}
