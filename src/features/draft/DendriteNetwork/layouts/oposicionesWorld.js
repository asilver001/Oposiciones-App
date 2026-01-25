/**
 * Oposiciones World Layout - Career progression visualization
 * Shows the Spanish public service career paths organized by level (C2 → A1)
 */
export function oposicionesWorldLayout(oposicionesData) {
  const nodes = [];
  const edges = [];

  const { levels, areas, positions } = oposicionesData;

  // Layout configuration
  const startX = 100;
  const startY = 100;
  const levelSpacing = 350; // Horizontal spacing between levels
  const areaSpacing = 180; // Vertical spacing between areas
  const nodeWidth = 140;
  const nodeHeight = 80;

  // Level colors
  const levelColors = {
    C2: '#10b981', // emerald
    C1: '#8b5cf6', // purple
    A2: '#3b82f6', // blue
    A1: '#f59e0b', // amber
  };

  // Area icons mapping
  const areaIcons = {
    age: 'Building2',
    justicia: 'Scale',
    hacienda: 'Landmark',
    'seguridad-social': 'Heart',
    local: 'MapPin',
  };

  // Create level header nodes
  levels.forEach((level, levelIndex) => {
    const x = startX + levelIndex * levelSpacing;
    nodes.push({
      id: `level-${level.id}`,
      type: 'phaseCompact',
      data: {
        id: `level-${level.id}`,
        name: level.name,
        description: level.description,
        status: 'in-progress',
        color: levelColors[level.id],
        tasks: positions.filter(p => p.level === level.id),
      },
      position: { x: x + 50, y: startY - 100 },
    });
  });

  // Group positions by area and level
  const positionsByAreaAndLevel = {};
  areas.forEach(area => {
    positionsByAreaAndLevel[area.id] = {};
    levels.forEach(level => {
      positionsByAreaAndLevel[area.id][level.id] = positions.filter(
        p => p.area === area.id && p.level === level.id
      );
    });
  });

  // Create position nodes
  areas.forEach((area, areaIndex) => {
    const areaY = startY + areaIndex * areaSpacing;

    levels.forEach((level, levelIndex) => {
      const levelX = startX + levelIndex * levelSpacing;
      const areaPositions = positionsByAreaAndLevel[area.id][level.id];

      areaPositions.forEach((position, posIndex) => {
        const nodeX = levelX + posIndex * 80;
        const nodeY = areaY + posIndex * 30;

        // Determine status color
        let status = 'pending';
        if (position.status === 'active') status = 'in-progress';
        if (position.status === 'completed') status = 'completed';

        nodes.push({
          id: position.id,
          type: 'taskCompact',
          data: {
            id: position.id,
            label: position.shortName || position.name,
            description: position.description,
            status: status,
            priority: position.difficulty <= 2 ? 'P2' : position.difficulty <= 4 ? 'P1' : 'P0',
            estimatedHours: position.difficulty * 500, // Rough hours of study
            area: area.name,
            level: level.id,
            salary: position.salary,
            plazas: position.plazas2024,
            requirements: position.requirements,
          },
          position: { x: nodeX, y: nodeY },
        });

        // Connect to level header
        edges.push({
          id: `level-${level.id}-${position.id}`,
          source: `level-${level.id}`,
          target: position.id,
          type: 'straight',
          style: {
            stroke: levelColors[level.id],
            strokeWidth: 1,
            opacity: 0.15,
          },
        });
      });
    });
  });

  // Create career progression edges
  positions.forEach(position => {
    if (position.nextSteps) {
      position.nextSteps.forEach(nextId => {
        const nextPosition = positions.find(p => p.id === nextId);
        if (nextPosition) {
          edges.push({
            id: `career-${position.id}-${nextId}`,
            source: position.id,
            target: nextId,
            type: 'smoothstep',
            animated: position.status === 'active',
            style: {
              stroke: levelColors[nextPosition.level] || '#6366f1',
              strokeWidth: 2,
              opacity: 0.6,
            },
            label: '',
            markerEnd: {
              type: 'arrowclosed',
              color: levelColors[nextPosition.level] || '#6366f1',
            },
          });
        }
      });
    }
  });

  return { nodes, edges };
}

/**
 * Simple horizontal layout for oposiciones - easier to read
 */
export function oposicionesHorizontalLayout(oposicionesData) {
  const nodes = [];
  const edges = [];

  const { levels, areas, positions } = oposicionesData;

  const startX = 150;
  const startY = 150;
  const levelSpacing = 300;
  const rowSpacing = 100;

  const levelColors = {
    C2: '#10b981',
    C1: '#8b5cf6',
    A2: '#3b82f6',
    A1: '#f59e0b',
  };

  // Group positions by level
  const positionsByLevel = {};
  levels.forEach(level => {
    positionsByLevel[level.id] = positions.filter(p => p.level === level.id);
  });

  // Create nodes for each level column
  levels.forEach((level, levelIndex) => {
    const levelX = startX + levelIndex * levelSpacing;
    const levelPositions = positionsByLevel[level.id];

    // Level header
    nodes.push({
      id: `level-header-${level.id}`,
      type: 'phaseCompact',
      data: {
        id: `level-header-${level.id}`,
        name: level.name,
        description: level.description,
        status: levelIndex === 0 ? 'in-progress' : 'pending',
        color: levelColors[level.id],
        tasks: levelPositions,
      },
      position: { x: levelX, y: startY - 120 },
    });

    // Position nodes
    levelPositions.forEach((position, posIndex) => {
      const nodeY = startY + posIndex * rowSpacing;

      nodes.push({
        id: position.id,
        type: 'taskCompact',
        data: {
          id: position.id,
          label: position.shortName,
          description: `${position.area} - ${position.description}`,
          status: position.status === 'active' ? 'in-progress' : 'pending',
          priority: position.difficulty <= 2 ? 'P2' : position.difficulty <= 4 ? 'P1' : 'P0',
          estimatedHours: position.difficulty * 400,
          salary: position.salary,
          plazas: position.plazas2024,
        },
        position: { x: levelX, y: nodeY },
      });

      // Connect to header
      edges.push({
        id: `header-${level.id}-${position.id}`,
        source: `level-header-${level.id}`,
        target: position.id,
        type: 'straight',
        style: {
          stroke: levelColors[level.id],
          strokeWidth: 1,
          opacity: 0.2,
        },
      });
    });
  });

  // Career progression edges
  positions.forEach(position => {
    if (position.nextSteps) {
      position.nextSteps.forEach(nextId => {
        const nextPosition = positions.find(p => p.id === nextId);
        if (nextPosition) {
          edges.push({
            id: `progression-${position.id}-${nextId}`,
            source: position.id,
            target: nextId,
            type: 'smoothstep',
            animated: position.status === 'active',
            style: {
              stroke: levelColors[nextPosition.level],
              strokeWidth: 2,
              opacity: 0.7,
            },
            markerEnd: {
              type: 'arrowclosed',
              color: levelColors[nextPosition.level],
            },
          });
        }
      });
    }
  });

  return { nodes, edges };
}
