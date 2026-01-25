export function matrixViewLayout(phases, tasks) {
  const nodes = [];
  const edges = [];

  const cellWidth = 250;
  const cellHeight = 200;
  const startX = 100;
  const startY = 100;

  // Create grid: rows = phases, columns = status
  const statusOrder = ['pending', 'in-progress', 'completed', 'blocked'];

  phases.forEach((phase, phaseIndex) => {
    // Add phase header on the left
    nodes.push({
      id: `phase-header-${phase.id}`,
      type: 'phaseEnhanced',
      data: { ...phase, compact: true },
      position: {
        x: startX - 150,
        y: startY + phaseIndex * cellHeight
      },
    });

    // Get tasks for this phase
    const phaseTasks = tasks.filter(t => t.phase === phase.id);

    // Organize tasks by status
    const tasksByStatus = {};
    statusOrder.forEach(status => {
      tasksByStatus[status] = phaseTasks.filter(t => t.status === status);
    });

    // Place tasks in grid cells
    statusOrder.forEach((status, statusIndex) => {
      const statusTasks = tasksByStatus[status];

      statusTasks.forEach((task, taskIndex) => {
        nodes.push({
          id: task.id,
          type: 'taskEnhanced',
          data: task,
          position: {
            x: startX + statusIndex * cellWidth + (taskIndex % 2) * 120,
            y: startY + phaseIndex * cellHeight + Math.floor(taskIndex / 2) * 100,
          },
        });
      });
    });
  });

  return { nodes, edges };
}
