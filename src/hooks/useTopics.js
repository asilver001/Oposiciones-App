import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useTopics() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topics, setTopics] = useState([]);
  const [topicsByBlock, setTopicsByBlock] = useState({});
  const [userProgress, setUserProgress] = useState({});

  useEffect(() => {
    // Wait for auth to resolve before fetching topics
    if (authLoading) return;

    async function fetchTopics() {
      try {
        // Timeout wrapper required - queries hang without it
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Query timeout after 10s')), 10000)
        );

        const queryPromise = supabase
          .from('topics')
          .select(`
            id, code, name, number, is_available,
            blocks!left (
              id, code, number, name, short_name
            )
          `)
          .eq('is_active', true)
          .order('number');

        const { data, error: fetchError } = await Promise.race([queryPromise, timeoutPromise]);

        if (fetchError) throw fetchError;

        // Fetch question counts (using 'tema' column which stores topic number)
        const { data: questionCounts, error: countError } = await supabase
          .from('questions')
          .select('tema')
          .eq('is_active', true);

        if (countError) throw countError;

        // Count questions per topic number (tema field stores the topic number)
        const countsByTema = {};
        (questionCounts || []).forEach(q => {
          if (q.tema != null) {
            countsByTema[q.tema] = (countsByTema[q.tema] || 0) + 1;
          }
        });

        const enrichedTopics = (data || []).map(topic => ({
          ...topic,
          blockId: topic.blocks?.id || null,
          blockNumber: topic.blocks?.number || 0,
          blockName: topic.blocks?.name || 'Sin clasificar',
          blockCode: topic.blocks?.code || '',
          questionCount: countsByTema[topic.number] || 0
        }));

        setTopics(enrichedTopics);

        // Group topics by block
        const grouped = {};
        enrichedTopics.forEach(topic => {
          const blockKey = topic.blockId || 'other';
          if (!grouped[blockKey]) {
            grouped[blockKey] = {
              id: topic.blockId,
              name: topic.blockName,
              number: topic.blockNumber,
              code: topic.blockCode,
              topics: []
            };
          }
          grouped[blockKey].topics.push(topic);
        });

        // Sort blocks by number
        const sortedGrouped = Object.fromEntries(
          Object.entries(grouped).sort(([, a], [, b]) => a.number - b.number)
        );

        setTopicsByBlock(sortedGrouped);

      } catch (err) {
        console.error('useTopics error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTopics();
  }, [authLoading]); // Re-run when auth loading completes

  const fetchUserProgress = useCallback(async () => {
    if (!user?.id) {
      setUserProgress({});
      return;
    }

    try {
      // Read from user_topic_progress (aggregated per topic by RPC)
      const { data, error } = await supabase
        .from('user_topic_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const progress = {};
      (data || []).forEach(p => {
        progress[p.topic_number] = {
          answered: p.questions_seen || 0,
          correct: p.questions_correct || 0,
          accuracy: p.overall_accuracy_percent || 0,
          sessionsCompleted: p.sessions_completed || 0,
          sessionQuestions: p.questions_seen || 0,
          sessionCorrect: p.questions_correct || 0,
          sessionTime: p.total_time_seconds || 0,
          lastPracticed: p.last_session_at,
          // Use accuracy as mastery proxy (no per-card FSRS states)
          masteryRate: p.overall_accuracy_percent || 0,
          new: 0, learning: 0, review: 0, relearning: 0, mastered: 0
        };
      });

      setUserProgress(progress);
    } catch (err) {
      console.error('Error fetching user progress:', err);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
  }, [user, fetchUserProgress]);

  const getQuestionsForTopic = useCallback(async (topicNumber, limit = 20) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('tema', topicNumber)
        .eq('is_active', true)
        .limit(limit);

      if (error) throw error;

      // Shuffle questions
      return (data || []).sort(() => Math.random() - 0.5);
    } catch (err) {
      console.error('Error fetching questions for topic:', err);
      return [];
    }
  }, []);

  const getFortalezaData = useCallback(() => {
    if (!topics.length) return [];

    return topics
      .filter(t => t.is_available && t.questionCount > 0)
      .map(topic => {
        const progress = userProgress[topic.number] || {
          answered: 0, correct: 0, accuracy: 0,
          sessionsCompleted: 0, sessionQuestions: 0, masteryRate: 0
        };

        const questionsAnswered = progress.answered || progress.sessionQuestions || 0;
        const unseenCount = Math.max(0, topic.questionCount - questionsAnswered);

        // Status based on session accuracy
        let estado = 'nuevo';
        if (questionsAnswered === 0 && !progress.sessionsCompleted) {
          estado = 'nuevo';
        } else if (progress.accuracy >= 80) {
          estado = 'dominado';
        } else if (progress.accuracy >= 60) {
          estado = 'avanzando';
        } else if (progress.accuracy < 50 && questionsAnswered > 0) {
          estado = 'riesgo';
        } else {
          estado = 'progreso';
        }

        // Progress level (0-6) based on accuracy
        const progressLevel = Math.min(6, Math.round((progress.accuracy || 0) / 100 * 6));

        return {
          id: topic.id,
          nombre: topic.code || topic.name,
          progreso: progressLevel,
          estado,
          accuracy: progress.accuracy || 0,
          masteryRate: progress.masteryRate || 0,
          answered: questionsAnswered,
          total: topic.questionCount,
          unseenCount,
          sessionsCompleted: progress.sessionsCompleted || 0
        };
      });
  }, [topics, userProgress]);

  return {
    topics,
    topicsByBlock,
    userProgress,
    loading,
    error,
    getQuestionsForTopic,
    getFortalezaData,
    refreshUserProgress: fetchUserProgress,
    availableTopics: topics.filter(t => t.is_available),
    topicsWithQuestions: topics.filter(t => t.is_available && t.questionCount > 0)
  };
}

export default useTopics;
