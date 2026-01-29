import { RoadmapTask, GraphData, GraphNode, GraphLink } from './types';

/**
 * Sample roadmap data representing the OpositaSmart project phases
 */
export const roadmapTasks: RoadmapTask[] = [
  // Root node
  {
    id: 'project-start',
    title: 'Project Start',
    description: 'OpositaSmart MVP kickoff',
    status: 'completed',
    phase: 'Phase 0',
    priority: 1,
  },

  // Phase 1: Auth (completed)
  {
    id: 'auth-setup',
    title: 'Auth Setup',
    description: 'Configure Supabase authentication',
    status: 'completed',
    phase: 'Phase 1: Auth',
    dependencies: ['project-start'],
    priority: 1,
  },
  {
    id: 'login-form',
    title: 'Login Form',
    description: 'User login with email/password',
    status: 'completed',
    phase: 'Phase 1: Auth',
    dependencies: ['auth-setup'],
    priority: 1,
  },
  {
    id: 'signup-form',
    title: 'Sign Up Form',
    description: 'New user registration',
    status: 'completed',
    phase: 'Phase 1: Auth',
    dependencies: ['auth-setup'],
    priority: 1,
  },
  {
    id: 'password-recovery',
    title: 'Password Recovery',
    description: 'Forgot password flow',
    status: 'completed',
    phase: 'Phase 1: Auth',
    dependencies: ['login-form'],
    priority: 2,
  },
  {
    id: 'auth-context',
    title: 'Auth Context',
    description: 'React context for auth state',
    status: 'completed',
    phase: 'Phase 1: Auth',
    dependencies: ['login-form', 'signup-form'],
    priority: 1,
  },

  // Phase 2: Onboarding (completed)
  {
    id: 'onboarding-flow',
    title: 'Onboarding Flow',
    description: 'New user onboarding screens',
    status: 'completed',
    phase: 'Phase 2: Onboarding',
    dependencies: ['auth-context'],
    priority: 1,
  },
  {
    id: 'oposicion-selection',
    title: 'Oposicion Selection',
    description: 'Choose exam type (AGE)',
    status: 'completed',
    phase: 'Phase 2: Onboarding',
    dependencies: ['onboarding-flow'],
    priority: 1,
  },
  {
    id: 'study-time-config',
    title: 'Study Time Config',
    description: 'Set daily study preferences',
    status: 'completed',
    phase: 'Phase 2: Onboarding',
    dependencies: ['onboarding-flow'],
    priority: 1,
  },
  {
    id: 'exam-date-setup',
    title: 'Exam Date Setup',
    description: 'Configure target exam date',
    status: 'completed',
    phase: 'Phase 2: Onboarding',
    dependencies: ['oposicion-selection'],
    priority: 2,
  },

  // Phase 3: Study System (in_progress)
  {
    id: 'study-dashboard',
    title: 'Study Dashboard',
    description: 'Main study interface',
    status: 'completed',
    phase: 'Phase 3: Study System',
    dependencies: ['onboarding-flow'],
    priority: 1,
  },
  {
    id: 'hybrid-session',
    title: 'Hybrid Session',
    description: 'Combined study + review sessions',
    status: 'in_progress',
    phase: 'Phase 3: Study System',
    dependencies: ['study-dashboard'],
    priority: 1,
  },
  {
    id: 'fsrs-algorithm',
    title: 'FSRS Algorithm',
    description: 'Spaced repetition implementation',
    status: 'completed',
    phase: 'Phase 3: Study System',
    dependencies: ['study-dashboard'],
    priority: 1,
  },
  {
    id: 'review-container',
    title: 'Review Container',
    description: 'Question review interface',
    status: 'in_progress',
    phase: 'Phase 3: Study System',
    dependencies: ['fsrs-algorithm'],
    priority: 1,
  },
  {
    id: 'topic-selection',
    title: 'Topic Selection',
    description: 'Choose topics to study',
    status: 'completed',
    phase: 'Phase 3: Study System',
    dependencies: ['study-dashboard'],
    priority: 2,
  },

  // Phase 4: Questions Bank (in_progress)
  {
    id: 'questions-schema',
    title: 'Questions Schema',
    description: 'Database schema for questions',
    status: 'completed',
    phase: 'Phase 4: Questions Bank',
    dependencies: ['project-start'],
    priority: 1,
  },
  {
    id: 'question-importer',
    title: 'Question Importer',
    description: 'Bulk import questions from JSON',
    status: 'completed',
    phase: 'Phase 4: Questions Bank',
    dependencies: ['questions-schema'],
    priority: 1,
  },
  {
    id: 'question-reviewer',
    title: 'Question Reviewer',
    description: 'AI-assisted quality review',
    status: 'in_progress',
    phase: 'Phase 4: Questions Bank',
    dependencies: ['question-importer'],
    priority: 1,
  },
  {
    id: 'question-editor',
    title: 'Question Editor',
    description: 'Manual question editing UI',
    status: 'pending',
    phase: 'Phase 4: Questions Bank',
    dependencies: ['question-reviewer'],
    priority: 2,
  },
  {
    id: 'question-exporter',
    title: 'Question Exporter',
    description: 'Export questions to JSON',
    status: 'completed',
    phase: 'Phase 4: Questions Bank',
    dependencies: ['questions-schema'],
    priority: 3,
  },

  // Phase 5: Progress/Stats (pending)
  {
    id: 'progress-tracking',
    title: 'Progress Tracking',
    description: 'Track user study progress',
    status: 'pending',
    phase: 'Phase 5: Progress/Stats',
    dependencies: ['review-container'],
    priority: 1,
  },
  {
    id: 'fortaleza-system',
    title: 'Fortaleza System',
    description: 'Visual progress representation',
    status: 'in_progress',
    phase: 'Phase 5: Progress/Stats',
    dependencies: ['progress-tracking'],
    priority: 1,
  },
  {
    id: 'activity-calendar',
    title: 'Activity Calendar',
    description: 'GitHub-style activity heatmap',
    status: 'pending',
    phase: 'Phase 5: Progress/Stats',
    dependencies: ['progress-tracking'],
    priority: 2,
  },
  {
    id: 'streak-system',
    title: 'Streak System',
    description: 'Daily study streak tracking',
    status: 'pending',
    phase: 'Phase 5: Progress/Stats',
    dependencies: ['progress-tracking'],
    priority: 2,
  },
  {
    id: 'insights-dashboard',
    title: 'Insights Dashboard',
    description: 'Analytics and recommendations',
    status: 'pending',
    phase: 'Phase 5: Progress/Stats',
    dependencies: ['fortaleza-system', 'activity-calendar'],
    priority: 3,
  },

  // Phase 6: Admin (completed)
  {
    id: 'admin-panel',
    title: 'Admin Panel',
    description: 'Administration interface',
    status: 'completed',
    phase: 'Phase 6: Admin',
    dependencies: ['auth-context'],
    priority: 1,
  },
  {
    id: 'admin-auth',
    title: 'Admin Auth',
    description: 'Admin login modal',
    status: 'completed',
    phase: 'Phase 6: Admin',
    dependencies: ['admin-panel'],
    priority: 1,
  },
  {
    id: 'questions-tab',
    title: 'Questions Tab',
    description: 'Manage questions in admin',
    status: 'completed',
    phase: 'Phase 6: Admin',
    dependencies: ['admin-panel', 'questions-schema'],
    priority: 1,
  },
  {
    id: 'temas-tab',
    title: 'Temas Tab',
    description: 'Manage topics in admin',
    status: 'completed',
    phase: 'Phase 6: Admin',
    dependencies: ['admin-panel'],
    priority: 2,
  },

  // Phase 7: Premium features (pending)
  {
    id: 'premium-model',
    title: 'Premium Model',
    description: 'Define freemium tiers',
    status: 'pending',
    phase: 'Phase 7: Premium',
    dependencies: ['insights-dashboard'],
    priority: 1,
  },
  {
    id: 'payment-integration',
    title: 'Payment Integration',
    description: 'Stripe integration',
    status: 'blocked',
    phase: 'Phase 7: Premium',
    dependencies: ['premium-model'],
    priority: 1,
  },
  {
    id: 'premium-features',
    title: 'Premium Features',
    description: 'Unlock advanced features',
    status: 'pending',
    phase: 'Phase 7: Premium',
    dependencies: ['payment-integration'],
    priority: 2,
  },
  {
    id: 'subscription-management',
    title: 'Subscription Management',
    description: 'Manage user subscriptions',
    status: 'pending',
    phase: 'Phase 7: Premium',
    dependencies: ['payment-integration'],
    priority: 2,
  },
];

/**
 * Convert RoadmapTask array to GraphData format for react-force-graph
 */
export function tasksToGraphData(tasks: RoadmapTask[]): GraphData {
  const nodes: GraphNode[] = tasks.map(task => ({
    id: task.id,
    name: task.title,
    status: task.status,
    phase: task.phase,
    val: task.priority || 1,
    description: task.description,
    __task: task,
  }));

  const links: GraphLink[] = [];
  tasks.forEach(task => {
    (task.dependencies || []).forEach(depId => {
      // Only add link if dependency exists in tasks
      if (tasks.some(t => t.id === depId)) {
        links.push({
          source: depId,
          target: task.id,
          type: 'dependency',
        });
      }
    });
  });

  return { nodes, links };
}

/**
 * Get default graph data from sample tasks
 */
export function getDefaultGraphData(): GraphData {
  return tasksToGraphData(roadmapTasks);
}
