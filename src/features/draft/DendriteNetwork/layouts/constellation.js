/**
 * Constellation Layout - Tasks as stars forming constellations per phase
 * Uses compact nodes for better connection visibility
 */
export function constellationLayout(phases, tasks) {
  const nodes = [];
  const edges = [];

  const centerX = 600;
  const centerY = 400;

  phases.forEach((phase, phaseIndex) => {
    // Place phases in a large circle
    const phaseAngle = (phaseIndex / phases.length) * 2 * Math.PI - Math.PI / 2;
    const phaseRadius = 350;
    const phaseX = centerX + Math.cos(phaseAngle) * phaseRadius;
    const phaseY = centerY + Math.sin(phaseAngle) * phaseRadius;

    nodes.push({
      id: phase.id,
      type: 'phaseCompact',
      data: { ...phase, tasks: tasks.filter(t => t.phase === phase.id) },
      position: { x: phaseX, y: phaseY },
    });

    // Tasks form a constellation pattern around each phase
    const phaseTasks = tasks.filter(t => t.phase === phase.id);
    const taskRadius = 80 + phaseTasks.length * 8;

    phaseTasks.forEach((task, tIndex) => {
      // Create irregular star pattern
      const irregularity = Math.sin(tIndex * 2.5) * 0.3;
      const taskAngle = (tIndex / phaseTasks.length) * 2 * Math.PI + irregularity;
      const radiusVariation = taskRadius * (0.8 + Math.cos(tIndex * 1.7) * 0.4);

      const taskX = phaseX + Math.cos(taskAngle) * radiusVariation;
      const taskY = phaseY + Math.sin(taskAngle) * radiusVariation;

      nodes.push({
        id: task.id,
        type: 'taskCompact',
        data: task,
        position: { x: taskX, y: taskY },
      });

      // Connect task to phase with thin line
      edges.push({
        id: `${phase.id}-${task.id}`,
        source: phase.id,
        target: task.id,
        type: 'straight',
        style: {
          stroke: task.status === 'completed' ? '#10b981' : '#6b7280',
          strokeWidth: 1,
          opacity: 0.4,
        },
      });

      // Connect adjacent tasks in constellation
      if (tIndex > 0) {
        const prevTask = phaseTasks[tIndex - 1];
        edges.push({
          id: `star-${prevTask.id}-${task.id}`,
          source: prevTask.id,
          target: task.id,
          type: 'straight',
          style: {
            stroke: '#9333ea',
            strokeWidth: 1,
            opacity: 0.2,
            strokeDasharray: '2,4',
          },
        });
      }
    });

    // Connect last to first task to close constellation
    if (phaseTasks.length > 2) {
      edges.push({
        id: `star-close-${phase.id}`,
        source: phaseTasks[phaseTasks.length - 1].id,
        target: phaseTasks[0].id,
        type: 'straight',
        style: {
          stroke: '#9333ea',
          strokeWidth: 1,
          opacity: 0.2,
          strokeDasharray: '2,4',
        },
      });
    }

    // Connect phases
    if (phaseIndex > 0) {
      edges.push({
        id: `phase-link-${phaseIndex}`,
        source: phases[phaseIndex - 1].id,
        target: phase.id,
        type: 'smoothstep',
        animated: phase.status === 'in-progress',
        style: {
          stroke: '#9333ea',
          strokeWidth: 2,
          opacity: 0.5,
        },
      });
    }
  });

  return { nodes, edges };
}
