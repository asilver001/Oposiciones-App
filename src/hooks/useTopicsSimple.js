import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useTopicsSimple() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topics, setTopics] = useState([]);

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
        const totalQuestions = Object.values(countsByTopic).reduce((a, b) => a + b, 0);
        console.log('✅ useTopicsSimple loaded:', enrichedTopics?.length, 'topics,', totalQuestions, 'questions');
      } catch (err) {
        console.error('❌ useTopicsSimple error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTopics();
  }, []);

  return { topics, loading, error };
}

export default useTopicsSimple;
