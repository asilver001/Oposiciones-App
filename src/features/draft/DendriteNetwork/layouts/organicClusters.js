import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';

export function organicClustersLayout(phases, tasks) {
  const nodes = [];
  const edges = [];

  // Create node data
  phases.forEach(phase => {
    nodes.push({
      id: phase.id,
      type: 'phaseEnhanced',
      data: phase,
      isPhase: true,
      radius: 80,
    });
  });

  tasks.forEach(task => {
    nodes.push({
      id: task.id,
      type: 'taskEnhanced',
      data: task,
      isPhase: false,
      phase: task.phase,
      radius: 40,
    });

    edges.push({
      id: `${task.phase}-${task.id}`,
      source: task.phase,
      target: task.id,
    });
  });

  // D3 force simulation
  const simulation = forceSimulation(nodes)
    .force('link', forceLink(edges).id(d => d.id).distance(150))
    .force('charge', forceManyBody().strength(-300))
    .force('center', forceCenter(600, 400))
    .force('collision', forceCollide().radius(d => d.radius + 10));

  // Run simulation
  simulation.tick(300); // Pre-compute positions

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
    type: 'straight',
    style: { strokeWidth: 1, opacity: 0.2, stroke: '#999' },
  }));

  return { nodes: flowNodes, edges: flowEdges };
}
