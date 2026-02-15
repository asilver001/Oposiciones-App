import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, UserCheck, CheckCircle, XCircle, Clock,
  RefreshCw, Eye, EyeOff, LogOut, AlertTriangle, FileText,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Keyboard, GitCompare, LayoutGrid, List, RotateCcw, Filter, Search
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { supabase } from '../../lib/supabase';
import { ViewModeSelector, QuestionCardCompact, QuestionDetailModal } from '../review';
import { BottomTabBar } from '../navigation';

// Official tema names from BOE-435 (Resolución 18/12/2025)
const TEMA_NAMES = {
  1: 'CE: Principios, derechos, garantías',
  2: 'TC, Reforma CE, Corona',
  3: 'Cortes Generales, Defensor del Pueblo',
  4: 'Poder Judicial, CGPJ, TS',
  5: 'Gobierno, Presidente, Consejo Ministros',
  6: 'Gobierno Abierto, Agenda 2030',
  7: 'Transparencia (Ley 19/2013)',
  8: 'AGE: órganos centrales y territoriales',
  9: 'CCAA, Administración local',
  10: 'Unión Europea',
  11: 'LPAC + LRJSP, procedimiento, recursos',
  12: 'Protección de datos (LOPDGDD)',
  13: 'Personal funcionario',
  14: 'Derechos y deberes funcionarios',
  15: 'Presupuestos del Estado',
  16: 'Igualdad, género, LGTBI, discapacidad',
};
const TOTAL_TEMAS = 16;

