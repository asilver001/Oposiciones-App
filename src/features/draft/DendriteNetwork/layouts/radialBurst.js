export function radialBurstLayout(phases, tasks) {
  const nodes = [];
  const edges = [];

  // Center the completed phases
  const centerX = 500;
  const centerY = 400;
  const radius = 300;

  phases.forEach((phase, index) => {
    const angle = (index / phases.length) * 2 * Math.PI;
    const x = centerX + Math.cos(angle) * (phase.status === 'completed' ? radius * 0.3 : radius);
    const y = centerY + Math.sin(angle) * (phase.status === 'completed' ? radius * 0.3 : radius);

    nodes.push({
      id: phase.id,
      type: 'phaseEnhanced',
      data: phase,
      position: { x, y },
    });

    // Position tasks around their phase
    const phaseTasks = tasks.filter(t => t.phase === phase.id);
    phaseTasks.forEach((task, tIndex) => {
      const taskAngle = angle + (tIndex / phaseTasks.length) * (Math.PI / 4);
      const taskRadius = radius + 150;

      nodes.push({
        id: task.id,
        type: 'taskEnhanced',
        data: task,
        position: {
          x: centerX + Math.cos(taskAngle) * taskRadius,
          y: centerY + Math.sin(taskAngle) * taskRadius,
        },
      });

      edges.push({
        id: `${phase.id}-${task.id}`,
        source: phase.id,
        target: task.id,
        type: 'smoothstep',
        animated: task.status === 'in-progress',
        style: {
          stroke: task.status === 'completed' ? '#10b981' : phase.color || '#9333ea',
          strokeWidth: 2,
          opacity: 0.6,
        },
      });
    });
  });

  return { nodes, edges };
}
