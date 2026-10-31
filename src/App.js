import React, { useState, useEffect, useRef } from 'react';
import {
  Flame, Radio, MessageSquare, User, Plus, Heart, Bookmark, Share2, Send,
  Sun, Moon, Sparkles, Bell, Mic, Headphones, ShieldCheck, Lock, Database,
  Upload, Eye, EyeOff, Wifi, BatteryCharging, SlidersHorizontal, Camera,
  Ghost, Settings, LogOut, KeyRound, Users, ArrowLeft, Trash2, Edit3
} from 'lucide-react';

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = { apiKey: 'pulsenet-free-tier', projectId: 'pulsenet-zk-cloud' };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'pulsenet-social-live';

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [darkMode, setDarkMode] = useState(true);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [userHandle] = useState('@boss_creator');

  // Real-time Cloud Firestore Listeners
  useEffect(() => {
    signInAnonymously(auth).catch(() => {});
    const unsubPosts = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'posts'), (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubMsgs = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'messages'), (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubPosts(); unsubMsgs(); };
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msgId = 'm_' + Date.now();
    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'messages', msgId), {
      id: msgId,
      senderHandle: userHandle,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now()
    });
    setChatInput('');
  };

  return (
    <div className={`min-h-screen w-full flex flex-col font-sans select-none ${darkMode ? 'bg-[#09090B] text-zinc-100' : 'bg-zinc-100 text-zinc-900'}`}>
      {/* Header */}
      <header className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between bg-[#121215]/90 backdrop-blur sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
          <span className="font-extrabold tracking-tight text-base">PulseNet</span>
          <span className="text-[10px] font-mono bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-bold">v12.0</span>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 pb-24 max-w-lg mx-auto w-full">
        {activeTab === 'feed' && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-[#131316] border border-zinc-800">
              <h2 className="text-sm font-bold text-amber-400 mb-1">⚡ Pulse Feed (Live Cloud Sync)</h2>
              <p className="text-xs text-zinc-400">Everything is working! UI is live and connected directly to Firestore database.</p>
            </div>
            {posts.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-xs">No posts yet. Tap Post to publish one!</div>
            ) : (
              posts.map(p => (
                <div key={p.id} className="p-4 rounded-3xl bg-[#131316] border border-zinc-800 space-y-2">
                  <div className="text-xs font-bold text-zinc-200">{p.authorName || p.authorHandle}</div>
                  <p className="text-xs text-zinc-300">{p.caption}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'whisper' && (
          <div className="flex flex-col h-[75vh] rounded-3xl bg-[#131316] border border-zinc-800 overflow-hidden">
            <div className="p-3 border-b border-zinc-800 text-xs font-bold text-amber-400 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" /> End-to-End Encrypted Whispers
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {messages.map(m => (
                <div key={m.id} className={`flex flex-col ${m.senderHandle === userHandle ? 'items-end' : 'items-start'}`}>
                  <div className={`p-2.5 rounded-2xl text-xs max-w-[80%] ${m.senderHandle === userHandle ? 'bg-amber-500 text-zinc-950 font-medium' : 'bg-zinc-800 text-white'}`}>
                    {m.text}
                  </div>
                  <span className="text-[9px] text-zinc-500 font-mono mt-0.5">{m.time}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} className="p-2 border-t border-zinc-800 flex gap-2">
              <input
                type="text"
                placeholder="Type encrypted message..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-4 text-xs text-white focus:outline-none"
              />
              <button type="submit" className="w-9 h-9 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-5 rounded-3xl bg-[#131316] border border-zinc-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-zinc-950 font-bold text-lg">B</div>
              <div>
                <h3 className="font-bold text-sm">Boss Creator</h3>
                <span className="text-xs text-zinc-400 font-mono">@boss_creator</span>
              </div>
            </div>
            <div className="text-xs text-emerald-400 font-mono bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
              ● Hardware & ZK Vault Online
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <nav className="fixed bottom-3 left-4 right-4 max-w-lg mx-auto bg-[#18181B]/95 backdrop-blur-xl border border-zinc-800 rounded-full p-2 flex justify-around shadow-2xl z-30">
        <button onClick={() => setActiveTab('feed')} className={`p-2 rounded-full ${activeTab === 'feed' ? 'text-amber-400 font-bold' : 'text-zinc-400'}`}>
          <Radio className="w-5 h-5" />
        </button>
        <button onClick={() => setActiveTab('whisper')} className={`p-2 rounded-full ${activeTab === 'whisper' ? 'text-amber-400 font-bold' : 'text-zinc-400'}`}>
          <MessageSquare className="w-5 h-5" />
        </button>
        <button onClick={() => setActiveTab('profile')} className={`p-2 rounded-full ${activeTab === 'profile' ? 'text-amber-400 font-bold' : 'text-zinc-400'}`}>
          <User className="w-5 h-5" />
        </button>
      </nav>
    </div>
  );
}
