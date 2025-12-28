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

        const enrichedTopics = (data || []).map(topic => ({
          ...topic,
          blockId: topic.blocks?.id || null,
          blockNumber: topic.blocks?.number || 0,
          blockName: topic.blocks?.name || 'Sin clasificar',
          blockCode: topic.blocks?.code || ''
        }));

        setTopics(enrichedTopics);
        console.log('✅ useTopicsSimple loaded:', enrichedTopics?.length, 'topics with blocks');
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
