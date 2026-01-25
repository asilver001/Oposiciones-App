/**
 * Galaxy Spiral Compact - Improved galaxy with compact nodes
 * Creates a beautiful spiral pattern with tasks orbiting phases
 */
export function galaxySpiralCompactLayout(phases, tasks) {
  const nodes = [];
  const edges = [];

  const centerX = 600;
  const centerY = 450;

  // Central "black hole" representing the project
  nodes.push({
    id: 'galaxy-core',
    type: 'phaseCompact',
    data: {
      id: 'galaxy-core',
      name: 'Core',
      status: 'in-progress',
      description: 'Project Center',
      color: '#1f2937',
      tasks: [],
    },
    position: { x: centerX, y: centerY },
  });

  // Spiral arm parameters
  const spiralTightness = 0.3;
  const baseRadius = 150;
  const radiusGrowth = 60;

  phases.forEach((phase, phaseIndex) => {
    // Spiral formula: r = a + b*theta
    const theta = phaseIndex * (2 * Math.PI / phases.length) * 1.5;
    const radius = baseRadius + phaseIndex * radiusGrowth;

    const phaseX = centerX + Math.cos(theta) * radius;
    const phaseY = centerY + Math.sin(theta) * radius;

    // Add phase as a "star system"
    nodes.push({
      id: phase.id,
      type: 'phaseCompact',
      data: {
        ...phase,
        tasks: tasks.filter(t => t.phase === phase.id),
      },
      position: { x: phaseX, y: phaseY },
    });

    // Spiral arm connection to center
    edges.push({
      id: `arm-${phase.id}`,
      source: 'galaxy-core',
      target: phase.id,
      type: 'bezier',
      style: {
        stroke: phase.color || '#6366f1',
        strokeWidth: 2,
        opacity: 0.3,
        strokeDasharray: '4,4',
      },
    });

    // Connect to previous phase (spiral arm)
    if (phaseIndex > 0) {
      edges.push({
        id: `spiral-${phases[phaseIndex - 1].id}-${phase.id}`,
        source: phases[phaseIndex - 1].id,
        target: phase.id,
        type: 'bezier',
        animated: phase.status === 'in-progress',
        style: {
          stroke: '#9333ea',
          strokeWidth: 2,
          opacity: 0.5,
        },
      });
    }

    // Tasks orbit around phase like planets
    const phaseTasks = tasks.filter(t => t.phase === phase.id);
    const orbitRadius = 60 + Math.min(phaseTasks.length * 5, 40);

    phaseTasks.forEach((task, tIndex) => {
      // Elliptical orbit
      const orbitAngle = (tIndex / phaseTasks.length) * 2 * Math.PI;
      const orbitEccentricity = 0.3;
      const rx = orbitRadius;
      const ry = orbitRadius * (1 - orbitEccentricity);

      const taskX = phaseX + Math.cos(orbitAngle) * rx;
      const taskY = phaseY + Math.sin(orbitAngle) * ry;

      nodes.push({
        id: task.id,
        type: 'taskCompact',
        data: task,
        position: { x: taskX, y: taskY },
      });

      // Gravitational pull line
      edges.push({
        id: `orbit-${phase.id}-${task.id}`,
        source: phase.id,
        target: task.id,
        type: 'straight',
        style: {
          stroke: task.status === 'completed' ? '#10b981' : '#4b5563',
          strokeWidth: 1,
          opacity: 0.25,
        },
      });
    });
  });

  // Outer ring of "stars" (completed tasks glow)
  const completedTasks = tasks.filter(t => t.status === 'completed');
  completedTasks.forEach((task, index) => {
    // Add glow effect by finding existing node
    const existingNode = nodes.find(n => n.id === task.id);
    if (existingNode) {
      existingNode.data = { ...existingNode.data, isGlowing: true };
    }
  });

  return { nodes, edges };
}
