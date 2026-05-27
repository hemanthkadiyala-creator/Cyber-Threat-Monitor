import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Users, FileText, FolderOpen, Mail, Activity,
  Plus, Edit3, Trash2, Eye, LogOut, MessageSquare, Award, LayoutDashboard
} from 'lucide-react';
import { supabase, apiFetch } from '../../lib/supabase';
import { PROJECTS_DATA, CERTIFICATIONS_DATA, BLOG_POSTS_DATA, SOC_INCIDENTS_DATA } from '../../lib/data';
import { StatusBadge, SeverityBadge, LoadingSpinner } from '../ui/SeverityBadge';

type Tab = 'overview' | 'projects' | 'blog' | 'certifications' | 'messages' | 'incidents';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profile?.role === 'admin') {
        setIsAdmin(true);
      } else {
        navigate('/login');
      }
    } catch {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const fetchMessages = async () => {
    try {
      const data = await apiFetch('/contact');
      setMessages(data);
    } catch {}
  };

  useEffect(() => {
    if (isAdmin && activeTab === 'messages') fetchMessages();
  }, [isAdmin, activeTab]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const tabs: { key: Tab; icon: typeof Shield; label: string }[] = [
    { key: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { key: 'projects', icon: FolderOpen, label: 'Projects' },
    { key: 'blog', icon: FileText, label: 'Blog' },
    { key: 'certifications', icon: Award, label: 'Certs' },
    { key: 'messages', icon: Mail, label: 'Messages' },
    { key: 'incidents', icon: Activity, label: 'Incidents' },
  ];

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="section-container">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-neon-blue" />
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-dark-400 text-sm">Manage your cybersecurity platform</p>
            </div>
          </div>
          <button onClick={handleLogout} className="cyber-btn-danger flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30'
                  : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'projects' && <ProjectsTab />}
        {activeTab === 'blog' && <BlogTab />}
        {activeTab === 'certifications' && <CertsTab />}
        {activeTab === 'messages' && <MessagesTab messages={messages} onRefresh={fetchMessages} />}
        {activeTab === 'incidents' && <IncidentsTab />}
      </div>
    </div>
  );
}

function OverviewTab() {
  const stats = [
    { icon: FolderOpen, label: 'Projects', value: PROJECTS_DATA.length, color: 'text-neon-blue' },
    { icon: FileText, label: 'Blog Posts', value: BLOG_POSTS_DATA.length, color: 'text-neon-green' },
    { icon: Award, label: 'Certifications', value: CERTIFICATIONS_DATA.length, color: 'text-neon-purple' },
    { icon: Activity, label: 'Active Incidents', value: SOC_INCIDENTS_DATA.filter((i) => i.status !== 'resolved').length, color: 'text-neon-red' },
    { icon: Users, label: 'Visitors', value: '1.2K', color: 'text-neon-yellow' },
    { icon: MessageSquare, label: 'Messages', value: 3, color: 'text-neon-orange' },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="cyber-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
            <span className="text-dark-400 text-sm">{stat.label}</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}

function ProjectsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Manage Projects</h2>
        <button className="cyber-btn-primary text-xs flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>
      {PROJECTS_DATA.map((project) => (
        <div key={project.id} className="cyber-card p-5 flex items-center gap-4">
          <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <img src={project.image_url} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm">{project.title}</h3>
            <p className="text-dark-400 text-xs truncate">{project.description}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="p-2 rounded-lg text-dark-400 hover:text-neon-blue hover:bg-dark-800/50 transition-all">
              <Edit3 className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg text-dark-400 hover:text-neon-red hover:bg-dark-800/50 transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function BlogTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Manage Blog Posts</h2>
        <button className="cyber-btn-primary text-xs flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>
      {BLOG_POSTS_DATA.map((post) => (
        <div key={post.id} className="cyber-card p-5 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm">{post.title}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-mono text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded">
                {post.category.replace('-', ' ')}
              </span>
              <StatusBadge status={post.published ? 'completed' : 'pending'} />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="p-2 rounded-lg text-dark-400 hover:text-neon-blue hover:bg-dark-800/50 transition-all">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg text-dark-400 hover:text-neon-blue hover:bg-dark-800/50 transition-all">
              <Edit3 className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg text-dark-400 hover:text-neon-red hover:bg-dark-800/50 transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CertsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Manage Certifications</h2>
        <button className="cyber-btn-primary text-xs flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Certification
        </button>
      </div>
      {CERTIFICATIONS_DATA.map((cert) => (
        <div key={cert.id} className="cyber-card p-5 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm">{cert.title}</h3>
            <p className="text-dark-400 text-xs">{cert.issuer} - {cert.issue_date}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="p-2 rounded-lg text-dark-400 hover:text-neon-blue hover:bg-dark-800/50 transition-all">
              <Edit3 className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg text-dark-400 hover:text-neon-red hover:bg-dark-800/50 transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function MessagesTab({ messages, onRefresh }: { messages: any[]; onRefresh: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Contact Messages</h2>
        <button onClick={onRefresh} className="cyber-btn text-xs">Refresh</button>
      </div>
      {messages.length === 0 ? (
        <div className="text-center py-12 text-dark-400">No messages yet.</div>
      ) : (
        messages.map((msg: any) => (
          <div key={msg.id} className={`cyber-card p-5 ${msg.read ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm">{msg.name}</span>
                <span className="text-dark-500 text-xs font-mono">{msg.email}</span>
              </div>
              <span className="text-dark-500 text-xs font-mono">
                {new Date(msg.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-neon-blue text-xs mb-2">{msg.subject}</p>
            <p className="text-dark-300 text-sm">{msg.message}</p>
          </div>
        ))
      )}
    </div>
  );
}

function IncidentsTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white mb-4">SOC Incidents</h2>
      {SOC_INCIDENTS_DATA.map((inc) => (
        <div key={inc.id} className="cyber-card p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-white font-medium text-sm">{inc.title}</span>
              <SeverityBadge severity={inc.severity} size="sm" />
            </div>
            <StatusBadge status={inc.status} />
          </div>
          <p className="text-dark-400 text-xs">{inc.description}</p>
        </div>
      ))}
    </div>
  );
}
