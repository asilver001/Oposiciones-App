export function galaxySpiralLayout(phases, tasks) {
  const nodes = [];
  const edges = [];

  const centerX = 600;
  const centerY = 400;

  phases.forEach((phase, index) => {
    const spiralFactor = 1 + (index * 0.5);
    const angle = index * (2 * Math.PI / phases.length) * spiralFactor;
    const radius = 100 + (index * 80);

    nodes.push({
      id: phase.id,
      type: 'phaseEnhanced',
      data: { ...phase, size: 'large' },
      position: {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      },
    });

    // Tasks orbit around phase
    const phaseTasks = tasks.filter(t => t.phase === phase.id);
    phaseTasks.forEach((task, tIndex) => {
      const orbitAngle = (tIndex / phaseTasks.length) * 2 * Math.PI;
      const orbitRadius = 120;

      const phaseX = centerX + Math.cos(angle) * radius;
      const phaseY = centerY + Math.sin(angle) * radius;

      nodes.push({
        id: task.id,
        type: 'taskEnhanced',
        data: task,
        position: {
          x: phaseX + Math.cos(orbitAngle) * orbitRadius,
          y: phaseY + Math.sin(orbitAngle) * orbitRadius,
        },
      });

      edges.push({
        id: `${phase.id}-${task.id}`,
        source: phase.id,
        target: task.id,
        type: 'straight',
        style: { strokeWidth: 1, opacity: 0.3, stroke: '#666' },
      });
    });
  });

  return { nodes, edges };
}
