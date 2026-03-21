import { Home, BarChart3, BookOpen, FolderOpen, ClipboardCheck } from 'lucide-react';
import { ROUTES } from '../router/paths';

/**
 * Shared navigation items used by both DesktopSidebar and BottomTabBar.
 * Single source of truth for nav structure.
 */
export const NAV_ITEMS = [
  { id: 'inicio', path: ROUTES.HOME, icon: Home, label: 'Inicio' },
  { id: 'actividad', path: ROUTES.ACTIVIDAD, icon: BarChart3, label: 'Actividad' },
  { id: 'temas', path: ROUTES.TEMAS, icon: BookOpen, label: 'Temas' },
  { id: 'recursos', path: ROUTES.RECURSOS, icon: FolderOpen, label: 'Recursos' },
];

/** Reviewer-only nav item */
export const REVIEWER_NAV_ITEM = {
  id: 'reviewer-panel',
  path: ROUTES.REVIEWER,
  icon: ClipboardCheck,
  label: 'Revisar',
};

/** Map route paths to tab IDs */
export const ROUTE_TO_TAB = Object.fromEntries(
  NAV_ITEMS.map(item => [item.path, item.id])
);

/** Map tab IDs to route paths (includes reviewer) */
export const TAB_TO_ROUTE = Object.fromEntries(
  [...NAV_ITEMS, REVIEWER_NAV_ITEM].map(item => [item.id, item.path])
);

/** Tab display titles */
export const TAB_TITLES = {
  inicio: 'Oposita Smart',
  temas: 'Temas',
  actividad: 'Actividad',
  recursos: 'Recursos',
};
