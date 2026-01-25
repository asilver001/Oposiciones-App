import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, Shield, Users, FileText, Settings,
  CheckCircle, XCircle, Clock, RefreshCw, Download,
  Upload, Eye, Edit, Trash2, BarChart3, LogOut,
  ChevronRight, AlertTriangle, Search, Filter,
  BookOpen, List, TrendingUp, Plus, Lightbulb
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import QuestionImporter from './QuestionImporter';
import QuestionExporter from './QuestionExporter';
import QuestionTierManager from './QuestionTierManager';
import TemasTab from './TemasTab';
import PreguntasTab from './PreguntasTab';
import InsightsTab from './InsightsTab';
import { ReviewContainer } from '../review';
import { BottomTabBar } from '../navigation';

export default function AdminPanel({ onBack }) {
  // Support both AdminContext (PIN login) and AuthContext (normal login with role)
  const { adminUser, logoutAdmin, isAdmin: isAdminFromPin } = useAdmin();
  const { user: authUser, userRole, signOut, isAdmin: isAdminFromAuth } = useAuth();

  // Use whichever user is available (prioritize AdminContext for backwards compatibility)
  const currentUser = adminUser || (isAdminFromAuth ? {
    name: userRole?.name || authUser?.user_metadata?.display_name || authUser?.email,
    email: authUser?.email,
    role: 'admin'
  } : null);
  const isAdmin = isAdminFromPin || isAdminFromAuth;
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      // Get question stats
      const { data: questions, error: qError } = await supabase
        .from('questions')
        .select('validation_status, is_current_version, needs_refresh, tema, times_shown, question_text, id')
        .eq('is_active', true);

      if (qError) throw qError;

      const currentQuestions = questions?.filter(q => q.is_current_version !== false) || [];

      const questionStats = {
        total: currentQuestions.length,
        approved: currentQuestions.filter(q => q.validation_status === 'human_approved').length,
        pending: currentQuestions.filter(q => q.validation_status === 'human_pending').length,
        autoValidated: currentQuestions.filter(q => q.validation_status === 'auto_validated').length,
        rejected: currentQuestions.filter(q => q.validation_status === 'rejected').length,
        needsRefresh: currentQuestions.filter(q => q.needs_refresh).length,
      };

      // Get tema distribution
      const temaDistribution = {};
      currentQuestions.forEach(q => {
        if (q.tema) {
          if (!temaDistribution[q.tema]) {
            temaDistribution[q.tema] = { total: 0, approved: 0 };
          }
          temaDistribution[q.tema].total++;
          if (q.validation_status === 'human_approved') {
            temaDistribution[q.tema].approved++;
          }
        }
      });

      // Get refresh candidates (most viewed)
      const refreshCandidates = currentQuestions
        .filter(q => (q.times_shown || 0) >= 50 && !q.needs_refresh)
        .sort((a, b) => (b.times_shown || 0) - (a.times_shown || 0))
        .slice(0, 5);

      // Get admin stats using RPC function (bypasses RLS)
      let admins = [];
      try {
        const { data: adminsData, error: aError } = await supabase.rpc('get_admin_users');
        if (!aError && adminsData) {
          admins = adminsData;
        }
      } catch (rpcErr) {
        console.warn('RPC get_admin_users not available, trying direct query');
        // Fallback: direct query (might fail due to RLS)
        const { data: directAdmins } = await supabase
          .from('admin_users')
          .select('*')
          .eq('is_active', true);
        admins = directAdmins || [];
      }

      setStats({
        questions: questionStats,
        admins,
        temaDistribution,
        refreshCandidates
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Auto-refresh stats when switching to overview tab
  useEffect(() => {
    if (activeTab === 'overview') {
      loadStats();
    }
  }, [activeTab, loadStats]);

  const handleLogout = async () => {
    // Logout from whichever context is active
    if (adminUser) {
      logoutAdmin();
    }
    // Don't sign out from AuthContext - just go back to home
    // User stays logged in to the app, just exits admin panel
    onBack();
  };

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'review', label: 'Revisar', icon: CheckCircle },
    { id: 'questions', label: 'Preguntas', icon: List },
    { id: 'temas', label: 'Temas', icon: BookOpen },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'import', label: 'Importar', icon: Upload },
    { id: 'export', label: 'Exportar', icon: Download },
    { id: 'tiers', label: 'Tiers', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Panel de Admin
                </h1>
                <p className="text-purple-200 text-sm">
                  {currentUser?.name || currentUser?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto pb-px scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-white text-white'
                    : 'border-transparent text-purple-200 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <OverviewTab stats={stats} loading={loading} onRefresh={loadStats} />
        )}
        {activeTab === 'review' && (
          <ReviewContainer />
        )}
        {activeTab === 'questions' && (
          <PreguntasTab />
        )}
        {activeTab === 'temas' && (
          <TemasTab />
        )}
        {activeTab === 'insights' && (
          <InsightsTab />
        )}
        {activeTab === 'import' && (
          <QuestionImporter onImportComplete={loadStats} />
        )}
        {activeTab === 'export' && (
          <QuestionExporter />
        )}
        {activeTab === 'tiers' && (
          <QuestionTierManager />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomTabBar
        activeTab="admin"
        onTabChange={() => {}}
        onPageChange={(page) => {
          if (page === 'home') onBack?.();
        }}
      />
    </div>
  );
}

// Overview Tab Component (Enhanced)
function OverviewTab({ stats, loading, onRefresh }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Preguntas', value: stats?.questions?.total || 0, icon: FileText, color: 'blue' },
    { label: 'Aprobadas', value: stats?.questions?.approved || 0, icon: CheckCircle, color: 'green' },
    { label: 'Pendientes', value: stats?.questions?.pending || 0, icon: Clock, color: 'yellow' },
    { label: 'Auto-validadas', value: stats?.questions?.autoValidated || 0, icon: CheckCircle, color: 'purple' },
    { label: 'Rechazadas', value: stats?.questions?.rejected || 0, icon: XCircle, color: 'red' },
    { label: 'Necesitan Refresh', value: stats?.questions?.needsRefresh || 0, icon: RefreshCw, color: 'orange' },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  };

  // Prepare tema distribution data
  const temaData = Object.entries(stats?.temaDistribution || {})
    .map(([tema, data]) => ({
      tema: parseInt(tema),
      ...data,
      percentage: data.total > 0 ? Math.round((data.approved / data.total) * 100) : 0
    }))
    .sort((a, b) => a.tema - b.tema)
    .slice(0, 12);

  return (
    <div className="space-y-6">
      {/* Refresh button */}
      <div className="flex justify-end">
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map(card => (
          <div
            key={card.label}
            className={`p-4 rounded-xl border ${colorClasses[card.color]}`}
          >
            <div className="flex items-center gap-3">
              <card.icon className="w-8 h-8 opacity-80" />
              <div>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="text-sm opacity-80">{card.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tema Distribution */}
      {temaData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <h3 className="font-medium">Distribución por Tema</h3>
          </div>
          <div className="p-4 space-y-3">
            {temaData.map(item => (
              <div key={item.tema} className="flex items-center gap-3">
                <span className="w-16 text-sm text-gray-600 font-medium">Tema {item.tema}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-24 text-sm text-right">
                  <span className="font-medium text-gray-900">{item.approved}</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-600">{item.total}</span>
                  <span className="text-gray-400 ml-1">({item.percentage}%)</span>
                </span>
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-2">
              Barra = % de preguntas aprobadas del total por tema
            </p>
          </div>
        </div>
      )}

      {/* Refresh Candidates */}
      {stats?.refreshCandidates?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-orange-500" />
            <h3 className="font-medium">Candidatas a Reformular</h3>
            <span className="text-xs text-gray-500 ml-2">(más de 50 vistas)</span>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.refreshCandidates.map((q, idx) => (
              <div key={q.id || idx} className="px-4 py-3 flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-sm text-gray-900 truncate">
                    {q.question_text}
                  </p>
                  <p className="text-xs text-gray-500">
                    Tema {q.tema || '?'} · {q.times_shown || 0} vistas
                  </p>
                </div>
                <button className="px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors whitespace-nowrap">
                  <Plus className="w-3 h-3 inline mr-1" />
                  Nueva v.
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Users */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-500" />
          <h3 className="font-medium">Administradores Activos</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {stats?.admins?.map(admin => (
            <div key={admin.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{admin.name || admin.email}</div>
                <div className="text-sm text-gray-500">
                  {admin.email}
                  {admin.last_login_at && (
                    <span className="ml-2 text-xs text-gray-400">
                      · Último acceso: {new Date(admin.last_login_at).toLocaleDateString('es-ES')}
                    </span>
                  )}
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                admin.role === 'admin'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {admin.role === 'admin' ? 'Admin' : 'Revisor'}
              </span>
            </div>
          ))}
          {(!stats?.admins || stats.admins.length === 0) && (
            <div className="px-4 py-8 text-center text-gray-500">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p>No se pudieron cargar los administradores.</p>
              <p className="text-xs mt-1">Ejecuta la migración 004 en Supabase para habilitar esta función.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

