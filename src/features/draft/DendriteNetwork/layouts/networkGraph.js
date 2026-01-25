import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';

export function networkGraphLayout(phases, tasks) {
  const nodes = [];
  const edges = [];

  // Create all nodes
  phases.forEach(phase => {
    nodes.push({
      id: phase.id,
      type: 'phaseEnhanced',
      data: phase,
      isPhase: true,
      radius: 100,
    });
  });

  tasks.forEach(task => {
    nodes.push({
      id: task.id,
      type: 'taskEnhanced',
      data: task,
      isPhase: false,
      radius: 50,
    });

    // Connect task to its phase
    edges.push({
      id: `${task.phase}-${task.id}`,
      source: task.phase,
      target: task.id,
    });
  });

  // Add connections between tasks based on dependencies
  tasks.forEach(task => {
    if (task.dependencies) {
      task.dependencies.forEach(depId => {
        edges.push({
          id: `dep-${depId}-${task.id}`,
          source: depId,
          target: task.id,
          isDependency: true,
        });
      });
    }
  });

  // Add connections between sequential phases
  phases.forEach((phase, index) => {
    if (index < phases.length - 1) {
      edges.push({
        id: `phase-link-${index}`,
        source: phase.id,
        target: phases[index + 1].id,
        isPhaseLink: true,
      });
    }
  });

  // D3 force simulation with stronger forces for network effect
  const simulation = forceSimulation(nodes)
    .force('link', forceLink(edges).id(d => d.id).distance(d => d.isDependency ? 100 : 150))
    .force('charge', forceManyBody().strength(d => d.isPhase ? -500 : -200))
    .force('center', forceCenter(700, 500))
    .force('collision', forceCollide().radius(d => d.radius + 20));

  // Run simulation
  simulation.tick(400);

  // Convert to React Flow format
  const flowNodes = nodes.map(node => ({
    id: node.id,
    type: node.type,
    data: node.data,
    position: { x: node.x, y: node.y },
  }));

  const flowEdges = edges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: edge.isDependency ? 'smoothstep' : 'straight',
    animated: edge.isDependency,
    style: {
      strokeWidth: edge.isPhaseLink ? 3 : edge.isDependency ? 2 : 1,
      opacity: edge.isPhaseLink ? 0.3 : edge.isDependency ? 0.6 : 0.2,
      stroke: edge.isDependency ? '#f59e0b' : edge.isPhaseLink ? '#9333ea' : '#999',
      strokeDasharray: edge.isPhaseLink ? '5,5' : 'none',
    },
  }));

  return { nodes: flowNodes, edges: flowEdges };
}
