/**
 * Metro Map Layout - Subway-style linear paths with stations
 * Great for understanding sequential dependencies
 */
export function metroMapLayout(phases, tasks) {
  const nodes = [];
  const edges = [];

  const startX = 100;
  const startY = 200;
  const phaseSpacing = 300;
  const taskOffsetY = 100;

  // Line colors for each phase (metro line colors)
  const lineColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

  phases.forEach((phase, phaseIndex) => {
    const phaseX = startX + phaseIndex * phaseSpacing;
    const lineColor = lineColors[phaseIndex % lineColors.length];

    // Phase as major station
    nodes.push({
      id: phase.id,
      type: 'phaseCompact',
      data: {
        ...phase,
        tasks: tasks.filter(t => t.phase === phase.id),
        color: lineColor,
      },
      position: { x: phaseX, y: startY },
    });

    // Connect phases horizontally (main line)
    if (phaseIndex > 0) {
      edges.push({
        id: `metro-${phases[phaseIndex - 1].id}-${phase.id}`,
        source: phases[phaseIndex - 1].id,
        target: phase.id,
        type: 'smoothstep',
        style: {
          stroke: '#4b5563',
          strokeWidth: 6,
          opacity: 0.8,
        },
      });
    }

    // Tasks as stations below the main line
    const phaseTasks = tasks.filter(t => t.phase === phase.id);
    const tasksPerColumn = 4;

    phaseTasks.forEach((task, tIndex) => {
      const column = Math.floor(tIndex / tasksPerColumn);
      const row = tIndex % tasksPerColumn;
      const taskX = phaseX - 80 + column * 80;
      const taskY = startY + taskOffsetY + row * 70;

      nodes.push({
        id: task.id,
        type: 'taskCompact',
        data: task,
        position: { x: taskX, y: taskY },
      });

      // Connect first task of column to phase
      if (row === 0) {
        edges.push({
          id: `station-${phase.id}-${task.id}`,
          source: phase.id,
          target: task.id,
          type: 'smoothstep',
          style: {
            stroke: lineColor,
            strokeWidth: 3,
            opacity: 0.6,
          },
        });
      }

      // Connect tasks vertically within column
      if (row > 0) {
        const prevTask = phaseTasks[tIndex - 1];
        edges.push({
          id: `track-${prevTask.id}-${task.id}`,
          source: prevTask.id,
          target: task.id,
          type: 'straight',
          style: {
            stroke: lineColor,
            strokeWidth: 2,
            opacity: 0.4,
          },
        });
      }
    });
  });

  return { nodes, edges };
}
