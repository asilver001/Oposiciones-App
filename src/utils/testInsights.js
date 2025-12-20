/**
 * Test utilities for the Insights system
 * Run from browser console or use in admin panel
 */

import { supabase } from '../lib/supabase';
import { detectTriggeredInsights } from '../services/insightDetector';

/**
 * Test the complete insights system flow
 * @param {string} userId - User ID to test with
 * @returns {Promise<Object>} Test results
 */
export async function testInsightSystem(userId) {
  const results = {
    templates: [],
    links: [],
    triggered: [],
    errors: []
  };

  console.log('🧪 Iniciando test de insights...\n');

  try {
    // 1. Verify insight templates exist
    console.log('📋 Verificando templates de insights...');
    const { data: templates, error: tErr } = await supabase
      .from('insight_templates')
      .select('*')
      .eq('activo', true);

    if (tErr) {
      console.error('❌ Error al obtener templates:', tErr);
      results.errors.push({ step: 'templates', error: tErr });
    } else {
      results.templates = templates || [];
      console.log(`   ✓ Templates activos: ${templates?.length || 0}`);
      templates?.forEach(t => {
        console.log(`     - ${t.emoji} ${t.titulo} (min_fallos: ${t.min_fallos_para_activar})`);
      });
    }

    // 2. Verify question links
    console.log('\n🔗 Verificando links pregunta-insight...');
    const { data: links, error: lErr } = await supabase
      .from('insight_question_links')
      .select(`
        *,
        insight_templates(id, titulo, emoji)
      `);

    if (lErr) {
      console.error('❌ Error al obtener links:', lErr);
      results.errors.push({ step: 'links', error: lErr });
    } else {
      results.links = links || [];
      console.log(`   ✓ Links totales: ${links?.length || 0}`);

      // Group by insight
      if (templates && links) {
        console.log('\n📊 Resumen por insight:');
        templates.forEach(t => {
          const count = links.filter(l => l.insight_template_id === t.id).length;
          const status = count >= t.min_fallos_para_activar ? '✅' : '⚠️';
          console.log(`   ${status} "${t.titulo}": ${count} preguntas vinculadas (necesita ${t.min_fallos_para_activar})`);
        });
      }
    }

    // 3. Simulate detection if we have enough links
    if (links && links.length >= 2 && userId) {
      console.log('\n🎯 Simulando deteccion de insights...');

      // Get question IDs from the first insight that has enough links
      const insightWithLinks = templates?.find(t => {
        const count = links.filter(l => l.insight_template_id === t.id).length;
        return count >= t.min_fallos_para_activar;
      });

      if (insightWithLinks) {
        const testLinks = links
          .filter(l => l.insight_template_id === insightWithLinks.id)
          .slice(0, insightWithLinks.min_fallos_para_activar);

        const testQuestionIds = testLinks.map(l => l.question_id);
        console.log(`   Simulando fallar preguntas: ${testQuestionIds.join(', ')}`);

        const mockResults = testQuestionIds.map(qid => ({
          question_id: qid,
          es_correcta: false,
          respuesta_usuario: 'a',
          respuesta_correcta: 'b'
        }));

        const triggered = await detectTriggeredInsights(mockResults, userId, supabase);
        results.triggered = triggered;

        console.log(`\n✅ Insights que se activarian: ${triggered.length}`);
        triggered.forEach(i => {
          console.log(`   - ${i.emoji} ${i.titulo}`);
          console.log(`     Preguntas falladas: ${i.totalFailed}`);
        });
      } else {
        console.log('   ⚠️ Ningun insight tiene suficientes preguntas vinculadas');
      }
    } else if (!userId) {
      console.log('\n⚠️ No se proporciono userId - saltando simulacion de deteccion');
    } else {
      console.log('\n⚠️ Necesitas vincular al menos 2 preguntas a un insight desde el panel admin');
    }

    // 4. Check user's triggered insights history
    if (userId) {
      console.log('\n📜 Historial de insights del usuario...');
      const { data: history, error: hErr } = await supabase
        .from('user_triggered_insights')
        .select(`
          *,
          insight_templates(titulo, emoji)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (hErr) {
        console.error('❌ Error al obtener historial:', hErr);
      } else if (history && history.length > 0) {
        console.log(`   Ultimos ${history.length} insights activados:`);
        history.forEach(h => {
          const status = h.visto ? '👁️' : '🆕';
          console.log(`   ${status} ${h.insight_templates?.emoji} ${h.insight_templates?.titulo}`);
          console.log(`      Fecha: ${new Date(h.created_at).toLocaleString('es-ES')}`);
        });
      } else {
        console.log('   No hay insights activados para este usuario');
      }
    }

  } catch (err) {
    console.error('❌ Error general:', err);
    results.errors.push({ step: 'general', error: err });
  }

  console.log('\n🧪 Test completado');
  return results;
}

/**
 * Quick check if the insights system is properly configured
 * @returns {Promise<Object>} Status object
 */
export async function checkInsightsStatus() {
  const status = {
    hasTemplates: false,
    hasLinks: false,
    templatesCount: 0,
    linksCount: 0,
    ready: false
  };

  try {
    const { count: templatesCount } = await supabase
      .from('insight_templates')
      .select('*', { count: 'exact', head: true })
      .eq('activo', true);

    const { count: linksCount } = await supabase
      .from('insight_question_links')
      .select('*', { count: 'exact', head: true });

    status.templatesCount = templatesCount || 0;
    status.linksCount = linksCount || 0;
    status.hasTemplates = templatesCount > 0;
    status.hasLinks = linksCount > 0;
    status.ready = status.hasTemplates && status.hasLinks;

  } catch (err) {
    console.error('Error checking status:', err);
  }

  return status;
}

/**
 * Create sample insight templates for testing
 * @returns {Promise<Object>} Created templates
 */
export async function createSampleInsights() {
  const sampleInsights = [
    {
      titulo: 'Confusion Y vs O',
      descripcion: 'Fallaste preguntas donde la diferencia clave era "Rey Y las CCGG" vs "Rey O las CCGG". Este es un patron de pregunta trampa muy comun.',
      emoji: '🎯',
      tipo: 'error_comun',
      min_fallos_para_activar: 2,
      mensaje_accion: 'Practicar este tipo',
      es_accionable: true,
      activo: true
    },
    {
      titulo: 'Cuidado con los plazos',
      descripcion: 'Confundiste plazos similares (15 dias vs 10 dias vs 20 dias). Los examinadores cambian cifras sutilmente.',
      emoji: '🔢',
      tipo: 'error_comun',
      min_fallos_para_activar: 2,
      mensaje_accion: 'Repasar plazos',
      es_accionable: true,
      activo: true
    },
    {
      titulo: 'Debilidad en Art. 57 CE',
      descripcion: 'Tus errores se concentran en el articulo 57 sobre la sucesion a la Corona.',
      emoji: '📖',
      tipo: 'concepto_clave',
      min_fallos_para_activar: 2,
      mensaje_accion: 'Repasar Art. 57',
      es_accionable: true,
      activo: true
    }
  ];

  console.log('📝 Creando insights de ejemplo...');

  const { data, error } = await supabase
    .from('insight_templates')
    .insert(sampleInsights)
    .select();

  if (error) {
    console.error('❌ Error al crear insights:', error);
    return { error };
  }

  console.log(`✅ Creados ${data.length} insights de ejemplo`);
  return { data };
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testInsights = {
    testInsightSystem,
    checkInsightsStatus,
    createSampleInsights
  };
  console.log('💡 Test utilities available: window.testInsights.testInsightSystem(userId)');
}

export default {
  testInsightSystem,
  checkInsightsStatus,
  createSampleInsights
};
