/**
 * useGraphPhysics Hook
 *
 * Handles force-directed graph physics simulation with:
 * - Center attraction
 * - Node repulsion
 * - Link attraction
 * - Z-depth floating
 * - Organic "breathing" animation
 */

import { useRef, useCallback, useEffect } from 'react';
import type { GraphNode, GraphLink, PhysicsConfig } from './types';
import { DEFAULT_PHYSICS } from './types';

interface PhysicsNode extends GraphNode {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  floatPhase: number; // For organic floating
}

interface UseGraphPhysicsOptions {
  nodes: GraphNode[];
  links: GraphLink[];
  width: number;
  height: number;
  config?: Partial<PhysicsConfig>;
  onUpdate: (nodes: PhysicsNode[]) => void;
}

export function useGraphPhysics({
  nodes,
  links,
  width,
  height,
  config,
  onUpdate,
}: UseGraphPhysicsOptions) {
  const physics = { ...DEFAULT_PHYSICS, ...config };
  const nodesRef = useRef<PhysicsNode[]>([]);
  const animationRef = useRef<number>(0);
  const isRunningRef = useRef(false);

  // Initialize nodes with random positions
  const initializeNodes = useCallback(() => {
    const centerX = width / 2;
    const centerY = height / 2;

    nodesRef.current = nodes.map((node, i) => ({
      ...node,
      x: node.x ?? centerX + (Math.random() - 0.5) * width * 0.6,
      y: node.y ?? centerY + (Math.random() - 0.5) * height * 0.6,
      z: node.z ?? (Math.random() - 0.5) * (physics.maxZ - physics.minZ),
      vx: node.vx ?? 0,
      vy: node.vy ?? 0,
      vz: node.vz ?? 0,
      floatPhase: Math.random() * Math.PI * 2,
    }));
  }, [nodes, width, height, physics.maxZ, physics.minZ]);

  // Create node lookup map
  const getNodeMap = useCallback(() => {
    const map = new Map<string, PhysicsNode>();
    nodesRef.current.forEach(node => map.set(node.id, node));
    return map;
  }, []);

  // Apply center force - pull nodes towards center
  const applyCenterForce = useCallback((node: PhysicsNode) => {
    const centerX = width / 2;
    const centerY = height / 2;

    const dx = centerX - node.x;
    const dy = centerY - node.y;

    node.vx += dx * physics.centerForce;
    node.vy += dy * physics.centerForce;
  }, [width, height, physics.centerForce]);

  // Apply repulsion force - push nodes apart
  const applyRepulsion = useCallback(() => {
    const nodes = nodesRef.current;
    const n = nodes.length;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];

        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dz = nodeB.z - nodeA.z;

        // Include Z in distance calculation for 3D repulsion
        const distSq = dx * dx + dy * dy + dz * dz * 0.1;
        const dist = Math.sqrt(distSq) || 1;
        const minDist = 50;

        if (dist < physics.repelForce) {
          const force = physics.repelForce / (distSq + minDist);

          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          const fz = (dz / dist) * force * 0.3; // Less Z force

          nodeA.vx -= fx;
          nodeA.vy -= fy;
          nodeA.vz -= fz;

          nodeB.vx += fx;
          nodeB.vy += fy;
          nodeB.vz += fz;
        }
      }
    }
  }, [physics.repelForce]);

  // Apply link force - pull connected nodes together
  const applyLinkForce = useCallback(() => {
    const nodeMap = getNodeMap();

    links.forEach(link => {
      const source = nodeMap.get(link.source);
      const target = nodeMap.get(link.target);

      if (!source || !target) return;

      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      const targetDist = 120; // Desired distance between linked nodes
      const diff = dist - targetDist;
      const strength = link.strength ?? physics.linkForce;

      const fx = (dx / dist) * diff * strength * 0.5;
      const fy = (dy / dist) * diff * strength * 0.5;

      source.vx += fx;
      source.vy += fy;

      target.vx -= fx;
      target.vy -= fy;
    });
  }, [links, physics.linkForce, getNodeMap]);

  // Apply floating animation
  const applyFloating = useCallback((node: PhysicsNode, time: number) => {
    // Organic floating using sine waves with unique phases
    const floatX = Math.sin(time * physics.floatSpeed + node.floatPhase) * physics.floatAmplitude;
    const floatY = Math.cos(time * physics.floatSpeed * 0.7 + node.floatPhase * 1.3) * physics.floatAmplitude;
    const floatZ = Math.sin(time * physics.floatSpeed * 0.5 + node.floatPhase * 0.7) * physics.zDrift;

    node.vx += floatX * 0.1;
    node.vy += floatY * 0.1;
    node.vz += floatZ * 0.1;
  }, [physics.floatSpeed, physics.floatAmplitude, physics.zDrift]);

  // Update positions and apply damping
  const updatePositions = useCallback(() => {
    const padding = 50;

    nodesRef.current.forEach(node => {
      // Apply velocity
      node.x += node.vx;
      node.y += node.vy;
      node.z += node.vz;

      // Apply damping
      node.vx *= physics.velocityDecay;
      node.vy *= physics.velocityDecay;
      node.vz *= physics.velocityDecay;

      // Constrain to bounds
      node.x = Math.max(padding, Math.min(width - padding, node.x));
      node.y = Math.max(padding, Math.min(height - padding, node.y));
      node.z = Math.max(physics.minZ, Math.min(physics.maxZ, node.z));
    });
  }, [width, height, physics.velocityDecay, physics.minZ, physics.maxZ]);

  // Main simulation loop
  const simulate = useCallback((time: number) => {
    if (!isRunningRef.current) return;

    // Apply forces
    nodesRef.current.forEach(node => applyCenterForce(node));
    applyRepulsion();
    applyLinkForce();
    nodesRef.current.forEach(node => applyFloating(node, time));

    // Update positions
    updatePositions();

    // Notify parent
    onUpdate([...nodesRef.current]);

    // Continue loop
    animationRef.current = requestAnimationFrame(simulate);
  }, [applyCenterForce, applyRepulsion, applyLinkForce, applyFloating, updatePositions, onUpdate]);

  // Start simulation
  const start = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    animationRef.current = requestAnimationFrame(simulate);
  }, [simulate]);

  // Stop simulation
  const stop = useCallback(() => {
    isRunningRef.current = false;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  // Apply external force (for dragging)
  const applyForce = useCallback((nodeId: string, fx: number, fy: number) => {
    const node = nodesRef.current.find(n => n.id === nodeId);
    if (node) {
      node.vx += fx;
      node.vy += fy;
    }
  }, []);

  // Set node position directly (for dragging)
  const setNodePosition = useCallback((nodeId: string, x: number, y: number) => {
    const node = nodesRef.current.find(n => n.id === nodeId);
    if (node) {
      node.x = x;
      node.y = y;
      node.vx = 0;
      node.vy = 0;
    }
  }, []);

  // Initialize on mount or when nodes change
  useEffect(() => {
    initializeNodes();
    start();
    return stop;
  }, [nodes.length]); // Only reinit when node count changes

  // Handle resize
  useEffect(() => {
    // Don't reinitialize, just update bounds in next frame
  }, [width, height]);

  return {
    nodes: nodesRef.current,
    start,
    stop,
    applyForce,
    setNodePosition,
  };
}

export default useGraphPhysics;
