export function swimLanesLayout(phases, tasks) {
  const nodes = [];
  const edges = [];

  const statusOrder = ['completed', 'in-progress', 'pending', 'blocked'];
  const laneHeight = 300;

  // Group tasks by status
  const tasksByStatus = {};
  statusOrder.forEach(status => {
    tasksByStatus[status] = tasks.filter(t => t.status === status);
  });

  statusOrder.forEach((status, statusIndex) => {
    const laneY = statusIndex * laneHeight + 150;

    tasksByStatus[status].forEach((task, taskIndex) => {
      nodes.push({
        id: task.id,
        type: 'taskEnhanced',
        data: task,
        position: {
          x: 100 + (taskIndex * 180),
          y: laneY,
        },
      });
    });
  });

  // Add phase markers on the left
  phases.forEach((phase, index) => {
    nodes.push({
      id: phase.id,
      type: 'phaseEnhanced',
      data: { ...phase, compact: true },
      position: { x: 50, y: 50 + (index * 100) },
    });
  });

  return { nodes, edges };
}
