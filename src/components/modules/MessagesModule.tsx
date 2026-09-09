import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Hash,
  Lock,
  Search,
  Users,
  Building,
  Sparkles
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';

export const MessagesModule: React.FC = () => {
  const {
    filteredMessages,
    sendMessage,
    currentUser,
    activeBusiness,
    activeBusinessId
  } = useBusiness();

  const [activeChannel, setActiveChannel] = useState('executive-board');
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');

  const channels = [
    { id: 'executive-board', name: 'executive-board', isPrivate: true, desc: 'Owner & Executive strategy' },
    { id: 'finance-audit', name: 'finance-audit', isPrivate: true, desc: 'P&L, cash draws & tax review' },
    { id: 'operations', name: 'operations-all', isPrivate: false, desc: 'Cross-holding operational sync' },
    { id: 'deal-flow', name: 'deal-flow-crm', isPrivate: false, desc: 'Pipeline and client proposals' }
  ];

  const channelMessages = filteredMessages.filter(
    (m) => m.channel === activeChannel
  );

  const displayedMessages = channelMessages.filter((m) => {
    const s = (search || '').toLowerCase();
    const msgText = (m.text || '').toLowerCase();
    const sender = (m.senderName || '').toLowerCase();
    return msgText.includes(s) || sender.includes(s);
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim(), activeChannel);
    setInputText('');
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 lg:px-6 lg:py-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-emerald-400">
            <MessageSquare className="w-4 h-4" />
            <span>Encrypted Internal Comms</span>
          </div>
          <h1 className="text-xl font-extrabold text-white mt-0.5">Executive Team Communications</h1>
        </div>
        <div className="text-xs text-slate-400">
          Target Entity:{' '}
          <span className="font-bold text-emerald-400 font-mono">
            {activeBusinessId === 'CONSOLIDATED' ? 'Consolidated Holdings' : activeBusiness?.name}
          </span>
        </div>
      </div>

      {/* Main Messaging Interface */}
      <div className="flex-1 min-h-0 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm">
        {/* Sidebar Channels */}
        <div className="w-full md:w-64 bg-slate-950/40 border-b md:border-b-0 md:border-r border-slate-800 p-3 flex flex-col shrink-0">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1.5 flex items-center justify-between">
            <span>Channels</span>
            <span className="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded font-mono">
              {channels.length}
            </span>
          </div>

          <div className="space-y-1 mt-2">
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                  activeChannel === ch.id
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {ch.isPrivate ? (
                    <Lock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                  ) : (
                    <Hash className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  )}
                  <span className="truncate">{ch.name}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-slate-800/80 px-2">
            <div className="text-[10px] text-slate-400">Communicating as:</div>
            <div className="flex items-center gap-2 mt-1.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-slate-700"
              />
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                <div className="text-[10px] text-emerald-400 font-mono">{currentUser.title}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-900/50">
          {/* Channel Header */}
          <div className="h-12 border-b border-slate-800 px-4 flex items-center justify-between bg-slate-900/80 shrink-0">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-white font-mono">#{activeChannel}</span>
              <span className="text-xs text-slate-400 hidden sm:inline">•</span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                {channels.find((c) => c.id === activeChannel)?.desc}
              </span>
            </div>

            <div className="relative w-44">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-2 py-1 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {displayedMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                <MessageSquare className="w-8 h-8 text-slate-600 mb-2" />
                <span>No messages yet in #{activeChannel}. Start the discussion!</span>
              </div>
            ) : (
              displayedMessages.map((msg) => {
                const isMe = msg.senderName === currentUser.name;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                  >
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0 mt-0.5"
                    />
                    <div
                      className={`max-w-[75%] rounded-2xl p-3 text-xs ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-tr-none shadow-md shadow-emerald-500/10'
                          : 'bg-slate-800 text-slate-200 border border-slate-750 rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-bold ${isMe ? 'text-emerald-100' : 'text-white'}`}>
                          {msg.senderName}
                        </span>
                        <span
                          className={`text-[10px] font-mono ${
                            isMe ? 'text-emerald-200/80' : 'text-slate-400'
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder={`Send message to #${activeChannel}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
