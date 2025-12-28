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
          .select('id, code, name, is_available')
          .eq('is_active', true)
          .order('number');

        if (fetchError) throw fetchError;
        setTopics(data || []);
        console.log('✅ useTopicsSimple loaded:', data?.length, 'topics');
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
