/**
 * MindMap Layout - Central hub with radial branches
 * Perfect for seeing hierarchical relationships
 */
export function mindMapLayout(phases, tasks) {
  const nodes = [];
  const edges = [];

  const centerX = 600;
  const centerY = 400;

  // Central project node (virtual)
  nodes.push({
    id: 'project-center',
    type: 'phaseCompact',
    data: {
      id: 'project-center',
      name: 'MVP',
      status: 'in-progress',
      description: 'OpositaSmart MVP Roadmap',
      color: '#9333ea',
      tasks: tasks,
    },
    position: { x: centerX, y: centerY },
  });

  // Phases branch out from center
  phases.forEach((phase, phaseIndex) => {
    const phaseAngle = (phaseIndex / phases.length) * 2 * Math.PI - Math.PI / 2;
    const phaseRadius = 200;
    const phaseX = centerX + Math.cos(phaseAngle) * phaseRadius;
    const phaseY = centerY + Math.sin(phaseAngle) * phaseRadius;

    nodes.push({
      id: phase.id,
      type: 'phaseCompact',
      data: { ...phase, tasks: tasks.filter(t => t.phase === phase.id) },
      position: { x: phaseX, y: phaseY },
    });

    // Connect phase to center
    edges.push({
      id: `center-${phase.id}`,
      source: 'project-center',
      target: phase.id,
      type: 'smoothstep',
      animated: phase.status === 'in-progress',
      style: {
        stroke: phase.color || '#9333ea',
        strokeWidth: 3,
        opacity: 0.7,
      },
    });

    // Tasks branch out from each phase
    const phaseTasks = tasks.filter(t => t.phase === phase.id);
    const taskSpread = Math.PI / 2; // 90 degree spread
    const startAngle = phaseAngle - taskSpread / 2;

    phaseTasks.forEach((task, tIndex) => {
      const taskAngle = startAngle + (tIndex / Math.max(phaseTasks.length - 1, 1)) * taskSpread;
      const taskRadius = 120;
      const taskX = phaseX + Math.cos(taskAngle) * taskRadius;
      const taskY = phaseY + Math.sin(taskAngle) * taskRadius;

      nodes.push({
        id: task.id,
        type: 'taskCompact',
        data: task,
        position: { x: taskX, y: taskY },
      });

      edges.push({
        id: `${phase.id}-${task.id}`,
        source: phase.id,
        target: task.id,
        type: 'smoothstep',
        style: {
          stroke: task.status === 'completed' ? '#10b981' : '#9ca3af',
          strokeWidth: 1.5,
          opacity: 0.5,
        },
      });
    });
  });

  return { nodes, edges };
}
