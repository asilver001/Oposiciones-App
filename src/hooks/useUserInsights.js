/**
 * User Insights Hook
 * Manages user insights detection, retrieval, and session stats
 */

import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import {
  detectTriggeredInsights,
  calculateSessionStats,
  groupQuestionsByTema
} from '../services/insightDetector';

/**
 * Hook for managing user insights and session statistics
 * @returns {Object} Insight management functions and state
 */
export function useUserInsights() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Save session statistics and detect triggered insights
   * @param {Object[]} sessionResults - Array of question results
   *   Each item: { question_id, es_correcta, respuesta_usuario, respuesta_correcta, tema? }
   * @param {Object} sessionMeta - Session metadata
   *   { modo, tema_id?, duracion_segundos?, fecha_inicio? }
   * @returns {Promise<Object>} { sessionStats, triggeredInsights, sessionId }
   */
  const saveSessionAndDetectInsights = useCallback(async (sessionResults, sessionMeta = {}) => {
    if (!user?.id) {
      console.warn('saveSessionAndDetectInsights: No authenticated user');
      return { sessionStats: null, triggeredInsights: [], sessionId: null };
    }

    setLoading(true);
    setError(null);

    try {
      // Calculate session statistics
      const stats = calculateSessionStats(sessionResults);
      const byTema = groupQuestionsByTema(sessionResults);

      // Prepare session record
      const sessionRecord = {
        user_id: user.id,
        modo: sessionMeta.modo || 'practice',
        tema_id: sessionMeta.tema_id || null,
        total_preguntas: stats.total,
        correctas: stats.correctas,
        incorrectas: stats.incorrectas,
        en_blanco: stats.en_blanco,
        porcentaje_acierto: stats.porcentaje_acierto,
        puntuacion_oposicion: stats.puntuacion_oposicion,
        duracion_segundos: sessionMeta.duracion_segundos || null,
        fecha_inicio: sessionMeta.fecha_inicio || new Date().toISOString(),
        detalles_por_tema: byTema
      };

      // Save to session_stats
      const { data: sessionData, error: sessionError } = await supabase
        .from('session_stats')
        .insert(sessionRecord)
        .select('id')
        .single();

      if (sessionError) {
        console.error('Error saving session stats:', sessionError);
        // Continue with insight detection even if session save fails
      }

      const sessionId = sessionData?.id || null;

      // Detect and save triggered insights
      const triggeredInsights = await detectTriggeredInsights(
        sessionResults,
        user.id,
        supabase
      );

      setLoading(false);

      return {
        sessionStats: {
          ...stats,
          byTema,
          id: sessionId
        },
        triggeredInsights,
        sessionId
      };

    } catch (err) {
      console.error('Error in saveSessionAndDetectInsights:', err);
      setError(err.message);
      setLoading(false);
      return { sessionStats: null, triggeredInsights: [], sessionId: null };
    }
  }, [user?.id]);

  /**
   * Get recent triggered insights for the current user
   * @param {number} limit - Maximum number of insights to return
   * @param {boolean} onlyUnseen - If true, only return unseen insights
   * @returns {Promise<Object[]>} Array of triggered insights with template info
   */
  const getRecentInsights = useCallback(async (limit = 5, onlyUnseen = false) => {
    if (!user?.id) {
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('user_triggered_insights')
        .select(`
          id,
          insight_template_id,
          preguntas_falladas,
          visto,
          visto_at,
          created_at,
          insight_templates (
            id,
            titulo,
            descripcion,
            tipo,
            emoji,
            min_fallos_para_activar
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (onlyUnseen) {
        query = query.eq('visto', false);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching recent insights:', fetchError);
        setError(fetchError.message);
        setLoading(false);
        return [];
      }

      setLoading(false);

      // Transform data to flatten the template info
      return (data || []).map(item => ({
        id: item.id,
        templateId: item.insight_template_id,
        titulo: item.insight_templates?.titulo,
        descripcion: item.insight_templates?.descripcion,
        tipo: item.insight_templates?.tipo,
        emoji: item.insight_templates?.emoji,
        preguntasFalladas: item.preguntas_falladas,
        visto: item.visto,
        vistoAt: item.visto_at,
        createdAt: item.created_at
      }));

    } catch (err) {
      console.error('Error in getRecentInsights:', err);
      setError(err.message);
      setLoading(false);
      return [];
    }
  }, [user?.id]);

  /**
   * Get the last session statistics for the current user
   * @returns {Promise<Object|null>} Last session stats or null
   */
  const getLastSessionStats = useCallback(async () => {
    if (!user?.id) {
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('session_stats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError) {
        // PGRST116 = no rows returned, which is not really an error
        if (fetchError.code !== 'PGRST116') {
          console.error('Error fetching last session:', fetchError);
          setError(fetchError.message);
        }
        setLoading(false);
        return null;
      }

      setLoading(false);
      return data;

    } catch (err) {
      console.error('Error in getLastSessionStats:', err);
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, [user?.id]);

  /**
   * Get session history for the current user
   * @param {number} limit - Maximum number of sessions to return
   * @returns {Promise<Object[]>} Array of session stats
   */
  const getSessionHistory = useCallback(async (limit = 10) => {
    if (!user?.id) {
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('session_stats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (fetchError) {
        console.error('Error fetching session history:', fetchError);
        setError(fetchError.message);
        setLoading(false);
        return [];
      }

      setLoading(false);
      return data || [];

    } catch (err) {
      console.error('Error in getSessionHistory:', err);
      setError(err.message);
      setLoading(false);
      return [];
    }
  }, [user?.id]);

  /**
   * Mark an insight as seen
   * @param {string} triggeredInsightId - ID of the user_triggered_insights record
   * @returns {Promise<boolean>} True if successful
   */
  const markInsightAsSeen = useCallback(async (triggeredInsightId) => {
    if (!user?.id || !triggeredInsightId) {
      return false;
    }

    try {
      const { error: updateError } = await supabase
        .from('user_triggered_insights')
        .update({
          visto: true,
          visto_at: new Date().toISOString()
        })
        .eq('id', triggeredInsightId)
        .eq('user_id', user.id); // Ensure user can only update their own

      if (updateError) {
        console.error('Error marking insight as seen:', updateError);
        return false;
      }

      return true;

    } catch (err) {
      console.error('Error in markInsightAsSeen:', err);
      return false;
    }
  }, [user?.id]);

  /**
   * Mark all unseen insights as seen
   * @returns {Promise<number>} Number of insights marked as seen
   */
  const markAllInsightsAsSeen = useCallback(async () => {
    if (!user?.id) {
      return 0;
    }

    try {
      const { data, error: updateError } = await supabase
        .from('user_triggered_insights')
        .update({
          visto: true,
          visto_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('visto', false)
        .select('id');

      if (updateError) {
        console.error('Error marking all insights as seen:', updateError);
        return 0;
      }

      return data?.length || 0;

    } catch (err) {
      console.error('Error in markAllInsightsAsSeen:', err);
      return 0;
    }
  }, [user?.id]);

  /**
   * Get count of unseen insights
   * @returns {Promise<number>} Count of unseen insights
   */
  const getUnseenInsightsCount = useCallback(async () => {
    if (!user?.id) {
      return 0;
    }

    try {
      const { count, error: countError } = await supabase
        .from('user_triggered_insights')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('visto', false);

      if (countError) {
        console.error('Error getting unseen count:', countError);
        return 0;
      }

      return count || 0;

    } catch (err) {
      console.error('Error in getUnseenInsightsCount:', err);
      return 0;
    }
  }, [user?.id]);

  return {
    // State
    loading,
    error,

    // Session functions
    saveSessionAndDetectInsights,
    getLastSessionStats,
    getSessionHistory,

    // Insight functions
    getRecentInsights,
    markInsightAsSeen,
    markAllInsightsAsSeen,
    getUnseenInsightsCount
  };
}

export default useUserInsights;
