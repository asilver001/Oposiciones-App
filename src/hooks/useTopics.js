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

        // Fetch question counts
        const { data: questionCounts, error: countError } = await supabase
          .from('questions')
          .select('topic_id')
          .eq('is_active', true);

        if (countError) throw countError;

        // Count questions per topic
        const countsByTopic = {};
        (questionCounts || []).forEach(q => {
          if (q.topic_id) {
            countsByTopic[q.topic_id] = (countsByTopic[q.topic_id] || 0) + 1;
          }
        });

        const enrichedTopics = (data || []).map(topic => ({
          ...topic,
          blockId: topic.blocks?.id || null,
          blockNumber: topic.blocks?.number || 0,
          blockName: topic.blocks?.name || 'Sin clasificar',
          blockCode: topic.blocks?.code || '',
          questionCount: countsByTopic[topic.id] || 0
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
      const { data, error } = await supabase
        .from('user_question_progress')
        .select(`
          question_id,
          times_seen,
          times_correct,
          state,
          ease_factor,
          lapses,
          questions!inner (topic_id)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Calculate progress per topic with FSRS data
      const progress = {};
      (data || []).forEach(p => {
        const topicId = p.questions?.topic_id;
        if (!topicId) return;

        if (!progress[topicId]) {
          progress[topicId] = {
            answered: 0,
            correct: 0,
            // FSRS states: 0=New, 1=Learning, 2=Review, 3=Relearning
            new: 0,
            learning: 0,
            review: 0,
            relearning: 0,
            mastered: 0 // ease_factor >= 2.5 and state === 2
          };
        }

        // Count by state
        const state = p.state || 0;
        if (state === 0) progress[topicId].new++;
        else if (state === 1) progress[topicId].learning++;
        else if (state === 2) {
          progress[topicId].review++;
          // Consider mastered if high ease_factor
          if (p.ease_factor >= 2.5) progress[topicId].mastered++;
        }
        else if (state === 3) progress[topicId].relearning++;

        progress[topicId].answered += p.times_seen || 0;
        progress[topicId].correct += p.times_correct || 0;
      });

      // Add accuracy and mastery rate
      Object.values(progress).forEach(p => {
        p.accuracy = p.answered > 0 ? Math.round((p.correct / p.answered) * 100) : 0;
        const totalCards = p.new + p.learning + p.review + p.relearning;
        p.masteryRate = totalCards > 0 ? Math.round((p.mastered / totalCards) * 100) : 0;
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

  const getQuestionsForTopic = useCallback(async (topicId, limit = 20) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('topic_id', topicId)
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
        const progress = userProgress[topic.id] || {
          answered: 0, correct: 0, accuracy: 0,
          new: 0, learning: 0, review: 0, relearning: 0, mastered: 0, masteryRate: 0
        };

        // Calculate completion based on cards seen vs total questions
        const totalCards = progress.new + progress.learning + progress.review + progress.relearning;
        const unseenCount = topic.questionCount - totalCards;

        // Progress: based on mastery rate and accuracy
        let estado = 'nuevo';
        if (totalCards === 0) {
          estado = 'nuevo';
        } else if (progress.masteryRate >= 80 && progress.accuracy >= 75) {
          estado = 'dominado';
        } else if (progress.masteryRate >= 50 || progress.accuracy >= 65) {
          estado = 'avanzando';
        } else if (progress.relearning > 0 || progress.accuracy < 50) {
          estado = 'riesgo';
        } else {
          estado = 'progreso';
        }

        // Progress level (0-6) based on mastery
        const progressLevel = Math.min(6, Math.round(progress.masteryRate / 100 * 6));

        return {
          id: topic.id,
          nombre: topic.code || topic.name,
          progreso: progressLevel,
          estado,
          accuracy: progress.accuracy || 0,
          masteryRate: progress.masteryRate || 0,
          answered: progress.answered,
          total: topic.questionCount,
          unseenCount,
          // FSRS breakdown
          fsrs: {
            new: progress.new,
            learning: progress.learning,
            review: progress.review,
            relearning: progress.relearning,
            mastered: progress.mastered
          }
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
