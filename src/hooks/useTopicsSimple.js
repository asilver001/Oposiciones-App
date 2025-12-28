import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useTopicsSimple() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topics, setTopics] = useState([]);
  const [topicsByBlock, setTopicsByBlock] = useState({});
  const [userProgress, setUserProgress] = useState({});

  useEffect(() => {
    async function fetchTopics() {
      try {
        const { data, error: fetchError } = await supabase
          .from('topics')
          .select(`
            id, code, name, number, is_available,
            blocks!left (
              id, code, number, name, short_name
            )
          `)
          .eq('is_active', true)
          .order('number');

        if (fetchError) throw fetchError;

        // Fetch question counts
        const { data: questionCounts, error: countError } = await supabase
          .from('questions')
          .select('topic_id')
          .eq('is_active', true);

        if (countError) {
          console.warn('Warning: Could not fetch question counts:', countError);
        }

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

        const totalQuestions = Object.values(countsByTopic).reduce((a, b) => a + b, 0);
        console.log('✅ useTopicsSimple loaded:', enrichedTopics?.length, 'topics,', Object.keys(sortedGrouped).length, 'blocks,', totalQuestions, 'questions');
      } catch (err) {
        console.error('❌ useTopicsSimple error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTopics();
  }, []);

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
          is_correct,
          questions!inner (topic_id)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Calculate progress per topic
      const progress = {};
      (data || []).forEach(p => {
        const topicId = p.questions?.topic_id;
        if (!topicId) return;

        if (!progress[topicId]) {
          progress[topicId] = { answered: 0, correct: 0 };
        }
        progress[topicId].answered++;
        if (p.is_correct) progress[topicId].correct++;
      });

      // Add accuracy
      Object.values(progress).forEach(p => {
        p.accuracy = p.answered > 0 ? Math.round((p.correct / p.answered) * 100) : 0;
      });

      setUserProgress(progress);
      console.log('✅ User progress loaded for', Object.keys(progress).length, 'topics');
    } catch (err) {
      console.error('⚠️ Error fetching user progress:', err);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
  }, [user, fetchUserProgress]);

  return { topics, topicsByBlock, userProgress, loading, error };
}

export default useTopicsSimple;