// Parse review_comment for BOE verification status
function parseVerification(reviewComment) {
  if (!reviewComment) return null;
  const match = reviewComment.match(/^\[(VERIFIED|ERROR|AMBIGUOUS)\]/);
  if (!match) return null;
  const type = match[1];
  const boeMatch = reviewComment.match(/«([^»]+)»/);
  const configs = {
    VERIFIED: { label: 'Verificada BOE', bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-800', icon: '✓' },
    ERROR: { label: 'Error detectado', bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-800', icon: '✗' },
    AMBIGUOUS: { label: 'Requiere revisión', bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', icon: '⚠' },
  };
  return { type, ...configs[type], boeText: boeMatch?.[1] || null, detail: reviewComment.replace(/^\[.*?\]\s*/, '') };
}

// Reformulation type labels
const reformulationLabels = {
  'inversion': 'Inversión - De afirmativa a negativa',
  'enfoque': 'Cambio de enfoque - Mismo tema, diferente ángulo',
  'comparativa': 'Comparativa - Contraste entre conceptos',
  'consecuencia': 'Consecuencia - Causa y efecto',
  'caso_practico': 'Caso práctico - Situación aplicada',
  'clarificacion': 'Clarificación - Mejora de redacción',
  'actualizacion': 'Actualización - Datos o normativa actualizada'
};

export default function ReviewerPanel({
  onBack,
  onTabChange,
  onPageChange,
  activeTab,
  currentPage,
  isUserReviewer
}) {
  const { adminUser, logoutAdmin, reviewQuestion, markForRefresh } = useAdmin();

  const currentUser = adminUser;
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0, pilot: 0 });
  const [statsView, setStatsView] = useState(null); // null | 'pending' | 'approved' | 'rejected' | 'total' | 'pilot'
  const [pilotMode, setPilotMode] = useState(false);
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  // Filters
  const [filterOrigin, setFilterOrigin] = useState('all'); // 'all' | 'imported' | 'reformulated' | 'ai_created'
  const [filterTema, setFilterTema] = useState('all'); // 'all' | '1'-'16'
  const [filterSpecial, setFilterSpecial] = useState('all'); // 'all' | 'cultura_general' | 'sin_referencia' | 'needs_refresh'

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // View mode: 'individual', 'grid', 'list'
  const [viewMode, setViewMode] = useState('individual');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(-1);

  // Get the active question list for modal navigation (statsView uses filteredQuestions, otherwise uses questions)
  const modalQuestionList = statsView ? filteredQuestions : questions;

  const selectQuestion = useCallback((question, index) => {
    setSelectedQuestion(question);
    setSelectedQuestionIndex(index);
  }, []);

  const handleModalPrev = useCallback(() => {
    if (selectedQuestionIndex > 0) {
      const prevQ = modalQuestionList[selectedQuestionIndex - 1];
      setSelectedQuestion(prevQ);
      setSelectedQuestionIndex(selectedQuestionIndex - 1);
    }
  }, [selectedQuestionIndex, modalQuestionList]);

  const handleModalNext = useCallback(() => {
    if (selectedQuestionIndex < modalQuestionList.length - 1) {
      const nextQ = modalQuestionList[selectedQuestionIndex + 1];
      setSelectedQuestion(nextQ);
      setSelectedQuestionIndex(selectedQuestionIndex + 1);
    }
  }, [selectedQuestionIndex, modalQuestionList]);

  // Collapsible states
  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState('left');

  // Load questions and stats
  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true })
        .limit(100);

      if (pilotMode) {
        query = query.eq('validation_status', 'pilot_pending');
      } else {
        query = query.in('validation_status', ['human_pending', 'ai_created_pending']);
      }

      if (filterOrigin !== 'all') {
        query = query.eq('origin', filterOrigin);
      }
      if (filterTema !== 'all') {
        query = query.eq('tema', parseInt(filterTema));
      }
      if (filterSpecial === 'cultura_general') {
        query = query.like('review_comment', '[FUENTE_EXTERNA]%');
      } else if (filterSpecial === 'sin_referencia') {
        query = query.or('legal_reference.is.null,legal_reference.eq.');
      } else if (filterSpecial === 'needs_refresh') {
        query = query.eq('needs_refresh', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      setQuestions(data || []);
      setCurrentIndex(0);
      setShowOtherOptions(false);
      setShowOriginal(pilotMode); // Auto-show original in pilot mode
    } catch (err) {
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  }, [pilotMode, filterOrigin, filterTema, filterSpecial]);

  // Load stats separately (for auto-refresh)
  const loadStats = useCallback(async () => {
    try {
      const [pendingRes, approvedRes, rejectedRes, totalRes, pilotRes, culturaRes] = await Promise.all([
        supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .in('validation_status', ['human_pending', 'ai_created_pending']),
        supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .eq('validation_status', 'human_approved'),
        supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .eq('validation_status', 'rejected'),
        supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true),
        supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .eq('validation_status', 'pilot_pending'),
        supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .like('review_comment', '[FUENTE_EXTERNA]%')
      ]);

      setStats({
        pending: pendingRes.count || 0,
        approved: approvedRes.count || 0,
        rejected: rejectedRes.count || 0,
        total: totalRes.count || 0,
        pilot: pilotRes.count || 0,
        cultura_general: culturaRes.count || 0
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, []);

  // Load questions by status for stats view
  const loadQuestionsByStatus = useCallback(async (status) => {
    try {
      let query = supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (status === 'pending') {
        query = query.in('validation_status', ['human_pending', 'ai_created_pending']);
      } else if (status === 'approved') {
        query = query.eq('validation_status', 'human_approved');
      } else if (status === 'rejected') {
        query = query.eq('validation_status', 'rejected');
      } else if (status === 'pilot') {
        query = query.eq('validation_status', 'pilot_pending');
      } else if (status === 'cultura_general') {
        query = query.like('review_comment', '[FUENTE_EXTERNA]%');
      }

      if (filterOrigin !== 'all') {
        query = query.eq('origin', filterOrigin);
      }
      if (filterTema !== 'all') {
        query = query.eq('tema', parseInt(filterTema));
      }
      if (filterSpecial === 'cultura_general') {
        query = query.like('review_comment', '[FUENTE_EXTERNA]%');
      } else if (filterSpecial === 'sin_referencia') {
        query = query.or('legal_reference.is.null,legal_reference.eq.');
      } else if (filterSpecial === 'needs_refresh') {
        query = query.eq('needs_refresh', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      setFilteredQuestions(data || []);
    } catch (err) {
      console.error('Error loading questions by status:', err);
      setFilteredQuestions([]);
    }
  }, [filterOrigin, filterTema, filterSpecial]);

  // Search questions by keyword (question_text or options text)
  const searchQuestions = useCallback(async (query) => {
    if (!query || query.trim().length < 1) {
      setStatsView(null);
      setFilteredQuestions([]);
      return;
    }
    setSearchLoading(true);
    try {
      const trimmed = query.trim();

      // If query is a number, search by ID directly
      if (/^\d+$/.test(trimmed)) {
        const { data, error } = await supabase
          .from('questions')
          .select('id,question_text,options,explanation,legal_reference,tema,difficulty,validation_status,origin,review_comment,needs_refresh,refresh_reason,is_active,source,original_text,original_options')
          .eq('id', parseInt(trimmed));
        if (error) throw error;
        setFilteredQuestions(data || []);
        setStatsView('search');
        return;
      }

      // Text search needs at least 2 chars
      if (trimmed.length < 2) {
        setStatsView(null);
        setFilteredQuestions([]);
        return;
      }

      const lowerQuery = trimmed.toLowerCase();

      // Fetch all active questions (with optional filters), then search client-side
      // This enables searching in JSONB options text which PostgREST can't filter with ilike
      let dbQuery = supabase
        .from('questions')
        .select('id,question_text,options,explanation,legal_reference,tema,difficulty,validation_status,origin,review_comment,needs_refresh,refresh_reason,is_active,source,original_text,original_options')
        .eq('is_active', true)
        .order('tema', { ascending: true });

      if (filterOrigin !== 'all') {
        dbQuery = dbQuery.eq('origin', filterOrigin);
      }
      if (filterTema !== 'all') {
        dbQuery = dbQuery.eq('tema', parseInt(filterTema));
      }

      const { data, error } = await dbQuery;
      if (error) throw error;

      // Client-side search across all text fields including originals
      const results = (data || []).filter(q => {
        if (q.question_text?.toLowerCase().includes(lowerQuery)) return true;
        if (q.explanation?.toLowerCase().includes(lowerQuery)) return true;
        if (q.legal_reference?.toLowerCase().includes(lowerQuery)) return true;
        if (q.options?.some(opt => opt.text?.toLowerCase().includes(lowerQuery))) return true;
        if (q.original_text?.toLowerCase().includes(lowerQuery)) return true;
        if (q.original_options?.some(opt => opt.text?.toLowerCase().includes(lowerQuery))) return true;
        return false;
      });

      setFilteredQuestions(results.slice(0, 100));
      setStatsView('search');
    } catch (err) {
      console.error('Error searching questions:', err);
      setFilteredQuestions([]);
    } finally {
      setSearchLoading(false);
    }
  }, [filterOrigin, filterTema]);

  // Handle stat card click
  const handleStatClick = useCallback((status) => {
    // Pending just shows the normal review workflow
    if (status === 'pending') {
      setPilotMode(false);
      setStatsView(null);
      setFilteredQuestions([]);
      return;
    }

    // Pilot toggles the main review workflow to pilot mode
    if (status === 'pilot') {
      setPilotMode(prev => !prev);
      setStatsView(null);
      setFilteredQuestions([]);
      return;
    }

    if (statsView === status) {
      setStatsView(null);
      setFilteredQuestions([]);
    } else {
      setStatsView(status);
      loadQuestionsByStatus(status);
    }
  }, [statsView, loadQuestionsByStatus]);

  useEffect(() => {
    loadQuestions();
    loadStats();
  }, [loadQuestions, loadStats, pilotMode]);

  // Re-load stats view when filters change
  useEffect(() => {
    if (statsView === 'search') {
      if (searchQuery.trim().length >= 2) searchQuestions(searchQuery);
    } else if (statsView) {
      loadQuestionsByStatus(statsView);
    }
  }, [filterOrigin, filterTema, filterSpecial, statsView, loadQuestionsByStatus, searchQuestions, searchQuery]);

  const currentQuestion = questions[currentIndex];

  // Find correct and incorrect options
  const correctOption = currentQuestion?.options?.find(opt => opt.is_correct);
  const incorrectOptions = currentQuestion?.options?.filter(opt => !opt.is_correct) || [];

  // Navigation functions - keep showOriginal persistent across questions
  const goToNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setAnimationDirection('left');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setShowOtherOptions(false);
        setReviewComment('');
        setIsAnimating(false);
      }, 150);
    }
  }, [currentIndex, questions.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setAnimationDirection('right');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setShowOtherOptions(false);
        setReviewComment('');
        setIsAnimating(false);
      }, 150);
    }
  }, [currentIndex]);

  // Handle approve
  const handleApprove = useCallback(async () => {
    if (!currentQuestion || actionLoading) return;

    setActionLoading(true);
    try {
      const result = await reviewQuestion(
        currentQuestion.id,
        'human_approved',
        reviewComment || null
      );

      if (result.success) {
        setReviewComment('');
        setAnimationDirection('left');
        setIsAnimating(true);

        // Remove from list
        const newQuestions = questions.filter((_, i) => i !== currentIndex);

        setTimeout(() => {
          setQuestions(newQuestions);
          if (currentIndex >= newQuestions.length && newQuestions.length > 0) {
            setCurrentIndex(newQuestions.length - 1);
          }
          setShowOtherOptions(false);
          setIsAnimating(false);

          // Auto-refresh stats
          loadStats();
        }, 200);
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  }, [currentQuestion, actionLoading, reviewComment, questions, currentIndex, reviewQuestion, loadStats]);

  // Handle reject
  const handleReject = useCallback(async () => {
    if (!currentQuestion || actionLoading) return;

    setActionLoading(true);
    try {
      const result = await reviewQuestion(
        currentQuestion.id,
        'rejected',
        reviewComment || null
      );

      if (result.success) {
        setReviewComment('');
        setAnimationDirection('left');
        setIsAnimating(true);

        const newQuestions = questions.filter((_, i) => i !== currentIndex);

        setTimeout(() => {
          setQuestions(newQuestions);
          if (currentIndex >= newQuestions.length && newQuestions.length > 0) {
            setCurrentIndex(newQuestions.length - 1);
          }
          setShowOtherOptions(false);
          setIsAnimating(false);

          // Auto-refresh stats
          loadStats();
        }, 200);
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  }, [currentQuestion, actionLoading, reviewComment, questions, currentIndex, reviewQuestion, loadStats]);

  // Handle mark for refresh
  const handleMarkRefresh = useCallback(async () => {
    if (!currentQuestion || actionLoading) return;

    let reason = reviewComment;
    if (!reason) {
      const artRef = currentQuestion.legal_reference || '';
      reason = window.prompt(
        `Razón para reformular (Art: ${artRef || 'sin referencia'}):\n` +
        'Incluye qué mejorar: enunciado, opciones, explicación, artículo...'
      );
    }
    if (!reason) return;

    setActionLoading(true);
    try {
      const result = await markForRefresh(currentQuestion.id, reason);
      if (result.success) {
        setReviewComment('');
        setAnimationDirection('left');
        setIsAnimating(true);

        const newQuestions = questions.filter((_, i) => i !== currentIndex);

        setTimeout(() => {
          setQuestions(newQuestions);
          if (currentIndex >= newQuestions.length && newQuestions.length > 0) {
            setCurrentIndex(newQuestions.length - 1);
          }
          setShowOtherOptions(false);
          setIsAnimating(false);
          loadStats();
        }, 200);
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  }, [currentQuestion, actionLoading, reviewComment, questions, currentIndex, markForRefresh, loadStats]);

  // Handlers for grid/list views (accept question ID)
  const handleApproveById = useCallback(async (questionId, comment = '') => {
    if (actionLoading) return;

    setActionLoading(true);
    try {
      const result = await reviewQuestion(questionId, 'human_approved', comment || null);

      if (result.success) {
        setQuestions(prev => prev.filter(q => q.id !== questionId));
        setSelectedQuestion(null);
        loadStats();
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  }, [actionLoading, reviewQuestion, loadStats]);

  const handleRejectById = useCallback(async (questionId, comment = '') => {
    if (actionLoading) return;

    setActionLoading(true);
    try {
      const result = await reviewQuestion(questionId, 'rejected', comment || null);

      if (result.success) {
        setQuestions(prev => prev.filter(q => q.id !== questionId));
        setSelectedQuestion(null);
        loadStats();
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  }, [actionLoading, reviewQuestion, loadStats]);

  const handleMarkRefreshById = useCallback(async (questionId, reason = 'Necesita reformulación') => {
    if (actionLoading) return;

    setActionLoading(true);
    try {
      const result = await markForRefresh(questionId, reason);

      if (result.success) {
        setQuestions(prev => prev.filter(q => q.id !== questionId));
        setSelectedQuestion(null);
        loadStats();
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  }, [actionLoading, markForRefresh, loadStats]);

  const handleUndo = useCallback(async (questionId) => {
    if (actionLoading) return;

    setActionLoading(true);
    try {
      const result = await reviewQuestion(questionId, 'human_pending', null);

      if (result.success) {
        loadQuestions();
        loadStats();
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  }, [actionLoading, reviewQuestion, loadQuestions, loadStats]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in textarea
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

      switch (e.key.toLowerCase()) {
        case '1':
          e.preventDefault();
          setViewMode('individual');
          break;
        case '2':
          e.preventDefault();
          setViewMode('grid');
          break;
        case '3':
          e.preventDefault();
          setViewMode('list');
          break;
        case 'a':
          if (viewMode === 'individual') {
            e.preventDefault();
            handleApprove();
          }
          break;
        case 'r':
          if (viewMode === 'individual') {
            e.preventDefault();
            handleReject();
          }
          break;
        case 'f':
          if (viewMode === 'individual') {
            e.preventDefault();
            handleMarkRefresh();
          }
          break;
        case 'o':
          e.preventDefault();
          setShowOriginal(prev => !prev);
          break;
        case 'e':
          e.preventDefault();
          setShowOtherOptions(true);
          setShowOriginal(true);
          break;
        case 'arrowright':
          if (viewMode === 'individual') {
            e.preventDefault();
            goToNext();
          }
          break;
        case 'arrowleft':
          if (viewMode === 'individual') {
            e.preventDefault();
            goToPrev();
          }
          break;
        case 'escape':
          if (selectedQuestion) {
            e.preventDefault();
            setSelectedQuestion(null);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleApprove, handleReject, handleMarkRefresh, goToNext, goToPrev, viewMode, selectedQuestion]);

  const handleLogout = () => {
    // Logout from AdminContext if logged in via PIN
    if (adminUser) {
      logoutAdmin();
    }
    // Just go back (don't sign out from AuthContext)
    onBack();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Header */}
      <div className="bg-brand-600 text-white px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Volver"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Panel de Revisión
                </h1>
                <p className="text-brand-200 text-sm">
                  {currentUser?.name || 'Revisor'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Salir"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Stats Cards - Clickable */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            <button
              onClick={() => handleStatClick('total')}
              className={`bg-white/10 backdrop-blur rounded-xl p-3 text-center transition-all duration-300 hover:bg-white/20 ${
                statsView === 'total' ? 'ring-2 ring-white' : ''
              }`}
            >
              <div className="text-2xl font-bold tabular-nums">{stats.total}</div>
              <div className="text-xs text-brand-200 flex items-center justify-center gap-1">
                <FileText className="w-3 h-3" />
                Total
              </div>
            </button>
            <button
              onClick={() => handleStatClick('pending')}
              className={`bg-amber-500/20 backdrop-blur rounded-xl p-3 text-center transition-all duration-300 hover:bg-amber-500/30 ${
                !statsView && !pilotMode ? 'ring-2 ring-amber-300' : ''
              }`}
              title="Ver panel de revisión"
            >
              <div className="text-2xl font-bold tabular-nums">{stats.pending}</div>
              <div className="text-xs text-amber-200 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                Pendientes
              </div>
            </button>
            <button
              onClick={() => handleStatClick('approved')}
              className={`bg-green-500/20 backdrop-blur rounded-xl p-3 text-center transition-all duration-300 hover:bg-green-500/30 ${
                statsView === 'approved' ? 'ring-2 ring-green-300' : ''
              }`}
            >
              <div className="text-2xl font-bold tabular-nums">{stats.approved}</div>
              <div className="text-xs text-green-200 flex items-center justify-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Aprobadas
              </div>
            </button>
            <button
              onClick={() => handleStatClick('rejected')}
              className={`bg-red-500/20 backdrop-blur rounded-xl p-3 text-center transition-all duration-300 hover:bg-red-500/30 ${
                statsView === 'rejected' ? 'ring-2 ring-red-300' : ''
              }`}
            >
              <div className="text-2xl font-bold tabular-nums">{stats.rejected}</div>
              <div className="text-xs text-red-200 flex items-center justify-center gap-1">
                <XCircle className="w-3 h-3" />
                Rechazadas
              </div>
            </button>
          </div>

          {/* Pilot Mode Toggle */}
          {stats.pilot > 0 && (
            <button
              onClick={() => handleStatClick('pilot')}
              className={`mt-2 w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 ${
                pilotMode
                  ? 'bg-cyan-500/30 ring-2 ring-cyan-300 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-brand-200'
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangle className="w-4 h-4" />
                Piloto de Calidad
              </span>
              <span className="flex items-center gap-2">
                <span className="text-lg font-bold tabular-nums">{stats.pilot}</span>
                <span className="text-xs opacity-70">pendientes</span>
              </span>
            </button>
          )}

          {/* Filters Row */}
          <div className="mt-3 flex gap-2">
            <div className="flex-1">
              <select
                value={filterOrigin}
                onChange={(e) => setFilterOrigin(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white appearance-none cursor-pointer focus:ring-2 focus:ring-white/30 focus:outline-none"
              >
                <option value="all" className="text-gray-900">Todas las fuentes</option>
                <option value="imported" className="text-gray-900">Importadas</option>
                <option value="reformulated" className="text-gray-900">Reformuladas</option>
                <option value="ai_created" className="text-gray-900">Creadas desde cero</option>
              </select>
            </div>
            <div className="flex-1">
              <select
                value={filterSpecial === 'cultura_general' ? 'cultura_general' : filterTema}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === 'cultura_general') {
                    setFilterTema('all');
                    setFilterSpecial('cultura_general');
                  } else {
                    setFilterTema(v);
                    setFilterSpecial('all');
                  }
                }}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white appearance-none cursor-pointer focus:ring-2 focus:ring-white/30 focus:outline-none"
              >
                <option value="all" className="text-gray-900">Todos los temas</option>
                {Array.from({length: TOTAL_TEMAS}, (_, i) => i + 1).map(t => (
                  <option key={t} value={String(t)} className="text-gray-900">T{t}: {TEMA_NAMES[t]}</option>
                ))}
                {stats.cultura_general > 0 && (
                  <option value="cultura_general" className="text-gray-900">📚 Cultura General ({stats.cultura_general})</option>
                )}
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-300 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim().length >= 1) {
                  searchQuestions(searchQuery);
                }
              }}
              placeholder="Buscar por ID (ej: 1369) o texto..."
              className="w-full pl-9 pr-20 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-brand-300 focus:ring-2 focus:ring-white/30 focus:outline-none"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex gap-1">
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    if (statsView === 'search') {
                      setStatsView(null);
                      setFilteredQuestions([]);
                    }
                  }}
                  className="px-2 py-1 text-xs text-brand-300 hover:text-white rounded"
                  title="Limpiar búsqueda"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => searchQuestions(searchQuery)}
                disabled={searchQuery.trim().length < 1 || searchLoading}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 text-xs text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {searchLoading ? '...' : 'Buscar'}
              </button>
            </div>
          </div>

          {/* Active filters indicator */}
          {(filterOrigin !== 'all' || filterTema !== 'all' || filterSpecial !== 'all' || statsView === 'search') && (
            <div className="mt-2 flex items-center gap-2">
              <Filter className="w-3 h-3 text-brand-200" />
              <span className="text-xs text-brand-200">
                Filtros activos:
                {filterOrigin !== 'all' && (
                  <span className="ml-1 px-2 py-0.5 bg-white/15 rounded-full">
                    {filterOrigin === 'imported' ? 'Importadas' : filterOrigin === 'reformulated' ? 'Reformuladas' : 'Creadas'}
                  </span>
                )}
                {filterTema !== 'all' && (
                  <span className="ml-1 px-2 py-0.5 bg-white/15 rounded-full">Tema {filterTema}</span>
                )}
                {filterSpecial === 'cultura_general' && (
                  <span className="ml-1 px-2 py-0.5 bg-amber-400/30 rounded-full">📚 Cultura General</span>
                )}
                {statsView === 'search' && (
                  <span className="ml-1 px-2 py-0.5 bg-blue-400/30 rounded-full">🔍 &quot;{searchQuery}&quot; ({filteredQuestions.length})</span>
                )}
              </span>
              <button
                onClick={() => {
                  setFilterOrigin('all');
                  setFilterTema('all');
                  setFilterSpecial('all');
                  setSearchQuery('');
                  if (statsView === 'search') {
                    setStatsView(null);
                    setFilteredQuestions([]);
                  }
                }}
                className="text-xs text-brand-300 hover:text-white underline ml-auto"
              >
                Limpiar
              </button>
            </div>
          )}

          {/* View Mode Selector - hidden during stats view */}
          {!statsView && (
            <div className="mt-3">
              <ViewModeSelector
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalItems={questions.length}
                currentPage={1}
                itemsPerPage={questions.length}
              />
            </div>
          )}
        </div>
      </div>

      {/* Stats View - Shows filtered questions when stat is clicked */}
      {statsView && (
        <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                {statsView === 'total' && <><FileText className="w-4 h-4" /> Todas las preguntas</>}
                {statsView === 'pending' && <><Clock className="w-4 h-4 text-amber-500" /> Pendientes de revisión</>}
                {statsView === 'approved' && <><CheckCircle className="w-4 h-4 text-green-500" /> Preguntas aprobadas</>}
                {statsView === 'rejected' && <><XCircle className="w-4 h-4 text-red-500" /> Preguntas rechazadas</>}
                {statsView === 'pilot' && <><AlertTriangle className="w-4 h-4 text-cyan-500" /> Piloto de calidad</>}
                {statsView === 'cultura_general' && <><FileText className="w-4 h-4 text-amber-500" /> Cultura General — sin fuente BOE</>}
                {statsView === 'search' && <><Search className="w-4 h-4 text-blue-500" /> Resultados de búsqueda</>}
                <span className="text-sm text-gray-500 font-normal">({filteredQuestions.length}{statsView !== 'search' ? ` de ${
                  statsView === 'total' ? stats.total :
                  statsView === 'pending' ? stats.pending :
                  statsView === 'approved' ? stats.approved :
                  statsView === 'pilot' ? stats.pilot :
                  statsView === 'cultura_general' ? stats.cultura_general :
                  stats.rejected
                }` : ''})</span>
              </h3>
              <button
                onClick={() => {
                  if (statsView === 'search') setSearchQuery('');
                  setStatsView(null);
                  setFilteredQuestions([]);
                }}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg"
                title="Cerrar y volver a revisión"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {filteredQuestions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No hay preguntas en esta categoría
                </div>
              ) : (
                filteredQuestions.map((q, idx) => {
                  const correctOpt = q.options?.find(opt => opt.is_correct);
                  return (
                    <div key={q.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                              T{q.tema || '?'}
                            </span>
                            {q.origin && q.origin !== 'imported' && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                q.origin === 'reformulated' ? 'bg-cyan-100 text-cyan-700' : 'bg-violet-100 text-violet-700'
                              }`}>
                                {q.origin === 'reformulated' ? 'Reformulada' : 'Creada IA'}
                              </span>
                            )}
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              q.validation_status === 'human_approved' ? 'bg-green-100 text-green-700' :
                              q.validation_status === 'rejected' ? 'bg-red-100 text-red-700' :
                              q.validation_status === 'human_pending' ? 'bg-amber-100 text-amber-700' :
                              q.validation_status === 'pilot_pending' ? 'bg-cyan-100 text-cyan-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {q.validation_status === 'human_approved' ? 'Aprobada' :
                               q.validation_status === 'rejected' ? 'Rechazada' :
                               q.validation_status === 'human_pending' ? 'Pendiente' :
                               q.validation_status === 'pilot_pending' ? 'Piloto' :
                               q.validation_status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 line-clamp-2 mb-1">
                            {q.question_text}
                          </p>
                          {correctOpt && (
                            <p className="text-xs text-green-700 truncate">
                              ✓ {correctOpt.id?.toUpperCase()}. {correctOpt.text}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(q.created_at).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          {(() => {
                            if (q.review_comment?.startsWith('[FUENTE_EXTERNA]')) {
                              return (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-700 font-medium">
                                  📚 Cultura General
                                </span>
                              );
                            }
                            const v = parseVerification(q.review_comment);
                            if (v) return (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${v.bg} ${v.border} border ${v.text} font-medium`}>
                                {v.icon} {v.label}
                              </span>
                            );
                            return null;
                          })()}
                          <div className="flex gap-1">
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                const prev = q.validation_status;
                                await reviewQuestion(q.id, 'human_approved', currentUser?.email || 'reviewer', '');
                                setFilteredQuestions(fqs => fqs.map(fq => fq.id === q.id ? { ...fq, validation_status: 'human_approved' } : fq));
                                setStats(s => ({
                                  ...s,
                                  approved: s.approved + 1,
                                  ...(prev === 'rejected' ? { rejected: Math.max(0, s.rejected - 1) } : {}),
                                  ...(['human_pending', 'ai_created_pending'].includes(prev) ? { pending: Math.max(0, s.pending - 1) } : {}),
                                }));
                              }}
                              className={`p-1.5 rounded-lg ${q.validation_status === 'human_approved' ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                              title="Aprobar"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                const prev = q.validation_status;
                                await reviewQuestion(q.id, 'rejected', currentUser?.email || 'reviewer', '');
                                setFilteredQuestions(fqs => fqs.map(fq => fq.id === q.id ? { ...fq, validation_status: 'rejected' } : fq));
                                setStats(s => ({
                                  ...s,
                                  rejected: s.rejected + 1,
                                  ...(prev === 'human_approved' ? { approved: Math.max(0, s.approved - 1) } : {}),
                                  ...(['human_pending', 'ai_created_pending'].includes(prev) ? { pending: Math.max(0, s.pending - 1) } : {}),
                                }));
                              }}
                              className={`p-1.5 rounded-lg ${q.validation_status === 'rejected' ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                              title="Rechazar"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => selectQuestion(q, idx)}
                              className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg"
                              title="Ver detalle"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content - Only show when not viewing stats */}
      {!statsView && (
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {questions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              ¡Todo revisado!
            </h2>
            <p className="text-gray-600 mb-4">
              No hay preguntas pendientes de revisión.
            </p>
            <button
              onClick={() => { loadQuestions(); loadStats(); }}
              className="px-4 py-2 bg-brand-100 text-brand-700 rounded-lg hover:bg-brand-200 transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Recargar
            </button>
          </div>
        ) : (
          <>
            {/* Individual View */}
            {viewMode === 'individual' && (
              <>
                {/* Pilot Mode Banner */}
                {pilotMode && (
                  <div className="mb-4 px-4 py-2.5 bg-cyan-50 border border-cyan-200 rounded-xl flex items-center gap-2 text-sm text-cyan-800">
                    <AlertTriangle className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                    <span><strong>Modo Piloto</strong> &mdash; Revisa las mejoras. Compara con el original abajo.</span>
                  </div>
                )}

                {/* Progress & Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600 font-medium">
                    Pregunta <span className="text-brand-600">{currentIndex + 1}</span> de {questions.length}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={goToPrev}
                      disabled={currentIndex === 0}
                      className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"
                      title="Anterior [←]"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={goToNext}
                      disabled={currentIndex === questions.length - 1}
                      className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"
                      title="Siguiente [→]"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Question Card */}
                <div
                  className={`bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all duration-200 ${
                    isAnimating
                      ? animationDirection === 'left'
                        ? 'opacity-0 translate-x-4'
                        : 'opacity-0 -translate-x-4'
                      : 'opacity-100 translate-x-0'
                  }`}
                >
                  {/* Meta tags */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-brand-100 text-brand-700 text-sm font-medium rounded-full">
                      Tema {currentQuestion?.tema || '?'}
                    </span>
                    {currentQuestion?.origin && (
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        currentQuestion.origin === 'imported' ? 'bg-gray-100 text-gray-600' :
                        currentQuestion.origin === 'reformulated' ? 'bg-cyan-100 text-cyan-700' :
                        'bg-violet-100 text-violet-700'
                      }`}>
                        {currentQuestion.origin === 'imported' ? 'Importada' :
                         currentQuestion.origin === 'reformulated' ? 'Reformulada' : 'Creada IA'}
                      </span>
                    )}
                    {currentQuestion?.materia && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                        {currentQuestion.materia}
                      </span>
                    )}
                    {currentQuestion?.difficulty && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        Dificultad: {currentQuestion.difficulty}/5
                      </span>
                    )}
                  </div>

                  {/* Question text */}
                  <div className="p-5">
                    <p className="text-gray-900 text-lg leading-relaxed">
                      {currentQuestion?.question_text}
                    </p>
                    {/* Legal reference - always visible */}
                    {currentQuestion?.legal_reference && (
                      <div className="mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg inline-flex items-center gap-2">
                        <span className="text-xs font-semibold text-amber-700">Art.</span>
                        <span className="text-sm text-amber-800">{currentQuestion.legal_reference}</span>
                      </div>
                    )}
                  </div>

                  {/* Correct Answer - Always visible and highlighted */}
                  <div className="px-5 pb-4">
                    <div className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      RESPUESTA CORRECTA:
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 shadow-sm">
                      <span className="font-bold text-green-800">
                        {correctOption?.id?.toUpperCase() || 'A'}.
                      </span>{' '}
                      <span className="text-green-900 font-medium">
                        {correctOption?.text}
                      </span>
                    </div>
                  </div>

                  {/* Other Options - Collapsible */}
                  <div className="px-5 pb-4">
                    <button
                      onClick={() => setShowOtherOptions(!showOtherOptions)}
                      className="w-full flex items-center justify-between py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        {showOtherOptions ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        Otras opciones ({incorrectOptions.length})
                      </span>
                      {showOtherOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {!showOtherOptions ? (
                      // Collapsed preview
                      <div className="mt-2 space-y-1">
                        {incorrectOptions.map((opt, idx) => (
                          <div key={idx} className="text-sm text-gray-400 truncate pl-2">
                            {opt.id?.toUpperCase() || String.fromCharCode(66 + idx)}. {opt.text}
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Expanded view
                      <div className="mt-3 space-y-2">
                        {incorrectOptions.map((opt, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700"
                          >
                            <span className="font-semibold text-gray-500">
                              {opt.id?.toUpperCase() || String.fromCharCode(66 + idx)}.
                            </span>{' '}
                            {opt.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Explanation - always visible */}
                  {currentQuestion?.explanation && (
                    <div className="px-5 pb-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-xs font-semibold text-blue-800 mb-1">📚 Explicación:</p>
                        <p className="text-sm text-blue-700">{currentQuestion.explanation}</p>
                      </div>
                    </div>
                  )}

                  {/* AI Creation Rationale - for ai_created questions (only if not a verification comment) */}
                  {currentQuestion?.origin === 'ai_created' && currentQuestion?.review_comment && !currentQuestion.review_comment.match(/^\[(VERIFIED|ERROR|AMBIGUOUS)/) && (
                    <div className="px-5 pb-4">
                      <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl">
                        <p className="text-xs font-semibold text-violet-800 mb-1">Rationale de creación:</p>
                        <p className="text-sm text-violet-700">{currentQuestion.review_comment}</p>
                      </div>
                    </div>
                  )}

                  {/* Compare with Original - Collapsible */}
                  {currentQuestion?.original_text && (
                    <div className="px-5 pb-4">
                      <button
                        onClick={() => setShowOriginal(!showOriginal)}
                        className="w-full flex items-center justify-between py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors border-t border-gray-100 pt-4"
                      >
                        <span className="flex items-center gap-2">
                          <GitCompare className="w-4 h-4" />
                          Comparar con original [O]
                        </span>
                        {showOriginal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {showOriginal && (
                        <div className="mt-4 grid md:grid-cols-2 gap-4">
                          {/* Original */}
                          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300">
                            <p className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              ORIGINAL
                            </p>
                            <p className="text-sm text-amber-900 leading-relaxed mb-2">
                              {currentQuestion.original_text}
                            </p>
                            {/* Original options for pilot comparison */}
                            {pilotMode && currentQuestion.original_options && (
                              <div className="mt-2 space-y-1 border-t border-amber-200 pt-2">
                                {(Array.isArray(currentQuestion.original_options) ? currentQuestion.original_options : []).map((opt, i) => (
                                  <p key={i} className={`text-xs ${opt.is_correct ? 'text-green-700 font-semibold' : 'text-amber-700'}`}>
                                    {opt.id?.toUpperCase() || String.fromCharCode(65 + i)}. {opt.text} {opt.is_correct ? '(correcta)' : ''}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                          {/* Current/Improved */}
                          <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-300">
                            <p className="text-xs font-semibold text-cyan-700 mb-2 flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {pilotMode ? 'MEJORADA' : 'REFORMULADA'}
                            </p>
                            <p className="text-sm text-cyan-900 leading-relaxed mb-2">
                              {currentQuestion.question_text}
                            </p>
                            {/* Current options for pilot comparison */}
                            {pilotMode && currentQuestion.options && (
                              <div className="mt-2 space-y-1 border-t border-cyan-200 pt-2">
                                {currentQuestion.options.map((opt, i) => (
                                  <p key={i} className={`text-xs ${opt.is_correct ? 'text-green-700 font-semibold' : 'text-cyan-700'}`}>
                                    {opt.id?.toUpperCase() || String.fromCharCode(65 + i)}. {opt.text} {opt.is_correct ? '(correcta)' : ''}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {showOriginal && currentQuestion?.reformulation_type && (
                        <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                          <p className="text-xs text-gray-600">
                            💡 <strong>Tipo de cambio:</strong>{' '}
                            {reformulationLabels[currentQuestion.reformulation_type] || currentQuestion.reformulation_type}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Comment input */}
                  <div className="px-5 pb-4 border-t border-gray-100 pt-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      💬 Comentario (opcional):
                    </label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Escribe un comentario si lo deseas..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm resize-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
                      rows={2}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="px-5 pb-5">
                    <div className="flex gap-3">
                      <button
                        onClick={handleApprove}
                        disabled={actionLoading}
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 font-semibold shadow-lg shadow-green-500/25 active:scale-[0.98]"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Aprobar
                        <kbd className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded">A</kbd>
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={actionLoading}
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all disabled:opacity-50 font-semibold shadow-lg shadow-red-500/25 active:scale-[0.98]"
                      >
                        <XCircle className="w-5 h-5" />
                        Rechazar
                        <kbd className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded">R</kbd>
                      </button>
                    </div>

                    <button
                      onClick={handleMarkRefresh}
                      disabled={actionLoading}
                      className="w-full mt-3 flex items-center justify-center gap-2 py-3 text-orange-600 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors text-sm font-medium"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Marcar para reformular
                      <kbd className="ml-1 px-1.5 py-0.5 text-xs bg-orange-100 rounded">F</kbd>
                    </button>
                  </div>
                </div>

                {/* Keyboard Shortcuts Help */}
                <div className="mt-4 p-3 bg-gray-100 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Keyboard className="w-4 h-4" />
                    <span className="font-medium">Atajos de teclado:</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                    <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">1</kbd><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700 ml-0.5">2</kbd><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700 ml-0.5">3</kbd> Cambiar vista</span>
                    <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">A</kbd> Aprobar</span>
                    <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">R</kbd> Rechazar</span>
                    <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">F</kbd> Reformular</span>
                    <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">O</kbd> Ver original</span>
                    <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">←</kbd><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700 ml-0.5">→</kbd> Navegar</span>
                  </div>
                </div>
              </>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {questions.map((question, idx) => (
                  <QuestionCardCompact
                    key={question.id}
                    question={question}
                    index={idx}
                    onApprove={handleApproveById}
                    onReject={handleRejectById}
                    onView={(q) => selectQuestion(q, idx)}
                    onUndo={handleUndo}
                    disabled={actionLoading}
                  />
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
                {questions.map((question, idx) => {
                  const correctOpt = question.options?.find(opt => opt.is_correct);
                  return (
                    <div
                      key={question.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Meta */}
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                              T{question.tema || '?'}
                            </span>
                            {question.origin && question.origin !== 'imported' && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                question.origin === 'reformulated' ? 'bg-cyan-100 text-cyan-700' : 'bg-violet-100 text-violet-700'
                              }`}>
                                {question.origin === 'reformulated' ? 'Reformulada' : 'Creada IA'}
                              </span>
                            )}
                            {question.materia && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {question.materia}
                              </span>
                            )}
                          </div>

                          {/* Question */}
                          <p className="text-sm text-gray-900 line-clamp-2 mb-2">
                            {question.question_text}
                          </p>

                          {/* Correct answer */}
                          {correctOpt && (
                            <p className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded inline-block">
                              <span className="font-bold">{correctOpt.id?.toUpperCase() || 'A'}.</span> {correctOpt.text}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => selectQuestion(question, idx)}
                            className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Ver detalle"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApproveById(question.id)}
                            disabled={actionLoading}
                            className="p-2 text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50"
                            title="Aprobar"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectById(question.id)}
                            disabled={actionLoading}
                            className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
                            title="Rechazar"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      </div>
      )}

      {/* Question Detail Modal - Outside content section so it works with statsView */}
      {selectedQuestion && (
        <QuestionDetailModal
          question={selectedQuestion}
          onClose={() => { setSelectedQuestion(null); setSelectedQuestionIndex(-1); }}
          onApprove={handleApproveById}
          onReject={handleRejectById}
          onMarkRefresh={handleMarkRefreshById}
          onPrev={handleModalPrev}
          onNext={handleModalNext}
          hasPrev={selectedQuestionIndex > 0}
          hasNext={selectedQuestionIndex < modalQuestionList.length - 1}
          disabled={actionLoading}
        />
      )}

      {/* Bottom Navigation */}
      <BottomTabBar
        activeTab={activeTab || 'inicio'}
        currentPage={currentPage || 'reviewer-panel'}
        isUserReviewer={isUserReviewer}
        onTabChange={(tab) => {
          if (onTabChange) {
            onTabChange(tab);
          } else {
            onBack?.();
          }
        }}
        onPageChange={(page) => {
          if (onPageChange) {
            onPageChange(page);
          } else if (page === 'home') {
            onBack?.();
          }
        }}
      />
    </div>
  );
}
