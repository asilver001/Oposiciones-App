/**
 * Lightweight Error Tracking
 *
 * Captures unhandled errors and promise rejections,
 * logs them to console and optionally to Supabase error_logs table.
 */

import { supabase } from './supabase';

const MAX_QUEUE_SIZE = 20;
const FLUSH_INTERVAL_MS = 30_000; // 30 seconds

let errorQueue = [];
let flushTimer = null;
let initialized = false;

/**
 * Flush queued errors to Supabase error_logs table
 */
async function flushErrors() {
  if (errorQueue.length === 0) return;

  const batch = errorQueue.splice(0, MAX_QUEUE_SIZE);

  try {
    const { error } = await supabase
      .from('error_logs')
      .insert(batch);

    if (error) {
      // If table doesn't exist or insert fails, just log to console
      console.warn('[ErrorTracking] Failed to persist errors:', error.message);
    }
  } catch {
    // Silently fail - don't let error tracking break the app
  }
}

/**
 * Queue an error for persistence
 */
function queueError(entry) {
  errorQueue.push(entry);

  // Flush immediately if queue is full
  if (errorQueue.length >= MAX_QUEUE_SIZE) {
    flushErrors();
  }
}

/**
 * Build an error entry object
 */
function buildEntry(level, message, extra = {}) {
  return {
    level,
    message: String(message).slice(0, 2000),
    stack: extra.stack ? String(extra.stack).slice(0, 4000) : null,
    context: extra.context ? JSON.stringify(extra.context).slice(0, 2000) : null,
    url: window.location.href,
    user_agent: navigator.userAgent,
    created_at: new Date().toISOString(),
  };
}

/**
 * Capture an error
 * @param {Error|string} error - The error to capture
 * @param {Object} [context] - Additional context
 */
export function captureError(error, context) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error('[ErrorTracking]', message, context || '');

  queueError(buildEntry('error', message, { stack, context }));
}

/**
 * Capture a warning message
 * @param {string} message - The message to capture
 * @param {Object} [context] - Additional context
 */
export function captureMessage(message, context) {
  console.warn('[ErrorTracking]', message, context || '');

  queueError(buildEntry('warning', message, { context }));
}

/**
 * Initialize global error handlers
 * Call once at app startup (main.jsx)
 */
export function initErrorTracking() {
  if (initialized) return;
  initialized = true;

  // Global unhandled errors
  window.addEventListener('error', (event) => {
    captureError(event.error || event.message, {
      source: event.filename,
      line: event.lineno,
      col: event.colno,
    });
  });

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    captureError(
      reason instanceof Error ? reason : String(reason || 'Unhandled rejection'),
      { type: 'unhandledrejection' }
    );
  });

  // Periodic flush
  flushTimer = setInterval(flushErrors, FLUSH_INTERVAL_MS);

  // Flush on page unload
  window.addEventListener('beforeunload', () => {
    if (flushTimer) clearInterval(flushTimer);
    flushErrors();
  });
}
